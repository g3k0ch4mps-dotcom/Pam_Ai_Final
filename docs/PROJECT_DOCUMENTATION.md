# Business AI Assistant - Project Documentation

## 📋 Project Overview

**Business AI Assistant** is an intelligent chatbot platform that allows businesses to create AI-powered customer support assistants trained on their own knowledge base. Businesses can upload documents or add website URLs, and the AI will answer customer questions based on that content.

### Key Features
- 🤖 **AI-Powered Chat**: Uses OpenAI/Google Gemini to generate intelligent responses
- 📄 **Document Upload**: Support for PDF, DOCX, TXT files
- 🌐 **URL Scraping**: Automatically scrape and index website content
- 🏢 **Multi-Business Support**: Each business has isolated data and unique chat interface
- 🔄 **Auto-Refresh**: Automatically update URL content on schedule
- 🔒 **Secure**: SSRF protection, rate limiting, data isolation

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **AI Integration**: OpenAI API / Google Generative AI
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: 
  - `pdf-parse` - PDF text extraction
  - `mammoth` - DOCX text extraction
  - `multer` - File upload handling
- **Web Scraping**:
  - `axios` - HTTP client
  - `cheerio` - HTML parsing
  - `validator` - URL validation
- **Security**:
  - `helmet` - Security headers
  - `express-rate-limit` - Rate limiting
  - `express-mongo-sanitize` - NoSQL injection prevention
  - `xss-clean` - XSS protection
  - `bcrypt` - Password hashing

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Business Dashboard (React)  │  Public Chat Widget (JS)     │
│  - Upload Documents           │  - Customer Questions        │
│  - Add URLs                   │  - AI Responses              │
│  - Manage Settings            │  - Business-Specific         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Express)                     │
├─────────────────────────────────────────────────────────────┤
│  Auth Routes  │  Business Routes  │  Document Routes         │
│  Chat Routes  │  Health Routes                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  AI Service          │  Search Service    │  URL Scraper     │
│  Extraction Service  │  Auth Service                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER (MongoDB)                    │
├─────────────────────────────────────────────────────────────┤
│  Users  │  Businesses  │  Documents  │  ChatLogs  │  Members │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

### Collections

#### **1. Users**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  firstName: String,
  lastName: String,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Businesses**
```javascript
{
  _id: ObjectId,
  businessName: String,
  businessSlug: String (unique, indexed),
  industry: String,
  subscriptionStatus: String (enum: free/pro/enterprise),
  isActive: Boolean,
  chatSettings: {
    isPublic: Boolean,
    welcomeMessage: String,
    primaryColor: String
  },
  branding: {
    logoUrl: String,
    websiteUrl: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. Documents**
```javascript
{
  _id: ObjectId,
  businessId: ObjectId (indexed),
  sourceType: String (enum: file/url),
  
  // File-specific fields
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  
  // URL-specific fields
  sourceURL: String,
  urlTitle: String,
  urlDescription: String,
  lastScrapedAt: Date,
  autoRefresh: {
    enabled: Boolean,
    frequency: String (enum: daily/weekly/monthly),
    lastRefreshed: Date,
    nextRefresh: Date
  },
  
  // Common fields
  textContent: String (text indexed),
  metadata: Map,
  uploadedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - Text index on: originalName, urlTitle, urlDescription, textContent
// - Compound index on: businessId + sourceType
```

#### **4. BusinessMembers**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  businessId: ObjectId,
  role: String (enum: owner/admin/member),
  createdAt: Date
}
```

#### **5. ChatLogs**
```javascript
{
  _id: ObjectId,
  businessId: ObjectId,
  userQuestion: String,
  aiResponse: String,
  relevantDocuments: [ObjectId],
  ipAddress: String,
  cost: {
    tokens: Number,
    estimatedCostUSD: Number
  },
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new business and owner | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/me` | Get current user profile | ✅ |

**Example Request:**
```bash
POST /api/auth/register
{
  "email": "owner@business.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "Best Salon",
  "industry": "Beauty"
}
```

**Example Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "firstName": "John" },
  "business": { "id": "...", "name": "Best Salon", "slug": "best-salon" }
}
```

---

### Business (`/api/business`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:id/profile` | Get business profile | ✅ |
| PUT | `/:id/settings` | Update business settings | ✅ (Owner) |
| GET | `/public/:slug` | Get public business info | ❌ |

