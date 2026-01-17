# API Documentation

## Table of Contents
1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Authentication](#3-authentication)
4. [Rate Limiting](#4-rate-limiting)
5. [Error Handling](#5-error-handling)
6. [API Endpoints](#6-api-endpoints)
   - [System](#system-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Business](#business-endpoints)
   - [Documents](#document-endpoints)
   - [Chat](#chat-endpoints)
   - [Leads](#lead-endpoints)
7. [Changelog](#7-changelog)

---

## 1. Introduction

### Overview
The Business AI Assistant API is a powerful RESTful interface that enables businesses to create AI-powered customer support agents. It allows for document ingestion, AI training, real-time chat, and automated lead generation.

### Key Features
- **AI Chat:** Integrate GPT-4 powered chat widgets into any website.
- **Document Processing:** Upload PDFs, Word docs, or scrape URLs to train the AI.
- **Lead Capture:** Automatically extract and score leads from conversations.
- **Multi-Tenant:** Support for multiple businesses and users.

### Base URLs
- **Production:** `https://your-api-domain.com` (e.g., on Render)
- **Development:** `http://localhost:3000`

### API Version
- **Current Version:** 1.0.0
- **Versioning Strategy:** URI Versioning (future: `/api/v2/...`)

---

## 2. Getting Started

### Quick Start

1.  **Register a Business Account:**
    Send a `POST` request to `/api/auth/register` with your business and user details.

2.  **Get Your Token:**
    The registration response includes a JWT `token`. Include this in the `Authorization` header for subsequent requests.

3.  **Upload Knowledge:**
    Use `/api/documents/upload` to upload a PDF or `/api/documents/add-url` to scrape your website.

4.  **Embed Chat:**
    Use your `businessSlug` to connect the frontend chat widget to `/api/chat/public/:businessSlug`.

### Prerequisites
- HTTP Client (Postman, curl, axios)
- HTTPS is required for all production requests.

---

## 3. Authentication

The API uses **JSON Web Tokens (JWT)** for authentication.

### How to Authenticate
1.  Obtain a token via `/api/auth/login` or `/api/auth/register`.
2.  Include the token in the **Authorization** header of every protected request.

**Header Format:**
```http
Authorization: Bearer <your_jwt_token>
```

### Security Best Practices
- **Token Storage:** Store tokens securely (e.g., `httpOnly` cookies or secure local storage).
- **Expiration:** Tokens expire after 7 days. Handle 401 errors by redirecting to login.
- **HTTPS:** Never send tokens over plain HTTP.

---

## 4. Rate Limiting

To ensure service stability, the API implements rate limiting.

### Limits
- **Global Limit:** 100 requests per 15 minutes per IP.
- **Auth Limit:** 10 login attempts per hour per IP.
- **Chat Limit:** 20 chat messages per 15 minutes per IP.
- **Scraper Limit:** Specific limits apply to URL scraping endpoints.

### Headers
rate-limited responses include standard headers:
- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset`

---

## 5. Error Handling

The API returns standard HTTP status codes and a consistent JSON error format.

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional validation details
  }
}
```

### Common Status Codes
- **200 OK:** Success.
- **201 Created:** Resource successfully created.
- **400 Bad Request:** specific validation failed.
- **401 Unauthorized:** Missing or invalid token.
- **403 Forbidden:** Valid token but insufficient permissions.
- **404 Not Found:** Resource not found.
- **429 Too Many Requests:** Rate limit exceeded.
- **500 Internal Server Error:** Server-side issue.

---

## 6. API Endpoints

### System Endpoints

#### Check API Health
**Endpoint:** `GET /api/health`
**Authentication:** Not Required
**Description:** Returns the operational status of the API and database.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:00:00.000Z",
  "services": {
    "api": "operational",
    "mongodb": "connected"
  }
}
```

---

### Authentication Endpoints

#### Register Business
**Endpoint:** `POST /api/auth/register`
**Authentication:** Not Required
**Description:** Creates a new user account and a new business entity.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "businessName": "John's Coffee",
  "industry": "Retail"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "email": "..." },
  "business": { "id": "...", "name": "John's Coffee", "slug": "johns-coffee" }
}
```

#### Login
**Endpoint:** `POST /api/auth/login`
**Authentication:** Not Required
**Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { ... },
  "business": { ... }
}
```

#### Get Current User
**Endpoint:** `GET /api/auth/me`
**Authentication:** Required
**Description:** Returns the profile of the currently authenticated user.

---

### Business Endpoints

#### Get Public Business Info
**Endpoint:** `GET /api/business/public/:slug`
**Authentication:** Not Required
**Description:** Retrieves public information for a business (used by chat widget).

**Path Parameters:**
- `slug`: Business URL slug (e.g., `johns-coffee`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "name": "John's Coffee",
    "slug": "johns-coffee",
    "industry": "Retail"
  }
}
```

#### Get Business Profile
**Endpoint:** `GET /api/business/:id/profile`
**Authentication:** Required (Member)
**Description:** Get full details of a business.

#### Update Settings
**Endpoint:** `PUT /api/business/:id/settings`
**Authentication:** Required (Owner)
**Description:** Update business configuration (AI model, lead scoring).

**Request Body:**
```json
{
  "description": "Premium coffee shop...",
  "website": "https://johnscoffee.com",
  "settings": {
    "aiModel": "gpt-4",
    "leadScoring": { "enabled": true }
  }
}
```

---

### Document Endpoints

#### Upload Document
**Endpoint:** `POST /api/documents/upload`
**Authentication:** Required
**Content-Type:** `multipart/form-data`

**Request Body:**
- `document`: File (PDF, DOCX, TXT) - Max 5MB

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "originalName": "menu.pdf",
    "status": "processed",
    "chunkCount": 5
  }
}
```

#### Add URL for Scraping
**Endpoint:** `POST /api/documents/add-url`
**Authentication:** Required
**Description:** Scrapes a webpage and adds it as a document.

**Request Body:**
```json
{
  "url": "https://johnscoffee.com/menu",
  "autoRefresh": { "enabled": true, "frequency": "weekly" }
}
```

#### Preview URL Content
**Endpoint:** `POST /api/documents/preview-url`
**Authentication:** Required
**Description:** Scrapes content from a URL using our intelligent multi-zone extractor and returns a preview without saving to the knowledge base.

**Request Body:**
```json
{
  "url": "https://example.com/page"
}
```

**Response (Success):** `200 OK`
```json
{
  "success": true,
  "message": "Preview generated successfully",
  "data": {
    "title": "Page Title",
    "url": "https://example.com/page",
    "content": "Full content with section markers:\n\n=== NAVIGATION SECTION ===\nHome | Products | About\n\n=== MAIN SECTION ===\nMain page content...\n\n=== SIDEBAR SECTION ===\nPricing: $499/mo\n\n=== FOOTER SECTION ===\nContact: info@example.com",
    "preview": "First 500 characters...",
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

**Response (Error):** `422 Unprocessable Entity`
```json
{
  "success": false,
  "error": {
    "code": "SCRAPE_FAILED",
    "message": "Website took too long to respond (Timeout)."
  }
}
```

**Content Structure:**

The scraped content includes section markers for different page zones:

- `=== NAVIGATION SECTION ===`: Menu items, categories, top navigation
- `=== MAIN SECTION ===`: Primary page content (articles, products, etc.)
- `=== SIDEBAR SECTION ===`: Supplementary info (pricing, features, specs)
- `=== FOOTER SECTION ===`: Contact info, hours, locations

This ensures ALL valuable content is preserved, regardless of location on the page.

**Supported Website Types:**
- E-commerce sites (Shopify, WooCommerce, custom)
- Blogs (WordPress, Medium, Ghost, custom CMS)
- Documentation sites
- Company websites
- News articles
- Forums
- Any website with text content

**Error Codes:**

| Status | Error Code | Message |
|--------|-----------|---------|
| 400 | MISSING_URL | URL is required |
| 400 | INVALID_URL | Please provide a valid URL starting with http:// or https:// |
| 422 | SCRAPE_FAILED | Failed to scrape URL content |
| 422 | INSUFFICIENT_CONTENT | Content too short or page appears empty |
| 500 | PREVIEW_ERROR | Failed to generate preview |

**User-Friendly Error Messages:**

The scraper provides clear, actionable error messages:
- "Website took too long to respond (Timeout)."
- "Website is blocking automated access (403)."
- "Page not found (404)."
- "Network error: Unable to reach website."

#### List Documents
**Endpoint:** `GET /api/documents`
**Authentication:** Required
**Description:** Returns all documents for the user's business.

---

### Chat Endpoints

#### Public Chat
**Endpoint:** `POST /api/chat/public/:businessSlug`
**Authentication:** Not Required (Rate Limited)
**Description:** Send a message to the AI assistant.

**Path Parameters:**
- `businessSlug`: Identity of the business.

**Request Body:**
```json
{
  "message": "Do you sell latte?",
  "history": [ ... ], // Optional previous messages
  "sessionId": "uuid-v4" // Optional session tracking
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "response": "Yes, we serve a variety of lattes...",
    "role": "assistant"
  }
}
```

---

### Lead Endpoints

#### Capture Lead
**Endpoint:** `POST /api/leads/capture`
**Authentication:** Not Required
**Description:** Records lead information extracted from chat.

**Request Body:**
```json
{
  "businessId": "...",
  "name": "Sarah Smith", // Optional
  "email": "sarah@example.com", // Optional
  "phone": "555-0123", // Optional
  "source": "chat_widget"
}
```

#### List Leads
**Endpoint:** `GET /api/leads/business/:businessId`
**Authentication:** Required
**Description:** Get all leads for the dashboard.

#### Export Leads
**Endpoint:** `GET /api/leads/business/:businessId/export/csv`
**Authentication:** Required
**Description:** Download leads as a CSV file.

---

## 7. Changelog

### v1.0.0 (2026-01-15)
- Initial release
- Complete Auth system (Register/Login)
- Document Upload & URL Scraping
- OpenAI RAG Integration
- Dashboard API
- Public Chat Widget API
