# API Documentation

## Base URL
```
Development: http://localhost:3000
Production: https://api.yourdomain.com
```

## Authentication

### Register User
**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account and business profile.

**Request Body:**
```json
{
  "firstName": "String (required)",
  "lastName": "String (required)",
  "email": "String (required, valid email)",
  "password": "String (required, min 8 chars)",
  "businessName": "String (required)",
  "businessSlug": "String (required, unique)"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "token": "String (JWT)",
  "user": {
    "id": "ObjectId",
    "email": "String",
    "role": "owner"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (e.g., email already exists)

### Login User
**Endpoint:** `POST /api/auth/login`
**Description:** Authenticate user and get token.

**Request Body:**
```json
{
  "email": "String (required)",
  "password": "String (required)"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "token": "String (JWT)"
}
```

### Get Current User
**Endpoint:** `GET /api/auth/me`
**Headers:** `Authorization: Bearer <token>`
**Success Response:** `200 OK` (User profile data)

---

## Business Endpoints

### Get Public Business Info
**Endpoint:** `GET /api/business/public/:slug`
**Description:** Get public details for chat interface.
**Success Response:** `200 OK`
```json
{
  "success": true,
  "business": {
    "businessName": "String",
    "chatSettings": { ... }
  }
}
```

### Get Business Profile
**Endpoint:** `GET /api/business/:id/profile`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get full business profile (protected).

### Update Settings
**Endpoint:** `PUT /api/business/:id/settings`
**Headers:** `Authorization: Bearer <token>`
**Description:** Update business settings (Owner only).

---

## Document Endpoints

### Upload Document
**Endpoint:** `POST /api/documents/upload`
**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`
**Body:** `file` (Binary)
**Description:** Upload PDF, DOCX, or TXT for RAG.

### Add URL
**Endpoint:** `POST /api/documents/add-url`
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "url": "String",
  "autoRefresh": { "enabled": true, "frequency": "weekly" }
}
```
**Description:** Add a website URL to be scraped and used for RAG.

### List Documents
**Endpoint:** `GET /api/documents`
**Headers:** `Authorization: Bearer <token>`
**Description:** List all documents for the authenticated user's business.

### Search Documents
**Endpoint:** `GET /api/documents/search?q=query`
**Headers:** `Authorization: Bearer <token>`
**Description:** Semantic/Text search through documents.

---

## Chat Endpoints

### Public Chat
**Endpoint:** `POST /api/chat/public/:businessSlug`

**Description:** Send message to business AI assistant (No auth required).

**Request Body:**
```json
{
  "message": "String (required)",
  "sessionId": "String (required, unique per visitor)"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "reply": "String (AI response from RAG)",
  "sources": [{ "title": "Doc Title", "url": "..." }]
}
```

---

## Lead Endpoints

### Capture Lead
**Endpoint:** `POST /api/leads/capture`
**Description:** Capture contact info from chat session.
**Body:** `{ "sessionId": "...", "businessSlug": "...", "email": "..." }`

### Get Leads
**Endpoint:** `GET /api/leads/business/:businessId`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get all leads for the business.

### Export Leads
**Endpoint:** `GET /api/leads/business/:businessId/export/csv`
**Headers:** `Authorization: Bearer <token>`
**Description:** Download leads as CSV.

---

## Health Check

### Health
**Endpoint:** `GET /api/health`
**Description:** Check server and database status.
**Response:** `200 OK` `{ "status": "ok", "services": { ... } }`

### Ping
**Endpoint:** `GET /api/health/ping`
**Response:** `200 OK` `{ "status": "ok", "message": "pong" }`
