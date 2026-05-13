import { Router } from 'express';
import { validationResult, body } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';

const router = Router();

// Get all contact messages
router.get('/', async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

// Get unread messages
router.get('/unread', async (req, res, next) => {
  try {
    const messages = await ContactMessage.find({ read: false }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

// Create contact message
router.post(
  '/',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().trim().withMessage('Subject is required'),
    body('message').notEmpty().trim().withMessage('Message is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const message = new ContactMessage(req.body);
      await message.save();
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }
);

// Mark as read
router.patch('/:id/read', async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
});

// Delete message
router.delete('/:id', async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
