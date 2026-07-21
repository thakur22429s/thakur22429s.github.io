"use client";
import { useEffect, useState } from "react";

// A small glowing light that drifts and bounces in the corner, pulling the
// eye toward the Ask-AI section. Hides itself once that section is in view.
export default function AskSpark() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const ask = document.getElementById("ask");
    if (!ask) return;
    const io = new IntersectionObserver(([e]) => setGone(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(ask);
    return () => io.disconnect();
  }, []);

  return (
    <button
      className={`ask-spark${gone ? " gone" : ""}`}
      aria-label="Ask AI Abhay"
      onClick={() =>
        document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" })
      }
    >
      <span className="spark-label">Ask AI Abhay</span>
      <span className="spark-orbit" aria-hidden>
        <span className="spark-core" />
      </span>
    </button>
  );
}
