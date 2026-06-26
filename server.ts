import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with telemetry headers
const apiKey = process.env.GEMINI_API_KEY || '';
const isApiKeyPlaceholder = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';

let ai: GoogleGenAI | null = null;
if (!isApiKeyPlaceholder) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI successfully initialized server-side.');
  } catch (err) {
    console.error('Error initializing Gemini AI:', err);
  }
} else {
  console.log('Using simulated AI engine. Add a real GEMINI_API_KEY in the Secrets panel to activate actual Gemini 3.5.');
}

// Helper: safe Gemini generator with mock fallback
async function generateContentWithGemini(prompt: string, jsonSchema?: any): Promise<string> {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: jsonSchema ? {
          responseMimeType: 'application/json',
          responseSchema: jsonSchema,
        } : undefined,
      });
      return response.text || '';
    } catch (error) {
      console.error('Gemini call failed, falling back to mock processor:', error);
    }
  }
  // Fallback / mock processor in case of network issue or no key
  return '';
}

// API Route: Summarize, categorize, and score an incident
app.post('/api/gemini/summarize-incident', async (req, res) => {
  const { title, description, comments } = req.body;
  
  const prompt = `
    Analyze this community incident report for a city coordination platform called PeaceOS.
    Title: "${title}"
    Description: "${description}"
    Comments from responders: ${JSON.stringify(comments || [])}

    Your tasks:
    1. Create a clear, active, concise executive summary (2 sentences maximum).
    2. Assess the severity level (must be "Low", "Medium", "High", or "Critical").
    3. Categorize the incident (e.g., "Civic Infrastructure", "Traffic & Crowd Management", "Medical Emergency", "Resource Request", "Safety Hazard").
    4. Provide a numerical priority score from 0 (very minor) to 100 (critical life safety threat) and justify it.
    5. Draft 3 concrete coordination tasks or action items for responders.

    Format the output as a valid JSON object matching this schema:
    {
      "summary": "Concise summary",
      "severity": "Low|Medium|High|Critical",
      "category": "Suggested Category",
      "priorityScore": 75,
      "justification": "Why this score was assigned",
      "actionItems": ["Action item 1", "Action item 2", "Action item 3"]
    }
  `;

  try {
    const jsonSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
        category: { type: Type.STRING },
        priorityScore: { type: Type.INTEGER },
        justification: { type: Type.STRING },
        actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['summary', 'severity', 'category', 'priorityScore', 'justification', 'actionItems']
    };

    const result = await generateContentWithGemini(prompt, jsonSchema);
    if (result) {
      return res.json(JSON.parse(result));
    }
  } catch (error) {
    console.error('Summarization API error:', error);
  }

  // Smart Mock Fallback in case of error/no key
  const defaultCategories: Record<string, { category: string, score: number, severity: string, items: string[] }> = {
    water: {
      category: 'Civic Infrastructure',
      score: 55,
      severity: 'Medium',
      items: ['Request municipal drainage team with pumps.', 'Deploy volunteer markers.', 'Identify alternative walking routes.']
    },
    traffic: {
      category: 'Traffic & Crowd Management',
      score: 80,
      severity: 'High',
      items: ['Dispatch police control unit to intersection.', 'Set non-emergency detours.', 'Coordinate emergency green-lane.']
    },
    medical: {
      category: 'Medical Emergency',
      score: 85,
      severity: 'High',
      items: ['Alert nearest triage center.', 'Dispatch first-aid volunteers.', 'Clear vehicle pathway.']
    },
  };

  const textLower = `${title} ${description}`.toLowerCase();
  let matched = defaultCategories.water;
  if (textLower.includes('traffic') || textLower.includes('crowd') || textLower.includes('road')) {
    matched = defaultCategories.traffic;
  } else if (textLower.includes('heat') || textLower.includes('faint') || textLower.includes('hurt') || textLower.includes('medical') || textLower.includes('hospital')) {
    matched = defaultCategories.medical;
  }

  res.json({
    summary: `[AI Simulated] ${description.slice(0, 80)}... This incident requires prompt attention.`,
    severity: matched.severity,
    category: matched.category,
    priorityScore: matched.score,
    justification: 'Assessed automatically based on trigger phrases indicating immediate civic/safety impact.',
    actionItems: matched.items
  });
});

