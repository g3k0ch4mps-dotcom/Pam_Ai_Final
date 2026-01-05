# Incremental Delivery Plan: Business AI Assistant

## 1. Delivery Strategy Overview

**Why Incremental Delivery?**  
Delivering the "Elephant" one bite at a time reduces risk and accelerates time-to-value. Instead of waiting for a "Big Bang" release, we will hand over the system in 5 fully functional, independent layers. This allows your team to integrate, test, and master each component before adding complexity.

**Organization**  
Deliveries are organized by **Functional Value**. each increment provides a specific business capability that can be verified immediately.

**Testing Protocol**  
For each delivery:
1.  **Deployment**: We deploy the code to your environment.
2.  **Smoke Test**: We run a "Happy Path" test to prove it works.
3.  **Acceptance**: Your team verifies using the provided Curl/Postman commands.
4.  **Sign-off**: We proceed to the next layer.

**Timeline**  
The entire handover can be completed in **2 Days**, assuming immediate feedback.
*   Day 1: Deploying Foundation, Auth, and Business Identity.
*   Day 2: Enabling Knowledge Base and AI System.

---

## 2. Delivery Prerequisites

**Before starting Delivery #1, please ensure:**

*   [ ] **Hosting Account**: Account created on Railway, Render, or Heroku.
*   [ ] **Database**: MongoDB Atlas Cluster created (M0 Free Tier is fine).
*   [ ] **AI Credentials**: OpenAI API Key (and optionally Google Gemini API Key).
*   [ ] **Source Code**: Access to the Git repository.
*   [ ] **Tools**: Postman installed for API testing.

---

## 3. Delivery Breakdown Structure

### Delivery #1: The Foundation Layer
**Scope**: Server Infrastructure, Database Connection, Security Headers, Health Checks.
**Business Value**: Establishes the "Home Base". Proves that the server can talk to the database and is secure from basic attacks.

**Delivery Format:**
*   **Endpoints**: `GET /api/health`
*   **Functionality**:
    *   Express Server running.
    *   MongoDB Connected.
    *   Helmet/CORS Security active.
*   **Verification**:
    ```bash
    curl https://your-app-url.com/api/health
    # Expected: {"status": "ok", "services": {"database": "connected"}}
    ```

---

### Delivery #2: The Gatekeeper (Authentication)
**Scope**: User Registration, Login, Password Hashing, JWT Token Generation.
**Business Value**: Enables secure access. Without this, no data can be protected.

**Delivery Format:**
*   **Endpoints**:
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
*   **Functionality**:
    *   Admins can create accounts.
    *   Passwords are encrypted (bcrypt).
    *   Login returns a secure Access Token.
*   **Verification**:
    1.  Register a new user via Postman.
    2.  Login with that user.
    3.  Receive a `token` string starting with `eyJ...`.

---

### Delivery #3: Business Identity
**Scope**: Business Profiles, Settings Management, Multi-tenancy Setup.
**Business Value**: Defines *who* is using the system. Allows customization of the chat experience.

**Delivery Format:**
*   **Endpoints**:
    *   `GET /api/business/:id/profile`
    *   `PUT /api/business/:id/settings`
*   **Functionality**:
    *   Update Brand Colors.
    *   Set "Welcome Message".
    *   Verify Data Isolation (Business A cannot see Business B).
*   **Verification**:
    *   Use the Token from Step #2 to update your business logo color.
    *   Fetch the profile to confirm it saved.

---

### Delivery #4: The Knowledge Base
**Scope**: File Uploads, Text Extraction Pipeline, Search Indexing.
**Business Value**: The "Brain" of the operation. Allows the system to actually know things about the business.

**Delivery Format:**
*   **Endpoints**:
    *   `POST /api/documents/upload`
    *   `GET /api/documents`
*   **Functionality**:
    *   Upload PDF/DOCX/TXT files.
    *   Text is automatically extracted.
    *   Text is indexed in MongoDB for search.
*   **Verification**:
    *   Upload a PDF menu.
    *   Call `GET /api/documents` to see it listed.
    *   (Internal Check): Verify text appears in database.

---

### Delivery #5: The AI Intelligence (MVP)
**Scope**: Public Chat Endpoint, RAG Logic, AI Failover System.
**Business Value**: The product itself. Automated customer support.

**Delivery Format:**
*   **Endpoints**:
    *   `POST /api/chat/public`
*   **Functionality**:
    *   User asks a question.
    *   System searches documents from Delivery #4.
    *   System generates answer using OpenAI (or Gemini fallback).
*   **Verification**:
    *   Ask: "What are your prices?" (Assuming you uploaded a price list).
    *   Receive: A specific answer based *only* on your uploaded file.

---

## 4. Rollback and Risk Plan

In case of critical failure during a delivery:

| Trigger | Action |
| :--- | :--- |
| **Database Connection Fail** | Rollback env vars to previous working snapshot. Check IP Allowlist. |
| **Auth Fail (Locked out)** | Admin manual reset via MongoDB Compass. |
| **AI Hallucinations** | Increase "Temperature" strictness in system prompt. |
| **Cost Spike** | Enable "Strict Mode" rate limiting (already built-in). |

---

*This plan ensures you always have a working system at end-of-day, minimizing the "it works on my machine" syndrome.*
