# AI PROMPT: Generate Complete API & System Documentation

## 🎯 YOUR MISSION

You are a **Senior Technical Documentation Specialist** and **API Architect**. Your task is to:

1. ✅ Review the ENTIRE backend codebase
2. ✅ Generate complete API documentation
3. ✅ Create Swagger/OpenAPI specification
4. ✅ Generate Postman collection
5. ✅ Create client-facing system documentation
6. ✅ Create developer-facing system documentation
7. ✅ Ensure all documentation is accurate and complete

## 📋 PROJECT CONTEXT

### **Your Backend Stack:**
```
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- File Uploads (Multer)
- Web Scraping (Puppeteer + Axios)
- AI Integration (Anthropic Claude API)
```

### **Files to Review:**

**CRITICAL: You MUST review these files to understand the API:**

```
Backend Structure:
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js          ← Review for auth endpoints
│   │   ├── documents.routes.js     ← Review for document endpoints
│   │   ├── conversations.routes.js ← Review for chat endpoints
│   │   ├── prompt.routes.js        ← Review for prompt endpoints
│   │   └── health.routes.js        ← Review for health endpoint
│   │
│   ├── controllers/
│   │   ├── auth.controller.js      ← Review auth logic
│   │   ├── documents.controller.js ← Review document logic
│   │   ├── conversations.controller.js
│   │   ├── prompt.controller.js
│   │   └── health.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js      ← Review authentication
│   │   ├── errorHandler.js         ← Review error handling
│   │   └── upload.middleware.js    ← Review file upload
│   │
│   ├── models/
│   │   ├── User.js                 ← Review user schema
│   │   ├── Document.js             ← Review document schema
│   │   ├── Conversation.js         ← Review conversation schema
│   │   └── Prompt.js               ← Review prompt schema
│   │
│   └── server.js                   ← Review base URL and config
```

**IMPORTANT: Use the actual codebase as your ONLY source of truth!**

---

## 📖 DOCUMENTATION TO GENERATE

You will generate **7 comprehensive documentation files**:

### **1. API-REFERENCE.md** (Complete API Documentation)
### **2. openapi.yaml** (Swagger/OpenAPI Specification)
### **3. postman_collection.json** (Postman Collection)
### **4. SYSTEM-GUIDE.md** (Client-Facing System Documentation)
### **5. DEVELOPER-GUIDE.md** (Developer-Facing System Documentation)
### **6. API-ERRORS.md** (Error Codes & Handling)
### **7. API-EXAMPLES.md** (Usage Examples & Tutorials)

---

## 🔍 STEP-BY-STEP IMPLEMENTATION

### **STEP 1: Analyze the Codebase**

**First, review these files systematically:**

```bash
# Use the view tool to read files
view backend/src/routes/auth.routes.js
view backend/src/routes/documents.routes.js
view backend/src/routes/conversations.routes.js
view backend/src/routes/prompt.routes.js
view backend/src/routes/health.routes.js

# Review controllers
view backend/src/controllers/auth.controller.js
view backend/src/controllers/documents.controller.js
view backend/src/controllers/conversations.controller.js

# Review models (for data schemas)
view backend/src/models/User.js
view backend/src/models/Document.js
view backend/src/models/Conversation.js
view backend/src/models/Prompt.js

# Review middleware (for auth & validation)
view backend/src/middleware/auth.middleware.js
view backend/src/middleware/upload.middleware.js

# Review error handling
view backend/src/middleware/errorHandler.js
```

**Document for EACH endpoint:**
- ✅ HTTP Method (GET, POST, PUT, DELETE)
- ✅ URL Path
- ✅ Authentication required? (Yes/No)
- ✅ Request body schema
- ✅ Request parameters (path, query)
- ✅ Request headers
- ✅ Response schema (success)
- ✅ Response schema (errors)
- ✅ Data types (string, number, boolean, etc.)
- ✅ Required vs Optional fields
- ✅ Validation rules
- ✅ Example requests
- ✅ Example responses

---

### **STEP 2: Generate API-REFERENCE.md**

