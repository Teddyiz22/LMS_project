import mysql from 'mysql2/promise'

const requiredDatabaseEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
const missingDatabaseEnv = requiredDatabaseEnv.filter((key) => !process.env[key])

export const databaseConfigError = missingDatabaseEnv.length
  ? `Missing database environment variables: ${missingDatabaseEnv.join(', ')}`
  : null

export const pool = databaseConfigError
  ? null
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z',
      decimalNumbers: false,
    })
