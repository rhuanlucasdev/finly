<?php

use App\Presentation\Http\Controllers\AuthController;
use App\Presentation\Http\Controllers\TransactionController;
use App\Presentation\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('transactions', TransactionController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);
    Route::get('dashboard', [DashboardController::class, 'index']);
});