---

### Documents (`/api/documents`)

| Method | Endpoint | Description | Auth Required | Rate Limited |
|--------|----------|-------------|---------------|--------------|
| POST | `/upload` | Upload document (PDF/DOCX/TXT) | ✅ | ❌ |
| POST | `/add-url` | Add content from URL | ✅ | ✅ (10/hour) |
| POST | `/:id/refresh` | Refresh URL content | ✅ | ✅ (10/hour) |
| GET | `/` | List all documents | ✅ | ❌ |
| DELETE | `/:id` | Delete document | ✅ | ❌ |
| GET | `/search?q=query` | Search documents | ✅ | ❌ |

**Add URL Example:**
```bash
POST /api/documents/add-url
Authorization: Bearer <token>
{
  "url": "https://example.com/about",
  "autoRefresh": {
    "enabled": true,
    "frequency": "weekly"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "url": "https://example.com/about",
    "title": "About Us - Example Company",
    "scrapedAt": "2026-01-10T05:30:00Z",
    "autoRefresh": { "enabled": true, "frequency": "weekly" }
  }
}
```

---

### Chat (`/api/chat`)

| Method | Endpoint | Description | Auth Required | Rate Limited |
|--------|----------|-------------|---------------|--------------|
| POST | `/public/:businessSlug` | Public chat endpoint | ❌ | ✅ (20/15min) |

**Example Request:**
```bash
POST /api/chat/public/best-salon
{
  "question": "What are your opening hours?"
}
```

**Example Response:**
```json
{
  "success": true,
  "answer": "Based on our information, we are open Monday-Friday 9am-6pm...",
  "references": [
    { "filename": "hours.pdf", "score": 0.95 }
  ]
}
```

---

## 🔒 Security Measures

### 1. **Authentication & Authorization**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access**: Owner/Admin/Member permissions
- **Endpoints Protected**:
  - All `/api/documents/*` routes
  - All `/api/business/:id/*` routes
  - `/api/auth/me`

### 2. **SSRF Protection** (URL Scraper)
- **Blocked Hosts**: `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`
- **Blocked IP Ranges**:
  - `10.0.0.0/8` (Private)
  - `172.16.0.0/12` (Private)
  - `192.168.0.0/16` (Private)
  - `169.254.0.0/16` (Link-local)
  - `127.0.0.0/8` (Loopback)
- **Protocol Restriction**: Only HTTP/HTTPS allowed
- **Implemented In**: `urlScraper.service.js`

### 3. **Rate Limiting**
| Endpoint | Limit | Window |
|----------|-------|--------|
| Global API | 100 requests | 15 minutes |
| Public Chat | 20 requests | 15 minutes |
| URL Scraping | 10 requests | 1 hour |

**Implementation**: `express-rate-limit` middleware

### 4. **Input Validation & Sanitization**
- **NoSQL Injection Prevention**: `express-mongo-sanitize`
- **XSS Protection**: `xss-clean`
- **URL Validation**: `validator` library
- **File Type Validation**: MIME type checking
- **Content Size Limits**:
  - Request body: 10KB
  - File uploads: 10MB (configurable)
  - URL content: 5MB

### 5. **Data Isolation**
- **Business Scoping**: All document queries filtered by `businessId`
- **Chat Isolation**: Each business slug routes to separate data
- **Database Indexes**: Compound index on `businessId + sourceType`
- **Implemented In**: 
  - `search.service.js`
  - `chat.controller.js`
  - `document.controller.js`

