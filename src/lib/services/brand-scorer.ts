import OpenAI from "openai";
import type { IBrandScorer, BrandScoreResult } from "./interfaces";

let _openai: OpenAI | null = null;
function getClient() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export const brandScorer: IBrandScorer = {
  async score(name: string, idea: string): Promise<BrandScoreResult> {
    const response = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a brand naming expert. Score the given name on a 0-100 scale across these dimensions:
- memorability: How easy is it to remember?
- pronounceability: How easy is it to say out loud?
- uniqueness: How distinctive is it?
- relevance: How well does it relate to the product idea?
- length: Score based on ideal length (shorter is generally better, 4-8 chars ideal)

Compute an overall score (weighted average). Provide a brief summary.

Return JSON: { "overall": 0-100, "breakdown": { "memorability": 0-100, "pronounceability": 0-100, "uniqueness": 0-100, "relevance": 0-100, "length": 0-100 }, "summary": "..." }`,
        },
        {
          role: "user",
          content: `Score the brand name "${name}" for a product described as: ${idea}`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return {
        overall: 50,
        breakdown: { memorability: 50, pronounceability: 50, uniqueness: 50, relevance: 50, length: 50 },
        summary: "Unable to score",
      };
    }

    return JSON.parse(content);
  },
};