**Location:** `docs/API-REFERENCE.md`

**Structure:**

```markdown
# API Reference Documentation

## Overview

**Base URL:** `https://pam-ai-ww00.onrender.com` (Production)  
**Base URL:** `http://localhost:3000` (Development)

**API Version:** 1.0.0  
**Last Updated:** 2026-01-17

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain tokens via the `/api/auth/login` or `/api/auth/register` endpoints.

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Document Management Endpoints](#document-management-endpoints)
3. [Conversation Endpoints](#conversation-endpoints)
4. [Prompt Management Endpoints](#prompt-management-endpoints)
5. [Health Check Endpoints](#health-check-endpoints)
6. [Error Codes](#error-codes)

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "string (required, min: 2 chars)",
  "email": "string (required, valid email format)",
  "password": "string (required, min: 6 chars)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-01-17T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "success": false,
  "error": "Email is required",
  "code": "VALIDATION_ERROR"
}

// 409 Conflict - Email exists
{
  "success": false,
  "error": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

---

### Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized - Invalid credentials
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

---

## Document Management Endpoints

### Upload Document

**Endpoint:** `POST /api/documents/upload`

**Description:** Upload a document file (PDF, DOCX, TXT) to knowledge base

**Authentication:** Required

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file

**Form Fields:**
```
file: File (required)
  - Accepted formats: .pdf, .docx, .txt
  - Max size: 10MB
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Business Plan 2024",
      "type": "upload",
      "filename": "business-plan.pdf",
      "fileSize": 245632,
      "content": "Extracted text content...",
      "uploadedAt": "2026-01-17T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - No file
{
  "success": false,
  "error": "No file uploaded",
  "code": "NO_FILE"
}

// 400 Bad Request - Invalid format
{
  "success": false,
  "error": "Invalid file format. Accepted: PDF, DOCX, TXT",
  "code": "INVALID_FORMAT"
}

// 413 Payload Too Large
{
  "success": false,
  "error": "File size exceeds 10MB limit",
  "code": "FILE_TOO_LARGE"
}
```

---

### Preview URL Content

**Endpoint:** `POST /api/documents/preview-url`

**Description:** Scrape and preview content from a URL before adding to knowledge base

**Authentication:** Required

**Request Body:**
```json
{
  "url": "string (required, valid URL)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Preview generated successfully",
  "data": {
    "title": "Product Page Title",
    "url": "https://example.com/products",
    "content": "=== NAVIGATION SECTION ===\nHome | Products\n\n=== MAIN SECTION ===\nProduct listings...",
    "preview": "First 500 characters of content...",
    "stats": {
      "words": 1234,
      "characters": 5678,
      "estimatedReadTime": 6
    },
    "metadata": {
      "scrapedAt": "2026-01-17T10:30:00.000Z",
      "method": "puppeteer"
    }
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid URL
{
  "success": false,
  "error": "Invalid URL format",
  "code": "INVALID_URL"
}

// 408 Request Timeout
{
  "success": false,
  "error": "The website took too long to respond",
  "code": "TIMEOUT_ERROR"
}

// 403 Forbidden
{
  "success": false,
  "error": "Access denied by website",
  "code": "ACCESS_DENIED"
}
```

---

### Add URL to Knowledge Base

**Endpoint:** `POST /api/documents/url`

**Description:** Add scraped URL content to knowledge base

**Authentication:** Required

**Request Body:**
```json
{
  "url": "string (required)",
  "title": "string (optional)",
  "content": "string (optional, pre-scraped content)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "URL content added successfully",
  "data": {
    "document": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Product Page",
      "type": "url",
      "url": "https://example.com/products",
      "content": "Scraped content...",
      "addedAt": "2026-01-17T10:30:00.000Z"
    }
  }
}
```

---

### Get All Documents

**Endpoint:** `GET /api/documents`

**Description:** Retrieve all documents in user's knowledge base

**Authentication:** Required

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 20, max: 100)
type: string (optional, values: "upload" | "url" | "manual")
search: string (optional, search in title and content)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Business Plan 2024",
        "type": "upload",
        "filename": "business-plan.pdf",
        "createdAt": "2026-01-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalDocuments": 98,
      "limit": 20
    }
  }
}
```

---

### Get Document by ID

**Endpoint:** `GET /api/documents/:id`

**Description:** Retrieve a specific document with full content

**Authentication:** Required

**Path Parameters:**
```
id: string (required, MongoDB ObjectId)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Business Plan 2024",
      "type": "upload",
      "filename": "business-plan.pdf",
      "content": "Full document content...",
      "metadata": {
        "fileSize": 245632,
        "wordCount": 5000
      },
      "createdAt": "2026-01-17T10:30:00.000Z",
      "updatedAt": "2026-01-17T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "success": false,
  "error": "Document not found",
  "code": "DOCUMENT_NOT_FOUND"
}
```

---

### Update Document

**Endpoint:** `PUT /api/documents/:id`

**Description:** Update document title or content

**Authentication:** Required

**Path Parameters:**
```
id: string (required)
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
    "document": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Updated Title",
      "content": "Updated content...",
      "updatedAt": "2026-01-17T10:35:00.000Z"
    }
  }
}
```

---

### Delete Document

**Endpoint:** `DELETE /api/documents/:id`

**Description:** Delete a document from knowledge base

**Authentication:** Required

**Path Parameters:**
```
id: string (required)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### Search Documents

