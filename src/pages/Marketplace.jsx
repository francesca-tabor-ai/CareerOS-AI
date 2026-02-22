import { Link } from 'react-router-dom'

const PLACEHOLDER_APPS = [
  {
    id: 1,
    name: 'Resume Parser Pro',
    description: 'Parse and structure resumes at scale. Extracts skills, experience, and education for instant matching.',
    category: 'Resume & Profile',
    logo: '📄',
  },
  {
    id: 2,
    name: 'Interview Prep AI',
    description: 'AI-powered mock interviews with real-time feedback. Customizable by role and company.',
    category: 'Interview Prep',
    logo: '🎤',
  },
  {
    id: 3,
    name: 'Employer Sync',
    description: 'Sync job postings from ATS and employer portals. Auto-update roles and deadlines.',
    category: 'Integrations',
    logo: '🔄',
  },
  {
    id: 4,
    name: 'Outcomes Dashboard',
    description: 'Export placement data and engagement metrics to accreditation and board reports.',
    category: 'Analytics',
    logo: '📊',
  },
  {
    id: 5,
    name: 'Slack Notifications',
    description: 'Get alerts when students hit milestones or need outreach. Keeps advisors in the loop.',
    category: 'Notifications',
    logo: '💬',
  },
  {
    id: 6,
    name: 'Calendar Sync',
    description: 'Sync advising appointments and career events with Google Calendar and Outlook.',
    category: 'Integrations',
    logo: '📅',
  },
]

function Marketplace() {
  return (
    <>
      <section className="marketplace-hero">
        <div className="container">
          <p className="marketplace-badge">CareerOS AI App Marketplace</p>
          <h1 className="marketplace-title">Integrations for advanced workflows</h1>
          <p className="marketplace-lead">
            Connect CareerOS AI with the tools you already use. Build custom workflows and extend the platform with apps built by our partner developers.
          </p>
          <div className="marketplace-hero-cta">
            <Link to="/apps/build" className="btn btn-primary btn-lg">Build an app</Link>
            <a href="#apps" className="btn btn-ghost btn-lg">Browse integrations</a>
          </div>
        </div>
      </section>

      <section className="marketplace-benefits">
        <div className="container">
          <h2 className="section-title">Why integrate?</h2>
          <p className="section-lead">Extend CareerOS AI for your institution&apos;s unique needs.</p>
          <div className="marketplace-benefits-grid">
            <article className="marketplace-benefit-card">
              <div className="marketplace-benefit-icon">🔌</div>
              <h3>Connect existing tools</h3>
              <p>Sync with ATS, LMS, calendaring, and communication tools. One platform, your full stack.</p>
            </article>
            <article className="marketplace-benefit-card">
              <div className="marketplace-benefit-icon">⚡</div>
              <h3>Automate workflows</h3>
              <p>Trigger actions, sync data, and run automations without writing custom scripts.</p>
            </article>
            <article className="marketplace-benefit-card">
              <div className="marketplace-benefit-icon">🏗️</div>
              <h3>Build custom apps</h3>
              <p>Apply to become a partner developer and publish your app to the marketplace.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="marketplace-apps" id="apps">
        <div className="container">
          <h2 className="section-title">Available integrations</h2>
          <p className="section-lead">Apps and integrations built by CareerOS AI and our partners.</p>
          <div className="marketplace-grid">
            {PLACEHOLDER_APPS.map((app) => (
              <article key={app.id} className="marketplace-card">
                <div className="marketplace-card-logo">{app.logo}</div>
                <span className="marketplace-card-category">{app.category}</span>
                <h3 className="marketplace-card-name">{app.name}</h3>
                <p className="marketplace-card-desc">{app.description}</p>
                <Link to="/apps/build" className="marketplace-card-link">
                  Request access →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketplace-cta section section-dark">
        <div className="container">
          <h2 className="section-title">Ready to build?</h2>
          <p className="section-lead">Join our partner program and publish your app to the CareerOS AI marketplace.</p>
          <Link to="/apps/build" className="btn btn-primary btn-lg">Apply to build an app</Link>
        </div>
      </section>
    </>
  )
}

export default Marketplace
