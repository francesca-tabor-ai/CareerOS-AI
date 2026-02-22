import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const ADMIN_STORAGE_KEY = 'careeros_admin_token'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }
      if (data.user?.role !== 'ADMIN') {
        throw new Error('Admin access required')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem(ADMIN_STORAGE_KEY, data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin login</h1>
        <p className="admin-login-subtitle">CareerOS AI admin dashboard</p>
        {error && <div className="contact-error" role="alert">{error}</div>}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@careeros.ai"
              required
              autoComplete="email"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="admin-login-back">
          <Link to="/">← Back to site</Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
export { ADMIN_STORAGE_KEY }
