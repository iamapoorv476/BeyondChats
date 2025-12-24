<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Illuminate\Support\Facades\File;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = base_path('scraped_articles.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error('scraped_articles.json not found!');
            return;
        }

        $articles = json_decode(File::get($jsonPath), true);

        foreach ($articles as $articleData) {
            Article::create([
                'title' => $articleData['title'],
                'content' => $articleData['content'],
                'author' => $articleData['author'] ?? null,
                'published_date' => $articleData['published_date'] ?? null,
                'source_url' => $articleData['source_url'],
                'is_updated' => false,
            ]);
        }

        $this->command->info('Articles imported successfully!');
    }
}