export default function AskAbhay() {
  return (
    <section className="blk wrap" id="ask">
      <div className="ai reveal">
        <div>
          <span className="eyebrow">a small experiment</span>
          <h2 className="dsp">Don&apos;t want to read? Just ask.</h2>
          <p>
            I&apos;m training a little version of me on my work, my projects, and my
            story. Soon you&apos;ll be able to ask it anything — what I built, how I
            think, whether I&apos;d fit your team.
          </p>
          <a className="btn fill" href="#contact" style={{ marginTop: 22 }}>
            Coming soon — reach me directly <span className="a">→</span>
          </a>
        </div>
        <div className="chatbox">
          <div className="hd">◆ ask-abhay · preview</div>
          <div className="bub me">is he more of a researcher or a builder?</div>
          <div className="bub ai-b">
            Both, honestly. My grad research is in 3D vision, but I&apos;ve also
            shipped an iOS app and a handful of full-stack tools. I like the round
            trip from paper to production.
          </div>
          <div className="bub ai-b">
            <span className="typing">
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
