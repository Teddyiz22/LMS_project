import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import * as adminController from '../controllers/adminController.js'

const router = Router()

// Admin only.
router.use(authenticate, authorizeRoles('admin'))

router.get('/overview', asyncHandler(adminController.getOverview))
router.get('/users', asyncHandler(adminController.listUsers))
router.get('/courses', asyncHandler(adminController.listCourses))

export default router
