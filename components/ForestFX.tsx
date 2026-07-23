// Ambient forest fireflies for the default (dark) theme.
// Static configs so SSR and client render identically (no hydration mismatch).
const FIREFLIES = [
  { x: "12%", y: "30%", drift: "22s", glow: "5s", delay: "0s" },
  { x: "78%", y: "22%", drift: "26s", glow: "6.5s", delay: "1.2s" },
  { x: "40%", y: "60%", drift: "19s", glow: "4.5s", delay: "0.6s" },
  { x: "88%", y: "55%", drift: "24s", glow: "7s", delay: "2.1s" },
  { x: "22%", y: "72%", drift: "21s", glow: "5.5s", delay: "1.6s" },
  { x: "60%", y: "16%", drift: "28s", glow: "6s", delay: "0.9s" },
  { x: "50%", y: "84%", drift: "23s", glow: "5.2s", delay: "2.6s" },
  { x: "8%", y: "48%", drift: "25s", glow: "6.8s", delay: "0.3s" },
  { x: "70%", y: "76%", drift: "20s", glow: "4.8s", delay: "1.9s" },
  { x: "33%", y: "40%", drift: "27s", glow: "6.2s", delay: "3s" },
];

export default function ForestFX() {
  return (
    <div className="forestfx" aria-hidden>
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className={`ffly ffly-${i % 3}`}
          style={{
            left: f.x,
            top: f.y,
            animationDuration: `${f.drift}, ${f.glow}`,
            animationDelay: `${f.delay}, ${f.delay}`,
          }}
        />
      ))}
    </div>
  );
}
