<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'role'    => 'student',
            'message' => 'Welcome to the Student Dashboard',
            'user'    => $request->user(),
        ], 200);
    }
}
