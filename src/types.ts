export interface AnalysisResult {
  score: number;
  analysis: {
    viralPotential: number;
    authorityPotential: number;
    conversionPotential: number;
    engagementPotential: number;
    retentionPotential: number;
  };
  diagnosis: {
    hook: { status: "fuerte" | "debil"; detail: string };
    relevance: { status: "alta" | "baja"; detail: string };
    differentiation: { status: "alta" | "baja"; detail: string };
    emotion: { status: "alta" | "baja"; detail: string };
  };
  improvements: {
    strongerHooks: string[];
    structure: string;
    variantPolarizing: string;
    variantEmotional: string;
  };
  titles: {
    seo: string;
    viral: string;
    emotional: string;
    ctr: string;
  };
  adaptation: {
    tiktok: string;
    linkedin: string;
    youtube: string;
    instagram: string;
  };
  timestamp?: number;
  idea?: string;
}
