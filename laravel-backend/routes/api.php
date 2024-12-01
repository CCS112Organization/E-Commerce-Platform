<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('products', App\Http\Controllers\api\ProductController::class)
        ->parameters(['products' => 'barcode']);
});

Route::middleware(['auth:sanctum', 'user'])->group(function () {
    Route::apiResource('carts', App\Http\Controllers\api\CartController::class);
    Route::delete('/carts/clear', [App\Http\Controllers\api\CartController::class, 'deleteAllItems']);
});

Route::post('/register', [App\Http\Controllers\auth\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\auth\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [App\Http\Controllers\auth\AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});
