# Technology Stack - Business AI Assistant API

> **Project Type:** Node.js Express REST API for AI-powered business assistant
> **Architecture:** RAG (Retrieval-Augmented Generation) with multi-tenant support
> **Last Updated:** December 2024

---

## 🎯 Overview

This is a **backend API** built with Node.js and Express that enables businesses to:
1. Upload business documents (PDF, DOCX, TXT, etc.)
2. Provide AI-powered chat for customers (no login required)
3. Manage team members with role-based access

---

## 📚 Complete Technology Stack

### **Core Backend**

```
Runtime Environment:
├── Node.js v18+ (LTS recommended)
└── npm (Package manager)

Web Framework:
└── Express.js v4.18+
    ├── Fast, minimalist web framework
    ├── RESTful API routing
    └── Middleware support
```

**Why Express?**
- ✅ Simple and lightweight
- ✅ Large ecosystem
- ✅ Perfect for REST APIs
- ✅ Easy to learn for beginners

---

### **Databases**

#### 1. MongoDB (Primary Database)

```
Purpose: Store user data, business info, documents metadata
Type: NoSQL Document Database
Hosting: MongoDB Atlas (Cloud - FREE tier available)
Connection: Mongoose ODM

Collections:
├── users          → Business owners & team members
├── businesses     → Business information
├── businessMembers → User-business relationships with roles
├── documents      → Document metadata (not content!)
└── publicChats    → Anonymous customer chat logs
```

**Why MongoDB?**
- ✅ FREE tier (512MB) - enough for thousands of users
- ✅ Flexible schema (JSON-like documents)
- ✅ Easy to scale
- ✅ Cloud-hosted (no server maintenance)
- ✅ Great for user management systems

**MongoDB Atlas Setup:**
```bash
# Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/database_name

# Free tier includes:
- 512 MB storage
- Shared RAM
- Shared vCPU
- No credit card required
```

#### 2. ChromaDB (Vector Database)

```
Purpose: Store embeddings (vectors) for semantic search
Type: Vector Database
Hosting: Local (runs on same server as API)
Connection: chromadb npm package

Storage Structure:
└── Collections (one per business)
    ├── business_biz_123 → Luxury Salon documents
    ├── business_biz_456 → Tech Solutions documents
    └── business_biz_789 → Coffee Shop documents

Each entry contains:
├── id: "doc_1_chunk_1"
├── embedding: [0.234, -0.123, ...] (1,536 numbers)
├── document: "actual text content"
└── metadata: { businessId, filename, uploadedAt }
```

**Why ChromaDB?**
- ✅ 100% FREE (runs locally)
- ✅ No account/signup needed
- ✅ Built for RAG applications
- ✅ Fast similarity search
- ✅ Easy to use
- ✅ No separate database server needed

**ChromaDB Storage:**
```
Location: ./chroma_data/ (auto-created)
Size: ~1-5 MB per business (typical)
Persistence: Data survives server restarts
Backup: Just copy the folder
```

---

### **AI/ML Services**

#### OpenAI API

```
Services Used:

1. Embeddings API
   ├── Model: text-embedding-3-small
   ├── Input: Text (documents or questions)
   ├── Output: Vector array [1,536 numbers]
   ├── Cost: $0.00002 per embedding (~$0.02 per 1,000)
   └── Purpose: Convert text to semantic vectors

2. Chat Completions API
   ├── Model: gpt-3.5-turbo
   ├── Input: Context + question
   ├── Output: Natural language answer
   ├── Cost: $0.0005 per request (~$0.50 per 1,000)
   └── Purpose: Generate AI responses

Total Cost per Customer Question: ~$0.00052
```

**Why OpenAI?**
- ✅ Best-in-class embeddings
- ✅ High-quality responses
- ✅ Simple API
- ✅ Pay-as-you-go pricing
- ✅ No infrastructure needed

**API Setup:**
```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create embedding
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'your text here'
});

// Generate answer
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'question here' }]
});
```

---

### **Security & Authentication**

