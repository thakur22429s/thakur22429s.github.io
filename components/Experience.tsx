"use client";
import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/content";

export default function Experience() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const fpRef = useRef<HTMLDivElement>(null);

  // Draw the path in when the section scrolls into view.
  useEffect(() => {
    const el = fpRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="blk wrap" id="experience">
      <div className="sechd">
        <span className="idx">
          <b>02</b> / path
        </span>
        <h2 className="dsp">The route so far</h2>
      </div>

      <div className="fp" ref={fpRef}>
        <ol className="fp-stops">
          {experience.map((e, i) => {
            const isOpen = open.has(i);
            return (
              <li
                className={`fp-stop${isOpen ? " open" : ""}${i === 0 ? " now" : ""}`}
                key={e.role + e.period}
                style={{ ["--i" as string]: String(i) } as React.CSSProperties}
              >
                <button
                  className="fp-head"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className="fp-when">{e.period}</span>
                  <span className="fp-role dsp">
                    {e.role}
                    <span className="fp-chev" aria-hidden>
                      ›
                    </span>
                  </span>
                  <span className="fp-org">
                    {e.org} · {e.place}
                  </span>
                </button>
                <ul className="fp-points">
                  {e.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
