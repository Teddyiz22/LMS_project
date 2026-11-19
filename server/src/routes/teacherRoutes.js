import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import {
  validateAssignment,
  validateAssignmentUpdate,
  validateGrade,
  validateClass,
} from '../validators/lmsValidators.js'
import * as teacherController from '../controllers/teacherController.js'

const router = Router()

// Teachers and admins share the teacher workspace.
router.use(authenticate, authorizeRoles('teacher', 'admin'))

router.get('/dashboard', asyncHandler(teacherController.getDashboard))
router.get('/courses', asyncHandler(teacherController.getMyCourses))
router.get('/assignments', asyncHandler(teacherController.getMyAssignments))

router.post(
  '/assignments',
  validate(validateAssignment),
  asyncHandler(teacherController.createAssignment),
)

router.put(
  '/assignments/:id',
  validate(validateAssignmentUpdate),
  asyncHandler(teacherController.updateAssignment),
)

router.delete(
  '/assignments/:id',
  asyncHandler(teacherController.deleteAssignment),
)

router.get('/submissions', asyncHandler(teacherController.getSubmissions))

router.post(
  '/submissions/:id/grade',
  validate(validateGrade),
  asyncHandler(teacherController.gradeSubmission),
)

router.get('/classes', asyncHandler(teacherController.getMyClasses))

router.post(
  '/classes',
  validate(validateClass),
  asyncHandler(teacherController.createClass),
)

router.get('/students/:studentId/progress', asyncHandler(teacherController.getStudentCourseProgress))

export default router
