import { Link } from 'react-router-dom'

function Privacy() {
  return (
    <section className="contact-hero">
      <div className="container" style={{ maxWidth: '720px' }}>
        <h1 className="contact-title">Privacy Policy</h1>
        <p className="contact-lead">Last updated: February 2026</p>

        <div className="prose" style={{ marginTop: '2rem', lineHeight: '1.8', color: 'var(--text-muted, #ccc)' }}>
          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, use our services, or contact us. This includes your name, email address, and any content you submit through our platform.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as described in this policy. We may share your information with service providers who assist us in operating our platform, subject to confidentiality obligations.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>4. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. All data is encrypted in transit and at rest.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>5. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at privacy@careeros.ai.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>7. Cookies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve your experience.</p>

          <h2 style={{ color: 'var(--text, #fff)', marginTop: '2rem' }}>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <Link to="/contact" style={{ color: 'var(--accent, #f59e0b)' }}>contact us</Link>.</p>
        </div>
      </div>
    </section>
  )
}

export default Privacy
