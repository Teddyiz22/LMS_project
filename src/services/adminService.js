import api from './api.js'

export function getOverview() {
  return api.get('/admin/overview')
}

export function getUsers({ role = '', search = '', page = 1, limit = 20 } = {}) {
  return api.get('/admin/users', { params: { role, search, page, limit } })
}

export function getCourses({ search = '', category = '', page = 1, limit = 20 } = {}) {
  return api.get('/admin/courses', { params: { search, category, page, limit } })
}
