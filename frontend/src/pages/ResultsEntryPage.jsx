import { useEffect, useState } from 'react'
import api from '../api/client'

export default function ResultsEntryPage() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [exams, setExams] = useState([])
  const [examForm, setExamForm] = useState({ name: '', subject: '', exam_id: '' })
  const [students, setStudents] = useState([])
  const [rows, setRows] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [classRes, examRes, studentRes] = await Promise.all([
          api.get('/classrooms/'),
          api.get('/exams/'),
          api.get('/students/'),
        ])
        setClasses(classRes.data)
        setExams(examRes.data)
        setStudents(studentRes.data)
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  const currentClassStudents = students.filter(
    (s) => selectedClassId && s.classroom && s.classroom.id === Number(selectedClassId),
  )

  const handleExamSelect = (value) => {
    // Empty value = create new exam, any other value = use existing exam
    setExamForm((f) => ({ ...f, exam_id: value }))
  }

  const ensureRows = () => {
    const next = { ...rows }
    currentClassStudents.forEach((s) => {
      if (!next[s.id]) {
        next[s.id] = { marks: '', total_marks: '', grade: '', remarks: '' }
      }
    })
    return next
  }

  useEffect(() => {
    setRows(ensureRows())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, students.length])

  const handleRowChange = (studentId, field, value) => {
    setRows((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }))
  }

  const handleSave = async () => {
    if (!selectedClassId) return

    let examId = examForm.exam_id
    try {
      setSaving(true)
      if (!examId) {
        const res = await api.post('/exams/', {
          name: examForm.name || 'Exam',
          subject: examForm.subject || 'Subject',
          classroom_id: selectedClassId,
        })
        examId = res.data.id
      }

      const payload = currentClassStudents.map((s) => ({
        exam_id: examId,
        student_id: s.id,
        marks: Number(rows[s.id]?.marks || 0),
        total_marks: Number(rows[s.id]?.total_marks || 100),
        grade: rows[s.id]?.grade || '',
        remarks: rows[s.id]?.remarks || '',
      }))

      await api.post('/results/bulk_create/', payload)
      alert('Results saved and parent notifications sent.')
    } catch (e) {
      alert('Error saving results')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Exam Results Entry</h1>
        <p className="text-sm text-slate-400">Enter marks and grades for students</p>
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
            <label className="mb-1 block text-xs text-slate-300">Exam</label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
              value={examForm.exam_id || ''}
              onChange={(e) => handleExamSelect(e.target.value)}
            >
              <option value="">Create new exam</option>
              {exams
                .filter((ex) => ex.classroom && String(ex.classroom.id) === String(selectedClassId))
                .map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} - {ex.subject}
                  </option>
                ))}
            </select>
          </div>
          {!examForm.exam_id && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-300">Exam Name</label>
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
                  value={examForm.name}
                  onChange={(e) => setExamForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Subject</label>
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
                  value={examForm.subject}
                  onChange={(e) => setExamForm((f) => ({ ...f, subject: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Students</div>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs uppercase text-slate-400">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Roll</th>
                  <th className="px-2 py-2">Marks</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Grade</th>
                  <th className="px-2 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {currentClassStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-900/60 hover:bg-slate-900/60">
                    <td className="px-2 py-2 text-slate-100">{s.name}</td>
                    <td className="px-2 py-2 text-slate-300">{s.roll_number}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-primary-500"
                        value={rows[s.id]?.marks || ''}
                        onChange={(e) => handleRowChange(s.id, 'marks', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-primary-500"
                        value={rows[s.id]?.total_marks || ''}
                        onChange={(e) => handleRowChange(s.id, 'total_marks', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="w-16 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-primary-500"
                        value={rows[s.id]?.grade || ''}
                        onChange={(e) => handleRowChange(s.id, 'grade', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="w-40 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-primary-500"
                        value={rows[s.id]?.remarks || ''}
                        onChange={(e) => handleRowChange(s.id, 'remarks', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {currentClassStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-2 py-4 text-sm text-slate-500">
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
              disabled={saving || !currentClassStudents.length}
              onClick={handleSave}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Results'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
