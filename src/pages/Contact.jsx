import { useState } from 'react'

const REQUEST_TYPES = [
  { value: 'support', label: 'Customer support request' },
  { value: 'bug', label: 'Bug report' },
  { value: 'general', label: 'General inquiry' },
]

const RECIPIENT_EMAIL = 'info@francescatabor.com'

function Contact() {
  const [formData, setFormData] = useState({
    requestType: 'support',
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const typeLabel = REQUEST_TYPES.find((t) => t.value === formData.requestType)?.label ?? formData.requestType

    const subject = `[${typeLabel}] ${formData.subject || 'Contact form submission'}`
    const body = [
      `Request type: ${typeLabel}`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      '',
      formData.message,
    ].join('\n')

    const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title">Contact us</h1>
          <p className="contact-lead">
            Have a question, need support, or found a bug? We&apos;re here to help. Your message will be sent to our team.
          </p>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="requestType">Request type</label>
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                required
              >
                {REQUEST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of your request"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Provide details about your support request, bug report, or inquiry..."
                rows={5}
                required
              />
            </div>

            <p className="contact-note">
              Submissions open your email client with a pre-filled message to <strong>{RECIPIENT_EMAIL}</strong>. Just hit send.
            </p>

            <button type="submit" className="btn btn-primary btn-lg">
              Open email to send
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Contact
