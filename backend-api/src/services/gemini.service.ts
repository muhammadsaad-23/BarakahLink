import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { logger } from '../lib/logger';

export interface AnalysisResult {
  tags: string[];
  summary: string;
  isAppropriate: boolean;
}

let ai: GoogleGenAI | null = null;
if (env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  } catch (e) {
    logger.warn('Failed to initialise Gemini client', { error: String(e) });
  }
}

/** Deterministic keyword fallback used when Gemini is unavailable. */
function fallbackAnalysis(description: string): AnalysisResult {
  const lower = description.toLowerCase();
  const tags: string[] = [];

  if (lower.includes('halal')) tags.push('Halal');
  if (lower.includes('vegan')) tags.push('Vegan');
  if (lower.includes('vegetarian') && !tags.includes('Vegan')) tags.push('Vegetarian');
  if (lower.includes('gluten')) tags.push('Gluten-Free');
  if (lower.includes('dairy')) tags.push('Dairy-Free');
  if (lower.includes('nut')) tags.push('Nut-Free');
  if (lower.includes('kosher')) tags.push('Kosher');
  if (lower.includes('hot') || lower.includes('warm') || lower.includes('cooked')) tags.push('Hot Meal');
  if (lower.includes('bread') || lower.includes('bakery') || lower.includes('baked')) tags.push('Bakery');
  if (lower.includes('produce') || lower.includes('vegetable') || lower.includes('fruit')) tags.push('Fresh Produce');

  return {
    tags: tags.length > 0 ? tags : ['General'],
    summary:
      description.length > 120
        ? description.slice(0, 117) + '...'
        : description,
    isAppropriate: true,
  };
}

/**
 * Analyses a food donation description using Gemini.
 * Falls back to keyword-based tagging if the API is unavailable.
 */
export async function analyseFoodDescription(description: string): Promise<AnalysisResult> {
  if (!ai) {
    logger.debug('Gemini not configured — using fallback analysis');
    return fallbackAnalysis(description);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are a content moderation assistant for a community food-sharing platform.

Analyse the following food donation description and respond ONLY with valid JSON.

Description: "${description}"

Return this exact JSON shape:
{
  "tags": ["tag1", "tag2"],
  "summary": "One dignified sentence describing the donation for people in need.",
  "isAppropriate": true
}

Rules:
- tags: only from [Halal, Vegan, Vegetarian, Gluten-Free, Dairy-Free, Nut-Free, Kosher, Hot Meal, Bakery, Fresh Produce, General]
- summary: one sentence, warm and respectful tone
- isAppropriate: false only if the description contains offensive, harmful, or non-food content`,
      config: { responseMimeType: 'application/json' },
    });

    const raw = response.text?.trim() ?? '{}';
    const parsed = JSON.parse(raw) as Partial<AnalysisResult>;

    return {
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary : fallbackAnalysis(description).summary,
      isAppropriate: typeof parsed.isAppropriate === 'boolean' ? parsed.isAppropriate : true,
    };
  } catch (err) {
    logger.warn('Gemini analysis failed — using fallback', { error: String(err) });
    return fallbackAnalysis(description);
  }
}
