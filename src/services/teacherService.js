import api from './api.js'

export function getDashboard() {
  return api.get('/teacher/dashboard')
}

export function getMyCourses() {
  return api.get('/teacher/courses')
}

export function getMyAssignments() {
  return api.get('/teacher/assignments')
}

export function createAssignment(payload) {
  return api.post('/teacher/assignments', payload)
}

export function updateAssignment(assignmentId, payload) {
  return api.put(`/teacher/assignments/${assignmentId}`, payload)
}

export function deleteAssignment(assignmentId) {
  return api.delete(`/teacher/assignments/${assignmentId}`)
}

export function getSubmissions({ courseId = null, assignmentId = null, status = '' } = {}) {
  return api.get('/teacher/submissions', { params: { courseId, assignmentId, status } })
}

export function gradeSubmission(submissionId, payload) {
  return api.post(`/teacher/submissions/${submissionId}/grade`, {
    grade: payload.grade,
    feedback: payload.feedback || undefined,
  })
}

export function getMyClasses() {
  return api.get('/teacher/classes')
}

export function createClass(payload) {
  return api.post('/teacher/classes', payload)
}
