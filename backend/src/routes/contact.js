import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post(
  '/',
  [
    body('requestType').notEmpty().trim(),
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('subject').optional().trim(),
    body('message').notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const submission = await prisma.contactSubmission.create({
        data: req.body,
      })
      res.status(201).json({ id: submission.id, message: 'Thank you for your message.' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to submit contact form' })
    }
  }
)

export default router
