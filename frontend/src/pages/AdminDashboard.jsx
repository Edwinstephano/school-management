import { useEffect, useState } from 'react'
import api from '../api/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const studentsRes = await api.get('/students/')
        setStats({ students: studentsRes.data.length })
      } catch (e) {
        // ignore for now
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">Overview of the system</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Total Students</div>
          <div className="mt-2 text-3xl font-semibold text-primary-400">{stats.students}</div>
        </div>
      </div>
    </div>
  )
}
