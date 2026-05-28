import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

const router = Router();

const ADMIN_USER = process.env.ADMIN_USER || 'furaha@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Jackson@123';

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingAdmin = await Admin.findOne({ email: normalizedEmail });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: 'Admin user already exists' });
      }

      // Hash password before saving
      const hashed = await bcrypt.hash(password, 10);
      const admin = await Admin.create({ email: normalizedEmail, password: hashed });
      return res.status(201).json({ success: true, data: { email: admin.email } });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const admin = await Admin.findOne({ email: normalizedEmail });
      const isEnvAdmin = normalizedEmail === ADMIN_USER.toLowerCase().trim() && password === ADMIN_PASSWORD;

      if (!admin && !isEnvAdmin) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (!match && !isEnvAdmin) {
          return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
      }

      const token = jwt.sign(
        { email: normalizedEmail, role: 'admin' },
        process.env.JWT_SECRET || 'my-secret-key',
        { expiresIn: '1d' }
      );

      return res.json({ success: true, data: { token } });
    } catch (error) {
      next(error);
    }
  }
);

export default router;