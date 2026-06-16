import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Ensure standard client-side environment secrets are handled securely
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it inside Settings > Secrets of the AI Studio panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API Endpoint: Secure Skin Quiz generation with Gemini
app.post("/api/quiz", async (req, res) => {
  try {
    const { skinType, primaryConcern, sensitivities, routineCommitment, ageGroup } = req.body;
    
    // Quick validation
    if (!skinType || !primaryConcern) {
      return res.status(400).json({ error: "Please answer the essential skin type and primary concerns questions." });
    }

    const ai = getGenAI();

    const prompt = `
      Perform a highly professional, clinical skincare analysis for a client with the following profile:
      - Skin Type: ${skinType}
      - Primary Skin Concern: ${primaryConcern}
      - Known Sensitivities or Allergies: ${sensitivities || 'None reported'}
      - Skincare Routine Commitment Level: ${routineCommitment} (e.g. minimalist vs multi-step)
      - Age Group: ${ageGroup}

      Generate an elegant, bespoke skincare ritual in Spanish of dry-cleanser/serum/moisturizer/sunscreen steps, using natural quiet luxury terms.
      Create a warm, empathetic summary of their skin behavior, followed by a detailed morning and evening routine, and 3 custom lifestyle rules for glowing skin.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior dermatologist and skincare apothecary designer at AURA SKIN. Your tone is serene, professional, empathetic, and sophisticated. Deliver precise, customized, and realistic advice in cohesive Spanish.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional and empathetic analysis of the skin behavior and the path to restoration in Spanish."
            },
            dailyRoutine: {
              type: Type.OBJECT,
              properties: {
                morning: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepName: { type: Type.STRING, description: "Name of the skincare step, e.g., 'Paso 1: Limpieza del Alba'" },
                      purpose: { type: Type.STRING, description: "Detailed purpose of the step based on their concerns" },
                      instructions: { type: Type.STRING, description: "Sensory application instructions in Spanish" }
                    },
                    required: ["stepName", "purpose", "instructions"]
                  }
                },
                night: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepName: { type: Type.STRING, description: "Name of the skincare step, e.g., 'Paso 1: Remoción Nocturna'" },
                      purpose: { type: Type.STRING, description: "Detailed protective, curative purpose" },
                      instructions: { type: Type.STRING, description: "Massage and rest instructions in Spanish" }
                    },
                    required: ["stepName", "purpose", "instructions"]
                  }
                }
              },
              required: ["morning", "night"]
            },
            lifestyleAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly tailored lifestyle tips (sleep, water, nutrition) to support skin restoration in Spanish."
            }
          },
          required: ["summary", "dailyRoutine", "lifestyleAdvice"]
        }
      }
    });

    const parsedText = response.text;
    if (!parsedText) {
      throw new Error("No response generated from Gemini.");
    }

    res.json(JSON.parse(parsedText));
  } catch (error: any) {
    console.error("Gemini API Error in /api/quiz:", error.message);
    res.status(500).json({ error: error.message || "An error occurred during skincare ritual analysis." });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Configure Vite middleware in development, serve compiled dist in production
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AURA SKIN SERVER] running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

configureServer();