### 6. **Security Headers**
- **Helmet.js**: Sets secure HTTP headers
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
  - Content-Security-Policy

### 7. **Request Timeouts & Limits**
- **URL Scraping Timeout**: 10 seconds
- **Max Content Size**: 5MB for scraped content
- **Max Redirects**: 5 for URL fetching

---

## 📊 Current Project Status

### ✅ Completed Features (Steps 1-6)

#### **Backend**
- ✅ Business slug system with unique generation
- ✅ Business-specific chat isolation
- ✅ URL scraper service with SSRF protection
- ✅ Document model supporting files and URLs
- ✅ URL management endpoints (add/refresh)
- ✅ Rate limiting for URL operations
- ✅ JWT authentication
- ✅ File upload and text extraction
- ✅ MongoDB text search integration
- ✅ AI response generation

#### **Frontend**
- ✅ User registration and login
- ✅ Business dashboard
- ✅ Document upload UI
- ✅ URL management component
- ✅ Auto-refresh configuration
- ✅ Document listing and deletion

#### **Testing**
- ✅ Business registration verification
- ✅ Chat isolation verification
- ✅ URL scraping verification
- ✅ SSRF protection verification

### 🚧 Pending Features (Steps 7-8)

- ⏳ **Step 7**: Public chat widget (embeddable JavaScript)
- ⏳ **Step 8**: API documentation (OpenAPI/Swagger, Postman collection)

### 📈 Metrics
- **Total Files Changed**: 14 files
- **Lines Added**: 1,036+ lines
- **Git Commits**: 2 commits
- **Verification Scripts**: 3 passing tests
- **API Endpoints**: 15 endpoints
- **Security Measures**: 7 layers

---

## 🎯 What Has Been Implemented

### Recent Implementation (Current Session)

#### **1. Business Slug System**
- Created `slug.js` utility for unique slug generation
- Updated `auth.controller.js` to use slugify
- Ensures URL-friendly business identifiers (e.g., "best-salon")

#### **2. Business-Specific Chat Isolation**
- Changed chat endpoint from `/api/chat/public` to `/api/chat/public/:businessSlug`
- Updated `chat.controller.js` to extract slug from URL params
- Ensured all document searches are scoped to specific business

#### **3. URL Scraper Service**
- Created comprehensive `urlScraper.service.js`
- Implemented SSRF protection (blocks private IPs, localhost)
- Added content extraction using Cheerio
- Set size limits (5MB) and timeouts (10s)

#### **4. Document Model Extension**
- Added `sourceType` field (file/url)
- Added URL-specific fields: `sourceURL`, `urlTitle`, `urlDescription`
- Implemented auto-refresh configuration
- Updated text search indexes

#### **5. URL Management Endpoints**
- Created `addFromURL` controller method
- Created `refreshURLContent` controller method
- Added rate limiting middleware (10 URLs/hour)
- Added routes in `document.routes.js`

#### **6. Frontend URL Management UI**
- Created `URLManager.jsx` React component
- Integrated into Dashboard
- Added form for URL input with auto-refresh toggle
- Implemented refresh and delete actions
- Added error handling and loading states

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key or Google Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/zerosatin121/Pam_business_AI_Front.git
cd Pam_business_AI_Front

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
```

### Running the Application

```bash
# Start backend (port 3000)
npm start

# Start frontend (port 5173)
cd frontend
npm run dev
```

### Running Tests

```bash
# Verify business registration and slug generation
node verify-business.js

# Verify chat isolation between businesses
node verify-chat-isolation.js

# Verify URL scraping and security
node verify-url-scraping.js
```

---

## 📝 License

MIT License

---

## 👥 Contributors

- AI Implementation: Antigravity (Google DeepMind)
- Original Repository: [zerosatin121/Pam_business_AI_Front](https://github.com/zerosatin121/Pam_business_AI_Front)

---

**Last Updated**: January 10, 2026
