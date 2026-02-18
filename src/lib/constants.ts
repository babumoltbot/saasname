export const TIERS = {
  free: {
    name: "Free",
    generationsLimit: 3,
    namesPerGeneration: 5,
    tlds: [".com"],
    features: {
      socialHandles: false,
      trademarkScreening: false,
      competitorAnalysis: false,
      brandScorePreview: true,
      brandScoreFull: false,
    },
  },
  pro: {
    name: "Pro",
    generationsLimit: 50,
    namesPerGeneration: 10,
    tlds: [".com", ".io", ".app", ".dev"],
    features: {
      socialHandles: true,
      trademarkScreening: true,
      competitorAnalysis: true,
      brandScorePreview: true,
      brandScoreFull: true,
    },
  },
} as const;

export type TierName = keyof typeof TIERS;
