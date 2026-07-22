"use client";
import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/content";

type Pt = { x: number; y: number };
// Gentle wind offset from the center line (px, can be negative).
const windX = (i: number) => Math.sin(i * 0.9) * 30;

export default function Experience() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [pts, setPts] = useState<Pt[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [progress, setProgress] = useState(0);
  const [pathLen, setPathLen] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const anchors = useRef<(HTMLSpanElement | null)[]>([]);

  const measure = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    setPts(
      anchors.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - wr.left, y: r.top - wr.top };
      })
    );
    setDims({ w: wr.width, h: wr.height });
  };

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
  useEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Path length for the draw-in animation.
  useEffect(() => {
    if (drawRef.current) {
      try {
        setPathLen(drawRef.current.getTotalLength());
      } catch {}
    }
  }, [pts]);

  // Scroll progress through the section (0 → 1).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const p = Math.min(
        1,
        Math.max(0, (innerHeight * 0.62 - r.top) / (r.height || 1))
      );
      setProgress(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal each stop once it scrolls into view.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.i);
            setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    wrapRef.current?.querySelectorAll(".trail-stop").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Pop each node in (anime.js) as its stop is revealed.
  const poppedNodes = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (seen.size === 0) return;
    import("animejs").then(({ animate }) => {
      const circles = wrapRef.current?.querySelectorAll(".trail-node");
      if (!circles) return;
      seen.forEach((i) => {
        if (poppedNodes.current.has(i)) return;
        poppedNodes.current.add(i);
        const c = circles[i];
        if (c) animate(c, { scale: [0.2, 1], duration: 650, ease: "outBack" });
      });
    });
  }, [seen]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const path =
    pts.length > 1
      ? pts.reduce((acc, p, i) => {
          if (i === 0) return `M ${p.x} ${p.y}`;
          const prev = pts[i - 1];
          const my = (prev.y + p.y) / 2;
          return `${acc} C ${prev.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
        }, "")
      : "";
  const reachedY = progress * dims.h;

  return (
    <section className="blk wrap" id="experience">
      <div className="sechd">
        <span className="idx">
          <b>02</b> / work
        </span>
        <h2 className="dsp">Work I&apos;ve done</h2>
      </div>

      <div className="trail" ref={wrapRef}>
        <svg
          className="trail-svg"
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          aria-hidden
        >
          {path && <path className="trail-track" d={path} />}
          {path && (
            <path
              ref={drawRef}
              className="trail-draw"
              d={path}
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: pathLen * (1 - progress),
              }}
            />
          )}
          {pts.map((p, i) => (
            <circle
              key={i}
              className={`trail-node${p.y <= reachedY + 6 ? " on" : ""}`}
              cx={p.x}
              cy={p.y}
              r={6}
            />
          ))}
        </svg>

        <ol className="trail-stops">
          {experience.map((e, i) => (
            <li
              className={`trail-stop${open.has(i) ? " open" : ""}${
                seen.has(i) ? " in" : ""
              }`}
              key={e.role + e.period}
              data-i={i}
            >
              <span
                className="trail-anchor"
                style={{ ["--wx" as string]: `${windX(i)}px` } as React.CSSProperties}
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
                <span className="trail-role">{e.role}</span>
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
