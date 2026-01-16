# Backend Technical Documentation

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Database Design](#4-database-design)
5. [Authentication & Security](#5-authentication--security)
6. [Services & Business Logic](#6-services--business-logic)
7. [API Endpoints](#7-api-endpoints)
8. [Error Handling](#8-error-handling)
9. [Deployment & Configuration](#9-deployment--configuration)

---

## 1. System Overview

### Purpose
The Business AI Assistant backend is a robust REST API designed to power intelligent customer engagement platforms. It enables businesses to upload their proprietary knowledge (documents, websites), trains an AI agent on that knowledge, and deploys it via a chat widget to answer customer queries 24/7. Crucially, it also acts as a lead generation engine, extracting visitor contact info and scoring leads based on interaction quality.

### Core Capabilities
- **Multi-Tenancy:** Single instance supports multiple isolated business accounts.
- **RAG (Retrieval-Augmented Generation):** Fetches relevant snippets from uploaded documents to ground AI responses.
- **Hybrid AI Pipeline:** Primary integration with OpenAI (GPT-4o), with automatic fallback to Google Gemini.
- **Web Scraping:** Headless browser integration (Puppeteer) to ingest content from Javascript-heavy websites (SPAs).
- **Lead Intelligence:** Automatic extraction of emails and phones from chat; scoring algorithm based on engagement.

---

## 2. Technology Stack

### Core Runtime
- **Runtime:** Node.js v20+
- **Framework:** Express.js v4.18+
- **Language:** JavaScript (CommonJS)

### Data Persistence
- **Database:** MongoDB Atlas (Mongoose v8 ODM)
- **Search:** MongoDB Text Search (for document retrieval)

### AI & Processing
- **LLM Provider:** OpenAI API (GPT-4o-mini)
- **Fallback LLM:** Google Gemini API
- **Web Scraper:** Puppeteer (Headless Chrome)
- **PDF/Doc Parsing:** `pdf-parse`, `mammoth`

### Security
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** `bcryptjs` (Password hashing)
- **Protection:** `helmet` (Headers), `express-rate-limit`, `xss-clean`, `express-mongo-sanitize`

---

## 3. Architecture

The system follows a layered **MVC (Model-View-Controller)** pattern, adapted for an API-only backend (Service-Controller-Route).

### Layer Breakdown

1.  **Route Layer (`/src/routes`)**
    - Defines API endpoints.
    - Applies route-specific middleware (validation, rate limiting, auth).
    - Delegates execution to Controllers.

2.  **Controller Layer (`/src/controllers`)**
    - Handles HTTP requests/responses.
    - Extracts data from `req.body` / `req.params`.
    - Calls Services for business logic.
    - Formats success/error responses.

3.  **Service Layer (`/src/services`)**
    - Contains the core business logic.
    - Reusable functions (e.g., `ai.service.js`, `lead.service.js`).
    - Interacts with Models and External APIs.
    - **Key Service:** `AI Service` handles the RAG pipeline and provider fallback.

4.  **Data Layer (`/src/models`)**
    - Mongoose Schemas defining data structure.
    - Handles database validation and hooks.

---

## 4. Database Design

### User Model
- **_id:** ObjectId
- **email:** String (Unique)
- **password:** String (Bcrypt Hash)
- **businessId:** Ref -> Business

### Business Model
- **_id:** ObjectId
- **name:** String
- **slug:** String (Unique, for public widget URL)
- **owner:** Ref -> User
- **settings:** Object (AI configurations)

### Document Model
- **_id:** ObjectId
- **businessId:** Ref -> Business
- **textContent:** String (Indexed for Search)
- **originalName:** String
- **type:** 'pdf' | 'url' | 'text'

### Lead Model
- **_id:** ObjectId
- **businessId:** Ref -> Business
- **sessionId:** String (Unique visitor ID)
- **email:** String (Captured from chat)
- **leadScore:** Number (0-100)
- **chatHistory:** Array (Recent messages)

---

## 5. Authentication & Security

### JWT Implementation
Authentication is handled via stateless JSON Web Tokens.
- **Issuer:** `authenticate` middleware in `auth.middleware.js`.
- **Payload:** Contains `userId`, `businessId`, and `role`.
- **Expiration:** 7 days.

### Access Control
- **Public Routes:** Login, Register, Public Chat Widget.
- **Protected Routes:** Dashboard data, Document upload.
- **Owner-Only Routes:** Business settings updates.

### Rate Limiting
Strict rate limits are applied to prevent abuse:
- **Auth:** 10 attempts / hour (prevents brute force).
- **Public Chat:** 20 messages / 15 mins (prevents API cost spikes).
- **API (General):** 100 requests / 15 mins.

---

## 6. Services & Business Logic

### AI Service (`ai.service.js`)
This service manages the interaction with LLMs.
1.  **RAG Pipeline:**
    - Receives user question.
    - Finds relevant document chunks using `search.service.js`.
    - Constructs a prompt: `System Instructions + Context + Question`.
2.  **Provider Fallback:**
    - **Attempt 1:** Call OpenAI (GPT-4o-mini).
    - **Error?** Log and switch to Attempt 2.
    - **Attempt 2:** Call Google Gemini (Flash model).
    - **Error?** Return Mock response (Dev mode) or general error.
3.  **Lead Trigger:**
    - Instructions prompt the AI to append `<LEAD_CAPTURE_TRIGGER>` if the user exhibits buying intent.

### URL Scraper Service (`urlScraper.service.js`)
Handles ingesting content from websites.
- **Tool:** Puppeteer (Headless Chrome).
- **Optimization:** Blocks images/fonts to speed up loading.
- **SPA Support:** Waits for `networkidle2` to ensure JS-rendered content loads.
- **Text Extraction:** Uses `cheerio` to strip scripts/styles and extract meaningful `<main>` or `<body>` text.

### Lead Service (`lead.service.js`)
Manages visitor data and scoring.
- **Scoring Algorithm:**
    - Email provided: +30 points
    - Phone provided: +20 points
    - Engagement (messages): +2 points per message.
    - Buying Intent (keywords): +10 points.
- **Extraction:** Regex scanning of chat messages for email/phone patterns.

---

## 7. API Endpoints

(See `API_DOCUMENTATION.md` for full reference)

### Key Workflows

**1. Document Upload Workflow**
- User POSTs file to `/api/documents/upload`.
- `upload.middleware` handles multipart parsing.
- `extraction.service` identifies MIME type (PDF/DOCX) and extracts raw text.
- Text is cleaned and saved to MongoDB `documents` collection with a Text Index.

**2. Chat Workflow**
- Public widget POSTs to `/api/chat/public/:slug`.
- Backend validates `slug` and retrieves `Business`.
- `search.service` finds top 3 matching document chunks.
- `ai.service` generates response with context.
- `lead.service` analyzes message for contact info & updates lead score.
- Response returned to widget.

---

## 8. Error Handling

Global error handler in `server.js` captures all exceptions.

**Operational Errors:**
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Bad JWT.
- `429 Too Many Requests`: Rate limit hit.

**System Errors:**
- `500 Internal Server Error`: Unhandled exceptions (logged to `winston`).
- Connection failures (MongoDB/OpenAI) trigger graceful degradation where possible.

---

## 9. Deployment & Configuration

### Environment Variables
Required in `.env`:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `FRONTEND_URL` (for CORS)

### Puppeteer on Render
Render.com requires specific setup for Puppeteer:
- **Build Command:** `npm install`
- **Post-Install:** `npx puppeteer browsers install chrome`
- **Env Var:** `PUPPETEER_CACHE_DIR` set to internal cache path.
- **Config:** `.puppeteerrc.cjs` configures local cache.
