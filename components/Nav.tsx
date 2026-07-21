"use client";
import { useEffect, useState } from "react";
import { profile } from "@/data/content";

const LINKS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "life", label: "Life" },
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
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </span>
      </span>
    </nav>
  );
}
