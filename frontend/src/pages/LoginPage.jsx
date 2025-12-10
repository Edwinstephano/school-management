import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials or server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-8 shadow-2xl shadow-slate-300/50 dark:shadow-primary-900/30">
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900 dark:text-slate-50">School Management</h1>
        <p className="mb-8 text-center text-sm text-slate-600 dark:text-slate-400">Sign in to continue</p>
        {error && <div className="mb-4 rounded-md bg-red-100 dark:bg-red-900/40 px-3 py-2 text-xs text-red-700 dark:text-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none ring-primary-500/40 focus:border-primary-500 focus:ring"
              placeholder="admin, principal, teacher..."
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none ring-primary-500/40 focus:border-primary-500 focus:ring"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-500 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
