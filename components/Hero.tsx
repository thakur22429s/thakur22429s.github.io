import { hero, profile } from "@/data/content";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-photo-wrap reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-photo" src={hero.photo} alt="Abhay Singh Thakur" />
        </div>
        <div className="hero-text">
          <span className="status">
            <span className="d" />
            {profile.status} · {profile.location}
          </span>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-roles">
            {hero.roles.map((part, i) =>
              part.accent ? (
                <em key={i} className={part.accent}>
                  {part.text}
                </em>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </p>
          <p className="lede">{hero.lede}</p>
          <div className="cta">
            <a
              className="btn fill"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé <span className="a">→</span>
            </a>
            <button type="button" className="btn ghost" data-open-chat>
              Talk to AI Abhay <span className="a">→</span>
            </button>
            <a className="btn ghost" href="#work">
              See the work <span className="a">↓</span>
            </a>
          </div>
        </div>
      </div>
      <span className="scrollcue">↓ scroll</span>
    </header>
  );
}
