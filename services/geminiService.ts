import { GoogleGenAI } from "@google/genai";
import { Video } from "../types";

const apiKey = process.env.API_KEY || '';

// System instruction to act as a Founder Guide
const SYSTEM_INSTRUCTION = `
You are the AI Guide for "Fasterclass", a curated video platform for startup founders. 
Your goal is to provide specific, actionable, and timeless advice to entrepreneurs based on the wisdom of experts like Paul Graham, Peter Thiel, and other seasoned builders.

Tone: Professional, direct, encouraging, but realistic. Avoid fluff. Focus on "Signal, not Noise".

When a user asks a question:
1. Provide a concise answer (2-3 paragraphs max).
2. If relevant, recommend they watch a video about the topic (generic recommendation if you don't have specific data, or specific if provided in context).

Do not hallucinate specific URLs unless they are popular YC or standard startup canon videos you know for sure.
`;

export const getAIResponse = async (userPrompt: string, availableVideos: Video[]): Promise<string> => {
  if (!apiKey) {
    return "Configuration Error: API Key is missing.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We pass the context of available videos to the model so it can recommend them
    const videoContext = availableVideos.map(v => `- "${v.title}" by ${v.expert}`).join('\n');
    
    const prompt = `
    Context: The user has access to these videos in our library:
    ${videoContext}

    User Question: ${userPrompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response at this time.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the expert database right now. Please try again later.";
  }
};