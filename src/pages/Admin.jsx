import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiJson, apiFetch } from '../lib/api'
import './Admin.css'

const TABS = ['Users', 'Plans', 'Case Studies', 'Contact Submissions']

function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Users')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'ADMIN') {
      navigate('/admin')
      return
    }
    load()
  }, [navigate, activeTab])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const path = {
        Users: '/api/admin/users',
        Plans: '/api/admin/plans',
        'Case Studies': '/api/admin/case-studies',
        'Contact Submissions': '/api/admin/contact-submissions',
      }[activeTab]
      const res = await apiJson(path)
      setData(Array.isArray(res) ? res : [])
      setEditing(null)
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('403')) navigate('/admin')
      else setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return
    const path = {
      Users: '/api/admin/users',
      Plans: '/api/admin/plans',
      'Case Studies': '/api/admin/case-studies',
      'Contact Submissions': '/api/admin/contact-submissions',
    }[activeTab]
    try {
      await apiFetch(`${path}/${id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    const path = {
      Users: '/api/admin/users',
      Plans: '/api/admin/plans',
      'Case Studies': '/api/admin/case-studies',
    }[activeTab]
    if (!path) return
    try {
      await apiFetch(path, { method: 'POST', body: JSON.stringify(form) })
      setForm({})
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    const base = {
      Users: '/api/admin/users',
      Plans: '/api/admin/plans',
      'Case Studies': '/api/admin/case-studies',
    }[activeTab]
    if (!base || !editing?.id) return
    try {
      const body = { ...form }
      if (activeTab === 'Users' && !body.password) delete body.password
      await apiFetch(`${base}/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) })
      setEditing(null)
      setForm({})
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(item) {
    setEditing(item)
    if (activeTab === 'Users') {
      setForm({ email: item.email, name: item.name, role: item.role })
    } else if (activeTab === 'Plans') {
      setForm({ ...item })
    } else if (activeTab === 'Case Studies') {
      setForm({ company: item.company, quote: item.quote, author: item.author, role: item.role, order: item.order })
    }
  }

  function renderTable() {
    if (activeTab === 'Users') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.name || '—'}</td>
                <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button type="button" className="btn-sm btn-edit" onClick={() => startEdit(u)}>Edit</button>
                  <button type="button" className="btn-sm btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    if (activeTab === 'Plans') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Popular</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}{p.period}</td>
                <td>{p.popular ? '✓' : '—'}</td>
                <td>
                  <button type="button" className="btn-sm btn-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button type="button" className="btn-sm btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    if (activeTab === 'Case Studies') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Author</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id}>
                <td>{c.company}</td>
                <td>{c.author}</td>
                <td>{c.role}</td>
                <td>
                  <button type="button" className="btn-sm btn-edit" onClick={() => startEdit(c)}>Edit</button>
                  <button type="button" className="btn-sm btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    if (activeTab === 'Contact Submissions') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td>{s.requestType}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.subject || '—'}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <button type="button" className="btn-sm btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    return null
  }

  function renderForm() {
    if (activeTab === 'Contact Submissions') return null

    if (editing) {
      return (
        <form className="admin-form" onSubmit={handleUpdate}>
          <h3>Edit {activeTab.slice(0, -1)}</h3>
          {activeTab === 'Users' && (
            <>
              <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="New password (optional)" type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </>
          )}
          {activeTab === 'Plans' && (
            <>
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input placeholder="Tagline" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
              <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <input placeholder="Period" value={form.period || ''} onChange={(e) => setForm({ ...form, period: e.target.value })} />
              <input placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input placeholder="CTA" value={form.cta || ''} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
              <input placeholder="Href" value={form.href || ''} onChange={(e) => setForm({ ...form, href: e.target.value })} />
              <label><input type="checkbox" checked={form.popular || false} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular</label>
            </>
          )}
          {activeTab === 'Case Studies' && (
            <>
              <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
              <textarea placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required rows={3} />
              <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
              <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              <input type="number" placeholder="Order" value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} />
            </>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm({}) }}>Cancel</button>
          </div>
        </form>
      )
    }

    return (
      <form className="admin-form" onSubmit={handleCreate}>
        <h3>Add new {activeTab.slice(0, -1).toLowerCase()}</h3>
        {activeTab === 'Users' && (
          <>
            <input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            <select value={form.role || 'USER'} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </>
        )}
        {activeTab === 'Plans' && (
          <>
            <input placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Tagline" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <input placeholder="Price" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input placeholder="Period" value={form.period || ''} onChange={(e) => setForm({ ...form, period: e.target.value })} />
            <textarea placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            <input placeholder="Features (comma-separated)" value={(form.features || []).join(', ')} onChange={(e) => setForm({ ...form, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            <input placeholder="CTA" value={form.cta || ''} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
            <input placeholder="Href" value={form.href || ''} onChange={(e) => setForm({ ...form, href: e.target.value })} />
            <label><input type="checkbox" checked={form.popular || false} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular</label>
          </>
        )}
        {activeTab === 'Case Studies' && (
          <>
            <input placeholder="Company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            <textarea placeholder="Quote" value={form.quote || ''} onChange={(e) => setForm({ ...form, quote: e.target.value })} required rows={3} />
            <input placeholder="Author" value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            <input placeholder="Role" value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            <input type="number" placeholder="Order" value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} />
          </>
        )}
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    )
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">CareerOS Admin</h2>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button key={t} type="button" className={activeTab === t ? 'active' : ''} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>Back to site</button>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="admin-main">
        <h1>{activeTab}</h1>
        {error && <div className="admin-error">{error}</div>}
        {loading ? <p>Loading...</p> : (
          <>
            {renderForm()}
            <div className="admin-table-wrap">{renderTable()}</div>
          </>
        )}
      </main>
    </div>
  )
}

export default Admin
