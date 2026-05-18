import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini SDK Setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const { idea, platform, niche, target, goal } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "No se proporcionó ninguna idea" });
    }

    const prompt = `Analiza la siguiente idea de contenido para Luxor — Radar de Contenido.
    Idea: ${idea}
    Plataforma: ${platform || 'TikTok'}
    Nicho: ${niche || 'Negocios digitales'}
    Público Objetivo: ${target || 'Emprendedores'}
    Objetivo: ${goal || 'Viralidad'}

    Basado en las tendencias de 2026, genera un análisis completo en formato JSON con la siguiente estructura:
    {
      "score": number (1-100),
      "analysis": {
        "viralPotential": number (1-10),
        "authorityPotential": number (1-10),
        "conversionPotential": number (1-10),
        "engagementPotential": number (1-10),
        "retentionPotential": number (1-10)
      },
      "diagnosis": {
        "hook": { status: "fuerte"|"debil", detail: string },
        "relevance": { status: "alta"|"baja", detail: string },
        "differentiation": { status: "alta"|"baja", detail: string },
        "emotion": { status: "alta"|"baja", detail: string }
      },
      "improvements": {
        "strongerHooks": string[],
        "structure": string,
        "variantPolarizing": string,
        "variantEmotional": string
      },
      "titles": {
        "seo": string,
        "viral": string,
        "emotional": string,
        "ctr": string
      },
      "adaptation": {
        "tiktok": string,
        "linkedin": string,
        "youtube": string,
        "instagram": string
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            analysis: {
              type: Type.OBJECT,
              properties: {
                viralPotential: { type: Type.NUMBER },
                authorityPotential: { type: Type.NUMBER },
                conversionPotential: { type: Type.NUMBER },
                engagementPotential: { type: Type.NUMBER },
                retentionPotential: { type: Type.NUMBER }
              }
            },
            diagnosis: {
               type: Type.OBJECT,
               properties: {
                 hook: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, detail: { type: Type.STRING } } },
                 relevance: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, detail: { type: Type.STRING } } },
                 differentiation: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, detail: { type: Type.STRING } } },
                 emotion: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, detail: { type: Type.STRING } } }
               }
            },
            improvements: {
              type: Type.OBJECT,
              properties: {
                strongerHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                structure: { type: Type.STRING },
                variantPolarizing: { type: Type.STRING },
                variantEmotional: { type: Type.STRING }
              }
            },
            titles: {
              type: Type.OBJECT,
              properties: {
                seo: { type: Type.STRING },
                viral: { type: Type.STRING },
                emotional: { type: Type.STRING },
                ctr: { type: Type.STRING }
              }
            },
            adaptation: {
              type: Type.OBJECT,
              properties: {
                tiktok: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                youtube: { type: Type.STRING },
                instagram: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Fallo al analizar la idea", details: error.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxor running on http://localhost:${PORT}`);
  });
}

startServer();
