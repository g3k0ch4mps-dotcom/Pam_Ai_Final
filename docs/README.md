# Business AI Assistant API

AI-powered business assistant with RAG (Retrieval-Augmented Generation) capabilities.

## 🎯 Features

- 🤖 AI-powered customer chat (no login required)
- 📄 Document upload & processing (PDF, DOCX, TXT, CSV, MD, JSON)
- 🔒 Secure authentication & authorization
- 👥 Team management with roles and permissions
- 📊 Analytics dashboard
- 🏢 Multi-tenant architecture (multiple businesses)

## 🛠️ Tech Stack

- **Backend:** Node.js + Express.js
- **Databases:** MongoDB (user data) + ChromaDB (vector search)
- **AI Services:** OpenAI (embeddings + GPT-3.5-turbo)
- **Security:** JWT, bcrypt, Helmet, CORS, rate limiting

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js v18+ installed
- npm v9+ installed
- MongoDB (local or MongoDB Atlas account)
- OpenAI API key

## 🚀 Quick Start

### 1. Clone or Download

```bash
cd business-ai-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `OPENAI_API_KEY` - Your OpenAI API key

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Test the API

Open your browser or use curl:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 10.5,
  "services": {
    "api": "operational"
  }
}
```

## 📁 Project Structure

```
business-ai-assistant/
├── src/
│   ├── config/          # Database and service configurations
│   ├── models/          # MongoDB schemas
│   ├── middleware/      # Express middleware (auth, validation, etc.)
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic (AI, embeddings, etc.)
│   ├── utils/           # Helper functions
│   └── server.js        # Main entry point
├── uploads/             # Temporary file storage (auto-cleanup)
├── chroma_data/         # ChromaDB vector storage
├── logs/                # Application logs
├── .env                 # Environment variables (DO NOT COMMIT)
├── .env.example         # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## 📚 API Endpoints (v1)

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/public/:businessSlug` - Public branding & settings
- `POST /api/public/:businessSlug/chat` - External AI customer chat

### Managed Business Endpoints (Requires Auth)
Base Path: `/api/business/v1`
- `GET /documents` - List files (Scoped)
- `POST /documents` - Upload knowledge base
- `GET /leads` - View captured customer leads
- `PATCH /settings` - Manage branding & AI tone

### Admin Endpoints
Base Path: `/api/admin/v1`
- `GET /stats` - Global system health
- `POST /broadcast` - Send system-wide notifications

More endpoints will be added in later development stages.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting (prevent abuse)
- CORS protection
- Input validation and sanitization
- XSS protection
- NoSQL injection prevention
- File upload restrictions

## 💰 Cost Estimate

For 1,000 customer questions per month:

- MongoDB Atlas: FREE (512MB tier)
- ChromaDB: FREE (runs locally)
- OpenAI Embeddings: ~$0.02
- OpenAI GPT-3.5: ~$0.50

**Total: ~$0.52/month** 🎉

## 📖 Project Progress
Status: **100% COMPLETE** 🚀

All 10 stages of the Multi-Tenant RBAC Architecture have been implemented, tested, and verified:
1. ✅ Stage 1: Foundation (Project Setup)
2. ✅ Stage 2: Database Setup (MongoDB + ChromaDB)
3. ✅ Stage 3: Authentication System
4. ✅ Stage 4: Business Management
5. ✅ Stage 5: Document Processing Pipeline
6. ✅ Stage 6: Public Chat (RAG System)
7. ✅ Stage 7: Team Management
8. ✅ Stage 8: Analytics Dashboard
9. ✅ Stage 9: Security Hardening
10. ✅ Stage 10: Deployment Preparation

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📄 License

MIT

## 🆘 Troubleshooting

### Server won't start

- Check if port 3000 is already in use
- Verify all environment variables are set in `.env`
- Run `npm install` to ensure all dependencies are installed

### MongoDB connection fails

- Verify `MONGODB_URI` in `.env` is correct
- Check if MongoDB is running (if using local MongoDB)
- For MongoDB Atlas, check IP whitelist settings

### OpenAI API errors

- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Review rate limits on your OpenAI account

## 📞 Support

For issues or questions, please refer to the documentation in the `/docs` folder.

---

**Built with ❤️ using Node.js, Express, MongoDB, ChromaDB, and OpenAI**
