import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, apiJson } from '../../lib/api'
import EmptyState from '../../components/app/EmptyState'
import LoadingState from '../../components/app/LoadingState'

function Jobs() {
  const [loading, setLoading] = useState(true)
  const [parsing, setParsing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [jobs, setJobs] = useState([])
  const [mode, setMode] = useState('paste') // 'paste' | 'manual'
  const [rawInput, setRawInput] = useState('')
  const [form, setForm] = useState({
    company_name: '',
    job_title: '',
    job_description: '',
    application_link: '',
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/jobs')
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setMessage({ type: 'error', text: 'Failed to load jobs' })
    } finally {
      setLoading(false)
    }
  }

  async function handleParse() {
    if (!rawInput.trim()) return
    setParsing(true)
    setMessage(null)
    try {
      const parsed = await apiJson('/api/jobs/parse', {
        method: 'POST',
        body: JSON.stringify({ raw_input: rawInput }),
      })
      setForm({
        company_name: parsed.company_name || '',
        job_title: parsed.job_title || '',
        job_description: parsed.job_description || '',
        application_link: parsed.application_link || '',
      })
      setMessage({ type: 'success', text: 'Job details extracted. Review and save.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to parse' })
    } finally {
      setParsing(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.company_name?.trim() || !form.job_title?.trim() || !form.job_description?.trim()) {
      setMessage({ type: 'error', text: 'Company, title, and description are required' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      await apiJson('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          raw_input: mode === 'paste' && rawInput ? rawInput : undefined,
        }),
      })
      setMessage({ type: 'success', text: 'Job added successfully' })
      setForm({ company_name: '', job_title: '', job_description: '', application_link: '' })
      setRawInput('')
      fetchJobs()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save job' })
    } finally {
      setSaving(false)
    }
  }

  if (loading && jobs.length === 0) return <LoadingState message="Loading jobs..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Jobs</h1>
          <p className="text-[var(--color-text-muted)]">
            Add job opportunities by pasting a URL or description, or enter details manually.
          </p>
        </div>
      </div>

      {/* Add job form */}
      <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'paste'
                ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Paste & parse
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Manual entry
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-[var(--color-teal-soft)] border border-[var(--color-teal)]/30 text-[var(--color-teal)]'
                : 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]'
            }`}
          >
            {message.text}
          </div>
        )}

        {mode === 'paste' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                Paste job URL or full description
              </label>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none resize-y font-mono text-sm"
                placeholder="Paste the job posting text or a URL..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleParse}
                disabled={parsing || !rawInput.trim()}
                className="px-4 py-2 rounded-lg bg-[var(--color-teal)] text-[var(--color-bg)] font-medium text-sm hover:opacity-90 disabled:opacity-50"
              >
                {parsing ? 'Parsing...' : 'Parse'}
              </button>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Company</label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Job title</label>
              <input
                type="text"
                value={form.job_title}
                onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
                placeholder="Job title"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Application link</label>
            <input
              type="url"
              value={form.application_link}
              onChange={(e) => setForm((f) => ({ ...f, application_link: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Job description</label>
            <textarea
              value={form.job_description}
              onChange={(e) => setForm((f) => ({ ...f, job_description: e.target.value }))}
              rows={8}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none resize-y"
              placeholder="Full job description"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add job'}
          </button>
        </form>
      </div>

      {/* Job list */}
      {jobs.length === 0 ? (
        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8">
          <EmptyState
            icon="💼"
            title="No jobs yet"
            description="Add your first job above. Then go to Market Intelligence to generate cover letters and PRDs."
            action={
              <Link
                to="/app/classic"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Open Market Intelligence →
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold text-[var(--color-text)]">Your jobs ({jobs.length})</h3>
          {jobs.map((job) => (
            <Link
              key={job.id}
              to="/app/classic"
              className="block p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-[var(--color-text)]">{job.company_name}</span>
                  <span className="text-[var(--color-text-muted)] mx-2">–</span>
                  <span className="text-[var(--color-text-muted)]">{job.job_title}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] uppercase">
                  {job.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Jobs
