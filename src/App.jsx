import { Navigate, Route, Routes } from 'react-router-dom'
import StudentLayout from './layouts/StudentLayout.jsx'
import TeacherLayout from './layouts/TeacherLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import StudentRegistrationPage from './pages/auth/StudentRegistrationPage.jsx'
import TeacherRegistrationPage from './pages/auth/TeacherRegistrationPage.jsx'
import MyAssignments from './pages/student/MyAssignments.jsx'
import MyCourses from './pages/student/MyCourses.jsx'
import MyProgress from './pages/student/MyProgress.jsx'
import MySchedule from './pages/student/MySchedule.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import StudentProfile from './pages/student/StudentProfile.jsx'
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx'
import TeacherCourses from './pages/teacher/TeacherCourses.jsx'
import TeacherAssignments from './pages/teacher/TeacherAssignments.jsx'
import TeacherGrading from './pages/teacher/TeacherGrading.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import LandingPage from './pages/public/LandingPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { homePathForRole } from './utils/roleHome.js'
import { useAuth } from './context/AuthContext.jsx'

function DashboardRedirect() {
  const { isAuthenticated, isInitializing, user } = useAuth()
  if (isInitializing) return <div className="min-h-screen bg-[#F8FAFC]" />
  if (!isAuthenticated) return <Navigate replace to="/login" />
  return <Navigate replace to={homePathForRole(user?.role)} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/student" element={<StudentRegistrationPage />} />
      <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCourses />} />
        <Route path="/student/assignments" element={<MyAssignments />} />
        <Route path="/student/schedule" element={<MySchedule />} />
        <Route path="/student/progress" element={<MyProgress />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout /></ProtectedRoute>}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/grading" element={<TeacherGrading />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
