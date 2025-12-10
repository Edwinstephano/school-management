import { useEffect, useState } from 'react'
import api from '../api/client'
import useAuth from '../hooks/useAuth'

export default function ParentDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const studentsRes = await api.get('/students/')
        const mine = studentsRes.data.filter((s) => s.parent && s.parent.user.id === user.id)
        setStudents(mine)
        const notifRes = await api.get('/notifications/')
        setNotifications(notifRes.data.slice(0, 5))
      } catch (e) {
        // ignore
      }
    }
    if (user) {
      load()
    }
  }, [user])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Parent Dashboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Overview for your children</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Children</div>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-100">
            {students.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="font-medium text-slate-900 dark:text-slate-50">{s.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {s.classroom ? `${s.classroom.name} - ${s.classroom.section}` : 'No class assigned'}
                </div>
              </div>
            ))}
            {students.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-500">No linked students yet.</div>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Recent Notifications</div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
              >
                <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                  {n.type}
                </div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-50">{n.title}</div>
                {n.message && (
                  <div className="mt-1 text-xs text-slate-600 line-clamp-2 dark:text-slate-300">{n.message}</div>
                )}
                <div className="mt-2 text-[0.7rem] text-slate-500 dark:text-slate-400">
                  {new Date(n.date).toLocaleString()}
                </div>
              </div>
            ))}
            {notifications.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-500">No notifications yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
