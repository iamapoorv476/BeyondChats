<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::with(['originalArticle', 'updatedVersions']);

        // Filter by updated status
        if ($request->has('is_updated')) {
            $query->where('is_updated', $request->boolean('is_updated'));
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $articles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($articles);
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'published_date' => 'nullable|date',
            'source_url' => 'required|url',
            'is_updated' => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
            'references' => 'nullable|array',
        ]);

        $article = Article::create($validated);

        return response()->json([
            'message' => 'Article created successfully',
            'article' => $article->load(['originalArticle', 'updatedVersions'])
        ], 201);
    }

    /**
     * Display the specified article
     */
    public function show(Article $article): JsonResponse
    {
        return response()->json(
            $article->load(['originalArticle', 'updatedVersions'])
        );
    }

    /**
     * Update the specified article
     */
    public function update(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'author' => 'nullable|string|max:255',
            'published_date' => 'nullable|date',
            'source_url' => 'sometimes|url',
            'is_updated' => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
            'references' => 'nullable|array',
        ]);

        $article->update($validated);

        return response()->json([
            'message' => 'Article updated successfully',
            'article' => $article->load(['originalArticle', 'updatedVersions'])
        ]);
    }

    /**
     * Remove the specified article
     */
    public function destroy(Article $article): JsonResponse
    {
        $article->delete();

        return response()->json([
            'message' => 'Article deleted successfully'
        ]);
    }

    /**
     * Get the latest article
     */
    public function latest(): JsonResponse
    {
        $article = Article::where('is_updated', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$article) {
            return response()->json([
                'message' => 'No articles found'
            ], 404);
        }

        return response()->json($article);
    }
}