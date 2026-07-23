"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Enable only on fine pointers (mouse), after mount.
  useEffect(() => {
    if (window.matchMedia("(pointer:fine)").matches) setEnabled(true);
  }, []);

  // Attach tracking only once the cursor elements are actually in the DOM
  // (i.e. after `enabled` flips true and the divs render). Grabbing the refs
  // in the same tick we set `enabled` would read null and throw every frame.
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = innerWidth / 2,
      my = innerHeight / 2,
      rx = mx,
      ry = my,
      raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const isHot = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("a,button,.btn,.nn-node,[data-cursor]");
    const over = (e: MouseEvent) => {
      if (isHot(e.target)) ring.classList.add("hot");
    };
    const out = (e: MouseEvent) => {
      if (isHot(e.target)) ring.classList.remove("hot");
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div className="cdot" ref={dotRef} aria-hidden />
      <div className="cring" ref={ringRef} aria-hidden />
    </>
  );
}
