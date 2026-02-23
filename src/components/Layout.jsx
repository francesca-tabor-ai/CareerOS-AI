import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ChatWidget from './ChatWidget'

function Layout({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

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
            {user ? (
              <>
                <Link to="/app">My App</Link>
                <button type="button" className="btn btn-ghost" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </>
            )}
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
            <Link to="/apps/build">Build app</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </>
  )
}

export default Layout
