const STATUS_STYLES = {
  Applied:      'bg-blue-50 text-blue-700 border-blue-100',
  Interviewing: 'bg-amber-50 text-amber-700 border-amber-100',
  Rejected:     'bg-red-50 text-red-700 border-red-100',
  Ghosted:      'bg-slate-50 text-slate-600 border-slate-100',
  Accepted:     'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Applied
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60"></span>
      {status}
    </span>
  )
}
