import { useEffect, useState } from 'react'
import api from '../api/client'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/classrooms/')
        setClasses(res.data)
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Teacher Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Today&apos;s classes and quick links</p>
        </div>
        <Link
          to="/attendance"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-500"
        >
          Mark Attendance
        </Link>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Classes</div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {classes.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
            >
              <div className="font-medium">
                {c.name} - {c.section}
              </div>
            </div>
          ))}
          {classes.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-500">No classes defined yet.</div>}
        </div>
      </div>
    </div>
  )
}
