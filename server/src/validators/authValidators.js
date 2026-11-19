// Authentication validators. Each validator receives the request, returns an
// array of readable validation errors, and stores the cleaned payload on the
// request (validatedBody) for the controller.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128

function asTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateEmail(request, errors) {
  const email = asTrimmedString(request.body?.email).toLowerCase()
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.push('email is required and must be a valid email address.')
  }
  return email
}

function validatePassword(request, errors, field = 'password') {
  const password = typeof request.body?.[field] === 'string' ? request.body[field] : ''
  if (
    !password
    || password.length < PASSWORD_MIN_LENGTH
    || password.length > PASSWORD_MAX_LENGTH
  ) {
    errors.push(
      `${field} is required and must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`,
    )
  }
  return password
}

export function validateRegister(request) {
  const errors = []
  const body = request.body || {}

  const fullName = asTrimmedString(body.full_name || body.fullName)
  const email = validateEmail(request, errors)
  const password = validatePassword(request, errors)
  const role = asTrimmedString(body.role || 'student').toLowerCase()
  const title = asTrimmedString(body.title)
  const bio = asTrimmedString(body.bio || body.biography)

  if (!fullName || fullName.length > 120) {
    errors.push('full_name is required and must be at most 120 characters.')
  }
  if (!['student', 'teacher'].includes(role)) {
    errors.push('role must be student or teacher. Admin accounts are created by an administrator.')
  }
  if (title.length > 120) {
    errors.push('title must be at most 120 characters.')
  }
  if (bio.length > 2000) {
    errors.push('bio must be at most 2000 characters.')
  }

  request.validatedBody = {
    full_name: fullName,
    email,
    password,
    role,
    title: title || null,
    bio: bio || null,
  }
  return errors
}

export function validateLogin(request) {
  const errors = []
  const email = validateEmail(request, errors)
  const password = validatePassword(request, errors)

  request.validatedBody = { email, password }
  return errors
}

export function validateForgotPassword(request) {
  const errors = []
  const email = validateEmail(request, errors)
  request.validatedBody = { email }
  return errors
}

export function validateChangePassword(request) {
  const errors = []
  const currentPassword = validatePassword(request, errors, 'currentPassword')
  const newPassword = validatePassword(request, errors, 'newPassword')
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('newPassword must be different from the current password.')
  }
  request.validatedBody = { currentPassword, newPassword }
  return errors
}
