import { GoogleGenAI, Type } from "@google/genai";

const apiKey = Deno.env.get("OPENAI_API_KEY");
const ai = new GoogleGenAI({ apiKey });

export const generate = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
      "Create a 100 sentences. Each contains up to 5 words. Max 5 words",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  return response;
};
