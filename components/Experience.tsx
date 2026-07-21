"use client";
import { useState } from "react";
import { experience } from "@/data/content";

// Abstract US layout (left→right ≈ west→east) so pins read geographically
// without needing a literal map outline.
const PINS = [
  { place: "Richland, WA", x: 15, y: 20 },
  { place: "West Lafayette, IN", x: 53, y: 31 },
  { place: "New Brunswick, NJ", x: 86, y: 25 },
];

export default function Experience() {
  const [active, setActive] = useState("New Brunswick, NJ");
  const roles = experience.filter((e) => e.place === active);

  return (
    <section className="blk wrap" id="experience">
      <div className="sechd">
        <span className="idx">
          <b>02</b> / path
        </span>
        <h2 className="dsp">Where I&apos;ve been</h2>
      </div>

      <div className="geo">
        <div className="geo-map">
          <svg viewBox="0 0 100 52" className="geo-svg">
            <path className="geo-arc" d="M15 20 Q 34 3 53 31" />
            <path className="geo-arc" d="M53 31 Q 70 5 86 25" />
            {PINS.map((p) => (
              <g
                key={p.place}
                className={`pin${active === p.place ? " on" : ""}`}
                onMouseEnter={() => setActive(p.place)}
                onClick={() => setActive(p.place)}
              >
                <circle className="pin-halo" cx={p.x} cy={p.y} r="4.6" />
                <circle className="pin-dot" cx={p.x} cy={p.y} r="1.9" />
                <text
                  className="pin-city"
                  x={p.x}
                  y={p.y + 6.6}
                  textAnchor="middle"
                >
                  {p.place}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="geo-panel">
          <div className="geo-place mono">{active}</div>
          {roles.map((e, i) => (
            <div className="geo-role" key={e.role + i}>
              <div className="geo-when mono">{e.period}</div>
              <div className="geo-title dsp">{e.role}</div>
              <div className="geo-org">{e.org}</div>
              <ul className="geo-points">
                {e.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
