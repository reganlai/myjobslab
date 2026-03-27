import StatusBadge from './StatusBadge'

export default function JobTable({ jobs, onStatusChange, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
        <p className="text-gray-500 font-medium">No results found</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-10">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              </th>
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Job</th>
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company</th>
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Link</th>
              <th className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-5 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm tracking-tight">{job.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 font-medium">{job.company}</td>
                <td className="px-5 py-4 text-sm text-gray-400">
                  {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 py-4">
                  {job.url ? (
                    <a 
                      href={job.url.startsWith('http') ? job.url : `https://${job.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors inline-block"
                      title={job.url}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-gray-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={job.status}
                      onChange={(e) => onStatusChange(job.id, e.target.value)}
                      className="text-[11px] border border-gray-200 rounded px-2 py-1 bg-white hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      {['Applied', 'Interviewing', 'Rejected', 'Ghosted', 'Accepted'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                      aria-label="Delete job"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
