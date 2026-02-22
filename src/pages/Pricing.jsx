import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Individual',
    tagline: 'For students & solo career seekers',
    price: '$19',
    period: '/month',
    description: 'Take control of your job search with AI-powered tools. Perfect for MBA candidates and early-career professionals.',
    features: [
      'Career tracker — applications, interviews, follow-ups',
      'AI outreach messages & coffee chat suggestions',
      'Resume keyword optimizer & tailoring',
      'Chrome extension for job aggregation',
      'Interview prep with recommended questions',
      'Company & role insights',
    ],
    cta: 'Start free trial',
    href: '#',
    popular: false,
  },
  {
    name: 'Team',
    tagline: 'For career centers & advising teams',
    price: 'Custom',
    period: '',
    description: 'Unified platform for advisors, students, and employer relations. Scale support without scaling headcount.',
    features: [
      'Everything in Individual for all students',
      'Advisor dashboard — see who\'s active, stuck, needs support',
      'Co-create & review resumes with university templates',
      'Event management — workshops, fairs, sessions',
      'Employer & alumni collaboration',
      'Basic analytics & engagement reports',
      'SSO/SIS integration',
    ],
    cta: 'Book a demo',
    href: '#',
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For universities & multi-campus systems',
    price: 'Custom',
    period: '',
    description: 'Full ecosystem with outcomes reporting, alumni integration, and institutional compliance.',
    features: [
      'Everything in Team',
      'Outcomes dashboard — placements, engagement, equity',
      'Accreditation & board pack exports (PDF/CSV)',
      'Alumni touchpoints → placements, NPS, donation likelihood',
      'Custom API & CRM integration',
      'GDPR & FERPA compliant, EU-hosted',
      'Dedicated success manager',
      'Custom training & onboarding',
    ],
    cta: 'Contact sales',
    href: '#',
    popular: false,
  },
]

function Pricing() {
  return (
    <>
      <section className="pricing-hero">
        <div className="container">
          <h1 className="pricing-title">Pricing that scales with you</h1>
          <p className="pricing-lead">
            From solo job seekers to multi-campus university systems — choose the plan that fits.
          </p>
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.popular && <span className="pricing-badge">Most popular</span>}
                <h3 className="pricing-card-name">{plan.name}</h3>
                <p className="pricing-card-tagline">{plan.tagline}</p>
                <div className="pricing-card-price">
                  <span className="price-value">{plan.price}</span>
                  {plan.period && <span className="price-period">{plan.period}</span>}
                </div>
                <p className="pricing-card-desc">{plan.description}</p>
                <ul className="pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a href={plan.href} className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-scale">
        <div className="container">
          <h2 className="section-title">Scaling functionality</h2>
          <div className="scale-table">
            <div className="scale-row scale-header">
              <span className="scale-feature">Feature</span>
              <span className="scale-tier">Individual</span>
              <span className="scale-tier">Team</span>
              <span className="scale-tier">Enterprise</span>
            </div>
            <div className="scale-row">
              <span className="scale-feature">Students / users</span>
              <span className="scale-tier">1</span>
              <span className="scale-tier">Up to 2,000</span>
              <span className="scale-tier">Unlimited</span>
            </div>
            <div className="scale-row">
              <span className="scale-feature">Advisors</span>
              <span className="scale-tier">—</span>
              <span className="scale-tier">Up to 20</span>
              <span className="scale-tier">Unlimited</span>
            </div>
            <div className="scale-row">
              <span className="scale-feature">AI tools</span>
              <span className="scale-tier">✓</span>
              <span className="scale-tier">✓</span>
              <span className="scale-tier">✓</span>
            </div>
            <div className="scale-row">
              <span className="scale-feature">Outcomes reporting</span>
              <span className="scale-tier">—</span>
              <span className="scale-tier">Basic</span>
              <span className="scale-tier">Full + exports</span>
            </div>
            <div className="scale-row">
              <span className="scale-feature">SSO / SIS integration</span>
              <span className="scale-tier">—</span>
              <span className="scale-tier">✓</span>
              <span className="scale-tier">✓</span>
            </div>
            <div className="scale-row">
              <span className="scale-feature">Support</span>
              <span className="scale-tier">Self-serve</span>
              <span className="scale-tier">Email</span>
              <span className="scale-tier">Dedicated</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <p className="section-lead">Not sure which plan? Start with a 2-week free trial or book a call.</p>
          <div className="cta-buttons">
            <Link to="/" className="btn btn-primary">Start free trial</Link>
            <a href="#" className="btn btn-ghost">Book a demo</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Pricing
