
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


async function enhanceArticle(originalArticle, referenceArticles) {
    try {
        console.log('Enhancing article with LLM...');

        
        const referencesText = referenceArticles
            .map((ref, index) => `
## Reference Article ${index + 1}: ${ref.title}
URL: ${ref.url}

Content:
${ref.content}
`)
            .join('\n\n---\n\n');

        
        const prompt = `You are an expert content editor and SEO specialist. Your task is to enhance the following article by analyzing the top-ranking articles on Google for the same topic.

# Original Article
Title: ${originalArticle.title}
Content:
${originalArticle.content}

# Top-Ranking Reference Articles
${referencesText}

# Your Task
Rewrite the original article to make it competitive with the reference articles. Your enhanced article should:

1. **Match the Style & Format**: Analyze the writing style, tone, structure, and formatting of the reference articles. Adapt the original content to match this style.

2. **Improve SEO & Readability**: 
   - Use clear headings and subheadings
   - Write in scannable paragraphs
   - Include relevant keywords naturally
   - Use engaging opening and conclusion

3. **Enhance Content Quality**:
   - Add valuable insights from reference articles
   - Expand on key points with more detail
   - Include relevant examples or data
   - Make it more comprehensive and authoritative

4. **Maintain Original Intent**: Keep the core message and main points of the original article, but present them in a more compelling way.

5. **Proper Length**: Aim for similar length to the reference articles (typically 800-1500 words for blog posts).

# Output Format
Return ONLY a JSON object with this structure:
{
  "title": "Enhanced article title (optimized for SEO)",
  "content": "The complete enhanced article content with proper formatting",
  "improvements": "Brief summary of key improvements made",
  "seo_keywords": ["keyword1", "keyword2", "keyword3"]
}

Do not include any markdown code blocks or extra text outside the JSON object.`;

        
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview', 
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert content writer and SEO specialist. You analyze top-ranking articles and enhance content to match their quality and style. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
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
                throw new Error('Failed to parse LLM response as JSON');
            }
        }

        console.log('Article enhanced successfully');
        console.log(`Improvements: ${enhancedData.improvements}`);

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
        console.error('LLM enhancement error:', error.message);
        
        
        return {
            title: originalArticle.title,
            content: originalArticle.content,
            improvements: 'LLM enhancement failed - returned original content',
            seo_keywords: [],
            references: referenceArticles.map(ref => ({
                title: ref.title,
                url: ref.url
            })),
            error: error.message
        };
    }
}

