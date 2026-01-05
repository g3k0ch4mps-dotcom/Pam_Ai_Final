# Project Structure & Deployment Guide

> **Project:** Business AI Assistant API  
> **Stack:** Node.js + Express + MongoDB + ChromaDB + OpenAI  
> **Deployment:** Railway / Render / DigitalOcean

---

## 📁 Complete Project Structure

```
business-ai-assistant/
│
├── 📁 src/
│   ├── 📁 config/
│   │   ├── database.js           # MongoDB connection
│   │   ├── chromadb.js           # ChromaDB initialization
│   │   └── openai.js             # OpenAI client setup
│   │
│   ├── 📁 models/
│   │   ├── User.js               # User schema
│   │   ├── Business.js           # Business schema
│   │   ├── BusinessMember.js     # Business-User relationship
│   │   ├── Document.js           # Document metadata
│   │   └── PublicChat.js         # Chat logs
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── businessAccess.js     # Business membership check
│   │   ├── permissions.js        # Permission checks
│   │   ├── validation.js         # Input validation
│   │   ├── fileUpload.js         # File upload handling
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── cors.js               # CORS configuration
│   │   ├── security.js           # Helmet security headers
│   │   ├── sanitize.js           # Input sanitization
│   │   └── errorHandler.js       # Global error handler
│   │
│   ├── 📁 routes/
│   │   ├── index.js              # Main router
│   │   ├── public.routes.js      # Public API routes
│   │   ├── business.routes.js    # Business admin routes
│   │   ├── document.routes.js    # Document management
│   │   ├── team.routes.js        # Team management
│   │   └── health.routes.js      # Health check
│   │
│   ├── 📁 controllers/
│   │   ├── publicChat.controller.js    # Public chat
│   │   ├── business.controller.js      # Business operations
│   │   ├── document.controller.js      # Document upload/delete
│   │   ├── team.controller.js          # Team management
│   │   └── analytics.controller.js     # Analytics
│   │
│   ├── 📁 services/
│   │   ├── auth.service.js             # Authentication logic
│   │   ├── jwt.service.js              # JWT operations
│   │   ├── embedding.service.js        # OpenAI embeddings
│   │   ├── completion.service.js       # OpenAI chat completions
│   │   ├── vector.service.js           # ChromaDB operations
│   │   ├── documentProcessor.service.js # File processing
│   │   ├── textExtractor.service.js    # Extract text from files
│   │   └── business.service.js         # Business logic
│   │
│   ├── 📁 utils/
│   │   ├── errors.js             # Custom error classes
│   │   ├── errorCodes.js         # Error code definitions
│   │   ├── logger.js             # Winston logger
│   │   ├── roles.js              # Role definitions
│   │   ├── helpers.js            # Helper functions
│   │   └── cleanup.js            # File cleanup utilities
│   │
│   └── server.js                 # Express app entry point
│
├── 📁 uploads/                   # Temporary file uploads (auto-cleanup)
├── 📁 chroma_data/               # ChromaDB persistent storage
├── 📁 logs/                      # Application logs
│   ├── error.log                 # Error logs
│   └── combined.log              # All logs
│
├── 📁 tests/                     # Test files (optional)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Example environment file
├── .gitignore                    # Git ignore file
├── package.json                  # NPM dependencies
├── package-lock.json             # Locked dependencies
├── README.md                     # Project documentation
└── LICENSE                       # License file

Total Files: ~40-50 files
Total Lines: ~5,000-7,000 lines of code
```

---

## 📄 Key Files Explained

### 1. server.js (Main Entry Point)

```javascript
// src/server.js

require('dotenv').config();
const express = require('express');
const { connectDatabase } = require('./config/database');
const { initializeChromaDB } = require('./config/chromadb');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

// Import middleware
const corsMiddleware = require('./middleware/cors');
const securityMiddleware = require('./middleware/security');
const sanitizeMiddleware = require('./middleware/sanitize');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(corsMiddleware);
app.use(securityMiddleware);
app.use(sanitizeMiddleware);

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Initialize ChromaDB
    await initializeChromaDB();
    
    // Start listening
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      console.log(`✅ Server ready at http://localhost:${PORT}`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
```

### 2. .env File (Environment Variables)

```bash
# .env (DO NOT COMMIT TO GIT!)

# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/business-ai?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long-change-in-production
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# ChromaDB
CHROMA_PATH=./chroma_data

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Optional: Email (for invitations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. .env.example (Template)

```bash
# .env.example (Safe to commit)

NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/business-ai
JWT_SECRET=change-this-in-production
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-your-api-key-here
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_ORIGINS=http://localhost:3000
CHROMA_PATH=./chroma_data
LOG_LEVEL=info
```

### 4. .gitignore

```bash
# .gitignore

# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log

# Temporary files
uploads/
*.tmp

# ChromaDB data (optional - backup separately)
chroma_data/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output/

# Build
dist/
build/
```

### 5. package.json

```json
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "description": "AI-powered business assistant API with RAG",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "keywords": ["ai", "rag", "chatbot", "business", "assistant"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "chromadb": "^1.7.0",
    "openai": "^4.20.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-mongo-sanitize": "^2.2.0",
    "express-validator": "^7.0.1",
    "xss-clean": "^0.1.4",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0",
    "csv-parser": "^3.0.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.55.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 6. README.md

```markdown
# Business AI Assistant API

AI-powered business assistant with RAG (Retrieval-Augmented Generation) capabilities.

## Features

- 🤖 AI-powered customer chat (no login required)
- 📄 Document upload & processing
- 🔒 Secure authentication & authorization
- 👥 Team management with roles
- 📊 Analytics dashboard
- 🏢 Multi-tenant architecture

## Tech Stack

- Node.js + Express
- MongoDB (user data)
- ChromaDB (vector search)
- OpenAI (embeddings + GPT)

## Quick Start

1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start server: `npm run dev`

## Documentation

See `/docs` folder for detailed documentation.

## License

MIT
```

---

## 🚀 Deployment Guide

### Option 1: Railway (Recommended - Easiest)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Add environment variables
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set OPENAI_API_KEY="your-openai-key"

# 5. Deploy
railway up

# Railway will automatically:
# - Detect Node.js project
# - Install dependencies
# - Start server
# - Provide HTTPS URL
```

**Railway Setup:**
- ✅ Free tier: 500 hours/month
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Environment variables UI
- ✅ Automatic deployments

### Option 2: Render

```yaml
# render.yaml

services:
  - type: web
    name: business-ai-assistant
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false
```

**Render Setup:**
1. Connect GitHub repository
2. Create new Web Service
3. Add environment variables
4. Deploy

**Render Features:**
- ✅ Free tier: 750 hours/month
- ✅ Automatic HTTPS
- ✅ Easy deployments
- ✅ Background workers support

### Option 3: DigitalOcean Droplet (More Control)

```bash
# 1. Create Ubuntu 22.04 droplet ($6/month)

# 2. SSH into droplet
ssh root@your-droplet-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install MongoDB (optional - use Atlas instead)
# Or use MongoDB Atlas (recommended)

# 5. Clone repository
git clone https://github.com/yourusername/business-ai-assistant.git
cd business-ai-assistant

# 6. Install dependencies
npm install --production

# 7. Create .env file
nano .env
# (paste your environment variables)

# 8. Install PM2 (process manager)
npm install -g pm2

# 9. Start application
pm2 start src/server.js --name business-ai-assistant

# 10. Setup auto-restart
pm2 startup
pm2 save

# 11. Install Nginx (reverse proxy)
sudo apt install nginx

# 12. Configure Nginx
sudo nano /etc/nginx/sites-available/business-ai-assistant

# Nginx configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 13. Enable site
sudo ln -s /etc/nginx/sites-available/business-ai-assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 14. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📦 Pre-Deployment Checklist

### Environment:
- [ ] `NODE_ENV=production` set
- [ ] Strong `JWT_SECRET` (min 32 chars)
- [ ] MongoDB connection string correct
- [ ] OpenAI API key valid
- [ ] CORS origins configured (not `*`)

### Code:
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] File upload restrictions enforced
- [ ] Authentication on protected routes

### Database:
- [ ] MongoDB Atlas set up
- [ ] IP whitelist configured
- [ ] Indexes created
- [ ] Backup strategy in place

### Security:
- [ ] HTTPS enabled
- [ ] Security headers (Helmet)
- [ ] Password hashing (bcrypt)
- [ ] No secrets in code
- [ ] `.env` in `.gitignore`

### Monitoring:
- [ ] Error tracking (Sentry, optional)
- [ ] Log aggregation
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up
```

---

## 📊 Monitoring Setup

### Health Check Endpoint

```javascript
// routes/health.routes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ChromaClient } = require('chromadb');

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
      mongodb: 'unknown',
      chromadb: 'unknown',
      openai: 'unknown'
    },
    uptime: process.uptime()
  };
  
  try {
    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      health.services.mongodb = 'connected';
    } else {
      health.services.mongodb = 'disconnected';
      health.status = 'degraded';
    }
    
    // Check ChromaDB
    try {
      const client = new ChromaClient();
      await client.heartbeat();
      health.services.chromadb = 'connected';
    } catch (error) {
      health.services.chromadb = 'error';
      health.status = 'degraded';
    }
    
    // OpenAI (assume available if key exists)
    if (process.env.OPENAI_API_KEY) {
      health.services.openai = 'configured';
    } else {
      health.services.openai = 'not configured';
      health.status = 'degraded';
    }
    
    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    health.status = 'error';
    res.status(503).json(health);
  }
});

module.exports = router;
```

---

## 🛠️ Maintenance Tasks

### Daily:
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Check rate limit violations

### Weekly:
- [ ] Review security logs
- [ ] Check disk space (ChromaDB)
- [ ] Update dependencies (`npm outdated`)

### Monthly:
- [ ] Database backups
- [ ] Security audit (`npm audit`)
- [ ] Performance optimization
- [ ] Review error patterns

---

## 🎯 Scaling Strategy

### Phase 1: Single Server (0-1000 users)
```
Current setup:
- Railway/Render free tier
- MongoDB Atlas free tier
- ChromaDB local
- Cost: ~$0.50/month (OpenAI only)
```

### Phase 2: Optimized Single Server (1000-10,000 users)
```
Improvements:
- Add Redis caching
- Optimize database queries
- CDN for static assets
- Cost: ~$30/month
```

### Phase 3: Horizontal Scaling (10,000+ users)
```
Architecture:
- Load balancer
- Multiple API servers
- Dedicated ChromaDB server
- Database read replicas
- Cost: ~$200+/month
```

---

## ✅ Deployment Checklist Summary

**Before First Deployment:**
- [ ] All environment variables set
- [ ] MongoDB Atlas configured
- [ ] Domain name configured (optional)
- [ ] SSL certificate installed
- [ ] Error logging tested
- [ ] Backup strategy implemented

**After Deployment:**
- [ ] Test all API endpoints
- [ ] Test file uploads
- [ ] Test public chat
- [ ] Test authentication flow
- [ ] Monitor logs for errors
- [ ] Check performance metrics

**Your API is production-ready! 🚀**
