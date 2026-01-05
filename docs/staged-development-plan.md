# Business AI Assistant - Staged Development Plan

> **Purpose:** Step-by-step implementation guide for building the complete system  
> **Approach:** One feature at a time, fully tested and documented before moving forward  
> **Target:** AI-assisted development with Claude or similar coding assistant

---

## 🎯 Development Philosophy

**Build → Document → Test → Commit → Next**

Each stage MUST be:
1. ✅ Fully functional
2. ✅ Well-commented
3. ✅ Documented (API docs)
4. ✅ Tested (manual with Postman)
5. ✅ Committed to Git

**Never move to the next stage until the current stage is complete!**

---

## 📊 System Architecture Overview

```
Stage 1: Foundation (Project Setup)
Stage 2: Database Setup (MongoDB + ChromaDB)
Stage 3: Authentication System
Stage 4: Business Management
Stage 5: Document Processing Pipeline
Stage 6: Public Chat (RAG System)
Stage 7: Team Management
Stage 8: Analytics
Stage 9: Security Hardening
Stage 10: Deployment
```

**Estimated Timeline:**2 weeks (part-time)

---

## 🏗️ Stage-by-Stage Implementation Plan

---

## **STAGE 1: Foundation - Project Setup**

### Objective
Set up the basic Node.js + Express project with proper structure and essential middleware.

### Deliverables
- ✅ Project structure created
- ✅ All dependencies installed
- ✅ Environment configuration
- ✅ Basic server running
- ✅ Health check endpoint working

### Files to Create
```
business-ai-assistant/
├── src/
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Prompt for AI

```
I'm building a Business AI Assistant API using Node.js + Express + MongoDB + ChromaDB + OpenAI.

STAGE 1: PROJECT SETUP

Create the initial project structure with these requirements:

1. Initialize package.json with these dependencies:
   - express, dotenv, cors
   - mongoose, chromadb, openai
   - jsonwebtoken, bcrypt
   - helmet, express-rate-limit, express-mongo-sanitize, express-validator, xss-clean
   - multer, pdf-parse, mammoth, csv-parser
   - winston (for logging)
   - nodemon (dev dependency)

