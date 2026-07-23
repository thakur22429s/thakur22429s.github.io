"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, computeEdges } from "@/data/content";

// Neuron palette: white + gold on dark, gold-only on light. No per-project hues.
const GOLD_DARK = "#E0B85C";
const GOLD_LIGHT = "#9C7420";
const WHITE_REST = "#EAE2D2";

type Pt = { x: number; y: number };

// Deterministic RNG so each connection's organic wobble is stable across renders.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [modal, setModal] = useState<number | null>(null);
  const [pos, setPos] = useState<Pt[]>([]);
  // Outward unit vector per node - the direction its label points (away from
  // the graph centre, into the open margin) so names never sit on connections.
  const [dirs, setDirs] = useState<{ ux: number; uy: number }[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const edges = useMemo(() => computeEdges(), []);
  const adj = useMemo(() => {
    const a = projects.map(() => new Set<number>());
    edges.forEach((e) => {
      a[e.a].add(e.b);
      a[e.b].add(e.a);
    });
    return a;
  }, [edges]);

  const S = useRef({
    act: projects.map(() => 0),
    target: projects.map(() => 0),
    flash: projects.map(() => 0),
    fires: [] as { i: number; start: number }[],
    HL: -1,
    base: [] as Pt[],
    mesh: [] as { a: number; b: number; w: number; seed: number }[],
    intro: 0,
    started: 0,
    lastAmb: 0,
  });

  function setHL(i: number) {
    S.current.HL = i;
    S.current.target = projects.map((_, j) =>
      i < 0 ? 0 : j === i ? 1 : adj[i].has(j) ? 0.75 : 0
    );
    setHovered(i < 0 ? null : i);
  }
  function fire(i: number) {
    S.current.fires.push({ i, start: performance.now() });
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const wrap = wrapRef.current!;
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const st = S.current;

    let isLight = document.documentElement.dataset.theme === "light";
    const themeMO = new MutationObserver(() => {
      isLight = document.documentElement.dataset.theme === "light";
    });
    themeMO.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let W = 0,
      H = 0,
      raf = 0;

    const layout = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Deterministic ellipse ring. Every node sits on ONE loop, so all
      // connections are chords INSIDE the ring and each label sits just OUTSIDE
      // it - a name can never land on a connection. The order groups shared-tech
      // clusters around the loop so the chords stay short instead of tangling.
      const order = [5, 4, 7, 8, 3, 10, 0, 2, 1, 6, 9];
      const cxp = W / 2,
        cyp = H / 2;
      const rx = W / 2 - 190,
        ry = H / 2 - 92;
      st.base = new Array(projects.length);
      order.forEach((idx, k) => {
        const ang = -Math.PI / 2 + (k / order.length) * Math.PI * 2;
        st.base[idx] = {
          x: cxp + rx * Math.cos(ang),
          y: cyp + ry * Math.sin(ang),
        };
      });
      setPos(st.base.map((p) => ({ ...p })));
      // Every label points straight out from the ring centre, into the margin.
      setDirs(
        st.base.map((p) => {
          const dx = p.x - cxp,
            dy = p.y - cyp,
            l = Math.hypot(dx, dy) || 1;
          return { ux: dx / l, uy: dy / l };
        })
      );

      // Connections ARE the dendrites now: only shared-tech edges, plus a single
      // nearest-neighbour lifeline for any node that shares tech with nobody, so
      // no dot is left floating. No decorative or random dangling filaments.
      const meshMap = new Map<string, { a: number; b: number; w: number }>();
      edges.forEach((e) => meshMap.set(`${e.a}-${e.b}`, { a: e.a, b: e.b, w: e.w }));
      const degree = projects.map(() => 0);
      edges.forEach((e) => {
        degree[e.a]++;
        degree[e.b]++;
      });
      for (let i = 0; i < st.base.length; i++) {
        if (degree[i] > 0) continue; // already wired by shared tech
        let best = -1,
          bestD = Infinity;
        for (let j = 0; j < st.base.length; j++) {
          if (j === i) continue;
          const d =
            (st.base[j].x - st.base[i].x) ** 2 + (st.base[j].y - st.base[i].y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = j;
          }
        }
        if (best >= 0) {
          const a = Math.min(i, best),
            b = Math.max(i, best);
          meshMap.set(`${a}-${b}`, { a, b, w: 0.4 });
        }
      }
      st.mesh = [...meshMap.values()].map((e, idx) => ({
        ...e,
        seed: (e.a + 1) * 131 + (e.b + 1) * 977 + idx * 37,
      }));
    };
    layout();
    addEventListener("resize", layout);

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !st.started) st.started = performance.now();
        }),
      { threshold: 0.2 }
    );
    io.observe(wrap);

    const hex = (c: string, a: number) => {
      const n = parseInt(c.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };
    const bob = (i: number, t: number): Pt => ({
      x: Math.sin(t * 0.4 + i * 1.7) * 3,
      y: Math.cos(t * 0.34 + i * 2.1) * 3,
    });

    const frame = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (st.started) st.intro = Math.min(1, (now - st.started) / 1100);
      const t = now / 1000;
      // Light theme: boost alpha so gold reads on the cream background.
      const AB = isLight ? 1.9 : 1;
      const ab = (v: number) => {
        const x = v * AB;
        return x > 1 ? 1 : x;
      };
      // White at rest on dark, gold on activation; gold-only on light.
      const GOLD = isLight ? GOLD_LIGHT : GOLD_DARK;
      const RESTc = isLight ? GOLD_LIGHT : WHITE_REST;
      if (!st.base.length) {
        raf = requestAnimationFrame(frame);
        return;
      }

      if (!reduce && st.started && now - st.lastAmb > 4600) {
        st.lastAmb = now;
        if (st.HL < 0) fire(Math.floor(Math.random() * projects.length));
      }
      for (let i = 0; i < projects.length; i++) {
        st.act[i] += (st.target[i] - st.act[i]) * 0.08;
        st.flash[i] *= 0.94;
      }

      const P = (i: number): Pt => {
        const b = reduce ? { x: 0, y: 0 } : bob(i, t);
        return { x: st.base[i].x + b.x, y: st.base[i].y + b.y };
      };

      // organic filament mesh - dendrite-like connections, densely woven
      st.mesh.forEach((e) => {
        const A = P(e.a),
          B = P(e.b);
        const act = Math.max(
          st.act[e.a],
          st.act[e.b],
          st.flash[e.a] * 0.6,
          st.flash[e.b] * 0.6
        );
        const dx = B.x - A.x,
          dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len,
          ny = dx / len;
        const rng = mulberry32(e.seed);
        const dir = e.seed % 2 ? 1 : -1;
        const segs = 6;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        for (let s = 1; s < segs; s++) {
          const t = s / segs;
          const bulge = Math.sin(t * Math.PI) * (3 + rng() * 5) * dir;
          const j = (rng() - 0.5) * 3.5;
          ctx.lineTo(A.x + dx * t + nx * (bulge + j), A.y + dy * t + ny * (bulge + j));
        }
        ctx.lineTo(B.x, B.y);
        if (act > 0.03) {
          ctx.strokeStyle = hex(GOLD, ab(0.5 * act) * st.intro);
          ctx.lineWidth = 0.8 + 1.0 * act;
        } else {
          ctx.strokeStyle = hex(RESTc, ab(0.06 + 0.05 * e.w) * st.intro);
          ctx.lineWidth = 0.7;
        }
        ctx.stroke();
      });

      // firing pulses
      const DUR = 950;
      st.fires = st.fires.filter((f) => {
        const el = now - f.start;
        if (el > DUR) return false;
        const pr = el / DUR,
          ease = 1 - Math.pow(1 - pr, 2);
        const O = P(f.i);
        ctx.strokeStyle = hex(GOLD, ab((1 - pr) * 0.5) * st.intro);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(O.x, O.y, 6 + ease * 30, 0, 6.29);
        ctx.stroke();
        adj[f.i].forEach((far) => {
          if (pr > 0.9) st.flash[far] = 1;
        });
        return true;
      });

      // neurons - soma dots. White at rest on dark, gold when active or firing.
      projects.forEach((_, i) => {
        const c = P(i);
        const a = Math.max(st.act[i], st.flash[i]);
        const col = a > 0.04 ? GOLD : RESTc;

        const glow = 5 + a * 14;
        const rg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, glow);
        rg.addColorStop(0, hex(col, ab(0.14 + 0.44 * a) * st.intro));
        rg.addColorStop(1, hex(col, 0));
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(c.x, c.y, glow, 0, 6.29);
        ctx.fill();

        ctx.fillStyle = hex(col, ab(0.72 + 0.28 * a) * st.intro);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3.4 + a * 1.8, 0, 6.29);
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", layout);
      io.disconnect();
      themeMO.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const openProject = (i: number) => {
    fire(i);
    setTimeout(() => setModal(i), 420);
  };
  const m = modal != null ? projects[modal] : null;

  return (
    <section className="blk wrap" id="projects">
      <div className="sechd">
        <span className="idx">
          <b>03</b> / projects
        </span>
        <h2 className="dsp">Projects</h2>
      </div>
      <div className="nn" ref={wrapRef}>
        <canvas ref={canvasRef} />
        {pos.length === projects.length &&
          projects.map((p, i) => {
            const cls =
              hovered === i
                ? "nn-node host"
                : hovered != null && adj[hovered].has(i)
                ? "nn-node lit"
                : "nn-node";
            const d = dirs[i] ?? { ux: 0, uy: 1 };
            return (
              <div
                key={p.id}
                className={cls}
                style={
                  {
                    left: `${pos[i].x}px`,
                    top: `${pos[i].y}px`,
                    ["--c" as string]: "var(--gold)",
                  } as React.CSSProperties
                }
                onMouseEnter={() => setHL(i)}
                onMouseLeave={() => setHL(-1)}
                onClick={() => openProject(i)}
              >
                <div className="hit" />
                <div
                  className="lab"
                  style={{
                    left: `calc(50% + ${(d.ux * 12).toFixed(1)}px)`,
                    top: `calc(50% + ${(d.uy * 12).toFixed(1)}px)`,
                    transform: `translate(${
                      d.ux > 0.25 ? "0" : d.ux < -0.25 ? "-100%" : "-50%"
                    }, ${d.uy > 0.25 ? "0" : d.uy < -0.25 ? "-100%" : "-50%"})`,
                  }}
                >
                  <h3>{p.short ?? p.title}</h3>
                </div>
              </div>
            );
          })}
      </div>
      <div className="nn-hint">hover to wake · click to open · wired by shared tech</div>

      <div
        className={modal != null ? "nn-modal open" : "nn-modal"}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(null);
        }}
      >
        <div className="bd" onClick={() => setModal(null)} />
        {m && (
          <div
            className="nn-card"
            style={{ ["--c" as string]: "var(--gold)" } as React.CSSProperties}
          >
            <button className="x" onClick={() => setModal(null)} aria-label="Close">
              ×
            </button>
            <span className="k">{m.category}</span>
            <h3 className="dsp">{m.title}</h3>
            <p>{m.detail}</p>
            <span className="tech">{m.tech}</span>
            {m.link && (
              <a
                className="mlink"
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {m.linkLabel ?? "Visit"} →
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
