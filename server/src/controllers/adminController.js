import * as userModel from '../models/userModel.js'
import * as courseModel from '../models/courseModel.js'
import * as adminModel from '../models/adminModel.js'
import { validatePagination } from '../validators/lmsValidators.js'

export async function getOverview(request, response) {
  const overview = await adminModel.getOverview()
  response.json({ success: true, data: overview })
}

export async function listUsers(request, response) {
  const { page, limit } = validatePagination(request)
  const { users, total } = await userModel.listUsers({
    role: String(request.query.role || '').trim() || null,
    search: String(request.query.search || '').trim(),
    page,
    limit,
  })
  response.json({
    success: true,
    data: {
      items: users,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
}

export async function listCourses(request, response) {
  const { page, limit } = validatePagination(request)
  const { courses, total } = await courseModel.listCourses({
    search: String(request.query.search || '').trim(),
    category: String(request.query.category || '').trim(),
    teacherId: request.query.teacherId ? Number(request.query.teacherId) : null,
    includeInactive: true,
    page,
    limit,
  })
  response.json({
    success: true,
    data: {
      items: courses,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
}
