import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildCareerExplanationPrompt } from './src/services/ai/prompts/careerPrompt';
import { buildSkillProofReviewPrompt } from './src/services/ai/prompts/skillProofPrompt';
import { buildAssistantPrompt } from './src/services/ai/prompts/assistantPrompt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '1mb' }));

// Model configuration - configurable via env with gemini-3.8-flash as standard
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Initialize Gemini SDK with process.env.GEMINI_API_KEY
let aiClient: GoogleGenAI | null = null;
try {
  aiClient = new GoogleGenAI();
} catch (err) {
  console.warn('[KaushalSetu Server] GoogleGenAI initialization notice: Using deterministic fallbacks if key is missing.');
}

// Lightweight developer-safe logger
function logApiRequest(type: string, success: boolean, durationMs: number) {
  const timestamp = new Date().toISOString();
  console.log(`[API ${timestamp}] ${type} — ${success ? 'SUCCESS' : 'FALLBACK'} (${durationMs}ms)`);
}

// Clean JSON helper
function extractCleanJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// ----------------------------------------------------------------------
// 1. POST /api/ai/career-explanation
// ----------------------------------------------------------------------
app.post('/api/ai/career-explanation', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { profile, topCareer, alternatives, language } = req.body;

  if (!profile || !topCareer) {
    return res.status(400).json({ error: 'Missing profile or topCareer' });
  }

  if (!process.env.GEMINI_API_KEY || !aiClient) {
    logApiRequest('career-explanation', false, Date.now() - startTime);
    return res.json({ data: null, isFallback: true });
  }

  try {
    const prompt = buildCareerExplanationPrompt(profile, topCareer, alternatives || [], language || 'en');
    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3, // Conservative, low-creativity setting for high accuracy
      },
    });

    const responseText = response.text || '';
    const parsedData = extractCleanJson(responseText);

    logApiRequest('career-explanation', true, Date.now() - startTime);
    return res.json({ data: parsedData, isFallback: false });
  } catch (error: any) {
    logApiRequest('career-explanation', false, Date.now() - startTime);
    // Never leak stack trace or internal error details
    return res.json({ data: null, isFallback: true });
  }
});

// ----------------------------------------------------------------------
// 2. POST /api/ai/skillproof-review
// ----------------------------------------------------------------------
app.post('/api/ai/skillproof-review', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { evidence, language } = req.body;

  if (!evidence) {
    return res.status(400).json({ error: 'Missing evidence data' });
  }

  if (!process.env.GEMINI_API_KEY || !aiClient) {
    logApiRequest('skillproof-review', false, Date.now() - startTime);
    return res.json({ data: null, isFallback: true });
  }

  try {
    const prompt = buildSkillProofReviewPrompt(evidence, language || 'en');
    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Conservative deterministic rubric analysis
      },
    });

    const responseText = response.text || '';
    const parsedData = extractCleanJson(responseText);

    logApiRequest('skillproof-review', true, Date.now() - startTime);
    return res.json({ data: parsedData, isFallback: false });
  } catch (error: any) {
    logApiRequest('skillproof-review', false, Date.now() - startTime);
    return res.json({ data: null, isFallback: true });
  }
});

// ----------------------------------------------------------------------
// 3. POST /api/ai/assistant
// ----------------------------------------------------------------------
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { question, context } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }

  if (!process.env.GEMINI_API_KEY || !aiClient) {
    logApiRequest('assistant', false, Date.now() - startTime);
    return res.json({ data: null, isFallback: true });
  }

  try {
    const prompt = buildAssistantPrompt(question, context || { currentScreen: 'home', language: 'en' });
    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    const responseText = (response.text || '').trim();
    logApiRequest('assistant', true, Date.now() - startTime);
    return res.json({ data: { text: responseText }, isFallback: false });
  } catch (error: any) {
    logApiRequest('assistant', false, Date.now() - startTime);
    return res.json({ data: null, isFallback: true });
  }
});

// ----------------------------------------------------------------------
// 4. Health Check
// ----------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'KaushalSetu',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------------------------
// 5. Full-Stack Dev Server Mounting (Express + Vite)
// ----------------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KaushalSetu Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
