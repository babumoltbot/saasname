import OpenAI from "openai";
import type { INameGenerator, GeneratedName } from "./interfaces";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const nameGenerator: INameGenerator = {
  async generate(idea: string, count: number): Promise<GeneratedName[]> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a creative startup naming expert. Generate exactly ${count} unique, brandable SaaS name suggestions. Each name should be:
- Short (1-2 words, max 12 characters)
- Easy to spell and pronounce
- Available as a .com domain (use creative variations)
- Memorable and relevant to the idea

Return JSON: { "names": [{ "name": "...", "tagline": "...", "reasoning": "..." }] }`,
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
