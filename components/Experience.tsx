"use client";
import { useState } from "react";
import { experience } from "@/data/content";

export default function Experience() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
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
        <h2 className="dsp">Where I&apos;ve worked</h2>
      </div>

      <div className="cards">
        {experience.map((e, i) => {
          const isOpen = open.has(i);
          return (
            <button
              key={e.role + e.period}
              className={`card${isOpen ? " open" : ""}`}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <div className="card-top">
                <div>
                  <div className="card-when mono">{e.period}</div>
                  <div className="card-role dsp">{e.role}</div>
                  <div className="card-org">
                    {e.org} · {e.place}
                  </div>
                </div>
                <span className="card-chev" aria-hidden>
                  ＋
                </span>
              </div>
              <ul className="card-points">
                {e.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </section>
  );
}
