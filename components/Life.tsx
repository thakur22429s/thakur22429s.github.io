"use client";
import { useEffect, useRef, useState } from "react";
import { shots } from "@/data/content";

export default function Life() {
  const [idx, setIdx] = useState(0);
  const lastRef = useRef(-1);
  const vfRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const vf = vfRef.current!;
    const onScroll = () => {
      const r = vf.getBoundingClientRect();
      const total = vf.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const i = Math.min(shots.length - 1, Math.floor(p * shots.length));
      if (i !== lastRef.current) {
        lastRef.current = i;
        setIdx(i);
        if (!reduce && flashRef.current) {
          const f = flashRef.current;
          f.style.transition = "none";
          f.style.opacity = ".6";
          requestAnimationFrame(() => {
            f.style.transition = "opacity .45s";
            f.style.opacity = "0";
          });
        }
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const cur = shots[idx];
  const tot = `/ ${String(shots.length).padStart(2, "0")}`;

  return (
    <section id="life">
      <div className="wrap">
        <div className="sechd">
          <span className="idx">
            <b>04</b> / life
          </span>
          <h2 className="dsp">Through the viewfinder</h2>
        </div>
        <p className="sub reveal" style={{ paddingBottom: 20 }}>
          Scroll and the section behaves like a camera — frame lines, a focus
          reticle, an exposure readout, and a frame counter that ticks as each
          shot pulls into focus. Photography, the Airbnb story, and badminton
          live here.
        </p>
      </div>

      <div className="vf" ref={vfRef}>
        <div className="vf-sticky">
          <div className="vf-stage">
            {shots.map((s, i) => (
              <div
                key={s.t}
                className={`shot${i === idx ? " on focus" : ""}`}
              >
                <div className="img" style={{ background: s.img }} />
                <div className="cap">
                  <div className="t dsp">{s.t}</div>
                  <div className="d">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sprocket l">
            {Array.from({ length: 14 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="sprocket r">
            {Array.from({ length: 14 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>

          <div className="vf-ui">
            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />
            <div className="reticle">
              <span />
            </div>
            <div className="vf-read">
              <span className="rec">
                <b />
                REC
              </span>
              <span>{cur.exif[0]}</span>
              <span>{cur.exif[1]}</span>
              <span>{cur.exif[2]}</span>
            </div>
            <div className="vf-count">
              <span className="big">{String(idx + 1).padStart(2, "0")}</span>
              <span>{tot}</span>
            </div>
            <div className="vf-bottom">
              FIELD NOTES · 35MM · {cur.t.toUpperCase()}
            </div>
            <div className="vf-hint">keep scrolling ↓</div>
          </div>
        </div>
      </div>
      <div className="vf-flash" ref={flashRef} aria-hidden />
    </section>
  );
}
