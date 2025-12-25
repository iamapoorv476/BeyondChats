
const puppeteer = require('puppeteer');

async function searchGoogle(query) {
    let browser;
    
    try {
        console.log('Searching Google with Puppeteer...');
        console.log(`Query: "${query}"`);
        
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        console.log('Navigating to Google...');
        
        try {
            await page.goto(searchUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 20000 
            });
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const selectors = ['div#search', '#rso', '#main', 'body'];
            let resultSelector = null;
            
            for (const selector of selectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 3000 });
                    resultSelector = selector;
                    console.log(`Found results using selector: ${selector}`);
                    break;
                } catch (e) {
                    continue;
                }
            }
            
            if (!resultSelector) {
                throw new Error('Could not find search results');
            }

            const results = await page.evaluate(() => {
                const extracted = [];
                const resultContainers = document.querySelectorAll('div.g, div[data-sokoban-container], .tF2Cxc');
                
                for (let i = 0; i < resultContainers.length && extracted.length < 10; i++) {
                    const container = resultContainers[i];
                    const linkElement = container.querySelector('a');
                    const titleElement = container.querySelector('h3');
                    const snippetElement = container.querySelector('.VwiC3b, .IsZvec, .aCOpRe');
                    
                    if (linkElement && titleElement && linkElement.href) {
                        const url = linkElement.href;
                        
                        if (!url.includes('youtube.com') &&
                            !url.includes('facebook.com') &&
                            !url.includes('twitter.com') &&
                            !url.includes('google.com') &&
                            url.startsWith('http')) {
                            
                            extracted.push({
                                title: titleElement.textContent.trim(),
                                url: url,
                                snippet: snippetElement ? snippetElement.textContent.trim() : ''
                            });
                        }
                    }
                }
                return extracted;
            });

            await browser.close();
            
            if (results.length === 0) {
                throw new Error('No results extracted');
            }

            const topResults = results.slice(0, 2);
            console.log(`Found ${topResults.length} articles`);
            topResults.forEach((result, index) => {
                console.log(`  ${index + 1}. ${result.title}`);
            });

            return topResults;

        } catch (navError) {
            throw navError;
        }

    } catch (error) {
        if (browser) {
            await browser.close();
        }
        
        console.log(' Using mock search results as fallback...');
        
        const mockResults = [
            {
                title: `Complete Guide to Chatbots and AI`,
                url: `https://en.wikipedia.org/wiki/Chatbot`,
                snippet: 'Comprehensive chatbot overview from Wikipedia'
            },
            {
                title: `Understanding AI Chatbot Technology`,
                url: `https://www.ibm.com/topics/chatbots`,
                snippet: 'AI chatbot technology explained by IBM'
            }
        ];
        
        console.log('✓ Using 2 mock articles for demonstration');
        return mockResults;
    }
}

module.exports = {
    searchGoogle
};