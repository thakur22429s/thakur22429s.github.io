import { hero, profile } from "@/data/content";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <span className="status">
          <span className="d" />
          {profile.status} · {profile.location}
        </span>
        <h1>
          {hero.headline.map((part, i) =>
            part.accent ? (
              <em key={i} className={part.accent}>
                {part.text}
              </em>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </h1>
        <p className="lede">{hero.lede}</p>
        <div className="cta">
          <a className="btn fill" href="#ask">
            Talk to AI Abhay <span className="a">→</span>
          </a>
          <a className="btn ghost" href="#work">
            See the work <span className="a">↓</span>
          </a>
        </div>
      </div>
      <span className="scrollcue">↓ scroll</span>
    </header>
  );
}
