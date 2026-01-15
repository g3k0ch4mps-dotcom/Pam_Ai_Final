# Technology Stack Documentation

## 🎯 Overview
The Business AI Assistant is a comprehensive solution designed to automate customer interactions, capture leads, and manage business documents using advanced AI technologies. It employs a modern web architecture with a decoupled frontend and backend.

## 🏗️ Architecture

### System Architecture
```
                        ┌─────────────┐
                        │   Client    │
                        │  (Browser)  │
                        └──────┬──────┘
                               │
                    ┌──────────▼──────────┐
                    │   React Frontend    │
                    │   (Vite + React)    │
                    └──────────┬──────────┘
                               │ HTTPS
                    ┌──────────▼──────────┐
                    │   Express Backend   │
                    │   (Node.js API)     │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼──────┐ ┌────▼────┐ ┌──────▼──────┐
        │  MongoDB     │ │ OpenAI  │ │ File        │
        │  Atlas       │ │ API     │ │ Storage     │
        └──────────────┘ └─────────┘ └─────────────┘
```

## 💻 Backend Stack

### Runtime Environment
- **Node.js** v20.x
  - Purpose: JavaScript runtime
  - Why: Industry standard, excellent ecosystem, non-blocking I/O ideal for API handling
  - Production: PM2 process manager

### Web Framework
- **Express.js** v4.18.2
  - Purpose: HTTP server and routing
  - Why: Lightweight, flexible, mature middleware ecosystem

### Database
- **MongoDB** v5.0+ (via Atlas)
  - Purpose: Primary data store
  - Hosting: MongoDB Atlas (cloud)
  - ODM: Mongoose v8.0.0
  - Why: Flexible schema for document storage, reliable cloud hosting, JSON-native

### Authentication
- **JWT (jsonwebtoken)** v9.0.2
  - Purpose: Stateless authentication
  - Token expiry: 7 days (default)
  - Secret management: Environment variables

### AI Integration
- **OpenAI API** v4.20.0
  - Purpose: AI chat responses, RAG
  - Model: GPT-3.5-turbo / GPT-4
  - Features: Document Q&A, context-aware responses
- **Google Generative AI** v0.24.1
  - Purpose: Fallback AI provider

### File Processing
- **multer** v1.4.5: File upload handling
- **mammoth** v1.6.0: .docx parsing
- **pdf-parse** v1.1.1: PDF text extraction
- **csv-parser** v3.0.0: CSV processing

### Web Scraping
- **puppeteer** v24.34.0: Headless browser automation
- **cheerio** v1.0.0-rc.12: HTML parsing

### Security
- **bcrypt** v5.1.1: Password hashing
- **helmet** v7.1.0: Security headers
- **cors** v2.8.5: Cross-Origin Resource Sharing
- **express-rate-limit** v7.1.5: API rate limiting
- **express-mongo-sanitize** v2.2.0: Prevent NoSQL injection
- **xss-clean** v0.1.4: Prevent XSS attacks

### Logging
- **winston** v3.11.0
  - Purpose: Structured application logging
  - Levels: error, warn, info, debug

## 🎨 Frontend Stack

### Framework
- **React** v19.2.0
  - Purpose: UI library
  - Why: Component-based, vast ecosystem

### Build Tool
- **Vite** v7.2.4
  - Purpose: Lightning-fast development server and build tool
  - Why: ESM-based HMR, optimized production builds

### Routing
- **React Router DOM** v7.11.0
  - Purpose: Client-side routing

### Styling
- **TailwindCSS** v4.1.18
  - Approach: Utility-first CSS

### Icons
- **Lucide React**: Modern, consistent icon set

## 🗄️ Database

### MongoDB Collections

#### users
- Purpose: User authentication and profiles
- Indexes: email (unique)

#### businesses
- Purpose: Business entities
- Indexes: businessSlug (unique)

#### documents
- Purpose: Uploaded files and scraped URLs
- Indexes: businessId, TextSearchIndex (full-text search)

#### leads
- Purpose: Captured customer leads
- Indexes: businessId, sessionId, email

#### chatlogs
- Purpose: History of AI interactions
- Indexes: businessId

#### businessmembers
- Purpose: User roles within businesses
- Indexes: {userId, businessId} (unique)

## 🚀 Deployment Stack

### Development
- **Local:** Node.js + MongoDB Atlas
- **Tools:** nodemon (backend), Vite (frontend)
- **Setup:** `npm run dev` (Concurrent execution)

### Testing (Current)
- **Frontend:** Render (Static Site)
- **Backend:** Render (Web Service)
- **Database:** MongoDB Atlas

### Production (Target)
- **VPS:** Hostinger Ubuntu server
- **Process Manager:** PM2
- **Web Server:** Nginx (Reverse Proxy & SSL termination)
- **SSL:** Let's Encrypt (Certbot)
- **Domain:** Custom domain
- **Monitoring:** PM2 + Health Check endpoints

## 🔧 DevOps Tools

### Process Management
- **PM2** (Production)
  - Features: Auto-restart, log management, load balancing
  - Config: ecosystem.config.js (To be created)

### Web Server
- **Nginx** (Production)
  - Purpose: Reverse proxy, static file serving, SSL
  - Features: Gzip compression, Proxy buffering

### Version Control
- **Git** + **GitHub**
  - Repository: g3k0ch4mps-dotcom/Pam_Ai_Final

## 📦 Key Dependencies

### Backend Production
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.2",
  "openai": "^4.20.0",
  "puppeteer": "^24.34.0",
  "winston": "^3.11.0"
}
```

### Frontend Production
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "lucide-react": "^0.562.0"
}
```

## 🔐 Security Measures

### Authentication
- JWT-based stateless auth
- Secure password hashing (bcrypt)
- Token expiration (7 days)

### API Security
- Helmet security headers
- CORS configuration strict origin checks (Production)
- Rate limiting (Global & Auth-specific)
- Input validation & sanitization

### Database Security
- MongoDB Atlas network isolation
- Encrypted connections (drivers)
- Database user permissions
