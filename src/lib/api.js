const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers.Authorization = `Bearer ${token}`

  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`)
  return data
}
