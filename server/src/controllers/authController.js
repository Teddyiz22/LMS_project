import * as authService from '../services/authService.js'

export async function register(request, response) {
  const result = await authService.register(request.validatedBody)
  response.status(201).json({ success: true, data: result })
}

export async function login(request, response) {
  const result = await authService.login(request.validatedBody)
  response.json({ success: true, data: result })
}

export async function getMe(request, response) {
  const user = await authService.getAuthenticatedUser(request.user.id)
  response.json({ success: true, data: { user } })
}

export async function forgotPassword(request, response) {
  const result = await authService.requestPasswordReset(request.validatedBody)
  response.json({ success: true, data: result })
}

export async function changePassword(request, response) {
  const result = await authService.changePassword(request.user.id, request.validatedBody)
  response.json({ success: true, data: result })
}
