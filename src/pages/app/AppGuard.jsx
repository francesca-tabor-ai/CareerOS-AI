import { useEffect, useState } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import LoadingState from '../../components/app/LoadingState'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function AppGuard() {
  const [status, setStatus] = useState('checking') // 'checking' | 'auth' | 'unauth'
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('unauth')
      return
    }
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) setStatus('auth')
        else setStatus('unauth')
      })
      .catch(() => setStatus('unauth'))
  }, [])

  if (status === 'checking') return <LoadingState message="Checking authentication..." />
  if (status === 'unauth')
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />

  return <Outlet />
}

export default AppGuard
