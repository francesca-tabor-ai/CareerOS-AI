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
    const profile = {
      id: p?.id,
      name: user.name ?? '',
      cv_text: p?.summary ?? '',
      prior_prds: (p?.preferences && typeof p.preferences === 'object' && p.preferences.priorPrds) ? p.preferences.priorPrds : '',
      target_roles: (p?.targetRoles ?? []).join(', '),
    };
    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, cv_text, prior_prds, target_roles } = req.body;

    await prisma.user.update({
      where: { id: req.userId },
      data: { name: name || undefined },
    });

    const targetRolesArr = typeof target_roles === 'string'
      ? target_roles.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(target_roles) ? target_roles : [];

    const existing = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });
    const prefs = {
      ...(typeof existing?.preferences === 'object' ? existing.preferences : {}),
      ...(prior_prds !== undefined ? { priorPrds: prior_prds } : {}),
    };

    await prisma.userProfile.upsert({
      where: { userId: req.userId },
      create: {
        userId: req.userId,
        summary: cv_text ?? '',
        targetRoles: targetRolesArr,
        preferences: Object.keys(prefs).length ? prefs : undefined,
      },
      update: {
        summary: cv_text !== undefined ? cv_text : undefined,
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
