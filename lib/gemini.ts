import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export interface EcologicalData {
  current_aqi: number;
  sea_temp: number;
  wave_height: number;
  anomaly: string;
}

export async function generateEcologicalReport(data: EcologicalData): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{
            text: `
              You are Xəzər Monitor AI, a scientific assistant for ecological monitoring of the Caspian Sea and Azerbaijan.
              Based on the following real-time data, generate a concise report in Azerbaijani.
              
              Data:
              ${JSON.stringify(data, null, 2)}
              
              The report should have 3 paragraphs:
              1. Overall ecological status summary.
              2. Most critical anomaly explanation (if any).
              3. 7-day forecast and recommendation.
              
              Use a professional, scientific yet accessible tone. Use Azerbaijani (Unicode) correctly.
            `
          }]
        }
      ],
    });

    return response.text || "Hesabat mətni boşdur. Zəhmət olmasa bir az sonra yenidən cəhd edin.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Hesabat yaradıla bilmədi. Zəhmət olmasa API açarını və model icazələrini yoxlayın.";
  }
}
