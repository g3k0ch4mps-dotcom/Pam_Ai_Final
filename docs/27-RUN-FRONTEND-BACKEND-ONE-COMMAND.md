# Run Frontend + Backend with ONE Command

> **Problem:** Need to run `npm run dev` twice (once for backend, once for frontend)
> 
> **Solution:** Use `concurrently` to run both with a single command!

---

## 🎯 Quick Solution

### **Option 1: Use `concurrently` (RECOMMENDED)**

Run both frontend and backend with ONE command from the root directory!

---

## 🚀 Implementation (5 Minutes)

### **Step 1: Create Root package.json**

In your **project root** (not in backend or frontend), create `package.json`:

```bash
# From project root
touch package.json
```

**Add this content:**

```json
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "description": "Business AI Assistant - Full Stack Application",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install && cd ..",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run preview"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

### **Step 2: Install concurrently**

```bash
# From project root
npm install
```

This installs `concurrently` package.

---

### **Step 3: Run Everything with ONE Command!**

```bash
# From project root
npm run dev
```

**That's it!** 🎉

Both backend and frontend will start together!

---

## 📋 What You'll See

```bash
$ npm run dev

[0] 
[0] > backend@1.0.0 dev
[0] > nodemon src/server.js
[0] 
[1] 
[1] > frontend@1.0.0 dev
[1] > vite
[1] 
[0] ✅ Server running on port 3000
[0] ✅ MongoDB connected
[1] 
[1]   VITE v5.0.0  ready in 500 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

**Both running!** ✅

---

## 🎨 Better Output (With Colors)

### **Update root package.json for prettier output:**

```json
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install && cd ..",
    "start": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run preview"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**Now output is color-coded:**
- 🔵 **Blue** = Backend logs
- 🟣 **Magenta** = Frontend logs

---

## 🔧 Complete Project Structure

```
your-project/
├── package.json          ← NEW! Root package.json
├── node_modules/         ← NEW! Concurrently installed here
├── backend/
│   ├── src/
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── node_modules/
├── .gitignore
└── README.md
```

---

## 📝 All Available Commands

### **Development:**

```bash
# Run both (development mode)
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend
```

---

### **Production:**

```bash
# Run both (production mode)
npm start

# Run only backend (production)
npm run start:backend

# Run only frontend (production)
npm run start:frontend
```

---

### **Installation:**

```bash
# Install all dependencies (root + backend + frontend)
npm run install:all
```

---

## 🎯 Step-by-Step Setup Guide

### **Complete Setup from Scratch:**

```bash
# 1. Go to project root
cd your-project

