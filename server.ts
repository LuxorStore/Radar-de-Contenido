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

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.status(500).json({ 
        error: "Configuración incompleta", 
        details: "Falta la GEMINI_API_KEY en los secretos del proyecto." 
      });
    }

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

    console.log("Analyzing idea:", idea);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Eres el motor de análisis de Luxor, un experto en viralidad y estrategia de contenido para creadores en 2026. Tu respuesta debe ser exclusivamente un objeto JSON válido.",
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      throw new Error(`La IA no devolvió contenido. Razón: ${finishReason || 'Desconocida'}. Esto puede deberse a filtros de seguridad.`);
    }

    let result;
    try {
      result = JSON.parse(response.text);
    } catch (parseError: any) {
       console.error("JSON Parse Error. Raw text:", response.text);
       throw new Error("La respuesta de la IA no es un JSON válido.");
    }
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Error Details:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      response: error.response?.data
    });

    const isPermissionError = error.message?.includes("PERMISSION_DENIED") || error.status === 403;
    const isQuotaError = error.message?.includes("RESOURCE_EXHAUSTED") || error.status === 429;
    const isNotFoundError = error.message?.includes("NOT_FOUND") || error.status === 404;

    res.status(500).json({ 
      error: isQuotaError ? "Cuota de IA Agotada" : (isPermissionError ? "Acceso Denegado por la IA" : (isNotFoundError ? "Modelo no disponible" : "Error en el motor de IA")), 
      details: error.message,
      hint: isQuotaError 
        ? "Has superado el límite de peticiones gratuitas. Por favor, espera un minuto o verifica tu plan en Google AI Studio (puede que debas usar una API Key con facturación activada)."
        : (isPermissionError 
            ? "Tu proyecto o API Key parece no tener permisos para acceder a este modelo. Verifica la configuración en el panel de Secrets."
            : (isNotFoundError 
                ? "El modelo de IA solicitado no se encuentra o no es compatible con esta región/configuración."
                : "Verifica que el prompt no esté violando políticas de seguridad o que la API Key sea válida."))
    });
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
