import User from '../models/userModel.js';
import { decrypt } from './encryption.js';

/**
 * Gets the correct API key for a service.
 * Prioritizes the user's own key, falls back to the system's key.
 * @param {string} userId - The ID of the user making the request.
 * @param {string} serviceName - The name of the service (e.g., 'openai', 'pexels').
 * @returns {Promise<string>} A promise that resolves to the API key to be used.
 */
export async function getApiKey(userId, serviceName) {
  // Use a try-catch block for better error handling
  try {
    const user = await User.findById(userId).select('+apiKeys');
    
    // Check if the user and the specific key exist
    if (user && user.apiKeys && user.apiKeys[serviceName]) {
      const decryptedKey = decrypt(user.apiKeys[serviceName]);
      if (decryptedKey) {
        console.log(`Using user-provided key for ${serviceName}.`);
        return decryptedKey;
      }
    }
    
    // Fallback to system key if user key is not found or is invalid
    console.log(`Falling back to system key for ${serviceName}.`);
    const systemKey = process.env[`${serviceName.toUpperCase()}_API_KEY`];
    if (!systemKey) {
      // Throw a specific error if the system key is missing
      throw new Error(`System API key for '${serviceName}' is not configured in the .env file.`);
    }
    
    return systemKey;
  } catch (error) {
    console.error(`Error retrieving API key for ${serviceName}:`, error);
    // Re-throw the error to be caught by the calling service
    throw error;
  }
}