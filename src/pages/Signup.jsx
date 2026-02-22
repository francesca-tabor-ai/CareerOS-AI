import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiJson } from '../lib/api'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, token } = await apiJson('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact-hero">
      <div className="container" style={{ maxWidth: '420px' }}>
        <h1 className="contact-title">Sign up</h1>
        <p className="contact-lead">Create your CareerOS account.</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" style={{ marginBottom: '1rem', color: '#c53030' }}>
              {error}
            </div>
          )}
          <div className="contact-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
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
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}

export default Signup