**Endpoint:** `POST /api/documents/search`

**Description:** Search documents using text search or vector similarity

**Authentication:** Required

**Request Body:**
```json
{
  "query": "string (required, min: 2 chars)",
  "limit": "number (optional, default: 10, max: 50)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Business Plan 2024",
        "excerpt": "...relevant excerpt with query terms...",
        "score": 0.87,
        "type": "upload"
      }
    ],
    "totalResults": 5
  }
}
```

---

## Conversation Endpoints

### Create Conversation

**Endpoint:** `POST /api/conversations`

**Description:** Start a new conversation with the AI assistant

**Authentication:** Required

**Request Body:**
```json
{
  "title": "string (optional, auto-generated if not provided)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "507f1f77bcf86cd799439011",
      "title": "New Conversation",
      "createdAt": "2026-01-17T10:30:00.000Z",
      "messages": []
    }
  }
}
```

---

### Send Message

**Endpoint:** `POST /api/conversations/:id/messages`

**Description:** Send a message in a conversation and receive AI response

**Authentication:** Required

**Path Parameters:**
```
id: string (required, conversation ID)
```

**Request Body:**
```json
{
  "message": "string (required, min: 1 char)",
  "useKnowledgeBase": "boolean (optional, default: true)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg_1",
      "role": "user",
      "content": "What is our Q4 revenue?",
      "timestamp": "2026-01-17T10:30:00.000Z"
    },
    "aiResponse": {
      "id": "msg_2",
      "role": "assistant",
      "content": "Based on your Business Plan 2024 document, Q4 revenue was $2.5M...",
      "timestamp": "2026-01-17T10:30:05.000Z",
      "sources": [
        {
          "documentId": "507f1f77bcf86cd799439011",
          "title": "Business Plan 2024",
          "excerpt": "Q4 Revenue: $2.5M"
        }
      ]
    }
  }
}
```

---

### Get All Conversations

**Endpoint:** `GET /api/conversations`

**Description:** Retrieve all user conversations

**Authentication:** Required

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Business Planning Discussion",
        "lastMessage": "What is our Q4 revenue?",
        "messageCount": 12,
        "createdAt": "2026-01-17T10:00:00.000Z",
        "updatedAt": "2026-01-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalConversations": 45
    }
  }
}
```

---

### Get Conversation by ID

**Endpoint:** `GET /api/conversations/:id`

**Description:** Retrieve a specific conversation with all messages

**Authentication:** Required

**Path Parameters:**
```
id: string (required)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Business Planning",
      "messages": [
        {
          "id": "msg_1",
          "role": "user",
          "content": "What is our Q4 revenue?",
          "timestamp": "2026-01-17T10:30:00.000Z"
        },
        {
          "id": "msg_2",
          "role": "assistant",
          "content": "Based on your documents...",
          "timestamp": "2026-01-17T10:30:05.000Z"
        }
      ],
      "createdAt": "2026-01-17T10:00:00.000Z"
    }
  }
}
```

---

### Delete Conversation

**Endpoint:** `DELETE /api/conversations/:id`

**Description:** Delete a conversation and all its messages

**Authentication:** Required

**Path Parameters:**
```
id: string (required)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

