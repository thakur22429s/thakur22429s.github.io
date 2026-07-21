import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "@/lib/persona";

// Runs as a Vercel Function; allow up to 30s for streaming.
export const maxDuration = 30;

// claude-haiku-4-5: fast + cheap, ample for grounded persona Q&A.
// Bump to "claude-sonnet-5" if you want more depth per answer.
const MODEL = "claude-haiku-4-5";

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
    model: anthropic(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(trimmed),
    temperature: 0.6,
    maxOutputTokens: 700,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
