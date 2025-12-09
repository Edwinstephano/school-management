import { useEffect, useState } from 'react'
import api from '../api/client'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])

  const load = async () => {
    try {
      const res = await api.get('/notifications/')
      setNotifications(res.data)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/mark_read/`)
      await load()
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Notifications</h1>
        <p className="text-sm text-slate-400">Attendance alerts, exam results, and meeting updates</p>
      </header>
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="space-y-2 text-sm text-slate-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                n.is_read
                  ? 'border-slate-800 bg-slate-900/70 text-slate-300'
                  : 'border-primary-700 bg-primary-950/40 text-slate-50'
              }`}
            >
              <div>
                <div className="text-xs uppercase tracking-wide text-primary-300">{n.type}</div>
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-slate-400">{new Date(n.date).toLocaleString()}</div>
                <div className="mt-1 text-xs text-slate-200">{n.message}</div>
              </div>
              {!n.is_read && (
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="mt-1 rounded-md border border-primary-500 px-3 py-1 text-xs font-medium text-primary-200 hover:bg-primary-600/20"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
          {notifications.length === 0 && <div className="text-sm text-slate-500">No notifications yet.</div>}
        </div>
      </div>
    </div>
  )
}
