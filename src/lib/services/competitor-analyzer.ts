import OpenAI from "openai";
import type { ICompetitorAnalyzer, Competitor } from "./interfaces";

let _openai: OpenAI | null = null;
function getClient() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export const competitorAnalyzer: ICompetitorAnalyzer = {
  async analyze(name: string, industry: string): Promise<Competitor[]> {
    const response = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a competitive landscape analyst. Find companies or products with similar names in the specified industry. Focus on:
- Direct name matches or very similar names
- Companies in the same or adjacent spaces
- Rate similarity 0-100

Return JSON: { "competitors": [{ "name": "...", "url": "...", "description": "...", "similarity": 0-100 }] }
Return an empty array if no similar competitors found.`,
        },
        {
          role: "user",
          content: `Find competitors with names similar to "${name}" in the ${industry} industry.`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.competitors ?? [];
  },
};
