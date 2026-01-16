# System Documentation

## Table of Contents

### Part 1: Overview
1. [Introduction](#1-introduction)
2. [How It Works](#2-how-it-works)
3. [Architecture Overview](#3-architecture-overview)

### Part 2: User Guide
4. [Getting Started](#4-getting-started)
5. [Managing Documents](#5-managing-documents)
6. [Using the Dashboard](#6-using-the-dashboard)
7. [Integrating the Widget](#7-integrating-the-widget)

### Part 3: Developer Guide
8. [Setup Guide](#8-setup-guide)
9. [Project Structure](#9-project-structure)
10. [Troubleshooting](#10-troubleshooting)

---

## Part 1: Overview

## 1. Introduction
The Business AI Assistant is a unified platform that brings AI-powered customer support to small and medium businesses. It allows business owners to train a chatbot on their own specific documents and data, and then deploy that chatbot to their website to answer visitor questions and capture leads automatically.

## 2. How It Works
1.  **Business Setup:** A business owner creates an account.
2.  **Knowledge Ingestion:** They upload PDFs, Word docs, or link their website.
3.  **AI Training:** The system indexes this content using vector embeddings.
4.  **Deployment:** A snippet of code is added to the business website.
5.  **Interaction:** Visitors chat with the AI. The AI answers using the uploaded knowledge.
6.  **Lead Capture:** If a visitor shows interest (e.g., asking for price), the AI captures their email/phone and adds them to the Leads Dashboard.

## 3. Architecture Overview
The system relies on a Modern Javascript Stack:
- **Frontend:** React + Vite (Fast, responsive UI)
- **Backend:** Node.js + Express (Robust API)
- **Database:** MongoDB Atlas (Flexible schema + Text Search)
- **AI Core:** OpenAI GPT-4 + Google Gemini (Dual-provider reliability)
- **Infrastructure:** Render (Hosting)

---

## Part 2: User Guide

## 4. Getting Started
To begin, navigate to the deployed application URL.
1.  Click **Register**.
2.  Enter your Name, Email, Password, and your **Business Name**.
3.  Upon success, you will be redirected to the Dashboard.

## 5. Managing Documents
The core of the AI's intelligence is your documents.
1.  Go to the **Documents** tab.
2.  **Upload File:** Drag & drop a PDF, DOCX, or TXT file. The system will process it immediately.
3.  **Add URL:** Enter a URL (e.g., your pricing page). The system will scrape the text and learn it.

## 6. Using the Dashboard
The dashboard is your command center.
- **Documents:** See what the AI knows.
- **Leads:** View potential customers captured by the chat.
    - **Score:** 0-100 indicating how "hot" the lead is.
    - **Details:** Click a lead to see the full chat transcript.
- **Settings:** Configure your AI model (GPT-4 vs Gemini) and lead scoring triggers.

## 7. Integrating the Widget
To add the chat to your site:
1.  Go to **Settings**.
2.  Copy the **Embed Code**.
3.  Paste it before the closing `</body>` tag of your website HTML.
4.  The widget will appear instantly.

---

## Part 3: Developer Guide

## 8. Setup Guide
**Prerequisites:** Node.js v20+, MongoDB URI.

1.  **Clone:** `git clone <repo>`
2.  **Install:**
    ```bash
    npm install
    cd frontend && npm install
    cd backend && npm install
    ```
3.  **Env:** Copy `.env.example` to `.env` in both `frontend/` and `backend/`.
4.  **Run:** `npm run dev` (Runs both client and server).

## 9. Project Structure
- `frontend/`: React Application
    - `src/components/`: Reusable UI (ChatWidget, Dropzone)
    - `src/pages/`: Main views (Dashboard, Login)
- `backend/`: Express API
    - `src/routes/`: API definitions
    - `src/controllers/`: Request handling
    - `src/services/`: Business logic (AI, Scraping)
    - `src/models/`: Database schemas

## 10. Troubleshooting
- **AI not answering?** Check if you uploaded documents. Empty knowledge base = generic answers.
- **404 on Refresh?** This is an SPA. Ensure your server has Rewrite Rules (`/* -> /index.html`).
- **Scraper failing?** Ensure Puppeteer environment variables are set correctly on Render.
