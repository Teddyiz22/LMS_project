import { HttpError } from '../utils/httpError.js'
import * as courseModel from '../models/courseModel.js'
import * as assignmentModel from '../models/assignmentModel.js'
import * as studentModel from '../models/studentModel.js'

function assertOwnCourse(request, course) {
  if (request.user.role === 'admin') return
  if (course.teacherId !== request.user.id) {
    throw new HttpError(403, 'You can only manage your own courses.')
  }
}

export async function getDashboard(request, response) {
  const teacherId = request.user.id
  const { courses } = await courseModel.listCourses({
    teacherId,
    includeInactive: true,
    page: 1,
    limit: 48,
  })
  const assignments = await assignmentModel.listAssignmentsByTeacher(teacherId)
  const submissions = await assignmentModel.listSubmissionsByTeacher(teacherId)
  const classes = await assignmentModel.listClassesByTeacher(teacherId)
  const pendingSubmissions = submissions.filter((submission) => submission.status === 'submitted')
  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledCount, 0)
  response.json({
    success: true,
    data: {
      courses,
      assignments,
      pendingSubmissions,
      upcomingClasses: classes.filter((cls) => cls.startsAt && new Date(cls.startsAt) >= new Date()),
      stats: [
        { label: 'My Courses', value: String(courses.length), detail: `${totalStudents} student${totalStudents === 1 ? '' : 's'} enrolled`, tone: 'blue' },
        { label: 'Assignments', value: String(assignments.length), detail: `${pendingSubmissions.length} waiting for grading`, tone: 'amber' },
        { label: 'Submissions', value: String(submissions.length), detail: `${pendingSubmissions.length} ungraded`, tone: 'violet' },
        { label: 'Upcoming Classes', value: String(classes.length), detail: 'Scheduled sessions', tone: 'green' },
      ],
    },
  })
}

export async function getMyCourses(request, response) {
  const { courses, total } = await courseModel.listCourses({
    teacherId: request.user.id,
    includeInactive: true,
    page: 1,
    limit: 48,
  })
  response.json({ success: true, data: { courses, total } })
}

export async function getMyAssignments(request, response) {
  const assignments = await assignmentModel.listAssignmentsByTeacher(request.user.id)
  response.json({ success: true, data: { assignments } })
}

export async function createAssignment(request, response) {
  const course = await courseModel.findCourseById(request.validatedBody.course_id, { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertOwnCourse(request, course)
  const assignmentId = await assignmentModel.insertAssignment({
    ...request.validatedBody,
    teacher_id: request.user.id,
  })
  const assignment = await assignmentModel.findAssignmentById(assignmentId)
  response.status(201).json({ success: true, data: { assignment } })
}

export async function updateAssignment(request, response) {
  const assignment = await assignmentModel.findAssignmentById(Number(request.params.id))
  if (!assignment) throw new HttpError(404, 'Assignment not found.')
  if (request.user.role !== 'admin' && assignment.teacherId !== request.user.id) {
    throw new HttpError(403, 'You can only manage your own assignments.')
  }
  const updated = await assignmentModel.updateAssignment(assignment.id, request.validatedBody)
  response.json({ success: true, data: { assignment: updated } })
}

export async function deleteAssignment(request, response) {
  const assignment = await assignmentModel.findAssignmentById(Number(request.params.id))
  if (!assignment) throw new HttpError(404, 'Assignment not found.')
  if (request.user.role !== 'admin' && assignment.teacherId !== request.user.id) {
    throw new HttpError(403, 'You can only manage your own assignments.')
  }
  await assignmentModel.deleteAssignment(assignment.id)
  response.json({ success: true, data: { message: 'Assignment deleted.' } })
}

export async function getSubmissions(request, response) {
  const submissions = await assignmentModel.listSubmissionsByTeacher(request.user.id, {
    courseId: request.query.courseId ? Number(request.query.courseId) : null,
    assignmentId: request.query.assignmentId ? Number(request.query.assignmentId) : null,
    status: String(request.query.status || ''),
  })
  response.json({ success: true, data: { submissions } })
}

export async function gradeSubmission(request, response) {
  const submission = await assignmentModel.findSubmissionById(Number(request.params.id))
  if (!submission) throw new HttpError(404, 'Submission not found.')
  const assignment = await assignmentModel.findAssignmentById(submission.assignmentId)
  if (request.user.role !== 'admin' && assignment.teacherId !== request.user.id) {
    throw new HttpError(403, 'You can only grade submissions for your own assignments.')
  }
  const graded = await assignmentModel.gradeSubmission(
    submission.id,
    request.user.id,
    request.validatedBody,
  )
  response.json({ success: true, data: { submission: graded } })
}

export async function getMyClasses(request, response) {
  const classes = await assignmentModel.listClassesByTeacher(request.user.id)
  response.json({ success: true, data: { classes } })
}

export async function createClass(request, response) {
  const course = await courseModel.findCourseById(request.validatedBody.course_id, { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertOwnCourse(request, course)
  const classId = await assignmentModel.insertClass({
    ...request.validatedBody,
    teacher_id: request.user.id,
  })
  const cls = await assignmentModel.findClassById(classId)
  response.status(201).json({ success: true, data: { class: cls } })
}

export async function getStudentCourseProgress(request, response) {
  // Teacher view of one student's progress across their own courses.
  const studentId = Number(request.params.studentId)
  const courses = await studentModel.listMyCourses(studentId)
  const ownCourses = courses.filter((course) => course.teacherId === request.user.id || request.user.role === 'admin')
  response.json({ success: true, data: { courses: ownCourses } })
}
