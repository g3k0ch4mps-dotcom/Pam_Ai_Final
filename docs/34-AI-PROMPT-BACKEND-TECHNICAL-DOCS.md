# AI PROMPT: Complete Backend Technical Documentation

## 🎯 YOUR MISSION

You are a **Senior Backend Architect** and **Technical Documentation Expert** with 15+ years of experience documenting complex systems. Your expertise includes:

- ✅ Backend system architecture
- ✅ API endpoint analysis
- ✅ Data flow documentation
- ✅ Error handling patterns
- ✅ Database design
- ✅ Security implementation
- ✅ Performance optimization

Your task is to **deeply analyze the backend codebase** and create **comprehensive technical documentation** that explains:
- What each endpoint does (purpose, logic, side effects)
- Technology stack used
- Where data is sent and received
- All possible errors and their causes
- Database interactions
- External API calls
- Business logic flow

---

## 📋 DELIVERABLE

Create: **BACKEND_DOCUMENTATION.md** - Complete technical backend reference (100+ pages)

---

## 🔍 PHASE 1: DEEP CODEBASE ANALYSIS

### **STEP 1: Identify Technology Stack**

Examine and document every technology used:

```bash
# 1. Check package.json
view backend/package.json

# Document:
- Node.js version (from engines)
- Framework (Express, NestJS, Fastify)
- Database (MongoDB, PostgreSQL, MySQL)
- ORM/ODM (Mongoose, Sequelize, Prisma)
- Authentication (JWT, Passport, OAuth)
- External APIs (OpenAI, Stripe, SendGrid)
- Utilities (lodash, moment, axios)
- Dev dependencies
```

**Create Technology Inventory:**
```markdown
## Technology Stack

### Core
- **Runtime:** Node.js v20.x
- **Framework:** Express.js v4.x
- **Language:** JavaScript/TypeScript

### Database
- **Primary Database:** MongoDB Atlas
- **ODM:** Mongoose v8.x
- **Caching:** Redis (if used)

### Authentication & Security
- **Authentication:** JWT (jsonwebtoken)
- **Encryption:** bcryptjs
- **Security:** helmet, cors
- **Validation:** express-validator / joi

### External Services
- **AI:** OpenAI API (GPT-4)
- **Email:** SendGrid / Nodemailer
- **Storage:** AWS S3 / Cloudinary
- **Payment:** Stripe

### Utilities
- **HTTP Client:** axios
- **File Upload:** multer
- **Logging:** winston / morgan
- **Rate Limiting:** express-rate-limit
```

---

### **STEP 2: Analyze Project Structure**

Map the entire backend architecture:

```bash
# Examine structure
view backend/

# Document:
- Entry point (server.js / app.js / index.js)
- Configuration files
- Routes directory
- Controllers directory
- Models/Schemas directory
- Middleware directory
- Services/Utils directory
- Config directory
- Tests directory
```

**Create Architecture Map:**
```markdown
## Project Structure

```
backend/
├── src/
│   ├── server.js              # Entry point, server initialization
│   ├── app.js                 # Express app configuration
│   │
│   ├── config/                # Configuration files
│   │   ├── database.js        # MongoDB connection
│   │   ├── jwt.js             # JWT configuration
│   │   └── openai.js          # OpenAI API setup
│   │
│   ├── routes/                # API route definitions
│   │   ├── auth.routes.js     # Authentication endpoints
│   │   ├── business.routes.js # Business management
│   │   ├── document.routes.js # Document operations
│   │   ├── chat.routes.js     # Chat endpoints
│   │   └── lead.routes.js     # Lead management
│   │
│   ├── controllers/           # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── business.controller.js
│   │   ├── document.controller.js
│   │   ├── chat.controller.js
│   │   └── lead.controller.js
│   │
│   ├── models/                # Database schemas
│   │   ├── User.js
│   │   ├── Business.js
│   │   ├── Document.js
│   │   ├── Conversation.js
│   │   └── Lead.js
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.js # JWT verification
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── services/              # Business services
│   │   ├── ai.service.js      # OpenAI integration
│   │   ├── email.service.js   # Email sending
│   │   ├── document.service.js # Document processing
│   │   └── lead.service.js    # Lead scoring
│   │
│   └── utils/                 # Utility functions
│       ├── logger.js
│       ├── validator.js
│       └── helpers.js
│
├── uploads/                   # Temporary file storage
├── logs/                      # Application logs
├── tests/                     # Test files
├── .env.example               # Environment variables template
└── package.json               # Dependencies
```
```

