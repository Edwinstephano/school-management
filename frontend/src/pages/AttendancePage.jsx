import { useEffect, useState } from 'react'
import api from '../api/client'

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'LATE', label: 'Late' },
]

export default function AttendancePage() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState([])
  const [statuses, setStatuses] = useState({})
  const [saving, setSaving] = useState(false)

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

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClassId) return
      try {
        const res = await api.get('/students/', { params: {} })
        const clsStudents = res.data.filter((s) => s.classroom && s.classroom.id === Number(selectedClassId))
        setStudents(clsStudents)
        const statusMap = {}
        clsStudents.forEach((s) => {
          statusMap[s.id] = 'PRESENT'
        })
        setStatuses(statusMap)
      } catch (e) {
        // ignore
      }
    }
    loadStudents()
  }, [selectedClassId])

  const handleStatusChange = (studentId, status) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    if (!selectedClassId || !date) return
    setSaving(true)
    try {
      const payload = students.map((s) => ({
        student_id: s.id,
        date,
        status: statuses[s.id] || 'PRESENT',
      }))
      await api.post('/attendance/bulk_create/', payload)
      alert('Attendance saved. Absent students will trigger parent notifications.')
    } catch (e) {
      alert('Error saving attendance')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Attendance</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Mark daily attendance for your class</p>
        </div>
      </header>
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Class</label>
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
            <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Date</label>
            <input
              type="date"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">Students</div>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Roll</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-900/60 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-2 py-2 text-slate-900 dark:text-slate-100">{s.name}</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{s.roll_number}</td>
                    <td className="px-2 py-2 text-slate-900 dark:text-slate-100">
                      <div className="inline-flex gap-2 rounded-full bg-slate-100 p-1 dark:bg-slate-900/80">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleStatusChange(s.id, opt.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                              statuses[s.id] === opt.value
                                ? opt.value === 'ABSENT'
                                  ? 'bg-red-600 text-white'
                                  : opt.value === 'LATE'
                                  ? 'bg-amber-500 text-slate-900'
                                  : 'bg-emerald-500 text-slate-900'
                                : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-sm text-slate-500 dark:text-slate-500" colSpan={3}>
                      Select a class to load students.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={saving || !students.length}
              onClick={handleSave}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
