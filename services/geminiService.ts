
import { GoogleGenAI } from "@google/genai";

// Get API key from environment variable (set in vite.config.ts)
const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.API_KEY;

// Initialize AI only if API key is available
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn("Failed to initialize Gemini AI:", error);
  }
}

export interface AnalysisResult {
  tags: string[];
  summary: string;
  isAppropriate: boolean;
}

// Fallback function for when API is not available
function fallbackAnalysis(description: string): AnalysisResult {
  const lowerDesc = description.toLowerCase();
  const tags: string[] = [];
  if (lowerDesc.includes('halal')) tags.push('Halal');
  if (lowerDesc.includes('vegan')) tags.push('Vegan');
  if (lowerDesc.includes('vegetarian')) tags.push('Vegetarian');
  if (lowerDesc.includes('gluten')) tags.push('Gluten-Free');
  if (lowerDesc.includes('dairy')) tags.push('Dairy-Free');
  if (lowerDesc.includes('nut')) tags.push('Nut-Free');
  if (lowerDesc.includes('kosher')) tags.push('Kosher');
  
  return {
    tags: tags.length > 0 ? tags : ['General'],
    summary: description.length > 100 ? description.substring(0, 100) + '...' : description,
    isAppropriate: true
  };
}

export async function analyzeFoodDescription(description: string): Promise<AnalysisResult> {
  // If no API key, return default values
  if (!ai || !apiKey) {
    console.warn("Gemini API key not configured. Using fallback analysis.");
    return fallbackAnalysis(description);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Analyze this food donation description: "${description}". 
      Identify dietary tags (Halal, Vegan, Vegetarian, Gluten-Free, Dairy-Free, Nut-Free, Kosher, etc.) and create a one-sentence dignified summary for people in need. 
      Also check if the content is appropriate for a food support app.
      Respond in JSON format: {"tags": ["tag1", "tag2"], "summary": "summary text", "isAppropriate": true/false}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const result = JSON.parse(jsonStr);
    
    return {
      tags: result.tags || [],
      summary: result.summary || "No summary available.",
      isAppropriate: result.isAppropriate ?? true
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback to simple analysis
    return fallbackAnalysis(description);
  }
}
