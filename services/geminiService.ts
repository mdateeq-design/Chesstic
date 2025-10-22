
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getStrategyTips = async (gameName: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "API Key not configured. Please set the API_KEY environment variable to get AI-powered tips.";
    }
    
    try {
        const prompt = `Provide three concise, beginner-friendly strategy tips for the game of ${gameName}. Format them as a numbered list. For example:\n1. First tip.\n2. Second tip.\n3. Third tip.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching strategy tips from Gemini:", error);
        return "Sorry, I couldn't fetch any strategy tips at the moment. Please try again later.";
    }
};
