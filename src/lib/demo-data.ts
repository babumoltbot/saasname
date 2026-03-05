import type { BrandScoreResult } from "@/lib/services/interfaces";

export interface DemoName {
  name: string;
  tagline: string;
  reasoning: string;
  brandScore: BrandScoreResult;
  domains: { domain: string; tld: string; available: boolean }[];
}

export interface DemoJourney {
  id: string;
  input: string;
  label: string;
  names: DemoName[];
}

export const DEMO_JOURNEYS: DemoJourney[] = [
  {
    id: "ai-scheduling",
    input: "AI scheduling tool for consultants",
    label: "AI Scheduling Tool",
    names: [
      {
        name: "Caligo",
        tagline: "Your calendar, finally intelligent",
        reasoning: "Blend of 'calendar' and 'go' — short, punchy, and implies smart scheduling on the move.",
        brandScore: {
          overall: 88,
          breakdown: { memorability: 92, pronounceability: 90, uniqueness: 85, relevance: 82, length: 91 },
          summary: "Highly memorable with a modern, tech-forward feel. Easy to spell and say.",
        },
        domains: [
          { domain: "caligo.com", tld: ".com", available: false },
          { domain: "caligo.io", tld: ".io", available: true },
          { domain: "caligo.app", tld: ".app", available: true },
          { domain: "caligo.dev", tld: ".dev", available: true },
          { domain: "caligo.ai", tld: ".ai", available: false },
          { domain: "caligo.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Slotwise",
        tagline: "Smarter time, better meetings",
        reasoning: "Combines 'slot' (time slot) with 'wise' — communicates intelligent scheduling clearly.",
        brandScore: {
          overall: 82,
          breakdown: { memorability: 80, pronounceability: 95, uniqueness: 72, relevance: 90, length: 78 },
          summary: "Descriptive and instantly clear. Slightly generic but very approachable.",
        },
        domains: [
          { domain: "slotwise.com", tld: ".com", available: true },
          { domain: "slotwise.io", tld: ".io", available: true },
          { domain: "slotwise.app", tld: ".app", available: true },
          { domain: "slotwise.dev", tld: ".dev", available: true },
          { domain: "slotwise.ai", tld: ".ai", available: true },
          { domain: "slotwise.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Calendex",
        tagline: "Index your time. Optimize your day.",
        reasoning: "Portmanteau of 'calendar' and 'index' — suggests organized, data-driven scheduling.",
        brandScore: {
          overall: 85,
          breakdown: { memorability: 86, pronounceability: 88, uniqueness: 80, relevance: 88, length: 84 },
          summary: "Strong brand potential with clear category association. Professional tone.",
        },
        domains: [
          { domain: "calendex.com", tld: ".com", available: false },
          { domain: "calendex.io", tld: ".io", available: true },
          { domain: "calendex.app", tld: ".app", available: true },
          { domain: "calendex.dev", tld: ".dev", available: true },
          { domain: "calendex.ai", tld: ".ai", available: true },
          { domain: "calendex.co", tld: ".co", available: false },
        ],
      },
      {
        name: "Meetra",
        tagline: "Meetings that respect your time",
        reasoning: "Derived from 'meet' with a modern suffix — sounds warm, human, and approachable.",
        brandScore: {
          overall: 79,
          breakdown: { memorability: 82, pronounceability: 86, uniqueness: 74, relevance: 76, length: 88 },
          summary: "Friendly and easy to remember. May need strong branding to stand out.",
        },
        domains: [
          { domain: "meetra.com", tld: ".com", available: true },
          { domain: "meetra.io", tld: ".io", available: true },
          { domain: "meetra.app", tld: ".app", available: true },
          { domain: "meetra.dev", tld: ".dev", available: true },
          { domain: "meetra.ai", tld: ".ai", available: false },
          { domain: "meetra.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Chronofit",
        tagline: "Fit more into every day",
        reasoning: "Greek 'chronos' (time) + 'fit' — implies optimizing time to fit everything in.",
        brandScore: {
          overall: 76,
          breakdown: { memorability: 78, pronounceability: 72, uniqueness: 82, relevance: 74, length: 74 },
          summary: "Unique and distinctive, but slightly harder to spell. Strong for a niche audience.",
        },
        domains: [
          { domain: "chronofit.com", tld: ".com", available: true },
          { domain: "chronofit.io", tld: ".io", available: true },
          { domain: "chronofit.app", tld: ".app", available: true },
          { domain: "chronofit.dev", tld: ".dev", available: true },
          { domain: "chronofit.ai", tld: ".ai", available: true },
          { domain: "chronofit.co", tld: ".co", available: true },
        ],
      },
    ],
  },
  {
    id: "expense-tracker",
    input: "Expense tracker for freelancers",
    label: "Expense Tracker",
    names: [
      {
        name: "Spendly",
        tagline: "Track every dollar, effortlessly",
        reasoning: "Simple derivation of 'spend' with a friendly '-ly' suffix. Instantly communicates purpose.",
        brandScore: {
          overall: 84,
          breakdown: { memorability: 88, pronounceability: 94, uniqueness: 70, relevance: 92, length: 86 },
          summary: "Very approachable and clear. The friendly tone fits the freelancer audience well.",
        },
        domains: [
          { domain: "spendly.com", tld: ".com", available: false },
          { domain: "spendly.io", tld: ".io", available: true },
          { domain: "spendly.app", tld: ".app", available: true },
          { domain: "spendly.dev", tld: ".dev", available: true },
          { domain: "spendly.ai", tld: ".ai", available: true },
          { domain: "spendly.co", tld: ".co", available: false },
        ],
      },
      {
        name: "Ledgr",
        tagline: "Your freelance ledger, simplified",
        reasoning: "Shortened 'ledger' dropping the 'e' — trendy, tech-savvy, and domain-friendly.",
        brandScore: {
          overall: 81,
          breakdown: { memorability: 84, pronounceability: 76, uniqueness: 86, relevance: 80, length: 90 },
          summary: "Distinctive and brandable. Slight spelling ambiguity but strong character.",
        },
        domains: [
          { domain: "ledgr.com", tld: ".com", available: true },
          { domain: "ledgr.io", tld: ".io", available: true },
          { domain: "ledgr.app", tld: ".app", available: true },
          { domain: "ledgr.dev", tld: ".dev", available: true },
          { domain: "ledgr.ai", tld: ".ai", available: true },
          { domain: "ledgr.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Cashpilot",
        tagline: "Autopilot for your cash flow",
        reasoning: "Combines 'cash' with 'pilot' — implies automated financial oversight for freelancers.",
        brandScore: {
          overall: 80,
          breakdown: { memorability: 82, pronounceability: 88, uniqueness: 74, relevance: 86, length: 72 },
          summary: "Clear value proposition in the name. Slightly long but very descriptive.",
        },
        domains: [
          { domain: "cashpilot.com", tld: ".com", available: false },
          { domain: "cashpilot.io", tld: ".io", available: true },
          { domain: "cashpilot.app", tld: ".app", available: true },
          { domain: "cashpilot.dev", tld: ".dev", available: true },
          { domain: "cashpilot.ai", tld: ".ai", available: true },
          { domain: "cashpilot.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Receipto",
        tagline: "Every receipt. Every deduction.",
        reasoning: "Playful twist on 'receipt' with an '-o' ending — fun, memorable, and clear.",
        brandScore: {
          overall: 77,
          breakdown: { memorability: 80, pronounceability: 82, uniqueness: 76, relevance: 78, length: 80 },
          summary: "Memorable and lighthearted. Works well for a consumer-facing freelancer tool.",
        },
        domains: [
          { domain: "receipto.com", tld: ".com", available: true },
          { domain: "receipto.io", tld: ".io", available: true },
          { domain: "receipto.app", tld: ".app", available: true },
          { domain: "receipto.dev", tld: ".dev", available: true },
          { domain: "receipto.ai", tld: ".ai", available: true },
          { domain: "receipto.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Tallyd",
        tagline: "Keep a running tally of your business",
        reasoning: "From 'tally' with a shortened past tense — implies everything is already tracked.",
        brandScore: {
          overall: 75,
          breakdown: { memorability: 78, pronounceability: 72, uniqueness: 80, relevance: 74, length: 82 },
          summary: "Unique spelling may cause confusion but gives a strong, distinctive brand identity.",
        },
        domains: [
          { domain: "tallyd.com", tld: ".com", available: true },
          { domain: "tallyd.io", tld: ".io", available: true },
          { domain: "tallyd.app", tld: ".app", available: true },
          { domain: "tallyd.dev", tld: ".dev", available: true },
          { domain: "tallyd.ai", tld: ".ai", available: true },
          { domain: "tallyd.co", tld: ".co", available: true },
        ],
      },
    ],
  },
  {
    id: "client-portal",
    input: "Client portal for agencies",
    label: "Client Portal",
    names: [
      {
        name: "Portalo",
        tagline: "Your client hub, wide open",
        reasoning: "Direct play on 'portal' with a friendly Italian-inspired ending. Professional yet approachable.",
        brandScore: {
          overall: 83,
          breakdown: { memorability: 86, pronounceability: 90, uniqueness: 78, relevance: 84, length: 82 },
          summary: "Clean, professional, and easy to remember. Strong agency-market fit.",
        },
        domains: [
          { domain: "portalo.com", tld: ".com", available: false },
          { domain: "portalo.io", tld: ".io", available: true },
          { domain: "portalo.app", tld: ".app", available: true },
          { domain: "portalo.dev", tld: ".dev", available: true },
          { domain: "portalo.ai", tld: ".ai", available: true },
          { domain: "portalo.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Cliently",
        tagline: "Client management, done right",
        reasoning: "'Client' + '-ly' suffix — immediately descriptive, warm, and SaaS-friendly.",
        brandScore: {
          overall: 80,
          breakdown: { memorability: 82, pronounceability: 92, uniqueness: 66, relevance: 94, length: 78 },
          summary: "Highly descriptive but common naming pattern. Strong relevance compensates.",
        },
        domains: [
          { domain: "cliently.com", tld: ".com", available: false },
          { domain: "cliently.io", tld: ".io", available: true },
          { domain: "cliently.app", tld: ".app", available: true },
          { domain: "cliently.dev", tld: ".dev", available: true },
          { domain: "cliently.ai", tld: ".ai", available: true },
          { domain: "cliently.co", tld: ".co", available: false },
        ],
      },
      {
        name: "Briefcase",
        tagline: "Everything your client needs, in one place",
        reasoning: "Real word evoking professionalism and organization. Instantly understood.",
        brandScore: {
          overall: 86,
          breakdown: { memorability: 90, pronounceability: 96, uniqueness: 68, relevance: 88, length: 76 },
          summary: "Excellent memorability and professional tone. Domain availability may be challenging.",
        },
        domains: [
          { domain: "briefcase.com", tld: ".com", available: false },
          { domain: "briefcase.io", tld: ".io", available: false },
          { domain: "briefcase.app", tld: ".app", available: true },
          { domain: "briefcase.dev", tld: ".dev", available: true },
          { domain: "briefcase.ai", tld: ".ai", available: true },
          { domain: "briefcase.co", tld: ".co", available: false },
        ],
      },
      {
        name: "Hudlr",
        tagline: "Huddle up with your clients",
        reasoning: "From 'huddle' with a modern shortened spelling. Implies collaboration and closeness.",
        brandScore: {
          overall: 74,
          breakdown: { memorability: 76, pronounceability: 68, uniqueness: 82, relevance: 72, length: 84 },
          summary: "Distinctive but the dropped vowel may cause spelling confusion.",
        },
        domains: [
          { domain: "hudlr.com", tld: ".com", available: true },
          { domain: "hudlr.io", tld: ".io", available: true },
          { domain: "hudlr.app", tld: ".app", available: true },
          { domain: "hudlr.dev", tld: ".dev", available: true },
          { domain: "hudlr.ai", tld: ".ai", available: true },
          { domain: "hudlr.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Deliverabl",
        tagline: "Deliver more than expectations",
        reasoning: "Based on 'deliverable' — core agency concept. The shortened spelling is modern and domain-friendly.",
        brandScore: {
          overall: 72,
          breakdown: { memorability: 74, pronounceability: 70, uniqueness: 78, relevance: 80, length: 58 },
          summary: "Strong concept but the truncation makes it harder to spell and slightly long.",
        },
        domains: [
          { domain: "deliverabl.com", tld: ".com", available: true },
          { domain: "deliverabl.io", tld: ".io", available: true },
          { domain: "deliverabl.app", tld: ".app", available: true },
          { domain: "deliverabl.dev", tld: ".dev", available: true },
          { domain: "deliverabl.ai", tld: ".ai", available: true },
          { domain: "deliverabl.co", tld: ".co", available: true },
        ],
      },
    ],
  },
  {
    id: "habit-tracker",
    input: "Habit tracker with AI coaching",
    label: "AI Habit Tracker",
    names: [
      {
        name: "Habitra",
        tagline: "Build habits that actually stick",
        reasoning: "Blend of 'habit' with a modern suffix — sounds like a personal assistant for habits.",
        brandScore: {
          overall: 86,
          breakdown: { memorability: 88, pronounceability: 90, uniqueness: 82, relevance: 86, length: 86 },
          summary: "Strong, distinctive, and immediately category-relevant. Great startup name.",
        },
        domains: [
          { domain: "habitra.com", tld: ".com", available: true },
          { domain: "habitra.io", tld: ".io", available: true },
          { domain: "habitra.app", tld: ".app", available: true },
          { domain: "habitra.dev", tld: ".dev", available: true },
          { domain: "habitra.ai", tld: ".ai", available: true },
          { domain: "habitra.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Nudgekit",
        tagline: "Gentle nudges, real results",
        reasoning: "Combines 'nudge' (behavioral science term) with 'kit' — implies a toolkit of gentle reminders.",
        brandScore: {
          overall: 81,
          breakdown: { memorability: 84, pronounceability: 86, uniqueness: 80, relevance: 78, length: 76 },
          summary: "Clever reference to behavioral science. Approachable and memorable.",
        },
        domains: [
          { domain: "nudgekit.com", tld: ".com", available: true },
          { domain: "nudgekit.io", tld: ".io", available: true },
          { domain: "nudgekit.app", tld: ".app", available: true },
          { domain: "nudgekit.dev", tld: ".dev", available: true },
          { domain: "nudgekit.ai", tld: ".ai", available: true },
          { domain: "nudgekit.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Routinr",
        tagline: "Your AI-powered daily routine",
        reasoning: "'Routine' with dropped 'e' — trendy spelling that implies structured daily habits.",
        brandScore: {
          overall: 79,
          breakdown: { memorability: 80, pronounceability: 74, uniqueness: 78, relevance: 88, length: 82 },
          summary: "Very relevant but the missing vowel might cause confusion. Strong concept.",
        },
        domains: [
          { domain: "routinr.com", tld: ".com", available: true },
          { domain: "routinr.io", tld: ".io", available: true },
          { domain: "routinr.app", tld: ".app", available: true },
          { domain: "routinr.dev", tld: ".dev", available: true },
          { domain: "routinr.ai", tld: ".ai", available: true },
          { domain: "routinr.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Streakly",
        tagline: "Keep your streak alive",
        reasoning: "Based on 'streak' — the gamification element that drives habit app engagement.",
        brandScore: {
          overall: 83,
          breakdown: { memorability: 86, pronounceability: 90, uniqueness: 74, relevance: 84, length: 80 },
          summary: "Taps into the streak mechanic that users love. Clear and motivating.",
        },
        domains: [
          { domain: "streakly.com", tld: ".com", available: true },
          { domain: "streakly.io", tld: ".io", available: true },
          { domain: "streakly.app", tld: ".app", available: true },
          { domain: "streakly.dev", tld: ".dev", available: true },
          { domain: "streakly.ai", tld: ".ai", available: true },
          { domain: "streakly.co", tld: ".co", available: false },
        ],
      },
      {
        name: "Coachbit",
        tagline: "Tiny coaching, big changes",
        reasoning: "'Coach' + 'bit' — implies bite-sized AI coaching moments throughout the day.",
        brandScore: {
          overall: 78,
          breakdown: { memorability: 80, pronounceability: 84, uniqueness: 76, relevance: 82, length: 76 },
          summary: "Solid compound name that communicates both the AI coaching and micro-habit angle.",
        },
        domains: [
          { domain: "coachbit.com", tld: ".com", available: true },
          { domain: "coachbit.io", tld: ".io", available: true },
          { domain: "coachbit.app", tld: ".app", available: true },
          { domain: "coachbit.dev", tld: ".dev", available: true },
          { domain: "coachbit.ai", tld: ".ai", available: true },
          { domain: "coachbit.co", tld: ".co", available: true },
        ],
      },
    ],
  },
  {
    id: "invoice-generator",
    input: "Invoice generator for contractors",
    label: "Invoice Generator",
    names: [
      {
        name: "Invoiceflow",
        tagline: "Invoices that flow, payments that follow",
        reasoning: "Pairs 'invoice' with 'flow' — suggests smooth, automated invoicing workflows.",
        brandScore: {
          overall: 82,
          breakdown: { memorability: 80, pronounceability: 88, uniqueness: 72, relevance: 94, length: 68 },
          summary: "Highly descriptive and clear. Slightly long but communicates value instantly.",
        },
        domains: [
          { domain: "invoiceflow.com", tld: ".com", available: false },
          { domain: "invoiceflow.io", tld: ".io", available: true },
          { domain: "invoiceflow.app", tld: ".app", available: true },
          { domain: "invoiceflow.dev", tld: ".dev", available: true },
          { domain: "invoiceflow.ai", tld: ".ai", available: true },
          { domain: "invoiceflow.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Billforge",
        tagline: "Forge professional invoices in seconds",
        reasoning: "'Bill' + 'forge' — implies crafting/building invoices with strength and precision.",
        brandScore: {
          overall: 85,
          breakdown: { memorability: 88, pronounceability: 90, uniqueness: 82, relevance: 80, length: 84 },
          summary: "Strong, professional, and distinctive. Good balance of descriptive and brandable.",
        },
        domains: [
          { domain: "billforge.com", tld: ".com", available: true },
          { domain: "billforge.io", tld: ".io", available: true },
          { domain: "billforge.app", tld: ".app", available: true },
          { domain: "billforge.dev", tld: ".dev", available: true },
          { domain: "billforge.ai", tld: ".ai", available: true },
          { domain: "billforge.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Paypulse",
        tagline: "Keep your payments on pulse",
        reasoning: "'Pay' + 'pulse' — implies real-time tracking of payment status.",
        brandScore: {
          overall: 80,
          breakdown: { memorability: 84, pronounceability: 86, uniqueness: 74, relevance: 78, length: 80 },
          summary: "Catchy alliteration gives it good recall. Slightly ambiguous purpose.",
        },
        domains: [
          { domain: "paypulse.com", tld: ".com", available: false },
          { domain: "paypulse.io", tld: ".io", available: true },
          { domain: "paypulse.app", tld: ".app", available: true },
          { domain: "paypulse.dev", tld: ".dev", available: true },
          { domain: "paypulse.ai", tld: ".ai", available: true },
          { domain: "paypulse.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Sendbill",
        tagline: "Create. Send. Get paid.",
        reasoning: "Direct action-oriented compound — says exactly what it does.",
        brandScore: {
          overall: 77,
          breakdown: { memorability: 78, pronounceability: 92, uniqueness: 64, relevance: 90, length: 82 },
          summary: "Extremely clear but generic. Works well as a utility brand.",
        },
        domains: [
          { domain: "sendbill.com", tld: ".com", available: true },
          { domain: "sendbill.io", tld: ".io", available: true },
          { domain: "sendbill.app", tld: ".app", available: true },
          { domain: "sendbill.dev", tld: ".dev", available: true },
          { domain: "sendbill.ai", tld: ".ai", available: true },
          { domain: "sendbill.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Notchpay",
        tagline: "Notch up your invoicing game",
        reasoning: "'Notch' implies quality and precision; 'pay' grounds it in payments.",
        brandScore: {
          overall: 74,
          breakdown: { memorability: 76, pronounceability: 80, uniqueness: 78, relevance: 72, length: 76 },
          summary: "Distinctive but the connection to invoicing isn't immediately obvious.",
        },
        domains: [
          { domain: "notchpay.com", tld: ".com", available: true },
          { domain: "notchpay.io", tld: ".io", available: true },
          { domain: "notchpay.app", tld: ".app", available: true },
          { domain: "notchpay.dev", tld: ".dev", available: true },
          { domain: "notchpay.ai", tld: ".ai", available: true },
          { domain: "notchpay.co", tld: ".co", available: true },
        ],
      },
    ],
  },
  {
    id: "seo-audit",
    input: "SEO audit tool for small businesses",
    label: "SEO Audit Tool",
    names: [
      {
        name: "Rankpilot",
        tagline: "Navigate your way to page one",
        reasoning: "'Rank' (search rankings) + 'pilot' (guidance) — implies expert SEO navigation.",
        brandScore: {
          overall: 84,
          breakdown: { memorability: 86, pronounceability: 88, uniqueness: 78, relevance: 88, length: 78 },
          summary: "Strong metaphor that resonates with the target audience. Professional and clear.",
        },
        domains: [
          { domain: "rankpilot.com", tld: ".com", available: false },
          { domain: "rankpilot.io", tld: ".io", available: true },
          { domain: "rankpilot.app", tld: ".app", available: true },
          { domain: "rankpilot.dev", tld: ".dev", available: true },
          { domain: "rankpilot.ai", tld: ".ai", available: true },
          { domain: "rankpilot.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Sitescore",
        tagline: "Know your site's real score",
        reasoning: "'Site' + 'score' — directly communicates the audit/scoring function.",
        brandScore: {
          overall: 81,
          breakdown: { memorability: 82, pronounceability: 92, uniqueness: 68, relevance: 92, length: 76 },
          summary: "Extremely clear purpose. May face competition from similar names but highly relevant.",
        },
        domains: [
          { domain: "sitescore.com", tld: ".com", available: false },
          { domain: "sitescore.io", tld: ".io", available: true },
          { domain: "sitescore.app", tld: ".app", available: true },
          { domain: "sitescore.dev", tld: ".dev", available: true },
          { domain: "sitescore.ai", tld: ".ai", available: true },
          { domain: "sitescore.co", tld: ".co", available: false },
        ],
      },
      {
        name: "Crawlr",
        tagline: "Deep-crawl your site in seconds",
        reasoning: "From 'crawler' (web crawler) with trendy shortened spelling. Technical credibility.",
        brandScore: {
          overall: 79,
          breakdown: { memorability: 82, pronounceability: 74, uniqueness: 80, relevance: 82, length: 86 },
          summary: "Technical and niche. Appeals to the developer-adjacent audience perfectly.",
        },
        domains: [
          { domain: "crawlr.com", tld: ".com", available: false },
          { domain: "crawlr.io", tld: ".io", available: true },
          { domain: "crawlr.app", tld: ".app", available: true },
          { domain: "crawlr.dev", tld: ".dev", available: true },
          { domain: "crawlr.ai", tld: ".ai", available: true },
          { domain: "crawlr.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Indexly",
        tagline: "Get indexed. Get found.",
        reasoning: "From 'index' (Google indexing) with '-ly' suffix. Friendly and SEO-specific.",
        brandScore: {
          overall: 78,
          breakdown: { memorability: 80, pronounceability: 88, uniqueness: 70, relevance: 80, length: 82 },
          summary: "Clear SEO connection and easy to say. The -ly pattern is common in SaaS.",
        },
        domains: [
          { domain: "indexly.com", tld: ".com", available: false },
          { domain: "indexly.io", tld: ".io", available: true },
          { domain: "indexly.app", tld: ".app", available: true },
          { domain: "indexly.dev", tld: ".dev", available: true },
          { domain: "indexly.ai", tld: ".ai", available: true },
          { domain: "indexly.co", tld: ".co", available: true },
        ],
      },
      {
        name: "Serpwise",
        tagline: "SERP-smart decisions for your business",
        reasoning: "'SERP' (Search Engine Results Page) + 'wise' — for founders who know SEO matters.",
        brandScore: {
          overall: 76,
          breakdown: { memorability: 74, pronounceability: 78, uniqueness: 82, relevance: 84, length: 80 },
          summary: "Niche and insider-y. Strong for an audience that understands SERP terminology.",
        },
        domains: [
          { domain: "serpwise.com", tld: ".com", available: true },
          { domain: "serpwise.io", tld: ".io", available: true },
          { domain: "serpwise.app", tld: ".app", available: true },
          { domain: "serpwise.dev", tld: ".dev", available: true },
          { domain: "serpwise.ai", tld: ".ai", available: true },
          { domain: "serpwise.co", tld: ".co", available: true },
        ],
      },
    ],
  },
];
