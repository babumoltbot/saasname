import { chatCompletion } from "@/lib/ai-client";
import type { ICompetitorAnalyzer, Competitor } from "./interfaces";

export const competitorAnalyzer: ICompetitorAnalyzer = {
  async analyze(name: string, industry: string): Promise<Competitor[]> {
    const content = await chatCompletion({
      model: "fast",
      temperature: 0.3,
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

    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.competitors ?? [];
  },
};
