"use client";
import { useEffect, useState } from "react";
import { profile } from "@/data/content";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Work" },
  { id: "projects", label: "Projects" },
  // { id: "life", label: "Life" }, // hidden until photos are ready
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="nav">
      <a href="#top" className="nm dsp">
        {profile.name}
      </a>
      <span className="links">
        <span className="nav-sections">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "active" : undefined}
            >
              {l.label}
            </a>
          ))}
        </span>
        <span className="nav-external">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="nav-ico"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.4.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.03-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.22.7.83.58C20.56 22.3 24 17.79 24 12.5 24 5.87 18.63.5 12 .5z" />
            </svg>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="nav-ico"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z" />
            </svg>
          </a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
          <ThemeToggle />
        </span>
      </span>
    </nav>
  );
}