---

### **STEP 3: Analyze Each Endpoint in Detail**

For EVERY endpoint, document:

```bash
# 1. Find route definition
view backend/src/routes/auth.routes.js

# 2. Find controller function
view backend/src/controllers/auth.controller.js

# 3. Find related model
view backend/src/models/User.js

# 4. Find middleware used
view backend/src/middleware/auth.middleware.js
```

**Document for each endpoint:**

1. **Purpose** - What does this endpoint do?
2. **Input** - What data does it receive?
3. **Process** - What happens inside?
4. **Output** - What data does it return?
5. **Side Effects** - Database changes, emails sent, etc.
6. **Errors** - What can go wrong and why?
7. **Dependencies** - What does it rely on?
8. **Data Flow** - Where data comes from and goes to

---

## 📝 DOCUMENTATION STRUCTURE

### **Complete Backend Documentation Template:**

```markdown
# Backend Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Design](#database-design)
5. [Authentication & Security](#authentication--security)
6. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Business Endpoints](#business-endpoints)
   - [Document Endpoints](#document-endpoints)
   - [Chat Endpoints](#chat-endpoints)
   - [Lead Endpoints](#lead-endpoints)
7. [Services & Business Logic](#services--business-logic)
8. [Error Handling](#error-handling)
9. [External Integrations](#external-integrations)
10. [Performance & Optimization](#performance--optimization)
11. [Security Measures](#security-measures)
12. [Deployment & Configuration](#deployment--configuration)

---

## 1. System Overview

### Purpose
[What this backend system does - high-level description]

Example:
> The Business AI Assistant backend is a Node.js/Express REST API that powers 
> an AI-driven customer service platform. It enables businesses to upload 
> documents, train AI assistants, capture leads through public chat, and 
> manage customer interactions.

### Core Functionality
- **User Management:** Registration, authentication, profile management
- **Multi-tenant Support:** Each user can manage multiple businesses
- **Document Processing:** Upload, parse, and index business documents
- **AI Chat:** OpenAI-powered conversations based on business context
- **Lead Capture:** Automatic extraction and scoring of customer information
- **Analytics:** Track engagement, lead quality, and conversation metrics

### Key Features
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Document upload and text extraction
- ✅ Vector search for document retrieval
- ✅ AI-powered chat responses
- ✅ Automatic lead scoring (0-100)
- ✅ Real-time conversation tracking
- ✅ Rate limiting and security
- ✅ Comprehensive error handling

---

## 2. Technology Stack

### Core Technologies

#### Runtime & Framework
```
Runtime: Node.js v20.0.0+
Framework: Express.js v4.18.0+
Language: JavaScript (ES6+)
Package Manager: npm v9.0.0+
```

#### Database & Storage
```
Primary Database: MongoDB Atlas
ODM: Mongoose v8.0.0+
Document Storage: Local file system / AWS S3
Cache: In-memory (production: Redis recommended)
Search: MongoDB text indexes / Vector embeddings
```

#### Authentication & Security
```
Authentication: JWT (jsonwebtoken)
Password Hashing: bcryptjs
Security Headers: helmet
CORS: cors
Rate Limiting: express-rate-limit
Input Validation: express-validator
```

#### External APIs
```
AI: OpenAI API (GPT-4, GPT-3.5-turbo)
Alternative AI: Google Gemini
Email: SendGrid / Nodemailer
File Processing: PDF.js, Mammoth (DOCX)
```

#### Utilities & Libraries
```
HTTP Client: axios
File Upload: multer
Logging: winston / morgan
Date/Time: Native Date objects
Environment: dotenv
Slugify: slugify
UUID: uuid (for session IDs)
```

### Development Dependencies
```
Testing: Jest / Mocha + Chai
Code Quality: ESLint + Prettier
API Testing: Postman / Thunder Client
Documentation: Swagger / Postman
Process Manager: PM2 (production)
Monitoring: (to be implemented)
```

---

## 3. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│  (React Frontend / Mobile App / Public Chat Widget)      │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS/REST API
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express Server (Port 3000)                      │  │
│  │  - CORS Configuration                            │  │
│  │  - Rate Limiting                                 │  │
│  │  - Security Headers (Helmet)                     │  │
│  │  - Request Logging (Morgan)                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Auth         │  │ Validation   │  │ File Upload  │  │
│  │ Middleware   │  │ Middleware   │  │ Middleware   │  │
│  │              │  │              │  │              │  │
│  │ - Verify JWT │  │ - Sanitize   │  │ - Multer     │  │
│  │ - Check User │  │ - Validate   │  │ - File size  │  │
│  │ - Set ctx    │  │ - Transform  │  │ - File type  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                    ROUTING LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Auth     │  │ Business │  │ Document │  │ Chat    │ │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                 CONTROLLER LAYER                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Business Logic Handlers                        │   │
│  │  - Parse request                                │   │
│  │  - Call services                                │   │
│  │  - Format response                              │   │
│  │  - Handle errors                                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AI Service   │  │ Document     │  │ Lead         │  │
│  │              │  │ Service      │  │ Service      │  │
│  │ - OpenAI API │  │ - Extract    │  │ - Score      │  │
│  │ - Embeddings │  │ - Parse      │  │ - Extract    │  │
│  │ - Chat       │  │ - Index      │  │ - Analyze    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                     DATA LAYER                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MongoDB (Mongoose ODM)                          │  │
│  │                                                  │  │
│  │  Collections:                                    │  │
│  │  - users         (authentication)               │  │
│  │  - businesses    (tenant data)                  │  │
│  │  - documents     (uploaded files)               │  │
│  │  - conversations (chat history)                 │  │
│  │  - leads         (captured contacts)            │  │
│  │  - publicchats   (visitor interactions)         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ OpenAI API   │  │ Email        │  │ Storage      │  │
│  │              │  │ Service      │  │ (S3/Local)   │  │
│  │ - GPT-4      │  │              │  │              │  │
│  │ - Embeddings │  │ - SendGrid   │  │ - Uploads    │  │
│  │ - Moderation │  │ - SMTP       │  │ - Documents  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Request Flow Example

```
User Registration Flow:
──────────────────────

