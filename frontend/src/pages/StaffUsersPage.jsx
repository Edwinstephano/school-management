import { useEffect, useState } from 'react'
import api from '../api/client'

const ROLE_OPTIONS = [
  { value: 'PRINCIPAL', label: 'Principal' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STAFF', label: 'Staff' },
]

export default function StaffUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'TEACHER',
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.get('/staff-users/')
      setUsers(res.data)
    } catch (e) {
      // ignore for now
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/staff-users/', form)
      setForm({ username: '', first_name: '', last_name: '', email: '', password: '', role: 'TEACHER' })
      await load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Principals, Teachers & Staff</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Create login accounts for school staff</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">All Staff Users</div>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-100">
            {users.map((u) => (
              <div
                key={u.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900 dark:text-slate-50">{u.username}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {u.first_name} {u.last_name}
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-wide text-primary-300">{u.role}</div>
              </div>
            ))}
            {users.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-500">No staff users yet.</div>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Add Staff User</div>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm" autoComplete="off">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Username</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  autoComplete="new-username"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">First Name</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.first_name}
                  onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Last Name</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.last_name}
                  onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Role</label>
                <select
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
