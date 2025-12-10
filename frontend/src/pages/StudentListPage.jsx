import { useEffect, useState } from 'react'
import api from '../api/client'

export default function StudentListPage() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [parents, setParents] = useState([])
  const [form, setForm] = useState({
    id: null,
    name: '',
    roll_number: '',
    classroom_id: '',
    parent_id: '',
    address: '',
    phone: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    try {
      const [studentsRes, classesRes, parentsRes] = await Promise.all([
        api.get('/students/'),
        api.get('/classrooms/'),
        api.get('/parents/'),
      ])
      setStudents(studentsRes.data)
      setClasses(classesRes.data)
      setParents(parentsRes.data)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setForm({ id: null, name: '', roll_number: '', classroom_id: '', parent_id: '', address: '', phone: '', email: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        roll_number: form.roll_number,
        classroom_id: form.classroom_id || null,
        parent_id: form.parent_id || null,
        address: form.address,
        phone: form.phone,
        email: form.email,
      }
      if (form.id) {
        await api.put(`/students/${form.id}/`, payload)
      } else {
        await api.post('/students/', payload)
      }
      resetForm()
      await loadData()
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student) => {
    setForm({
      id: student.id,
      name: student.name,
      roll_number: student.roll_number,
      classroom_id: student.classroom?.id || '',
      parent_id: student.parent?.id || '',
      address: student.address || '',
      phone: student.phone || '',
      email: student.email || '',
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try {
      await api.delete(`/students/${id}/`)
      await loadData()
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Students</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage student records</p>
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">All Students</div>
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Roll</th>
                  <th className="px-2 py-2">Class</th>
                  <th className="px-2 py-2">Phone</th>
                  <th className="px-2 py-2" />
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
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">
                      {s.classroom ? `${s.classroom.name} - ${s.classroom.section}` : '—'}
                    </td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{s.phone || '—'}</td>
                    <td className="px-2 py-2 text-right text-xs">
                      <button
                        onClick={() => handleEdit(s)}
                        className="mr-2 rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="rounded border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-900/60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-sm text-slate-500 dark:text-slate-500" colSpan={5}>
                      No students yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
            {form.id ? 'Edit Student' : 'Add Student'}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Name</label>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Roll Number</label>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={form.roll_number}
                onChange={(e) => setForm((f) => ({ ...f, roll_number: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Class</label>
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={form.classroom_id}
                onChange={(e) => setForm((f) => ({ ...f, classroom_id: e.target.value }))}
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
              <label className="mb-1 block text-xs text-primary-700 dark:text-primary-200">Parent</label>
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                value={form.parent_id}
                onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
              >
                <option value="">No parent linked</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name || p.username || p.user?.first_name || p.user?.username}
                  </option>
                ))}
              </select>
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
                <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Address</label>
              <textarea
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-2 text-sm">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-500 disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
