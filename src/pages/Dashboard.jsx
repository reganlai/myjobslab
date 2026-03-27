import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import JobTable from '../components/JobTable'
import AddJobModal from '../components/AddJobModal'
import ConfirmationModal from '../components/ConfirmationModal'
import ExtensionBanner from '../components/ExtensionBanner'
import logo from '../../icon.svg'

const ALL = 'All'
const STATUSES = [ALL, 'Applied', 'Interviewing', 'Rejected', 'Ghosted', 'Accepted']

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(ALL)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
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
    const { error } = await supabase.from('jobs').delete().eq('user_id', session.user.id)
    if (!error) setJobs([])
    setShowClearModal(false)
  }

  const handleAdded = (newJob) => {
    setJobs(prev => [newJob, ...prev])
  }

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j))
    
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) {
      // Revert on error
      fetchJobs()
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (!error) {
      setJobs(prev => prev.filter(j => j.id !== id))
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesFilter = filter === ALL || j.status === filter
      const matchesSearch = j.title.toLowerCase().includes(appliedSearch.toLowerCase()) || 
                            j.company.toLowerCase().includes(appliedSearch.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [jobs, filter, appliedSearch])

  // Stats for the filter tabs
  const statusCounts = useMemo(() => {
    const counts = { [ALL]: jobs.length }
    STATUSES.slice(1).forEach(s => {
      counts[s] = jobs.filter(j => j.status === s).length
    })
    return counts
  }, [jobs])

  // Stats for the "Shopify" cards (if they were still used, but left for context or other needs)
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => ['Applied', 'Interviewing'].includes(j.status)).length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
    ghosted: jobs.filter(j => j.status === 'Ghosted').length,
  }

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans relative">
      {/* Background Fix Layer */}
      <div className="fixed inset-0 bg-white -z-10" aria-hidden="true" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MyJobsLab" className="w-8 h-8" />
            <span className="font-extrabold text-lg tracking-tight text-gray-900">MyJobsLab</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              {session?.user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors border-l border-gray-100 ml-2 pl-4"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <ExtensionBanner />

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Shopify-style Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Applications</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowClearModal(true)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent"
            >
              Clear all
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-bold bg-blue-600 hover:brightness-110 text-white rounded-lg transition-all shadow-lg shadow-blue-500/25"
            >
              Add Job
            </button>
          </div>
        </div>


        {/* Tabs & Filters */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
          <div className="flex items-center gap-1 p-1 border-b border-gray-100 overflow-x-auto">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  filter === s 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {s} - {statusCounts[s]}
              </button>
            ))}
          </div>

          <div className="p-3 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filter applications"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400 font-medium"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAppliedSearch(search)}
                className="px-6 py-2 text-sm font-bold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-gray-700 shadow-sm"
              >
                Find
              </button>
            </div>
          </div>

        </div>

        {/* Table View */}
        <JobTable 
          jobs={filteredJobs} 
          onStatusChange={handleStatusChange} 
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Bottom space */}
        <div className="py-20" />
      </main>

      {/* Modals */}
      {showAddModal && session && (
        <AddJobModal
          userId={session.user.id}
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}

      {showClearModal && (
        <ConfirmationModal
          title="Delete all applications?"
          message="This will permanently delete all your job applications. This action cannot be undone."
          confirmText="Delete all"
          onConfirm={handleClearAll}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </div>
  )
}