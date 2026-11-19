import { HttpError } from '../utils/httpError.js'
import * as courseModel from '../models/courseModel.js'
import { validatePagination } from '../validators/lmsValidators.js'

function assertCourseOwnerOrAdmin(request, course) {
  if (request.user.role === 'admin') return
  if (course.teacherId !== request.user.id) {
    throw new HttpError(403, 'You can only manage your own courses.')
  }
}

export async function listCourses(request, response) {
  const { page, limit } = validatePagination(request)
  const { courses, total } = await courseModel.listCourses({
    search: String(request.query.search || '').trim(),
    category: String(request.query.category || '').trim(),
    teacherId: request.query.teacherId ? Number(request.query.teacherId) : null,
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

export async function getCourse(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id))
  if (!course) throw new HttpError(404, 'Course not found.')
  const isEnrolled = request.user
    ? await courseModel.isEnrolled(request.user.id, course.id)
    : false
  response.json({ success: true, data: { course: { ...course, isEnrolled } } })
}

export async function createCourse(request, response) {
  const courseId = await courseModel.insertCourse({
    teacher_id: request.user.id,
    ...request.validatedBody,
  })
  const course = await courseModel.findCourseById(courseId, { includeInactive: true })
  response.status(201).json({ success: true, data: { course } })
}

export async function updateCourse(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id), { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertCourseOwnerOrAdmin(request, course)
  const updated = await courseModel.updateCourse(course.id, request.validatedBody)
  response.json({ success: true, data: { course: updated } })
}

export async function deleteCourse(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id), { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertCourseOwnerOrAdmin(request, course)
  await courseModel.deactivateCourse(course.id)
  response.json({ success: true, data: { message: 'Course deactivated.' } })
}

export async function addLesson(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id), { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertCourseOwnerOrAdmin(request, course)
  const lessonId = await courseModel.insertLesson(course.id, request.validatedBody)
  const lesson = await courseModel.findLessonById(lessonId)
  response.status(201).json({ success: true, data: { lesson } })
}

export async function updateLesson(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id), { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertCourseOwnerOrAdmin(request, course)
  const lesson = await courseModel.findLessonById(Number(request.params.lessonId))
  if (!lesson || lesson.courseId !== course.id) {
    throw new HttpError(404, 'Lesson not found.')
  }
  const updated = await courseModel.updateLesson(lesson.id, request.validatedBody)
  response.json({ success: true, data: { lesson: updated } })
}

export async function deleteLesson(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id), { includeInactive: true })
  if (!course) throw new HttpError(404, 'Course not found.')
  assertCourseOwnerOrAdmin(request, course)
  const lesson = await courseModel.findLessonById(Number(request.params.lessonId))
  if (!lesson || lesson.courseId !== course.id) {
    throw new HttpError(404, 'Lesson not found.')
  }
  await courseModel.deleteLesson(lesson.id)
  response.json({ success: true, data: { message: 'Lesson deleted.' } })
}

export async function enroll(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id))
  if (!course) throw new HttpError(404, 'Course not found.')
  const created = await courseModel.enrollStudent(request.user.id, course.id)
  const progress = await courseModel.courseProgress(request.user.id, course.id)
  response.status(created ? 201 : 200).json({
    success: true,
    data: { enrolled: true, alreadyEnrolled: !created, progress },
  })
}

export async function completeLesson(request, response) {
  const course = await courseModel.findCourseById(Number(request.params.id))
  if (!course) throw new HttpError(404, 'Course not found.')
  const enrolled = await courseModel.isEnrolled(request.user.id, course.id)
  if (!enrolled) throw new HttpError(403, 'Enroll in this course before completing lessons.')
  const lesson = await courseModel.findLessonById(Number(request.params.lessonId))
  if (!lesson || lesson.courseId !== course.id) {
    throw new HttpError(404, 'Lesson not found.')
  }
  await courseModel.markLessonComplete(request.user.id, course.id, lesson.id)
  const progress = await courseModel.courseProgress(request.user.id, course.id)
  response.json({ success: true, data: { progress } })
}
