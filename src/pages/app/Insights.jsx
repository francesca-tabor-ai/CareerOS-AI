import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'

function Insights() {
  const [loading, setLoading] = useState(true)
  const [apps, setApps] = useState([])
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    apiFetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setApps(list)

        if (list.length === 0) {
          setInsights(null)
          return
        }

        const byStatus = list.reduce((acc, a) => {
          acc[a.status] = (acc[a.status] || 0) + 1
          return acc
        }, {})
        const withOutcome = list.filter(
          (a) => ['interview', 'offer', 'rejected'].includes(a.status)
        )
        const positive = list.filter((a) =>
          ['interview', 'offer'].includes(a.status)
        ).length
        const interviewRate =
          withOutcome.length > 0
            ? Math.round((positive / withOutcome.length) * 100)
            : 0

        const byMaturity = list.reduce((acc, a) => {
          const lvl = a.ai_maturity_level ?? 0
          acc[lvl] = (acc[lvl] || 0) + 1
          return acc
        }, {})

        const topCompanies = [...list]
          .filter((a) => a.status === 'interview' || a.status === 'offer')
          .map((a) => a.company_name)
        const companyCounts = topCompanies.reduce((acc, c) => {
          acc[c] = (acc[c] || 0) + 1
          return acc
        }, {})
        const bestPerformers = Object.entries(companyCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name)

        setInsights({
          total: list.length,
          byStatus,
          interviewRate,
          byMaturity,
          bestPerformers,
        })
      })
      .catch(() => setInsights(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )

  if (!insights)
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          Learning & insights
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8">
          As you add applications and track outcomes, insights will appear here.
        </p>
        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-12 text-center">
          <p className="text-[var(--color-text-muted)] mb-4">
            Add jobs and track outcomes to unlock insights.
          </p>
          <Link
            to="/app/jobs"
            className="inline-flex px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm"
          >
            Add a job →
          </Link>
        </div>
      </div>
    )

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
        Learning & insights
      </h1>
      <p className="text-[var(--color-text-muted)] mb-8">
        Analytics on your applications and outcomes. More data = better recommendations.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-4">
            Outcome funnel
          </h3>
          <div className="space-y-3">
            {Object.entries(insights.byStatus)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)] capitalize">
                    {status}
                  </span>
                  <span className="font-medium text-[var(--color-text)]">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-4">
            Key metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-[var(--color-accent)]">
                {insights.interviewRate}%
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                Interview/offer rate
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {insights.total}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                Total applications
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-4">
            AI maturity mix
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(insights.byMaturity)
              .sort((a, b) => a[0] - b[0])
              .map(([lvl, count]) => (
                <div key={lvl} className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Level {lvl || '?'}
                  </span>
                  <span className="text-[var(--color-text)]">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6">
        <h3 className="font-semibold text-[var(--color-text)] mb-2">
          Recommendation engine
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Target roles similar to those where you've had success. As you track more outcomes, recommendations will improve.
        </p>
        {insights.bestPerformers?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {insights.bestPerformers.map((name) => (
              <span
                key={name}
                className="px-3 py-1 rounded-full bg-[var(--color-teal-soft)] text-[var(--color-teal)] text-sm"
              >
                {name}
              </span>
            ))}
            <span className="text-xs text-[var(--color-text-muted)] self-center ml-2">
              → Focus on similar companies
            </span>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            Track interview/offer outcomes to see which companies convert best.
          </p>
        )}
      </div>
    </div>
  )
}

export default Insights
