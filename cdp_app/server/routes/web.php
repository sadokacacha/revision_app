<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Authentication Routes
Route::post('/login', [AuthController::class, 'login'])
    ->middleware(['web'])
    ->name('login');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware(['web', 'auth:sanctum'])
    ->name('logout');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware(['web', 'auth:sanctum']);

// Catch-all route for SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