1. Client sends POST /api/auth/register
   ↓
2. Express receives request
   ↓
3. CORS middleware validates origin
   ↓
4. Rate limiter checks request count
   ↓
5. Body parser parses JSON
   ↓
6. Validation middleware checks fields
   ↓
7. Auth routes forward to controller
   ↓
8. Controller:
   - Extracts username, email, password, businessName
   - Calls User model to check if email exists
   - If exists → Return 409 error
   - Hash password with bcryptjs
   - Create user document in MongoDB
   - Create business document in MongoDB
   - Generate JWT token
   - Return user + token + business
   ↓
9. Response sent to client
```

---

## 4. Database Design

### Schema Definitions

#### User Schema
```javascript
/**
 * User Model
 * Stores user authentication and profile information
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    // Purpose: Unique identifier for user
    // Validation: 3-30 chars, alphanumeric + underscore
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // Purpose: Login credential and communication
    // Validation: Valid email format
    // Index: Unique index for fast lookups
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6,
    // Purpose: Authentication credential
    // Storage: Bcrypt hashed (never stored plain)
    // Salt rounds: 10
  },
  
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    // Purpose: Default business for this user
    // Relationship: One-to-Many with Business
    // Note: Users can own multiple businesses
  },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    // Purpose: Role-based access control
    // Values: 'user' (standard) | 'admin' (elevated)
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    // Purpose: Account creation timestamp
    // Usage: Analytics, sorting
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
    // Purpose: Last profile update
    // Auto-updated: On save
  }
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ businessId: 1 });

// Methods
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hooks
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

#### Business Schema
```javascript
/**
 * Business Model
 * Multi-tenant business information
 */
