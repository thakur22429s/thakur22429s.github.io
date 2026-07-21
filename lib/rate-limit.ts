// Lightweight in-memory rate limiting for the public /api/chat endpoint.
//
// State lives per serverless instance, so this is a pragmatic first guard
// against casual spam + a backstop for the Gemma free-tier quota — not a
// distributed limit. If the site gets real traffic, back this with Upstash
// Redis (@upstash/ratelimit) for a shared, exact limit across instances.

type Window = { count: number; reset: number };

const PER_IP = { windowMs: 30_000, max: 8 }; // 8 messages / 30s per visitor
const GLOBAL = { windowMs: 60_000, max: 60 }; // 60 messages / min across all

const ipHits = new Map<string, Window>();
let globalWin: Window = { count: 0, reset: Date.now() + GLOBAL.windowMs };

export function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Global backstop first — protects the model quota even under an IP-spread flood.
  if (now > globalWin.reset) globalWin = { count: 0, reset: now + GLOBAL.windowMs };
  globalWin.count++;
  if (globalWin.count > GLOBAL.max) {
    return { ok: false, retryAfter: Math.ceil((globalWin.reset - now) / 1000) };
  }

  // Per-IP window.
  let w = ipHits.get(ip);
  if (!w || now > w.reset) {
    w = { count: 0, reset: now + PER_IP.windowMs };
    ipHits.set(ip, w);
  }
  w.count++;

  // Bound memory: drop expired entries once the map grows.
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) if (now > v.reset) ipHits.delete(k);
  }

  if (w.count > PER_IP.max) {
    return { ok: false, retryAfter: Math.ceil((w.reset - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}
