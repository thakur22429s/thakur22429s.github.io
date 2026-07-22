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
          {/* branch */}
          <path d="M170 92C150 88 132 96 116 102" stroke="#6f5a45" strokeWidth="6" strokeLinecap="round" />
          <path d="M150 92C154 82 162 78 168 76" stroke="#6f5a45" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="163" cy="74" rx="6" ry="3.4" transform="rotate(-30 163 74)" fill="#7f8a5e" />
          <ellipse cx="156" cy="80" rx="5" ry="3" transform="rotate(-20 156 80)" fill="#8b9568" />
          {/* long flowing tail streamers */}
          <g className="bl-tail">
            {/* back feather - rooted under the body, tapered vane + shaft */}
            <path d="M111 100C106 102 107 110 109 116C116 156 127 198 90 286C88 292 97 294 101 288C132 203 117 158 118 116C119 109 117 101 111 100Z" fill="#a96a3f" />
            <path d="M113 104C111 156 124 198 93 287" stroke="#6f4526" strokeWidth="0.9" opacity="0.4" fill="none" />
            {/* front feather - rooted under the body, tapered vane + shaft */}
            <path d="M103 102C98 104 99 112 101 118C108 158 117 200 71 280C69 286 78 288 82 282C121 203 109 158 111 118C112 111 110 103 103 102Z" fill="#b8784e" />
            <path d="M105 106C101 158 113 200 75 281" stroke="#7d4e2b" strokeWidth="0.9" opacity="0.45" fill="none" />
          </g>
          {/* feet gripping the branch */}
          <path d="M103 110L103 101M103 110L99 113M103 110L107 113" stroke="#33333a" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M115 110L115 101M115 110L111 113M115 110L119 113" stroke="#33333a" strokeWidth="1.8" strokeLinecap="round" />
          {/* body + belly */}
          <ellipse cx="110" cy="84" rx="19" ry="26" transform="rotate(-14 110 84)" fill="#bd7446" />
          <ellipse cx="101" cy="92" rx="8" ry="14" transform="rotate(-14 101 92)" fill="#ece2d2" />
          {/* folded wing with feather tips */}
          <path className="bl-wing" d="M114 60C131 64 133 93 121 105C122 99 118 97 116 101C118 93 113 91 112 95C115 82 112 66 114 60Z" fill="#92562f" />
          <path d="M117 67C126 73 127 89 121 99" stroke="#3a2a1e" strokeWidth="1" opacity="0.45" />
          <path d="M120 72C127 78 128 90 123 98" stroke="#3a2a1e" strokeWidth="1" opacity="0.35" />
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
          {thinking && (
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
