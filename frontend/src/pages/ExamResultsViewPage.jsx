import { useEffect, useState } from 'react'
import api from '../api/client'

export default function ExamResultsViewPage() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [exams, setExams] = useState([])
  const [selectedExamId, setSelectedExamId] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [classRes, examRes] = await Promise.all([
          api.get('/classrooms/'),
          api.get('/exams/'),
        ])
        setClasses(classRes.data)
        setExams(examRes.data)
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedExamId) {
        setResults([])
        return
      }
      try {
        const res = await api.get(`/results/exam/${selectedExamId}/`)
        setResults(res.data)
      } catch (e) {
        setResults([])
      }
    }
    loadResults()
  }, [selectedExamId])

  const filteredExams = exams.filter(
    (ex) => selectedClassId && ex.classroom && String(ex.classroom.id) === String(selectedClassId),
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Exam Results</h1>
        <p className="text-sm text-slate-400">View saved exam results by class and exam</p>
      </header>
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-300">Class</label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value)
                setSelectedExamId('')
              }}
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
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              disabled={!selectedClassId}
            >
              <option value="">Select exam</option>
              {filteredExams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} - {ex.subject}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Results</div>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs uppercase text-slate-400">
                  <th className="px-2 py-2">Student</th>
                  <th className="px-2 py-2">Roll</th>
                  <th className="px-2 py-2">Marks</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Grade</th>
                  <th className="px-2 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b border-slate-900/60 hover:bg-slate-900/60">
                    <td className="px-2 py-2 text-slate-100">{r.student?.name}</td>
                    <td className="px-2 py-2 text-slate-300">{r.student?.roll_number}</td>
                    <td className="px-2 py-2 text-slate-100">{r.marks}</td>
                    <td className="px-2 py-2 text-slate-100">{r.total_marks}</td>
                    <td className="px-2 py-2 text-slate-100">{r.grade}</td>
                    <td className="px-2 py-2 text-slate-300">{r.remarks}</td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-sm text-slate-500" colSpan={6}>
                      Select class and exam to view results.
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
