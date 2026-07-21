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

export default function AskAbhay() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  const empty = messages.length === 0;

  return (
    <section className="blk wrap" id="ask">
      <div className="ai reveal">
        <div>
          <span className="eyebrow">a small experiment</span>
          <h2 className="dsp">Don&apos;t want to read? Just ask.</h2>
          <p>
            This is a little AI version of me, grounded in my real projects,
            research, and background. Ask what I built, how I think, or whether
            I&apos;d fit your team.
          </p>
          <p className="ai-note mono">
            Powered by Claude · answers only from my own history. For anything
            real, email{" "}
            <a href="mailto:thakur22429s@gmail.com">thakur22429s@gmail.com</a>.
          </p>
        </div>

        <div className="chatbox">
          <div className="hd">◆ ask-abhay</div>

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
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask about my work…"
              aria-label="Ask AI Abhay a question"
              maxLength={2000}
            />
            {busy ? (
              <button type="button" onClick={() => stop()} className="chat-send">
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="chat-send"
                disabled={!input.trim()}
              >
                Send →
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
