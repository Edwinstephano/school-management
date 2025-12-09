import { useEffect, useState } from 'react'
import api from '../api/client'
import StatDonutCard from '../components/StatDonutCard.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, principals: 0, parents: 0, classes: 0, sections: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, classesRes, staffRes, parentsRes] = await Promise.all([
          api.get('/students/'),
          api.get('/classrooms/'),
          api.get('/staff-users/'),
          api.get('/parents/'),
        ])

        const studentsCount = studentsRes.data.length
        const classes = classesRes.data || []
        const classesCount = classes.length
        const sectionsCount = new Set(classes.map((c) => c.section)).size

        const staff = staffRes.data || []
        const teachersCount = staff.filter((u) => u.role === 'TEACHER').length
        const principalsCount = staff.filter((u) => u.role === 'PRINCIPAL').length

        const parentsCount = (parentsRes.data || []).length

        setStats({
          students: studentsCount,
          teachers: teachersCount,
          principals: principalsCount,
          parents: parentsCount,
          classes: classesCount,
          sections: sectionsCount,
        })
      } catch (e) {
        // ignore for now
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">Overview of the system</p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        <StatDonutCard label="Total Students" value={stats.students} />
        <StatDonutCard label="Total Teachers" value={stats.teachers} />
        <StatDonutCard label="Total Principals" value={stats.principals} />
        <StatDonutCard label="Total Parents" value={stats.parents} />
        <StatDonutCard label="Total Classes" value={stats.classes} />
        <StatDonutCard label="Total Sections" value={stats.sections} />
      </div>
    </div>
  )
}
