import { pool } from '../config/database.js'
import { HttpError } from '../utils/httpError.js'

function getPool() {
  if (!pool) throw new HttpError(503, 'Database is unavailable.')
  return pool
}

function formatDate(value) {
  if (!value) return null
  return new Date(value).toISOString()
}

export function serializeAssignmentRow(row) {
  if (!row) return null
  return {
    id: Number(row.id),
    courseId: Number(row.course_id),
    course: row.course_title || null,
    teacherId: row.teacher_id ? Number(row.teacher_id) : null,
    title: row.title,
    description: row.description || '',
    dueDate: row.due_date ? formatDate(row.due_date) : null,
    maxPoints: Number(row.max_points || 100),
    submissionCount: row.submission_count !== undefined ? Number(row.submission_count) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function findAssignmentById(id) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT a.id, a.course_id, a.teacher_id, a.title, a.description, a.due_date,
            a.max_points, a.created_at, a.updated_at, c.title AS course_title
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     WHERE a.id = ? LIMIT 1`,
    [id],
  )
  return rows[0] ? serializeAssignmentRow(rows[0]) : null
}

export async function listAssignmentsByTeacher(teacherId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT a.id, a.course_id, a.teacher_id, a.title, a.description, a.due_date,
            a.max_points, a.created_at, a.updated_at, c.title AS course_title,
            (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) AS submission_count
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     WHERE a.teacher_id = ?
     ORDER BY a.due_date IS NULL, a.due_date ASC, a.id ASC`,
    [teacherId],
  )
  return rows.map(serializeAssignmentRow)
}

export async function insertAssignment({ course_id, teacher_id, title, description, due_date, max_points }) {
  const db = getPool()
  const [result] = await db.query(
    `INSERT INTO assignments (course_id, teacher_id, title, description, due_date, max_points)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [course_id, teacher_id, title, description || '', due_date || null, max_points || 100],
  )
  return result.insertId
}

export async function updateAssignment(id, { title, description, due_date, max_points }) {
  const db = getPool()
  await db.query(
    `UPDATE assignments SET title = ?, description = ?, due_date = ?, max_points = ? WHERE id = ?`,
    [title, description || '', due_date || null, max_points || 100, id],
  )
  return findAssignmentById(id)
}

export async function deleteAssignment(id) {
  const db = getPool()
  await db.query('DELETE FROM assignments WHERE id = ?', [id])
}

export function serializeSubmissionRow(row) {
  if (!row) return null
  return {
    id: Number(row.id),
    assignmentId: Number(row.assignment_id),
    assignment: row.assignment_title || null,
    course: row.course_title || null,
    courseId: row.course_id ? Number(row.course_id) : null,
    studentId: Number(row.student_id),
    studentName: row.student_name || null,
    studentEmail: row.student_email || null,
    content: row.content || '',
    link: row.link || null,
    status: row.status,
    grade: row.grade !== null && row.grade !== undefined ? Number(row.grade) : null,
    feedback: row.feedback || null,
    submittedAt: row.submitted_at ? formatDate(row.submitted_at) : null,
    gradedAt: row.graded_at ? formatDate(row.graded_at) : null,
    gradedBy: row.graded_by ? Number(row.graded_by) : null,
  }
}

export async function findSubmissionById(id) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT s.id, s.assignment_id, s.student_id, s.content, s.link, s.status,
            s.grade, s.feedback, s.submitted_at, s.graded_at, s.graded_by,
            a.title AS assignment_title, a.course_id, c.title AS course_title,
            u.full_name AS student_name, u.email AS student_email
     FROM submissions s
     JOIN assignments a ON a.id = s.assignment_id
     JOIN courses c ON c.id = a.course_id
     JOIN users u ON u.id = s.student_id
     WHERE s.id = ? LIMIT 1`,
    [id],
  )
  return rows[0] ? serializeSubmissionRow(rows[0]) : null
}

