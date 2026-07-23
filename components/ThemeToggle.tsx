"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    const val = next ? "light" : "forest";
    document.documentElement.dataset.theme = val;
    try {
      localStorage.setItem("theme", val);
    } catch {}
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title="Toggle theme"
    >
      <span className="tt-icon" aria-hidden>
        {light ? (
          <svg viewBox="0 0 24 24">
            <path
              d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="12" y1="2.5" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="21.5" />
              <line x1="2.5" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="21.5" y2="12" />
              <line x1="5" y1="5" x2="6.8" y2="6.8" />
              <line x1="17.2" y1="17.2" x2="19" y2="19" />
              <line x1="5" y1="19" x2="6.8" y2="17.2" />
              <line x1="17.2" y1="6.8" x2="19" y2="5" />
            </g>
          </svg>
        )}
      </span>
    </button>
  );
}
