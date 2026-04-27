import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export interface EcologicalReport {
  status: string;
  evaluation: "good" | "bad" | "normal";
  reasoning: string;
  solutions?: string;
}

export async function generateEcologicalReport(data: any, context: string): Promise<EcologicalReport> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: [
        {
          role: "user",
          parts: [{
            text: `
              You are Xəzər Monitor AI, a scientific assistant for ecological monitoring of the Caspian Sea and Azerbaijan.
              Generate a structured ecological report in Azerbaijani based on the provided data and context.
              
              Context: ${context}
              Data: ${JSON.stringify(data, null, 2)}
              
              Output MUST be a JSON object with these fields:
              - status: A concise summary of the current situation.
              - evaluation: One of "good", "bad", or "normal".
              - reasoning: Scientific explanation of why it was evaluated this way.
              - solutions: If evaluation is "bad", provide specific, actionable steps to mitigate the issues. Otherwise, suggest maintenance steps.
              
              Language: Azerbaijani (Unicode).
              Tone: Professional, scientific.
            `
          }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    return JSON.parse(text) as EcologicalReport;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      status: "Hesabat yaradıla bilmədi.",
      evaluation: "normal",
      reasoning: "Texniki xəta baş verdi. Zəhmət olmasa API açarını yoxlayın.",
    };
  }
}
