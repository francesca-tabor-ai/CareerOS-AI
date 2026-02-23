import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { parseJobFromText, parseJobIntelligence, generateCoverLetter, generatePRD } from '../services/geminiService.js';

const router = Router();
const prisma = new PrismaClient();

function toCareerOsJob(app) {
  const hasArtifacts = !!app.coverLetter && !!app.prd;
  const status = app.outcome === 'OFFER' ? 'offer'
    : app.outcome === 'REJECTED' ? 'rejected'
    : app.outcome === 'INTERVIEW' ? 'interview'
    : app.status === 'SUBMITTED' || app.status === 'IN_PROGRESS' ? 'applied'
    : hasArtifacts ? 'ready'
    : app.job?.roleIntelligence ? 'parsed'
    : 'ingested';

  return {
    id: app.id,
    company_name: app.job?.companyName ?? '',
    job_title: app.job?.jobTitle ?? '',
    job_description: app.job?.jobDescription ?? '',
    application_link: app.job?.applicationLink ?? '',
    status,
    ai_maturity_level: app.job?.aiMaturityLevel ?? 0,
    parsed_intelligence: typeof app.job?.roleIntelligence === 'object'
      ? JSON.stringify(app.job.roleIntelligence)
      : app.job?.roleIntelligence ?? '{}',
    cover_letter: app.coverLetter?.content ?? '',
    prd_content: app.prd?.content ?? '',
    created_at: app.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updated_at: app.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    _jobId: app.jobId,
  };
}

router.use(authMiddleware);

router.post('/parse', async (req, res) => {
  try {
    const { raw_input } = req.body;
    if (!raw_input || typeof raw_input !== 'string') {
      return res.status(400).json({ error: 'raw_input (string) is required' });
    }
    const parsed = await parseJobFromText(raw_input);
    res.json(parsed);
  } catch (err) {
    console.error('Error parsing job:', err);
    res.status(500).json({ error: err.message || 'Failed to parse job' });
  }
});

router.get('/', async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.userId },
      include: {
        job: true,
        coverLetter: true,
        prd: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(apps.map(toCareerOsJob));
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { company_name, job_title, job_description, application_link, raw_input } = req.body;
    if (!company_name || !job_title || !job_description) {
      return res.status(400).json({ error: 'company_name, job_title, and job_description are required' });
    }

    const job = await prisma.job.create({
      data: {
        companyName: company_name,
        jobTitle: job_title,
        jobDescription: job_description,
        applicationLink: application_link || null,
        source: req.body.raw_input ? 'paste' : 'manual',
        rawInput: req.body.raw_input || null,
      },
    });

    const application = await prisma.application.create({
      data: {
        userId: req.userId,
        jobId: job.id,
        status: 'DRAFT',
      },
      include: { job: true, coverLetter: true, prd: true },
    });

    res.status(201).json({ id: application.id });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const app = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { job: true, coverLetter: true, prd: true },
    });
    if (!app) return res.status(404).json({ error: 'Job not found' });
    res.json(toCareerOsJob(app));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const app = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { job: true, coverLetter: true, prd: true },
    });
    if (!app) return res.status(404).json({ error: 'Job not found' });

    const { status, ai_maturity_level, parsed_intelligence, cover_letter, prd_content } = req.body;

    const jobUpdates = {};
    if (ai_maturity_level !== undefined) jobUpdates.aiMaturityLevel = ai_maturity_level;
    if (parsed_intelligence !== undefined) {
      jobUpdates.roleIntelligence = typeof parsed_intelligence === 'string'
        ? JSON.parse(parsed_intelligence || '{}')
        : parsed_intelligence;
    }
    if (Object.keys(jobUpdates).length) {
      await prisma.job.update({ where: { id: app.jobId }, data: jobUpdates });
    }

    if (status) {
      const statusMap = {
        ingested: 'DRAFT', parsed: 'DRAFT', generating: 'DRAFT', ready: 'PENDING_REVIEW',
        applied: 'SUBMITTED', interview: 'SUBMITTED', rejected: 'SUBMITTED', offer: 'SUBMITTED',
      };
      const outcomeMap = { interview: 'INTERVIEW', rejected: 'REJECTED', offer: 'OFFER' };
      await prisma.application.update({
        where: { id: app.id },
        data: {
          status: statusMap[status] ?? app.status,
          outcome: outcomeMap[status] ?? app.outcome,
        },
      });
    }

    if (cover_letter !== undefined || prd_content !== undefined) {
      if (cover_letter !== undefined) {
        await prisma.coverLetter.upsert({
          where: { applicationId: app.id },
          create: { applicationId: app.id, content: cover_letter, wordCount: cover_letter.split(/\s+/).length },
          update: { content: cover_letter, wordCount: cover_letter.split(/\s+/).length, editedAt: new Date() },
        });
      }
      if (prd_content !== undefined) {
        await prisma.prd.upsert({
          where: { applicationId: app.id },
          create: { applicationId: app.id, content: prd_content },
          update: { content: prd_content, editedAt: new Date() },
        });
      }
    }

    const updated = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { job: true, coverLetter: true, prd: true },
    });
    res.json(toCareerOsJob(updated));
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const app = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!app) return res.status(404).json({ error: 'Job not found' });

    await prisma.application.delete({ where: { id: app.id } });
    await prisma.job.delete({ where: { id: app.jobId } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

router.post('/:id/generate', async (req, res) => {
  try {
    const app = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { job: true, coverLetter: true, prd: true, user: true },
    });
    if (!app) return res.status(404).json({ error: 'Job not found' });

    const profile = await prisma.userProfile.findFirst({
      where: { userId: req.userId },
    });
    const user = app.user;
    const priorPrds = (profile?.preferences && typeof profile.preferences === 'object' && profile.preferences.priorPrds) || '';
    const profileData = {
      name: user?.name ?? profile?.headline ?? 'Candidate',
      cv_text: profile?.summary ?? '',
      prior_prds: priorPrds,
    };

    if (!profileData.cv_text) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    const job = app.job;
    const jobData = {
      company_name: job.companyName,
      job_title: job.jobTitle,
      job_description: job.jobDescription,
    };

    const intelligence = await parseJobIntelligence(job.jobDescription);

    await prisma.job.update({
      where: { id: job.id },
      data: {
        aiMaturityLevel: intelligence.aiMaturityStage,
        roleIntelligence: intelligence,
      },
    });

    const [coverLetter, prd] = await Promise.all([
      generateCoverLetter(jobData, profileData, intelligence),
      generatePRD(jobData, profileData, intelligence),
    ]);

    await prisma.coverLetter.upsert({
      where: { applicationId: app.id },
      create: { applicationId: app.id, content: coverLetter, wordCount: coverLetter.split(/\s+/).length },
      update: { content: coverLetter, wordCount: coverLetter.split(/\s+/).length },
    });
    await prisma.prd.upsert({
      where: { applicationId: app.id },
      create: { applicationId: app.id, content: prd },
      update: { content: prd },
    });
    await prisma.application.update({
      where: { id: app.id },
      data: { status: 'PENDING_REVIEW' },
    });

    const updated = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { job: true, coverLetter: true, prd: true },
    });
    res.json(toCareerOsJob(updated));
  } catch (err) {
    console.error('Error generating artifacts:', err);
    res.status(500).json({ error: err.message || 'Failed to generate artifacts' });
  }
});

export default router;
