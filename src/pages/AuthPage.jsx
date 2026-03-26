import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logo from '../../icon.svg'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirmMessage, setShowConfirmMessage] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            setError('Please confirm your email address before logging in. Check your inbox for a confirmation link.')
          } else {
            setError(error.message)
          }
          return
        }
        navigate('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
            setError('An account with this email already exists. Try logging in instead.')
          } else {
            setError(error.message)
          }
          return
        }
        // Supabase returns a fake success even for duplicate emails in some configs
        // so we check if the user identity is empty which indicates a duplicate
        if (data?.user?.identities?.length === 0) {
          setError('An account with this email already exists. Try logging in instead.')
          return
        }
        setShowConfirmMessage(true)
        setMode('login')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggle = () => {
    setMode(m => m === 'login' ? 'signup' : 'login')
    setError('')
    setShowConfirmMessage(false)
  }

  return (
    <div className="min-h-screen bg-[#C6C6C6] text-gray-900 font-sans flex flex-col pt-16 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-6">
        <div className="bg-[#F7F7F7] p-6 sm:p-10 sm:rounded-2xl border border-gray-200 shadow-xl shadow-gray-400/50">

          {/* Logo */}
          <div className="flex mb-4">
            <div className="inline-flex items-center justify-center">
              <img src={logo} alt="MyJobsLab" className="w-8 h-8" />
              <span className="font-bold text-lg tracking-tight text-gray-900">MyJobsLab</span>
            </div>
          </div>

          <hr className="border-gray-300 mb-4" />

          <div className="bg-[#FFFFFF] p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {mode === 'login' ? 'Log in to MyJobsLab' : 'Sign up for MyJobsLab'}
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                {mode === 'login' ? 'Manage your MyJobsLab account' : 'Create your MyJobsLab account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>

              {/* Confirm email reminder — shows after successful signup */}
              {showConfirmMessage && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-xl px-4 py-3">
                  Account created! Please check your email and confirm your address before logging in.
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 text-sm shadow-sm shadow-blue-500/30"
              >
                {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>
          </div>

          <p className="text-left text-sm text-gray-500 mt-6 pl-2">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={toggle}
              className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}