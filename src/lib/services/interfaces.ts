export interface GeneratedName {
  name: string;
  tagline: string;
  reasoning: string;
}

export interface INameGenerator {
  generate(idea: string, count: number): Promise<GeneratedName[]>;
}

export interface DomainResult {
  domain: string;
  tld: string;
  available: boolean;
}

export interface IDomainChecker {
  check(name: string, tlds: string[]): Promise<DomainResult[]>;
}

export interface SocialResult {
  platform: "twitter" | "linkedin" | "instagram";
  handle: string;
  available: boolean;
}

export interface ISocialChecker {
  check(name: string): Promise<SocialResult[]>;
}

export interface TrademarkResult {
  riskLevel: "clear" | "caution" | "high-risk";
  details: string;
  similarMarks: string[];
}

export interface ITrademarkScreener {
  screen(name: string, industry: string): Promise<TrademarkResult>;
}

export interface Competitor {
  name: string;
  url: string;
  description: string;
  similarity: number; // 0-100
}

export interface ICompetitorAnalyzer {
  analyze(name: string, industry: string): Promise<Competitor[]>;
}

export interface BrandScoreBreakdown {
  memorability: number;
  pronounceability: number;
  uniqueness: number;
  relevance: number;
  length: number;
}

export interface BrandScoreResult {
  overall: number; // 0-100
  breakdown: BrandScoreBreakdown;
  summary: string;
}

export interface IBrandScorer {
  score(name: string, idea: string): Promise<BrandScoreResult>;
}
