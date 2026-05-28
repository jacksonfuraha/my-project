# How to Run This Project

**IMPORTANT:** You need **TWO separate Command Prompt windows** to run this project.

## Initial Setup (One Time Only)

### Step 1: Install Backend Dependencies

Open **Command Prompt 1** and run:
```bash
cd C:\Users\user\react-course\backend
npm install
```

Wait for it to finish (you'll see "added X packages").

### Step 2: Install Frontend Dependencies

Open **Command Prompt 2** and run:
```bash
cd C:\Users\user\react-course\frontend
npm install
```

Wait for it to finish.

### Step 3: Set Up Backend Environment

In the `backend` folder, create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

---

## Running the Project Every Time (Use 2 Terminals)

### ⚠️ IMPORTANT: DO NOT run `npm run dev` from the root folder!

You need to run commands in the **backend** and **frontend** folders separately.

---

## Terminal 1: Start the Backend

Open **Command Prompt 1** (keep it open):
```bash
cd C:\Users\user\react-course\backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

**Leave this terminal running!**

---

## Terminal 2: Start the Frontend

Open **Command Prompt 2** (in a separate window):
```bash
cd C:\Users\user\react-course\frontend
npm run dev
```

You should see:
```
➜  Local:   http://localhost:3000/
```

**Leave this terminal running!**

---

## ✅ Access Your Application

Once BOTH terminals show the server messages:
- **Open browser:** http://localhost:3000
- You should see your portfolio website!

---

## Stopping the Project

- Press `CTRL + C` in each terminal to stop the servers
- You can now close the terminals

---

## Project Structure

```
react-course/
├── backend/              ← API Server (Port 5000)
│   ├── server.js        ← Main file
│   ├── routes/          ← API endpoints
│   ├── models/          ← Database models
│   ├── package.json
│   └── .env             ← Your config file
│
├── frontend/             ← React App (Port 3000)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── RUN_PROJECT.md       ← This file
```

---

## Database Setup

Before running, make sure MongoDB is running:

### Option A: Local MongoDB
1. Download: https://www.mongodb.com/try/download/community
2. Install and run MongoDB
3. It runs on `mongodb://localhost:27017` by default

### Option B: MongoDB Atlas (Cloud)
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create M0 cluster
3. Copy connection string
4. Update `.env` MONGODB_URI with your connection string

---

## Backend Commands (Run in backend folder)

```bash
npm run dev      # Start with auto-reload
npm start        # Start for production
npm run seed     # Load sample data
```

---

## Frontend Commands (Run in frontend folder)

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## Troubleshooting

### Error: "Failed to Load Page" (ERR_CONNECTION_REFUSED)
- ❌ Backend is NOT running
- ✅ Make sure Terminal 1 shows "Server running on http://localhost:5000"

### Error: Port 3000 or 5000 Already in Use
Use Command Prompt to find and kill the process:
```bash
netstat -ano | findstr :3000
taskkill /PID <NUMBER> /F
```

### Error: "Cannot connect to MongoDB"
- Make sure MongoDB is installed and running
- Check your `.env` file has the correct MONGODB_URI
- Try local MongoDB: `mongodb://localhost:27017/portfolio`

### Commands Not Working in PowerShell
- Use **Command Prompt (cmd.exe)** instead of PowerShell
- PowerShell has permission issues with npm

---

## Quick Checklist

✅ Install backend: `npm install` in backend folder  
✅ Install frontend: `npm install` in frontend folder  
✅ Create `.env` in backend folder  
✅ MongoDB is running  
✅ Terminal 1: Backend running on :5000  
✅ Terminal 2: Frontend running on :3000  
✅ Open http://localhost:3000 in browser  

**You're all set! 🚀**
