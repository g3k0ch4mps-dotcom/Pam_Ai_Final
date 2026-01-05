# System Owner Documentation: Pamilo Business AI Assistant

## 1. Executive Summary

**Project Overview**  
The **Pamilo Business AI Assistant** is a custom-built, intelligent customer support platform designed to empower businesses to automate customer interactions. It allows business owners to upload their own internal documents (PDFs, Word docs, text files) and instantly provides a "smart" chat widget that can answer customer questions based *only* on that specific business's knowledge.

**Value Proposition**  
- **24/7 Availability**: Automated responses to customer queries at any time.
- **Data Privacy & Isolation**: Each business's data is strictly isolated; Business A's AI never learns from Business B's documents.
- **Resilient AI**: Our "Hybrid Intelligence" system tries to use OpenAI first, but automatically falls back to Google Gemini if OpenAI is down, ensuring maximum uptime.

**Current Status**  
We have successfully reached **Stage 6 (MVP Core Complete)**. 
- **Completed**: The entire backend core is functional: Authentication, Document Uploads, Text Search, and AI Chat are live.
- **Technology Stack**: Node.js/Express (Backend), MongoDB (Database), OpenAI GPT-4o-mini + Google Gemini (AI Engine).

---

## 2. System Architecture Overview

### How It Works: The "RAG" Pipeline
Our system uses a technique called **Retrieval-Augmented Generation (RAG)**. Here is the flow from a customer's perspective:

1.  **Customer Asks a Question** (e.g., "What are your opening hours?") via the public chat widget.
2.  **Search Phase**: The API consults our **MongoDB** database using full-text search to find specific paragraphs in the business's uploaded documents that mention relevant keywords.
3.  **Context Assembly**: We retrieve the most relevant text segments.
4.  **AI Generation (Hybrid Strategy)**: 
    *   **Primary**: We send the data to **OpenAI (GPT-4o-mini)**.
    *   **Fallback**: If OpenAI fails, the system *automatically* switches to **Google Gemini (Flash)** to ensure the customer still gets an answer.
5.  **Response**: The AI generates a natural language answer based *strictly* on the provided text.

### Component Interaction
-   **Express API**: The central hub that validates requests, checks security, and coordinates data flow.
-   **MongoDB**: Acts as both the secure data store and the search engine. By leveraging MongoDB's native text search (`$text`), we eliminated the need for complex external vector databases like ChromaDB.
-   **AI Services**: A dual-engine setup (OpenAI + Google) for high reliability.

---

## 3. API Endpoints Documentation

### A. Authentication Endpoints
*Secure entry points for business owners.*

| Endpoint | Method | Purpose | Function | Example Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | POST | **Onboarding** | Creates a new Business workspace and Admin User. Securely hashes passwords. | A restaurant owner signing up for the first time. |
| `/auth/login` | POST | **Access Control** | Verifies credentials and issues a secure "Pass" (JWT Token). | The owner logging in to manage their documents. |

### B. Business Management
*Configuration for strict business boundaries.*

| Endpoint | Method | Purpose | Function | Example Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `/business/:id/settings` | PUT | **Customization** | Updates chat welcome messages, colors, and visibility settings. | Changing the chat widget's primary color to match the brand. |
| `/business/:id/profile` | GET | **Review** | Retrieves full business details and subscription status. | Viewing current account settings. |

### C. Document Processing
*Ingesting business knowledge (Verified Implementation).*

| Endpoint | Method | Purpose | Function | Example Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `/documents/upload` | POST | **Ingestion** | Accepts files (PDF, DOCX, TXT), extracts text content via `pdf-parse`/`mammoth`, and indexes it. | Uploading a `menu_2024.pdf` so the AI knows the new prices. |
| `/documents` | GET | **Management** | Lists all active files for the logged-in business with pagination. | Verifying which documents are currently active. |
| `/documents/:id` | DELETE | **Removal** | Physically deletes the file and removes the database record. | Removing an outdated policy. |

### D. Public Chat Endpoints
*Customer-facing interaction (Verified Implementation).*

| Endpoint | Method | Purpose | Function | Example Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `/chat/public` | POST | **Q&A** | Searches knowledge base -> Calls AI (OpenAI/Gemini) -> Logs Chat -> Returns answer. | A customer asking "Do you offer vegan options?" |

---

## 4. Security Architecture

Our security uses a "Zero Trust" approach to protect data at every level, as verified in `src/server.js`.

### 1. JWT Authentication (JSON Web Tokens)
*   **Why Stateless?** Tokens are self-contained "badges" stored by the user. verified in `auth.middleware.js`.
*   **Benefit**: Lower server costs and high reliability.

### 2. Password Hashing (Bcrypt)
*   **The Mechanism**: Passwords are hashed before storage using bcrypt. Verified in `auth.service.js`.
*   **Scenario Prevented**: If the database was compromised, user passwords would remain safe.

### 3. Rate Limiting (Public Chat)
*   **The Limit**: 100 requests per 15 mins per IP (Global) + Specific limits on chat.
*   **Why?** Prevents "Denial of Service" attacks and controls OpenAI costs.

### 4. Helmet.js & Sanitation
*   **Implemented**: `helmet` (Headers), `xss-clean` (Script blocking), and `express-mongo-sanitize` (Injection prevention) are all active in `server.js`.

---

## 5. Database Design Rationale

**1. Documents Collection (Verified)**
*   **Field**: `textContent` - Contains the raw extracted text from uploads.
*   **Indexing**: A **Text Index** is active on `textContent`.
*   **Multi-Tenancy**: The search service (`search.service.js`) explicitly filters by `businessId` before searching.

**2. ChatLogs Collection (New Discovery)**
*   **Purpose**: Records every interaction for billing and analytics.
*   **Data Stored**: User Question, AI Response, Relevant Document IDs, Cost estimation, and IP Address.

**Why No Vector Database (ChromaDB)?**
*   **Decision**: We removed the Vector Database component.
*   **Reason**: For typical business documents (FAQ, Policy, Menus), keyword search is 90% as effective as "meaning" search (Vectors) but is **100% cheaper** and far less complex to manage.
*   **Benefit**: Drastically reduced operating costs and maintenance overhead.

---

## 6. Document Processing Pipeline (Verified)

1.  **Upload**: Middleware (`multer`) saves the file to `/uploads`.
2.  **Extraction**:
    *   **PDFs**: `pdf-parse` reads the text layer.
    *   **Word**: `mammoth` extracts raw text.
    *   **Text**: Native reading.
    *   *Note: If extraction fails, we log a warning but still save the file metadata.*
3.  **Indexing**: MongoDB automatically updates its internal text index for immediate searchability.

---

## 7. Hybrid AI Implementation (New Feature)

We have implemented a sophisticated **Failover System** in `ai.service.js`:

1.  **Attempt 1**: The system calls **OpenAI (GPT-4o-mini)**. This is the "Smartest" model.
2.  **Failure**: If OpenAI times out or errors...
3.  **Attempt 2**: The system immediately calls **Google Gemini (Flash)**.
4.  **Result**: The user never knows there was an error; they just get their answer.

**Why this matters**: This makes your business reliable even if one major AI provider has an outage.

---

## 8. Cost Analysis (Updated)

**Estimated Monthly Operating Costs (Startup Scale)**

| Component | Provider | Tier | Cost |
| :--- | :--- | :--- | :--- |
| **Database** | MongoDB Atlas | Free (M0 Shared) | **$0.00** |
| **Backend Hosting** | Railway / Render | Hobby / Starter | **~$5.00** |
| **AI Intelligence** | OpenAI / Gemini | Pay-per-use | **~$0.002 / question** |
| **Total Base Cost** | | | **~$5.00 / mo** |

---

## 9. Development Roadmap Progress

We are fast-tracking the 10-Stage Agile plan.

*   ✅ **Stage 1: Project Setup** - Infrastructure and basic API.
*   ✅ **Stage 2: Database Layer** - Schema design and connection logic.
*   ✅ **Stage 3: Authentication** - Secure registration and login.
*   ✅ **Stage 4: Business Management** - Profile and settings updates.
*   ✅ **Stage 5: Document Pipeline** - Uploads, text extraction, and storage.
*   ✅ **Stage 6: Public Chat (MVP)** - Live RAG system with AI failover.
*   ⬜ **Stage 7: Admin Dashboard** - Frontend for business owners (Next Priority).
*   ⬜ **Stage 8: Chat Widget** - Embeddable widget for customers (Next Priority).
*   ⬜ **Stage 9: QA & Security Audit** - Rigorous testing.
*   ⬜ **Stage 10: Production Launch** - Deployment to live servers.

**MVP Backend is COMPLETE. Focus is now shifting to Frontend.**

---

## 10. Risk Assessment & Mitigation

**1. Prompt Injection**
*   **Mitigation**: System prompts in `ai.service.js` strictly define the AI's persona as a "helpful assistant for [Business Name]" and command it to use *only* provided context.

**2. Data Privacy**
*   **Mitigation**: Hard-coded logic in `document.controller.js` and `search.service.js` enforces `{ businessId: ... }` on every database operation.

**3. Dependency Risks**
*   **Mitigation**: The **Gemini Fallback** system specifically mitigates the risk of OpenAI downtime.

---

## 11. Future Enhancement Opportunities

*   **Multi-Language Support**: Automatically translating Q&A for international customers.
*   **Analytics Dashboard**: Leveraging the data now collected in `ChatLog` to show owners popular questions.
*   **Frontend Integration**: The APIs are ready; we now need to build the React/Next.js interfaces.
