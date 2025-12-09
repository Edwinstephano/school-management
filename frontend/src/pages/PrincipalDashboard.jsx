import { useEffect, useState } from 'react'
import api from '../api/client'

export default function PrincipalDashboard() {
  const [studentsCount, setStudentsCount] = useState(0)
  const [classes, setClasses] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const studentsRes = await api.get('/students/')
        setStudentsCount(studentsRes.data.length)

        const classMap = new Map()
        studentsRes.data.forEach((s) => {
          if (s.classroom) {
            const key = `${s.classroom.id}`
            if (!classMap.has(key)) {
              classMap.set(key, s.classroom)
            }
          }
        })
        const classList = Array.from(classMap.values())
        setClasses(classList)

        // Load today's attendance summary per class
        const today = new Date().toISOString().slice(0, 10)
        const summaries = []
        for (const cls of classList) {
          try {
            const res = await api.get(`/attendance/class/${cls.id}/`, {
              params: { date: today },
            })
            const records = res.data
            const total = records.length
            const present = records.filter((r) => r.status === 'PRESENT').length
            const absent = records.filter((r) => r.status === 'ABSENT').length
            const late = records.filter((r) => r.status === 'LATE').length
            const pct = total ? Math.round((present / total) * 100) : null
            summaries.push({
              classId: cls.id,
              name: cls.name,
              section: cls.section,
              total,
              present,
              absent,
              late,
              pct,
            })
          } catch (e) {
            // ignore per-class errors
          }
        }
        setAttendanceSummary(summaries)
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Principal Dashboard</h1>
        <p className="text-sm text-slate-400">School overview</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Total Students</div>
          <div className="mt-2 text-3xl font-semibold text-primary-400">{studentsCount}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 md:col-span-2">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Classes</div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-200">
            {classes.map((c) => (
              <span key={c.id} className="rounded-full bg-slate-800 px-3 py-1">
                {c.name} - {c.section}
              </span>
            ))}
            {classes.length === 0 && <span className="text-slate-500">No data yet</span>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="mb-3 text-xs uppercase tracking-wide text-slate-400">Today&apos;s Attendance by Class</div>
        <div className="space-y-2 text-xs text-slate-100">
          {attendanceSummary.map((s) => (
            <div key={s.classId} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
              <div>
                <div className="text-sm font-medium">
                  {s.name} - {s.section}
                </div>
                <div className="mt-1 text-[0.7rem] text-slate-400">
                  Present {s.present} · Absent {s.absent} · Late {s.late}
                </div>
              </div>
              <div className="text-right text-sm">
                {s.pct !== null ? (
                  <span className="font-semibold text-emerald-400">{s.pct}%</span>
                ) : (
                  <span className="text-slate-500">No records</span>
                )}
              </div>
            </div>
          ))}
          {attendanceSummary.length === 0 && (
            <div className="text-sm text-slate-500">No attendance records for today yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