```
Authentication:
└── JWT (jsonwebtoken)
    ├── Token-based auth
    ├── Stateless (no session storage)
    ├── Expiry: 7 days (configurable)
    └── Algorithm: HS256

Password Security:
└── bcrypt
    ├── Salt rounds: 12
    ├── One-way hashing
    └── Industry standard

HTTP Security:
└── helmet
    ├── Sets security headers
    ├── XSS protection
    ├── Clickjacking prevention
    └── Content Security Policy

Input Protection:
├── express-validator → Input validation
├── express-mongo-sanitize → NoSQL injection prevention
└── xss-clean → XSS attack prevention

CORS:
└── cors
    ├── Control allowed origins
    ├── Whitelist domains
    └── Preflight handling

Rate Limiting:
└── express-rate-limit
    ├── Prevent API abuse
    ├── IP-based throttling
    └── Configurable windows
```

**Security Layers:**
1. HTTPS/TLS (SSL certificate)
2. CORS (domain whitelist)
3. Rate limiting (10 req/min for public chat)
4. Input validation & sanitization
5. JWT authentication
6. Password hashing
7. File type validation
8. Error handling (no sensitive data exposure)

---

### **File Processing**

```
File Upload:
└── multer
    ├── Handles multipart/form-data
    ├── File size limits (10MB)
    ├── File type filtering
    └── Temporary storage

Text Extraction:
├── pdf-parse → Extract text from PDFs
├── mammoth → Extract text from DOCX
└── csv-parser → Parse CSV files

Supported File Types:
├── .pdf → PDF documents
├── .txt → Plain text
├── .docx → Word documents
├── .csv → CSV files
├── .json → JSON files
└── .md → Markdown files
```

**File Processing Flow:**
```
1. Upload → multer (validate & save temp)
2. Extract → pdf-parse/mammoth (get text)
3. Process → Create embedding
4. Store → ChromaDB + MongoDB
5. Cleanup → Delete temp file from /uploads
```

---

### **Utilities & Development**

```
Environment Variables:
└── dotenv
    ├── Load .env file
    ├── Manage config
    └── Keep secrets safe

Development:
└── nodemon
    ├── Auto-restart on changes
    ├── Watch file changes
    └── Better DX

Logging (Optional):
├── morgan → HTTP request logger
└── winston → Application logger

Process Management (Production):
└── PM2
    ├── Keep app running
    ├── Auto-restart on crash
    ├── Load balancing
    └── Log management
```

---

## 📦 Complete NPM Dependencies

### **package.json**

```json
{
  "name": "business-ai-assistant",
  "version": "1.0.0",
  "description": "AI-powered business assistant API with RAG",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
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
    "csv-parser": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### **Installation Command**

```bash
npm install
```

---

## 💰 Cost Breakdown

### **Monthly Costs (1,000 customer questions/month)**

```
Infrastructure:
├── Node.js Server (Railway/Render): $0 (Free tier)
├── MongoDB Atlas: $0 (Free 512MB tier)
└── ChromaDB: $0 (Runs locally)

AI Services:
├── OpenAI Embeddings: $0.02 (1,000 embeddings)
└── OpenAI GPT-3.5: $0.50 (1,000 answers)

Total: ~$0.52/month (52 cents!)
```

### **Scaling Costs (10,000 questions/month)**

```
Infrastructure: Still $0 (within free tiers)
OpenAI: ~$5.20/month

Total: ~$5.20/month
```

### **Enterprise Scale (100,000 questions/month)**

```
Infrastructure: ~$20/month (need paid hosting)
OpenAI: ~$52/month

Total: ~$72/month
```

---

## 🖥️ System Requirements

### **Development Environment**

```
Minimum:
├── CPU: Dual-core processor
├── RAM: 4GB
├── Storage: 10GB free space
└── OS: Windows 10/11, macOS 10.15+, Ubuntu 20.04+

Recommended:
├── CPU: Quad-core processor
├── RAM: 8GB
├── Storage: 20GB free space
└── OS: Latest version
```

### **Production Server**

```
Small Scale (< 1,000 businesses):
├── CPU: 2 vCPUs
├── RAM: 2GB
├── Storage: 20GB SSD
└── Bandwidth: 100GB/month

Example: Railway/Render free tier ✅

Medium Scale (1,000 - 10,000 businesses):
├── CPU: 4 vCPUs
├── RAM: 8GB
├── Storage: 100GB SSD
└── Bandwidth: 500GB/month

