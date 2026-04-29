import { GoogleGenAI } from "@google/genai";
import { Groq } from "groq-sdk";

// Configuration for multiple keys
const GEMINI_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(",") : [process.env.GEMINI_API_KEY || ""];
const GROQ_KEY = process.env.GROQ_API_KEY || "";

const groq = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY }) : null;

export interface EcologicalReport {
  status: string;
  evaluation: "good" | "bad" | "normal";
  reasoning: string;
  solutions?: string;
}

// Current key index for rotation
let currentGeminiKeyIndex = 0;

async function tryGemini(data: unknown, context: string, keyIndex: number): Promise<EcologicalReport | null> {
  const apiKey = GEMINI_KEYS[keyIndex];
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash" });

    const prompt = `
      You are Soteria AI, a scientific assistant for ecological monitoring.
      Generate a structured ecological report in Azerbaijani based on the provided data and context.
      
      Context: ${context}
      Data: ${JSON.stringify(data, null, 2)}
      
      Output MUST be a valid JSON object with these EXACT fields:
      - status: A concise summary of the current situation.
      - evaluation: One of "good", "bad", or "normal".
      - reasoning: Scientific explanation of why it was evaluated this way.
      - solutions: If evaluation is "bad", provide specific, actionable steps to mitigate the issues. Otherwise, suggest maintenance steps.
      
      Language: Azerbaijani (Unicode).
      Tone: Professional, scientific.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    return JSON.parse(text) as EcologicalReport;
  } catch (error: unknown) {
    console.warn(`Gemini Key ${keyIndex} failed:`, error instanceof Error ? error.message : String(error));
    // If it's a rate limit error (429), we should try the next key
    if (error instanceof Error && (error.message?.includes("429") || error.message?.includes("quota"))) {
      return null;
    }
    throw error; // For other errors, rethrow to stop or handle differently
  }
}

async function tryGroq(data: unknown, context: string): Promise<EcologicalReport> {
  if (!groq) throw new Error("Groq API key not configured");

  const prompt = `
    You are Soteria AI, a scientific assistant for ecological monitoring.
    Generate a structured ecological report in Azerbaijani based on the provided data and context.
    
    Context: ${context}
    Data: ${JSON.stringify(data, null, 2)}
    
    Output MUST be a valid JSON object with these EXACT fields:
    - status: A concise summary of the current situation.
    - evaluation: One of "good", "bad", or "normal".
    - reasoning: Scientific explanation of why it was evaluated this way.
    - solutions: If evaluation is "bad", provide specific, actionable steps to mitigate the issues. Otherwise, suggest maintenance steps.
    
    Language: Azerbaijani (Unicode).
    Tone: Professional, scientific.
    Return ONLY the JSON object.
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-120b",
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty Groq response");

  return JSON.parse(content) as EcologicalReport;
}

export async function generateEcologicalReport(data: unknown, context: string): Promise<EcologicalReport> {
  // 1. Try Gemini keys starting from current index
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const index = (currentGeminiKeyIndex + i) % GEMINI_KEYS.length;
    try {
      const report = await tryGemini(data, context, index);
      if (report) {
        currentGeminiKeyIndex = index; // Keep using this working key
        return report;
      }
    } catch (err) {
      console.error(`Error with Gemini key ${index}:`, err);
      // Continue to next key or fallback
    }
  }

  // 2. Fallback to Groq if all Gemini keys fail
  console.log("All Gemini keys failed or reached limits. Falling back to Groq...");
  try {
    return await tryGroq(data, context);
  } catch (error) {
    console.error("Groq fallback also failed:", error);
    return {
      status: "Hesabat yaradıla bilmədi.",
      evaluation: "normal",
      reasoning: "Bütün süni intellekt xidmətləri (Gemini və Groq) hal-hazırda əlçatmazdır.",
    };
  }
}
