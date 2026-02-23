import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiJson } from '../lib/api'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, token } = await apiJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        const redirect = searchParams.get('redirect') || '/'
        navigate(redirect)
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact-hero">
      <div className="container" style={{ maxWidth: '420px' }}>
        <h1 className="contact-title">Log in</h1>
        <p className="contact-lead">Sign in to your CareerOS account.</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" style={{ marginBottom: '1rem', color: '#c53030' }}>
              {error}
            </div>
          )}
          <div className="contact-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
