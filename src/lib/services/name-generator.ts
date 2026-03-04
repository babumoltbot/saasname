import OpenAI from "openai";
import type { INameGenerator, GeneratedName, Clarification, ClarificationQuestion } from "./interfaces";

let _openai: OpenAI | null = null;
function getClient() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export function buildMessages(idea: string, count: number, clarifications?: Clarification[]) {
  const clarificationContext = clarifications?.length
    ? `\n\nAdditional context from the founder:\n${clarifications
        .filter((c) => c.answer.trim())
        .map((c) => `Q: ${c.question}\nA: ${c.answer}`)
        .join("\n\n")}`
    : "";

  return [
    {
      role: "system" as const,
      content: `You are an expert startup naming consultant and brand strategist.

Generate exactly ${count} unique, brandable name suggestions for the product described below.

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
- Can be 3 words too if .com availability will be higher

Avoid names that feel generic, spammy, or auto-generated. Prefer names that could plausibly become a venture-scale brand.

Return JSON: { "names": [{ "name": "...", "tagline": "One-line brand tagline", "reasoning": "Why this name fits the product and its style category (Invented/Compound/Abstract/Descriptive)" }] }`,
    },
    {
      role: "user" as const,
      content: `Generate ${count} name ideas for: ${idea}${clarificationContext}`,
    },
  ];
}

export const nameGenerator: INameGenerator = {
  async generate(idea: string, count: number, clarifications?: Clarification[]): Promise<GeneratedName[]> {
    const response = await getClient().chat.completions.create({
      model: "gpt-4o",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: buildMessages(idea, count, clarifications),
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.names.slice(0, count);
  },

  async generateQuestions(idea: string): Promise<ClarificationQuestion[]> {
    const response = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You help founders name their products. Given a brief product idea, generate up to 5 short clarifying questions that would help produce better, more targeted name suggestions.

Focus on questions about:
- Target audience and customer type
- Brand tone/personality (playful, serious, premium, etc.)
- Industry or niche specifics
- Key differentiator or unique angle
- Any naming preferences or constraints

Each question has a "type":
- "single-select": user picks ONE option. Best for mutually exclusive choices (tone, audience segment, etc.). Provide 3-5 options.
- "multi-select": user picks ONE OR MORE options. Best when multiple answers apply (features, values, keywords). Provide 4-6 options.
- "text": freeform input. Use ONLY when choices can't reasonably cover the answer (e.g. "describe your unique angle").

IMPORTANT: Prefer single-select and multi-select over text. At most 1 out of 5 questions should be "text" type. Users drop off when they have to type.

Return JSON: { "questions": [{ "id": "q1", "question": "...", "type": "single-select"|"multi-select"|"text", "options": ["..."] (required for select types, omit for text), "placeholder": "..." (for text type only) }] }

Keep questions concise (one sentence). Options should be short (1-4 words each).`,
        },
        {
          role: "user",
          content: `Product idea: ${idea}`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.questions.slice(0, 5);
  },
};
