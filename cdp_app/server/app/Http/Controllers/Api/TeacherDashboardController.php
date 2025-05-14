<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TeacherDashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'role'    => 'teacher',
            'message' => 'Welcome to the Teacher Dashboard',
            'user'    => $request->user(),
        ], 200);
    }
}
