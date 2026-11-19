import { pool } from '../config/database.js'
import { HttpError } from '../utils/httpError.js'
import { courseProgress, listCompletedLessonIds, serializeCourseRow } from './courseModel.js'

function getPool() {
  if (!pool) throw new HttpError(503, 'Database is unavailable.')
  return pool
}

function formatDate(value) {
  if (!value) return null
  return new Date(value).toISOString()
}

function dueLabelFor(dueDate, status) {
  if (!dueDate) return 'No due date'
  const now = new Date()
  const due = new Date(dueDate)
  const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  if (status === 'graded') return 'Graded'
  if (status === 'submitted') return 'Submitted'
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

export async function listMyCourses(userId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT c.id, c.teacher_id, c.title, c.slug, c.description, c.category,
            c.level, c.price_usd, c.image_url, c.is_published, c.is_active,
            c.created_at, c.updated_at,
            u.full_name AS teacher_name, u.title AS teacher_title,
            COALESCE((SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id), 0) AS lesson_count,
            COALESCE((SELECT SUM(l.duration_minutes) FROM lessons l WHERE l.course_id = c.id), 0) AS duration_minutes,
            COALESCE((SELECT COUNT(*) FROM enrollments e2 WHERE e2.course_id = c.id), 0) AS enrolled_count,
            e.enrolled_at
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     LEFT JOIN users u ON u.id = c.teacher_id
     WHERE e.user_id = ? AND c.is_active = 1
     ORDER BY e.enrolled_at DESC`,
    [userId],
  )

  const courses = []
  for (const row of rows) {
    const course = serializeCourseRow(row)
    const progress = await courseProgress(userId, course.id)
    const completedIds = await listCompletedLessonIds(userId, course.id)
    const [lessons] = await db.query(
      `SELECT id, title, position FROM lessons WHERE course_id = ? ORDER BY position ASC, id ASC`,
      [course.id],
    )
    const nextLesson = lessons.find((lesson) => !completedIds.includes(Number(lesson.id)))
    courses.push({
      ...course,
      progress: progress.progress,
      completedLessons: progress.completed,
      totalLessons: progress.total,
      currentLesson: progress.progress === 100
        ? 'Course completed'
        : nextLesson
          ? nextLesson.title
          : 'Start learning',
      lastAccessed: row.enrolled_at ? formatDate(row.enrolled_at) : null,
    })
  }
  return courses
}

export async function listMyAssignments(userId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT a.id, a.course_id, a.title, a.description, a.due_date, a.max_points,
            c.title AS course_title,
            s.id AS submission_id, s.content AS submission_content, s.link AS submission_link,
            s.status AS submission_status, s.grade, s.feedback, s.submitted_at, s.graded_at
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     JOIN enrollments e ON e.course_id = a.course_id AND e.user_id = ?
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
     WHERE c.is_active = 1
     ORDER BY a.due_date IS NULL, a.due_date ASC, a.id ASC`,
    [userId, userId],
  )

  return rows.map((row) => {
    const status = row.submission_id
      ? (row.grade !== null && row.grade !== undefined ? 'graded' : 'submitted')
      : (row.due_date && new Date(row.due_date) < new Date() ? 'overdue' : 'pending')
    return {
      id: Number(row.id),
      courseId: Number(row.course_id),
      course: row.course_title,
      title: row.title,
      description: row.description || '',
      dueDate: row.due_date ? formatDate(row.due_date) : null,
      dueLabel: dueLabelFor(row.due_date, status),
      status,
      maxPoints: Number(row.max_points || 100),
      submission: row.submission_id ? {
        id: Number(row.submission_id),
        content: row.submission_content || '',
        link: row.submission_link || null,
        status: row.submission_status,
        grade: row.grade !== null && row.grade !== undefined ? Number(row.grade) : null,
        feedback: row.feedback || null,
        submittedAt: row.submitted_at ? formatDate(row.submitted_at) : null,
        gradedAt: row.graded_at ? formatDate(row.graded_at) : null,
      } : null,
    }
  })
}

