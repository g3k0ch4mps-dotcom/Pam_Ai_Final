# API Endpoints Reference - Business AI Assistant

> **Base URL:** `http://localhost:3000/api` (development)  
> **Production:** `https://your-api-domain.com/api`  
> **API Type:** RESTful API  
> **Authentication:** JWT Bearer Token (for business admin routes)

---

## 📑 Table of Contents

1. [Public APIs (No Authentication)](#public-apis)
2. [Business Admin APIs (Authentication Required)](#business-admin-apis)
3. [Team Management APIs](#team-management-apis)
4. [Health Check](#health-check)
5. [Response Standards](#response-standards)
6. [Error Codes](#error-codes)

---

## 🌐 Public APIs (No Authentication Required)

These endpoints are for **customer-facing chat** - no login required!

### 1. Get Business Information

```http
GET /api/public/:businessSlug
```

**Purpose:** Fetch business details for displaying on chat widget

**Parameters:**
- `businessSlug` (path) - URL-friendly business identifier (e.g., "luxury-salon")

**Request Example:**
```bash
GET /api/public/luxury-salon
```

**Response (200 OK):**
```json
{
  "success": true,
  "business": {
    "id": "biz_123abc",
    "businessName": "Luxury Salon & Spa",
    "businessSlug": "luxury-salon",
    "description": "Premium hair and beauty services in downtown",
    "logo": "https://cdn.example.com/logos/luxury-salon.png",
    "primaryColor": "#FF69B4",
    "chatSettings": {
      "welcomeMessage": "Hi! Ask me anything about Luxury Salon services.",
      "isPublic": true,
      "showSources": false
    }
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "code": "BUSINESS_NOT_FOUND",
    "message": "Business not found or chat is disabled"
  }
}
```

**Use Case:**
```javascript
// Frontend: Load business info when chat widget opens
async function loadBusinessInfo() {
  const response = await fetch('/api/public/luxury-salon');
  const data = await response.json();
  
  // Display welcome message
  showWelcomeMessage(data.business.chatSettings.welcomeMessage);
  
  // Apply branding
  applyBranding(data.business.primaryColor, data.business.logo);
}
```

---

### 2. Public Chat (Ask Questions)

```http
POST /api/public/:businessSlug/chat
```

**Purpose:** Send customer question and get AI-powered answer

**Rate Limit:** 10 requests per hour per IP address

**Parameters:**
- `businessSlug` (path) - Business identifier

**Request Body:**
```json
{
  "question": "What are your business hours?",
  "sessionId": "sess_abc123xyz"
}
```

**Field Descriptions:**
- `question` (required) - Customer's question (max 500 characters)
- `sessionId` (required) - Unique session ID (generated on first visit)

**Request Example:**
```bash
curl -X POST http://localhost:3000/api/public/luxury-salon/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are your business hours?",
    "sessionId": "sess_abc123xyz"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "business": "Luxury Salon & Spa",
  "question": "What are your business hours?",
  "answer": "We're open Monday through Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM. We're closed on Sundays.",
  "confidence": 0.95,
  "responseTime": 1456,
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

**Field Descriptions:**
- `answer` - AI-generated response based on business documents
- `confidence` - How confident the AI is (0-1 scale)
- `responseTime` - Time taken to generate answer (milliseconds)

**Error Responses:**
```json
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Question is required",
    "details": {
      "field": "question"
    }
  }
}

// 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many questions. Please try again in 1 hour.",
    "retryAfter": 3600
  }
}

// 503 Service Unavailable
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "AI service is temporarily unavailable. Please try again."
  }
}
```

**Use Case:**
```javascript
// Frontend: Send customer question
async function askQuestion(question) {
  // Get or create session ID
  let sessionId = localStorage.getItem('chatSessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionId', sessionId);
  }
  
  try {
    const response = await fetch('/api/public/luxury-salon/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, sessionId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayAnswer(data.answer);
    } else {
      displayError(data.error.message);
    }
  } catch (error) {
    displayError('Network error. Please check your connection.');
  }
}
```

---

## 🔒 Business Management APIs (Authentication Required)

All business operations are now structured under the `/api/business/v1` namespace. Every request requires a JWT token in the `Authorization` header.

**New Headers Requirements:**
- `Authorization`: `Bearer <token>`
- `Content-Type`: `application/json`

---

### 3. Business Registration & Login
These routes remain under the central `/api/auth` namespace for account bootstrapping.

**POST /api/auth/register**
- Registers a business and creates the primary owner account (RBAC: `business_owner`).

**POST /api/auth/login**
- Returns user details, role, and business ID along with the JWT.
- Token payload contains `id`, `role`, and `businessId`.

---

## 🏢 Business Operations (v1)
Base Path: `/api/business/v1`

| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Documents** | `GET` | `/documents` | List business documents (Scoped) |
| **Documents** | `POST` | `/documents` | Upload new knowledge base file |
| **Chat** | `GET` | `/chat/conversations` | List internal conversations |
| **Chat** | `POST` | `/chat/message` | Handle internal AI interaction |
| **Leads** | `GET` | `/leads` | List captured leads (Scoped) |
| **Leads** | `PATCH` | `/leads/:id` | Update lead status/notes |
| **Settings** | `GET` | `/settings` | Get business profile |
| **Settings** | `PATCH` | `/settings` | Update chat branding/logic |

---

### 4. Document Management
All document operations are strictly isolated by the user's `businessId` attached to the JWT.

**GET /api/business/v1/documents**
- Fetches all documents owned by the active business.

**POST /api/business/v1/documents**
- Uploads and processes a new file.
- Automatically assigns ownership to the active business.

**DELETE /api/business/v1/documents/:id**
- Requires `business_owner` or `business_admin` role.

**Error Responses:**
```json
// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}

