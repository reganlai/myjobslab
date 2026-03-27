import { useEffect, useRef } from 'react'

export default function ConfirmationModal({ title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger' }) {
  const backdropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onCancel()
  }

  const confirmColors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
    primary: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all border border-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${variant === 'danger' ? 'bg-red-50' : 'bg-indigo-50'}`}>
              <svg className={`w-5 h-5 ${variant === 'danger' ? 'text-red-500' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-150 shadow-lg ${confirmColors[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
