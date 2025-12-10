import { Navigate, Route, Routes } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import LoginPage from './pages/LoginPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import PrincipalDashboard from './pages/PrincipalDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import ParentDashboard from './pages/ParentDashboard.jsx'
import StudentListPage from './pages/StudentListPage.jsx'
import AttendancePage from './pages/AttendancePage.jsx'
import ResultsEntryPage from './pages/ResultsEntryPage.jsx'
import AttendanceRecordsPage from './pages/AttendanceRecordsPage.jsx'
import ExamResultsViewPage from './pages/ExamResultsViewPage.jsx'
import MeetingsPage from './pages/MeetingsPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import ClassroomsPage from './pages/ClassroomsPage.jsx'
import ParentsPage from './pages/ParentsPage.jsx'
import StaffUsersPage from './pages/StaffUsersPage.jsx'
import Layout from './components/Layout.jsx'

function getDefaultRoute(user) {
  if (!user) return '/login'
  // Superusers should go to admin dashboard
  if (user.is_superuser) {
    return '/admin'
  }
  switch (user.role) {
    case 'ADMIN':
      return '/admin'
    case 'PRINCIPAL':
      return '/principal'
    case 'TEACHER':
      return '/teacher'
    case 'STAFF':
      return '/staff/exams'
    case 'PARENT':
      return '/parent'
    default:
      return '/login'
  }
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Allow superusers to access all routes
  if (user.is_superuser) {
    return children
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user)} replace />
  }

  return children
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />
    case 'PRINCIPAL':
      return <Navigate to="/principal" replace />
    case 'TEACHER':
      return <Navigate to="/teacher" replace />
    case 'STAFF':
      return <Navigate to="/staff/exams" replace />
    case 'PARENT':
      return <Navigate to="/parent" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

function App() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-background">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/attendance/records"
          element={(
            <ProtectedRoute roles={['TEACHER', 'ADMIN', 'PRINCIPAL']}>
              <Layout>
                <AttendanceRecordsPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/staff-users"
          element={(
            <ProtectedRoute roles={['ADMIN', 'PRINCIPAL']}>
              <Layout>
                <StaffUsersPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/admin"
          element={(
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/principal"
          element={(
            <ProtectedRoute roles={['PRINCIPAL', 'ADMIN']}>
              <Layout>
                <PrincipalDashboard />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/teacher"
          element={(
            <ProtectedRoute roles={['TEACHER', 'ADMIN', 'PRINCIPAL']}>
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/parent"
          element={(
            <ProtectedRoute roles={['PARENT']}>
              <Layout>
                <ParentDashboard />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/students"
          element={(
            <ProtectedRoute roles={['ADMIN', 'PRINCIPAL']}>
              <Layout>
                <StudentListPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/classes"
          element={(
            <ProtectedRoute roles={['ADMIN', 'PRINCIPAL']}>
              <Layout>
                <ClassroomsPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/parents"
          element={(
            <ProtectedRoute roles={['ADMIN', 'PRINCIPAL']}>
              <Layout>
                <ParentsPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/attendance"
          element={(
            <ProtectedRoute roles={['TEACHER', 'ADMIN', 'PRINCIPAL']}>
              <Layout>
                <AttendancePage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/staff/exams"
          element={(
            <ProtectedRoute roles={['STAFF', 'TEACHER', 'ADMIN', 'PRINCIPAL']}>
              <Layout>
                <ResultsEntryPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/reports/exams"
          element={(
            <ProtectedRoute roles={['STAFF', 'TEACHER', 'ADMIN', 'PRINCIPAL']}>
              <Layout>
                <ExamResultsViewPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/meetings"
          element={(
            <ProtectedRoute roles={['PRINCIPAL', 'ADMIN']}>
              <Layout>
                <MeetingsPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/parent/notifications"
          element={(
            <ProtectedRoute roles={['PARENT']}>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default App
