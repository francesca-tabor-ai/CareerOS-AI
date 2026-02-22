import { useState } from 'react'

const ENTITIES = [
  {
    name: 'User',
    description: 'Platform users with email, name, and role (USER or ADMIN).',
    fields: [
      { name: 'id', type: 'string', desc: 'Unique identifier (cuid)' },
      { name: 'email', type: 'string', desc: 'User email (unique)' },
      { name: 'name', type: 'string | null', desc: 'Display name' },
      { name: 'role', type: 'Role', desc: 'USER or ADMIN' },
      { name: 'createdAt', type: 'DateTime', desc: 'Creation timestamp' },
      { name: 'updatedAt', type: 'DateTime', desc: 'Last update timestamp' },
    ],
  },
  {
    name: 'Plan',
    description: 'Pricing plans with features array.',
    fields: [
      { name: 'id', type: 'string', desc: 'Unique identifier' },
      { name: 'name', type: 'string', desc: 'Plan name' },
      { name: 'tagline', type: 'string | null', desc: 'Short tagline' },
      { name: 'price', type: 'string', desc: 'Price display (e.g. "$99")' },
      { name: 'period', type: 'string | null', desc: 'Billing period (e.g. "/month")' },
      { name: 'description', type: 'string | null', desc: 'Plan description' },
      { name: 'features', type: 'string[]', desc: 'Array of feature strings' },
      { name: 'cta', type: 'string | null', desc: 'Call-to-action text' },
      { name: 'href', type: 'string | null', desc: 'CTA link' },
      { name: 'popular', type: 'boolean', desc: 'Featured plan flag' },
      { name: 'order', type: 'int', desc: 'Display order' },
      { name: 'createdAt', type: 'DateTime', desc: 'Creation timestamp' },
      { name: 'updatedAt', type: 'DateTime', desc: 'Last update timestamp' },
    ],
  },
  {
    name: 'CaseStudy',
    description: 'Testimonials and case studies from customers.',
    fields: [
      { name: 'id', type: 'string', desc: 'Unique identifier' },
      { name: 'company', type: 'string', desc: 'Company/institution name' },
      { name: 'quote', type: 'string', desc: 'Testimonial quote' },
      { name: 'author', type: 'string', desc: 'Author name' },
      { name: 'role', type: 'string', desc: 'Author role (e.g. Director of Career Services)' },
      { name: 'order', type: 'int', desc: 'Display order' },
      { name: 'createdAt', type: 'DateTime', desc: 'Creation timestamp' },
      { name: 'updatedAt', type: 'DateTime', desc: 'Last update timestamp' },
    ],
  },
  {
    name: 'AppSubmission',
    description: 'Partner developer applications to build apps. Submitted via the Build App form.',
    fields: [
      { name: 'id', type: 'string', desc: 'Unique identifier' },
      { name: 'companyName', type: 'string', desc: 'Company or organization name' },
      { name: 'website', type: 'string | null', desc: 'Company website' },
      { name: 'developerEmail', type: 'string', desc: 'Developer contact email' },
      { name: 'developerName', type: 'string', desc: 'Developer name' },
      { name: 'appName', type: 'string', desc: 'App name' },
      { name: 'appDescription', type: 'string', desc: 'App description' },
      { name: 'appUrl', type: 'string | null', desc: 'App or product URL' },
      { name: 'integrationTypes', type: 'string[]', desc: 'Types of integration' },
      { name: 'appStage', type: 'string', desc: 'idea | building | launched' },
      { name: 'apiUsage', type: 'string | null', desc: 'Planned API usage' },
      { name: 'webhooksNeeded', type: 'boolean', desc: 'Whether webhooks are needed' },
      { name: 'dataAccess', type: 'string | null', desc: 'Data to access' },
      { name: 'whyCareerOS', type: 'string', desc: 'Motivation for building' },
      { name: 'termsAccepted', type: 'boolean', desc: 'Terms agreement' },
      { name: 'createdAt', type: 'DateTime', desc: 'Creation timestamp' },
    ],
  },
  {
    name: 'ContactSubmission',
    description: 'Contact form submissions.',
    fields: [
      { name: 'id', type: 'string', desc: 'Unique identifier' },
      { name: 'requestType', type: 'string', desc: 'Type of request (support, bug, general)' },
      { name: 'name', type: 'string', desc: 'Submitter name' },
      { name: 'email', type: 'string', desc: 'Submitter email' },
      { name: 'subject', type: 'string | null', desc: 'Optional subject' },
      { name: 'message', type: 'string', desc: 'Message content' },
      { name: 'createdAt', type: 'DateTime', desc: 'Creation timestamp' },
    ],
  },
]

