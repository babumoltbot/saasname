import OpenAI from "openai";
import type { INameGenerator, GeneratedName } from "./interfaces";

let _openai: OpenAI | null = null;
function getClient() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export const nameGenerator: INameGenerator = {
  async generate(idea: string, count: number): Promise<GeneratedName[]> {
    const response = await getClient().chat.completions.create({
      model: "gpt-4o",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert startup naming consultant and brand strategist.

Generate exactly ${count} unique, brandable SaaS name suggestions for the product described below.

Requirements for each name:
- Short, memorable, and easy to pronounce (prefer 1-3 syllables)
- Suitable for a technology company
- Prefer invented or compound words over generic dictionary phrases
- Avoid names already widely used by major companies
- No hyphens, numbers, or difficult spellings
- Should work well as a .com domain (favor uncommon word constructions)
- Must sound professional and trustworthy
- Should scale globally (not region-specific)
- Easy to spell after hearing once
- Distinct from overused startup suffixes like "AI", "App", "HQ" unless they truly fit
- Suitable for logo design and easy to search on Google

Generate a diverse mix of naming styles:
- Invented words (e.g., "Zapier", "Calendly")
- Compound tech names (e.g., "Webflow", "Mailchimp")
- Abstract brand names (e.g., "Notion", "Figma")
- Slightly descriptive but still brandable (e.g., "Airtable", "Canva")

Avoid names that feel generic, spammy, or auto-generated. Prefer names that could plausibly become a venture-scale brand.

Return JSON: { "names": [{ "name": "...", "tagline": "One-line brand tagline", "reasoning": "Why this name fits the product and its style category (Invented/Compound/Abstract/Descriptive)" }] }`,
        },
        {
          role: "user",
          content: `Generate ${count} SaaS name ideas for: ${idea}`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.names.slice(0, count);
  },
};
