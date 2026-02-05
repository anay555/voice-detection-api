# AI-Generated Voice Detection API

POST /detect

Headers:
x-api-key: YOUR_API_KEY

Body:
{
  "audio_b64": "BASE64_MP3"
}

Response:
{
  "classification": "AI_GENERATED",
  "confidence": 0.87,
  "explanation": "Low pitch variability suggests vocoder-based synthesis."
}

Env Vars:
API_KEY=your-secret-api-key
GEMINI_API_KEY=your-google-ai-studio-key