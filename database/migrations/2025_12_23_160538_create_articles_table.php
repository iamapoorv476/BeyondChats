<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->string('author')->nullable();
            $table->date('published_date')->nullable();
            $table->string('source_url');
            $table->boolean('is_updated')->default(false);
            $table->foreignId('original_article_id')->nullable()->constrained('articles')->onDelete('cascade');
            $table->json('references')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
