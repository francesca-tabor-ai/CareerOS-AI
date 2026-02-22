import { useState } from 'react'
import { Link } from 'react-router-dom'

const INTEGRATION_TYPES = [
  { value: 'resume', label: 'Resume parsing & profile enrichment' },
  { value: 'ats', label: 'ATS / Job board integration' },
  { value: 'analytics', label: 'Analytics & reporting' },
  { value: 'notifications', label: 'Notifications (Slack, email, etc.)' },
  { value: 'calendar', label: 'Calendar & scheduling' },
  { value: 'lms', label: 'LMS integration' },
  { value: 'other', label: 'Other' },
]

const APP_STAGES = [
  { value: 'idea', label: 'I have an idea' },
  { value: 'building', label: 'I\'m building it' },
  { value: 'launched', label: 'I have a launched product' },
]

function BuildApp() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    // Company / Developer
    companyName: '',
    website: '',
    developerEmail: '',
    developerName: '',
    // App
    appName: '',
    appDescription: '',
    appUrl: '',
    integrationTypes: [],
    appStage: 'idea',
    // Technical
    apiUsage: '',
    webhooksNeeded: false,
    dataAccess: '',
    // Additional
    whyCareerOS: '',
    termsAccepted: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleIntegrationChange = (value) => {
    setFormData((prev) => {
      const arr = prev.integrationTypes.includes(value)
        ? prev.integrationTypes.filter((v) => v !== value)
        : [...prev.integrationTypes, value]
      return { ...prev, integrationTypes: arr }
    })
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.companyName && formData.developerEmail && formData.developerName
    }
    if (step === 2) {
      return formData.appName && formData.appDescription && formData.integrationTypes.length > 0
    }
    if (step === 3) {
      return formData.whyCareerOS && formData.termsAccepted
    }
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/app-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <>
        <section className="build-app-hero">
          <div className="container">
            <h1 className="build-app-title">Application received</h1>
            <p className="build-app-lead">
              Thank you for applying to build on CareerOS AI. Our team will review your submission and reach out within 5–7 business days.
            </p>
            <div className="build-app-success-card">
              <h3>What happens next?</h3>
              <ul>
                <li>We&apos;ll review your application and integration plan</li>
                <li>If approved, you&apos;ll receive API access and developer documentation</li>
                <li>You can build and test in our sandbox environment</li>
                <li>Once ready, submit for marketplace review</li>
              </ul>
            </div>
            <Link to="/marketplace" className="btn btn-primary">Back to Marketplace</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="build-app-hero">
        <div className="container">
          <p className="build-app-badge">Become a partner developer</p>
          <h1 className="build-app-title">Build an app for CareerOS AI</h1>
          <p className="build-app-lead">
            Join our partner program and integrate with the career management platform trusted by 70+ universities. 
            Get API access, documentation, and a path to the marketplace.
          </p>
        </div>
      </section>

      <section className="build-app-form-section">
        <div className="container">
          <form className="build-app-form" onSubmit={handleSubmit}>
            <div className="build-app-steps">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`build-app-step ${step === s ? 'active' : ''} ${s < step ? 'done' : ''}`}
                  onClick={() => setStep(s)}
                >
                  <span className="build-app-step-num">{s}</span>
                  <span className="build-app-step-label">
                    {s === 1 && 'Company & contact'}
                    {s === 2 && 'App details'}
                    {s === 3 && 'Review & submit'}
                  </span>
                </button>
              ))}
            </div>

            {error && (
              <div className="build-app-error">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="build-app-panel">
                <h2>Company & contact information</h2>
                <p className="build-app-panel-desc">Tell us about your organization and primary contact.</p>
                <div className="build-app-fields">
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="companyName">Company or organization name *</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                  <div className="build-app-field">
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="build-app-field">
                    <label htmlFor="developerName">Your name *</label>
                    <input
                      type="text"
                      id="developerName"
                      name="developerName"
                      value={formData.developerName}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                  <div className="build-app-field">
                    <label htmlFor="developerEmail">Your email *</label>
                    <input
                      type="email"
                      id="developerEmail"
                      name="developerEmail"
                      value={formData.developerEmail}
                      onChange={handleChange}
                      placeholder="jane@acme.com"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="build-app-panel">
                <h2>App details</h2>
                <p className="build-app-panel-desc">Describe your app and how it integrates with CareerOS AI.</p>
                <div className="build-app-fields">
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="appName">App name *</label>
                    <input
                      type="text"
                      id="appName"
                      name="appName"
                      value={formData.appName}
                      onChange={handleChange}
                      placeholder="Resume Parser Pro"
                      required
                    />
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="appDescription">App description *</label>
                    <textarea
                      id="appDescription"
                      name="appDescription"
                      value={formData.appDescription}
                      onChange={handleChange}
                      placeholder="Describe what your app does and how it helps career centers or students..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="appUrl">App or product URL (if live)</label>
                    <input
                      type="url"
                      id="appUrl"
                      name="appUrl"
                      value={formData.appUrl}
                      onChange={handleChange}
                      placeholder="https://yourapp.com"
                    />
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label>Integration type(s) *</label>
                    <div className="build-app-checkboxes">
                      {INTEGRATION_TYPES.map((t) => (
                        <label key={t.value} className="build-app-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.integrationTypes.includes(t.value)}
                            onChange={() => handleIntegrationChange(t.value)}
                          />
                          <span>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="appStage">Current stage</label>
                    <select
                      id="appStage"
                      name="appStage"
                      value={formData.appStage}
                      onChange={handleChange}
                    >
                      {APP_STAGES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="apiUsage">How do you plan to use the API?</label>
                    <textarea
                      id="apiUsage"
                      name="apiUsage"
                      value={formData.apiUsage}
                      onChange={handleChange}
                      placeholder="Describe the API endpoints you expect to use, data you'll read/write, and any webhooks..."
                      rows={3}
                    />
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label className="build-app-checkbox">
                      <input
                        type="checkbox"
                        name="webhooksNeeded"
                        checked={formData.webhooksNeeded}
                        onChange={handleChange}
                      />
                      <span>I need webhooks for real-time events</span>
                    </label>
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="dataAccess">What data will your app access?</label>
                    <textarea
                      id="dataAccess"
                      name="dataAccess"
                      value={formData.dataAccess}
                      onChange={handleChange}
                      placeholder="e.g. User profiles, resumes, job applications, event data..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="build-app-panel">
                <h2>Review & submit</h2>
                <p className="build-app-panel-desc">Final details and agreement.</p>
                <div className="build-app-fields">
                  <div className="build-app-field build-app-field-full">
                    <label htmlFor="whyCareerOS">Why do you want to build on CareerOS AI? *</label>
                    <textarea
                      id="whyCareerOS"
                      name="whyCareerOS"
                      value={formData.whyCareerOS}
                      onChange={handleChange}
                      placeholder="Share your motivation and how you see CareerOS AI fitting into your product roadmap..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="build-app-field build-app-field-full">
                    <label className="build-app-checkbox build-app-checkbox-large">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        required
                      />
                      <span>
                        I agree to the CareerOS AI Partner Program Agreement and Developer Terms of Use. 
                        I understand that my application will be reviewed and I may be contacted for additional information.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="build-app-actions">
              {step > 1 ? (
                <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canProceed() || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default BuildApp