// 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "TOO_MANY_ATTEMPTS",
    "message": "Too many login attempts. Please try again in 15 minutes."
  }
}
```

---

### 5. Upload Document

```http
POST /api/business/:businessId/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Purpose:** Upload business document for AI knowledge base

**Rate Limit:** 5 uploads per hour per user

**Permissions Required:** `canUploadDocuments: true`

**Parameters:**
- `businessId` (path) - Business ID

**Request Body (form-data):**
```
file: <binary file data>
```

**Supported File Types:**
- `.pdf` - PDF documents
- `.txt` - Plain text files
- `.docx` - Microsoft Word documents
- `.csv` - CSV files
- `.json` - JSON files
- `.md` - Markdown files

**File Restrictions:**
- Max size: 10MB
- Max files per request: 1
- MIME type validation: Required
- File extension validation: Required

**Request Example:**
```bash
curl -X POST http://localhost:3000/api/business/biz_123abc/documents/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1..." \
  -F "file=@business_hours.pdf"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Document uploaded and processed successfully",
  "document": {
    "id": "doc_789ghi",
    "businessId": "biz_123abc",
    "filename": "business_hours.pdf",
    "originalName": "Business Hours & Schedule.pdf",
    "fileType": "pdf",
    "fileSize": 245678,
    "uploadedBy": "Sarah Johnson",
    "uploadedAt": "2024-12-29T10:30:00.000Z",
    "status": "completed",
    "chunkCount": 3
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "NO_FILE_PROVIDED",
    "message": "No file uploaded"
  }
}

// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Invalid file type. Only PDF, TXT, DOCX, CSV, JSON, MD allowed"
  }
}

// 413 Payload Too Large
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds 10MB limit"
  }
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to upload documents"
  }
}
```

---

### 6. List Documents

```http
GET /api/business/:businessId/documents
Authorization: Bearer <token>
```

**Purpose:** Get list of all uploaded documents for a business

