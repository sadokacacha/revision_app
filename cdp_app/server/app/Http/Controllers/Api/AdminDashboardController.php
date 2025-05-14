<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'role'    => 'admin',
            'message' => 'Welcome to the Admin Dashboard',
            'user'    => $request->user(),
        ], 200);
    }
}
