import { experience } from "@/data/content";

export default function Experience() {
  return (
    <section className="blk wrap" id="experience">
      <div className="sechd">
        <span className="idx">
          <b>02</b> / path
        </span>
        <h2 className="dsp">Where I've worked</h2>
      </div>
      <div className="tl">
        {experience.map((e) => (
          <div className="row reveal" key={e.role + e.period}>
            <div className="when">
              {e.period}
              <span className="org">
                {e.org} · {e.place}
              </span>
            </div>
            <div>
              <div className="role dsp">{e.role}</div>
              <ul>
                {e.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
