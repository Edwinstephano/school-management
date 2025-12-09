import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const navByRole = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/classes', label: 'Classes' },
    { to: '/students', label: 'Students' },
    { to: '/staff-users', label: 'Staff Users' },
    { to: '/parents', label: 'Parents' },
    { to: '/meetings', label: 'Meetings' },
  ],
  PRINCIPAL: [
    { to: '/principal', label: 'Dashboard' },
    { to: '/classes', label: 'Classes' },
    { to: '/students', label: 'Students' },
    { to: '/staff-users', label: 'Staff Users' },
    { to: '/parents', label: 'Parents' },
    { to: '/meetings', label: 'Meetings' },
    { to: '/reports/attendance', label: 'Attendance Records' },
    { to: '/reports/exams', label: 'Exam Results' },
  ],
  TEACHER: [
    { to: '/teacher', label: 'Dashboard' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/attendance/records', label: 'Attendance Records' },
    { to: '/staff/exams', label: 'Results Entry' },
    { to: '/reports/exams', label: 'Exam Results' },
  ],
  STAFF: [
    { to: '/staff/exams', label: 'Results Entry' },
    { to: '/reports/exams', label: 'Exam Results' },
  ],
  PARENT: [
    { to: '/parent', label: 'Dashboard' },
    { to: '/parent/notifications', label: 'Notifications' },
  ],
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const links = user ? navByRole[user.role] || [] : []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background text-slate-100">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/70 p-4 md:flex">
        <div className="mb-8 text-xl font-semibold text-primary-100">
          School Manager
        </div>
        <nav className="flex-1 space-y-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded px-3 py-2 transition-colors ${
                location.pathname === link.to
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <div className="mb-2 font-medium text-slate-200">{user.first_name || user.username}</div>
            <div className="mb-4 text-[0.7rem] uppercase tracking-wide text-primary-300">{user.role}</div>
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1">
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )}
