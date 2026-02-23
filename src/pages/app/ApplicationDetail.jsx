import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch, apiJson } from '../../lib/api'
import LoadingState from '../../components/app/LoadingState'

function ApplicationDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [app, setApp] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [prdContent, setPrdContent] = useState('')
  const [activeTab, setActiveTab] = useState('cover') // 'cover' | 'prd'
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (id) fetchApp()
  }, [id])

  async function fetchApp() {
    setLoading(true)
    try {
      const res = await apiFetch(`/api/jobs/${id}`)
      if (res.ok) {
        const data = await res.json()
        setApp(data)
        setCoverLetter(data.cover_letter ?? '')
        setPrdContent(data.prd_content ?? '')
      }
    } catch (err) {
      console.error('Error fetching application:', err)
      setMessage({ type: 'error', text: 'Failed to load' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!id) return
    setSaving(true)
    setMessage(null)
    try {
      await apiJson(`/api/jobs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          cover_letter: coverLetter,
          prd_content: prdContent,
        }),
      })
      setMessage({ type: 'success', text: 'Saved' })
      fetchApp()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(newStatus) {
    if (!id) return
    setMessage(null)
    try {
      await apiJson(`/api/jobs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })
      setApp((a) => ({ ...a, status: newStatus }))
      setMessage({ type: 'success', text: 'Status updated' })
      setTimeout(() => setMessage(null), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' })
    }
  }

  async function handleGenerate() {
    if (!id) return
    setGenerating(true)
    setMessage(null)
    try {
      await apiJson(`/api/jobs/${id}/generate`, { method: 'POST' })
      setMessage({ type: 'success', text: 'Generated. Review and edit below.' })
      fetchApp()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate' })
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    const text = activeTab === 'cover' ? coverLetter : prdContent
    navigator.clipboard.writeText(text)
    setMessage({ type: 'success', text: 'Copied to clipboard' })
    setTimeout(() => setMessage(null), 2000)
  }

  if (loading) return <LoadingState message="Loading..." />
  if (!app) return <div className="text-[var(--color-text-muted)]">Application not found</div>

  const hasArtifacts = !!app.cover_letter || !!app.prd_content

  return (
    <div>
      <Link
        to="/app/applications"
        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4 inline-block"
      >
        ← Back to Applications
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {app.company_name} – {app.job_title}
          </h1>
          <select
            value={app.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="mt-2 text-sm px-3 py-1 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
          >
            <option value="ingested">Ingested</option>
            <option value="parsed">Parsed</option>
            <option value="ready">Ready</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
        </div>
        <div className="flex gap-2">
          {!hasArtifacts ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate cover letter & PRD'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[var(--color-teal)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save edits'}
            </button>
          )}
          {app.application_link && (
            <a
              href={app.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:border-[var(--color-accent)] transition-colors"
            >
              Open application →
            </a>
          )}
        </div>
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

      {!hasArtifacts ? (
        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-12 text-center">
          <p className="text-[var(--color-text-muted)] mb-4">
            Generate a tailored cover letter and strategic PRD for this role.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('cover')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'cover'
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Cover letter
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prd')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'prd'
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Strategic PRD
            </button>
          </div>

          <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <span className="text-sm text-[var(--color-text-muted)]">
                {activeTab === 'cover' ? `${coverLetter.split(/\s+/).filter(Boolean).length} words` : 'Markdown'}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Copy to clipboard
              </button>
            </div>
            <textarea
              value={activeTab === 'cover' ? coverLetter : prdContent}
              onChange={(e) =>
                activeTab === 'cover'
                  ? setCoverLetter(e.target.value)
                  : setPrdContent(e.target.value)
              }
              rows={20}
              className="w-full p-4 bg-transparent text-[var(--color-text)] font-mono text-sm resize-y focus:outline-none"
              placeholder={activeTab === 'cover' ? 'Cover letter...' : 'PRD content...'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationDetail
