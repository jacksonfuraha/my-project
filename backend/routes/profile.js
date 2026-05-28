import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Profile from '../models/Profile.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumeDir = path.join(__dirname, '../uploads/resumes');
const profileImagesDir = path.join(__dirname, '../uploads/profile-images');
for (const dir of [resumeDir, profileImagesDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname === 'resume' ? 'uploads/resumes' : 'uploads/profile-images';
    cb(null, path.join(__dirname, '../', folder));
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

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

// Upload profile image
router.post('/image', upload.single('profileImage'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Profile image file is required.' });
    }

    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ profileImage: imageUrl });
    } else {
      profile.profileImage = imageUrl;
      await profile.save();
    }

    const savedProfile = await Profile.findById(profile._id);
    res.status(201).json({ success: true, data: savedProfile });
  } catch (error) {
    next(error);
  }
});

// Upload resume file
router.post('/resume-file', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required.' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ resumeUrl });
    } else {
      profile.resumeUrl = resumeUrl;
      await profile.save();
    }

    const savedProfile = await Profile.findById(profile._id);
    res.status(201).json({ success: true, data: savedProfile });
  } catch (error) {
    next(error);
  }
});

// Get resume URL
router.get('/resume', async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({ success: false, message: 'Resume URL not found.' });
    }

    res.json({ success: true, data: { resumeUrl: profile.resumeUrl } });
  } catch (error) {
    next(error);
  }
});

// Delete resume URL
router.delete('/resume', async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    profile.resumeUrl = null;
    await profile.save();

    res.json({ success: true, message: 'Resume URL deleted successfully.' });
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
    const savedProfile = await Profile.findById(profile._id);
    res.json({ success: true, data: savedProfile });
  } catch (error) {
    next(error);
  }
});

export default router;
