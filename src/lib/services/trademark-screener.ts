import { chatCompletion } from "@/lib/ai-client";
import type { ITrademarkScreener, TrademarkResult } from "./interfaces";

export const trademarkScreener: ITrademarkScreener = {
  async screen(name: string, industry: string): Promise<TrademarkResult> {
    const content = await chatCompletion({
      model: "fast",
      temperature: 0.3,
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

    if (!content) {
      return { riskLevel: "caution", details: "Unable to analyze", similarMarks: [] };
    }

    return JSON.parse(content);
  },
};
