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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <button
        className={`birdlaunch${open || atContact ? " gone" : ""}`}
        aria-label="Ask AI Abhay"
        onClick={() => setOpen(true)}
      >
        <span className="bl-label">Ask AI Abhay</span>
        <svg className="bl-svg" viewBox="0 0 170 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          {/* branch from the right edge */}
          <path d="M170 92C150 88 132 96 116 102" stroke="#6f5a45" strokeWidth="6" strokeLinecap="round" />
          <path d="M150 92C154 82 162 78 168 76" stroke="#6f5a45" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="163" cy="74" rx="6" ry="3.4" transform="rotate(-30 163 74)" fill="#7f8a5e" />
          <ellipse cx="156" cy="80" rx="5" ry="3" transform="rotate(-20 156 80)" fill="#8b9568" />
          {/* long tail streamers */}
          <g className="bl-tail">
            <path d="M108 118C98 160 118 205 74 280" stroke="#b8784e" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M116 116C112 158 128 200 92 288" stroke="#a96a3f" strokeWidth="2.6" strokeLinecap="round" />
            <ellipse cx="74" cy="280" rx="2.8" ry="4.4" transform="rotate(30 74 280)" fill="#b8784e" />
            <ellipse cx="92" cy="288" rx="2.4" ry="3.8" fill="#a96a3f" />
          </g>
          {/* feet */}
          <path d="M104 108L108 100M114 108L118 100" stroke="#3a3a40" strokeWidth="2" strokeLinecap="round" />
          {/* body + belly */}
          <ellipse cx="110" cy="82" rx="21" ry="27" transform="rotate(-16 110 82)" fill="#bc7245" />
          <path className="bl-wing" d="M116 62C132 66 133 92 120 100C123 86 121 70 116 62Z" fill="#8f542f" />
          <path d="M118 70C127 74 128 88 122 96" stroke="#3a2a20" strokeWidth="1.2" opacity="0.5" />
          <ellipse cx="102" cy="88" rx="9" ry="15" transform="rotate(-16 102 88)" fill="#e7ded0" />
          {/* head, crest, beak, eye */}
          <g className="bl-head">
            <path d="M96 34L104 22M101 33L112 24M105 36L116 30" stroke="#1b1b21" strokeWidth="4" strokeLinecap="round" />
            <circle cx="96" cy="44" r="15" fill="#1b1b21" />
            <path d="M82 44L68 41L82 49Z" fill="#5b7a97" />
            <circle cx="92" cy="41" r="3.4" fill="#6a9bd0" />
            <circle cx="92" cy="41" r="1.7" fill="#0d0d10" />
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
              Hey — I&apos;m AI Abhay. Ask me about my work and I&apos;ll answer
              from what I&apos;ve actually done.
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bub ${m.role === "user" ? "me" : "ai-b"}`}
            >
              {m.role === "assistant" ? (
                <Typewriter text={textOf(m.parts)} />
              ) : (
                textOf(m.parts)
              )}
            </div>
          ))}
          {status === "submitted" && (
            <div className="bub ai-b">
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
