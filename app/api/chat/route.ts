import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "@/lib/persona";

// Runs as a Vercel Function; allow up to 30s for streaming.
export const maxDuration = 30;

// Google's open Gemma model via the free AI Studio API tier.
// Gemma has no system role; the provider prepends `system` to the first
// user message automatically. "gemma-4-26b-a4b-it" (MoE) is faster/lighter.
const MODEL = "gemma-4-31b-it";

// Light guards for a public endpoint.
const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;

export async function POST(req: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  // Only keep the most recent turns, and reject oversized inputs.
  const trimmed = messages.slice(-MAX_MESSAGES);
  const lastText = trimmed
    .filter((m) => m.role === "user")
    .flatMap((m) => m.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
  if (lastText.length > MAX_CHARS) {
    return new Response("Message too long", { status: 413 });
  }

  const result = streamText({
    model: google(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(trimmed),
    temperature: 0.6,
    maxOutputTokens: 700,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
