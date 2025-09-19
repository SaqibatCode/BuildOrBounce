const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });

/**
 * Generates a set of visual inspiration images for a brand.
 * @param {object} project - The project object containing title and pitch.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of base64 encoded image strings.
 */
export async function generateBrandInspirationImages(project) {
    console.log('Generating brand inspiration with Gemini via parallel requests...');

    // We define the prompt once. The model's inherent creativity will provide variation.
    const prompt = `
    Create a single, visually stunning, abstract concept for a brand identity for a tech company called "${project.title}".
    The company's mission is: "${project.pitch}".
    Style: Minimalist, clean, geometric, symbolic, sophisticated.
    The output should be suitable for a modern SaaS product.
    Do not include any text or words.
    Format: PNG
  `;

    // This is a helper function to make a single API call
    const generateSingleImage = async () => {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
        if (!imagePart) {
            throw new Error("A Gemini request did not return an image.");
        }
        return imagePart.inlineData.data;
    };

    try {
        // --- THIS IS THE CORRECTED LOGIC ---
        // We create an array of three promises. Each promise is a call to generate one image.
        const imagePromises = [
            generateSingleImage(),
            generateSingleImage(),
            generateSingleImage()
        ];

        // Promise.all runs all three requests concurrently and waits for them all to finish.
        // This is much faster than running them one after another.
        const base64Images = await Promise.all(imagePromises);

        return base64Images;
        // ------------------------------------

    } catch (error) {
        console.error("Error generating images with Gemini:", error.message || error);
        throw new Error("Failed to generate brand inspiration images from the external service.");
    }
}

