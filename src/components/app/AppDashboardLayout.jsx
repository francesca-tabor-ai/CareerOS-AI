import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/app', label: 'Dashboard', icon: '📊' },
  { path: '/app/jobs', label: 'Jobs', icon: '💼' },
  { path: '/app/applications', label: 'Applications', icon: '📋' },
  { path: '/app/insights', label: 'Insights', icon: '📈' },
  { path: '/app/profile', label: 'Profile', icon: '👤' },
  { path: '/app/classic', label: 'Market Intelligence', icon: '🧠' },
]

function AppDashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="p-5 border-b border-[var(--color-border)]">
            <Link to="/app" className="font-[var(--font-heading)] font-bold text-lg text-[var(--color-text)]">
              Career<span className="gradient-text">OS</span> AI
            </Link>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Job Application Engine</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map(({ path, label, icon }) => {
              const active = location.pathname === path || (path !== '/app' && location.pathname.startsWith(path))
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-card)]'
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="p-3 border-t border-[var(--color-border)]">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-card)] transition-colors"
            >
              ← Back to site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors text-left mt-0.5"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppDashboardLayout
