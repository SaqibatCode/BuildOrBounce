import axios from 'axios';
import OpenAI from 'openai';
import { getApiKey } from '../utils/apiKeyManager.js';
/**
 * @description Fetches relevant, high-quality stock photos from Pexels based on a project's theme.
 * @param {object} project - The project object containing title and pitch.
 * @returns {Promise<Array<string>>} - A promise resolving to an array of image URLs.
 */
export async function getImagesForProject(project, userId) {
    const pexelsApiKey = await getApiKey(userId, 'pexels');
    const openaiApiKey = await getApiKey(userId, 'openai');
    const openai = new OpenAI({ apiKey: openaiApiKey });
    console.log('Fetching images from Pexels...');

    // 1. Use GPT to brainstorm the best search query for Pexels.
    const keywordPrompt = `Based on the following startup idea, provide a single, concise search query (2-3 words) to find beautiful, abstract, and professional stock photos on Pexels. The query should represent the core concept. Example: for a "financial analytics" app, a good query is "abstract data visualization".

  Project Title: ${project.title}
  Project Pitch: ${project.pitch}

  Your response should only be the search query string and nothing else.`;

    const keywordCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: keywordPrompt }],
    });
    const searchQuery = keywordCompletion.choices[0].message.content.trim();
    console.log(`Pexels search query: "${searchQuery}"`);

    // 2. Call the Pexels API with the generated query.
    try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            headers: {
                'Authorization': process.env.PEXELS_API_KEY
            },
            params: {
                query: searchQuery,
                per_page: 5, // Get 5 images to have options
                orientation: 'landscape'
            }
        });

        if (response.data.photos.length === 0) {
            console.warn("Pexels returned no images for the query. Using a fallback.");
            // Fallback search if the first one fails
            const fallbackResponse = await axios.get('https://api.pexels.com/v1/search', {
                headers: { 'Authorization': process.env.PEXELS_API_KEY },
                params: { query: 'abstract technology', per_page: 5, orientation: 'landscape' }
            });
            return fallbackResponse.data.photos.map(photo => photo.src.large2x);
        }

        // Return an array of high-quality image URLs
        return response.data.photos.map(photo => photo.src.large2x);
    } catch (error) {
        console.error("Error fetching from Pexels API:", error.response?.data || error.message);
        throw new Error("Failed to fetch images from Pexels.");
    }
}