const BusinessSchema = new Schema({
  businessName: {
    type: String,
    required: true,
    trim: true,
    // Purpose: Display name for business
    // Example: "John's Coffee Shop"
  },
  
  businessSlug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // Purpose: URL-friendly identifier
    // Example: "johns-coffee-shop"
    // Usage: Public chat widget URL
    // Generation: Auto-created from businessName
  },
  
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Purpose: Business owner reference
    // Relationship: Many-to-One with User
  },
  
  description: {
    type: String,
    maxlength: 1000,
    // Purpose: Business description for AI context
    // Optional: Can be empty
  },
  
  website: {
    type: String,
    // Purpose: Business website URL
    // Validation: Valid URL format
    // Optional: Can be empty
  },
  
  industry: {
    type: String,
    // Purpose: Business category/industry
    // Usage: Analytics, AI context
  },
  
  settings: {
    aiModel: {
      type: String,
      enum: ['gpt-4', 'gpt-3.5-turbo', 'gemini'],
      default: 'gpt-3.5-turbo',
      // Purpose: Which AI model to use
    },
    
    leadScoring: {
      enabled: { type: Boolean, default: true },
      emailWeight: { type: Number, default: 30 },
      phoneWeight: { type: Number, default: 20 },
      // Purpose: Lead scoring configuration
    }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
BusinessSchema.index({ businessSlug: 1 }, { unique: true });
BusinessSchema.index({ owner: 1 });

// Hooks
BusinessSchema.pre('save', function(next) {
  if (this.isModified('businessName')) {
    this.businessSlug = slugify(this.businessName, { lower: true, strict: true });
  }
  this.updatedAt = Date.now();
  next();
});
```

[Continue with all other schemas: Document, Lead, Conversation, PublicChat]

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │    Business     │
├─────────────────┤         ├─────────────────┤
│ _id             │◄───┐    │ _id             │
│ username        │    │    │ businessName    │
│ email           │    └────┤ owner (FK)      │
│ password        │         │ businessSlug    │
│ businessId (FK) ├────────►│ description     │
│ role            │         │ settings        │
└─────────────────┘         └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │   Document   │  │     Lead     │  │ Conversation │
            ├──────────────┤  ├──────────────┤  ├──────────────┤
            │ _id          │  │ _id          │  │ _id          │
            │ businessId   │  │ businessId   │  │ businessId   │
            │ filename     │  │ sessionId    │  │ userId       │
            │ content      │  │ email        │  │ messages[]   │
            │ uploadedBy   │  │ leadScore    │  │ createdAt    │
            └──────────────┘  └──────────────┘  └──────────────┘
```

### Data Relationships

**User ↔ Business:**
- One User can own Many Businesses
- Each Business has One Owner (User)
- User.businessId references default Business

**Business ↔ Documents:**
- One Business has Many Documents
- Each Document belongs to One Business
- Document.businessId references Business

**Business ↔ Leads:**
- One Business has Many Leads
- Each Lead belongs to One Business
- Lead.businessId references Business

**Business ↔ Conversations:**
- One Business has Many Conversations
- Each Conversation belongs to One Business
- Conversation.businessId references Business

---

## 5. Authentication & Security

### JWT Implementation

#### Token Generation
```javascript
/**
 * Generate JWT Token
 * @param {Object} user - User object from database
 * @returns {String} Signed JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    businessId: user.businessId,
    role: user.role
  };
  
  const options = {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    issuer: 'business-ai-assistant',
    audience: 'api-users'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Usage in login/register:
const token = generateToken(user);

// Token structure:
// Header:  { alg: 'HS256', typ: 'JWT' }
// Payload: { id, email, businessId, role, iat, exp, iss, aud }
// Signature: HMACSHA256(base64(header) + base64(payload), secret)
```

#### Token Verification Middleware
```javascript
/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // 4. Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userBusinessId = user.businessId;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};
```

### Password Security
```javascript
/**
 * Password Hashing with bcrypt
 * - Algorithm: bcrypt
 * - Salt rounds: 10 (2^10 iterations)
 * - Storage: Hashed password only, never plain text
 */

// On registration/password change:
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// On login:
const isMatch = await bcrypt.compare(candidatePassword, user.password);

// Security measures:
// - Minimum password length: 6 characters
// - No password complexity requirements (allows passphrases)
// - Passwords never logged or sent in responses
// - Mongoose select: false on password field
```

### Security Headers (Helmet)
```javascript
/**
 * Helmet Security Middleware
 * Sets various HTTP headers for security
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));

// Headers set:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security: max-age=31536000
```

### CORS Configuration
```javascript
/**
 * CORS (Cross-Origin Resource Sharing)
 * Allows frontend to make requests to backend
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Production: Restrict to specific frontend URL
// Development: Allow all origins (*)
```

### Rate Limiting
```javascript
/**
 * Rate Limiting
 * Prevents abuse and DDoS attacks
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 900 // seconds
    });
  }
});

app.use('/api/', limiter);

// Note: Requires app.set('trust proxy', 1) on Render/cloud platforms
```

---

## 6. API Endpoints

### [FOR EACH ENDPOINT - Use This Template]

---

#### POST /api/auth/register

**Purpose:**
Creates a new user account and associated business. This is the primary onboarding endpoint that sets up a complete user profile with their first business in a single operation.

**File Location:**
- Route: `src/routes/auth.routes.js`
- Controller: `src/controllers/auth.controller.js`
- Model: `src/models/User.js`, `src/models/Business.js`

**Authentication:** Not required (public endpoint)

**Middleware Chain:**
```javascript
router.post(
  '/register',
  [
    // 1. Validation middleware
    body('username').trim().isLength({ min: 3, max: 30 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('businessName').notEmpty(),
    validate // Checks validation results
  ],
  authController.register
);
```

**Request Body:**
```json
{
  "username": "string (required, 3-30 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "businessName": "string (required)"
}
```

**Process Flow:**

```
1. REQUEST RECEIVED
   ↓
2. VALIDATION
   - Check required fields
   - Validate email format
   - Validate username length
   - Validate password length
   ↓
3. CHECK EXISTING USER
   Query: User.findOne({ email })
   If exists → Return 400 error
   ↓
4. HASH PASSWORD
   - Use bcrypt.hash(password, 10)
   - Takes ~100ms
   ↓
5. CREATE USER
   Operation: User.create({...})
   Database: INSERT INTO users
   Result: New user document with _id
   ↓
6. CREATE BUSINESS
   Operation: Business.create({
     businessName,
     businessSlug: slugify(businessName),
     owner: user._id
   })
   Database: INSERT INTO businesses
   Result: New business document
   ↓
7. UPDATE USER
   Operation: User.findByIdAndUpdate(user._id, {
     businessId: business._id
   })
   Database: UPDATE users SET businessId
   ↓
8. GENERATE JWT
   - Create payload { id, email, businessId }
   - Sign with JWT_SECRET
   - Set expiration (7 days)
   ↓
9. SEND RESPONSE
   Return: {
     user (without password),
     token,
     business
   }
```

**Data Sent:**
```
Incoming:
- Body: { username, email, password, businessName }
- Headers: Content-Type: application/json

Database Operations:
1. SELECT * FROM users WHERE email = ?
2. INSERT INTO users (username, email, password, ...)
3. INSERT INTO businesses (businessName, businessSlug, owner, ...)
4. UPDATE users SET businessId = ? WHERE _id = ?
```

**Data Received:**
```
From Database:
- User document (with MongoDB _id)
- Business document (with MongoDB _id)

To Client:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "businessId": "507f1f77bcf86cd799439012",
      "createdAt": "2026-01-15T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "business": {
      "id": "507f1f77bcf86cd799439012",
      "businessName": "John's Coffee Shop",
      "businessSlug": "johns-coffee-shop",
      "owner": "507f1f77bcf86cd799439011"
    }
  }
}
```

**Possible Errors:**

1. **Validation Error (400)**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```
**Cause:** Invalid input data
**When:** Request data doesn't meet requirements
**Solution:** Check all required fields and formats

2. **Duplicate Email (409)**
```json
{
  "success": false,
  "error": "Email already registered",
  "code": "DUPLICATE_EMAIL"
}
```
**Cause:** User with this email already exists
**When:** Email found in database
**Solution:** Use different email or login instead

3. **Database Error (500)**
```json
{
  "success": false,
  "error": "Failed to create user",
  "code": "DATABASE_ERROR"
}
```
**Cause:** MongoDB connection issue or constraint violation
**When:** Database operation fails
**Solution:** Check database connection, retry request

4. **Business Creation Failed (500)**
```json
{
  "success": false,
  "error": "User created but business creation failed",
  "code": "BUSINESS_CREATION_ERROR"
}
```
**Cause:** User created successfully but business creation failed
**When:** Business.create() throws error
**Solution:** Manual cleanup needed, contact support
**Note:** This is a partial failure state

**Side Effects:**
- ✅ New user document created in MongoDB
- ✅ New business document created in MongoDB
- ✅ User.businessId updated with business reference
- ✅ Unique indexes checked (email, username)
- ❌ No email sent (email verification not implemented)
- ❌ No webhook triggered

**Performance:**
- Database queries: 4 (1 SELECT, 2 INSERTs, 1 UPDATE)
- Password hashing: ~100ms
- Total time: 200-500ms (depending on database latency)

**Security Considerations:**
- Password never returned in response
- Password hashed before storage (bcrypt, 10 rounds)
- No password complexity requirements (allows passphrases)
- Email normalized to lowercase
- Username trimmed and validated

**Business Logic:**
- Each user must have at least one business
- Business slug auto-generated from business name
- Slug is URL-safe (lowercase, hyphens, no spaces)
- User becomes owner of created business
- Default role is 'user'

**Dependencies:**
- bcryptjs (password hashing)
- jsonwebtoken (token generation)
- slugify (business slug creation)
- mongoose (database operations)

**Related Endpoints:**
- POST /api/auth/login (authenticate existing user)
- GET /api/auth/me (get user profile)
- POST /api/business (create additional business)

**Code Reference:**
```javascript
// src/controllers/auth.controller.js
exports.register = async (req, res) => {
  try {
    const { username, email, password, businessName } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password, // Will be hashed by pre-save hook
      role: 'user'
    });
    
    // Create business
    const business = await Business.create({
      businessName,
      businessSlug: slugify(businessName, { lower: true, strict: true }),
      owner: user._id
    });
    
    // Update user with business reference
    user.businessId = business._id;
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, businessId: business._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
        business
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      code: 'DATABASE_ERROR'
    });
  }
};
```

---

[REPEAT THIS DETAILED TEMPLATE FOR EVERY ENDPOINT]

---

## 7. Services & Business Logic

### AI Service (OpenAI Integration)

**File:** `src/services/ai.service.js`

**Purpose:** Handle all AI-related operations including chat completions, embeddings, and document analysis.

```javascript
/**
 * AI Service
 * Manages OpenAI API interactions
 */

