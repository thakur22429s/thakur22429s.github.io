import { about, education, skills } from "@/data/content";

export default function About() {
  return (
    <section className="blk wrap" id="about">
      <div className="sechd">
        <span className="idx">
          <b>01</b> / about
        </span>
        <h2 className="dsp">Who I am</h2>
      </div>
      <div className="about-grid">
        <p className="about-para reveal">{about.paragraph}</p>
        <div className="about-right reveal">
          <div className="facts">
            {about.facts.map((f) => (
              <div className="f" key={f.k}>
                <span className="k">{f.k}</span>
                <span>{f.v}</span>
              </div>
            ))}
          </div>
          <div className="skills">
            <span className="skills-label">toolkit</span>
            {skills.map((g) => (
              <div className="skill-group" key={g.group}>
                <span className="skill-cat">{g.group}</span>
                <div className="skill-tags">
                  {g.items.map((it) => (
                    <span className="skill-tag" key={it}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="edu reveal">
        {education.map((e) => (
          <div className="e" key={e.school}>
            <div className="s dsp">{e.school}</div>
            <div className="dg">{e.degree}</div>
            <div className="p">{e.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
