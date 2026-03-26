import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const STATUSES = ['Applied', 'Interviewing', 'Rejected', 'Ghosted', 'Accepted']

const STATUS_STYLES = {
  Applied:      { border: 'border-l-indigo-500',  badge: 'bg-indigo-500/15 text-indigo-300' },
  Interviewing: { border: 'border-l-amber-400',   badge: 'bg-amber-400/15 text-amber-300' },
  Rejected:     { border: 'border-l-red-500',     badge: 'bg-red-500/15 text-red-400' },
  Ghosted:      { border: 'border-l-slate-500',   badge: 'bg-slate-500/15 text-slate-400' },
  Accepted:     { border: 'border-l-emerald-500', badge: 'bg-emerald-500/15 text-emerald-300' },
}

export default function JobCard({ job, onStatusChange, onDelete }) {
  const [status, setStatus] = useState(job.status)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const style = STATUS_STYLES[status] || STATUS_STYLES['Applied']

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setSaving(true)
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', job.id)
    setSaving(false)
    if (!error) onStatusChange(job.id, newStatus)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('jobs').delete().eq('id', job.id)
    if (!error) onDelete(job.id)
    else setDeleting(false)
  }

  const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className={`bg-slate-900 border border-slate-800 border-l-4 ${style.border} rounded-[2rem] p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 hover:border-slate-700 group`}>
      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white truncate leading-snug">{job.title}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{job.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="text-xs text-slate-500">{formattedDate}</span>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2 truncate max-w-xs"
            >
              View listing ↗
            </a>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Status dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={saving}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 pr-7 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 transition"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
          aria-label="Delete job"
        >
          {deleting ? (
            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
