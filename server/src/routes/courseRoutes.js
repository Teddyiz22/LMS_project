import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js'
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import { validateCourse, validateLesson } from '../validators/lmsValidators.js'
import * as courseController from '../controllers/courseController.js'

const router = Router()

// Public catalogue.
router.get('/', asyncHandler(courseController.listCourses))
router.get('/:id', optionalAuthenticate, asyncHandler(courseController.getCourse))

// Teacher / admin course management.
router.post(
  '/',
  authenticate,
  authorizeRoles('teacher', 'admin'),
  validate(validateCourse),
  asyncHandler(courseController.createCourse),
)

router.put(
  '/:id',
  authenticate,
  authorizeRoles('teacher', 'admin'),
  validate(validateCourse),
  asyncHandler(courseController.updateCourse),
)

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('teacher', 'admin'),
  asyncHandler(courseController.deleteCourse),
)

// Lessons (teacher / admin).
router.post(
  '/:id/lessons',
  authenticate,
  authorizeRoles('teacher', 'admin'),
  validate(validateLesson),
  asyncHandler(courseController.addLesson),
)

router.put(
  '/:id/lessons/:lessonId',
  authenticate,
  authorizeRoles('teacher', 'admin'),
  validate(validateLesson),
  asyncHandler(courseController.updateLesson),
)

router.delete(
  '/:id/lessons/:lessonId',
  authenticate,
  authorizeRoles('teacher', 'admin'),
  asyncHandler(courseController.deleteLesson),
)

// Student enrolment and lesson completion.
router.post(
  '/:id/enroll',
  authenticate,
  authorizeRoles('student'),
  asyncHandler(courseController.enroll),
)

router.post(
  '/:id/lessons/:lessonId/complete',
  authenticate,
  authorizeRoles('student'),
  asyncHandler(courseController.completeLesson),
)

export default router
