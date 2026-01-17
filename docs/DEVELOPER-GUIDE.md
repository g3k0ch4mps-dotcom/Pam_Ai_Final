# Developer Guide

## 🏗️ Architecture Overview

The Business AI Assistant is built with a modern JavaScript stack following a layered architecture.

### **Tech Stack**
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **AI**: Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o
- **Auth**: JWT (jsonwebtoken)
- **Scraping**: Puppeteer + Axios + Cheerio

---

## 📁 Project Structure

```bash
backend/
├── public/                 # Static assets (Chat Widget)
├── src/
│   ├── config/             # Database and environmental config
│   ├── controllers/        # Request handlers (logic)
│   ├── middleware/         # Auth, validation, rate limiting
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic & 3rd party integrations
│   │   ├── ai.service.js   # LLM interaction
│   │   ├── urlScraper.service.js # Advanced scraping logic
│   │   └── search.service.js # RAG search implementation
│   ├── utils/              # Helpers (logger, slug, etc.)
│   └── server.js           # Express entry point
└── uploads/                # Temporary directory for uploaded files
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18.x or higher)
- MongoDB (Local or Atlas)
- NPM or Yarn

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pam-ai
JWT_SECRET=your_super_secret_jwt_key
ANTHROPIC_API_KEY=your_key_here
NODE_ENV=development
```

### 3. Installation
```bash
cd backend
npm install
```

### 4. Running the App
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

---

## 🧪 Search & RAG Implementation

The system uses **MongoDB Text Indexing** for its Retrieval-Augmented Generation (RAG) system.

### **How it works:**
1. Documents are uploaded/scraped and stored in the `documents` collection.
2. A compound text index is maintained on `urlTitle`, `originalName`, and `textContent`.
3. When a user asks a question, `search.service.js` performs a `$text` search with weight-based scoring.
4. Top results are passed to `ai.service.js` as context for the LLM.

---

## 🚢 Deployment (Render)

The project is configured for deployment on Render.

### **Configuration:**
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Environment**: Web Service
- **Health Check**: `/api/health`

**Important**: In production, ensure `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` is NOT set if you want the scraper to work, or ensure the environment matches the requirements in `docs/SCRAPER-TECHNICAL.md`.

---

## 🤝 Contribution Guidelines

1. **Routes**: Always define routes in `src/routes` and mount them in `server.js`.
2. **Controllers**: Keep controllers thin. Move complex logic to `services`.
3. **Middleware**: Add global middleware in `server.js` and route-specific middleware in the route file.
4. **Error Handling**: Use the existing error response format. Avoid throwing raw errors to the client in production.
5. **Logging**: Use the `logger` utility (`logger.info`, `logger.error`) instead of `console.log`.
