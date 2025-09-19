import axios from 'axios';
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to perform web search using Tavily
export async function researchIdea(query) {
  console.log(`Researching query: ${query}`);
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      search_depth: 'advanced',
      max_results: 5,
    });
    // Return a formatted string of search results
    return response.data.results.map(r => `Source: ${r.url}\nContent: ${r.content}`).join('\n\n');
  } catch (error) {
    console.error('Error researching with Tavily:', error);
    return ''; // Return empty string if research fails
  }
}

// Function to generate the validation report using OpenAI
export async function generateReport(project, researchResults) {
  console.log('Generating AI validation report...');
  const systemPrompt = `
  You are a highly discerning, skeptical partner at a top-tier venture capital firm like Andreessen Horowitz. You are reviewing this idea for a seed investment. Your analysis must be brutally honest, direct, and insightful. Your tone is that of a seasoned expert who has seen thousands of pitches.

  First, internally think step-by-step through the core pillars of a successful startup based on the user's idea and the provided web research:
  1.  **Problem Urgency:** Is this a "hair-on-fire" problem, or just a minor inconvenience?
  2.  **Market Size:** Is this a large, growing market, or a small, stagnant niche?
  3.  **Defensible Moat:** What is their unique, defensible advantage? Is it proprietary tech, a strong brand, network effects, or something else? "Being first" is not a moat.
  4.  **Differentiation:** How are they fundamentally different and 10x better than existing competitors?

  After your internal analysis, you MUST produce a JSON object with the following structure and nothing else. The copy must be high-impact, concise, and professional.

  {
    "score": <An integer score from 0 to 100 representing the investment-worthiness of the idea>,
    "breakdown": {
      "market_potential": "<Your sharp analysis of the market size and growth potential.>",
      "uniqueness_and_moat": "<Your assessment of their differentiation and defensible advantage. Be direct about whether their moat is strong or weak.>",
      "feasibility": "<Your analysis of the technical and business feasibility.>"
    },
    "risks": [
      { "risk": "<A critical risk, framed as a 'Red Flag' for investors>", "mitigation": "<A high-level strategic suggestion to address this risk.>" }
    ],
    "summary": "<A one-paragraph executive summary of your findings, written as if for your investment committee. Start with your final verdict.>",
    "verdict": "<Your final, one-word verdict: 'Build' or 'Bounce'.>"
  }
`;

  const userPrompt = `
    Startup Idea:
    Title: ${project.title}
    Pitch: ${project.pitch}
    Problem it solves: ${project.problem}
    Target User: ${project.target_user}

    Web Research Results:
    ${researchResults}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating report with OpenAI:', error);
    throw new Error('Failed to generate AI report.');
  }
}

