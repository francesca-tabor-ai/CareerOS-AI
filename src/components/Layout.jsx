import { Link } from 'react-router-dom'
import ChatWidget from './ChatWidget'

function Layout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">Career</span><span className="logo-accent">OS</span> AI
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/api-docs">API Docs</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/pricing" className="btn btn-primary">Get started</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo">Career<span className="logo-accent">OS</span> AI</span>
            <p>Built for students. Trusted by universities. Loved by employers.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/api-docs">API Docs</Link>
            <Link to="/contact">Contact</Link>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </>
  )
}

export default Layout
