import { Link } from 'react-router-dom'

function Landing() {
  return (
    <>
      {/* Hero: Customer + Value Prop */}
      <section className="hero">
        <div className="container hero-content">
          <p className="hero-badge">For university career centers & their students</p>
          <h1 className="hero-title">
            The only career management platform you <em>actually</em> need.
          </h1>
          <p className="hero-subtitle">
            One platform for advising, employer relations, alumni, and outcomes — so you do more with the team you have.
          </p>
          <div className="hero-cta">
            <Link to="/pricing" className="btn btn-primary btn-lg">Start 2-week free trial</Link>
            <Link to="/case-studies" className="btn btn-ghost btn-lg">See case studies</Link>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="trust-strip">
        <p className="trust-text">Trusted by 70+ leading universities globally</p>
        <div className="trust-stats">
          <span><strong>122%</strong> land role at dream company</span>
          <span><strong>5.4×</strong> more student interactions</span>
          <span><strong>91%</strong> would recommend</span>
        </div>
      </section>

      {/* Pain points */}
      <section className="section section-dark" id="pain-points">
        <div className="container">
          <h2 className="section-title">Sound familiar?</h2>
          <p className="section-lead">Career centers face the same challenges every day.</p>
          <div className="pain-cards">
            <article className="pain-card">
              <div className="pain-icon">📊</div>
              <h3>Fragmented tools, manual chaos</h3>
              <p>Job boards, CRM, event platforms, and outcome tracking live in separate systems. You spend weeks on reporting instead of advising.</p>
            </article>
            <article className="pain-card">
              <div className="pain-icon">👁</div>
              <h3>Students slip through the cracks</h3>
              <p>Hard to see who's active, who's stuck, and who needs support until it's too late. No way to prioritize outreach.</p>
            </article>
            <article className="pain-card">
              <div className="pain-icon">📈</div>
              <h3>Impact you can't prove</h3>
              <p>Leadership and accreditation need clear metrics. Board packs and outcome reports take weeks — with inconsistent definitions.</p>
            </article>
            <article className="pain-card">
              <div className="pain-icon">🎓</div>
              <h3>Students overwhelmed, not empowered</h3>
              <p>Hundreds of roles, dozens of touchpoints — no way to track applications, follow-ups, and networking. Dropped leads, missed opportunities.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="section" id="solution">
        <div className="container">
          <h2 className="section-title">How we solve it</h2>
          <p className="section-lead">One unified platform. AI that works in the flow. Impact that leadership trusts.</p>
          <div className="solution-grid">
            <div className="solution-item">
              <span className="solution-number">1</span>
              <h3>Unified ecosystem</h3>
              <p>Students, advisors, and employers work in one place. No more switching tools, re-keying data, or losing context.</p>
            </div>
            <div className="solution-item">
              <span className="solution-number">2</span>
              <h3>AI that guides in real time</h3>
              <p>Personalized outreach, interview prep, company insights — generated as students network. Like training wheels they can use from day one.</p>
            </div>
            <div className="solution-item">
              <span className="solution-number">3</span>
              <h3>Visibility that drives action</h3>
              <p>See who's active, stuck, or needs support. Prioritize outreach, run targeted campaigns, prove you're reaching underserved populations.</p>
            </div>
            <div className="solution-item">
              <span className="solution-number">4</span>
              <h3>Impact that proves ROI</h3>
              <p>One dashboard: placements, engagement, funding credibility. Export board packs and accreditation reports in seconds.</p>
            </div>
          </div>
          <div className="solution-cta">
            <Link to="/pricing" className="btn btn-primary">See pricing</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" id="contact">
        <div className="container">
          <h2 className="section-title">Ready to do more with the team you have?</h2>
          <p className="section-lead">Join 70+ universities transforming how students connect, explore, and succeed.</p>
          <div className="hero-cta">
            <Link to="/pricing" className="btn btn-primary btn-lg">Start 2-week free trial</Link>
            <Link to="/contact" className="btn btn-ghost btn-lg">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Landing
