# API Reference

## Overview

**Base URL (Production):** `https://pam-ai-ww00.onrender.com`  
**Base URL (Local):** `http://localhost:3000`  
**API Version:** `1.0.0`   
**Content-Type:** `application/json`

The Business AI Assistant API provides a robust set of endpoints for managing business profiles, knowledge bases (documents and URLs), and building AI-powered chat interfaces that use your specific business data.

---

## Authentication

All protected routes require a JSON Web Token (JWT) in the `Authorization` header.

```http
Authorization: Bearer <valid_jwt_token>
```

Tokens are obtained via the `/api/auth/register` or `/api/auth/login` endpoints.

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Business Management Endpoints](#business-management-endpoints)
3. [Knowledge Base (Documents)](#knowledge-base-documents)
4. [AI Chat Endpoints](#ai-chat-endpoints)
5. [Lead Management](#lead-management)
6. [System Health](#system-health)

---

## Authentication Endpoints

### Register Business
Create a new business account and owner user.

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Acme Corp",
    "industry": "Technology"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN_HERE",
    "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "..." },
    "business": { "id": "...", "name": "...", "slug": "...", "role": "owner" }
  }
  ```

### Login
Authenticate and receive a JWT token.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (200):** Same as Register.

### Get Current Profile
Fetch the authenticated user's profile and active business context.

- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response (200):** Returns user and business details.

---

## Business Management Endpoints

### Get Public Info
Fetch public branding and chat settings for a business via its slug.

- **URL:** `/api/business/public/:slug`
- **Method:** `GET`
- **Auth Required:** No
- **Success Response (200):** Returns `businessName`, `chatSettings`, `branding`.

### Get Business Profile
Fetch the full profile of a business.

- **URL:** `/api/business/:id/profile`
- **Method:** `GET`
- **Auth Required:** Yes (Member)

### Update Settings
Update business industry, branding, or chat settings.

- **URL:** `/api/business/:id/settings`
- **Method:** `PUT`
- **Auth Required:** Yes (Owner)
- **Request Body:**
  ```json
  {
    "industry": "Retail",
    "chatSettings": {
      "isPublic": true,
      "welcomeMessage": "Hello! How can we help?",
      "primaryColor": "#FF5733"
    },
    "branding": {
      "logoUrl": "https://...",
      "websiteUrl": "https://..."
    }
  }
  ```

---

## Knowledge Base (Documents)

### Upload File
Upload a PDF, DOCX, TXT, CSV, or MD file.

- **URL:** `/api/documents/upload`
- **Method:** `POST`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Fields:** 
  - `document`: File (max 5MB)

### Preview URL
Scrape and analyze a URL before adding it.

- **URL:** `/api/documents/preview-url`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:** `{ "url": "https://..." }`
- **Success Response (200):** Returns scanned title, summary, word counts, and estimated read time.

### Add URL
Add a website to the knowledge base.

- **URL:** `/api/documents/add-url`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:** 
  ```json
  {
    "url": "https://...",
    "autoRefresh": {
      "enabled": true,
      "frequency": "weekly"
    }
  }
  ```

### List Documents
Get all documents for the business knowledge base.

- **URL:** `/api/documents`
- **Method:** `GET`
- **Query Params:** `page`, `limit` (default 10)

### Delete Document
Remove a document or URL.

- **URL:** `/api/documents/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes

---

## AI Chat Endpoints

### Public Chat
The main endpoint for the customer-facing chat widget.

- **URL:** `/api/chat/public/:businessSlug`
- **Method:** `POST`
- **Auth Required:** No (Throttled)
- **Request Body:**
  ```json
  {
    "question": "What are your shipping rates?",
    "sessionId": "optional-uuid"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "answer": "AI Generated Answer...",
    "sessionId": "...",
    "references": [{ "filename": "Shipping.pdf", "score": 0.85 }]
  }
  ```

---

## Lead Management

### Capture Lead
Update or complete lead information collected during chat.

- **URL:** `/api/leads/capture`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "businessSlug": "my-shop",
    "sessionId": "...",
    "data": {
      "name": "Jane User",
      "email": "jane@example.com",
      "phone": "+123456789"
    }
  }
  ```

### List Leads
View all captured leads for a business.

- **URL:** `/api/leads/business/:businessId`
- **Method:** `GET`
- **Auth Required:** Yes

---

## System Health

### Full Health Check
- **URL:** `/api/health`
- **Method:** `GET`
- **Description:** Returns status of API and Database.

### Ping
- **URL:** `/api/health/ping`
- **Method:** `GET`
- **Description:** Minimal response for uptime monitoring.
