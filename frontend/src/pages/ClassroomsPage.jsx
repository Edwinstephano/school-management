import { useEffect, useState } from 'react'
import api from '../api/client'

export default function ClassroomsPage() {
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({ id: null, name: '', section: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.get('/classrooms/')
      setClasses(res.data)
    } catch (e) {
      // ignore for now
    }
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => setForm({ id: null, name: '', section: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { name: form.name, section: form.section }
      if (form.id) {
        await api.put(`/classrooms/${form.id}/`, payload)
      } else {
        await api.post('/classrooms/', payload)
      }
      resetForm()
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (c) => {
    setForm({ id: c.id, name: c.name, section: c.section })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class? Students in this class will also be affected.')) return
    try {
      await api.delete(`/classrooms/${id}/`)
      await load()
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Classes</h1>
        <p className="text-sm text-slate-400">Manage class names and sections</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-400">All Classes</div>
          <div className="space-y-2 text-sm text-slate-100">
            {classes.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <div className="font-medium">
                    {c.name} - {c.section}
                  </div>
                </div>
                <div className="space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleEdit(c)}
                    className="rounded border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="rounded border border-red-700 px-2 py-1 text-red-200 hover:bg-red-900/60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {classes.length === 0 && <div className="text-sm text-slate-500">No classes yet.</div>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-400">
            {form.id ? 'Edit Class' : 'Add Class'}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-xs text-slate-300">Class Name</label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Grade 8"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-300">Section</label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                value={form.section}
                onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                placeholder="e.g. A"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
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
