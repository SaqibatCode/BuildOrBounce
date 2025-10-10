import OpenAI from 'openai';
import { getImagesForProject } from './pexelsService.js'; // Ensure the .js extension is here

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * @description Generates a single, premium, "award-winning" quality HTML landing page.
 * @param {object} project - The project object.
 * @param {object} brandKit - The finalized brand kit.
 * @param {object} crossQA - The array of mission & vision Q&A.
 * @param {string} userId - The ID of the user making the request.
 * @returns {Promise<string>} - A promise that resolves to the complete HTML string.
 */
export async function generateWebsiteHtml(project, brandKit, crossQA, userId) { // <-- It correctly ACCEPTS userId here
  console.log('Generating premium website HTML with Pexels images...');

  // --- STEP 1: Fetch real images for the project ---
  // --- THIS IS THE FIX ---
  // We must PASS the userId along to the next service.
  const imageUrls = await getImagesForProject(project, userId);
  // ----------------------

  const heroImage = imageUrls[0];
  const featureImages = imageUrls.slice(1, 4);

  const qaSummary = crossQA.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');

  // STEP 2: The Final, Upgraded Prompt (This part is unchanged)
  const systemPrompt = `
    You are a Creative Director at a Webby Award-winning digital agency. Your task is to design and build a complete, single 'index.html' file that is visually stunning and high-converting.

    **Core Principles:**
    1.  **Image-First Design:** Use the provided, high-quality Pexels images as the foundation of the design. The hero section MUST feature the hero image prominently, often as a full-bleed background.
    2.  **Persuasive Copywriting:** Write benefit-oriented, user-centric copy based on the Mission & Vision Q&A. The goal is to convert visitors.
    3.  **Premium Feel:** The site must feel alive. Use the 'AOS' (Animate On Scroll) library for subtle fade-in effects on sections.

    **Strict Technical Requirements:**
    - **Single File & Cleanup:** The entire output must be a single 'index.html' file. DO NOT wrap your response in markdown backticks like \`\`\`html.
    - **Libraries:**
        - You MUST use Tailwind CSS via the official CDN.
        - You MUST integrate the 'AOS' library CDN links (<link> for CSS, <script> for JS) and initialize it.
    - **Branding:**
        - The **logo SVG** must be in the navigation bar.
        - The **color palette** must be used intelligently. Use the primary color for CTAs and gradients.
        - The **Google Fonts** must be imported and applied.
    - **Image Implementation:**
        - The provided **Hero Image URL** MUST be used as the background for the hero section.
        - The provided **Feature Image URLs** MUST be used in the features section, perhaps in card-based layouts.

    **Final Output:** Your entire response MUST be the raw HTML code and nothing else. Start with <!DOCTYPE html> and end with </html>.
  `;

  const userPrompt = `
   **Project Details:**
    Name: ${project.title}

    **Full Brand Kit:**
    ${JSON.stringify(brandKit, null, 2)}

    **Full Mission & Vision Q&A (Use for all copywriting):**
    ${qaSummary}

    **Image Assets (Use these exactly as specified):**
    - Hero Image URL: ${heroImage}
    - Feature Image URLs: [${featureImages.join(', ')}]

    Generate the complete, award-winning 'index.html' file now.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    let htmlContent = completion.choices[0].message.content;

    // STEP 3: The Bug Fix (This part is unchanged)
    htmlContent = htmlContent.replace(/^```html\s*/, '').replace(/\s*```$/, '');

    return htmlContent;

  } catch (error) {
    console.error('Error generating premium website with OpenAI:', error);
    throw new Error('Failed to generate the website.');
  }
}