import jwt from 'jsonwebtoken'
import { HttpError } from '../utils/httpError.js'
import * as userModel from '../models/userModel.js'

// The placeholder shipped in server/.env.example must never act as a real
// secret: treat it exactly like a missing JWT_SECRET.
const JWT_SECRET_PLACEHOLDER = 'replace_with_a_long_random_secret_at_least_32_chars'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === JWT_SECRET_PLACEHOLDER) return null
  return secret
}

export function isJwtConfigured() {
  return getJwtSecret() !== null
}

export function serializeUser(user) {
  if (!user) return null
  const serialized = userModel.serializeUserRow(user)
  if (!serialized) return null
  delete serialized.password_hash
  return serialized
}

function issueToken(user) {
  const secret = getJwtSecret()
  if (!secret) {
    throw new HttpError(503, 'Authentication is unavailable. JWT_SECRET is not configured.')
  }
  return jwt.sign(
    { sub: user.id, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  )
}

export async function register(validatedBody) {
  const userId = await userModel.insertUser({
    full_name: validatedBody.full_name,
    email: validatedBody.email,
    password: validatedBody.password,
    role: validatedBody.role,
    title: validatedBody.title || null,
    bio: validatedBody.bio || null,
  }).catch((error) => {
    // MySQL duplicate-key error on uq_users_email.
    if (error?.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'An account with this email already exists.')
    }
    throw error
  })

  const user = await userModel.findUserById(userId)
  return { user: serializeUser(user), token: issueToken(user) }
}

export async function login({ email, password }) {
  // One generic message for every mismatch, including an unknown email, so
  // the endpoint never reveals whether an email is registered.
  const genericError = new HttpError(401, 'Email or password is incorrect.')

  const user = await userModel.findUserByEmail(email)
  if (!user) throw genericError
  if (!user.is_active) throw genericError
  const passwordMatches = await userModel.verifyPassword(password, user.password_hash)
  if (!passwordMatches) throw genericError

  return { user: serializeUser(user), token: issueToken(user) }
}

export async function getAuthenticatedUser(userId) {
  const user = await userModel.findUserById(userId)
  if (!user || !user.is_active) {
    throw new HttpError(401, 'Authentication required.')
  }
  return serializeUser(user)
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await userModel.findUserById(userId)
  if (!user || !user.is_active) {
    throw new HttpError(401, 'Authentication required.')
  }
  const matches = await userModel.verifyPassword(currentPassword, user.password_hash)
  if (!matches) {
    throw new HttpError(401, 'The current password is incorrect.')
  }
  await userModel.updatePassword(userId, newPassword)
  return { message: 'Password updated.' }
}

// No email is sent in v1: the endpoint always answers the same generic
// message so it never reveals whether an email is registered.
export async function requestPasswordReset({ email }) {
  if (email) await userModel.findUserByEmail(email)
  return { message: 'If an account with that email exists, a reset link would be sent.' }
}
