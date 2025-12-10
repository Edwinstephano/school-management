import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

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
    { to: '/attendance/records', label: 'Attendance Records' },
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
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  // Superusers get admin navigation
  const effectiveRole = user?.is_superuser ? 'ADMIN' : user?.role
  const links = user ? navByRole[effectiveRole] || [] : []

  // Apply darker gradient background for superusers only in dark mode
  const bgClass = user?.is_superuser
    ? 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-background dark:to-slate-900'
    : 'dark:bg-background'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`flex min-h-screen bg-slate-50 text-slate-900 dark:text-slate-100 ${bgClass}`}>
      <aside className="hidden w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-4 md:flex">
        <div className="mb-8 text-xl font-semibold text-primary-600 dark:text-primary-100">
          School Manager
        </div>
        <nav className="flex-1 space-y-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded px-3 py-2 transition-colors ${location.pathname === link.to
                ? 'bg-primary-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="mb-2 font-medium text-slate-800 dark:text-slate-200">{user.first_name || user.username}</div>
            <div className="mb-4 text-[0.7rem] uppercase tracking-wide text-primary-600 dark:text-primary-300">
              {user.is_superuser ? 'SUPERUSER' : user.role}
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-slate-200 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1 bg-slate-50 dark:bg-transparent">
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {/* Theme toggle button in top right */}
          <div className="flex justify-end">
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-slate-200 dark:bg-slate-800 p-2.5 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
