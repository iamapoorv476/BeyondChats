const axios = require('axios');
const puppeteer = require('puppeteer');

async function searchGoogleAPI(query){
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const cseId = process.env.GOOGLE_CSE_ID;
        if(!apiKey || !cseId){
            throw new Error('Google API key not found');
        }

        const url = 'https://www.googleapis.com/customsearch/v1';
        const response = await axios.get(url ,{
            params: {
                key: apiKey,
                cx: cseId,
                q: query,
                num: 10
            } 

        })
        const results = response.data.items || [];
        const filteredResults  = results
                .filter(item =>{
                    const url = item.link.toLowerCase();

                    return !url.includes('youtube.com') &&
                    !url.includes('facebook.com') &&
                       !url.includes('twitter.com') &&
                       !url.includes('instagram.com') &&
                       !url.includes('linkedin.com/posts');
                })
                .slice(0,2)
                .map(item => ({
                    title : item.title,
                    url : item.link,
                    snippet : item.snippet

                }));

            return filteredResults;
    }
    catch (error){
        console.error('Google API search error:', error.message);
        throw error;
    }
}

async function searchGooglePuppeteer(query){
    let browser;

    try {
        console.log('Using Puppeteer to search Google...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent(process.env.USER_AGENT);

        const searchUrl = 'https://www.google.com/search?q=${encodeURIComponent(query)}';
        await page.goto(searchUrl, {waitUntil: 'networkidle2'});

         await page.waitForSelector('div#search', { timeout: 10000 });

         const results = await page.evaluate(() => {
            const resultElements = document.querySelectorAll('div.g');
            const extracted = [];

            for (let i = 0; i < Math.min(resultElements.length, 10); i++) {
                const element = resultElements[i];
                
                const titleElement = element.querySelector('h3');
                const linkElement = element.querySelector('a');
                const snippetElement = element.querySelector('div.VwiC3b, span.aCOpRe');

                if (titleElement && linkElement) {
                    const url = linkElement.href;
                    
                    
                    if (!url.includes('youtube.com') &&
                        !url.includes('facebook.com') &&
                        !url.includes('twitter.com') &&
                        !url.includes('instagram.com')) {
                        
                        extracted.push({
                            title: titleElement.textContent,
                            url: url,
                            snippet: snippetElement ? snippetElement.textContent : ''
                        });
                    }
                }
            }

            return extracted;
        });
        await browser.close();

        
        return results.slice(0, 2);

    } catch (error) {
        if (browser) {
            await browser.close();
        }
        console.error('Puppeteer search error:', error.message);
        throw error;
    }
}

async function searchGoogle(query){
    try {
        if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_CSE_ID) {
            console.log('Searching Google using API...');
            return await searchGoogleAPI(query);
        }
    } catch(error){
        console.log('API search failed, falling back to Puppeteer...');
    }

    return await searchGooglePuppeteer(query);
}

module.exports = {
    searchGoogle,
    searchGoogleAPI,
    searchGooglePuppeteer
};
    
