import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeWithGemini(features) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
You are an audio forensics AI used in an automated evaluation system.

Rules:
1. Output ONLY valid JSON
2. classification must be exactly "AI_GENERATED" or "HUMAN"
3. confidence must be between 0.0 and 1.0
4. explanation must be one short technical sentence

Audio Features:
- Duration: ${features.duration} seconds
- RMS Energy Mean: ${features.rms_energy}

Return JSON only:
{
  "classification": "",
  "confidence": 0.0,
  "explanation": ""
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}