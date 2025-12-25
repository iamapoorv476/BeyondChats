
require('dotenv').config();

const { fetchLatestArticle, createArticle } = require('./utils/laravelApi');
const { searchGoogle } = require('./utils/googleSearch');
const { scrapeMultipleArticles } = require('./utils/scraper');
const { enhanceArticle } = require('./utils/llmService');


async function enhanceLatestArticle() {
    console.log('='.repeat(60));
    console.log('Starting Article Enhancement Workflow');
    console.log('='.repeat(60));
    
    try {
    
        console.log('\n[Step 1/5] Fetching latest article from database...');
        const originalArticle = await fetchLatestArticle();
        
        console.log(`✓ Article: "${originalArticle.title}"`);
        console.log(`  Content length: ${originalArticle.content.length} characters`);
        console.log('\n[Step 2/5] Searching Google for similar articles...');
        const searchResults = await searchGoogle(originalArticle.title);
        
        if (!searchResults || searchResults.length === 0) {
            console.log('✗ No search results found. Aborting...');
            return;
        }

        console.log(`✓ Found ${searchResults.length} search results`);
        console.log('\n[Step 3/5] Scraping reference articles...');
        const referenceArticles = await scrapeMultipleArticles(searchResults);
        
        if (referenceArticles.length === 0) {
            console.log('✗ Failed to scrape any reference articles. Aborting...');
            return;
        }

        console.log(`✓ Successfully scraped ${referenceArticles.length} articles`);
        console.log('\n[Step 4/5] Enhancing article with Claude AI...');
        console.log('  This may take 30-60 seconds...');
        
        const enhancedData = await enhanceArticle(originalArticle, referenceArticles);
        
        console.log('✓ Article enhanced successfully');
        console.log(`  New title: "${enhancedData.title}"`);
        console.log(`  Content length: ${enhancedData.content.length} characters`);
       
        console.log('\n[Step 5/5] Publishing enhanced article...');
    
        let finalContent = enhancedData.content;
        
        if (enhancedData.references && enhancedData.references.length > 0) {
            finalContent += '\n\n---\n\n## References\n\n';
            finalContent += 'This article was enhanced based on insights from the following sources:\n\n';
            
            enhancedData.references.forEach((ref, index) => {
                finalContent += `${index + 1}. [${ref.title}](${ref.url})\n`;
            });
        }

        const articleData = {
            title: enhancedData.title,
            content: finalContent,
            author: originalArticle.author || 'AI Enhanced',
            published_date: new Date().toISOString().split('T')[0],
            source_url: originalArticle.source_url,
            is_updated: true,
            original_article_id: originalArticle.id,
            references: enhancedData.references.map(ref => ref.url)
        };

        const publishedArticle = await createArticle(articleData);
        
        console.log('✓ Article published successfully');
        console.log(`  Article ID: ${publishedArticle.id}`);
        console.log('\n' + '='.repeat(60));
        console.log(' Workflow Completed Successfully!');
        console.log('='.repeat(60));
        console.log('\nSummary:');
        console.log(`  Original: ${originalArticle.title}`);
        console.log(`  Enhanced: ${enhancedData.title}`);
        console.log(`  References: ${enhancedData.references.length}`);
        console.log(`  Published ID: ${publishedArticle.id}`);

        return publishedArticle;

    } catch (error) {
        console.error('\n✗ Workflow failed:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

if (require.main === module) {
    enhanceLatestArticle()
        .then(() => {
            console.log('\n All done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n Fatal error:', error);
            process.exit(1);
        });
}

module.exports = {
    enhanceLatestArticle
};