**Response (200 OK):**
```json
{
  "success": true,
  "businessId": "biz_123abc",
  "businessName": "Luxury Salon & Spa",
  "count": 6,
  "documents": [
    {
      "id": "doc_001",
      "filename": "business_hours.pdf",
      "originalName": "Business Hours & Schedule.pdf",
      "fileType": "pdf",
      "fileSize": 245678,
      "uploadedBy": "Sarah Johnson",
      "uploadedAt": "2024-12-29T10:30:00.000Z",
      "status": "completed",
      "chunkCount": 3
    },
    {
      "id": "doc_002",
      "filename": "pricing.pdf",
      "originalName": "Service Pricing 2024.pdf",
      "fileType": "pdf",
      "fileSize": 198234,
      "uploadedBy": "Sarah Johnson",
      "uploadedAt": "2024-12-28T14:20:00.000Z",
      "status": "completed",
      "chunkCount": 5
    }
  ]
}
```

---

### 7. Delete Document

```http
DELETE /api/business/:businessId/documents/:documentId
Authorization: Bearer <token>
```

**Purpose:** Delete document from knowledge base

**Permissions Required:** `canDeleteDocuments: true`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "documentId": "doc_789ghi"
}
```

**Important:** This will:
1. Delete document from MongoDB
2. Delete embeddings from ChromaDB
3. Remove from AI search results immediately

---

### 8. Get Business Analytics

```http
GET /api/business/:businessId/analytics
Authorization: Bearer <token>
```

**Purpose:** View chat analytics and insights

**Permissions Required:** `canViewAnalytics: true`

**Query Parameters:**
```
startDate: 2024-01-01 (optional)
endDate: 2024-01-31 (optional)
```

**Response (200 OK):**
```json
{
  "success": true,
  "businessId": "biz_123abc",
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "analytics": {
    "totalChats": 1240,
    "averageResponseTime": 1.2,
    "averageConfidence": 0.89,
    "mostAskedQuestions": [
      {
        "question": "What are your prices?",
        "count": 156,
        "percentage": 12.6
      },
      {
        "question": "What are your hours?",
        "count": 134,
        "percentage": 10.8
      },
      {
        "question": "Where are you located?",
        "count": 98,
        "percentage": 7.9
      }
    ],
    "chatsByDay": [
      { "date": "2024-01-01", "count": 45 },
      { "date": "2024-01-02", "count": 52 },
      { "date": "2024-01-03", "count": 38 }
    ],
    "chatsByHour": [
      { "hour": 9, "count": 23 },
      { "hour": 10, "count": 45 },
      { "hour": 11, "count": 67 }
    ],
    "costEstimate": {
      "totalQuestions": 1240,
      "estimatedCost": 0.65
    }
  }
}
```

---

### 9. Update Business Settings

```http
PATCH /api/business/:businessId/settings
Authorization: Bearer <token>
Content-Type: application/json
```

**Purpose:** Update business chat settings

**Permissions Required:** `canManageSettings: true`

**Request Body:**
```json
{
  "chatSettings": {
    "welcomeMessage": "Welcome to Luxury Salon! How can I help you today?",
    "isPublic": true,
    "rateLimitPerIP": 15,
    "showSources": false
  },
  "primaryColor": "#FF1493",
  "logo": "https://cdn.example.com/new-logo.png"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "business": {
    "id": "biz_123abc",
    "chatSettings": {
      "welcomeMessage": "Welcome to Luxury Salon! How can I help you today?",
      "isPublic": true,
      "rateLimitPerIP": 15,
      "showSources": false
    },
    "primaryColor": "#FF1493",
    "updatedAt": "2024-12-29T10:30:00.000Z"
  }
}
```

---

## 👥 Team Management APIs

### 10. Invite Team Member

```http
POST /api/business/:businessId/team/invite
Authorization: Bearer <token>
Content-Type: application/json
```

**Purpose:** Invite new team member to business

**Permissions Required:** `canManageTeam: true`

**Request Body:**
```json
{
  "email": "manager@luxurysalon.com",
  "fullName": "Jane Smith",
  "role": "manager",
  "permissions": {
    "canUploadDocuments": true,
    "canDeleteDocuments": false,
    "canManageTeam": false,
    "canViewAnalytics": true,
    "canManageSettings": false
  }
}
```

**Available Roles:**
- `owner` - Full access (assigned at registration)
- `admin` - Almost full access (cannot delete business)
- `manager` - Can manage documents and view analytics
- `staff` - Basic access (view only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Invitation sent to manager@luxurysalon.com",
  "invitation": {
    "id": "inv_xyz789",
    "email": "manager@luxurysalon.com",
    "role": "manager",
    "status": "pending",
    "expiresAt": "2024-12-29T10:30:00.000Z"
  }
}
```