const ENDPOINTS = [
  {
    section: 'Authentication',
    base: '/api/auth',
    auth: 'None / Bearer',
    routes: [
      { method: 'POST', path: '/signup', desc: 'Register a new user', body: 'email, password, name?', crud: 'Create' },
      { method: 'POST', path: '/login', desc: 'Login and get JWT', body: 'email, password', crud: '—' },
      { method: 'GET', path: '/me', desc: 'Get current user (requires Bearer)', body: '—', crud: 'Read' },
    ],
  },
  {
    section: 'Contact (Public)',
    base: '/api/contact',
    auth: 'None',
    routes: [
      { method: 'POST', path: '/', desc: 'Submit contact form', body: 'requestType, name, email, subject?, message', crud: 'Create' },
    ],
  },
  {
    section: 'App Submissions (Public)',
    base: '/api/app-submissions',
    auth: 'None',
    routes: [
      { method: 'POST', path: '/', desc: 'Submit Build App application', body: 'companyName, developerEmail, developerName, appName, appDescription, integrationTypes[], appStage?, apiUsage?, webhooksNeeded?, dataAccess?, whyCareerOS, termsAccepted', crud: 'Create' },
    ],
  },
  {
    section: 'Admin — Users',
    base: '/api/admin',
    auth: 'Bearer (ADMIN)',
    routes: [
      { method: 'GET', path: '/users', desc: 'List all users', crud: 'Read' },
      { method: 'GET', path: '/users/:id', desc: 'Get user by ID', crud: 'Read' },
      { method: 'POST', path: '/users', desc: 'Create user', body: 'email, password, name?, role?', crud: 'Create' },
      { method: 'PATCH', path: '/users/:id', desc: 'Update user', body: 'email?, password?, name?, role?', crud: 'Update' },
      { method: 'DELETE', path: '/users/:id', desc: 'Delete user', crud: 'Delete' },
    ],
  },
  {
    section: 'Admin — Plans',
    base: '/api/admin',
    auth: 'Bearer (ADMIN)',
    routes: [
      { method: 'GET', path: '/plans', desc: 'List all plans', crud: 'Read' },
      { method: 'GET', path: '/plans/:id', desc: 'Get plan by ID', crud: 'Read' },
      { method: 'POST', path: '/plans', desc: 'Create plan', body: 'name, price, features[], tagline?, period?, description?, cta?, href?, popular?, order?', crud: 'Create' },
      { method: 'PATCH', path: '/plans/:id', desc: 'Update plan', body: 'name?, price?, features?, tagline?, period?, description?, cta?, href?, popular?, order?', crud: 'Update' },
      { method: 'DELETE', path: '/plans/:id', desc: 'Delete plan', crud: 'Delete' },
    ],
  },
  {
    section: 'Admin — Case Studies',
    base: '/api/admin',
    auth: 'Bearer (ADMIN)',
    routes: [
      { method: 'GET', path: '/case-studies', desc: 'List all case studies', crud: 'Read' },
      { method: 'GET', path: '/case-studies/:id', desc: 'Get case study by ID', crud: 'Read' },
      { method: 'POST', path: '/case-studies', desc: 'Create case study', body: 'company, quote, author, role, order?', crud: 'Create' },
      { method: 'PATCH', path: '/case-studies/:id', desc: 'Update case study', body: 'company?, quote?, author?, role?, order?', crud: 'Update' },
      { method: 'DELETE', path: '/case-studies/:id', desc: 'Delete case study', crud: 'Delete' },
    ],
  },
  {
    section: 'Admin — App Submissions',
    base: '/api/admin',
    auth: 'Bearer (ADMIN)',
    routes: [
      { method: 'GET', path: '/app-submissions', desc: 'List all app submissions', crud: 'Read' },
      { method: 'GET', path: '/app-submissions/:id', desc: 'Get app submission by ID', crud: 'Read' },
      { method: 'DELETE', path: '/app-submissions/:id', desc: 'Delete app submission', crud: 'Delete' },
    ],
  },
  {
    section: 'Admin — Contact Submissions',
    base: '/api/admin',
    auth: 'Bearer (ADMIN)',
    routes: [
      { method: 'GET', path: '/contact-submissions', desc: 'List all submissions', crud: 'Read' },
      { method: 'GET', path: '/contact-submissions/:id', desc: 'Get submission by ID', crud: 'Read' },
      { method: 'DELETE', path: '/contact-submissions/:id', desc: 'Delete submission', crud: 'Delete' },
    ],
  },
  {
    section: 'Admin — App Submissions',
    base: '/api/admin',
    auth: 'Bearer (ADMIN)',
    routes: [
      { method: 'GET', path: '/app-submissions', desc: 'List all app submissions', crud: 'Read' },
      { method: 'GET', path: '/app-submissions/:id', desc: 'Get app submission by ID', crud: 'Read' },
      { method: 'DELETE', path: '/app-submissions/:id', desc: 'Delete app submission', crud: 'Delete' },
    ],
  },
  {
    section: 'App Submissions (Public)',
    base: '/api',
    auth: 'None',
    routes: [
      { method: 'POST', path: '/app-submissions', desc: 'Submit partner app application', body: 'companyName, developerEmail, developerName, appName, appDescription, integrationTypes[], appStage?, apiUsage?, webhooksNeeded?, dataAccess?, whyCareerOS, termsAccepted', crud: 'Create' },
    ],
  },
  {
    section: 'Health',
    base: '/api',
    auth: 'None',
    routes: [
      { method: 'GET', path: '/health', desc: 'Health check', crud: '—' },
    ],
  },
]

