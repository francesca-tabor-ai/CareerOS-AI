import { useState, useEffect } from 'react'
import { apiFetch, apiJson } from '../../lib/api'
import LoadingState from '../../components/app/LoadingState'

function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [profile, setProfile] = useState({
    name: '',
    headline: '',
    cv_text: '',
    resume_url: '',
    skills: [],
    target_roles: '',
    prior_prds: '',
    include_prd: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile({
          name: data.name ?? '',
          headline: data.headline ?? '',
          cv_text: data.cv_text ?? '',
          resume_url: data.resume_url ?? '',
          skills: Array.isArray(data.skills) ? data.skills : [],
          target_roles: Array.isArray(data.target_roles) ? data.target_roles.join(', ') : (data.target_roles ?? ''),
          prior_prds: data.prior_prds ?? '',
          include_prd: data.include_prd !== false,
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await apiJson('/api/profile', {
        method: 'POST',
        body: JSON.stringify({
          ...profile,
          skills: Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  function handleSkillsChange(e) {
    const val = e.target.value
    const arr = val.split(',').map(s => s.trim()).filter(Boolean)
    setProfile((p) => ({ ...p, skills: arr }))
  }

  if (loading) return <LoadingState message="Loading profile..." />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Profile</h1>
        <p className="text-[var(--color-text-muted)]">
          Your resume, skills, experience, and preferences power the cover letter and PRD generators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-[var(--color-teal-soft)] border border-[var(--color-teal)]/30 text-[var(--color-teal)]'
                : 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 space-y-4">
          <h3 className="font-semibold text-[var(--color-text)]">Basic info</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Full name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Headline</label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
              placeholder="e.g. Senior AI Product Manager"
            />
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 space-y-4">
          <h3 className="font-semibold text-[var(--color-text)]">Resume & experience</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Resume URL</label>
            <input
              type="url"
              value={profile.resume_url}
              onChange={(e) => setProfile((p) => ({ ...p, resume_url: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
              placeholder="https://... (link to your resume)"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Optional: link to your resume or portfolio</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">CV / experience text</label>
            <textarea
              value={profile.cv_text}
              onChange={(e) => setProfile((p) => ({ ...p, cv_text: e.target.value }))}
              rows={10}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none resize-y font-mono text-sm"
              placeholder="Paste your CV or experience summary here. Used to tailor cover letters and PRDs."
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Required for AI generation</p>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 space-y-4">
          <h3 className="font-semibold text-[var(--color-text)]">Skills & targeting</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills}
              onChange={(e) => setProfile((p) => ({ ...p, skills: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
              placeholder="AI/ML, Product strategy, Roadmapping, Go-to-market"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Target roles</label>
            <input
              type="text"
              value={profile.target_roles}
              onChange={(e) => setProfile((p) => ({ ...p, target_roles: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none"
              placeholder="AI Product Manager, Senior PM, Head of Product"
            />
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 space-y-4">
          <h3 className="font-semibold text-[var(--color-text)]">Preferences</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Prior PRDs & strategic docs</label>
            <textarea
              value={profile.prior_prds}
              onChange={(e) => setProfile((p) => ({ ...p, prior_prds: e.target.value }))}
              rows={6}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none resize-y font-mono text-sm"
              placeholder="Paste snippets of your best PRDs to train the tone and style of generated content."
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.include_prd}
              onChange={(e) => setProfile((p) => ({ ...p, include_prd: e.target.checked }))}
              className="rounded border-[var(--color-border)]"
            />
            <span className="text-sm text-[var(--color-text)]">Include strategic PRD in applications (when applicable)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}

export default Profile
