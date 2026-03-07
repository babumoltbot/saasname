import { chatCompletion } from "@/lib/ai-client";
import type { INameGenerator, GeneratedName, Clarification, ClarificationQuestion } from "./interfaces";

export function buildMessages(idea: string, count: number, clarifications?: Clarification[]) {
  const hasClarifications = clarifications?.some((c) => c.answer.trim());
  const clarificationContext = hasClarifications
    ? `\n\nThe founder provided additional context — use this to tailor industry, tone, naming style, and audience fit:\n${clarifications!
        .filter((c) => c.answer.trim())
        .map((c) => `Q: ${c.question}\nA: ${c.answer}`)
        .join("\n\n")}`
    : "";

  const industryLine = hasClarifications
    ? "- Suitable for the industry and audience described by the founder"
    : "- Suitable for a technology company";

  const scaleLine = hasClarifications
    ? "- Should match the founder's described brand ambition and tone"
    : "- Prefer names with personality and character that a solo founder or small team would be proud to build under";

  return [
    {
      role: "system" as const,
      content: `You are an expert startup naming consultant and brand strategist.

Generate exactly ${count} unique, brandable name suggestions for the product described below.

Requirements for each name:
- Single-word names: 1-3 syllables. Multi-word names (2-3 short words): max 5 syllables total.
${industryLine}
- Prefer invented or compound words over generic dictionary phrases
- Avoid names already widely used by major companies
- No hyphens, numbers, or difficult spellings
- Should work as a domain name — short, no special characters, easy to type
- Should feel approachable and have personality — warm or clever beats corporate-sounding
- Should scale globally (not region-specific)
- Easy to spell after hearing once
- Should evoke a positive emotion or mental image related to the product's value
- Prefer names with strong, punchy consonant sounds (K, T, P, Z) — avoid names that sound like existing common words when spoken aloud
- Avoid overused startup suffixes/prefixes: -ly, -ify, -io, -hub, -lab, -stack, AI-, Get-, My-, Go- — unless the founder's context specifically calls for them
- Suitable for logo design and easy to search on Google
- None of the ${count} names should share the same root word, prefix, or suffix pattern — maximize variety

Generate a diverse mix of naming styles:
- Invented words (e.g., "Plausible", "Fathom")
- Compound names (e.g., "Buttondown", "Carrd")
- Abstract brand names (e.g., "Pika", "Lemon Squeezy")
- Slightly descriptive but still brandable (e.g., "Typefully", "Tally")

${scaleLine}
Avoid names that feel generic, spammy, or auto-generated. Do NOT generate names like "SmartTask Pro", "DataSync Hub", or "QuickBuild" — these are forgettable.

Return JSON: { "names": [{ "name": "...", "tagline": "One-line brand tagline", "reasoning": "The specific wordplay, etymology, or phonetic trick behind this name and why it fits" }] }`,
    },
    {
      role: "user" as const,
      content: `Generate ${count} name ideas for: ${idea}${clarificationContext}`,
    },
  ];
}

export const nameGenerator: INameGenerator = {
  async generate(idea: string, count: number, clarifications?: Clarification[]): Promise<GeneratedName[]> {
    const content = await chatCompletion({
      model: "primary",
      temperature: 0.8,
      messages: buildMessages(idea, count, clarifications),
    });

    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.names.slice(0, count);
  },

  async generateQuestions(idea: string): Promise<ClarificationQuestion[]> {
    const content = await chatCompletion({
      model: "fast",
      temperature: 0.7,
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

    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.questions.slice(0, 5);
  },
};