---

## Prompt Management Endpoints

### Create Custom Prompt

**Endpoint:** `POST /api/prompts`

**Description:** Create a custom system prompt for AI behavior

**Authentication:** Required

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required, the prompt text)",
  "isDefault": "boolean (optional, default: false)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "prompt": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Customer Service Agent",
      "content": "You are a helpful customer service agent...",
      "isDefault": false,
      "createdAt": "2026-01-17T10:30:00.000Z"
    }
  }
}
```

---

### Get All Prompts

**Endpoint:** `GET /api/prompts`

**Description:** Retrieve all user prompts

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Customer Service Agent",
        "isDefault": false,
        "createdAt": "2026-01-17T10:30:00.000Z"
      }
    ]
  }
}
```

---

### Update Prompt

**Endpoint:** `PUT /api/prompts/:id`

**Description:** Update an existing prompt

**Authentication:** Required

**Path Parameters:**
```
id: string (required)
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "isDefault": "boolean (optional)"
}
```

---

### Delete Prompt

**Endpoint:** `DELETE /api/prompts/:id`

**Description:** Delete a custom prompt

**Authentication:** Required

**Path Parameters:**
```
id: string (required)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Prompt deleted successfully"
}
```

---

## Health Check Endpoints

### Health Check

**Endpoint:** `GET /api/health`

**Description:** Check API health status

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-17T10:30:00.000Z",
    "uptime": 86400,
    "mongodb": "connected",
    "version": "1.0.0"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| INVALID_URL | 400 | URL format is invalid |
| NO_FILE | 400 | No file uploaded |
| INVALID_FORMAT | 400 | Invalid file format |
| UNAUTHORIZED | 401 | Authentication required |
| INVALID_CREDENTIALS | 401 | Invalid email/password |
| INVALID_TOKEN | 401 | JWT token invalid/expired |
| FORBIDDEN | 403 | Access denied |
| ACCESS_DENIED | 403 | Website blocking access |
| DOCUMENT_NOT_FOUND | 404 | Document does not exist |
| CONVERSATION_NOT_FOUND | 404 | Conversation does not exist |
| NOT_FOUND | 404 | Resource not found |
| EMAIL_EXISTS | 409 | Email already registered |
| TIMEOUT_ERROR | 408 | Request timeout |
| FILE_TOO_LARGE | 413 | File exceeds size limit |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

All endpoints are rate-limited to:
- **100 requests per 15 minutes** per IP address
- **Authentication endpoints**: 5 requests per 15 minutes per IP

---

## CORS

The API supports CORS with the following origins:
- `http://localhost:5173` (Development)
- `https://your-frontend.onrender.com` (Production)

---

## Support

For API support:
- Email: api-support@yourdomain.com
- Documentation: https://docs.yourdomain.com
- Status Page: https://status.yourdomain.com

---

## Changelog

See [CHANGELOG.md](../CHANGELOG.md) for version history and updates.
```

---

### **STEP 3: Generate openapi.yaml (Swagger/OpenAPI)**

**Location:** `docs/openapi.yaml`

**Generate complete OpenAPI 3.0 specification:**

```yaml
openapi: 3.0.3
info:
  title: Business AI Assistant API
  description: |
    REST API for Business AI Assistant - An intelligent knowledge base system with AI-powered conversations.
    
    ## Features
    - JWT Authentication
    - Document Management (Upload, URL scraping, Manual)
    - AI Conversations with Knowledge Base
    - Custom Prompt Management
    - Advanced Search
    
    ## Authentication
    Most endpoints require JWT authentication. Obtain a token via `/api/auth/login`.
    
  version: 1.0.0
  contact:
    name: API Support
    email: support@yourdomain.com
    url: https://yourdomain.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://pam-ai-ww00.onrender.com
    description: Production server
  - url: http://localhost:3000
    description: Development server