// API Route: Detect Duplicate Incident Reports
app.post('/api/gemini/detect-duplicate', async (req, res) => {
  const { newIncident, existingIncidents } = req.body;

  const prompt = `
    You are an AI triage officer for PeaceOS. We just received a new incident report, and need to know if it is a duplicate of any already active incident in the district.
    
    NEW REPORT:
    Title: "${newIncident.title}"
    Description: "${newIncident.description}"
    Location: "${newIncident.location?.address || 'Unknown'}"
    
    EXISTING ACTIVE INCIDENTS:
    ${JSON.stringify(existingIncidents.map((inc: any) => ({ id: inc.id, title: inc.title, description: inc.description, address: inc.location?.address })))}

    Compare details like proximity, timestamps, and descriptive matches.
    
    Format the output as a valid JSON object:
    {
      "isDuplicate": true|false,
      "duplicateOfId": "inc-id-if-duplicate-else-null",
      "confidence": 0.95,
      "reason": "Clear explanation of duplicate relationship or differences."
    }
  `;

  try {
    const jsonSchema = {
      type: Type.OBJECT,
      properties: {
        isDuplicate: { type: Type.BOOLEAN },
        duplicateOfId: { type: Type.STRING },
        confidence: { type: Type.NUMBER },
        reason: { type: Type.STRING }
      },
      required: ['isDuplicate', 'duplicateOfId', 'confidence', 'reason']
    };

    const result = await generateContentWithGemini(prompt, jsonSchema);
    if (result) {
      return res.json(JSON.parse(result));
    }
  } catch (error) {
    console.error('Duplicate detection API error:', error);
  }

  // Smart Mock Fallback
  let isDuplicate = false;
  let duplicateOfId = null;
  let reason = 'Analyzed details. The incident details do not match current active listings.';
  let confidence = 0.90;

  for (const inc of existingIncidents) {
    const titleMatch = inc.title.toLowerCase().split(' ').filter((w: string) => w.length > 4 && newIncident.title.toLowerCase().includes(w)).length;
    if (titleMatch >= 2) {
      isDuplicate = true;
      duplicateOfId = inc.id;
      confidence = 0.85;
      reason = `[AI Simulated] Matches terms and location profile of "${inc.title}" (ID: ${inc.id}).`;
      break;
    }
  }

  res.json({ isDuplicate, duplicateOfId, confidence, reason });
});