# 2. Create root package.json
cat > package.json << 'EOF'
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "description": "Business AI Assistant - Full Stack Application",
  "scripts": {
    "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install && cd ..",
    "start": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run preview"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# 3. Install concurrently
npm install

# 4. Run everything!
npm run dev
```

---

## ✅ Verification

### **After running `npm run dev`, you should see:**

```bash
✅ Backend running on http://localhost:3000
✅ Frontend running on http://localhost:5173
✅ Both auto-restart on file changes
✅ Color-coded logs
✅ Clean output
```

---

## 🔧 Alternative Options

### **Option 2: Use npm-run-all**

Similar to concurrently but different syntax:

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

---

### **Option 3: Create Shell Script**

**Create `dev.sh` in root:**

```bash
#!/bin/bash

# Start backend in background
cd backend && npm run dev &

# Start frontend in background
cd frontend && npm run dev &

# Wait for both processes
wait
```

**Make executable and run:**

```bash
chmod +x dev.sh
./dev.sh
```

---

### **Option 4: Use tmux/screen (Advanced)**

For separate terminal panes:

```bash
# Using tmux
tmux new-session \; \
  send-keys 'cd backend && npm run dev' C-m \; \
  split-window -h \; \
  send-keys 'cd frontend && npm run dev' C-m \;
```

---

## 📊 Comparison

| Method | Pros | Cons |
|--------|------|------|
| **concurrently** ⭐ | Easy, colors, one terminal | Need extra package |
| **npm-run-all** | Simple, lightweight | Less features |
| **Shell script** | No dependencies | OS-specific |
| **tmux/screen** | Separate panes | Complex setup |

**Recommended: concurrently** 🏆

---

## 🚨 Troubleshooting

### **Issue 1: "concurrently: command not found"**

**Solution:**
```bash
# Install concurrently
npm install

# Or install globally
npm install -g concurrently
```

---

### **Issue 2: Ports already in use**

**Solution:**
```bash
# Kill processes on ports
# Backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9

# Then run again
npm run dev
```

---

### **Issue 3: Can't see backend logs**

**Solution:** Update concurrently with prefix:

```json
{
  "scripts": {
    "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" -p \"[{name}]\" \"npm run dev:backend\" \"npm run dev:frontend\""
  }
}
```

---

### **Issue 4: One service crashes, other keeps running**

**Solution:** Add kill-others flag:

```json
{
  "scripts": {
    "dev": "concurrently --kill-others -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run dev:backend\" \"npm run dev:frontend\""
  }
}
```

Now if one crashes, both stop!

---

## 🎯 Advanced Configuration

### **Full-Featured Setup:**

```json
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "description": "Business AI Assistant - Full Stack Application",
  "scripts": {
    "dev": "concurrently --kill-others-on-fail -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" -p \"[{name}]\" \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend-only": "cd backend && npm run dev",
    "dev:frontend-only": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run preview",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install && cd ..",
    "clean": "rm -rf node_modules backend/node_modules frontend/node_modules",
    "clean:install": "npm run clean && npm run install:all",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Now you have:**
- ✅ `npm run dev` - Run both (dev mode)
- ✅ `npm run dev:backend-only` - Only backend
- ✅ `npm run dev:frontend-only` - Only frontend
- ✅ `npm run build` - Build both
- ✅ `npm start` - Run both (production)
- ✅ `npm run install:all` - Install all deps
- ✅ `npm run clean` - Remove all node_modules
- ✅ `npm test` - Test both

---

## 📝 Update .gitignore

Add to root `.gitignore`:

```
# Root node_modules
/node_modules/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
```

---

## 🎯 Usage Examples

### **Daily Development:**

```bash
# Morning - start work
npm run dev

# Both services start
# Make changes
# Both auto-reload
# Ctrl+C to stop both
```

---

### **First Time Setup:**

```bash
# Clone repo
git clone https://github.com/yourusername/project.git
cd project

# Install all dependencies
npm run install:all

# Run development
npm run dev

# Done! 🎉
```

---

### **Production Build:**

```bash
# Build both
npm run build

# Run production
npm start
```

---

## ✅ Update README.md

Add this to your README:

```markdown
## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- OpenAI API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/business-ai-assistant.git
   cd business-ai-assistant
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Setup environment variables:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values

   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your values
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Available Commands

```bash
npm run dev              # Run both frontend + backend (development)
npm run dev:backend      # Run only backend
npm run dev:frontend     # Run only frontend
npm run build            # Build both for production
npm start                # Run both (production mode)
npm run install:all      # Install all dependencies
npm run clean            # Remove all node_modules
npm test                 # Run all tests
```
```

---

## 🎉 Summary

### **Before:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### **After:**
```bash
# One terminal
npm run dev

# Both running! 🎉
```

---

## 💡 Benefits

✅ **One command** - Start everything  
✅ **One terminal** - No switching  
✅ **Color-coded logs** - Easy to read  
✅ **Auto-restart** - On file changes  
✅ **Kill together** - Ctrl+C stops both  
✅ **Professional** - Industry standard  

---

## 🔧 Git Commit

```bash
# Add root package.json
git add package.json

# Commit
git commit -m "feat: add concurrently for running frontend + backend together

- Add root package.json
- Install concurrently
- Add npm run dev command to start both services
- Add color-coded logs for better development experience
- Add npm run install:all for easy setup"

# Push
git push origin main
```

---

## ✅ Quick Setup (Copy-Paste)

```bash
# 1. Create root package.json
cat > package.json << 'EOF'
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"bgBlue.bold,bgMagenta.bold\" \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# 2. Install
npm install

# 3. Run!
npm run dev
```

---

**That's it! Now you can run both frontend and backend with ONE command!** 🚀

**Questions? Let me know!** 💪
