import { useEffect, useState } from 'react'
import api from '../api/client'

export default function MeetingsPage() {
  const [classes, setClasses] = useState([])
  const [meetings, setMeetings] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    classroom_id: '',
    location: '',
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const [classRes, meetingRes] = await Promise.all([
        api.get('/classrooms/'),
        api.get('/meetings/'),
      ])
      setClasses(classRes.data)
      setMeetings(meetingRes.data)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/meetings/', form)
      setForm({ title: '', description: '', date: '', time: '', classroom_id: '', location: '' })
      await load()
      alert('Meeting created and notifications sent to parents.')
    } catch (e) {
      alert('Error creating meeting')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Parent Meetings</h1>
        <p className="text-sm text-slate-400">Schedule and view parent meetings</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-400">New Meeting</div>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-xs text-slate-300">Title</label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-300">Description</label>
              <textarea
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-300">Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Time</label>
                <input
                  type="time"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-300">Class</label>
              <select
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                value={form.classroom_id}
                onChange={(e) => setForm((f) => ({ ...f, classroom_id: e.target.value }))}
                required
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
              <label className="mb-1 block text-xs text-slate-300">Location</label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Meeting'}
              </button>
            </div>
          </form>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-slate-400">Upcoming Meetings</div>
          <div className="space-y-2 text-sm text-slate-100">
            {meetings.map((m) => (
              <div key={m.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{m.title}</div>
                  <div className="text-xs text-slate-400">
                    {m.date} {m.time}
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {m.classroom ? `${m.classroom.name} - ${m.classroom.section}` : ''} · {m.location}
                </div>
                {m.description && <div className="mt-2 text-xs text-slate-300">{m.description}</div>}
              </div>
            ))}
            {meetings.length === 0 && <div className="text-sm text-slate-500">No meetings scheduled.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
