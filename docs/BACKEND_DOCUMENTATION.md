# Backend Documentation

## 📁 Project Structure

```
src/
├── server.js              # Application entry point
├── config/
│   └── database.js        # MongoDB connection with retry logic
├── models/                # Mongoose schemas (User, Business, Document, Lead, ChatLog)
├── controllers/           # Request handlers (Auth, Business, Document, Chat, Lead)
├── routes/                # API routes mapping
├── middleware/            # Custom middleware (Auth, Validation, Error Handling)
├── services/              # Business logic (OpenAI, Scraping, etc.)
└── utils/                 # Utilities (Logger, Helpers)
```

## 🔌 Application Flow

### 1. Initialization (server.js)
1. Load environment variables (`dotenv`).
2. Connect to MongoDB (`config/database.js`).
3. Initialize Express app.
4. Setup middleware (`helmet`, `cors`, `rateLimit`, `json`).
5. Mount routes (`/api/*`).
6. Setup global error handlers.
7. Start server on `PORT`.

### 2. Request Flow
```
Request -> Middleware (Security/Auth) -> Route -> Controller -> Service/Model -> Database -> Response
```

## 🗄️ Database Layer

### Connection (`config/database.js`)
Uses Mongoose with retry logic (up to 3 attempts) to ensure resilience.
Handles SSL/TLS connections for MongoDB Atlas.

### Models
- **User**: Authentication & Profile.
- **Business**: Business settings & subscription.
- **Document**: RAG source material (Files & URLs).
- **Lead**: Captured potential customers.
- **ChatLog**: History of AI interactions.

## 🎮 Controller Layer
Controllers handle HTTP requests, validate input, call services, and return responses.
- `authController`: Register, Login, Me.
- `businessController`: Profile, Settings, Public Info.
- `documentController`: Upload, Search, URL Scraping.
- `chatController`: Public AI Chat handling.
- `leadController`: Lead capture and management.

## 🛣️ Route Layer
Routes map HTTP endpoints to controller functions and apply specific middleware.
- Protected routes use `authenticate` middleware.
- Business routes check `checkBusinessAccess`.
- Upload routes use `uploadMiddleware`.

## 🔐 Middleware
- `auth.middleware.js`: Verifies JWT tokens and attaches user to `req`.
- `permission.middleware.js`: specific role checks (e.g., Owner only).
- `rateLimiter.middleware.js`: Custom limits for specific actions (like URL scraping).

## 🔧 Service Layer
- `openai.service.js`: Wrapper for OpenAI API calls (Chat Completion, Embeddings). (Note: Implementation details in controllers currently).
- `scraping.service.js`: Puppeteer/Cheerio logic for extracting text from URLs.
- `document.service.js`: File processing (PDF/Docx text extraction).

## 🌐 Environment Variables
See `TECHNOLOGY_STACK.md` for full list.
Key vars: `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`.

## 🚀 Development
```bash
# Run backend in dev mode (nodemon)
npm run dev
```
