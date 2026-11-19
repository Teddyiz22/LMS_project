// Each role's workspace home. Used by the /dashboard redirect and by
// ProtectedRoute when a signed-in user opens a workspace for another role.
export function homePathForRole(role) {
  if (role === 'teacher') return '/teacher/dashboard'
  if (role === 'admin') return '/admin'
  return '/student/dashboard'
}
