"use client";
import { useEffect, useState } from "react";

const PHRASES = [
  "software engineer",
  "machine learning engineer",
  "graduate researcher",
  "builder & storyteller",
];

// Writes a phrase like ink, holds, then dissolves it away before the next.
export default function MagicInk() {
  const [text, setText] = useState("");
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let idx = 0;
    let ch = 0;

    const run = () => {
      const phrase = PHRASES[idx];
      const type = () => {
        if (cancelled) return;
        if (ch < phrase.length) {
          ch++;
          setText(phrase.slice(0, ch));
          timer = setTimeout(type, 55 + Math.random() * 45);
        } else {
          timer = setTimeout(() => {
            if (cancelled) return;
            setFading(true);
            timer = setTimeout(() => {
              if (cancelled) return;
              setFading(false);
              setText("");
              ch = 0;
              idx = (idx + 1) % PHRASES.length;
              timer = setTimeout(run, 300);
            }, 650);
          }, 1500);
        }
      };
      type();
    };

    timer = setTimeout(run, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <span className={`magicink${fading ? " fading" : ""}`}>
      {text || " "}
      <span className="mi-caret" aria-hidden />
    </span>
  );
}