Example: DigitalOcean $24/month droplet
```

---

## 🔧 Technology Alternatives

### **If You Want to Switch...**

#### **Database Alternatives:**

```
Instead of MongoDB:
├── PostgreSQL + pgvector
│   ✓ SQL database
│   ✓ Free (Supabase, Railway)
│   ✗ More complex setup
│
└── MySQL + vector extension
    ✓ Popular
    ✗ Vector support limited

Instead of ChromaDB:
├── Pinecone
│   ✓ Fully managed
│   ✗ $70/month after free tier
│
├── Weaviate
│   ✓ Open source
│   ✗ Complex setup
│
└── Qdrant
    ✓ Good performance
    ✗ More features than needed
```

**Recommendation:** Stick with MongoDB + ChromaDB for simplicity!

#### **AI Service Alternatives:**

```
Instead of OpenAI:
├── Anthropic Claude API
│   ✓ Good quality
│   ✗ No embeddings API
│
├── Cohere
│   ✓ Free embeddings (1,000/month)
│   ✗ Limited free tier
│
└── Local models (Ollama)
    ✓ Free
    ✗ Need GPU server
    ✗ More complex
```

**Recommendation:** Start with OpenAI, it's the simplest!

---

## 📊 Technology Comparison Matrix

| Aspect | Our Choice | Why | Alternative |
|--------|------------|-----|-------------|
| **Backend** | Express.js | Simple, popular | Fastify, Koa |
| **Runtime** | Node.js | JavaScript everywhere | Python Flask/FastAPI |
| **User DB** | MongoDB | Flexible, free tier | PostgreSQL |
| **Vector DB** | ChromaDB | Free, local, simple | Pinecone, Weaviate |
| **Embeddings** | OpenAI | Best quality | Cohere, HuggingFace |
| **LLM** | GPT-3.5 | Fast, cheap | GPT-4, Claude |
| **Auth** | JWT | Stateless, scalable | Sessions |
| **Hosting** | Railway/Render | Free tier, easy deploy | AWS, DigitalOcean |

---

## 🎯 Quick Start Installation

### **Step 1: Install Node.js**
```bash
# Download from: https://nodejs.org
# Verify:
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### **Step 2: Create Project**
```bash
mkdir business-ai-assistant
cd business-ai-assistant
npm init -y
```

### **Step 3: Install Dependencies**
```bash
npm install express dotenv cors mongoose chromadb openai \
  jsonwebtoken bcrypt helmet express-rate-limit \
  express-mongo-sanitize express-validator xss-clean \
  multer pdf-parse mammoth csv-parser

npm install --save-dev nodemon
```

### **Step 4: Create .env File**
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/business-ai
JWT_SECRET=your-super-secret-key-change-in-production
OPENAI_API_KEY=sk-your-openai-key-here
```

### **Step 5: Run**
```bash
npm run dev
```

---

## 📚 Technology Documentation Links

- **Node.js:** https://nodejs.org/docs
- **Express.js:** https://expressjs.com
- **MongoDB:** https://docs.mongodb.com
- **Mongoose:** https://mongoosejs.com
- **ChromaDB:** https://docs.trychroma.com
- **OpenAI API:** https://platform.openai.com/docs
- **JWT:** https://jwt.io
- **bcrypt:** https://github.com/kelektiv/node.bcrypt.js

---

## ✅ Technology Checklist

Before starting development:
- [ ] Node.js v18+ installed
- [ ] npm working
- [ ] MongoDB Atlas account created
- [ ] OpenAI API key obtained
- [ ] Git installed (for version control)
- [ ] Code editor ready (VS Code recommended)
- [ ] Postman/Thunder Client (for API testing)

---

## 🚀 Summary

**Our Stack:**
- ✅ Node.js + Express (Backend API)
- ✅ MongoDB (User & business data)
- ✅ ChromaDB (Vector search)
- ✅ OpenAI (Embeddings + Chat)
- ✅ JWT (Authentication)
- ✅ All FREE except OpenAI (~$0.50 per 1,000 questions)

**Perfect for:**
- ✅ Beginners learning backend development
- ✅ MVPs and prototypes
- ✅ Small to medium businesses
- ✅ Cost-conscious projects
- ✅ RAG applications

**Scales to:**
- ✅ Thousands of businesses
- ✅ Millions of chat interactions
- ✅ Terabytes of documents

Ready to start building! 🎉
