import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Translation Service (Special Tasks)
export const translateInstruction = async (input: string) => {
  const ai = getAI();
  const prompt = `Translate the following household instruction into Chinese (Traditional), English, and Indonesian. 
  Input: "${input}"
  Return JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zh: { type: Type.STRING },
            en: { type: Type.STRING },
            id_lang: { type: Type.STRING }
          },
          required: ["zh", "en", "id_lang"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

// 2. Chatbot Service
export const chatWithBot = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
    config: {
      systemInstruction: "You are a helpful, polite home assistant bot. You help with recipes, cleaning tips, and general questions. Keep answers concise.",
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

// 3. Image Generation Service
export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image gen error:", error);
    throw error;
  }
};
