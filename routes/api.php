<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Models\Article;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function() {
    return response()->json([
        'status' => 'API is working!',
        'articles_count' => Article::count(),
        'timestamp' => now()
    ]);
});

Route::get('/articles/latest/fetch', [ArticleController::class, 'latest']);

Route::apiResource('articles', ArticleController::class);