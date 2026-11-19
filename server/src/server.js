import 'dotenv/config'
import app from './app.js'
import { pool } from './config/database.js'

const port = Number(process.env.PORT || 4001)
const server = app.listen(port, () => {
  console.log(`EduFlow API listening on port ${port}`)
})

async function shutdown(signal) {
  console.log(`${signal} received; shutting down EduFlow API.`)
  server.close(async () => {
    if (pool) await pool.end()
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
