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

// Google's current free-tier Flash model. Using the "-latest" alias on purpose:
// Google dropped gemini-2.0-flash from the free tier (quota limit went to 0),
// and the alias auto-tracks whatever the current free Flash is so this doesn't
// silently break again. Fast (~2-4s) with no mandatory reasoning pass.
const MODEL = "gemini-flash-latest";

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
