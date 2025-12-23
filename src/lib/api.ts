import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { SYSTEM_PROMPT } from './prompt';
import type { CorrectionResponse } from './types';

// Define the schema for structured output
// Using 'STRING', 'ARRAY', 'OBJECT' directly as strings or via an enum if available.
// Based on the error, SchemaType wasn't exported.
// Let's try to define it simply as a compatible object, or use 'Type' if I can import it.
// I will try to import 'Type' as seen in the user snippet.

import { Type } from "@google/genai";

const correctionSchema = {
  type: Type.OBJECT,
  properties: {
    corrections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, nullable: true },
          type: {
            type: Type.STRING,
            enum: ['spelling', 'grammar', 'syntax', 'repetition', 'coherence', 'punctuation', 'style']
          },
          original: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          message: { type: Type.STRING },
        },
        required: ["type", "original", "suggestion", "message"]
      }
    }
  },
  required: ["corrections"]
};

export const fetchCorrections = async (text: string, apiKey: string): Promise<CorrectionResponse> => {
  if (!apiKey) {
    throw new Error("Clé API manquante");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        responseMimeType: 'application/json',
        responseSchema: correctionSchema,
        systemInstruction: SYSTEM_PROMPT,
      },
      contents: [
        {
          role: 'user',
          parts: [{ text }]
        }
      ]
    });

    // In the new SDK, response.text might be a getter or property. 
    // The previous error said: "This expression is not callable because it is a 'get' accessor."
    // So we use it without parens.
    const resultText = response.text;

    if (!resultText) {
      return { corrections: [] };
    }

    const json = JSON.parse(resultText);
    return json as CorrectionResponse;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Erreur lors de l'appel à Gemini");
  }
};
