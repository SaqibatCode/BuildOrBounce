import OpenAI from 'openai';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios'; // You will need axios for this: npm install axios

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @description STEP 1: Generates 4 image logo options in a SINGLE API call using Wan2.5.
 * @param {object} project - The project object containing title and pitch.
 * @returns {Promise<Array<string>>} - A promise resolving to an array of 4 image URLs.
 */
export async function generateLogoOptions(project) {
  console.log('Generating 4 image logos with wan2.5-t2i-preview...');
  const prompt = `
    A minimalist, symbolic, and timeless logo for a modern tech company named "${project.title}".
    The logo should represent a core concept from the company's mission: "${project.pitch}".
    The design must be abstract and use basic geometric shapes in a clever, professional combination.
    The logo must be on a plain white background, clean, high resolution, vector style.
  `;

  const apiEndpoint = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
  const headers = {
    'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
    'Content-Type': 'application/json',
    'X-DashScope-Async': 'enable',
  };

  const payload = {
    model: "wan2.5-t2i-preview",
    input: { prompt },
    parameters: {
      n: 4,
      size: "1024*1024",
    }
  };

  try {
    const initialResponse = await axios.post(apiEndpoint, payload, { headers });
    const taskId = initialResponse.data.output.task_id;
    if (!taskId) throw new Error("API did not return a task ID.");
    console.log(`Task for 4 logos started with ID: ${taskId}`);

    const taskCheckEndpoint = `https://dashscope-intl.aliyuncs.com/api/v1/tasks/${taskId}`;
    let attempts = 0;
    const maxAttempts = 40; // Poll for 120 seconds

    while (attempts < maxAttempts) {
      await sleep(3000);
      const taskResponse = await axios.get(taskCheckEndpoint, { headers });
      const taskStatus = taskResponse.data.output.task_status;
      console.log(`Polling task ${taskId} (attempt ${attempts + 1}/${maxAttempts}): Status is ${taskStatus}`);

      if (taskStatus === "SUCCEEDED") {
        console.log(`Task ${taskId} succeeded! Retrieving image URLs.`);
        return taskResponse.data.output.results.map(result => result.url);
      }
      if (taskStatus === "FAILED") {
        throw new Error(`Task ${taskId} failed. API Message: ${taskResponse.data.output.message}`);
      }
      attempts++;
    }
    throw new Error(`Task ${taskId} timed out after 120 seconds.`);
  } catch (error) {
    console.error("Error during logo generation:", error.response ? error.response.data : error.message);
    throw new Error("Failed to generate logo options.");
  }
}

/**
 * @description STEP 2: Generates a palette/fonts to perfectly match a CHOSEN LOGO URL.
 * @param {string} chosenLogoUrl - The URL of the logo the user selected.
 * @returns {Promise<object>} - A promise resolving to the brand data object { palette, fonts }.
 */
export async function generateComplementaryBrandData(chosenLogoUrl) {
  console.log('Generating complementary brand data from logo URL...');
  const systemPrompt = `
    You are a lead designer. A user has selected a final logo for their brand, provided as a URL. Your task is to create a complementary brand kit that matches the logo's aesthetic. The response must be a valid JSON object.
    - **Color Palette**: Create a sophisticated palette. Include primary, secondary, accent, neutral_light, and neutral_dark hex codes.
    - **Fonts**: Suggest two premium, complementary Google Fonts (one for headings, one for body).
    The JSON output must follow this exact structure:
    { "palette": { "primary": "#...", "secondary": "#...", "accent": "#...", "neutral_light": "#f8f9fa", "neutral_dark": "#212529" }, "fonts": { "heading": "Poppins", "body": "Inter" } }
  `;
  try {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `The user has selected the logo at this URL: ${chosenLogoUrl}. Generate the complementary brand kit.` }
        ]
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error generating complementary brand data:", error);
    throw new Error("Failed to generate brand palette and fonts.");
  }
}

/**
 * @description STEP 3: Renders a business card PDF using the LOGO URL.
 * @param {object} brandData - The final brand kit data including the chosen logo URL.
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

  // This now creates an <img> tag to embed the logo from the URL
  const logoHtml = `<img src="${brandData.logoUrl}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">`;

  htmlContent = htmlContent
    .replace('{{backgroundColor}}', brandData.palette.neutral_light)
    .replace('{{textColor}}', brandData.palette.neutral_dark)
    .replace('{{secondaryColor}}', brandData.palette.secondary)
    .replace('{{logoSvg}}', logoHtml) // We inject the <img> tag here
    .replace('{{userName}}', user.name || user.email.split('@')[0])
    .replace('{{userEmail}}', user.email)
    .replace('{{domainName}}', project.selected_domain_name);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ width: '3.5in', height: '2in', printBackground: true });
  await browser.close();
  return pdfBuffer;
}