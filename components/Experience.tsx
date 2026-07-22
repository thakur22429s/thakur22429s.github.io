"use client";
import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/content";

type Pt = { x: number; y: number };

export default function Experience() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [pts, setPts] = useState<Pt[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLSpanElement | null)[]>([]);

  const measure = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const next = anchors.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: r.left - wr.left, y: r.top - wr.top };
    });
    setPts(next);
    setDims({ w: wr.width, h: wr.height });
  };

  useEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (wrapRef.current) ro.observe(wrapRef.current);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  // Smooth dotted path through the measured nodes.
  const path =
    pts.length > 1
      ? pts.reduce((acc, p, i) => {
          if (i === 0) return `M ${p.x} ${p.y}`;
          const prev = pts[i - 1];
          const my = (prev.y + p.y) / 2;
          return `${acc} C ${prev.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
        }, "")
      : "";

  return (
    <section className="blk wrap" id="experience">
      <div className="sechd">
        <span className="idx">
          <b>02</b> / path
        </span>
        <h2 className="dsp">The path</h2>
      </div>

      <div className="trail" ref={wrapRef}>
        <svg
          className="trail-svg"
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          aria-hidden
        >
          {path && <path className="trail-path" d={path} />}
          {pts.map((p, i) => (
            <circle
              key={i}
              className={`trail-node${open.has(i) ? " on" : ""}`}
              cx={p.x}
              cy={p.y}
              r={6}
            />
          ))}
        </svg>

        <ol className="trail-stops">
          {experience.map((e, i) => (
            <li
              className={`trail-stop${open.has(i) ? " open" : ""}`}
              key={e.role + e.period}
            >
              <span
                className="trail-anchor"
                ref={(el) => {
                  anchors.current[i] = el;
                }}
              />
              <button
                className="trail-head"
                onClick={() => toggle(i)}
                aria-expanded={open.has(i)}
              >
                <span className="trail-when">{e.period}</span>
                <span className="trail-role">
                  {e.role}
                  <span className="trail-chev" aria-hidden>
                    ›
                  </span>
                </span>
                <span className="trail-org">
                  {e.org} · {e.place}
                </span>
              </button>
              <ul className="trail-points">
                {e.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
