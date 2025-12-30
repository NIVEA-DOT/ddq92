import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult, VisionAnalysis } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateAnalysis = async (input: UserInput): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Vision Analysis
  let visionData: VisionAnalysis | null = null;
  
  if (input.userPhoto) {
    try {
      const imageBase64 = await fileToGenerativePart(input.userPhoto);
      
      const visionPrompt = `
        Role: Physiognomy Data Analyst.
        Task: Extract facial features for a relationship psychology report.
        Tone: Clinical, Objective, Descriptive.
        
        Analyze the face and return strictly this JSON:
        {
          "eyes": { "position": {"x": number, "y": number}, "impression_keywords": ["string"], "notes": "string" },
          "nose": { "position": {"x": number, "y": number}, "impression_keywords": ["string"], "notes": "string" },
          "mouth": { "position": {"x": number, "y": number}, "impression_keywords": ["string"], "notes": "string" },
          "overall_vibe": "string"
        }
      `;

      const visionResp = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: input.userPhoto.type, data: imageBase64 } },
            { text: visionPrompt }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });
      
      if (visionResp.text) {
        visionData = JSON.parse(visionResp.text);
      }
    } catch (e) {
      console.error("Vision analysis failed", e);
      // Fallback
      visionData = {
        eyes: { position: { x: 50, y: 40 }, impression_keywords: ["Clear"], notes: "Observant" },
        nose: { position: { x: 50, y: 55 }, impression_keywords: ["Straight"], notes: "Principled" },
        mouth: { position: { x: 50, y: 70 }, impression_keywords: ["Firm"], notes: "Articulate" },
        overall_vibe: "Composed"
      };
    }
  }

  // 2. Text Analysis (Synthesize Report)
  const textPrompt = `
    Role: Senior Relationship Consultant & Behavioral Analyst.
    Language: **KOREAN (한국어)**.
    Task: Generate a high-end, 10-page analysis report (Confidential).

    [User Data]
    - Issue: "${input.issueType}"
    - Birth Date: ${input.birthDate}
    - Gender: ${input.gender}
    - Birth Time: ${input.birthTime || "Unknown (Assume hypothetical analysis based on date)"}
    - Vision Analysis Data: ${JSON.stringify(visionData)}

    [CRITICAL INSTRUCTION: DEPTH & LENGTH]
    The user requires a **highly detailed, text-heavy report**. 
    - **DO NOT** be brief. 
    - **DO NOT** use short summaries. 
    - **MUST WRITE** at least 150-200 words (3-5 rich paragraphs) for MAIN sections.
    - Every explanation must include the "Psychological Mechanism", "Structural Reason", and "Real-world Manifestation".
    - Tone: Empathetic but clinically sharp. Like a very expensive psychiatric consultation.

    [Content Strategy]
    1. **Structure over Fortune**: Do not predict the future. Explain the *structure* of why patterns repeat.
    2. **Contrast Principle**: Highlight gaps between their 'Saju' (Inner Nature) and 'Physiognomy' (Outer Persona). E.g., "You look tough (Tiger) but are soft inside (Rabbit)."
    3. **Action-Oriented**: Provide micro-actions, not just advice.
    4. **Grinding Concept**: Frame relationships as a skill to be "ground" and polished.

    [10-Page Report Structure & Requirements]
    
    1. **Executive Summary**: Core conflict loop & 3 key findings.
    2. **Foundation Layer (Nature)**: 
       - Core Energy: Detailed analysis of their Saju energy (Day Master). 
       - Emotional Baseline: How they process feelings deeply.
    3. **Persona Layer (Face)**: Visual first impressions vs. reality. *Use vision data.*
    4. **Inflow Pattern (Attraction Trap)**: 
       - Attraction Trigger: Detailed description of the 'signal' they emit.
       - Partner Type: Detailed profile of the wrong partner type they attract.
       - Failure Point: In-depth analysis of why it breaks.
    5. **Conflict Mechanism**: The specific loop of how fights escalate.
    6. **Shadow Layer (Subconscious)**: 
       - Subconscious Craving: A deep dive into their hidden needs (Shadow).
       - Manifestation: How this ruins relationships practically.
    7. **Communication Filters**: Detailed examples of distortion.
    8. **Timeline & Seasonality**: Current relationship "season" (Winter/Spring etc.) and timing.
    9. **Action Layer**: Immediate tactics, scripts, and flag checks.
    10. **Grinding Roadmap**: Long-term evolution plan (Awareness -> Calibration -> Mastery).

    Return STRICT JSON matching the schema below. ALL STRING VALUES MUST BE IN KOREAN.

    JSON SCHEMA:
    {
      "executive_summary": {
        "report_title": "LovePattern Analysis Report",
        "analysis_target": "String",
        "purpose": "String",
        "key_findings": ["String (Detailed sentence)", "String (Detailed sentence)", "String (Detailed sentence)"],
        "structural_summary": "String (Long paragraph summarizing the core issue)"
      },
      "foundation_layer": {
        "title": "Page 2: Inner Nature Analysis",
        "core_energy": "String (VERY DETAILED: Explain main Saju energy, strengths, weaknesses in love. At least 200 words.)",
        "emotional_baseline": "String (Detailed paragraph on how they process emotions)",
        "decision_pattern": "String (Detailed paragraph on how they make choices under stress)",
        "hidden_potential": "String (Detailed paragraph on their growth potential)"
      },
      "persona_layer": {
        "title": "Page 3: Outer Persona & Impression",
        "face_analysis_summary": "String (Detailed analysis based on vision data)",
        "misunderstanding_point": "String (Detailed contrast: 'People think X, but you are actually Y...')",
        "first_impression_impact": "String (How this affects initial dating phases)",
        "visual_strategy": "String (Specific advice on style/expression)"
      },
      "inflow_layer": {
        "title": "Page 4: The Attraction Trap",
        "attraction_trigger": "String (What specific vibe attracts partners? Be descriptive.)",
        "partner_type_attracted": "String (Detailed profile of the partner type drawn to them)",
        "why_it_fails": "String (Structural reason why this specific pairing fails)",
        "pattern_break_tip": "String (Actionable advice to change the signal)"
      },
      "conflict_layer": {
        "title": "Page 5: Conflict Mechanism",
        "trigger_point": "String (Detailed scenario that triggers them)",
        "defense_mechanism": "String (Deep dive into their Saju-based defense mode)",
        "escalation_pattern": "String (Step-by-step description of how things get worse)",
        "de_escalation_key": "String (The golden key to stop the fight)"
      },
      "shadow_layer": {
        "title": "Page 6: Subconscious Shadow",
        "conscious_desire": "String (What they claim to want)",
        "subconscious_craving": "String (What they secretly chase - The Shadow)",
        "shadow_manifestation": "String (Long paragraph: How this shadow sabotage stability)",
        "integration_advice": "String (How to make peace with the shadow)"
      },
      "communication_layer": {
        "title": "Page 7: Communication Filters",
        "my_filter": "String (Detailed analysis of their speaking style)",
        "listener_distortion": "String (How partners misinterpret them)",
        "correction_examples": [
          { "original": "String", "distortion": "String", "correction": "String" },
          { "original": "String", "distortion": "String", "correction": "String" }
        ]
      },
      "timeline_layer": {
        "title": "Page 8: Timing & Seasonality",
        "current_season": "String (Metaphorical season description)",
        "caution_period": "String (Detailed warning for specific times)",
        "opportunity_window": "String (When to act)",
        "long_term_flow": "String (Life-long relationship luck flow)"
      },
      "action_layer": {
        "title": "Page 9: Tactical Action Plan",
        "immediate_fixes": ["String (Actionable)", "String (Actionable)", "String (Actionable)"],
        "red_flags": ["String", "String"],
        "green_flags": ["String", "String"],
        "scripts": [
          { "situation": "String", "script": "String (Actual dialogue)" },
          { "situation": "String", "script": "String (Actual dialogue)" }
        ]
      },
      "roadmap_layer": {
        "title": "Page 10: Grinding Roadmap",
        "phase_1_awareness": "String (Detailed step 1)",
        "phase_2_calibration": "String (Detailed step 2)",
        "phase_3_mastery": "String (Detailed step 3)",
        "final_message": "String (Inspiring closing statement)"
      }
    }
  `;

  const textResp = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: textPrompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  if (!textResp.text) throw new Error("No analysis generated");
  
  const finalResult = JSON.parse(textResp.text) as AnalysisResult;
  
  if (visionData) {
    finalResult.vision_coordinates = visionData;
  }

  return finalResult;
};