tags:
  - name: Authentication
    description: User authentication and registration
  - name: Documents
    description: Document management and knowledge base
  - name: Conversations
    description: AI conversation management
  - name: Prompts
    description: Custom prompt management
  - name: Health
    description: System health checks

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from login endpoint
  
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          example: "507f1f77bcf86cd799439011"
        name:
          type: string
          example: "John Doe"
        email:
          type: string
          format: email
          example: "john@example.com"
        createdAt:
          type: string
          format: date-time
    
    Document:
      type: object
      properties:
        id:
          type: string
          example: "507f1f77bcf86cd799439011"
        title:
          type: string
          example: "Business Plan 2024"
        type:
          type: string
          enum: [upload, url, manual]
          example: "upload"
        content:
          type: string
          example: "Document content..."
        filename:
          type: string
          example: "business-plan.pdf"
        url:
          type: string
          example: "https://example.com/page"
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    Conversation:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        messages:
          type: array
          items:
            $ref: '#/components/schemas/Message'
        createdAt:
          type: string
          format: date-time
    
    Message:
      type: object
      properties:
        id:
          type: string
        role:
          type: string
          enum: [user, assistant]
        content:
          type: string
        timestamp:
          type: string
          format: date-time
    
    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
          example: "Error message"
        code:
          type: string
          example: "ERROR_CODE"
  
  responses:
    UnauthorizedError:
      description: Authentication required or token invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Authentication required"
            code: "UNAUTHORIZED"
    
    NotFoundError:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Resource not found"
            code: "NOT_FOUND"
    
    ValidationError:
      description: Request validation failed
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Validation failed"
            code: "VALIDATION_ERROR"

paths:
  /api/auth/register:
    post:
      tags:
        - Authentication
      summary: Register new user
      description: Create a new user account
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - password
              properties:
                name:
                  type: string
                  minLength: 2
                  example: "John Doe"
                email:
                  type: string
                  format: email
                  example: "john@example.com"
                password:
                  type: string
                  minLength: 6
                  example: "securepass123"
      responses:
        '201':
          description: User registered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "User registered successfully"
                  data:
                    type: object
                    properties:
                      user:
                        $ref: '#/components/schemas/User'
                      token:
                        type: string
        '400':
          $ref: '#/components/responses/ValidationError'
        '409':
          description: Email already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/auth/login:
    post:
      tags:
        - Authentication
      summary: Login user
      description: Authenticate user and receive JWT token
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      user:
                        $ref: '#/components/schemas/User'
                      token:
                        type: string
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/documents:
    get:
      tags:
        - Documents
      summary: Get all documents
      description: Retrieve all documents in user's knowledge base
      operationId: getDocuments
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: type
          in: query
          schema:
            type: string
            enum: [upload, url, manual]
        - name: search
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Documents retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      documents:
                        type: array
                        items:
                          $ref: '#/components/schemas/Document'
                      pagination:
                        type: object
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /api/documents/upload:
    post:
      tags:
        - Documents
      summary: Upload document
      description: Upload a document file (PDF, DOCX, TXT)
      operationId: uploadDocument
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - file
              properties:
                file:
                  type: string
                  format: binary
                  description: Document file (PDF, DOCX, TXT, max 10MB)
      responses:
        '201':
          description: Document uploaded successfully
        '400':
          description: Invalid file or no file provided
        '413':
          description: File too large

  /api/documents/preview-url:
    post:
      tags:
        - Documents
      summary: Preview URL content
      description: Scrape and preview content from URL before adding
      operationId: previewUrl
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - url
              properties:
                url:
                  type: string
                  format: uri
      responses:
        '200':
          description: Preview generated successfully
        '400':
          description: Invalid URL
        '408':
          description: Request timeout

  /api/documents/{id}:
    get:
      tags:
        - Documents
      summary: Get document by ID
      operationId: getDocumentById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Document retrieved
        '404':
          $ref: '#/components/responses/NotFoundError'
    
    put:
      tags:
        - Documents
      summary: Update document
      operationId: updateDocument
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                content:
                  type: string
      responses:
        '200':
          description: Document updated
        '404':
          $ref: '#/components/responses/NotFoundError'
    
    delete:
      tags:
        - Documents
      summary: Delete document
      operationId: deleteDocument
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Document deleted
        '404':
          $ref: '#/components/responses/NotFoundError'

  /api/conversations:
    post:
      tags:
        - Conversations
      summary: Create conversation
      operationId: createConversation
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
      responses:
        '201':
          description: Conversation created
    
    get:
      tags:
        - Conversations
      summary: Get all conversations
      operationId: getConversations
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Conversations retrieved

  /api/conversations/{id}:
    get:
      tags:
        - Conversations
      summary: Get conversation by ID
      operationId: getConversationById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Conversation retrieved
        '404':
          $ref: '#/components/responses/NotFoundError'
    
    delete:
      tags:
        - Conversations
      summary: Delete conversation
      operationId: deleteConversation
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Conversation deleted

  /api/conversations/{id}/messages:
    post:
      tags:
        - Conversations
      summary: Send message
      operationId: sendMessage
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - message
              properties:
                message:
                  type: string
                useKnowledgeBase:
                  type: boolean
                  default: true
      responses:
        '200':
          description: Message sent and response received

  /api/health:
    get:
      tags:
        - Health
      summary: Health check
      operationId: healthCheck
      responses:
        '200':
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      status:
                        type: string
                      timestamp:
                        type: string
                      mongodb:
                        type: string
