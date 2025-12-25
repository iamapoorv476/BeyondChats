const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrapeArticleCheerio(url){
    try {
        const response = await axios.get(url ,{
            headers: {
                 'User-Agent': process.env.USER_AGENT
            },
            timeout: parseInt(process.env.TIMEOUT) || 30000
        })

        const $ = cheerio. load(response.data);

        $('script, style, nav, header, footer, aside, .advertisement, .ads'). remove();

        const selectors =[
            'article',
            '[role="article"]',
            '.article-content',
            '.post-content',
            '.entry-content',
            '.content',
            'main',
            '#content'

        ];

        let content = '';
        let title = '';

        title = $('h1').first().text().trim() ||
                $('meta[property="og:title"]').attr('content') ||
                $('title').text().trim();
        
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length) {
                content = element.text().trim();
                if (content.length > 200) {
                    break;
                }
            }
        }
         if (!content || content.length < 200) {
            content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
        }
         content = content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        return {
            url,
            title,
            content: content.substring(0, 10000), 
            method: 'cheerio'
        };

    } catch (error) {
        console.error(`Cheerio scraping failed for ${url}:`, error.message);
        throw error;
    }

 }

 async function scrapeArticlePuppeteer(url) {
    let browser;
    
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent(process.env.USER_AGENT);

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: parseInt(process.env.TIMEOUT) || 30000
        });
        const data = await page.evaluate(() => {
            const unwanted = document.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .ads');
            unwanted.forEach(el => el.remove());
            const title = document.querySelector('h1')?.textContent?.trim() ||
                         document.querySelector('meta[property="og:title"]')?.content ||
                         document.title;
            const selectors = [
                'article',
                '[role="article"]',
                '.article-content',
                '.post-content',
                '.entry-content',
                '.content',
                'main'
            ];

            let content = '';
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim().length > 200) {
                    content = element.textContent.trim();
                    break;
                }
            }

            if (!content || content.length < 200) {
                const paragraphs = Array.from(document.querySelectorAll('p'));
                content = paragraphs.map(p => p.textContent.trim()).join('\n\n');
            }

            return { title, content };
        });

        await browser.close();

        // Clean up content
        const cleanContent = data.content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim()
            .substring(0, 10000);

        return {
            url,
            title: data.title,
            content: cleanContent,
            method: 'puppeteer'
        };

    } catch (error) {
        if (browser) {
            await browser.close();
        }
        console.error(`Puppeteer scraping failed for ${url}:`, error.message);
        throw error;
    }
}

async function scrapeArticle(url){
    console.log(`Scraping: ${url}`);

    try{
        return await scrapeArticleCheerio(url);
    }
    catch(error){
        console.log('Cheerio failed, trying Puppeteer...');

        try{
            return await scrapeArticlePuppeteer(url);
        } catch(puppeteerError){
            console.error('Both scraping methods failed');
            throw puppeteerError;
        }
    }

}

async function scrapeMultipleArticles(searchResults){
    const scrapedArticles = [];

    for(const result of searchResults){
        try {
            const scraped = await scrapeArticle(result.url);
            scrapedArticles.push({
                ...scraped,
                originalTitle: result.title,
                snippet: result.snippet
            })

            await new Promise(resolve => setTimeout(resolve,2000));

        } catch(error) {
            console.log(`Failed to scrape ${result.url}`);
        }
    }
    return scrapedArticles;
}

module.exports = {
    scrapeArticle,
    scrapeArticleCheerio,
    scrapeArticlePuppeteer,
    scrapeMultipleArticles
};
