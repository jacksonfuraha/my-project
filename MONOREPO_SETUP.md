# Portfolio Monorepo Structure

Your project is now organized as a **monorepo** with separate frontend and backend directories.

## Directory Structure

```
portfolio-monorepo/
├── frontend/               # React frontend application
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   ├── index.html         # HTML entry point
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── eslint.config.js   # ESLint configuration
│
├── backend/               # Express backend API
│   ├── routes/           # API endpoints
│   ├── models/           # MongoDB models
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── server.js         # Server entry point
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
│
├── package.json          # Monorepo root (scripts for both)
└── README.md             # Main documentation
```

## Getting Started

### 1. Install All Dependencies

```bash
npm run install-all
```

This installs dependencies for:
- Root monorepo tools (concurrently)
- Backend (server/)
- Frontend (client/)

### 2. Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will:
- Start backend on `http://localhost:5000`
- Start frontend on `http://localhost:3000`

### Individual Development

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

### 3. Build for Production

```bash
npm run build
```

Builds:
- Frontend: Optimized React app (client/dist)
- Backend: No build needed (Node.js runs directly)

### 4. Linting

```bash
npm run lint
```

Runs ESLint on both frontend and backend.

## Frontend (frontend/)

- **Framework:** React 19 with Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Dev Port:** 3000

### Frontend Scripts

```bash
cd frontend

npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Backend (backend/)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **API Port:** 5000

### Backend Scripts

```bash
cd backend

npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Backend Configuration

Create `.env` file in `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

## Key Changes

✅ **Separated concerns:** Frontend and backend are now in distinct directories  
✅ **Independent dependencies:** Each has its own package.json  
✅ **Easier deployment:** Frontend and backend can be deployed separately  
✅ **Monorepo convenience scripts:** Manage both from root  
✅ **Clear structure:** Easy for team collaboration  

## Deployment Considerations

### Frontend Deployment (Vercel/Netlify)
- Deploy `frontend/` directory
- Build command: `npm run build`
- Output directory: `dist`

### Backend Deployment (Heroku/Railway/AWS)
- Deploy `backend/` directory
- Start command: `npm start`
- Ensure `MONGODB_URI` environment variable is set

## Connecting Frontend to Backend

Update your API calls to use the backend URL. In production, this would be your deployed backend URL instead of `localhost:5000`.

Example in a React component:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

fetch(`${API_BASE_URL}/api/projects`)
```

---

**Happy coding! 🚀**
