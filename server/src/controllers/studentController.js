import { HttpError } from '../utils/httpError.js'
import * as authService from '../services/authService.js'
import * as userModel from '../models/userModel.js'
import * as studentModel from '../models/studentModel.js'
import * as assignmentModel from '../models/assignmentModel.js'
import * as courseModel from '../models/courseModel.js'

export async function getDashboard(request, response) {
  const dashboard = await studentModel.getDashboard(request.user.id)
  response.json({ success: true, data: dashboard })
}

export async function getMyCourses(request, response) {
  const courses = await studentModel.listMyCourses(request.user.id)
  response.json({ success: true, data: { courses } })
}

export async function getMyAssignments(request, response) {
  const assignments = await studentModel.listMyAssignments(request.user.id)
  response.json({ success: true, data: { assignments } })
}

export async function getMySchedule(request, response) {
  const classes = await studentModel.listMySchedule(request.user.id)
  response.json({ success: true, data: { classes } })
}

export async function getMyProgress(request, response) {
  const progress = await studentModel.getMyProgress(request.user.id)
  response.json({ success: true, data: progress })
}

export async function getProfile(request, response) {
  const user = await authService.getAuthenticatedUser(request.user.id)
  const courses = await studentModel.listMyCourses(request.user.id)
  response.json({
    success: true,
    data: {
      user,
      program: user.program,
      joined: user.created_at,
      enrolledCourses: courses.length,
    },
  })
}

export async function updateProfile(request, response) {
  const user = await userModel.updateProfile(request.user.id, request.validatedBody)
  response.json({ success: true, data: { user: authService.serializeUser(user) } })
}

export async function submitAssignment(request, response) {
  const assignmentId = Number(request.params.id)
  const assignment = await assignmentModel.findAssignmentById(assignmentId)
  if (!assignment) throw new HttpError(404, 'Assignment not found.')
  const enrolled = await courseModel.isEnrolled(request.user.id, assignment.courseId)
  if (!enrolled) {
    throw new HttpError(403, 'Enroll in this course before submitting an assignment.')
  }
  const submissionId = await assignmentModel.upsertSubmission(
    assignmentId,
    request.user.id,
    request.validatedBody,
  )
  const submission = await assignmentModel.findSubmissionById(submissionId)
  response.status(201).json({ success: true, data: { submission } })
}
