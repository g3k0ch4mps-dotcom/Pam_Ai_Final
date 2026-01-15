# Business AI Assistant (Pam AI)

## 🎯 Overview
Business AI Assistant is a comprehensive solution designed to automate customer interactions, capture leads, and manage business documents using advanced AI technologies. It features RAG (Retrieval-Augmented Generation) to answer customer queries based on uploaded business documents and scraped website content.

## ✨ Features
- **AI-Powered Chat**: Intelligent responses using OpenAI GPT-4.
- **RAG System**: Context-aware answers from your PDFs, Docx, and URLs.
- **Lead Capture**: Automatically collects visitor contact info during chat.
- **Multi-Business Support**: SaaS-ready architecture for multiple business profiles.
- **Document Management**: Upload, index, and search business knowledge base.
- **URL Scraping**: Add your website URL to train the AI.

## 🛠️ Technology Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React, Vite, TailwindCSS
- **AI Engine**: OpenAI API (GPT-4), Google Gemini (Fallback)
- **Infrastructure**: Docker, Nginx, PM2

[Read full Technology Stack documentation](docs/TECHNOLOGY_STACK.md)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- MongoDB Atlas account
- OpenAI API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
    cd Pam_Ai_Final
    ```

2.  **Install Dependencies**
    ```bash
    # (Coming soon: One-command install)
    npm install
    cd frontend && npm install && cd ..
    ```

3.  **Environment Setup**
    - Copy `.env.example` to `.env` in the root (for backend).
    - Copy `frontend/.env.example` to `frontend/.env` (if applicable).
    
    Update `.env` with your API keys:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_key
    ```

4.  **Run Development Servers**
    ```bash
    # Terminal 1: Backend
    npm run dev
    
    # Terminal 2: Frontend
    cd frontend
    npm run dev
    ```

## 📚 Documentation
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Backend Documentation](docs/BACKEND_DOCUMENTATION.md)
- [Frontend Documentation](docs/FRONTEND_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)

## 🌐 Live Demos
- **Frontend**: [Render URL]
- **Backend API**: [Render URL]

## 📄 License
MIT
