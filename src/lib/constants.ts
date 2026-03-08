// TLDs we can check availability for directly (non-country gTLDs).
// Can be empty — all TLDs will then show "Check externally" links.
export const DIRECT_CHECK_TLDS: string[] = [".com", ".net", ".app", ".dev"];

export const TIERS = {
  pro: {
    name: "Pro",
    generationsLimit: 50,
    namesPerGeneration: 10,
    tlds: [".com", ".net", ".app", ".dev", ".io", ".ai", ".co"],
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
