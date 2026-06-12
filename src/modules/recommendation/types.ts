export type RecommendationInput = {
  merchantSlug: string;
  objective: string;
  budgetLevel: "low" | "medium" | "high";
  targetAudience: "local" | "thai-traveler" | "international";
  customName?: string;
  customBusinessType?: "MASSAGE" | "SPA" | "WELLNESS_TOURISM";
  customLocation?: string;
};

export type RecommendationItem = {
  title: string;
  reason: string;
  score: number;
  category: "menu" | "massage-technique" | "partner" | "identity" | "promotion";
};

export type RecommendationResult = {
  ruleScore: number;
  summary: string;
  items: RecommendationItem[];
  llmNarrative?: string;
  llmModel?: string;
};