---

### 11. List Team Members

```http
GET /api/business/:businessId/team
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "businessId": "biz_123abc",
  "members": [
    {
      "userId": "user_456def",
      "fullName": "Sarah Johnson",
      "email": "owner@luxurysalon.com",
      "role": "owner",
      "permissions": {
        "canUploadDocuments": true,
        "canDeleteDocuments": true,
        "canManageTeam": true,
        "canViewAnalytics": true,
        "canManageSettings": true
      },
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "status": "active"
    },
    {
      "userId": "user_789ghi",
      "fullName": "Jane Smith",
      "email": "manager@luxurysalon.com",
      "role": "manager",
      "permissions": {
        "canUploadDocuments": true,
        "canDeleteDocuments": false,
        "canManageTeam": false,
        "canViewAnalytics": true,
        "canManageSettings": false
      },
      "joinedAt": "2024-01-15T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

---

### 12. Remove Team Member

```http
DELETE /api/business/:businessId/team/:userId
Authorization: Bearer <token>
```

**Purpose:** Remove team member from business

**Permissions Required:** `canManageTeam: true`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team member removed successfully"
}
```

---

## 🏥 Health Check

### 13. System Health

```http
GET /api/health
```

**Purpose:** Check if API and services are operational

**No Authentication Required**

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-12-29T10:30:00.000Z",
  "services": {
    "api": "operational",
    "mongodb": "connected",
    "chromadb": "connected",
    "openai": "available"
  },
  "uptime": 86400,
  "version": "1.0.0"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "error",
  "timestamp": "2024-12-29T10:30:00.000Z",
  "services": {
    "api": "operational",
    "mongodb": "connected",
    "chromadb": "error",
    "openai": "available"
  },
  "errors": [
    "ChromaDB connection failed"
  ]
}
```

---

## 📋 Response Standards

### Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (optional)
    }
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

---

## ⚠️ Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `UNAUTHORIZED` | 401 | No token provided |
| `PERMISSION_DENIED` | 403 | User lacks required permission |
| `BUSINESS_NOT_FOUND` | 404 | Business does not exist |
| `DOCUMENT_NOT_FOUND` | 404 | Document does not exist |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `BUSINESS_NAME_EXISTS` | 409 | Business name taken |
| `FILE_TOO_LARGE` | 413 | File exceeds 10MB |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `AI_SERVICE_ERROR` | 503 | OpenAI service unavailable |
| `DATABASE_ERROR` | 503 | Database connection issue |

---

## 🔑 Authentication Flow

```
1. Register/Login
   POST /api/business/register
   or
   POST /api/business/login
   ↓
   Receive JWT token

2. Store Token
   localStorage.setItem('token', token)

3. Use Token in Requests
   headers: {
     'Authorization': 'Bearer ' + token
   }

4. Token Expires (7 days)
   → User must login again
```

---

## 📊 Rate Limits Summary

| Endpoint | Limit | Window | Type |
|----------|-------|--------|------|
| Public Chat | 10 requests | 1 hour | Per IP |
| Login | 5 attempts | 15 minutes | Per IP |
| Register | 5 requests | 15 minutes | Per IP |
| Upload Document | 5 uploads | 1 hour | Per user |
| General API | 100 requests | 15 minutes | Per user |

---

## 🎯 Quick Reference

**Most Used Endpoints:**
1. `POST /api/public/:slug/chat` - Customer asks question
2. `POST /api/business/:id/documents/upload` - Upload document
3. `GET /api/business/:id/documents` - List documents
4. `GET /api/business/:id/analytics` - View stats

**Need Help?**
- Check HTTP status code
- Read error message
- Verify authentication token
- Check rate limits
- Review request body format

Ready to integrate! 🚀
