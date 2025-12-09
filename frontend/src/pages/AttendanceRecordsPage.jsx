import { useEffect, useState } from 'react'
import api from '../api/client'

export default function AttendanceRecordsPage() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await api.get('/classrooms/')
        setClasses(res.data)
      } catch (e) {
        // ignore
      }
    }
    loadClasses()
  }, [])

  const loadRecords = async () => {
    if (!selectedClassId || !date) return
    setLoading(true)
    try {
      const res = await api.get(`/attendance/class/${selectedClassId}/`, {
        params: { date },
      })
      setRecords(res.data)
    } catch (e) {
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, date])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Attendance Records</h1>
        <p className="text-sm text-slate-400">View saved attendance by class and date</p>
      </header>
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-300">Class</label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.section}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-300">Date</label>
            <input
              type="date"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Records</div>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs uppercase text-slate-400">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Roll</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-900/60 hover:bg-slate-900/60">
                    <td className="px-2 py-2 text-slate-100">{r.student?.name}</td>
                    <td className="px-2 py-2 text-slate-300">{r.student?.roll_number}</td>
                    <td className="px-2 py-2 text-slate-100">{r.status}</td>
                  </tr>
                ))}
                {!loading && records.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-sm text-slate-500" colSpan={3}>
                      Select class and date to view attendance.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