export async function findSubmissionByAssignmentAndStudent(assignmentId, studentId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT id, assignment_id, student_id, content, link, status, grade, feedback,
            submitted_at, graded_at, graded_by
     FROM submissions WHERE assignment_id = ? AND student_id = ? LIMIT 1`,
    [assignmentId, studentId],
  )
  return rows[0] ? serializeSubmissionRow(rows[0]) : null
}

// A student may re-submit while the work is still ungraded; re-submitting
// clears the previous grade and feedback. Graded work cannot be re-submitted.
export async function upsertSubmission(assignmentId, studentId, { content, link }) {
  const db = getPool()
  const existing = await findSubmissionByAssignmentAndStudent(assignmentId, studentId)
  if (existing) {
    if (existing.status === 'graded') {
      throw new HttpError(409, 'This assignment has already been graded and cannot be re-submitted.')
    }
    await db.query(
      `UPDATE submissions
       SET content = ?, link = ?, status = 'submitted', grade = NULL, feedback = NULL,
           graded_by = NULL, graded_at = NULL, submitted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [content, link || null, existing.id],
    )
    return existing.id
  }
  const [result] = await db.query(
    `INSERT INTO submissions (assignment_id, student_id, content, link, status)
     VALUES (?, ?, ?, ?, 'submitted')`,
    [assignmentId, studentId, content, link || null],
  )
  return result.insertId
}

export async function listSubmissionsByTeacher(teacherId, { courseId = null, assignmentId = null, status = '' } = {}) {
  const db = getPool()
  const conditions = ['a.teacher_id = ?']
  const params = [teacherId]
  if (courseId) {
    conditions.push('a.course_id = ?')
    params.push(courseId)
  }
  if (assignmentId) {
    conditions.push('s.assignment_id = ?')
    params.push(assignmentId)
  }
  if (status) {
    conditions.push('s.status = ?')
    params.push(status)
  }
  const [rows] = await db.query(
    `SELECT s.id, s.assignment_id, s.student_id, s.content, s.link, s.status,
            s.grade, s.feedback, s.submitted_at, s.graded_at, s.graded_by,
            a.title AS assignment_title, a.course_id, c.title AS course_title,
            u.full_name AS student_name, u.email AS student_email
     FROM submissions s
     JOIN assignments a ON a.id = s.assignment_id
     JOIN courses c ON c.id = a.course_id
     JOIN users u ON u.id = s.student_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY s.submitted_at DESC`,
    params,
  )
  return rows.map(serializeSubmissionRow)
}

export async function gradeSubmission(id, gradedBy, { grade, feedback }) {
  const db = getPool()
  await db.query(
    `UPDATE submissions
     SET status = 'graded', grade = ?, feedback = ?, graded_by = ?, graded_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [grade, feedback || null, gradedBy, id],
  )
  return findSubmissionById(id)
}

export function serializeClassRow(row) {
  if (!row) return null
  return {
    id: Number(row.id),
    courseId: Number(row.course_id),
    course: row.course_title || null,
    teacherId: row.teacher_id ? Number(row.teacher_id) : null,
    teacherName: row.teacher_name || null,
    title: row.title,
    startsAt: row.starts_at ? formatDate(row.starts_at) : null,
    endsAt: row.ends_at ? formatDate(row.ends_at) : null,
    meetingLink: row.meeting_link || null,
  }
}

export async function listClassesByTeacher(teacherId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT cl.id, cl.course_id, cl.teacher_id, cl.title, cl.starts_at, cl.ends_at,
            cl.meeting_link, c.title AS course_title, u.full_name AS teacher_name
     FROM classes cl
     JOIN courses c ON c.id = cl.course_id
     LEFT JOIN users u ON u.id = cl.teacher_id
     WHERE cl.teacher_id = ?
     ORDER BY cl.starts_at ASC`,
    [teacherId],
  )
  return rows.map(serializeClassRow)
}

export async function insertClass({ course_id, teacher_id, title, starts_at, ends_at, meeting_link }) {
  const db = getPool()
  const [result] = await db.query(
    `INSERT INTO classes (course_id, teacher_id, title, starts_at, ends_at, meeting_link)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [course_id, teacher_id, title, starts_at, ends_at, meeting_link || null],
  )
  return result.insertId
}

export async function findClassById(id) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT cl.id, cl.course_id, cl.teacher_id, cl.title, cl.starts_at, cl.ends_at,
            cl.meeting_link, c.title AS course_title, u.full_name AS teacher_name
     FROM classes cl
     JOIN courses c ON c.id = cl.course_id
     LEFT JOIN users u ON u.id = cl.teacher_id
     WHERE cl.id = ? LIMIT 1`,
    [id],
  )
  return rows[0] ? serializeClassRow(rows[0]) : null
}
