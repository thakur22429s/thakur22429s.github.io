"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import { projects, computeEdges } from "@/data/content";

const REST = "#6f6a60";

type Pt = { x: number; y: number };
type Seg = { x1: number; y1: number; x2: number; y2: number; depth: number };

// Deterministic RNG so each neuron's dendrites are stable across renders.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A branching dendritic arbor in local coordinates (relative to the soma).
function buildDendrites(seed: number): Seg[] {
  const rng = mulberry32(seed * 2654435761);
  const segs: Seg[] = [];
  const grow = (x: number, y: number, ang: number, len: number, depth: number) => {
    if (depth > 3 || len < 3.5) return;
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    segs.push({ x1: x, y1: y, x2, y2, depth });
    const children = depth < 2 ? 2 : 1;
    for (let i = 0; i < children; i++) {
      grow(x2, y2, ang + (rng() - 0.5) * 0.95, len * (0.6 + rng() * 0.16), depth + 1);
    }
  };
  const branches = 5 + Math.floor(rng() * 3);
  for (let b = 0; b < branches; b++) {
    grow(0, 0, (b / branches) * Math.PI * 2 + rng() * 0.6, 15 + rng() * 9, 0);
  }
  return segs;
}

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [modal, setModal] = useState<number | null>(null);
  const [pos, setPos] = useState<Pt[]>([]);
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
    dend: projects.map((_, i) => buildDendrites(i + 1)),
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

      // Force-directed layout of the tech-shared graph.
      const nodes: SimulationNodeDatum[] = projects.map(() => ({}));
      const links = edges.map((e) => ({ source: e.a, target: e.b, w: e.w }));
      const sim = forceSimulation(nodes)
        .force("charge", forceManyBody().strength(-230))
        .force(
          "link",
          forceLink(links)
            .distance((l: { w: number }) => 78 - l.w * 8)
            .strength((l: { w: number }) => 0.25 + l.w * 0.2)
        )
        .force("collide", forceCollide(50))
        .force("center", forceCenter(W / 2, H / 2))
        .force("x", forceX(W / 2).strength(0.05))
        .force("y", forceY(H / 2).strength(0.07))
        .stop();
      for (let i = 0; i < 340; i++) sim.tick();

      // Fit the settled layout into the canvas with padding for arbors + labels.
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      nodes.forEach((n) => {
        minX = Math.min(minX, n.x!);
        minY = Math.min(minY, n.y!);
        maxX = Math.max(maxX, n.x!);
        maxY = Math.max(maxY, n.y!);
      });
      const padX = 90,
        padY = 76;
      const bw = maxX - minX || 1,
        bh = maxY - minY || 1;
      const scale = Math.min((W - 2 * padX) / bw, (H - 2 * padY) / bh);
      const ox = (W - bw * scale) / 2 - minX * scale;
      const oy = (H - bh * scale) / 2 - minY * scale;
      st.base = nodes.map((n) => ({ x: n.x! * scale + ox, y: n.y! * scale + oy }));
      setPos(st.base.map((p) => ({ ...p })));
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
    const darken = (c: string, f: number) => {
      const n = parseInt(c.slice(1), 16);
      return `#${(
        (1 << 24) +
        (Math.round(((n >> 16) & 255) * f) << 16) +
        (Math.round(((n >> 8) & 255) * f) << 8) +
        Math.round((n & 255) * f)
      )
        .toString(16)
        .slice(1)}`;
    };
    const bob = (i: number, t: number): Pt => ({
      x: Math.sin(t * 0.4 + i * 1.7) * 3,
      y: Math.cos(t * 0.34 + i * 2.1) * 3,
    });

    const frame = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (st.started) st.intro = Math.min(1, (now - st.started) / 1100);
      const t = now / 1000;
      // Light theme: boost alpha and darken colors so pulses read on cream.
      const AB = isLight ? 1.9 : 1;
      const ab = (v: number) => {
        const x = v * AB;
        return x > 1 ? 1 : x;
      };
      const RESTc = isLight ? "#5c584f" : REST;
      const nc = (c: string) => (isLight ? darken(c, 0.52) : c);
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

      // axons — the shared-tech connections
      edges.forEach((e) => {
        const A = P(e.a),
          B = P(e.b);
        const a = Math.max(st.act[e.a], st.act[e.b], st.flash[e.a] * 0.6, st.flash[e.b] * 0.6);
        const mx = (A.x + B.x) / 2,
          my = (A.y + B.y) / 2;
        const dx = B.x - A.x,
          dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const cx = mx + (-dy / len) * len * 0.08;
        const cy = my + (dx / len) * len * 0.08;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.quadraticCurveTo(cx, cy, B.x, B.y);
        ctx.strokeStyle = hex(RESTc, ab(0.08 + 0.05 * e.w + 0.14 * a) * st.intro);
        ctx.lineWidth = 0.7 + e.w * 0.25;
        ctx.stroke();
        if (a > 0.03) {
          const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
          g.addColorStop(0, hex(nc(projects[e.a].color), ab(0.5 * a) * st.intro));
          g.addColorStop(1, hex(nc(projects[e.b].color), ab(0.5 * a) * st.intro));
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.9 + 0.8 * a;
          ctx.stroke();
        }
      });

      // firing pulses
      const DUR = 950;
      st.fires = st.fires.filter((f) => {
        const el = now - f.start;
        if (el > DUR) return false;
        const pr = el / DUR,
          ease = 1 - Math.pow(1 - pr, 2);
        const O = P(f.i);
        ctx.strokeStyle = hex(nc(projects[f.i].color), ab((1 - pr) * 0.4) * st.intro);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(O.x, O.y, 6 + ease * 30, 0, 6.29);
        ctx.stroke();
        adj[f.i].forEach((far) => {
          if (pr > 0.9) st.flash[far] = 1;
        });
        return true;
      });

      // neurons — dendritic arbor + soma
      projects.forEach((n, i) => {
        const c = P(i);
        const a = Math.max(st.act[i], st.flash[i]);
        const col = a > 0.04 ? nc(n.color) : RESTc;

        for (const s of st.dend[i]) {
          const fade = 1 - s.depth * 0.22;
          ctx.strokeStyle = hex(col, ab(0.09 + 0.34 * a) * fade * st.intro);
          ctx.lineWidth = Math.max(0.5, 1.5 - s.depth * 0.35);
          ctx.beginPath();
          ctx.moveTo(c.x + s.x1, c.y + s.y1);
          ctx.lineTo(c.x + s.x2, c.y + s.y2);
          ctx.stroke();
        }

        const glow = 5 + a * 14;
        const rg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, glow);
        rg.addColorStop(0, hex(nc(n.color), ab(0.12 + 0.42 * a) * st.intro));
        rg.addColorStop(1, hex(nc(n.color), 0));
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(c.x, c.y, glow, 0, 6.29);
        ctx.fill();

        ctx.fillStyle = hex(nc(n.color), ab(0.7 + 0.3 * a) * st.intro);
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
    <section className="blk wrap" id="work">
      <div className="sechd">
        <span className="idx">
          <b>03</b> / work
        </span>
        <h2 className="dsp">A nervous system of work</h2>
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
            return (
              <div
                key={p.id}
                className={cls}
                style={
                  {
                    left: `${pos[i].x}px`,
                    top: `${pos[i].y}px`,
                    ["--c" as string]: p.color,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setHL(i)}
                onMouseLeave={() => setHL(-1)}
                onClick={() => openProject(i)}
              >
                <div className="hit" />
                <div className="lab">
                  <span className="k">{p.category}</span>
                  <h3>{p.title}</h3>
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
            style={{ ["--c" as string]: m.color } as React.CSSProperties}
          >
            <button className="x" onClick={() => setModal(null)} aria-label="Close">
              ×
            </button>
            <span className="k">{m.category}</span>
            <h3 className="dsp">{m.title}</h3>
            <p>{m.blurb}</p>
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
