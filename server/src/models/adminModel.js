import { pool } from '../config/database.js'
import { HttpError } from '../utils/httpError.js'

function getPool() {
  if (!pool) throw new HttpError(503, 'Database is unavailable.')
  return pool
}

export async function getOverview() {
  const db = getPool()
  const [[users]] = await db.query(
    `SELECT
       COUNT(*) AS total,
       SUM(role = 'student') AS students,
       SUM(role = 'teacher') AS teachers,
       SUM(role = 'admin') AS admins
     FROM users`,
  )
  const [[courses]] = await db.query(
    `SELECT
       COUNT(*) AS total,
       SUM(is_active = 1 AND is_published = 1) AS published
     FROM courses`,
  )
  const [[activity]] = await db.query(
    `SELECT
       (SELECT COUNT(*) FROM enrollments) AS enrollments,
       (SELECT COUNT(*) FROM submissions) AS submissions,
       (SELECT COUNT(*) FROM submissions WHERE status = 'submitted') AS pending_submissions`,
  )
  return {
    users: {
      total: Number(users.total || 0),
      students: Number(users.students || 0),
      teachers: Number(users.teachers || 0),
      admins: Number(users.admins || 0),
    },
    courses: {
      total: Number(courses.total || 0),
      published: Number(courses.published || 0),
    },
    enrollments: Number(activity.enrollments || 0),
    submissions: Number(activity.submissions || 0),
    pendingSubmissions: Number(activity.pending_submissions || 0),
  }
}
