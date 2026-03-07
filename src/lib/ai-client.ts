import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type AIProvider = "openai" | "anthropic";

type ModelTier = "primary" | "fast";

const MODEL_DEFAULTS: Record<AIProvider, Record<ModelTier, string>> = {
  openai: { primary: "gpt-4o", fast: "gpt-4o-mini" },
  anthropic: { primary: "claude-sonnet-4-6", fast: "claude-haiku-4-5-20251001" },
};

const MODEL_ENV_KEYS: Record<AIProvider, Record<ModelTier, string>> = {
  openai: { primary: "OPENAI_PRIMARY_MODEL", fast: "OPENAI_FAST_MODEL" },
  anthropic: { primary: "ANTHROPIC_PRIMARY_MODEL", fast: "ANTHROPIC_FAST_MODEL" },
};

export function getProvider(): AIProvider {
  const p = process.env.AI_PROVIDER?.toLowerCase();
  if (p === "anthropic") return "anthropic";
  return "openai";
}

function resolveModel(tier: ModelTier): string {
  const provider = getProvider();
  return process.env[MODEL_ENV_KEYS[provider][tier]] || MODEL_DEFAULTS[provider][tier];
}

let _openai: OpenAI | null = null;
let _anthropic: Anthropic | null = null;

function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

function extractJSON(text: string): string {
  // Strip markdown fences
  const stripped = text.replace(/```(?:json)?\s*/g, "").replace(/```/g, "");
  // Find outermost { ... }
  const start = stripped.indexOf("{");
  if (start === -1) return text;
  let depth = 0;
  for (let i = start; i < stripped.length; i++) {
    if (stripped[i] === "{") depth++;
    else if (stripped[i] === "}") {
      depth--;
      if (depth === 0) return stripped.slice(start, i + 1);
    }
  }
  return stripped.slice(start);
}

export async function chatCompletion(params: {
  model: ModelTier;
  temperature: number;
  messages: { role: "system" | "user"; content: string }[];
}): Promise<string> {
  const provider = getProvider();
  const model = resolveModel(params.model);

  if (provider === "anthropic") {
    const systemMsg = params.messages.find((m) => m.role === "system");
    const userMsgs = params.messages.filter((m) => m.role === "user");

    const systemPrompt = systemMsg
      ? systemMsg.content + "\n\nIMPORTANT: Respond with valid JSON only. No markdown fences, no preamble, no explanation outside the JSON."
      : undefined;

    const response = await getAnthropic().messages.create({
      model,
      max_tokens: 4096,
      temperature: params.temperature,
      system: systemPrompt,
      messages: userMsgs.map((m) => ({ role: "user" as const, content: m.content })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return extractJSON(text);
  }

  // OpenAI
  const response = await getOpenAI().chat.completions.create({
    model,
    temperature: params.temperature,
    response_format: { type: "json_object" },
    messages: params.messages,
  });

  return response.choices[0].message.content ?? "";
}