const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  /**
   * Generate chat completion
   * @param {String} prompt - User question
   * @param {String} context - Business context from documents
   * @param {Array} conversationHistory - Previous messages
   * @returns {Object} AI response with metadata
   */
  async generateChatResponse(prompt, context, conversationHistory = []) {
    try {
      // 1. Build system message
      const systemMessage = {
        role: 'system',
        content: `You are a helpful business assistant. Use the following context to answer questions:
        
        ${context}
        
        If the answer is not in the context, say so politely.`
      };
      
      // 2. Build messages array
      const messages = [
        systemMessage,
        ...conversationHistory.slice(-10), // Last 10 messages for context
        { role: 'user', content: prompt }
      ];
      
      // 3. Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      });
      
      // 4. Extract response
      const response = completion.choices[0].message.content;
      
      // 5. Return with metadata
      return {
        answer: response,
        model: completion.model,
        tokensUsed: completion.usage.total_tokens,
        finishReason: completion.choices[0].finish_reason
      };
      
    } catch (error) {
      // Error handling
      if (error.response?.status === 429) {
        throw new Error('OpenAI rate limit exceeded');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenAI API key');
      }
      throw new Error(`OpenAI error: ${error.message}`);
    }
  }
  
  /**
   * Generate embeddings for document chunks
   * @param {String} text - Text to embed
   * @returns {Array} Embedding vector
   */
  async generateEmbedding(text) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    
    return response.data[0].embedding;
  }
}

