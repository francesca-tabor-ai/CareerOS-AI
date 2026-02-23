import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  UserCircle,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  BrainCircuit,
  BarChart3,
  Loader2,
  Trash2,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { apiFetch, apiJson } from '../lib/api'

function getStatusIcon(status) {
  switch (status) {
    case 'ingested':
      return <Clock size={14} className="opacity-50" />
    case 'ready':
      return <CheckCircle2 size={14} className="text-emerald-600" />
    case 'applied':
      return <Send size={14} className="text-blue-600" />
    case 'interview':
      return <BrainCircuit size={14} className="text-purple-600" />
    case 'rejected':
      return <AlertCircle size={14} className="text-red-600" />
    case 'offer':
      return <CheckCircle2 size={14} className="text-emerald-600" />
    default:
      return <Clock size={14} />
  }
}

export default function CareerOSApp() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [profile, setProfile] = useState({ name: '', cv_text: '', prior_prds: '', target_roles: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login?redirect=/app')
      return
    }
    setAuthChecked(true)
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [jobsRes, profileRes] = await Promise.all([
        apiFetch('/api/jobs'),
        apiFetch('/api/profile'),
      ])
      if (jobsRes.status === 401) {
        navigate('/login?redirect=/app')
        return
      }
      const jobsData = await jobsRes.json()
      const profileData = await profileRes.json()
      setJobs(Array.isArray(jobsData) ? jobsData : [])
      setProfile(
        profileData.id || profileData.name !== undefined
          ? profileData
          : { name: '', cv_text: '', prior_prds: '', target_roles: '' }
      )
    } catch (err) {
      console.error('Error fetching data:', err)
      if (err.message?.includes('401')) navigate('/login?redirect=/app')
    } finally {
      setLoading(false)
    }
  }

  const handleAddJob = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const jobData = {
      company_name: form.company_name?.value,
      job_title: form.job_title?.value,
      job_description: form.job_description?.value,
      application_link: form.application_link?.value,
    }
    try {
      const res = await apiJson('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      })
      await fetchData()
      setActiveTab('dashboard')
    } catch (err) {
      console.error('Error adding job:', err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await apiJson('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profile),
      })
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  const generateArtifacts = async (job) => {
    if (!profile.cv_text) {
      alert('Please complete your profile first!')
      setActiveTab('profile')
      return
    }
    setIsGenerating(true)
    try {
      await apiJson(`/api/jobs/${job.id}/generate`, { method: 'POST' })
      await fetchData()
    } catch (err) {
      console.error('Error generating artifacts:', err)
      alert(err.message || 'Failed to generate artifacts')
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      await apiJson(`/api/jobs/${id}`, { method: 'DELETE' })
      await fetchData()
      if (selectedJobId === id) setSelectedJobId(null)
    } catch (err) {
      console.error('Error deleting job:', err)
    }
  }

  const updateJobStatus = async (id, status) => {
    try {
      await apiJson(`/api/jobs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      await fetchData()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId)

  if (!authChecked) return null

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      <nav className="fixed left-0 top-0 h-full w-64 border-r border-[#141414] bg-[#E4E3E0] z-10 flex flex-col">
        <div className="p-8 border-b border-[#141414]">
          <h1 className="text-2xl font-bold tracking-tighter italic font-serif">CareerOS AI</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Autonomous PRD Engine</p>
        </div>

        <div className="flex-1 px-4 py-8 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/5'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('add-job')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'add-job' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/5'}`}
          >
            <PlusCircle size={18} />
            <span className="text-sm font-medium">New Application</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/5'}`}
          >
            <UserCircle size={18} />
            <span className="text-sm font-medium">Profile & CV</span>
          </button>
        </div>

        <div className="p-8 border-t border-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#141414] flex items-center justify-center text-[#E4E3E0] text-xs font-bold">
              {profile.name?.slice(0, 2).toUpperCase() || 'FT'}
            </div>
            <div>
              <p className="text-xs font-bold">{profile.name || 'User'}</p>
              <p className="text-[10px] opacity-50">CareerOS</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="ml-64 p-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-serif italic font-bold">Market Intelligence</h2>
                  <p className="text-sm opacity-60 mt-2">Tracking {jobs.length} active opportunities</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 border border-[#141414] rounded-full flex items-center gap-2">
                    <BarChart3 size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Success Rate: 24%</span>
                  </div>
                </div>
              </div>

              <div className="border border-[#141414] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_80px] p-4 border-b border-[#141414] bg-[#141414] text-[#E4E3E0]">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Company</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">Role</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">Status</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">AI Maturity</span>
                  <span />
                </div>

                {loading ? (
                  <div className="p-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin opacity-20" size={40} />
                    <p className="text-xs opacity-40 uppercase tracking-widest">Syncing with market...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <p className="text-xl font-serif italic opacity-40">No opportunities ingested yet.</p>
                    <button
                      onClick={() => setActiveTab('add-job')}
                      className="px-6 py-2 bg-[#141414] text-[#E4E3E0] rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Ingest First Job
                    </button>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id)
                        setActiveTab('job-detail')
                      }}
                      className="grid grid-cols-[1fr_1.5fr_1fr_1fr_80px] p-4 border-b border-[#141414]/10 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-pointer group"
                    >
                      <span className="font-bold">{job.company_name}</span>
                      <span className="font-medium opacity-80">{job.job_title}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="text-[10px] uppercase font-bold tracking-wider">{job.status}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-3 rounded-full ${i < (job.ai_maturity_level || 0) ? 'bg-current' : 'bg-current/10'}`}
                          />
                        ))}
                        <span className="text-[10px] font-mono ml-2">Lvl {job.ai_maturity_level ?? '-'}</span>
                      </div>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'add-job' && (
            <motion.div
              key="add-job"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-serif italic font-bold">Ingest Opportunity</h2>
                <p className="text-sm opacity-60 mt-2">Feed the engine with job details to begin strategic parsing.</p>
              </div>

              <form onSubmit={handleAddJob} className="space-y-6 bg-white/50 p-8 rounded-2xl border border-[#141414]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Company Name</label>
                    <input
                      name="company_name"
                      required
                      className="w-full bg-transparent border-b border-[#141414] py-2 focus:outline-none focus:border-b-2 font-medium"
                      placeholder="e.g. Anthropic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Job Title</label>
                    <input
                      name="job_title"
                      required
                      className="w-full bg-transparent border-b border-[#141414] py-2 focus:outline-none focus:border-b-2 font-medium"
                      placeholder="e.g. Senior AI Product Manager"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Application Link</label>
                  <input
                    name="application_link"
                    className="w-full bg-transparent border-b border-[#141414] py-2 focus:outline-none focus:border-b-2 font-medium"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Job Description</label>
                  <textarea
                    name="job_description"
                    required
                    rows={10}
                    className="w-full bg-transparent border border-[#141414] p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#141414] font-medium text-sm"
                    placeholder="Paste the full job description here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  Initialize Strategic Parsing
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-serif italic font-bold">Candidate Identity</h2>
                <p className="text-sm opacity-60 mt-2">The source material for all generated strategic artifacts.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8 bg-white/50 p-10 rounded-2xl border border-[#141414]">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Full Name</label>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-[#141414] py-2 focus:outline-none text-2xl font-serif italic font-bold"
                    placeholder="Your Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">CV / Experience Text</label>
                    <textarea
                      value={profile.cv_text}
                      onChange={(e) => setProfile({ ...profile, cv_text: e.target.value })}
                      required
                      rows={15}
                      className="w-full bg-transparent border border-[#141414] p-4 rounded-xl focus:outline-none text-sm font-mono"
                      placeholder="Paste your CV content here..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Prior PRDs & Strategic Docs</label>
                    <textarea
                      value={profile.prior_prds}
                      onChange={(e) => setProfile({ ...profile, prior_prds: e.target.value })}
                      rows={15}
                      className="w-full bg-transparent border border-[#141414] p-4 rounded-xl focus:outline-none text-sm font-mono"
                      placeholder="Paste snippets of your best work to train the tone..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"
                >
                  Update Identity Core
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'job-detail' && selectedJob && (
            <motion.div
              key="job-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => deleteJob(selectedJob.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_350px] gap-12">
                <div className="space-y-12">
                  <header className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-6xl font-serif italic font-bold">{selectedJob.company_name}</h2>
                      <div className="px-4 py-1 bg-[#141414] text-[#E4E3E0] rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {selectedJob.status}
                      </div>
                    </div>
                    <p className="text-2xl opacity-60">{selectedJob.job_title}</p>
                  </header>

                  {selectedJob.status === 'ingested' ? (
                    <div className="p-20 border-2 border-dashed border-[#141414]/20 rounded-3xl text-center space-y-6">
                      <BrainCircuit size={48} className="mx-auto opacity-20" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-serif italic font-bold">Intelligence Required</h3>
                        <p className="text-sm opacity-50 max-w-md mx-auto">
                          The engine needs to parse this role to generate strategic artifacts and assess AI maturity.
                        </p>
                      </div>
                      <button
                        onClick={() => generateArtifacts(selectedJob)}
                        disabled={isGenerating}
                        className="px-10 py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3 mx-auto"
                      >
                        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                        {isGenerating ? 'Synthesizing...' : 'Generate Strategic Artifacts'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      {selectedJob.parsed_intelligence && (
                        <section className="space-y-6">
                          <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 border-b border-[#141414]/10 pb-2">Strategic Intelligence</h3>
                          <div className="grid grid-cols-2 gap-6">
                            {Object.entries(
                              (() => {
                                try {
                                  return typeof selectedJob.parsed_intelligence === 'string'
                                    ? JSON.parse(selectedJob.parsed_intelligence)
                                    : selectedJob.parsed_intelligence || {}
                                } catch {
                                  return {}
                                }
                              })()
                            ).map(([key, value]) => (
                              <div key={key} className="p-6 bg-white/30 rounded-2xl border border-[#141414]/5 space-y-2">
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">{key.replace(/([A-Z])/g, ' $1')}</p>
                                <p className="text-sm font-medium leading-relaxed">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {selectedJob.cover_letter && (
                        <section className="space-y-6">
                          <div className="flex items-center justify-between border-b border-[#141414]/10 pb-2">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Tailored Cover Letter</h3>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(selectedJob.cover_letter)
                                alert('Copied to clipboard!')
                              }}
                              className="text-[10px] font-bold uppercase tracking-widest hover:underline"
                            >
                              Copy to Clipboard
                            </button>
                          </div>
                          <div className="p-10 bg-white rounded-3xl border border-[#141414]/5 shadow-sm font-serif text-lg leading-relaxed whitespace-pre-wrap">
                            {selectedJob.cover_letter}
                          </div>
                        </section>
                      )}

                      {selectedJob.prd_content && (
                        <section className="space-y-6">
                          <div className="flex items-center justify-between border-b border-[#141414]/10 pb-2">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Strategic AI PRD</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Export PDF</span>
                          </div>
                          <div className="p-10 bg-[#141414] text-[#E4E3E0] rounded-3xl shadow-xl font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
                            {selectedJob.prd_content}
                          </div>
                        </section>
                      )}
                    </div>
                  )}
                </div>

                <aside className="space-y-8">
                  <div className="p-8 bg-white/50 rounded-2xl border border-[#141414] space-y-6">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest">Application Status</h4>
                    <div className="space-y-4">
                      {['ingested', 'ready', 'applied', 'interview', 'rejected', 'offer'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateJobStatus(selectedJob.id, status)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedJob.status === status ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' : 'border-transparent hover:border-[#141414]/20'}`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-widest">{status}</span>
                          {selectedJob.status === status && <CheckCircle2 size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-[#141414] text-[#E4E3E0] rounded-2xl space-y-6">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-50">AI Maturity Roadmap</h4>
                    <div className="space-y-4">
                      {[
                        'Data Intelligence',
                        'Recommendations',
                        'Decision Tracking',
                        'Outcome Attribution',
                        'Predictive Optimisation',
                        'Semi-Autonomous Agents',
                        'Autonomous Systems',
                      ].map((level, i) => (
                        <div key={level} className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i + 1 <= (selectedJob.ai_maturity_level || 0) ? 'bg-[#E4E3E0] text-[#141414]' : 'border border-[#E4E3E0]/20 text-[#E4E3E0]/20'}`}
                          >
                            {i + 1}
                          </div>
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider ${i + 1 <= (selectedJob.ai_maturity_level || 0) ? 'opacity-100' : 'opacity-20'}`}
                          >
                            {level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedJob.application_link && (
                    <a
                      href={selectedJob.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Go to Application
                    </a>
                  )}
                </aside>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
