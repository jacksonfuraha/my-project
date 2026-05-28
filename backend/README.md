# Portfolio Backend API

A Node.js/Express backend with MongoDB for managing portfolio projects, skills, and contact messages.

## Features

- ✅ Express.js server with CORS support
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API endpoints for projects, skills, and contact messages
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ Profile management

## Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud instance)
- npm

## Installation

1. **Install dependencies:**

```bash
cd server
npm install
```

2. **Create `.env` file in the server folder:**

```bash
cp .env.example .env
```

3. **Configure your `.env` file:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

For MongoDB Atlas (cloud), use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

## Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Projects

- **GET** `/api/projects` - Get all projects
- **GET** `/api/projects/:id` - Get single project
- **POST** `/api/projects` - Create new project
- **PUT** `/api/projects/:id` - Update project
- **DELETE** `/api/projects/:id` - Delete project

**Example POST request:**
```json
{
  "title": "E-Commerce Platform",
  "description": "Built a scalable e-commerce backend",
  "tech": ["Node.js", "MongoDB", "AWS"],
  "icon": "🛒",
  "github": "https://github.com/...",
  "demo": "https://demo.com",
  "featured": true
}
```

### Skills

- **GET** `/api/skills` - Get all skills
- **GET** `/api/skills/category/:category` - Get skills by category
- **POST** `/api/skills` - Create new skill
- **PUT** `/api/skills/:id` - Update skill
- **DELETE** `/api/skills/:id` - Delete skill

**Skill Categories:** Frontend, Backend, Database, DevOps, Tools, Languages

**Example POST request:**
```json
{
  "name": "Node.js",
  "category": "Backend",
  "proficiency": "Expert",
  "icon": "nodejs.svg"
}
```

### Contact Messages

- **GET** `/api/contact` - Get all messages
- **GET** `/api/contact/unread` - Get unread messages
- **POST** `/api/contact` - Submit contact form
- **PATCH** `/api/contact/:id/read` - Mark as read
- **DELETE** `/api/contact/:id` - Delete message

**Example POST request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services..."
}
```

### Profile

- **GET** `/api/profile` - Get profile information
- **PUT** `/api/profile` - Update profile information

**Example PUT request:**
```json
{
  "name": "Full Stack Developer",
  "yearsExperience": 5,
  "projectsCompleted": 50,
  "clientsServed": 30,
  "bio": "Passionate developer..."
}
```

### Health Check

- **GET** `/api/health` - Check if server is running

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   mongod
   ```

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and add to `.env`

## Frontend Integration

Update your React frontend to call these API endpoints:

```javascript
// Example fetch call
const getProjects = async () => {
  const response = await fetch('http://localhost:5000/api/projects');
  const data = await response.json();
  return data.data;
};
```

For CORS to work with local development:
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:5000`

## Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   └── errorHandler.js       # Error handling
├── models/
│   ├── Project.js            # Project schema
│   ├── Skill.js              # Skill schema
│   ├── ContactMessage.js     # Contact schema
│   └── Profile.js            # Profile schema
├── routes/
│   ├── projects.js           # Projects API
│   ├── skills.js             # Skills API
│   ├── contact.js            # Contact API
│   └── profile.js            # Profile API
├── server.js                 # Main server file
├── package.json
├── .env.example              # Environment template
└── README.md
```

## Error Handling

All errors return a consistent JSON response:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Next Steps

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and update MongoDB URI
3. Start MongoDB
4. Run the server: `npm run dev`
5. Connect your React frontend to the API
6. Deploy to production (Heroku, Vercel, AWS, etc.)

## License

ISC
