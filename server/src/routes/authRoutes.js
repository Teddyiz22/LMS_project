import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateChangePassword,
} from '../validators/authValidators.js'
import * as authController from '../controllers/authController.js'

const router = Router()

router.post(
  '/register',
  validate(validateRegister),
  asyncHandler(authController.register),
)

router.post(
  '/login',
  validate(validateLogin),
  asyncHandler(authController.login),
)

router.post(
  '/forgot-password',
  validate(validateForgotPassword),
  asyncHandler(authController.forgotPassword),
)

router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getMe),
)

router.post(
  '/change-password',
  authenticate,
  validate(validateChangePassword),
  asyncHandler(authController.changePassword),
)

export default router
