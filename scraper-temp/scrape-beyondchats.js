
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeBeyondChatsArticles() {
    try {
        console.log('Fetching BeyondChats blog page...');
        
        
        const response = await axios.get('https://beyondchats.com/blogs/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const articles = [];

        
        $('.blog-post, .article-item, article').each((index, element) => {
            if (articles.length >= 5) return false; 

            const $element = $(element);
            
            const article = {
                title: $element.find('h2, h3, .title, .article-title').first().text().trim(),
                content: $element.find('.content, .excerpt, p').text().trim(),
                author: $element.find('.author, .by-line').text().trim() || null,
                published_date: $element.find('.date, time').text().trim() || null,
                source_url: $element.find('a').first().attr('href') || '',
            };

            
            if (article.source_url && !article.source_url.startsWith('http')) {
                article.source_url = 'https://beyondchats.com' + article.source_url;
            }

            if (article.title) {
                articles.push(article);
            }
        });

        if (articles.length === 0) {
            console.log('Trying alternative method...');
            const articleLinks = [];
            
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.includes('/blog/') || href.includes('/article/')) {
                    const fullUrl = href.startsWith('http') ? href : 'https://beyondchats.com' + href;
                    if (!articleLinks.includes(fullUrl)) {
                        articleLinks.push(fullUrl);
                    }
                }
            });

            const lastFive = articleLinks.slice(-5);
            
            for (const url of lastFive) {
                try {
                    const articlePage = await axios.get(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    const $page = cheerio.load(articlePage.data);
                    
                    const article = {
                        title: $page('h1, .article-title').first().text().trim(),
                        content: $page('article, .article-content, .post-content').text().trim(),
                        author: $page('.author, .by-line').text().trim() || null,
                        published_date: $page('time, .date').attr('datetime') || $page('time, .date').text().trim() || null,
                        source_url: url,
                    };

                    if (article.title && article.content) {
                        articles.push(article);
                    }
                } catch (error) {
                    console.log(`Failed to fetch ${url}:`, error.message);
                }
            }
        }

        fs.writeFileSync('scraped_articles.json', JSON.stringify(articles, null, 2));
        
        console.log(`\nSuccessfully scraped ${articles.length} articles`);
        console.log('Saved to scraped_articles.json');
        
        return articles;

    } catch (error) {
        console.error('Error scraping articles:', error.message);
        throw error;
    }
}

scrapeBeyondChatsArticles()
    .then(articles => {
        console.log('\nArticles scraped:');
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title}`);
        });
    })
    .catch(error => {
        console.error('Scraping failed:', error);
    });

module.exports = { scrapeBeyondChatsArticles };