import express from "express";
import { extractFeatures } from "./audioFeatures.js";
import { analyzeWithGemini } from "./gemini.js";

const app = express();
app.use(express.json({ limit: "10mb" }));

const API_KEY = process.env.API_KEY;

app.post("/detect", async (req, res) => {
  try {
    const clientKey = req.headers["x-api-key"];
    if (!clientKey || clientKey !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { audio_b64 } = req.body;
    if (!audio_b64) {
      return res.status(400).json({ error: "audio_b64 missing" });
    }

    const features = await extractFeatures(audio_b64);
    const result = await analyzeWithGemini(features);

    if (
      !["AI_GENERATED", "HUMAN"].includes(result.classification) ||
      typeof result.confidence !== "number"
    ) {
      throw new Error("Invalid Gemini response");
    }

    res.json({
      classification: result.classification,
      confidence: Number(result.confidence.toFixed(3)),
      explanation: result.explanation
    });

  } catch (err) {
    res.json({
      classification: "HUMAN",
      confidence: 0.5,
      explanation: "Insufficient evidence for confident classification."
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("API running on port", PORT);
});