function ApiDocs() {
  const [activeSection, setActiveSection] = useState('entities')

  return (
    <>
      <section className="api-docs-hero">
        <div className="container">
          <h1 className="api-docs-title">API Documentation</h1>
          <p className="api-docs-lead">
            Integrate with CareerOS AI via REST. All endpoints return JSON. Base URL: <code>{import.meta.env.VITE_API_URL || 'http://localhost:3001'}</code>
          </p>
        </div>
      </section>

      <section className="api-docs-nav-section">
        <div className="container">
          <div className="api-docs-tabs">
            <button
              className={`api-docs-tab ${activeSection === 'entities' ? 'active' : ''}`}
              onClick={() => setActiveSection('entities')}
            >
              Entities
            </button>
            <button
              className={`api-docs-tab ${activeSection === 'endpoints' ? 'active' : ''}`}
              onClick={() => setActiveSection('endpoints')}
            >
              Endpoints & CRUD
            </button>
          </div>
        </div>
      </section>

      <section className="api-docs-content">
        <div className="container">
          {activeSection === 'entities' && (
            <div className="api-docs-section">
              <h2>Data models</h2>
              <p className="api-docs-section-desc">Core entities exposed by the API.</p>
              {ENTITIES.map((entity) => (
                <div key={entity.name} className="api-docs-card">
                  <h3>{entity.name}</h3>
                  <p className="api-docs-entity-desc">{entity.description}</p>
                  <table className="api-docs-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entity.fields.map((f) => (
                        <tr key={f.name}>
                          <td><code>{f.name}</code></td>
                          <td><code>{f.type}</code></td>
                          <td>{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'endpoints' && (
            <div className="api-docs-section">
              <h2>API endpoints</h2>
              <p className="api-docs-section-desc">All available routes and CRUD operations.</p>
              <div className="api-docs-auth-note">
                <strong>Authentication:</strong> Use <code>Authorization: Bearer &lt;token&gt;</code> for protected routes.
                Obtain a token via <code>POST /api/auth/login</code>.
              </div>
              {ENDPOINTS.map((group) => (
                <div key={group.section} className="api-docs-card">
                  <h3>{group.section}</h3>
                  <p className="api-docs-endpoint-meta">
                    Base: <code>{group.base}</code> · Auth: {group.auth}
                  </p>
                  <table className="api-docs-table api-docs-endpoints">
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>CRUD</th>
                        <th>Description</th>
                        <th>Body</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.routes.map((r, i) => (
                        <tr key={i}>
                          <td><span className={`api-method api-method-${r.method.toLowerCase()}`}>{r.method}</span></td>
                          <td><code>{r.path}</code></td>
                          <td>{r.crud}</td>
                          <td>{r.desc}</td>
                          <td><code className="api-body">{r.body || '—'}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default ApiDocs
