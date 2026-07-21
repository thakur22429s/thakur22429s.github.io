"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, projectEdges, moreProjects } from "@/data/content";

const REST = "#6f6a60";

type Pt = { x: number; y: number };

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [modal, setModal] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // adjacency
  const adj = useMemo(() => {
    const a = projects.map(() => new Set<number>());
    projectEdges.forEach(([i, j]) => {
      a[i].add(j);
      a[j].add(i);
    });
    return a;
  }, []);

  // mutable animation state (not React state — read inside RAF)
  const S = useRef({
    act: projects.map(() => 0),
    target: projects.map(() => 0),
    flash: projects.map(() => 0),
    fires: [] as { i: number; start: number }[],
    HL: -1,
    pos: [] as Pt[],
    ctrl: [] as Pt[],
    field: [] as { x: number; y: number; p: number; s: number }[],
    intro: 0,
    started: 0,
    lastAmb: 0,
  });

  function setHL(i: number) {
    S.current.HL = i;
    S.current.target = projects.map((_, j) =>
      i < 0 ? 0 : j === i ? 1 : adj[i].has(j) ? 0.8 : 0
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

    for (let i = 0; i < 50; i++)
      st.field.push({
        x: Math.random(),
        y: Math.random(),
        p: Math.random() * 6.28,
        s: 0.4 + Math.random() * 0.6,
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
      st.pos = projects.map((n) => ({ x: (n.x / 100) * W, y: (n.y / 100) * H }));
      st.ctrl = projectEdges.map(([a, b], k) => {
        const A = st.pos[a],
          B = st.pos[b];
        const mx = (A.x + B.x) / 2,
          my = (A.y + B.y) / 2;
        const dx = B.x - A.x,
          dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const off = (k % 2 ? 1 : -1) * len * 0.12;
        return { x: mx + (-dy / len) * off, y: my + (dx / len) * off };
      });
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
    const qpt = (A: Pt, C: Pt, B: Pt, t: number): Pt => {
      const u = 1 - t;
      return {
        x: u * u * A.x + 2 * u * t * C.x + t * t * B.x,
        y: u * u * A.y + 2 * u * t * C.y + t * t * B.y,
      };
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (st.started) st.intro = Math.min(1, (now - st.started) / 900);
      const t = now / 1000;

      if (!reduce && st.started && now - st.lastAmb > 4400) {
        st.lastAmb = now;
        if (st.HL < 0) fire(Math.floor(Math.random() * projects.length));
      }

      for (let i = 0; i < projects.length; i++) {
        st.act[i] += (st.target[i] - st.act[i]) * 0.08;
        st.flash[i] *= 0.94;
      }

      // faint field
      const fp = st.field.map((f) => ({
        x: (f.x + Math.sin(t * 0.05 * f.s + f.p) * 0.018) * W,
        y: (f.y + Math.cos(t * 0.045 * f.s + f.p) * 0.018) * H,
      }));
      ctx.lineWidth = 1;
      for (let a = 0; a < fp.length; a++)
        for (let b = a + 1; b < fp.length; b++) {
          const dx = fp[a].x - fp[b].x,
            dy = fp[a].y - fp[b].y,
            dd = dx * dx + dy * dy;
          if (dd < 8000) {
            ctx.strokeStyle = `rgba(243,236,222,${0.04 * st.intro * (1 - dd / 8000)})`;
            ctx.beginPath();
            ctx.moveTo(fp[a].x, fp[a].y);
            ctx.lineTo(fp[b].x, fp[b].y);
            ctx.stroke();
          }
        }
      ctx.fillStyle = `rgba(243,236,222,${0.07 * st.intro})`;
      fp.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, 6.29);
        ctx.fill();
      });

      // edges
      projectEdges.forEach(([ea, eb], k) => {
        const A = st.pos[ea],
          B = st.pos[eb],
          C = st.ctrl[k];
        const bright = Math.max(
          st.act[ea],
          st.act[eb],
          st.flash[ea] * 0.6,
          st.flash[eb] * 0.6
        );
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
        ctx.strokeStyle = hex(REST, (0.12 + 0.08 * bright) * st.intro);
        ctx.lineWidth = 1;
        ctx.stroke();
        if (bright > 0.02) {
          const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
          g.addColorStop(0, hex(projects[ea].color, 0.5 * bright * st.intro));
          g.addColorStop(1, hex(projects[eb].color, 0.5 * bright * st.intro));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1 + 0.7 * bright;
          ctx.stroke();
          if (!reduce) {
            const spd = 0.07 + ((k * 29) % 12) / 100;
            const tt = (t * spd + k * 0.13) % 1;
            const sp = qpt(A, C, B, tt);
            ctx.fillStyle = hex(projects[ea].color, 0.6 * bright * st.intro);
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, 1.6, 0, 6.29);
            ctx.fill();
          }
        }
      });

      // firing pulses
      const DUR = 950;
      st.fires = st.fires.filter((f) => {
        const el = now - f.start;
        if (el > DUR) return false;
        const pr = el / DUR,
          ease = 1 - Math.pow(1 - pr, 2);
        const O = st.pos[f.i];
        ctx.strokeStyle = hex(projects[f.i].color, (1 - pr) * 0.45 * st.intro);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(O.x, O.y, 6 + ease * 32, 0, 6.29);
        ctx.stroke();
        projectEdges.forEach(([ea, eb], k) => {
          if (ea !== f.i && eb !== f.i) return;
          const far = ea === f.i ? eb : ea;
          const A = st.pos[f.i],
            B = st.pos[far],
            C = st.ctrl[k];
          const sp = qpt(A, C, B, ease);
          ctx.fillStyle = hex(projects[f.i].color, (1 - pr * 0.6) * 0.7 * st.intro);
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.8, 0, 6.29);
          ctx.fill();
          if (pr > 0.92) st.flash[far] = 1;
        });
        return true;
      });

      // somas
      projects.forEach((n, i) => {
        const P = st.pos[i];
        const a = Math.max(st.act[i], st.flash[i]);
        const glow = 5 + a * 15;
        const rg = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, glow);
        rg.addColorStop(0, hex(n.color, (0.12 + 0.45 * a) * st.intro));
        rg.addColorStop(1, hex(n.color, 0));
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(P.x, P.y, glow, 0, 6.29);
        ctx.fill();
        ctx.strokeStyle = hex(a > 0.05 ? n.color : REST, (0.14 + 0.4 * a) * st.intro);
        ctx.lineWidth = 1;
        for (let s = 0; s < 5; s++) {
          const ang = (s / 5) * 6.28 + i;
          const l = 5 + a * 5;
          ctx.beginPath();
          ctx.moveTo(P.x + Math.cos(ang) * 5, P.y + Math.sin(ang) * 5);
          ctx.lineTo(P.x + Math.cos(ang) * (5 + l), P.y + Math.sin(ang) * (5 + l));
          ctx.stroke();
        }
        ctx.fillStyle = hex(n.color, 0.82 * st.intro);
        ctx.beginPath();
        ctx.arc(P.x, P.y, 3.8 + a * 2, 0, 6.29);
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", layout);
      io.disconnect();
    };
  }, []);

  // Esc closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const openProject = (i: number) => {
    fire(i);
    setTimeout(() => setModal(i), 360);
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
      <p className="sub reveal">
        At rest the neurons sit dormant. Hover one to wake it and trace its
        connections; click to fire the synapse — and open the project.
      </p>

      <div className="nn" ref={wrapRef}>
        <canvas ref={canvasRef} />
        {projects.map((p, i) => {
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
                  left: `${p.x}%`,
                  top: `${p.y}%`,
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
      <div className="nn-hint">hover to wake · click to fire</div>

      <div className="more">
        {moreProjects.map((mp) => (
          <span className="m" key={mp.title}>
            <b>{mp.title}</b> — {mp.note}
          </span>
        ))}
      </div>

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
