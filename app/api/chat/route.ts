import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "@/lib/persona";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Runs as a Vercel Function; allow up to 30s for streaming.
export const maxDuration = 30;

// Gemini 2.0 Flash via the free AI Studio API tier. Chosen for speed: the
// available Gemma 4 models (26B/31B) run a mandatory multi-second "thinking"
// pass that can't be disabled, so they can't hit the sub-3s target. Flash has
// no reasoning phase and replies in ~1s.
const MODEL = "gemini-2.0-flash";

// Light guards for a public endpoint.
const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;

export async function POST(req: Request) {
  const rl = checkRateLimit(clientIp(req));
  if (!rl.ok) {
    return new Response("Too many requests — give me a few seconds.", {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

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
    maxOutputTokens: 500,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
