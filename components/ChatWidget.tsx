"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

const textOf = (parts: { type: string; text?: string }[] | undefined) =>
  (parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");

// Reveals assistant text progressively (typewriter), even as it streams in.
function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN((v) => Math.min(text.length, v + 1)), 18);
    return () => clearTimeout(id);
  }, [n, text]);
  useEffect(() => {
    setN((v) => (v > text.length ? text.length : v));
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="tw-caret" aria-hidden />}
    </>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop, setMessages } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const last = messages[messages.length - 1];
  const lastAssistantText =
    last && last.role === "assistant" ? textOf(last.parts) : "";
  // Keep the dots looping until the reply actually starts rendering.
  const thinking = busy && lastAssistantText.length === 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // anime.js module, loaded on the client only.
  const animeRef = useRef<typeof import("animejs") | null>(null);

  // Openable from anywhere: an `open-chat` event or any [data-open-chat] click.
  useEffect(() => {
    const openIt = () => setOpen(true);
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (t instanceof Element && t.closest("[data-open-chat]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("open-chat", openIt);
    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-chat", openIt);
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Hide the perched bird near the bottom of the page (the contact section)
  // so it never covers the form.
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 560;
      setAtContact(nearBottom);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  const empty = messages.length === 0;

  // The bird chirps: a comic bubble pops and musical notes float up.
  const chirp = () => {
    const a = animeRef.current;
    const bird = document.querySelector(".birdlaunch");
    if (!a || !bird || bird.classList.contains("gone")) return;
    a.animate(".bl-note", {
      translateY: [0, -30],
      translateX: () => -6 + Math.random() * 12,
      opacity: [0, 1, 0],
      rotate: () => -16 + Math.random() * 32,
      delay: a.stagger(150),
      duration: 1300,
      ease: "out(2)",
    });
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    import("animejs").then((m) => {
      if (cancelled) return;
      animeRef.current = m;
      interval = setInterval(chirp, 9000);
    });
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button
        className={`birdlaunch${open || atContact ? " gone" : ""}`}
        aria-label="Ask AI Abhay"
        onClick={() => setOpen(true)}
        onMouseEnter={chirp}
      >
        <span className="bl-label">Ask AI Abhay</span>
        <span className="bl-notes" aria-hidden>
          <span className="bl-note">♪</span>
          <span className="bl-note">♫</span>
          <span className="bl-note">♩</span>
        </span>
        <svg className="bl-svg" viewBox="0 0 170 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          {/* branch - juts out both sides */}
          <path d="M170 92C150 88 132 96 116 102C96 108 72 108 46 115" stroke="#6f5a45" strokeWidth="6" strokeLinecap="round" />
          <path d="M150 92C154 82 162 78 168 76" stroke="#6f5a45" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="163" cy="74" rx="6" ry="3.4" transform="rotate(-30 163 74)" fill="#7f8a5e" />
          <ellipse cx="156" cy="80" rx="5" ry="3" transform="rotate(-20 156 80)" fill="#8b9568" />
          <ellipse cx="49" cy="111" rx="5" ry="3" transform="rotate(28 49 111)" fill="#7f8a5e" />
          {/* long flowing tail streamers */}
          <g className="bl-tail">
            {/* back feather - rooted at the rump (right of feet), curving down-left */}
            <path d="M123 98C118 100 119 108 121 114C132 148 126 192 92 288C90 294 99 296 103 290C136 192 130 148 131 114C132 107 130 99 123 98Z" fill="#a96a3f" />
            <path d="M125 102C130 148 124 192 96 289" stroke="#6f4526" strokeWidth="0.9" opacity="0.4" fill="none" />
            {/* front feather - rooted at the rump (right of feet), curving down-left */}
            <path d="M117 100C112 102 113 110 115 116C126 150 120 194 74 282C72 288 81 290 85 284C128 194 124 150 125 116C126 109 124 101 117 100Z" fill="#b8784e" />
            <path d="M119 104C124 150 118 194 78 283" stroke="#7d4e2b" strokeWidth="0.9" opacity="0.45" fill="none" />
          </g>
          {/* feet gripping the branch */}
          <path d="M103 99L103 105M103 105L107 108M103 105L99 108" stroke="#33333a" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M115 99L115 102M115 102L119 105M115 102L111 105" stroke="#33333a" strokeWidth="1.8" strokeLinecap="round" />
          {/* body + belly */}
          <ellipse cx="110" cy="84" rx="19" ry="26" transform="rotate(-14 110 84)" fill="#bd7446" />
          <ellipse cx="101" cy="92" rx="8" ry="14" transform="rotate(-14 101 92)" fill="#ece2d2" />
          {/* folded wing - a full, solid main feather */}
          <path className="bl-wing" d="M116 57C138 61 141 95 124 112C121 103 122 88 118 76C116 68 114 62 116 57Z" fill="#8a4e2a" />
          <path d="M119 64C130 74 131 95 125 108" stroke="#3a2418" strokeWidth="1" opacity="0.5" fill="none" />
          <path d="M123 72C131 80 131 96 126 106" stroke="#3a2418" strokeWidth="1" opacity="0.4" fill="none" />
          {/* head, swept crest, beak, eye */}
          <g className="bl-head">
            <path d="M100 30C106 19 112 15 120 13" stroke="#1a1a20" strokeWidth="4" strokeLinecap="round" />
            <path d="M97 31C102 22 108 18 115 17" stroke="#1a1a20" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M102 33C109 26 116 24 123 24" stroke="#1a1a20" strokeWidth="3" strokeLinecap="round" />
            <circle cx="94" cy="43" r="15" fill="#1a1a20" />
            <path d="M80 44L63 47L80 50Z" fill="#566f8a" />
            <circle cx="89" cy="41" r="3.4" fill="none" stroke="#6a9bd0" strokeWidth="1.4" />
            <circle cx="89" cy="41" r="1.9" fill="#0d0d12" />
            <circle cx="90" cy="40.2" r="0.7" fill="#fff" />
          </g>
        </svg>
      </button>

      <div
        className={`chat-pop${open ? " open" : ""}`}
        role="dialog"
        aria-label="Ask AI Abhay"
        aria-hidden={!open}
      >
        <div className="chat-pop-hd">
          <span className="chat-pop-title">
            <span className="chat-pop-dot" />
            Ask AI Abhay
          </span>
          <div className="chat-pop-actions">
            {messages.length > 0 && (
              <button
                type="button"
                className="chat-reset"
                onClick={() => setMessages([])}
                disabled={busy}
              >
                clear
              </button>
            )}
            <button
              type="button"
              className="chat-x"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="chat-log" ref={scrollRef}>
          {empty && (
            <div className="bub ai-b">
              Hey - I&apos;m AI Abhay. Ask me about my work and I&apos;ll answer
              from what I&apos;ve actually done.
            </div>
          )}
          {messages.map((m) => {
            const text = textOf(m.parts);
            // Don't render an empty assistant bubble while we wait for text.
            if (m.role === "assistant" && text.length === 0) return null;
            return (
              <div
                key={m.id}
                className={`bub ${m.role === "user" ? "me" : "ai-b"}`}
              >
                {m.role === "assistant" ? <Typewriter text={text} /> : text}
              </div>
            );
          })}
          {thinking && (
            <div className="typing-row">
              <span className="typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
          {error && (
            <div className="bub ai-b chat-err">
              Something went wrong. Try again in a moment.
            </div>
          )}
        </div>

        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask about my work…"
            aria-label="Ask AI Abhay a question"
            maxLength={2000}
          />
          {busy ? (
            <button type="button" className="chat-send" onClick={() => stop()}>
              Stop
            </button>
          ) : (
            <button type="submit" className="chat-send" disabled={!input.trim()}>
              Send →
            </button>
          )}
        </form>

        <div className="chat-pop-foot mono">
          Powered by Google Gemma · for anything real,{" "}
          <a href="mailto:thakur22429s@gmail.com">email me</a>.
        </div>
      </div>
    </>
  );
}
