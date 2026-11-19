import api from './api.js'
import { normalizeCourse } from './courseService.js'

// The profile endpoint returns { user, program, joined, enrolledCourses }
// where user is the snake_case serialized user row; flatten it to the shape
// the profile page uses.
function normalizeProfile(data) {
  const user = data?.user || data || {}
  return {
    id: user.id,
    fullName: user.fullName || user.full_name || '',
    email: user.email || '',
    role: user.role || 'student',
    title: user.title || null,
    bio: user.bio || '',
    program: data?.program || user.program || '',
    avatar: user.avatar || user.avatar_url || null,
    createdAt: user.createdAt || user.created_at || data?.joined || null,
    enrolledCourses: data?.enrolledCourses ?? null,
  }
}

export async function getDashboard() {
  const data = await api.get('/student/dashboard')
  return {
    ...data,
    courses: (data.courses || []).map(normalizeCourse),
    currentCourse: data.currentCourse ? normalizeCourse(data.currentCourse) : null,
  }
}

export async function getMyCourses() {
  const data = await api.get('/student/courses')
  return {
    ...data,
    courses: (data.courses || []).map(normalizeCourse),
  }
}

export function getMyAssignments() {
  return api.get('/student/assignments')
}

export function getMySchedule() {
  return api.get('/student/schedule')
}

export async function getMyProgress() {
  const data = await api.get('/student/progress')
  return {
    ...data,
    courses: (data.courses || []).map(normalizeCourse),
  }
}

export async function getProfile() {
  const data = await api.get('/student/profile')
  return normalizeProfile(data)
}

export async function updateProfile(payload) {
  const data = await api.put('/student/profile', {
    fullName: payload.fullName,
    bio: payload.bio,
    program: payload.program,
  })
  return normalizeProfile(data)
}

export function submitAssignment(assignmentId, payload) {
  return api.post(`/student/assignments/${assignmentId}/submit`, {
    content: payload.content,
    link: payload.link || undefined,
  })
}