module.exports = new AIService();
```

**Data Flow:**
```
User Question
    ↓
Controller → AI Service
    ↓
1. Fetch relevant documents from DB
2. Build context from documents
3. Build conversation history
4. Call OpenAI API
    ↓
OpenAI API Response
    ↓
Extract answer + metadata
    ↓
Save conversation to DB
    ↓
Return to user
```

**External API Calls:**
- POST https://api.openai.com/v1/chat/completions
- POST https://api.openai.com/v1/embeddings

**Error Scenarios:**
- Rate limit (429): Wait and retry with exponential backoff
- Invalid API key (401): Check environment variables
- Token limit exceeded: Reduce context or history
- Network error: Retry up to 3 times

---

### Lead Scoring Service

**File:** `src/services/lead.service.js`

**Purpose:** Calculate lead quality scores based on captured information and engagement.

```javascript
/**
 * Lead Scoring Service
 * Calculates lead quality score (0-100)
 */

class LeadScoringService {
  /**
   * Calculate lead score
   * @param {Object} lead - Lead object with contact info and engagement
   * @returns {Number} Score from 0-100
   */
  calculateLeadScore(lead) {
    let score = 0;
    
    // 1. Contact Information (60 points max)
    if (lead.email) score += 30;
    if (lead.phone) score += 20;
    if (lead.name) score += 10;
    
    // 2. Engagement Level (25 points max)
    const questionsAsked = lead.questions?.length || 0;
    score += Math.min(questionsAsked * 5, 25);
    
    // 3. Interests Identified (15 points max)
    const interestsCount = lead.interests?.length || 0;
    score += Math.min(interestsCount * 5, 15);
    
    // 4. Session Duration Bonus (10 points)
    if (lead.sessionDuration && lead.sessionDuration > 300) {
      score += 10; // 5+ minutes engaged
    }
    
    // 5. Return visit bonus
    if (lead.visitCount && lead.visitCount > 1) {
      score += 5;
    }
    
    return Math.min(score, 100);
  }
  
