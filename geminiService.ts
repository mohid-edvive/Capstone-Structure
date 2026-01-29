
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Barnaby the Bull," a world-class Investment Coach.
Your tone is professional, encouraging, and highly educational. 
Think of yourself as the "Duolingo Owl" but for Finance.
- Use clear, actionable financial terminology simplified for beginners.
- Use metaphors like "Engines," "Fuel," "Safety Nets," and "Portfolios as Buffet Plates."
- Avoid "bank-speak" that is intentionally confusing. 
- Explain 'Why' the market moves (e.g., inflation, supply/demand, company earnings).
- Use professional emojis like 📈, 📉, 📊, 🏛️, 💼.
- Keep responses concise (under 100 words).
- Be supportive and celebrate the user's progress.
`;

export async function askBarnaby(question: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "I'm currently analyzing the market data. Please try again in a moment.";
  } catch (error) {
    console.error("Barnaby Error:", error);
    return "The financial systems are currently undergoing maintenance. I'll be back shortly to assist your learning journey.";
  }
}
