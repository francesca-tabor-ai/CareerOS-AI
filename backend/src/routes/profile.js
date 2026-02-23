import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const p = user.profile;
    const prefs = (typeof p?.preferences === 'object' && p.preferences) || {};
    const profile = {
      id: p?.id,
      name: user.name ?? '',
      headline: p?.headline ?? '',
      cv_text: p?.summary ?? '',
      resume_url: p?.resumeUrl ?? '',
      skills: p?.skills ?? [],
      target_roles: (p?.targetRoles ?? []).join(', '),
      prior_prds: prefs.priorPrds ?? '',
      include_prd: prefs.includePRD ?? true,
    };
    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, headline, cv_text, resume_url, skills, prior_prds, target_roles, include_prd } = req.body;

    await prisma.user.update({
      where: { id: req.userId },
      data: { name: name || undefined },
    });

    const targetRolesArr = typeof target_roles === 'string'
      ? target_roles.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(target_roles) ? target_roles : [];

    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const existing = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });
    const prefs = {
      ...(typeof existing?.preferences === 'object' ? existing.preferences : {}),
      ...(prior_prds !== undefined ? { priorPrds: prior_prds } : {}),
      ...(include_prd !== undefined ? { includePRD: !!include_prd } : {}),
    };

    await prisma.userProfile.upsert({
      where: { userId: req.userId },
      create: {
        userId: req.userId,
        headline: headline || undefined,
        summary: cv_text ?? '',
        resumeUrl: resume_url || undefined,
        skills: skillsArr,
        targetRoles: targetRolesArr,
        preferences: Object.keys(prefs).length ? prefs : undefined,
      },
      update: {
        headline: headline !== undefined ? headline : undefined,
        summary: cv_text !== undefined ? cv_text : undefined,
        resumeUrl: resume_url !== undefined ? resume_url : undefined,
        skills: skills !== undefined ? skillsArr : undefined,
        targetRoles: targetRolesArr.length ? targetRolesArr : undefined,
        preferences: Object.keys(prefs).length ? prefs : undefined,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
