import { Router } from 'express';
import Profile from '../models/Profile.js';

const router = Router();

// Get profile
router.get('/', async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/', async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
