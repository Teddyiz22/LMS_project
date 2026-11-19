import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import { validateSubmission, validateProfile } from '../validators/lmsValidators.js'
import * as studentController from '../controllers/studentController.js'

const router = Router()

// All student routes require a logged-in student.
router.use(authenticate, authorizeRoles('student'))

router.get('/dashboard', asyncHandler(studentController.getDashboard))
router.get('/courses', asyncHandler(studentController.getMyCourses))
router.get('/assignments', asyncHandler(studentController.getMyAssignments))
router.get('/schedule', asyncHandler(studentController.getMySchedule))
router.get('/progress', asyncHandler(studentController.getMyProgress))
router.get('/profile', asyncHandler(studentController.getProfile))

router.put(
  '/profile',
  validate(validateProfile),
  asyncHandler(studentController.updateProfile),
)

router.post(
  '/assignments/:id/submit',
  validate(validateSubmission),
  asyncHandler(studentController.submitAssignment),
)

export default router
