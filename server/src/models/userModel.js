import bcrypt from 'bcrypt'
import { pool } from '../config/database.js'
import { HttpError } from '../utils/httpError.js'

const BCRYPT_COST = 12

function getPool() {
  if (!pool) throw new HttpError(503, 'Database is unavailable.')
  return pool
}

export function serializeUserRow(user) {
  if (!user) return null
  return {
    id: Number(user.id),
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    title: user.title || null,
    bio: user.bio || null,
    program: user.program || null,
    avatar_url: user.avatar_url || null,
    is_active: Boolean(user.is_active),
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}

const USER_COLUMNS = `id, full_name, email, password_hash, role, title, bio, program,
  avatar_url, is_active, created_at, updated_at`

// The full row, including password_hash, is only for server-side checks.
// It must never be sent to a client; authService.serializeUser strips it.
export async function findUserByEmail(email) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT ${USER_COLUMNS} FROM users WHERE email = ? LIMIT 1`,
    [email],
  )
  return rows[0] || null
}

export async function findUserById(id) {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = ? LIMIT 1`,
    [id],
  )
  return rows[0] || null
}

export async function insertUser({ full_name, email, password, role = 'student', title = null, bio = null }) {
  const db = getPool()
  const password_hash = await bcrypt.hash(password, BCRYPT_COST)
  const [result] = await db.query(
    `INSERT INTO users (full_name, email, password_hash, role, title, bio, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [full_name, email, password_hash, role, title, bio],
  )
  return result.insertId
}

export async function updateProfile(userId, { full_name, bio, program }) {
  const db = getPool()
  await db.query(
    `UPDATE users SET full_name = ?, bio = ?, program = ? WHERE id = ?`,
    [full_name, bio, program, userId],
  )
  return findUserById(userId)
}

export async function updatePassword(userId, newPassword) {
  const db = getPool()
  const password_hash = await bcrypt.hash(newPassword, BCRYPT_COST)
  await db.query(
    `UPDATE users SET password_hash = ? WHERE id = ?`,
    [password_hash, userId],
  )
}

export async function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) return false
  return bcrypt.compare(password, passwordHash)
}

export async function listUsers({ role = null, search = '', page = 1, limit = 20 }) {
  const db = getPool()
  const conditions = []
  const params = []
  if (role) {
    conditions.push('role = ?')
    params.push(role)
  }
  if (search) {
    conditions.push('(full_name LIKE ? OR email LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * limit

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM users ${where}`,
    params,
  )
  const [rows] = await db.query(
    `SELECT id, full_name, email, role, title, is_active, created_at
     FROM users ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )
  return { users: rows.map((row) => serializeUserRow(row)), total: Number(total) }
}
