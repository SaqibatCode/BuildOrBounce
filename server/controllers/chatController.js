import Project from '../models/projectModel.js';
import ChatMessage from '../models/chatMessageModel.js';
import OpenAI from 'openai';
import { getApiKey } from '../utils/apiKeyManager.js';

export const getChatHistory = async (req, res) => {
    try {
        const messages = await ChatMessage.find({ project_id: req.params.projectId, user_id: req.user.id }).sort('createdAt');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const postMessage = async (req, res) => {
    const { message } = req.body;
    const { projectId } = req.params;
    const userId = req.user.id;
    try {
        await ChatMessage.create({ project_id: projectId, user_id: userId, role: 'user', content: message });
        const project = await Project.findById(projectId).populate('validation_report_id').populate('cross_qa_ids');
        const context = `Project Info: ${JSON.stringify(project, null, 2)}`;
        const history = await ChatMessage.find({ project_id: projectId, user_id: userId }).sort('createdAt').limit(10);
        const formattedHistory = history.map(msg => ({ role: msg.role, content: msg.content }));
        const openaiApiKey = await getApiKey(userId, 'openai');
        const openai = new OpenAI({ apiKey: openaiApiKey });
        const systemPrompt = `
    You are "Coach Gemini", an expert AI business coach and startup strategist. You are advising a founder on their project. Your tone is insightful, encouraging, and highly structured.

    You have been provided with the full context of their project and the recent chat history. Use this information to give personalized, actionable advice.

    Your response MUST ALWAYS be formatted in Markdown and follow this structure:

    **1. Core Insight:** (Start with a single, powerful sentence that gets to the heart of the user's question.)

    **2. Key Considerations:** (Provide a bulleted list of 2-4 key points, factors, or strategies the founder should think about. Each point should be concise and clear.)
    - Point 1...
    - Point 2...
    - Point 3...

    **3. Actionable Next Step:** (Conclude with a single, clear, and immediate action the founder can take to move forward on this topic.)

    --- PROJECT CONTEXT ---
    ${context}
    --- END CONTEXT ---
  `;
        const completion = await openai.chat.completions.create({
            model: 'gpt-5-nano',
            messages: [{ role: 'system', content: systemPrompt }, ...formattedHistory, { role: 'user', content: message }]
        });
        const assistantResponse = completion.choices[0].message.content;
        const assistantMessage = await ChatMessage.create({ project_id: projectId, user_id: userId, role: 'assistant', content: assistantResponse });
        res.status(201).json(assistantMessage);
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ message: "Failed to get response from coach." });
    }
};