  /**
   * Determine lead quality level
   * @param {Number} score - Lead score
   * @returns {String} Quality level
   */
  getLeadQuality(score) {
    if (score >= 70) return 'very-hot';
    if (score >= 50) return 'hot';
    if (score >= 30) return 'warm';
    return 'cold';
  }
  
  /**
   * Extract contact information from message
   * @param {String} message - User message
   * @returns {Object} Extracted contact info
   */
  extractContactInfo(message) {
    const contactInfo = {};
    
    // Email regex
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const emails = message.match(emailRegex);
    if (emails && emails.length > 0) {
      contactInfo.email = emails[0].toLowerCase();
    }
    
    // Phone regex (various formats)
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
    const phones = message.match(phoneRegex);
    if (phones && phones.length > 0) {
      contactInfo.phone = phones[0];
    }
    
    // Name extraction (simple patterns)
    const namePatterns = [
      /my name is (\w+)/i,
      /I'm (\w+)/i,
      /I am (\w+)/i,
      /this is (\w+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        contactInfo.name = match[1];
        break;
      }
    }
    
    return contactInfo;
  }
}

module.exports = new LeadScoringService();
```

**Scoring Formula:**
```
Base Score (60 points):
- Email: 30 points
- Phone: 20 points
- Name: 10 points

