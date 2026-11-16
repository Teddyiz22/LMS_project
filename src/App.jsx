import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import DashboardPreview from './pages/DashboardPreview.jsx'
import StudentLayout from './layouts/StudentLayout.jsx'
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
import LandingPage from './pages/public/LandingPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/student" element={<StudentRegistrationPage />} />
      <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard-preview" element={<DashboardLayout><DashboardPreview /></DashboardLayout>} />
      <Route element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCourses />} />
        <Route path="/student/assignments" element={<MyAssignments />} />
        <Route path="/student/schedule" element={<MySchedule />} />
        <Route path="/student/progress" element={<MyProgress />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
