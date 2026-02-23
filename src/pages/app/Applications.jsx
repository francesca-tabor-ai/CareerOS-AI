import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import EmptyState from '../../components/app/EmptyState'
import LoadingState from '../../components/app/LoadingState'

function Applications() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/jobs')
      if (res.ok) {
        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingState message="Loading applications..." />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Applications</h1>
        <p className="text-[var(--color-text-muted)]">
          Track your applications, edit cover letters & PRDs, and manage outcomes.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8">
          <EmptyState
            icon="📋"
            title="No applications yet"
            description="Applications appear here once you add a job. Generate cover letters and PRDs, then track outcomes."
            action={
              <Link
                to="/app/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Add a job first →
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_100px] gap-4 px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>AI</span>
          </div>
          {applications.map((app) => (
            <Link
              key={app.id}
              to={`/app/applications/${app.id}`}
              className="block"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_100px] gap-4 p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors">
                <span className="font-semibold text-[var(--color-text)]">{app.company_name}</span>
                <span className="text-[var(--color-text-muted)]">{app.job_title}</span>
                <span className="text-xs px-2 py-1 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] uppercase self-center w-fit">
                  {app.status}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  Lvl {app.ai_maturity_level ?? '–'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Applications
