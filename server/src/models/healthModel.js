import { pool, databaseConfigError } from '../config/database.js'

export async function checkDatabaseConnection() {
  if (!pool) throw new Error(databaseConfigError || 'Database pool is not configured')
  const connection = await pool.getConnection()
  try {
    await connection.query('SELECT 1')
    return true
  } finally {
    connection.release()
  }
}
