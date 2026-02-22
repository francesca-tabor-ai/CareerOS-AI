import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { body, param, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware, adminMiddleware)

// --- Users CRUD ---
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.post(
  '/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').optional().trim(),
    body('role').optional().isIn(['USER', 'ADMIN']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

      const { email, password, name, role } = req.body
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return res.status(400).json({ error: 'Email already exists' })

      const passwordHash = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { email, passwordHash, name: name || null, role: role || 'USER' },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      })
      res.status(201).json(user)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create user' })
    }
  }
)

router.patch(
  '/users/:id',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('name').optional().trim(),
    body('role').optional().isIn(['USER', 'ADMIN']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

      const data = { ...req.body }
      if (data.password) data.passwordHash = await bcrypt.hash(data.password, 10)
      delete data.password

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data,
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      })
      res.json(user)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' })
      res.status(500).json({ error: 'Failed to update user' })
    }
  }
)

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' })
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// --- Plans CRUD ---
router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { order: 'asc' } })
    res.json(plans)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
})

router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await prisma.plan.findUnique({ where: { id: req.params.id } })
    if (!plan) return res.status(404).json({ error: 'Plan not found' })
    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan' })
  }
})

router.post(
  '/plans',
  [
    body('name').notEmpty().trim(),
    body('price').notEmpty().trim(),
    body('features').isArray(),
    body('tagline').optional().trim(),
    body('period').optional().trim(),
    body('description').optional().trim(),
    body('cta').optional().trim(),
    body('href').optional().trim(),
    body('popular').optional().isBoolean(),
    body('order').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

      const plan = await prisma.plan.create({
        data: {
          ...req.body,
          popular: req.body.popular ?? false,
          order: req.body.order ?? 0,
        },
      })
      res.status(201).json(plan)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create plan' })
    }
  }
)

router.patch(
  '/plans/:id',
  [
    body('name').optional().trim(),
    body('price').optional().trim(),
    body('features').optional().isArray(),
    body('tagline').optional().trim(),
    body('period').optional().trim(),
    body('description').optional().trim(),
    body('cta').optional().trim(),
    body('href').optional().trim(),
    body('popular').optional().isBoolean(),
    body('order').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

      const plan = await prisma.plan.update({
        where: { id: req.params.id },
        data: req.body,
      })
      res.json(plan)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Plan not found' })
      res.status(500).json({ error: 'Failed to update plan' })
    }
  }
)

router.delete('/plans/:id', async (req, res) => {
  try {
    await prisma.plan.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Plan not found' })
    res.status(500).json({ error: 'Failed to delete plan' })
  }
})

// --- Case Studies CRUD ---
router.get('/case-studies', async (req, res) => {
  try {
    const cases = await prisma.caseStudy.findMany({ orderBy: { order: 'asc' } })
    res.json(cases)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch case studies' })
  }
})

router.get('/case-studies/:id', async (req, res) => {
  try {
    const cs = await prisma.caseStudy.findUnique({ where: { id: req.params.id } })
    if (!cs) return res.status(404).json({ error: 'Case study not found' })
    res.json(cs)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch case study' })
  }
})

router.post(
  '/case-studies',
  [
    body('company').notEmpty().trim(),
    body('quote').notEmpty().trim(),
    body('author').notEmpty().trim(),
    body('role').notEmpty().trim(),
    body('order').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

      const cs = await prisma.caseStudy.create({
        data: { ...req.body, order: req.body.order ?? 0 },
      })
      res.status(201).json(cs)
    } catch (err) {
      res.status(500).json({ error: 'Failed to create case study' })
    }
  }
)

router.patch(
  '/case-studies/:id',
  [
    body('company').optional().trim(),
    body('quote').optional().trim(),
    body('author').optional().trim(),
    body('role').optional().trim(),
    body('order').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const cs = await prisma.caseStudy.update({
        where: { id: req.params.id },
        data: req.body,
      })
      res.json(cs)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Case study not found' })
      res.status(500).json({ error: 'Failed to update case study' })
    }
  }
)

router.delete('/case-studies/:id', async (req, res) => {
  try {
    await prisma.caseStudy.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Case study not found' })
    res.status(500).json({ error: 'Failed to delete case study' })
  }
})

// --- Contact Submissions CRUD (read/delete for admin; create is public) ---
router.get('/contact-submissions', async (req, res) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(submissions)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact submissions' })
  }
})

router.get('/contact-submissions/:id', async (req, res) => {
  try {
    const sub = await prisma.contactSubmission.findUnique({
      where: { id: req.params.id },
    })
    if (!sub) return res.status(404).json({ error: 'Submission not found' })
    res.json(sub)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
})

router.delete('/contact-submissions/:id', async (req, res) => {
  try {
    await prisma.contactSubmission.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Submission not found' })
    res.status(500).json({ error: 'Failed to delete submission' })
  }
})

// --- App Submissions CRUD (admin read/delete) ---
router.get('/app-submissions', async (req, res) => {
  try {
    const submissions = await prisma.appSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(submissions)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch app submissions' })
  }
})

router.get('/app-submissions/:id', async (req, res) => {
  try {
    const sub = await prisma.appSubmission.findUnique({
      where: { id: req.params.id },
    })
    if (!sub) return res.status(404).json({ error: 'App submission not found' })
    res.json(sub)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch app submission' })
  }
})

router.delete('/app-submissions/:id', async (req, res) => {
  try {
    await prisma.appSubmission.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'App submission not found' })
    res.status(500).json({ error: 'Failed to delete app submission' })
  }
})

export default router
