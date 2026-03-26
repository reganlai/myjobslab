import { useState, useEffect } from 'react'

const BANNER_KEY = 'extensionBannerDismissed'

export default function ExtensionBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(BANNER_KEY)) {
      setVisible(true)
    }

    const handler = () => setVisible(true)
    window.addEventListener('showExtensionBanner', handler)
    return () => window.removeEventListener('showExtensionBanner', handler)
  }, [])

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      
      {/* Modal card */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">

        {/* Dismiss X */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mx-auto mb-5">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-extrabold text-gray-900 text-center tracking-tight mb-2">
          Get the Chrome Extension
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-sm text-center leading-relaxed mb-6">
          Save any job listing to your dashboard in one click — directly from LinkedIn, Indeed, or Handshake. No copy-pasting, no switching tabs.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-7">
          {['LinkedIn', 'Indeed', 'Handshake'].map(site => (
            <span key={site} className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
              {site}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-600 hover:brightness-110 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 mb-3"
        >
          Add to Chrome
        </a>

        {/* Dismiss link */}
        <button
          onClick={dismiss}
          className="block w-full text-center text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          Maybe later
        </button>

      </div>
    </div>
  )
}