2. Create src/server.js with:
   - Express app initialization
   - Body parsing middleware
   - CORS setup (allow all origins for now, we'll restrict later)
   - Basic error handling
   - Server listening on PORT from .env (default 3000)
   - Graceful shutdown handlers

3. Create .env.example with all required environment variables:
   - NODE_ENV, PORT, API_URL
   - MONGODB_URI, JWT_SECRET, JWT_EXPIRE
   - OPENAI_API_KEY
   - MAX_FILE_SIZE, UPLOAD_PATH
   - RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS
   - ALLOWED_ORIGINS, CHROMA_PATH
   - LOG_LEVEL

4. Create .gitignore with:
   - node_modules/, .env, logs/, uploads/, chroma_data/
   - OS files, IDE files

5. Create src/routes/health.routes.js with a basic health check endpoint:
   - GET /api/health
   - Returns: { status: "ok", timestamp, uptime }
   - No authentication required

6. Create basic folder structure (empty folders for now)

7. Add detailed comments explaining:
   - Purpose of each file
   - Why each dependency is needed
   - How the server initialization works

IMPORTANT:
- Use ES6+ syntax (async/await, const/let)
- Add JSDoc comments to all functions
- Follow Node.js best practices
- Make code production-ready from the start

Provide the complete code for all files.
```

### Testing Checklist
- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts server
- [ ] Server runs on http://localhost:3000
- [ ] Health check responds: `GET http://localhost:3000/api/health`
- [ ] No errors in console

### Documentation
Create `docs/01-foundation.md` explaining:
- Project structure
- How to run the project
- Environment variables

---

## **STAGE 2: Database Setup**

### Objective
Set up MongoDB connection and ChromaDB initialization with proper error handling.

### Deliverables
- ✅ MongoDB connected
- ✅ ChromaDB initialized
- ✅ Connection error handling
- ✅ Health check updated with database status

### Prompt for AI

```
STAGE 2: DATABASE SETUP

Context: I have a working Express server. Now I need to connect to MongoDB and initialize ChromaDB.

Requirements:

1. Create src/config/database.js:
   - Export connectDatabase() function
   - Connect to MongoDB using mongoose
   - Connection options: useNewUrlParser, useUnifiedTopology
   - Handle connection events (connected, error, disconnected)
   - Implement retry logic (3 attempts)
   - Use winston logger for all logs
   - Add detailed comments

2. Create src/config/chromadb.js:
   - Export initializeChromaDB() function
   - Initialize ChromaClient
   - Verify connection with heartbeat()
   - Handle initialization errors
   - Store client instance for reuse
   - Add detailed comments

3. Create src/utils/logger.js:
   - Configure winston logger
   - Log to console (development) and files (production)
   - Log levels: error, warn, info, debug
   - Separate error.log and combined.log
   - Timestamp and JSON format
   - Add comments explaining configuration

4. Update src/server.js:
   - Import and call connectDatabase() before starting server
   - Import and call initializeChromaDB() after MongoDB connects
   - Handle startup errors gracefully
   - Don't start server if databases fail to connect

5. Update src/routes/health.routes.js:
   - Add database status checks
   - Check MongoDB connection state
   - Check ChromaDB with heartbeat
   - Return service status for each:
     {
       status: "ok" | "degraded" | "error",
       services: {
         api: "operational",
         mongodb: "connected" | "disconnected",
         chromadb: "connected" | "error"
       }
     }

Error Handling Requirements:
- Use try-catch blocks everywhere
- Log all errors with context
- Return meaningful error messages
- Exit process on critical database failures

Testing:
- Server should start successfully
- Health check should show all services connected
- Logs should show successful connections

Provide complete, production-ready code with extensive comments.
```

### Testing Checklist
- [ ] Server connects to MongoDB on startup
- [ ] ChromaDB initializes successfully
- [ ] Health check shows database status
- [ ] Logs show connection messages
- [ ] Handles connection failures gracefully

### Documentation
Create `docs/02-database-setup.md` explaining:
- How MongoDB connection works
- How ChromaDB is initialized
- What to do if connection fails

---

## **STAGE 3: Authentication System**

### Objective
Build complete authentication system with registration, login, and JWT tokens.

### Deliverables
- ✅ User model
- ✅ Business model
- ✅ BusinessMember model
- ✅ Registration endpoint
- ✅ Login endpoint
- ✅ JWT service
- ✅ Auth middleware

### Prompt for AI

```
STAGE 3: AUTHENTICATION SYSTEM

Context: Databases are connected. Now build the authentication system.

Requirements:

1. Create src/models/User.js (Mongoose schema):
   - Fields: email (unique), password (hashed), fullName, phone, avatar
   - Fields: isActive, emailVerified, createdAt, lastLogin
   - Pre-save hook to hash password with bcrypt (12 salt rounds)
   - Method: comparePassword(plainPassword) - returns boolean
   - Indexes: email (unique)
   - Virtual: id (return _id as string)
   - Don't return password in JSON
   - Add extensive field comments

2. Create src/models/Business.js:
   - Fields: businessName (unique), businessSlug (unique, generated)
   - Fields: businessType, industry, description
   - Fields: phone, email, website, address (object)
   - Fields: logo, primaryColor
   - Fields: chatSettings (welcomeMessage, isPublic, rateLimitPerIP, showSources)
   - Fields: createdBy (ref User), chromaCollectionId, isActive
   - Fields: stats (totalDocuments, totalChats, totalTeamMembers)
   - Pre-save hook: generate slug from businessName
   - Indexes: businessSlug, businessName, createdBy
   - Add detailed comments

3. Create src/models/BusinessMember.js:
   - Fields: userId (ref User), businessId (ref Business)
   - Fields: role (enum: owner, admin, manager, staff)
   - Fields: permissions (object with boolean flags)
   - Fields: status (enum: active, invited, suspended)
   - Fields: invitedBy, invitedAt, joinedAt
   - Compound unique index: { userId: 1, businessId: 1 }
   - Add comments explaining the relationship

4. Create src/services/jwt.service.js:
   - generateToken(userId, businessId, role, permissions) - returns JWT string
   - verifyToken(token) - returns decoded payload or throws error
   - Token includes: userId, businessId, role, permissions, iat, exp
   - Use JWT_SECRET and JWT_EXPIRE from env
   - Handle TokenExpiredError and JsonWebTokenError
   - Add JSDoc comments

5. Create src/services/auth.service.js:
   - hashPassword(plainPassword) - bcrypt hash with 12 rounds
   - comparePassword(plain, hashed) - compare passwords
   - validatePasswordStrength(password) - return { isValid, errors[] }
   - Requirements: min 8 chars, uppercase, lowercase, number
   - Add comments on security best practices

6. Create src/middleware/auth.js:
   - authenticateToken(req, res, next) middleware
   - Extract token from Authorization: Bearer header
   - Verify JWT token
   - Attach decoded data to req.user
   - Handle missing token (401)
   - Handle invalid token (403)
   - Add detailed comments

7. Create src/controllers/business.controller.js:
   - registerBusiness(req, res, next) controller
   - Validate input (email, password, fullName, businessName)
   - Check if email exists
   - Create user with hashed password
   - Create business with generated slug
   - Create businessMember with role "owner" and all permissions
   - Create ChromaDB collection for business
   - Generate JWT token
   - Return user, business, and token
   - Handle all errors with try-catch
   - Add extensive comments explaining each step

   - loginBusiness(req, res, next) controller
   - Validate email and password
   - Find user by email
   - Compare password
   - Find all businesses user belongs to
   - Return user, businesses array, and token
   - Handle invalid credentials (401)
   - Add comments

8. Create src/routes/business.routes.js:
   - POST /api/business/register
   - POST /api/business/login
   - Both use express-validator for input validation
   - Include validation middleware
   - Use asyncHandler wrapper for error handling
   - Add route comments

9. Create src/middleware/validation.js:
   - validateRegister array (email, password, fullName, businessName)
   - validateLogin array (email, password)
   - checkValidation middleware (checks validationResult)
   - Return 400 with formatted errors
   - Add comments

10. Create src/utils/errors.js:
    - Custom error classes: AppError, ValidationError, AuthenticationError
    - Each with appropriate statusCode and message
    - Add comments

11. Create src/middleware/errorHandler.js:
    - Global error handler middleware
    - Log errors with winston
    - Format error response
    - Hide stack traces in production
    - Add comments

12. Update src/server.js:
    - Import and use business routes
    - Add error handler middleware (must be last)
    - Add comments

Security Requirements:
- Never log passwords
- Always hash passwords before storing
- Validate all inputs
- Use secure JWT secret (min 32 chars)
- Token expires in 7 days

Response Format:
Success: { success: true, data: {}, message: "" }
Error: { success: false, error: { code: "", message: "" } }

Provide complete code with extensive comments and JSDoc.
```

### Testing Checklist
- [ ] Register new business succeeds
- [ ] Registration creates user, business, businessMember, ChromaDB collection
- [ ] Registration returns valid JWT token
- [ ] Can't register with same email twice (409 error)
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password fails (401)
- [ ] Login with non-existent email fails (401)
- [ ] Token includes correct user and business data
- [ ] Password is hashed in database (not plain text)

### Testing with Postman
```javascript
// Test 1: Register Business
POST http://localhost:3000/api/business/register
Content-Type: application/json

{
  "email": "owner@luxurysalon.com",
  "password": "SecurePass123!",
  "fullName": "Sarah Johnson",
  "businessName": "Luxury Salon"
}

// Expected: 201, returns user, business, token

// Test 2: Login
POST http://localhost:3000/api/business/login
Content-Type: application/json

{
  "email": "owner@luxurysalon.com",
  "password": "SecurePass123!"
}

// Expected: 200, returns user, businesses[], token
```

### Documentation
Create `docs/03-authentication.md`:
- How registration works
- How login works
- JWT token structure
- Password requirements
- Error codes

---

## **STAGE 4: Business Management**

### Objective
Build endpoints for managing business settings and information.

### Deliverables
- ✅ Get business info (public)
- ✅ Update business settings
- ✅ Permission middleware

### Prompt for AI

```
STAGE 4: BUSINESS MANAGEMENT

Context: Authentication is working. Now build business management endpoints.

Requirements:

1. Create src/middleware/permissions.js:
   - requirePermission(permissionName) - returns middleware
   - checkBusinessAccess(req, res, next) - verifies user is business member
   - Attach businessMembership to req
   - Return 403 if no access
   - Add detailed comments

2. Create src/controllers/publicChat.controller.js:
   - getBusinessInfo(req, res, next) - PUBLIC endpoint
   - Get business by slug from params
   - Return business info without sensitive data
   - Check if business.isActive and chatSettings.isPublic
   - Return 404 if not found or not public
   - Add comments

3. Update src/controllers/business.controller.js:
   - updateBusinessSettings(req, res, next)
   - Requires authentication
   - Requires permission: canManageSettings
   - Update chatSettings, logo, primaryColor
   - Validate inputs
   - Return updated business
   - Add comments

4. Create src/routes/public.routes.js:
   - GET /api/public/:businessSlug
   - No authentication required
   - Add comments

5. Update src/routes/business.routes.js:
   - PATCH /api/business/:businessId/settings
   - Requires authenticateToken
   - Requires checkBusinessAccess
   - Requires requirePermission('canManageSettings')
   - Add comments

6. Update src/server.js:
   - Import and use public routes
   - Mount at /api/public
   - Add comments

Testing:
- GET public business info (no auth)
- Update business settings (with auth and permission)
- Try to update without permission (should fail 403)

Provide complete code with extensive comments.
```

### Testing Checklist
- [ ] Can get business info without authentication
- [ ] Returns 404 for non-existent business
- [ ] Can update settings with correct permission
- [ ] Can't update without authentication (401)
- [ ] Can't update without permission (403)

---

## **STAGE 5: Document Processing Pipeline**

### Objective
Build complete document upload and processing system with embeddings.

### Deliverables
- ✅ Document model
- ✅ File upload middleware
- ✅ Text extraction services
- ✅ OpenAI embedding service
- ✅ ChromaDB storage service
- ✅ Upload endpoint
- ✅ List/delete endpoints

### Prompt for AI

```
STAGE 5: DOCUMENT PROCESSING PIPELINE

Context: Business management works. Now build the document processing system.

This is the most complex stage - the core of the RAG system.

Requirements:

1. Create src/models/Document.js:
   - Fields: businessId, filename, originalName, fileType, fileSize
   - Fields: chromaCollectionId, chromaIds[], chunkCount
   - Fields: textLength, status (processing, completed, failed)
   - Fields: uploadedBy, uploadedAt, processingError
   - Index: businessId
   - Add detailed comments

2. Create src/middleware/fileUpload.js:
   - Configure multer with diskStorage
   - Destination: uploads/
   - Filename: timestamp + random + extension
   - File size limit: 10MB
   - File filter: PDF, TXT, DOCX, CSV, JSON, MD only
   - Validate MIME type matches extension
   - handleUploadError middleware for multer errors
   - Add extensive comments on security

3. Create src/services/textExtractor.service.js:
   - extractText(filePath, mimeType) - returns text string
   - extractTextFromPDF(filePath) - uses pdf-parse
   - extractTextFromDOCX(filePath) - uses mammoth
   - extractTextFromPlainFile(filePath) - uses fs.readFileSync
   - Handle all extraction errors
   - Add comments for each file type

4. Create src/services/embedding.service.js:
   - createEmbedding(text) - returns embedding array
   - Uses OpenAI text-embedding-3-small
   - Truncate text if too long (max 8000 chars)
   - Handle OpenAI errors (quota, rate limit, etc.)
   - Add detailed comments

5. Create src/services/vector.service.js:
   - storeInChromaDB(businessId, documentId, text, embedding, metadata)
   - Get or create collection: business_{businessId}
   - Add document with embedding
   - Return success
   - Handle ChromaDB errors
   - Add comments

   - removeFromChromaDB(businessId, documentIds[])
   - Get collection
   - Delete by IDs
   - Handle errors
   - Add comments

   - searchChromaDB(businessId, queryEmbedding, nResults)
   - Get collection
   - Query with embedding
   - Return results
   - Add comments

6. Create src/services/documentProcessor.service.js:
   - processDocument(businessId, userId, fileInfo) - MAIN FUNCTION
   - Step 1: Extract text
   - Step 2: Create embedding
   - Step 3: Store in ChromaDB
   - Step 4: Create Document in MongoDB
   - Step 5: Delete temp file
   - Handle errors at each step with rollback
   - Add extensive comments explaining the pipeline
   - This is critical - needs detailed error handling

7. Create src/controllers/document.controller.js:
   - uploadDocument(req, res, next)
   - Verify business exists
   - Verify user has permission
   - Get uploaded file from req.file
   - Call processDocument service
   - Return document info
   - Handle all errors
   - Add extensive comments

   - listDocuments(req, res, next)
   - Get all documents for business
   - Filter by businessId
   - Return array
   - Add comments

   - deleteDocument(req, res, next)
   - Verify permission
   - Get document
   - Delete from ChromaDB
   - Delete from MongoDB
   - Return success
   - Add comments

8. Create src/routes/document.routes.js:
   - POST /business/:businessId/documents/upload
   - Middleware: auth, businessAccess, permission, upload.single('file'), handleUploadError
   - GET /business/:businessId/documents
   - DELETE /business/:businessId/documents/:documentId
   - Add rate limiting (5 uploads per hour)
   - Add detailed comments

9. Create src/middleware/rateLimiter.js:
   - uploadLimiter: 5 requests per hour
   - publicChatLimiter: 10 per hour per IP (for later)
   - authLimiter: 5 per 15 minutes
   - apiLimiter: 100 per 15 minutes
   - Add comments

10. Update src/server.js:
    - Import and use document routes
    - Create uploads/ directory if not exists
    - Add comments

Error Handling Requirements:
- If text extraction fails, delete temp file
- If embedding fails, delete temp file
- If ChromaDB fails, delete temp file and don't create MongoDB record
- If MongoDB fails, delete from ChromaDB and delete temp file
- Always cleanup temp files
- Log all errors with context

File Deletion Safety:
- Add comments explaining files are temporary
- Add comments explaining data is in databases
- Show that deleting /uploads is safe

Testing:
- Upload PDF successfully
- Upload TXT successfully
- Upload with invalid file type (should fail 400)
- Upload file too large (should fail 413)
- Verify document appears in MongoDB
- Verify embedding in ChromaDB
- Verify temp file is deleted
- List documents
- Delete document

Provide complete, production-ready code with EXTENSIVE comments.
This is the core of the system - every line needs explanation.
```

### Testing Checklist
- [ ] Upload PDF document succeeds
- [ ] Upload TXT document succeeds
- [ ] Upload DOCX document succeeds
- [ ] Reject unsupported file types
- [ ] Reject files over 10MB
- [ ] Text extraction works for all types
- [ ] Embedding created successfully
- [ ] Document stored in ChromaDB
- [ ] Document metadata in MongoDB
- [ ] Temp file deleted after processing
- [ ] Can list all documents
- [ ] Can delete document
- [ ] ChromaDB collection created for business

### Documentation
Create `docs/05-document-processing.md`:
- How document processing works
- File lifecycle (upload → process → delete)
- Why deleting /uploads is safe
- Error handling at each step
- Supported file types

---

## **STAGE 6: Public Chat (RAG System)**

### Objective
Build the public chat endpoint that uses RAG to answer customer questions.

### Deliverables
- ✅ PublicChat model
- ✅ OpenAI completion service
- ✅ Public chat endpoint
- ✅ Complete RAG pipeline

### Prompt for AI

```
STAGE 6: PUBLIC CHAT - RAG SYSTEM

Context: Document processing works. Now build the customer-facing chat that uses RAG.

This is the user-facing feature - must be fast and accurate.

Requirements:

1. Create src/models/PublicChat.js:
   - Fields: businessId, businessName (denormalized)
   - Fields: sessionId, ipAddress (hashed), userAgent
   - Fields: question, answer, sources[], confidence
   - Fields: responseTime, embeddingTime, searchTime, generationTime
   - Fields: embeddingCost, completionCost, totalCost
   - Fields: createdAt
   - Index: { businessId: 1, createdAt: -1 }
   - Add comments

2. Create src/services/completion.service.js:
   - generateCompletion(question, context) - returns answer string
   - Build system prompt: "You are a helpful assistant..."
   - Build user prompt with context and question
   - Call OpenAI chat.completions.create
   - Model: gpt-3.5-turbo
   - Temperature: 0.7
   - Max tokens: 500
   - Handle errors (quota, rate limit, context too long)
   - Add extensive comments

3. Update src/controllers/publicChat.controller.js:
   - publicChat(req, res, next) - MAIN FUNCTION
   - NO AUTHENTICATION REQUIRED
   - Rate limited by IP (10 per hour)
   - Get businessSlug from params
   - Get question and sessionId from body
   - Validate inputs
   - Find business and verify isPublic
   - Track timing for each step:
     a. Create question embedding (track time)
     b. Search ChromaDB for similar docs (track time)
     c. Build context from results
     d. Generate answer with GPT (track time)
     e. Save chat log
   - Calculate costs
   - Return answer with confidence
   - Add EXTENSIVE comments explaining RAG flow

4. Update src/routes/public.routes.js:
   - POST /api/public/:businessSlug/chat
   - Add publicChatLimiter middleware
   - Add input validation (question, sessionId)
   - Add comments explaining this is the main customer endpoint

5. Create src/utils/helpers.js:
   - hashIP(ip) - SHA-256 hash for privacy
   - calculateCost(tokens, model) - estimate API costs
   - formatResponse(answer, sources, confidence)
   - Add comments

6. Add comprehensive error handling:
   - Business not found (404)
   - Chat not public (403)
   - Rate limit exceeded (429)
   - AI service error (503)
   - Invalid input (400)

Testing:
- Send question to public chat (no auth)
- Verify answer is relevant to uploaded documents
- Verify rate limiting works
- Verify timing is tracked
- Verify costs are calculated
- Verify chat log is saved

RAG Flow Comments:
Add comments at each step explaining:
- "Step 1: Convert customer question to embedding vector"
- "Step 2: Search ChromaDB for similar documents"
- "Step 3: Retrieve top 3 most relevant chunks"
- "Step 4: Build context from retrieved documents"
- "Step 5: Send context + question to GPT"
- "Step 6: Return AI-generated answer to customer"

Provide complete code with EXTENSIVE comments on the RAG process.
```

### Testing Checklist
- [ ] Can send question without authentication
- [ ] Gets relevant answer based on uploaded documents
- [ ] Rate limit enforced (10 per hour per IP)
- [ ] Chat log saved with timing
- [ ] Costs calculated
- [ ] Returns 404 for non-existent business
- [ ] Returns 403 if chat not public
- [ ] Handles long questions gracefully
- [ ] Response time < 3 seconds

### Documentation
Create `docs/06-rag-system.md`:
- How RAG works (with diagrams)
- Step-by-step flow
- Why embeddings are used
- How ChromaDB search works
- Cost calculations

---

## **STAGE 7: Team Management**

### Objective
Build endpoints for inviting and managing team members.

### Prompt for AI

```
STAGE 7: TEAM MANAGEMENT

Context: Core features work. Now add team management.

Requirements:

1. Create src/controllers/team.controller.js:
   - inviteTeamMember(req, res, next)
   - Requires permission: canManageTeam
   - Create user if email doesn't exist
   - Create BusinessMember with invited status
   - Send invitation (just create record for now, no email)
   - Return invitation info
   - Add comments

   - listTeamMembers(req, res, next)
   - Get all members for business
   - Populate user info
   - Return array
   - Add comments

   - updateMemberRole(req, res, next)
   - Requires permission: canManageTeam
   - Update role and permissions
   - Add comments

   - removeTeamMember(req, res, next)
   - Requires permission: canManageTeam
   - Can't remove owner
   - Delete BusinessMember
   - Add comments

2. Create src/routes/team.routes.js:
   - POST /business/:businessId/team/invite
   - GET /business/:businessId/team
   - PATCH /business/:businessId/team/:userId
   - DELETE /business/:businessId/team/:userId
   - All require auth and businessAccess
   - Add comments

3. Update src/server.js:
   - Import and use team routes

Testing:
- Invite team member
- List team members
- Update member role
- Remove team member
- Verify permissions

Provide complete code with comments.
```

### Testing Checklist
- [ ] Can invite team member with correct permission
- [ ] Can't invite without permission (403)
- [ ] Can list all team members
- [ ] Can update member role
- [ ] Can remove team member
- [ ] Can't remove business owner

---

## **STAGE 8: Analytics**

### Objective
Build analytics endpoint for business owners.

### Prompt for AI

```
STAGE 8: ANALYTICS

Context: Team management done. Now add analytics.

Requirements:

1. Create src/controllers/analytics.controller.js:
   - getBusinessAnalytics(req, res, next)
   - Requires permission: canViewAnalytics
   - Query parameters: startDate, endDate
   - Aggregate data from PublicChat:
     * Total chats
     * Average response time
     * Most asked questions (top 10)
     * Chats by day
     * Total costs
   - Return formatted analytics
   - Add comments with MongoDB aggregation examples

2. Create src/routes/analytics.routes.js:
   - GET /business/:businessId/analytics
   - Requires auth, businessAccess, permission
   - Add comments

3. Update src/server.js:
   - Import and use analytics routes

Testing:
- Get analytics with date range
- Verify aggregations are correct
- Verify permission enforcement

Provide complete code with extensive MongoDB aggregation comments.
```

### Testing Checklist
- [ ] Can get analytics with correct permission
- [ ] Date range filtering works
- [ ] Most asked questions correct
- [ ] Costs calculated correctly
- [ ] Can't access without permission (403)

---

## **STAGE 9: Security Hardening**

### Objective
Add all security middleware and finalize production readiness.

### Prompt for AI

```
STAGE 9: SECURITY HARDENING

Context: All features working. Now add production security.

Requirements:

1. Update src/middleware/security.js:
   - Configure helmet with all security headers
   - CSP, XSS protection, frame guard
   - Add extensive comments on each header

2. Update src/middleware/sanitize.js:
   - Configure express-mongo-sanitize
   - Add XSS clean
   - Add comments

3. Create src/middleware/validation.js:
   - Add comprehensive validation for all endpoints
   - Email, password, string lengths, file types
   - Add comments

4. Update all routes:
   - Add validation middleware to every endpoint
   - Ensure consistent error responses
   - Add comments

5. Create src/utils/cleanup.js:
   - Automatic cleanup of old temp files
   - Run every hour
   - Add comments

6. Update src/server.js:
   - Add all security middleware in correct order
   - Add startup cleanup
   - Add comments explaining security layers

7. Security audit checklist in code comments:
   - Input validation ✓
   - Authentication ✓
   - Authorization ✓
   - Rate limiting ✓
   - CORS ✓
   - Helmet ✓
   - Password hashing ✓
   - JWT expiration ✓
   - File validation ✓
   - Error handling ✓

Testing:
- All security middleware active
- Rate limits enforced
- Input validation working
- No sensitive data in responses

Provide complete security implementation with detailed comments.
```

### Testing Checklist
- [ ] All security headers present in responses
- [ ] Input validation on all endpoints
- [ ] Rate limiting works on all endpoints
- [ ] NoSQL injection prevented
- [ ] XSS attacks prevented
- [ ] File upload validation strict
- [ ] No stack traces in production errors
- [ ] No passwords in logs

---

## **STAGE 10: Deployment Preparation**

### Objective
Prepare system for production deployment.

### Prompt for AI

```
STAGE 10: DEPLOYMENT PREPARATION

Context: System is feature-complete and secure. Prepare for deployment.

Requirements:

1. Create deployment documentation:
   - docs/deployment-railway.md
   - docs/deployment-render.md
   - Step-by-step deployment guides

2. Create Postman collection:
   - Export all endpoints
   - Include examples for each
   - Add pre-request scripts for auth

3. Create OpenAPI specification:
   - docs/openapi.yaml
   - Complete API documentation
   - All endpoints, schemas, errors

4. Update README.md:
   - Complete project documentation
   - Installation instructions
   - API overview
   - Deployment links

5. Create CHANGELOG.md:
   - Document all stages completed
   - Version 1.0.0

6. Final testing checklist:
   - Create docs/testing-checklist.md
   - Test every endpoint
   - Test every error scenario
   - Test rate limits
   - Test security

7. Add production environment variables:
   - Document required variables
   - Security considerations
   - Default values

Provide all documentation and deployment guides.
```

### Deployment Checklist
- [ ] All endpoints documented
- [ ] Postman collection complete
- [ ] OpenAPI spec valid
- [ ] README comprehensive
- [ ] Environment variables documented
- [ ] Deployment guides written
- [ ] Testing checklist completed
- [ ] Ready for production

---

## 📝 Documentation Standards

**For EVERY stage, create:**

1. **API Documentation** (`docs/api/`)
   - Endpoint specifications
   - Request/response examples
   - Error scenarios
   - Security notes

2. **Code Comments**
   - JSDoc for all functions
   - Inline comments explaining why, not what
   - Security considerations
   - Error handling explanations

3. **Testing Guide** (`docs/testing/`)
   - Manual test steps
   - Expected results
   - Postman examples

4. **Stage Summary** (`docs/stages/`)
   - What was built
   - Why it was built this way
   - Dependencies
   - Next steps

---

## 🧪 Testing Strategy

**Manual Testing (Each Stage):**
1. Test happy path
2. Test error scenarios
3. Test authentication/authorization
4. Test rate limiting
5. Test data validation
6. Document results

**Tools:**
- Postman (API testing)
- MongoDB Compass (database inspection)
- ChromaDB admin (vector inspection)
- Winston logs (error tracking)

---

## 📊 Progress Tracking

Create `PROGRESS.md`:

```markdown
# Development Progress

## ✅ Completed Stages
- [x] Stage 1: Foundation
- [x] Stage 2: Database Setup
- [ ] Stage 3: Authentication
- [ ] Stage 4: Business Management
- [ ] Stage 5: Document Processing
- [ ] Stage 6: Public Chat
- [ ] Stage 7: Team Management
- [ ] Stage 8: Analytics
- [ ] Stage 9: Security
- [ ] Stage 10: Deployment

## Current Stage
Working on: Stage 3 - Authentication System

## Blockers
None

## Next Steps
Complete user registration endpoint
```

---

## 🎯 Success Criteria

**Stage is complete when:**
- ✅ All code written and tested
- ✅ All functions have JSDoc comments
- ✅ Code has inline comments explaining complex logic
- ✅ API endpoints documented
- ✅ Manual testing completed
- ✅ No errors in logs
- ✅ Postman collection updated
- ✅ Git committed with descriptive message
- ✅ Stage documented in PROGRESS.md

---

## 💡 Tips for AI-Assisted Development

**When prompting the AI:**
1. Reference previous stages completed
2. Be specific about error handling
3. Request extensive comments
4. Ask for production-ready code
5. Request JSDoc for all functions
6. Specify response formats
7. Ask for security considerations
8. Request test scenarios

**After AI responds:**
1. Review all code carefully
2. Test thoroughly
3. Add any missing comments
4. Update documentation
5. Commit to Git
6. Move to next stage

---

## ✅ Final Checklist

Before considering the project complete:

- [ ] All 10 stages completed
- [ ] Every endpoint documented
- [ ] Every function has JSDoc
- [ ] All code has inline comments
- [ ] Postman collection complete
- [ ] OpenAPI spec created
- [ ] README comprehensive
- [ ] Security audit passed
- [ ] All tests passing
- [ ] Deployed to staging
- [ ] Deployed to production
- [ ] Monitoring set up

---

**This staged approach ensures:**
- ✅ Nothing is forgotten
- ✅ Everything is tested
- ✅ Code is maintainable
- ✅ System is production-ready
- ✅ Easy to debug issues
- ✅ Clear progress tracking



**Total: 2 weeks (part-time)**

Ready to start with Stage 1! 🚀
