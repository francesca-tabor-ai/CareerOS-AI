import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import EmptyState from '../../components/app/EmptyState'
import LoadingState from '../../components/app/LoadingState'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, byStatus: {}, interviewRate: 0 })

  useEffect(() => {
    apiFetch('/api/jobs')
      .then((r) => r.json())
      .then((apps) => {
        const total = apps.length
        const byStatus = apps.reduce((acc, a) => {
          acc[a.status] = (acc[a.status] || 0) + 1
          return acc
        }, {})
        const outcomes = apps.filter((a) => a.status === 'interview' || a.status === 'offer' || a.status === 'rejected')
        const positive = apps.filter((a) => a.status === 'interview' || a.status === 'offer').length
        setStats({
          total,
          byStatus,
          interviewRate: outcomes.length > 0 ? Math.round((positive / outcomes.length) * 100) : 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Dashboard</h1>
      <p className="text-[var(--color-text-muted)] mb-8">
        Your career application hub. Add jobs, generate cover letters & PRDs, and track outcomes.
      </p>

      {loading ? (
        <LoadingState message="Loading stats..." />
      ) : stats.total > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</div>
            <div className="text-sm text-[var(--color-text-muted)]">Applications</div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="text-2xl font-bold text-[var(--color-teal)]">
              {stats.byStatus.ready ?? 0}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">Ready to apply</div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="text-2xl font-bold text-[var(--color-accent)]">
              {(stats.byStatus.interview ?? 0) + (stats.byStatus.offer ?? 0)}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">Interviews / Offers</div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="text-2xl font-bold text-[var(--color-text)]">{stats.interviewRate}%</div>
            <div className="text-sm text-[var(--color-text-muted)]">Success rate</div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Link
          to="/app/classic"
          className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
        >
          <span className="text-2xl mb-2 block">🧠</span>
          <h3 className="font-semibold text-[var(--color-text)] mb-1">Market Intelligence</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Full job engine with parsing & PRDs</p>
        </Link>
        <Link
          to="/app/jobs"
          className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
        >
          <span className="text-2xl mb-2 block">💼</span>
          <h3 className="font-semibold text-[var(--color-text)] mb-1">Jobs</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Add and manage job opportunities</p>
        </Link>
        <Link
          to="/app/applications"
          className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
        >
          <span className="text-2xl mb-2 block">📋</span>
          <h3 className="font-semibold text-[var(--color-text)] mb-1">Applications</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Track applications and outcomes</p>
        </Link>
        <Link
          to="/app/profile"
          className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
        >
          <span className="text-2xl mb-2 block">👤</span>
          <h3 className="font-semibold text-[var(--color-text)] mb-1">Profile</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Resume, skills & preferences</p>
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8">
        <EmptyState
          icon="🚀"
          title="Get started"
          description="Add your first job by pasting a URL or description. We'll parse it, assess AI maturity, and generate a tailored cover letter and strategic PRD."
          action={
            <Link
              to="/app/jobs"
              className="btn btn-primary"
            >
              Add a job →
            </Link>
          }
        />
      </div>
    </div>
  )
}

export default Dashboard
