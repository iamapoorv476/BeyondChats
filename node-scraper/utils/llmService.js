
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function enhanceArticle(originalArticle, referenceArticles) {
    try {
        console.log('Enhancing article with Groq AI (Llama 3.3)...');
        const referencesText = referenceArticles
            .map((ref, index) => `
## Reference Article ${index + 1}: ${ref.title}
URL: ${ref.url}

Content Preview:
${ref.content.substring(0, 2000)}
`)
            .join('\n\n---\n\n');
        const prompt = `You are an expert content editor and SEO specialist. Enhance the following article by analyzing top-ranking articles.

# Original Article
Title: ${originalArticle.title}
Content:
${originalArticle.content}

# Top-Ranking Reference Articles
${referencesText}

# Your Task
Rewrite the original article to make it competitive. Your enhanced article should:

1. **Match Style & Format**: Analyze and adapt to the reference articles' style
2. **Improve SEO**: Use clear headings, scannable paragraphs, relevant keywords
3. **Enhance Quality**: Add valuable insights, expand key points, include examples
4. **Maintain Intent**: Keep core message but make it more compelling
5. **Proper Length**: Aim for 800-1500 words

# Output Format
Return ONLY a JSON object:
{
  "title": "Enhanced SEO-optimized title",
  "content": "Complete enhanced article with proper formatting",
  "improvements": "Brief summary of improvements made",
  "seo_keywords": ["keyword1", "keyword2", "keyword3"]
}`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",  
            messages: [
                {
                    role: "system",
                    content: "You are an expert content writer and SEO specialist. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" }
        });

        const responseText = completion.choices[0].message.content;
        let enhancedData;
        try {
            enhancedData = JSON.parse(responseText);
        } catch (parseError) {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                enhancedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse AI response as JSON');
            }
        }

        console.log('✓ Article enhanced successfully');
        console.log(`  Improvements: ${enhancedData.improvements}`);

        return {
            title: enhancedData.title || originalArticle.title,
            content: enhancedData.content,
            improvements: enhancedData.improvements,
            seo_keywords: enhancedData.seo_keywords || [],
            references: referenceArticles.map(ref => ({
                title: ref.title,
                url: ref.url
            }))
        };

    } catch (error) {
        console.error('Groq enhancement error:', error.message);
        
        return {
            title: originalArticle.title,
            content: originalArticle.content,
            improvements: 'AI enhancement failed - returned original content',
            seo_keywords: [],
            references: referenceArticles.map(ref => ({
                title: ref.title,
                url: ref.url
            })),
            error: error.message
        };
    }
}

module.exports = {
    enhanceArticle
};