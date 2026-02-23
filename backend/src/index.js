import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })
dotenv.config() // fallback to backend/.env
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import contactRoutes from './routes/contact.js'
import appSubmissionsRoutes from './routes/appSubmissions.js'
import jobsRoutes from './routes/jobs.js'
import profileRoutes from './routes/profile.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/app-submissions', appSubmissionsRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/profile', profileRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
