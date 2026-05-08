<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClinicController;
use App\Http\Controllers\Api\AIProxyController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('patients', ClinicController::class)->parameters(['patients' => 'module']);
    Route::get('/dashboard/statistics', [ClinicController::class, 'statistics']);
    Route::post('/ai/chat', [AIProxyController::class, 'chat']);
    Route::post('/ai/symptoms', [AIProxyController::class, 'symptoms']);
});
