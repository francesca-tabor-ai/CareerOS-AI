import { Link } from 'react-router-dom'

function Terms() {
  return (
    <section className="contact-hero">
      <div className="container" style={{ maxWidth: '720px' }}>
        <h1 className="contact-title">Terms of Service</h1>
        <p className="contact-lead">Last updated: February 2026</p>

        <div className="prose" style={{ marginTop: '2rem', lineHeight: '1.8', color: 'var(--text-muted, #ccc)' }}>
          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using CareerOS AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>2. Description of Service</h2>
          <p>CareerOS AI provides a career management platform for universities, career centers, and students. We offer tools for advising, employer relations, alumni engagement, and outcomes tracking.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>3. Account Registration</h2>
          <p>You must create an account to access certain features of our service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>4. Acceptable Use</h2>
          <p>You agree not to misuse our services. This includes not attempting to gain unauthorized access to any part of the platform, not using the service for any unlawful purpose, and not interfering with the security of the service.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>5. Intellectual Property</h2>
          <p>CareerOS AI and its original content, features, and functionality are owned by CareerOS AI and are protected by international copyright, trademark, and other intellectual property laws.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>6. Limitation of Liability</h2>
          <p>CareerOS AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>7. Termination</h2>
          <p>We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of significant changes. Your continued use of the service after changes constitutes acceptance of the new terms.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please <Link to="/contact" style={{ color: 'var(--accent, #f59e0b)' }}>contact us</Link>.</p>
        </div>
      </div>
    </section>
  )
}

export default Terms
