import { pool } from '../config/database.js'
import { HttpError } from '../utils/httpError.js'

function getPool() {
  if (!pool) throw new HttpError(503, 'Database is unavailable.')
  return pool
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180) || 'course'
}

function formatDuration(totalMinutes) {
  const minutes = Number(totalMinutes || 0)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

export function serializeCourseRow(row) {
  if (!row) return null
  const price = Number(row.price_usd || 0)
  return {
    id: Number(row.id),
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    category: row.category,
    level: row.level,
    price,
    priceLabel: price === 0 ? 'Free' : `$${price % 1 === 0 ? price : price.toFixed(2)}`,
    durationMinutes: Number(row.duration_minutes || 0),
    duration: formatDuration(row.duration_minutes || 0),
    image: row.image_url || null,
    instructor: row.teacher_name || null,
    teacherId: row.teacher_id ? Number(row.teacher_id) : null,
    teacherTitle: row.teacher_title || null,
    // v1 has no ratings table; the landing page shows "New" when null.
    rating: null,
    students: Number(row.enrolled_count || 0),
    enrolledCount: Number(row.enrolled_count || 0),
    lessonCount: Number(row.lesson_count || 0),
    lessons: Array.isArray(row.lessons) ? row.lessons : undefined,
    isPublished: Boolean(row.is_published),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function serializeLessonRow(row) {
  if (!row) return null
  return {
    id: Number(row.id),
    courseId: Number(row.course_id),
    title: row.title,
    content: row.content || '',
    videoUrl: row.video_url || null,
    position: Number(row.position || 0),
    durationMinutes: Number(row.duration_minutes || 0),
    isFree: Boolean(row.is_free),
    completed: row.completed ? Boolean(Number(row.completed)) : false,
  }
}

const COURSE_SELECT = `
  SELECT c.id, c.teacher_id, c.title, c.slug, c.description, c.category,
         c.level, c.price_usd, c.image_url, c.is_published, c.is_active,
         c.created_at, c.updated_at,
         u.full_name AS teacher_name, u.title AS teacher_title,
         COALESCE((SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id), 0) AS lesson_count,
         COALESCE((SELECT SUM(l.duration_minutes) FROM lessons l WHERE l.course_id = c.id), 0) AS duration_minutes,
         COALESCE((SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id), 0) AS enrolled_count
  FROM courses c
  LEFT JOIN users u ON u.id = c.teacher_id`

export async function listCourses({ search = '', category = '', teacherId = null, includeInactive = false, page = 1, limit = 12 }) {
  const db = getPool()
  const conditions = []
  const params = []
  if (!includeInactive) {
    conditions.push('c.is_active = 1 AND c.is_published = 1')
  }
  if (search) {
    conditions.push('(c.title LIKE ? OR c.description LIKE ? OR c.category LIKE ?)')
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (category) {
    conditions.push('c.category = ?')
    params.push(category)
  }
  if (teacherId) {
    conditions.push('c.teacher_id = ?')
    params.push(teacherId)
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * limit

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM courses c ${where}`,
    params,
  )
  const [rows] = await db.query(
    `${COURSE_SELECT} ${where} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )
  return { courses: rows.map(serializeCourseRow), total: Number(total) }
}

export async function findCourseById(id, { includeInactive = false } = {}) {
  const db = getPool()
  const [rows] = await db.query(
    `${COURSE_SELECT} WHERE c.id = ? ${includeInactive ? '' : 'AND c.is_active = 1 AND c.is_published = 1'} LIMIT 1`,
    [id],
  )
  if (!rows[0]) return null
  const course = serializeCourseRow(rows[0])
  course.lessons = await listLessons(id)
  return course
}

export async function findCourseBySlug(slug) {
  const db = getPool()
  const [rows] = await db.query(
    `${COURSE_SELECT} WHERE c.slug = ? LIMIT 1`,
    [slug],
  )
  return rows[0] ? serializeCourseRow(rows[0]) : null
}

export async function insertCourse({ teacher_id, title, description, category, level, price_usd, image_url, is_published = 1 }) {
  const db = getPool()
  let slug = slugify(title)
  // Keep slugs unique: append a counter when the base slug is taken.
  let attempt = 0
  for (;;) {
    const candidate = attempt === 0 ? slug : `${slug}-${attempt}`
    const [existing] = await db.query('SELECT id FROM courses WHERE slug = ? LIMIT 1', [candidate])
    if (!existing.length) {
      slug = candidate
      break
    }
    attempt += 1
  }
  const [result] = await db.query(
    `INSERT INTO courses (teacher_id, title, slug, description, category, level, price_usd, image_url, is_published, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [teacher_id, title, slug, description || '', category, level || 'Beginner', price_usd || 0, image_url || null, is_published ? 1 : 0],
  )
  return result.insertId
}

export async function updateCourse(id, { title, description, category, level, price_usd, image_url, is_published }) {
  const db = getPool()
  await db.query(
    `UPDATE courses
     SET title = ?, description = ?, category = ?, level = ?, price_usd = ?,
         image_url = ?, is_published = ?
     WHERE id = ?`,
    [title, description || '', category, level || 'Beginner', price_usd || 0, image_url || null, is_published ? 1 : 0, id],
  )
  return findCourseById(id, { includeInactive: true })
}

export async function deactivateCourse(id) {
  const db = getPool()
  await db.query('UPDATE courses SET is_active = 0 WHERE id = ?', [id])
}

export async function listLessons(courseId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT id, course_id, title, content, video_url, position, duration_minutes, is_free
     FROM lessons WHERE course_id = ? ORDER BY position ASC, id ASC`,
    [courseId],
  )
  return rows.map(serializeLessonRow)
}

export async function findLessonById(lessonId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT id, course_id, title, content, video_url, position, duration_minutes, is_free
     FROM lessons WHERE id = ? LIMIT 1`,
    [lessonId],
  )
  return rows[0] ? serializeLessonRow(rows[0]) : null
}

export async function insertLesson(courseId, { title, content, video_url, duration_minutes, is_free }) {
  const db = getPool()
  const [[{ maxPosition }]] = await db.query(
    'SELECT COALESCE(MAX(position), 0) AS maxPosition FROM lessons WHERE course_id = ?',
    [courseId],
  )
  const [result] = await db.query(
    `INSERT INTO lessons (course_id, title, content, video_url, position, duration_minutes, is_free)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [courseId, title, content || '', video_url || null, Number(maxPosition) + 1, duration_minutes || 0, is_free ? 1 : 0],
  )
  return result.insertId
}

export async function updateLesson(lessonId, { title, content, video_url, duration_minutes, is_free, position }) {
  const db = getPool()
  await db.query(
    `UPDATE lessons
     SET title = ?, content = ?, video_url = ?, duration_minutes = ?, is_free = ?, position = ?
     WHERE id = ?`,
    [title, content || '', video_url || null, duration_minutes || 0, is_free ? 1 : 0, position || 0, lessonId],
  )
  return findLessonById(lessonId)
}

export async function deleteLesson(lessonId) {
  const db = getPool()
  await db.query('DELETE FROM lessons WHERE id = ?', [lessonId])
}

export async function isEnrolled(userId, courseId) {
  const db = getPool()
  const [rows] = await db.query(
    'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1',
    [userId, courseId],
  )
  return rows.length > 0
}

export async function enrollStudent(userId, courseId) {
  const db = getPool()
  const [result] = await db.query(
    'INSERT IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)',
    [userId, courseId],
  )
  return result.affectedRows === 1
}

export async function markLessonComplete(userId, courseId, lessonId) {
  const db = getPool()
  await db.query(
    `INSERT INTO lesson_progress (user_id, course_id, lesson_id)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP`,
    [userId, courseId, lessonId],
  )
}

export async function listCompletedLessonIds(userId, courseId) {
  const db = getPool()
  const [rows] = await db.query(
    'SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ?',
    [userId, courseId],
  )
  return rows.map((row) => Number(row.lesson_id))
}

export async function courseProgress(userId, courseId) {
  const db = getPool()
  const [[row]] = await db.query(
    `SELECT
       (SELECT COUNT(*) FROM lessons WHERE course_id = ?) AS total,
       (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND course_id = ?) AS completed`,
    [courseId, userId, courseId],
  )
  const total = Number(row.total || 0)
  const completed = Number(row.completed || 0)
  return {
    total,
    completed,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}
