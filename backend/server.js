import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import contactRouter from './routes/contact.js';
import profileRouter from './routes/profile.js';
import blogsRouter from './routes/blogs.js';
import adminRouter from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/profile', profileRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/admin', adminRouter);

// Public root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Portfolio backend is live' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   Projects:  GET /api/projects`);
  console.log(`   Skills:    GET /api/skills`);
  console.log(`   Contact:   POST /api/contact`);
  console.log(`   Profile:   GET /api/profile`);
});