export async function listMySchedule(userId) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT cl.id, cl.course_id, cl.title, cl.starts_at, cl.ends_at, cl.meeting_link,
            c.title AS course_title, u.full_name AS teacher_name
     FROM classes cl
     JOIN courses c ON c.id = cl.course_id
     JOIN enrollments e ON e.course_id = cl.course_id AND e.user_id = ?
     LEFT JOIN users u ON u.id = cl.teacher_id
     WHERE cl.starts_at >= NOW() - INTERVAL 1 DAY
     ORDER BY cl.starts_at ASC`,
    [userId],
  )

  const colorFor = (index) => [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
  ][index % 4]

  return rows.map((row, index) => {
    const starts = new Date(row.starts_at)
    const ends = new Date(row.ends_at)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return {
      id: Number(row.id),
      courseId: Number(row.course_id),
      course: row.course_title,
      title: row.title,
      instructor: row.teacher_name || '',
      date: starts.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      time: `${starts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${ends.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      day: dayNames[starts.getDay()],
      timeSlot: starts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      startsAt: formatDate(row.starts_at),
      endsAt: formatDate(row.ends_at),
      meetingLink: row.meeting_link || null,
      color: colorFor(index),
    }
  })
}

export async function getMyProgress(userId) {
  const db = getPool()
  const courses = await listMyCourses(userId)

  const [activityRows] = await db.query(
    `SELECT DATE(lp.completed_at) AS day, SUM(l.duration_minutes) AS minutes
     FROM lesson_progress lp
     JOIN lessons l ON l.id = lp.lesson_id
     WHERE lp.user_id = ? AND lp.completed_at >= CURDATE() - INTERVAL 6 DAY
     GROUP BY DATE(lp.completed_at)`,
    [userId],
  )
  const minutesByDay = new Map(activityRows.map((row) => [
    row.day instanceof Date ? row.day.toISOString().slice(0, 10) : String(row.day).slice(0, 10),
    Number(row.minutes || 0),
  ]))
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyLearningActivity = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - offset)
    const key = date.toISOString().slice(0, 10)
    weeklyLearningActivity.push({
      day: dayNames[date.getDay()],
      hours: Math.round(((minutesByDay.get(key) || 0) / 60) * 10) / 10,
    })
  }

  const [[totals]] = await db.query(
    `SELECT COALESCE(SUM(l.duration_minutes), 0) AS minutes
     FROM lesson_progress lp
     JOIN lessons l ON l.id = lp.lesson_id
     WHERE lp.user_id = ?`,
    [userId],
  )
  const learningHours = Math.round((Number(totals.minutes || 0) / 60) * 10) / 10
  const weekMinutes = weeklyLearningActivity.reduce((sum, entry) => sum + entry.hours, 0)
  const completedCourses = courses.filter((course) => course.progress === 100)
  const averageProgress = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0

  const [[{ activeDays }]] = await db.query(
    `SELECT COUNT(DISTINCT DATE(completed_at)) AS activeDays
     FROM lesson_progress
     WHERE user_id = ? AND completed_at >= CURDATE() - INTERVAL 6 DAY`,
    [userId],
  )

  const achievements = []
  if (Number(activeDays) > 0) {
    achievements.push({ title: 'Consistency streak', detail: `${activeDays} day${Number(activeDays) === 1 ? '' : 's'} of learning this week`, type: 'badge' })
  }
  if (completedCourses.length > 0) {
    achievements.push({ title: completedCourses[0].title, detail: 'Course completed', type: 'certificate' })
  }
  const [[{ submissions }]] = await db.query(
    'SELECT COUNT(*) AS submissions FROM submissions WHERE student_id = ?',
    [userId],
  )
  if (Number(submissions) > 0) {
    achievements.push({ title: 'First project', detail: `${submissions} assignment${Number(submissions) === 1 ? '' : 's'} submitted`, type: 'badge' })
  }

  return {
    courses,
    weeklyLearningActivity,
    achievements,
    stats: [
      { label: 'Enrolled Courses', value: String(courses.length), detail: completedCourses.length ? `${completedCourses.length} course${completedCourses.length === 1 ? '' : 's'} completed` : 'No course completed yet', tone: 'blue' },
      { label: 'Completed Courses', value: String(completedCourses.length), detail: 'Keep building momentum', tone: 'green' },
      { label: 'Learning Hours', value: String(learningHours), detail: `${Math.round(weekMinutes * 10) / 10} hours this week`, tone: 'violet' },
      { label: 'Average Progress', value: `${averageProgress}%`, detail: 'Across active courses', tone: 'amber' },
    ],
  }
}

export async function getDashboard(userId) {
  const courses = await listMyCourses(userId)
  const assignments = await listMyAssignments(userId)
  const schedule = await listMySchedule(userId)
  const progress = await getMyProgress(userId)
  const currentCourse = courses.find((course) => course.progress > 0 && course.progress < 100) || courses[0] || null
  return {
    courses,
    assignments,
    schedule,
    stats: progress.stats,
    weeklyLearningActivity: progress.weeklyLearningActivity,
    achievements: progress.achievements,
    currentCourse,
  }
}
