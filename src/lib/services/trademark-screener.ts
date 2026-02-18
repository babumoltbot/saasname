import OpenAI from "openai";
import type { ITrademarkScreener, TrademarkResult } from "./interfaces";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const trademarkScreener: ITrademarkScreener = {
  async screen(name: string, industry: string): Promise<TrademarkResult> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a trademark screening assistant. Analyze the given name for potential trademark conflicts in the specified industry. Consider:
- Well-known existing trademarks
- Similar-sounding names in the same space
- Common word combinations that may be registered

Return JSON: { "riskLevel": "clear"|"caution"|"high-risk", "details": "...", "similarMarks": ["..."] }`,
        },
        {
          role: "user",
          content: `Screen the name "${name}" for trademark conflicts in the ${industry} industry.`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { riskLevel: "caution", details: "Unable to analyze", similarMarks: [] };
    }

    return JSON.parse(content);
  },
};
