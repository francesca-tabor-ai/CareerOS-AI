import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { JWT_SECRET } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, name } = req.body

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { email, passwordHash, name: name || null, role: 'USER' },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      })

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({ user, token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Signup failed' })
    }
  }
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Login failed' })
    }
  }
)

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    })
    if (!user) return res.status(401).json({ error: 'User not found' })
    res.json(user)
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
