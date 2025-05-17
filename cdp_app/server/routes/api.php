<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\TeacherDashboardController;
use App\Http\Controllers\Api\StudentDashboardController;

// Handle CORS preflight
Route::options('/{any}', fn() => response()->json(null, 200))->where('any', '.*');

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/refresh', [AuthController::class, 'refresh']);

// Protected Routes
Route::middleware('auth:api')->group(function () {
    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboards by Role
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->middleware('role:admin');
    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index'])->middleware('role:teacher');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->middleware('role:student');

    // ADMIN-ONLY Routes
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('classrooms', ClassroomController::class);
        Route::apiResource('subjects', SubjectController::class);

        // Schedule Management
        Route::prefix('schedules')->group(function () {
            Route::get('/', [ScheduleController::class, 'index']);
            Route::post('/', [ScheduleController::class, 'store']);
            Route::put('/{id}', [ScheduleController::class, 'update']);
            Route::delete('/{id}', [ScheduleController::class, 'destroy']);
            Route::get('/today', [ScheduleController::class, 'today']);
            Route::get('/week', [ScheduleController::class, 'week']);
            Route::get('/month', [ScheduleController::class, 'month']);
            Route::get('/upcoming', [ScheduleController::class, 'upcomingWeek']);
            Route::get('/period', [ScheduleController::class, 'byPeriod']);
            Route::get('/classroom/{id}', [ScheduleController::class, 'getByClassroom']);
            Route::get('/teacher/{id}', [ScheduleController::class, 'getByTeacher']);
        });

        // Attendance Management
        Route::prefix('attendance')->group(function () {
            Route::post('/mark', [AttendanceController::class, 'mark']);
            Route::get('/today', [AttendanceController::class, 'today']);
            Route::post('/', [AttendanceController::class, 'store']);
            Route::put('/{attendance}', [AttendanceController::class, 'update']);
            Route::get('/history/{id}', [AttendanceController::class, 'history']);
        });

        // Payments Management
        Route::prefix('payments')->group(function () {
            Route::post('/', [PaymentController::class, 'store']);
            Route::get('/user/{id}', [PaymentController::class, 'history']);
            Route::put('/{id}', [PaymentController::class, 'update']);
            Route::delete('/{id}', [PaymentController::class, 'destroy']);
            Route::get('/teacher/summary', [PaymentController::class, 'teacherSummary']);
            Route::post('/teacher/{id}/mark-paid', [PaymentController::class, 'markTeacherPaid']);
        });
    });
});
