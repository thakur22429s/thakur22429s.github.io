"use client";
import { useRef } from "react";
import { experience } from "@/data/content";

export default function Experience() {
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: number) => {
    const el = stripRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".frame");
    const w = card ? card.offsetWidth + 20 : 400;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  const total = String(experience.length).padStart(2, "0");

  return (
    <section className="blk wrap" id="experience">
      <div className="sechd">
        <span className="idx">
          <b>02</b> / path
        </span>
        <h2 className="dsp">Where I&apos;ve worked</h2>
      </div>

      <div className="strip-wrap reveal">
        <div className="strip" ref={stripRef}>
          {experience.map((e, i) => (
            <article className="frame" key={e.role + e.period}>
              <div className="frame-top mono">
                <span>
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
                <span className="frame-when">{e.period}</span>
              </div>
              <h3 className="frame-role dsp">{e.role}</h3>
              <div className="frame-org">
                {e.org} · {e.place}
              </div>
              <ul className="frame-points">
                {e.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="strip-nav">
          <button
            className="strip-btn"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous role"
          >
            ←
          </button>
          <button
            className="strip-btn"
            onClick={() => scrollByCard(1)}
            aria-label="Next role"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
