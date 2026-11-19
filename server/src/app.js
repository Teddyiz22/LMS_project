import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.use(cors({
  origin(origin, callback) {
    // Permit non-browser tools such as curl, while restricting browser origins.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS.'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))
app.use(express.json({ limit: '200kb' }))

app.get('/', (_request, response) => {
  response.json({ service: 'eduflow-api', message: 'EduFlow API is running.' })
})
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