// API Route: Multilingual Translation
app.post('/api/gemini/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  const prompt = `
    Translate the following official PeaceOS emergency alert or message into "${targetLanguage}".
    Ensure that the tone is extremely clear, dignified, helpful, and official. Keep any numbers, dates, or symbols intact.
    
    TEXT:
    "${text}"

    Respond ONLY with the raw translation string.
  `;

  try {
    const result = await generateContentWithGemini(prompt);
    if (result) {
      return res.json({ translatedText: result.trim() });
    }
  } catch (error) {
    console.error('Translation API error:', error);
  }

  // Smart Mock Fallback
  const hindiMock: Record<string, string> = {
    'Entrance Gate 2, Shanti Ground, Pune Central': 'प्रवेश द्वार 2, शांति मैदान, पुणे सेंट्रल',
    'Waterlogged Area near Shanti Ground Festival Area': 'शांति ग्राउंड महोत्सव क्षेत्र के पास जलभराव',
    'Traffic Gridlock & Congestion near Hospital Lane': 'अस्पताल गली के पास भारी ट्रैफिक जाम',
  };

  const matched = hindiMock[text] || `[${targetLanguage} Translation of]: ${text}`;
  res.json({ translatedText: matched });
});

// API Route: AI Situation Reports
app.post('/api/gemini/situation-report', async (req, res) => {
  const { incidents, shelters, beds } = req.body;

  const prompt = `
    Create a comprehensive, high-level AI Situation Report (SITREP) for the District Administration Dashboard of PeaceOS.
    The report must reflect the core values of "SHANTI" — peace, pluralism, and human dignity.
    
    CURRENT ACTIVE INCIDENTS:
    ${JSON.stringify(incidents)}
    
    RELIEF SHELTERS:
    ${JSON.stringify(shelters)}
    
    HOSPITAL BED AVAILABILITY:
    ${JSON.stringify(beds)}

    Structure your response as a valid JSON object matching this schema:
    {
      "title": "SHANTI District Cohesion Situation Report",
      "overview": "Overview of current operations and general calm index",
      "criticalAlerts": ["Alert 1", "Alert 2"],
      "resourceStatus": "Summary of shelter & hospital resources",
      "peaceIndex": 85,
      "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
    }
  `;

  try {
    const jsonSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        overview: { type: Type.STRING },
        criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
        resourceStatus: { type: Type.STRING },
        peaceIndex: { type: Type.INTEGER },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['title', 'overview', 'criticalAlerts', 'resourceStatus', 'peaceIndex', 'recommendations']
    };

    const result = await generateContentWithGemini(prompt, jsonSchema);
    if (result) {
      return res.json(JSON.parse(result));
    }
  } catch (error) {
    console.error('SITREP API error:', error);
  }

  // Mock Fallback SITREP
  res.json({
    title: 'PeaceOS District Cohesion Situation Report (Simulated)',
    overview: 'The district is exhibiting steady community cohesion. Public festive activities at Shanti Ground are proceeding under volunteer monitoring, with minor localized waterlogging issues at Entrance Gate 2. Subway congestion and traffic blocks near Hospital Lane are actively being mitigated.',
    criticalAlerts: [
      'Traffic congestions near Hospital Lane are actively routed to preserve ambulance corridors.',
      'Minor crowd convergence at subway gate exit being addressed with queue lines.'
    ],
    resourceStatus: 'Relief Shelters are at 45% capacity. Bed availability is stable across District Centers with 84 standard and 8 ICU beds currently unoccupied.',
    peaceIndex: 88,
    recommendations: [
      'Deploy additional drainage pumps to Shanti Ground to fully clear entranceways.',
      'Deploy volunteer teams to support railway station police with crowd routing.',
      'Keep citizens informed about route closures via PeaceOS push broadcasts.'
    ]
  });
});

// API Route: Smart Notification Suggestions
app.post('/api/gemini/notification-suggestions', async (req, res) => {
  const { incidents } = req.body;

  const prompt = `
    Analyze these critical district incidents and generate 3 smart broadcast notifications to keep citizens safe, prevent panic, and maintain harmony (SHANTI).
    
    INCIDENTS:
    ${JSON.stringify(incidents)}

    For each suggestion, provide a brief title, clear body text, and the category it falls under (emergency, road, weather, or announcement).
    
    Format the output as a valid JSON object matching this schema:
    {
      "suggestions": [
        {
          "title": "Alert Title",
          "body": "Alert message content...",
          "type": "emergency|road|weather|announcement"
        }
      ]
    }
  `;

  try {
    const jsonSchema = {
      type: Type.OBJECT,
      properties: {
        suggestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['emergency', 'road', 'weather', 'announcement'] }
            },
            required: ['title', 'body', 'type']
          }
        }
      },
      required: ['suggestions']
    };

    const result = await generateContentWithGemini(prompt, jsonSchema);
    if (result) {
      return res.json(JSON.parse(result));
    }
  } catch (error) {
    console.error('Notification Suggestions API error:', error);
  }

  // Mock Fallback
  res.json({
    suggestions: [
      {
        title: '⚠️ Harmony Route Road Diverted',
        body: 'Vehicle lane near Hospital Junction is closed for private cars to facilitate ambulance green corridor transit. Please detour through Ring Road.',
        type: 'road'
      },
      {
        title: '💧 Shanti Ground Entrance Gate Update',
        body: 'Due to minor waterlogging at Gate 2, visitors are requested to use Gate 1 or Gate 4 which are clear and dry. Volunteers are present to guide.',
        type: 'announcement'
      },
      {
        title: '🌧️ Pre-Monsoon Heavy Rain Warning',
        body: 'Expect thunder and showers for the next 2 hours. Shelter halls at Harmony Relief Center are open with full hydration stalls.',
        type: 'weather'
      }
    ]
  });
});

// Vite Server Setup for Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PeaceOS running on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
