import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import JobCard from '../components/JobCard'
import AddJobModal from '../components/AddJobModal'
import ExtensionBanner from '../components/ExtensionBanner'
import logo from '../../icon.svg'

const ALL = 'All'
const STATUSES = [ALL, 'Applied', 'Interviewing', 'Rejected', 'Ghosted', 'Accepted']

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(ALL)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/')
      }
    })
    
    return () => subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!session) return
    fetchJobs()
  }, [session])

  const fetchJobs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setJobs(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleClearAll = async () => {
    const confirmed = window.confirm('Delete all your job applications? This cannot be undone.')
    if (!confirmed) return
    const { error } = await supabase.from('jobs').delete().eq('user_id', session.user.id)
    if (!error) setJobs([])
  }

  const handleAdded = (newJob) => {
    setJobs(prev => [newJob, ...prev])
  }

  const handleStatusChange = (id, newStatus) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j))
  }

  const handleDelete = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const filteredJobs = filter === ALL ? jobs : jobs.filter(j => j.status === filter)

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="MyJobsLab" className="w-8 h-8" />
            <span className="font-bold text-base tracking-tight text-gray-900">MyJobsLab</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('extensionBannerDismissed')
                window.dispatchEvent(new Event('showExtensionBanner'))
              }}
              className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Get Extension
            </button>
            <button
              onClick={handleLogout}
              className="text-sm border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Extension banner */}
      <ExtensionBanner />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">

      {/* Controls row */}
      <div className="flex items-center justify-between mb-6 gap-3">
        
        {/* Email — far left */}
        <span className="text-sm text-gray-400 truncate max-w-[300px]">
          {session?.user?.email}
        </span>

        {/* Buttons — far right */}
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-xl px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s === ALL ? 'All Statuses' : s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Add Job */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:brightness-110 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow shadow-blue-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>

          {/* Clear All */}
          {jobs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </div>

      </div>

        {/* Job count summary */}
        {!loading && jobs.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'application' : 'applications'}
            {filter !== ALL && ` · ${filter}`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-semibold text-lg mb-1">
              {filter !== ALL ? `No ${filter} applications` : 'No applications yet'}
            </h3>
            <p className="text-gray-400 text-sm">
              {filter !== ALL
                ? 'Try a different status filter.'
                : 'Click "Add Job" to log your first application.'}
            </p>
          </div>
        )}

        {/* Job list */}
        {!loading && filteredJobs.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Job Modal */}
      {showModal && session && (
        <AddJobModal
          userId={session.user.id}
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  )
}