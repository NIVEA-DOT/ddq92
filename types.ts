export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  PAYMENT = 'PAYMENT',
  INTAKE = 'INTAKE',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  DASHBOARD = 'DASHBOARD'
}

export interface Product {
  id: string;
  title: string;
  price: number; // USD
  description: string;
  badge?: string;
  features: string[];
}

export interface UserInput {
  issueType: string;
  birthDate: string;
  birthTime?: string;
  gender: 'female' | 'male' | 'other';
  partnerBirthDate?: string;
  partnerBirthTime?: string;
  partnerGender?: 'female' | 'male' | 'other';
  userPhoto: File | null;
  partnerPhoto?: File | null;
  additionalInfo?: string; 
}

// Vision Analysis
export interface FacialFeature {
  position: { x: number; y: number };
  impression_keywords: string[];
  notes: string;
}

export interface VisionAnalysis {
  eyes: FacialFeature;
  nose: FacialFeature;
  mouth: FacialFeature;
  overall_vibe: string;
}

// Detailed 10-Page Report Schema
export interface AnalysisResult {
  // Page 1: Executive Summary
  executive_summary: {
    report_title: string;
    analysis_target: string;
    purpose: string;
    key_findings: string[];
    structural_summary: string;
  };
  
  // Page 2: Foundation Layer (Inner Nature / Saju)
  foundation_layer: {
    title: string;
    core_energy: string;
    emotional_baseline: string;
    decision_pattern: string;
    hidden_potential: string;
  };

  // Page 3: Persona Layer (Outer / Physiognomy) - NEW
  persona_layer: {
    title: string;
    face_analysis_summary: string;
    misunderstanding_point: string; // The gap between face and heart
    first_impression_impact: string;
    visual_strategy: string;
  };
  
  // Page 4: Inflow Pattern (Attraction Trap) - NEW
  inflow_layer: {
    title: string;
    attraction_trigger: string; // What attracts others to me
    partner_type_attracted: string; // The specific type I attract
    why_it_fails: string; // The repetitive failure point
    pattern_break_tip: string;
  };

  // Page 5: Conflict Layer (The Fight Loop)
  conflict_layer: {
    title: string;
    trigger_point: string;
    defense_mechanism: string; // Saju based defense
    escalation_pattern: string; // How it gets worse
    de_escalation_key: string;
  };

  // Page 6: Shadow Layer (Subconscious Desires) - NEW
  shadow_layer: {
    title: string;
    conscious_desire: string; // What I say I want
    subconscious_craving: string; // What I actually chase
    shadow_manifestation: string; // How this ruins things
    integration_advice: string;
  };

  // Page 7: Communication Filters (Translation)
  communication_layer: {
    title: string;
    my_filter: string; // How I speak
    listener_distortion: string; // How they hear it
    correction_examples: Array<{
      original: string;
      distortion: string;
      correction: string;
    }>;
  };

  // Page 8: Timeline & Seasonality - NEW
  timeline_layer: {
    title: string;
    current_season: string; // Metaphorical season
    caution_period: string;
    opportunity_window: string;
    long_term_flow: string;
  };
  
  // Page 9: Action Layer (Immediate Tactics)
  action_layer: {
    title: string;
    immediate_fixes: string[];
    red_flags: string[];
    green_flags: string[];
    scripts: Array<{ situation: string; script: string }>;
  };

  // Page 10: Grinding Roadmap (Long-term) - NEW
  roadmap_layer: {
    title: string;
    phase_1_awareness: string;
    phase_2_calibration: string;
    phase_3_mastery: string;
    final_message: string;
  };

  vision_coordinates?: VisionAnalysis;
}

export interface Report {
  id: string;
  date: string;
  productTitle: string;
  result: AnalysisResult;
  userPhotoUrl: string; 
  userName?: string;
}
