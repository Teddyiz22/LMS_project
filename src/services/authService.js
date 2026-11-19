import api from './api.js'

// Real auth calls against the EduFlow API. The old mock service accepted any
// email and password; these calls verify credentials against the database.
export function registerAccount(payload) {
  return api.post('/auth/register', {
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    title: payload.title || undefined,
    bio: payload.biography || payload.bio || undefined,
  })
}

export function loginAccount(payload) {
  return api.post('/auth/login', {
    email: payload.email,
    password: payload.password,
  })
}

export function getCurrentUser() {
  return api.get('/auth/me')
}

export function requestPasswordReset(payload) {
  return api.post('/auth/forgot-password', { email: payload.email })
}

export function changePassword(payload) {
  return api.post('/auth/change-password', {
    currentPassword: payload.current,
    newPassword: payload.next,
  })
}
