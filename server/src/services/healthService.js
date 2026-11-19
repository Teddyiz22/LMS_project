import { checkDatabaseConnection } from '../models/healthModel.js'

// Never lie about the database: when the pool is missing or the check
// fails, the service reports degraded so /api/health answers 503.
export async function getHealth() {
  try {
    await checkDatabaseConnection()
    return { status: 'ok', database: 'connected' }
  } catch (error) {
    return {
      status: 'degraded',
      database: 'disconnected',
      error: error.message || 'Database connection failed.',
    }
  }
}
