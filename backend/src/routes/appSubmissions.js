import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post(
  '/',
  [
    body('companyName').notEmpty().trim(),
    body('developerEmail').isEmail().normalizeEmail(),
    body('developerName').notEmpty().trim(),
    body('appName').notEmpty().trim(),
    body('appDescription').notEmpty().trim(),
    body('integrationTypes').isArray(),
    body('appStage').optional().trim(),
    body('apiUsage').optional().trim(),
    body('webhooksNeeded').optional().isBoolean(),
    body('dataAccess').optional().trim(),
    body('whyCareerOS').notEmpty().trim(),
    body('termsAccepted').isBoolean().equals(true),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const {
        companyName,
        website,
        developerEmail,
        developerName,
        appName,
        appDescription,
        appUrl,
        integrationTypes,
        appStage,
        apiUsage,
        webhooksNeeded,
        dataAccess,
        whyCareerOS,
        termsAccepted,
      } = req.body

      const submission = await prisma.appSubmission.create({
        data: {
          companyName,
          website: website || null,
          developerEmail,
          developerName,
          appName,
          appDescription,
          appUrl: appUrl || null,
          integrationTypes: integrationTypes || [],
          appStage: appStage || 'idea',
          apiUsage: apiUsage || null,
          webhooksNeeded: webhooksNeeded ?? false,
          dataAccess: dataAccess || null,
          whyCareerOS,
          termsAccepted,
        },
      })

      res.status(201).json({
        id: submission.id,
        message: 'Application received. We will review and reach out within 5–7 business days.',
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to submit application' })
    }
  }
)

export default router
