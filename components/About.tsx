import { about, education } from "@/data/content";

export default function About() {
  return (
    <section className="blk wrap" id="about">
      <div className="sechd">
        <span className="idx">
          <b>01</b> / about
        </span>
        <h2 className="dsp">The short version</h2>
      </div>
      <div className="about-grid">
        <p className="about-para reveal">{about.paragraph}</p>
        <div className="facts reveal">
          {about.facts.map((f) => (
            <div className="f" key={f.k}>
              <span className="k">{f.k}</span>
              <span>{f.v}</span>
            </div>
          ))}
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
