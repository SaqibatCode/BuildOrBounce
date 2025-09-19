import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });

/**
 * @description STEP 1: Generates multiple, professional, ready-to-use SVG logo options using Gemini.
 * @param {object} project - The project object containing title and pitch.
 * @returns {Promise<Array<string>>} - A promise resolving to an array of SVG logo code strings.
 */
export async function generateLogoOptions(project) {
  console.log('Generating SVG logo options with Gemini...');
  const prompt = `
    You are a world-class logo designer specializing in minimalist, symbolic, and timeless vector logos for modern tech companies.
    Your task is to generate 4 distinct, high-quality logo options.
    Your response MUST be a valid JSON object with a single key "logos", which is an array of SVG code strings.

    **Strict SVG Requirements for each logo in the array:**
    - The code MUST be a complete, valid SVG string.
    - Dimensions MUST be width="100" height="100".
    - The design MUST be abstract and symbolic, representing a core concept from the company's mission (e.g., 'connection', 'growth', 'clarity').
    - The design MUST use basic geometric shapes (circles, arcs, squares, lines) in a clever, professional combination.
    - The SVG MUST use "currentColor" for all 'fill' or 'stroke' attributes so it can be styled with CSS.
    - The SVG must NOT contain any text.
    - The SVG code MUST be minified into a single line.

    Example Response: { "logos": ["<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='40' stroke='currentColor' stroke-width='4' fill='none' /></svg>", "<svg>...</svg>"] }

    Now, generate the JSON for a company named "${project.title}" with the mission: "${project.pitch}"
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    // Clean the response to ensure it's valid JSON
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(jsonString);
    
    if (!resultJson.logos || !Array.isArray(resultJson.logos)) {
      throw new Error("Gemini did not return logos in the expected format.");
    }

    return resultJson.logos;
  } catch (error) {
    console.error("Error generating SVG logo options with Gemini:", error);
    throw new Error("Failed to generate logo options.");
  }
}

/**
 * @description STEP 2: Generates a palette/fonts to perfectly match a CHOSEN SVG logo.
 * @param {string} chosenLogoSvg - The SVG string of the logo the user selected.
 * @returns {Promise<object>} - A promise resolving to the brand data object { palette, fonts }.
 */
export async function generateComplementaryBrandData(chosenLogoSvg) {
  console.log('Generating complementary brand data...');
  const systemPrompt = `
    You are a lead designer at a high-end design studio.
    A user has selected a final SVG logo for their brand. Your task is to create a complementary brand kit that matches the logo's aesthetic.
    The response must be a valid JSON object.
    
    - **Color Palette**: Create a sophisticated palette that matches the logo's style. Include primary, secondary, accent, neutral_light, and neutral_dark hex codes.
    - **Fonts**: Suggest two premium, complementary Google Fonts that fit the logo's style (one for headings, one for body).
    
    The JSON output must follow this exact structure:
    { "palette": { "primary": "#...", "secondary": "#...", "accent": "#...", "neutral_light": "#f8f9fa", "neutral_dark": "#212529" }, "fonts": { "heading": "Poppins", "body": "Inter" } }
  `;

  try {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `The user has selected this SVG logo: ${chosenLogoSvg}. Generate the complementary brand kit.` }
        ]
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error generating complementary brand data:", error);
    throw new Error("Failed to generate brand palette and fonts.");
  }
}

/**
 * @description STEP 3: Renders a pixel-perfect business card PDF using Puppeteer.
 * @param {object} brandData - The final brand kit data including the chosen SVG.
 * @param {object} user - The user object.
 * @param {object} project - The project object.
 * @returns {Promise<Buffer>} - A promise resolving to the PDF file buffer.
 */
export async function generateBusinessCardPdf(brandData, user, project) {
  console.log('Generating business card PDF with Puppeteer...');
  const templatePath = path.join(__dirname, '..', 'templates', 'business-card.html');
  let htmlContent;

  try {
    htmlContent = await fs.readFile(templatePath, 'utf8');
  } catch (error) {
    console.error('Could not read business card template file.', error);
    throw new Error('Server configuration error: missing template file.');
  }

  htmlContent = htmlContent
    .replace('{{backgroundColor}}', brandData.palette.neutral_light)
    .replace('{{textColor}}', brandData.palette.neutral_dark)
    .replace('{{secondaryColor}}', brandData.palette.secondary)
    .replace('{{logoSvg}}', brandData.logoSvg)
    .replace('{{userName}}', user.name || user.email.split('@')[0])
    .replace('{{userEmail}}', user.email)
    .replace('{{domainName}}', project.selected_domain_name);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ width: '3.5in', height: '2in', printBackground: true });
  await browser.close();
  return pdfBuffer;
}