```

---

### **STEP 4: Generate Postman Collection**

**Location:** `docs/postman_collection.json`

**Generate complete Postman collection with:**
- All endpoints
- Example requests
- Environment variables
- Pre-request scripts (for auth token)
- Tests

```json
{
  "info": {
    "name": "Business AI Assistant API",
    "description": "Complete API collection for Business AI Assistant",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "version": "1.0.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.environment.set(\"auth_token\", jsonData.data.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"securepass123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login User",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.environment.set(\"auth_token\", jsonData.data.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"securepass123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Documents",
      "item": [
        {
          "name": "Upload Document",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": "/path/to/file.pdf"
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/documents/upload",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", "upload"]
            }
          }
        },
        {
          "name": "Preview URL",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"url\": \"https://example.com/page\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/documents/preview-url",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", "preview-url"]
            }
          }
        },
        {
          "name": "Add URL",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"url\": \"https://example.com/page\",\n  \"title\": \"Example Page\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/documents/url",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", "url"]
            }
          }
        },
        {
          "name": "Get All Documents",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/documents?page=1&limit=20",
              "host": ["{{base_url}}"],
              "path": ["api", "documents"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "20"
                }
              ]
            }
          }
        },
        {
          "name": "Get Document by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/documents/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        },
        {
          "name": "Update Document",
          "request": {
            "method": "PUT",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Title\",\n  \"content\": \"Updated content\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/documents/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        },
        {
          "name": "Delete Document",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/documents/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        },
        {
          "name": "Search Documents",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"query\": \"business plan\",\n  \"limit\": 10\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/documents/search",
              "host": ["{{base_url}}"],
              "path": ["api", "documents", "search"]
            }
          }
        }
      ]
    },
    {
      "name": "Conversations",
      "item": [
        {
          "name": "Create Conversation",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"New Chat\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/conversations",
              "host": ["{{base_url}}"],
              "path": ["api", "conversations"]
            }
          }
        },
        {
          "name": "Send Message",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"message\": \"What is our Q4 revenue?\",\n  \"useKnowledgeBase\": true\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/conversations/:id/messages",
              "host": ["{{base_url}}"],
              "path": ["api", "conversations", ":id", "messages"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        },
        {
          "name": "Get All Conversations",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/conversations",
              "host": ["{{base_url}}"],
              "path": ["api", "conversations"]
            }
          }
        },
        {
          "name": "Get Conversation by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/conversations/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "conversations", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        },
        {
          "name": "Delete Conversation",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/conversations/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "conversations", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Prompts",
      "item": [
        {
          "name": "Create Prompt",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Customer Service Agent\",\n  \"content\": \"You are a helpful customer service agent...\",\n  \"isDefault\": false\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/prompts",
              "host": ["{{base_url}}"],
              "path": ["api", "prompts"]
            }
          }
        },
        {
          "name": "Get All Prompts",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/prompts",
              "host": ["{{base_url}}"],
              "path": ["api", "prompts"]
            }
          }
        },
        {
          "name": "Update Prompt",
          "request": {
            "method": "PUT",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Title\",\n  \"content\": \"Updated content\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/prompts/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "prompts", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        },
        {
          "name": "Delete Prompt",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/prompts/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "prompts", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "507f1f77bcf86cd799439011"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Health",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "auth": {
              "type": "noauth"
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/health",
              "host": ["{{base_url}}"],
              "path": ["api", "health"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📊 COMPLETE CHECKLIST

```
STEP 1: Analyze Codebase
□ View all route files
□ View all controller files
□ View all model files
□ View middleware files
□ Document each endpoint found
□ Note authentication requirements
□ Document request/response schemas
□ Note validation rules

STEP 2: Generate API-REFERENCE.md
□ Create file structure
□ Document authentication
□ Document all auth endpoints
□ Document all document endpoints
□ Document all conversation endpoints
□ Document all prompt endpoints
□ Document health endpoint
□ Add error codes table
□ Add rate limiting info
□ Add CORS info
□ Add examples for each endpoint

STEP 3: Generate openapi.yaml
□ Create OpenAPI 3.0 structure
□ Define security schemes
□ Define all schemas (models)
□ Define all paths (endpoints)
□ Add descriptions
□ Add examples
□ Add response codes
□ Validate YAML syntax

STEP 4: Generate Postman Collection
□ Create collection structure
□ Add all endpoints
□ Add environment variables
□ Add auth token handling
□ Add example requests
□ Add tests for token extraction
□ Organize into folders
□ Add descriptions

STEP 5: Generate SYSTEM-GUIDE.md (Client)
□ System overview
□ Key features
□ User workflows
□ Screenshots/diagrams
□ FAQs
□ Support info

STEP 6: Generate DEVELOPER-GUIDE.md
□ Architecture overview
□ Tech stack
□ Project structure
□ Setup instructions
□ Development workflow
□ Testing guide
□ Deployment guide

STEP 7: Generate API-ERRORS.md
□ All error codes
□ Descriptions
□ Causes
□ Solutions
□ Examples

STEP 8: Generate API-EXAMPLES.md
□ Getting started tutorial
□ Authentication example
□ Document upload example
□ Chat conversation example
□ Common workflows
□ Code samples (curl, JS, Python)

STEP 9: Review & Update
□ Check all links work
□ Verify all examples correct
□ Test Postman collection
□ Validate OpenAPI spec
□ Proofread documentation
□ Check formatting consistent

STEP 10: Commit & Deploy
□ Add all documentation files
□ Commit with clear message
□ Push to repository
□ Deploy to documentation site (if any)
□ Share with team
```

---

## 🎯 AI PROMPT TO USE

```
I need you to generate COMPLETE API and system documentation for my backend.

TASK: Review the entire backend codebase and generate:

1. API-REFERENCE.md - Complete API documentation
2. openapi.yaml - Swagger/OpenAPI 3.0 specification
3. postman_collection.json - Postman collection
4. SYSTEM-GUIDE.md - Client-facing system documentation
5. DEVELOPER-GUIDE.md - Developer-facing technical guide
6. API-ERRORS.md - Error codes and handling
7. API-EXAMPLES.md - Usage examples and tutorials

CRITICAL REQUIREMENTS:

1. USE THE ACTUAL CODEBASE AS YOUR SOURCE:
   - Review backend/src/routes/*.js files
   - Review backend/src/controllers/*.js files
   - Review backend/src/models/*.js files
   - Review backend/src/middleware/*.js files
   - Document EXACTLY what exists in the code

2. FOR EACH ENDPOINT DOCUMENT:
   ✅ HTTP method and path
   ✅ Authentication required (yes/no)
   ✅ Request body schema with data types
   ✅ Required vs optional fields
   ✅ Request parameters (path, query)
   ✅ Response schema (success)
   ✅ Response schema (errors)
   ✅ Example requests (curl)
   ✅ Example responses (JSON)
   ✅ Error codes

3. DOCUMENTATION QUALITY:
   ✅ Clear and concise
   ✅ Accurate (matches actual code)
   ✅ Complete (no missing endpoints)
   ✅ Examples for everything
   ✅ Client-friendly (SYSTEM-GUIDE)
   ✅ Developer-friendly (DEVELOPER-GUIDE)

4. FILES TO CREATE:
   - docs/API-REFERENCE.md
   - docs/openapi.yaml
   - docs/postman_collection.json
   - SYSTEM-GUIDE.md (root)
   - docs/DEVELOPER-GUIDE.md
   - docs/API-ERRORS.md
   - docs/API-EXAMPLES.md

5. POSTMAN COLLECTION MUST INCLUDE:
   ✅ All endpoints organized by category
   ✅ Environment variables (base_url, auth_token)
   ✅ Auto token extraction from login
   ✅ Example requests with sample data
   ✅ Ready to import and use

6. OPENAPI SPEC MUST INCLUDE:
   ✅ Complete API definition
   ✅ All schemas (User, Document, etc.)
   ✅ Security definitions
   ✅ Examples for all endpoints
   ✅ Valid YAML that passes validation

PROCESS:
Step 1: Review ALL backend code files
Step 2: Document each endpoint found
Step 3: Generate API-REFERENCE.md
Step 4: Generate openapi.yaml
Step 5: Generate postman_collection.json
Step 6: Generate SYSTEM-GUIDE.md (for clients)
Step 7: Generate DEVELOPER-GUIDE.md (for developers)
Step 8: Generate API-ERRORS.md
Step 9: Generate API-EXAMPLES.md
Step 10: Review and ensure completeness

DO NOT skip any endpoints or make assumptions.
USE THE ACTUAL CODE as the source of truth.
Make documentation production-ready.

Start by viewing the route files to see what endpoints exist.
```

---

## ✅ SUCCESS CRITERIA

**You'll know it's complete when:**

```
✅ All 7 documentation files created
✅ Every endpoint documented
✅ Postman collection imports successfully
✅ OpenAPI spec validates
✅ Examples all work when tested
✅ Client documentation is clear
✅ Developer documentation is detailed
✅ Error codes all listed
✅ No missing information
✅ Ready for production use
```

---

## 🎉 DELIVERABLES

**7 Complete Documentation Files:**

1. **docs/API-REFERENCE.md** - Complete API reference (100+ pages)
2. **docs/openapi.yaml** - Swagger spec (can be imported to Swagger UI)
3. **docs/postman_collection.json** - Ready-to-use Postman collection
4. **SYSTEM-GUIDE.md** - Client-facing system guide
5. **docs/DEVELOPER-GUIDE.md** - Technical implementation guide
6. **docs/API-ERRORS.md** - Error reference
7. **docs/API-EXAMPLES.md** - Usage tutorials

**All documentation will be:**
- ✅ Accurate (matches actual code)
- ✅ Complete (no missing endpoints)
- ✅ Professional (production-ready)
- ✅ Tested (examples work)
- ✅ Clear (easy to understand)
- ✅ Detailed (covers everything)

---

**This prompt will generate COMPLETE documentation!** 📚  
**AI will review your actual codebase!** 🔍  
**7 professional documentation files!** 📝  
**Postman & Swagger ready to use!** 🚀  
**Both clients AND developers covered!** 👥
