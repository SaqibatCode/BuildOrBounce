import axios from 'axios';
import OpenAI from 'openai';
import { getApiKey } from '../utils/apiKeyManager.js';

// --- HELPER FUNCTIONS (not exported) ---

// This function now correctly receives the openai instance
async function generateNameSuggestions(project, openai, isCreativeAttempt = false) {
  console.log(`Generating name suggestions... (Creative attempt: ${isCreativeAttempt})`);
  const creativeInstructions = isCreativeAttempt 
      ? `All the simple names were taken. Now, get more creative. Add action words (e.g., 'get', 'go', 'try'), industry-specific suffixes (e.g., '-lab', '-stack', '-base'), or descriptive prefixes to create unique, available domains.`
      : `The names should be short, memorable, and brandable. They should be one or two words.`;
  const systemPrompt = `You are a senior naming strategist from the agency Lexicon Branding. Your task is to generate 20 world-class name suggestions based on the project's essence. ${creativeInstructions} The final output must be a single JSON object with the key "names", which is an array of strings. Names MUST be lowercase and contain no spaces.`;
  const userPrompt = `Project Title: ${project.title}, Pitch: ${project.pitch}`;
  try {
      const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: "json_object" },
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      });
      const result = JSON.parse(completion.choices[0].message.content);
      return result.names || [];
  } catch (error) {
      console.error('Error generating names with OpenAI:', error);
      throw new Error('Failed to generate names.');
  }
}

async function checkTld(domain, tldUrl) {
    try {
        await axios.get(`${tldUrl}${domain}`);
        return false;
    } catch (error) {
        if (error.response && error.response.status === 404) return true;
        return false;
    }
}

async function checkDomainAvailability(domainName) {
    const tldUrls = {
        com: 'https://rdap.verisign.com/com/v1/domain/',
        co: 'https://rdap.cocca.co/api/v1/domain/',
        io: 'https://rdap.identity.digital/rdap/domain/',
    };
    const [com, co, io] = await Promise.all([
        checkTld(`${domainName}.com`, tldUrls.com),
        checkTld(`${domainName}.co`, tldUrls.co),
        checkTld(`${domainName}.io`, tldUrls.io),
    ]);
    return { com, co, io };
}


// --- THE ONLY EXPORTED FUNCTION ---
export const getSmartDomainSuggestions = async (project, userId) => {
    // Get the correct API key first
    const openaiApiKey = await getApiKey(userId, 'openai');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // First attempt
    let nameIdeas = await generateNameSuggestions(project, openai, false);
    let suggestionsWithAvailability = await Promise.all(
        nameIdeas.map(async (name) => ({ name, availability: await checkDomainAvailability(name) }))
    );
    let availableDomains = suggestionsWithAvailability.filter(s => s.availability.com || s.availability.co || s.availability.io);

    if (availableDomains.length > 0) {
        return availableDomains;
    }

    // Fallback attempt
    console.log("No domains found on first attempt. Retrying with creative modifiers...");
    nameIdeas = await generateNameSuggestions(project, openai, true);
    suggestionsWithAvailability = await Promise.all(
        nameIdeas.map(async (name) => ({ name, availability: await checkDomainAvailability(name) }))
    );
    availableDomains = suggestionsWithAvailability.filter(s => s.availability.com || s.availability.co || s.availability.io);

    return availableDomains;
};