<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author',
        'published_date',
        'source_url',
        'is_updated',
        'original_article_id',
        'references',
    ];

    protected $casts = [
        'references' => 'array',
        'is_updated' => 'boolean',
        'published_date' => 'date',
    ];

    // Relationship: Original article
    public function originalArticle()
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    // Relationship: Updated versions
    public function updatedVersions()
    {
        return $this->hasMany(Article::class, 'original_article_id');
    }
}