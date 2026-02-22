// University logos - using text placeholders; replace with actual logo image paths
const universityLogos = [
  'ESADE',
  'ESMT Berlin',
  'EADA',
  'Maryland (UMD)',
  'IE Business School',
  'INSEAD',
  'LBS',
  'HEC Paris',
  'Barcelona GSE',
  'Imperial',
]

const caseStudies = [
  {
    company: 'ESMT Berlin',
    quote: "With CareerOS, we now have real-time data and strategic insights to better connect with students.",
    author: 'Sophie Schaefer',
    role: 'Director of Career Services',
  },
  {
    company: 'Maryland (UMD)',
    quote: "Instead of workshops that teach students how to network, CareerOS gives them a tool that walks them through the process as they're doing it. It's as if we gave them a bicycle with training wheels they can start riding on day one.",
    author: 'Jeff Stoltzfus',
    role: 'Director of Career Services',
  },
  {
    company: 'ESADE Business School',
    quote: "CareerOS has truly transformed my career journey. As a job seeker, I have often found myself overwhelmed by the vast number of opportunities available. However, with CareerOS, everything changed for the better.",
    author: 'Adrian Schier',
    role: 'MBA Student',
  },
  {
    company: 'EADA Business School',
    quote: "I contact more than 4 people daily, and sometimes I lose track of who I talked with. CareerOS helped me track people I talked with to request recommendations in their company.",
    author: 'Raissa Oliveira Soares',
    role: 'International MBA',
  },
]

function CaseStudies() {
  return (
    <>
      <section className="case-hero">
        <div className="container">
          <h1 className="case-title">Case studies</h1>
          <p className="case-lead">
            Hear from universities and students who transformed their career outcomes with CareerOS AI.
          </p>
        </div>
      </section>

      {/* Scrolling logos */}
      <section className="logo-marquee-section">
        <p className="logo-marquee-label">Trusted by 70+ universities worldwide</p>
        <div className="logo-marquee">
          <div className="logo-marquee-track">
            {[...universityLogos, ...universityLogos].map((name, i) => (
              <div key={i} className="logo-item">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study cards */}
      <section className="case-studies-section">
        <div className="container">
          <h2 className="section-title">Success stories</h2>
          <div className="case-grid">
            {caseStudies.map((study) => (
              <article key={study.company} className="case-card">
                <div className="case-card-company">{study.company}</div>
                <blockquote className="case-card-quote">"{study.quote}"</blockquote>
                <footer className="case-card-author">
                  <strong>{study.author}</strong>
                  <span>{study.role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <h2 className="section-title">Join them</h2>
          <p className="section-lead">Start your 2-week free trial and see the impact for yourself.</p>
          <a href="#" className="btn btn-primary btn-lg">Get started</a>
        </div>
      </section>
    </>
  )
}

export default CaseStudies
