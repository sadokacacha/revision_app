<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $token = Auth::attempt($credentials);
        
        if (!$token) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        
        // Get the user's role - first try roles table, then fall back to direct column
        $role = null;
        
        // Check if user has roles in the model_has_roles table
        $roleRecord = DB::table('model_has_roles')
            ->where('model_id', $user->id)
            ->where('model_type', 'App\\Models\\User')
            ->first();
            
        if ($roleRecord) {
            $roleName = DB::table('roles')
                ->where('id', $roleRecord->role_id)
                ->value('name');
            
            if ($roleName) {
                $role = $roleName;
            }
        }
        
        // If no role found yet, use the column
        if (!$role) {
            $role = $user->role ?: 'student';
        }
        
        // Log for debugging
        Log::info('User login role detection', [
            'id' => $user->id,
            'email' => $user->email,
            'direct_role' => $user->role,
            'role_from_tables' => $role,
            'final_role' => $role
        ]);
        
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $role 
        ];
        
        return response()->json([
            'user' => $userData,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'user' => Auth::user(),
            'authorization' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }
}
