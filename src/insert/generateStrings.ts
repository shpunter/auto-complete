import { GoogleGenAI, Type } from "npm:@google/genai";

const apiKey = Deno.env.get("OPENAI_API_KEY");
const ai = new GoogleGenAI({ apiKey });

export const generate = async (number: number, type: ContentsType) => {
  const contents = {
    pair: `Create noun + adjective. 1 noun and 1-2 adjectives. Start with capital letter`,
    sentences:
      `Create a ${number} sentences. Each contains up to 5 words. Max 5 words. Start with capital letter`,
  } as const;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents[type],
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

type ContentsType = "sentences" | "pair"