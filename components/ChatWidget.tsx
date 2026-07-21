"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

const SUGGESTIONS = [
  "What's his strongest project?",
  "Researcher or builder?",
  "Tell me about Badminton-Sense",
  "Is he open to SWE or ML roles?",
];

const textOf = (parts: { type: string; text?: string }[] | undefined) =>
  (parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
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
        className={`ask-spark${open ? " gone" : ""}`}
        aria-label="Ask AI Abhay"
        onClick={() => setOpen(true)}
      >
        <span className="spark-label">Ask AI Abhay</span>
        <span className="spirit" aria-hidden>
          <svg viewBox="0 0 64 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* long paradise-flycatcher tail streamers */}
            <g className="fc-tail">
              <path d="M31 54C27 66 31 76 25 92" stroke="#b8977e" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M35 54C33 66 37 78 33 94" stroke="#a9876e" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="25" cy="92" rx="2.4" ry="3.4" transform="rotate(20 25 92)" fill="#b8977e" />
              <ellipse cx="33" cy="94" rx="2" ry="3" fill="#a9876e" />
            </g>
            {/* body + belly */}
            <ellipse cx="34" cy="42" rx="11" ry="14" transform="rotate(-18 34 42)" fill="#c2a48c" />
            <ellipse cx="31" cy="46" rx="6" ry="9" transform="rotate(-18 31 46)" fill="#e6dccb" />
            {/* wing */}
            <path className="fc-wing" d="M36 34C46 36 46 50 38 52C40 44 39 38 36 34Z" fill="#a9876e" />
            {/* head + crest + beak */}
            <circle cx="41" cy="24" r="8.5" fill="#7d6353" />
            <path d="M41 15L38 8L44 12Z" fill="#7d6353" />
            <path d="M49 24L56 23L49 27Z" fill="#33312e" />
            <circle cx="44" cy="23" r="1.6" fill="#26262c" />
            <circle cx="44.5" cy="22.4" r="0.5" fill="#fff" />
          </svg>
        </span>
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
              {textOf(m.parts)}
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

        {empty && (
          <div className="chat-chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

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
