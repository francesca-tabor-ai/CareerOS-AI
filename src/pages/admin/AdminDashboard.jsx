import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { ADMIN_STORAGE_KEY } from './AdminLogin'

function AdminDashboard() {
  const [contactSubmissions, setContactSubmissions] = useState([])
  const [appSubmissions, setAppSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('contact')
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const token = localStorage.getItem(ADMIN_STORAGE_KEY)

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate('/admin')
      return
    }
    setLoading(true)
    setError('')
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [contactRes, appRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/contact-submissions`, { headers }),
        fetch(`${apiUrl}/api/admin/app-submissions`, { headers }),
      ])
      if (contactRes.status === 401 || appRes.status === 401) {
        localStorage.removeItem(ADMIN_STORAGE_KEY)
        navigate('/admin')
        return
      }
      if (contactRes.status === 403 || appRes.status === 403) {
        setError('Admin access required')
        return
      }
      const contactData = await contactRes.json().catch(() => [])
      const appData = await appRes.json().catch(() => [])
      setContactSubmissions(Array.isArray(contactData) ? contactData : [])
      setAppSubmissions(Array.isArray(appData) ? appData : [])
    } catch {
      setError('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [apiUrl, token, navigate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteContact = async (id) => {
    if (!confirm('Delete this contact submission?')) return
    try {
      const res = await fetch(`${apiUrl}/api/admin/contact-submissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setContactSubmissions((prev) => prev.filter((s) => s.id !== id))
    } catch {
      setError('Failed to delete')
    }
  }

  const handleDeleteApp = async (id) => {
    if (!confirm('Delete this app submission?')) return
    try {
      const res = await fetch(`${apiUrl}/api/admin/app-submissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setAppSubmissions((prev) => prev.filter((s) => s.id !== id))
    } catch {
      setError('Failed to delete')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY)
    navigate('/admin')
  }

  if (!token) return <Navigate to="/admin" replace />

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <h1 className="admin-brand">CareerOS Admin</h1>
          <div className="admin-header-actions">
            <Link to="/" className="btn btn-ghost">View site</Link>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {error && <div className="contact-error" role="alert">{error}</div>}
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact submissions ({contactSubmissions.length})
            </button>
            <button
              type="button"
              className={`admin-tab ${activeTab === 'app' ? 'active' : ''}`}
              onClick={() => setActiveTab('app')}
            >
              App submissions ({appSubmissions.length})
            </button>
          </div>

          {loading ? (
            <p className="admin-loading">Loading...</p>
          ) : activeTab === 'contact' ? (
            <div className="admin-table-wrap">
              {contactSubmissions.length === 0 ? (
                <p className="admin-empty">No contact submissions yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.map((s) => (
                      <tr key={s.id}>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td>{s.requestType}</td>
                        <td>{s.name}</td>
                        <td><a href={`mailto:${s.email}`}>{s.email}</a></td>
                        <td>{s.subject || '—'}</td>
                        <td className="admin-cell-message">{s.message?.slice(0, 80)}{s.message?.length > 80 ? '…' : ''}</td>
                        <td>
                          <button type="button" className="admin-delete" onClick={() => handleDeleteContact(s.id)} title="Delete">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="admin-table-wrap">
              {appSubmissions.length === 0 ? (
                <p className="admin-empty">No app submissions yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Company</th>
                      <th>App</th>
                      <th>Developer</th>
                      <th>Stage</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appSubmissions.map((s) => (
                      <tr key={s.id}>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td>{s.companyName}</td>
                        <td>{s.appName}</td>
                        <td>
                          <a href={`mailto:${s.developerEmail}`}>{s.developerName}</a>
                        </td>
                        <td>{s.appStage}</td>
                        <td>
                          <button type="button" className="admin-delete" onClick={() => handleDeleteApp(s.id)} title="Delete">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <p className="admin-refresh">
            <button type="button" className="btn btn-ghost" onClick={fetchData}>Refresh</button>
          </p>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
