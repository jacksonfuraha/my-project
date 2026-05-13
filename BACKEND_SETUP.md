# Backend Setup Guide

Complete guide to set up and run your MongoDB backend for the portfolio project.

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB
- Default connection: `mongodb://localhost:27017/portfolio`

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free M0 cluster
- Get connection string from "Connect" button
- Format: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`

### 3. Configure Environment

Create `.env` file in the server folder:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

### 4. Seed Sample Data

Populate database with sample projects and skills:

```bash
npm run seed
```

This will:
- Clear existing data
- Add 4 sample projects
- Add 14 sample skills
- Create a profile document

### 5. Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### 6. Test the API

Open your browser or use curl/Postman to test:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all projects
curl http://localhost:5000/api/projects

# Get all skills
curl http://localhost:5000/api/skills

# Get profile
curl http://localhost:5000/api/profile
```

## Connecting React Frontend

Update your React components to use the backend API:

### Example: Fetch Projects

**Update `src/pages/Projects.jsx`:**

```javascript
import { useEffect, useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="pt-32 pb-20 bg-gray-800 text-white min-h-screen">
      {/* ... rest of your component ... */}
      {projects.map((project) => (
        <div key={project._id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          {/* ... */}
        </div>
      ))}
    </section>
  );
}
```

### Example: Fetch Skills

**Update `src/pages/Skills.jsx`:**

```javascript
import { useEffect, useState } from 'react';

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();
        if (data.success) {
          setSkills(data.data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section className="pt-32 pb-20 bg-gray-800 text-white min-h-screen">
      {/* Group skills by category */}
      {['Backend', 'Frontend', 'Database', 'DevOps', 'Tools', 'Languages'].map(category => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="grid grid-cols-2 gap-4">
            {skills
              .filter(skill => skill.category === category)
              .map(skill => (
                <div key={skill._id}>{skill.name}</div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
```

### Example: Submit Contact Form

**Create or update `src/pages/Contact.jsx`:**

```javascript
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 bg-gray-800 text-white min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        {success && <p className="text-green-500">Message sent successfully!</p>}
      </form>
    </section>
  );
}
```

## Create API Helper Functions

Create `src/api/client.js` for cleaner API calls:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // Projects
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  getProject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return response.json();
  },

  createProject: async (project) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  // Skills
  getSkills: async () => {
    const response = await fetch(`${API_BASE_URL}/skills`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  // Contact
  submitContact: async (message) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    return response.json();
  },

  // Profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`);
    return response.json();
  },
};
```

Then use it in components:

```javascript
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    apiClient.getProjects().then(setProjects);
  }, []);

  return (
    // ... component JSX
  );
}
```

## Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## MongoDB Management

### View Data with MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/products/tools/compass
2. Connect to `mongodb://localhost:27017`
3. Browse databases and collections
4. View, edit, and delete documents

### Useful Commands

```bash
# Connect to MongoDB shell
mongosh

# List databases
show databases

# Use database
use portfolio

# List collections
show collections

# View documents
db.projects.find()
db.skills.find()
db.contactmessages.find()
```

## API Reference

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Get all skills |
| GET | `/api/skills/category/:category` | Get skills by category |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contact` | Get all messages |
| GET | `/api/contact/unread` | Get unread messages |
| POST | `/api/contact` | Submit contact form |
| PATCH | `/api/contact/:id/read` | Mark as read |
| DELETE | `/api/contact/:id` | Delete message |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`
- Try restarting MongoDB

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- CORS is already enabled in server.js
- Make sure frontend and backend URLs match
- For production, update CORS origins in server.js

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                # macOS/Linux

# Kill process (Windows)
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

## Production Deployment

1. **Build React app:**
   ```bash
   npm run build
   ```

2. **Deploy backend** to:
   - Heroku (free tier available)
   - Railway
   - Render
   - AWS/Azure

3. **Deploy MongoDB** to:
   - MongoDB Atlas (recommended)
   - Self-hosted on server

4. **Update frontend API URL:**
   ```javascript
   const API_BASE_URL = 'https://your-production-api.com/api';
   ```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up MongoDB
3. ✅ Configure .env
4. ✅ Seed database
5. ✅ Start server
6. ✅ Connect React frontend
7. ✅ Test APIs
8. 📦 Deploy to production

Happy coding! 🚀
