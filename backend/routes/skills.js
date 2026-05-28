import { Router } from 'express';
import { validationResult, body } from 'express-validator';
import Skill from '../models/Skill.js';

const router = Router();

// Get all skills
router.get('/', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
});

// Get skills by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const skills = await Skill.find({ category: req.params.category }).sort({
      order: 1,
    });
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
});

// Create skill
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category')
      .isIn(['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Languages'])
      .withMessage('Invalid category'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const skill = new Skill(req.body);
      await skill.save();
      res.status(201).json({ success: true, data: skill });
    } catch (error) {
      next(error);
    }
  }
);

// Update skill
router.put('/:id', async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
});

// Delete skill
router.delete('/:id', async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
