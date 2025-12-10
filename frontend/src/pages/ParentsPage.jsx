import { useEffect, useState } from 'react'
import api from '../api/client'

export default function ParentsPage() {
  const [parents, setParents] = useState([])
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.get('/parents/')
      setParents(res.data)
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
      await api.post('/parents/', form)
      setForm({ username: '', first_name: '', last_name: '', email: '', password: '', phone: '', address: '' })
      await load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Parents</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Create parent login accounts and profiles</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">All Parents</div>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-100">
            {parents.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900 dark:text-slate-50">{p.username}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{p.email}</div>
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {p.first_name} {p.last_name}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{p.phone}</div>
                {p.address && <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">{p.address}</div>}
              </div>
            ))}
            {parents.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-500">No parents yet.</div>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Add Parent</div>
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
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Phone</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Address</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Parent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
