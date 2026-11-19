import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { homePathForRole } from '../utils/roleHome.js'

function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isInitializing, user } = useAuth()
  const location = useLocation()

  if (isInitializing) return <div className="min-h-screen bg-[#F8FAFC]" />
  if (!isAuthenticated) return <Navigate replace state={{ from: location }} to="/login" />
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate replace to={homePathForRole(user?.role)} />

  return children
}

export default ProtectedRoute