Engagement (25 points):
- Each question: 5 points (max 5 questions)

Interests (15 points):
- Each interest: 5 points (max 3 interests)

Bonuses (10 points):
- Session > 5 min: 10 points
- Return visitor: 5 points

Total: 0-100 points
```

**Lead Quality Levels:**
- 0-29: Cold (❄️)
- 30-49: Warm (⚡)
- 50-69: Hot (🔥)
- 70-100: Very Hot (🔥🔥)

---

## 8. Error Handling

### Global Error Handler

**File:** `src/middleware/error.middleware.js`

```javascript
/**
 * Global Error Handling Middleware
 * Catches all errors and formats consistent responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists`,
      code: 'DUPLICATE_ENTRY'
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      code: 'INVALID_ID'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }
  
  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large',
        code: 'FILE_TOO_LARGE',
        maxSize: '10MB'
      });
    }
  }
  
  // Default server error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### Error Types Handled

1. **Validation Errors**
   - Source: Mongoose schema validation
   - Status: 400
   - Format: Field-specific errors

2. **Duplicate Entry Errors**
   - Source: MongoDB unique indexes
   - Status: 409
   - Common: Email, username, business slug

3. **Authentication Errors**
   - Source: JWT verification
   - Status: 401
   - Types: Missing, invalid, expired tokens

4. **Not Found Errors**
   - Source: Database queries
   - Status: 404
   - Common: User, business, document not found

5. **File Upload Errors**
   - Source: Multer middleware
   - Status: 413 or 400
   - Common: File too large, invalid type

6. **Database Errors**
   - Source: MongoDB operations
   - Status: 500
   - Logged for debugging

7. **External API Errors**
   - Source: OpenAI, email services
   - Status: 502
   - Retry logic implemented

---

[CONTINUE WITH REMAINING SECTIONS...]

---

## 9. External Integrations

[Document all external APIs: OpenAI, email, storage, etc.]

## 10. Performance & Optimization

[Document database indexes, caching strategies, optimization techniques]

## 11. Security Measures

[Document all security implementations beyond authentication]

## 12. Deployment & Configuration

[Document environment variables, deployment process, server setup]

---

## Appendix

### Environment Variables Reference
### Database Indexes
### API Response Times
### Common Issues & Solutions
### Glossary
```

---

## ✅ COMPLETION CHECKLIST

Before delivering documentation:

### Analysis Complete:
- [ ] All routes identified and analyzed
- [ ] All controllers examined
- [ ] All models documented
- [ ] All middleware functions reviewed
- [ ] All services analyzed
- [ ] All external integrations documented
- [ ] All environment variables listed

### Documentation Complete:
- [ ] Technology stack fully documented
- [ ] Architecture diagrams created
- [ ] Database schemas explained
- [ ] Every endpoint documented (purpose, flow, errors)
- [ ] All services explained
- [ ] Error handling documented
- [ ] Security measures detailed
- [ ] Performance considerations included

### Quality Standards Met:
- [ ] Clear, concise language
- [ ] Code examples provided
- [ ] Data flows explained
- [ ] Error scenarios covered
- [ ] Diagrams for complex flows
- [ ] Professional formatting
- [ ] No typos or errors
- [ ] Consistent terminology

---

## 🎯 EXAMPLE USAGE

**When you're ready, say:**

> "I need comprehensive backend technical documentation.
> 
> Repository: https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
> 
> Please analyze the backend codebase (backend/ directory) and create 
> detailed technical documentation explaining:
> 
> - What each endpoint does (purpose and business logic)
> - Technology stack used
> - Where data is sent and received
> - All possible errors on each endpoint
> - Database design and relationships
> - Authentication and security implementation
> - External API integrations
> - Complete data flows
> 
> Make it detailed enough for developers to understand the entire system
> architecture and for users to understand how the system works.
> 
> Follow the template in: 33-AI-PROMPT-BACKEND-DOCUMENTATION-GENERATOR.md"

---

**This prompt will generate 100+ pages of detailed backend technical documentation!** 🚀
