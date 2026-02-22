import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="contact-hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="contact-title" style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</h1>
        <p className="contact-lead" style={{ marginBottom: '2rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Go to homepage</Link>
      </div>
    </section>
  )
}

export default NotFound
