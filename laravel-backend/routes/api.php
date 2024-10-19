<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('products', App\Http\Controllers\api\ProductController::class)
    ->parameters(['products' => 'barcode']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [App\Http\Controllers\auth\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\auth\AuthController::class, 'login']);
