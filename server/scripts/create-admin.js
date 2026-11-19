// Create the first administrator account for EduFlow.
//
// Usage (from LMS_project/server):
//   node scripts/create-admin.js --email admin@eduflow.test --password 'a-long-secret'
//   ADMIN_EMAIL=admin@eduflow.test ADMIN_PASSWORD='a-long-secret' node scripts/create-admin.js
//
// The script reads server/.env (for the database connection) no matter which
// directory it is run from. It is idempotent: if the email already has an
// account, it prints a message and exits without changing the password.
// Passwords are never printed or logged.

import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Load server/.env before importing anything that reads the environment
// (config/database.js reads DB_* at import time).
dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
})

const { pool, databaseConfigError } = await import('../src/config/database.js')
const userModel = await import('../src/models/userModel.js')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readFlag(name) {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1) return ''
  return process.argv[index + 1] || ''
}

const email = (readFlag('email') || process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const password = readFlag('password') || process.env.ADMIN_PASSWORD || ''
const fullName = (readFlag('full-name') || process.env.ADMIN_FULL_NAME || 'EduFlow Admin').trim()

if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) {
  console.error('Provide a valid admin email with --email or ADMIN_EMAIL.')
  process.exit(1)
}
if (!password || password.length < 8 || password.length > 128) {
  console.error('Provide an admin password of 8-128 characters with --password or ADMIN_PASSWORD.')
  process.exit(1)
}
if (!fullName || fullName.length > 120) {
  console.error('Admin full name must be 1-120 characters.')
  process.exit(1)
}

if (!pool) {
  console.error(`Cannot create an admin account: ${databaseConfigError || 'database is unavailable.'}`)
  process.exit(1)
}

const existing = await userModel.findUserByEmail(email)
if (existing) {
  console.log(`An account already exists for ${email} (${existing.role}). Nothing was changed.`)
  await pool.end()
  process.exit(0)
}

await userModel.insertUser({
  full_name: fullName,
  email,
  password,
  role: 'admin',
})

console.log(`Admin account created for ${email}. Sign in at /login with this email and password.`)
await pool.end()
process.exit(0)
