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
          <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="s-body"
              d="M30 5C43 5 49.5 21 48 43C47 61.5 39.5 75 30 75C20.5 75 13 61.5 12 43C10.5 21 17 5 30 5Z"
              fill="rgba(20,20,27,0.6)"
            />
            <ellipse cx="30" cy="31" rx="12.5" ry="15.5" fill="rgba(240,234,222,0.9)" />
            <ellipse cx="24.6" cy="31" rx="2" ry="3.2" fill="#26262c" />
            <ellipse cx="35.4" cy="31" rx="2" ry="3.2" fill="#26262c" />
            <path
              d="M24 40.5C27.5 43.5 32.5 43.5 36 40.5"
              stroke="rgba(120,108,128,0.5)"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
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
