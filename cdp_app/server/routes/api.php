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
use App\Http\Controllers\Api\StudentPaymentController;
use App\Http\Controllers\Api\TeacherPaymentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\TeacherDashboardController;
use App\Http\Controllers\Api\StudentDashboardController;

// Public
Route::post('/login', [AuthController::class, 'login']);

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $r) => $r->user());

    // Dashboards
    Route::get('/admin/dashboard',   [AdminDashboardController::class,   'index'])->middleware('role:admin');
    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index'])->middleware('role:teacher');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->middleware('role:student');

    // **ADMIN ONLY**
    Route::middleware('role:admin')->group(function () {
        // Users, Teachers, Classrooms, Subjects
        Route::apiResource('users',      UserController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('classrooms', ClassroomController::class);
        Route::apiResource('subjects',   SubjectController::class);

        // **Schedules** (aka Emploi)
        Route::get ( '/emploi/today',     [ScheduleController::class, 'today'] );
        Route::get ( '/emploi/week',      [ScheduleController::class, 'week'] );
        Route::get ( '/emploi/next-week', [ScheduleController::class, 'nextWeek'] );
        Route::get ( '/schedules',            [ScheduleController::class, 'index'] );
        Route::post( '/schedules',            [ScheduleController::class, 'store'] );
        Route::put ( '/schedules/{id}',       [ScheduleController::class, 'update'] );
        Route::delete('/schedules/{id}',      [ScheduleController::class, 'destroy'] );
        Route::post( '/schedules/recurring',  [ScheduleController::class, 'storeRecurring'] );
        Route::put ( '/schedules/recurring',  [ScheduleController::class, 'updateRecurring'] );
        Route::delete('/schedules/recurring', [ScheduleController::class, 'deleteRecurring'] );
        Route::get ( '/schedules/upcoming',   [ScheduleController::class, 'upcomingWeek'] );
        Route::get ( '/schedules/classroom/{id}', [ScheduleController::class, 'getByClassroom'] );
        Route::get ( '/schedules/teacher/{id}',   [ScheduleController::class, 'getByTeacher'] );
        Route::get('/teachers/schedule', [ScheduleController::class, 'byPeriod']);
        Route::get('/schedules/today', [ScheduleController::class, 'today']);
        Route::get('/schedules/week', [ScheduleController::class, 'week']);
        Route::get('/schedules/month', [ScheduleController::class, 'month']);
        Route::post('/attendance/mark', [AttendanceController::class,'mark']);

        // **Attendance**
        Route::get ( '/attendance/today',         [AttendanceController::class, 'today'] );
        Route::post( '/attendance',               [AttendanceController::class, 'store'] );
        Route::put ( '/attendance/{attendance}',  [AttendanceController::class, 'update'] );
        Route::get ( '/attendance/history/{id}',  [AttendanceController::class, 'history'] );

        // **Payments** (unified student & teacher)

Route::post   ('/payments',               [PaymentController::class,'store']);
Route::get    ('/payments/user/{id}',     [PaymentController::class,'history']);
Route::put    ('/payments/{id}',          [PaymentController::class,'update']);
Route::delete ('/payments/{id}',          [PaymentController::class,'destroy']);


Route::get    ('/payments/teacher/summary',[PaymentController::class,'teacherSummary']);
Route::post   ('/payments/teacher/{id}/mark-paid',[PaymentController::class,'markTeacherPaid']);
    });
});
