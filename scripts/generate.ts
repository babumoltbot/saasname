#!/usr/bin/env npx tsx
/**
 * CLI script that runs the same generation + validation pipeline as the app.
 * Uses the exact same service modules — no duplicated prompts.
 *
 * Usage:
 *   npx tsx scripts/generate.ts "A tool that helps consultants schedule LinkedIn posts"
 *   npm run generate -- "A tool that helps consultants schedule LinkedIn posts"
 *
 * Env: Reads from .env in project root (same file as the Next.js app).
 *
 * Options:
 *   --count=N       Number of names to generate (default: 5)
 *   --tlds=.com,.io TLDs to check (default: .com,.io,.app,.dev)
 *   --industry=X    Industry for trademark/competitor analysis (default: technology)
 *   --json          Output raw JSON instead of formatted text
 *   --no-validate   Skip domain/social/trademark/competitor checks
 */

// Load .env from project root (same env the Next.js app uses)
import { readFileSync } from "fs";
import { resolve } from "path";
try {
  const envPath = resolve(__dirname, "..", ".env");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

import { nameGenerator } from "@/lib/services/name-generator";
import { brandScorer } from "@/lib/services/brand-scorer";
import { domainChecker } from "@/lib/services/domain-checker";
import { socialChecker } from "@/lib/services/social-checker";
import { trademarkScreener } from "@/lib/services/trademark-screener";
import { competitorAnalyzer } from "@/lib/services/competitor-analyzer";
import type {
  GeneratedName,
  BrandScoreResult,
  DomainResult,
  SocialResult,
  TrademarkResult,
  Competitor,
} from "@/lib/services/interfaces";

// --- Parse args ---
const args = process.argv.slice(2);
const flags: Record<string, string> = {};
const positional: string[] = [];

for (const arg of args) {
  if (arg.startsWith("--")) {
    const [key, val] = arg.slice(2).split("=");
    flags[key] = val ?? "true";
  } else {
    positional.push(arg);
  }
}

const idea = positional.join(" ").trim();
if (!idea) {
  console.error("Usage: npx tsx scripts/generate.ts \"Your SaaS idea here\"");
  process.exit(1);
}

const count = parseInt(flags.count ?? "5", 10);
const tlds = (flags.tlds ?? ".com,.io,.app,.dev").split(",");
const industry = flags.industry ?? "technology";
const jsonOutput = flags.json === "true";
const skipValidation = flags["no-validate"] === "true";

// --- Helpers ---
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

function scoreColor(score: number) {
  if (score >= 80) return green;
  if (score >= 60) return yellow;
  return red;
}

function bar(val: number, width = 20): string {
  const filled = Math.round((val / 100) * width);
  return green("█".repeat(filled)) + dim("░".repeat(width - filled));
}

// --- Validation for a single name ---
interface NameResult {
  name: GeneratedName;
  brandScore: BrandScoreResult;
  domains?: DomainResult[];
  socials?: SocialResult[];
  trademark?: TrademarkResult;
  competitors?: Competitor[];
}

async function validateName(n: GeneratedName): Promise<NameResult> {
  const [score, domains, socials, trademark, competitors] = await Promise.all([
    brandScorer.score(n.name, idea),
    skipValidation ? Promise.resolve(undefined) : domainChecker.check(n.name, tlds),
    skipValidation ? Promise.resolve(undefined) : socialChecker.check(n.name),
    skipValidation ? Promise.resolve(undefined) : trademarkScreener.screen(n.name, industry),
    skipValidation ? Promise.resolve(undefined) : competitorAnalyzer.analyze(n.name, industry),
  ]);

  return { name: n, brandScore: score, domains, socials, trademark, competitors };
}

// --- Formatted output ---
function printResult(r: NameResult, index: number) {
  const sc = scoreColor(r.brandScore.overall);
  console.log("");
  console.log(`${dim(String(index + 1).padStart(2, "0"))}  ${bold(r.name.name)}  ${sc(`${r.brandScore.overall}/100`)}`);
  console.log(`    ${dim(r.name.tagline)}`);
  console.log(`    ${dim(r.name.reasoning)}`);

  // Brand breakdown
  console.log("");
  console.log(`    ${dim("Brand Score Breakdown:")}`);
  for (const [key, val] of Object.entries(r.brandScore.breakdown)) {
    const label = key.padEnd(16);
    console.log(`    ${dim(label)} ${bar(val)} ${dim(String(val))}`);
  }
  console.log(`    ${dim(r.brandScore.summary)}`);

  // Domains
  if (r.domains) {
    console.log("");
    console.log(`    ${dim("Domains:")}`);
    for (const d of r.domains) {
      const status = d.available ? green("✓ available") : yellow("✗ taken");
      console.log(`    ${dim(d.domain.padEnd(28))} ${status}`);
    }
  }

  // Socials
  if (r.socials) {
    console.log("");
    console.log(`    ${dim("Social Handles:")}`);
    for (const s of r.socials) {
      const platform = (s.platform === "twitter" ? "X" : s.platform).padEnd(12);
      const status = s.available ? green("✓ available") : yellow("✗ taken");
      console.log(`    ${dim(platform)} ${dim(s.handle.padEnd(20))} ${status}`);
    }
  }

  // Trademark
  if (r.trademark) {
    console.log("");
    const risk =
      r.trademark.riskLevel === "clear"
        ? green("CLEAR")
        : r.trademark.riskLevel === "caution"
        ? yellow("CAUTION")
        : red("HIGH RISK");
    console.log(`    ${dim("Trademark:")} ${risk}`);
    console.log(`    ${dim(r.trademark.details)}`);
    if (r.trademark.similarMarks.length > 0) {
      console.log(`    ${dim("Similar marks:")} ${dim(r.trademark.similarMarks.join(", "))}`);
    }
  }

  // Competitors
  if (r.competitors && r.competitors.length > 0) {
    console.log("");
    console.log(`    ${dim("Competitors:")}`);
    for (const c of r.competitors) {
      console.log(`    ${dim("•")} ${c.name} ${dim(`(${c.similarity}% similar)`)} ${dim("—")} ${dim(c.description)}`);
    }
  }
}

// --- Main ---
async function main() {
  console.log("");
  console.log(`${cyan("$")} saasname ${dim(`"${idea}"`)}`);
  console.log("");
  console.log(dim(`Generating ${count} names...`));

  const names = await nameGenerator.generate(idea, count);

  if (names.length === 0) {
    console.error(red("No names generated. Check your OPENAI_API_KEY."));
    process.exit(1);
  }

  console.log(dim(`Validating ${names.length} names...`));

  const results = await Promise.all(names.map(validateName));

  // Sort by brand score descending
  results.sort((a, b) => b.brandScore.overall - a.brandScore.overall);

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // Print header
  console.log("");
  console.log(`${green("─".repeat(60))}`);
  console.log(bold(`  ${names.length} names for: "${idea}"`));
  console.log(`${green("─".repeat(60))}`);

  for (let i = 0; i < results.length; i++) {
    printResult(results[i], i);
  }

  // Summary table
  console.log("");
  console.log(`${green("─".repeat(60))}`);
  console.log(bold("  Summary"));
  console.log(`${green("─".repeat(60))}`);
  console.log("");

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const sc = scoreColor(r.brandScore.overall);
    const domainStr = r.domains
      ? r.domains
          .filter((d) => d.available)
          .map((d) => d.domain)
          .join(", ") || yellow("no domains available")
      : "";
    const tmStr = r.trademark
      ? r.trademark.riskLevel === "clear"
        ? green("clear")
        : r.trademark.riskLevel === "caution"
        ? yellow("caution")
        : red("risk")
      : "";

    console.log(
      `  ${dim(String(i + 1).padStart(2, "0"))}  ${bold(r.name.name.padEnd(14))} ${sc(String(r.brandScore.overall).padStart(3))}  ${tmStr ? dim("tm:") + tmStr + "  " : ""}${dim(domainStr)}`
    );
  }

  console.log("");
}

main().catch((err) => {
  console.error(red(`Error: ${err.message}`));
  process.exit(1);
});
