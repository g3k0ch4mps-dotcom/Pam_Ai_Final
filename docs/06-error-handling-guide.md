# Error Handling Guide - Business AI Assistant

> **Philosophy:** Fail gracefully, log comprehensively, recover automatically  
> **Stack:** Node.js + Express + MongoDB + ChromaDB + OpenAI  
> **Approach:** Centralized error handling with specific error types

---

## 🎯 Error Handling Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                ERROR HANDLING FLOW                               │
└─────────────────────────────────────────────────────────────────┘

Request → Validation → Business Logic → Response
   ↓           ↓              ↓              ↓
 Error       Error          Error         Error
   │           │              │              │
   └───────────┴──────────────┴──────────────┘
                      ↓
            Error Handler Middleware
                      ↓
              ┌───────────────┐
              │ 1. Log Error  │
              │ 2. Cleanup    │
              │ 3. Respond    │
              └───────────────┘
```

---

## 📋 Error Types & Codes

### Standard Error Codes

```javascript
// utils/errorCodes.js

const ErrorCodes = {
  // Authentication Errors (401)
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    statusCode: 401
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Access token has expired',
    statusCode: 401
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Invalid access token',
    statusCode: 401
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    statusCode: 401
  },
  
  // Authorization Errors (403)
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    message: 'You do not have permission to perform this action',
    statusCode: 403
  },
  ACCESS_DENIED: {
    code: 'ACCESS_DENIED',
    message: 'Access denied to this resource',
    statusCode: 403
  },
  
  // Validation Errors (400)
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    statusCode: 400
  },
  MISSING_REQUIRED_FIELD: {
    code: 'MISSING_REQUIRED_FIELD',
    message: 'Required field is missing',
    statusCode: 400
  },
  INVALID_FILE_TYPE: {
    code: 'INVALID_FILE_TYPE',
    message: 'Invalid file type',
    statusCode: 400
  },
  
  // Not Found Errors (404)
  BUSINESS_NOT_FOUND: {
    code: 'BUSINESS_NOT_FOUND',
    message: 'Business not found',
    statusCode: 404
  },
  DOCUMENT_NOT_FOUND: {
    code: 'DOCUMENT_NOT_FOUND',
    message: 'Document not found',
    statusCode: 404
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    statusCode: 404
  },
  
  // Conflict Errors (409)
  EMAIL_EXISTS: {
    code: 'EMAIL_EXISTS',
    message: 'Email already registered',
    statusCode: 409
  },
  BUSINESS_NAME_EXISTS: {
    code: 'BUSINESS_NAME_EXISTS',
    message: 'Business name already taken',
    statusCode: 409
  },
  
  // File Upload Errors (413/400)
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    message: 'File size exceeds maximum limit',
    statusCode: 413
  },
  NO_FILE_PROVIDED: {
    code: 'NO_FILE_PROVIDED',
    message: 'No file uploaded',
    statusCode: 400
  },
  
  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later',
    statusCode: 429
  },
  TOO_MANY_ATTEMPTS: {
    code: 'TOO_MANY_ATTEMPTS',
    message: 'Too many attempts, please try again later',
    statusCode: 429
  },
  
  // Server Errors (500)
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An internal error occurred',
    statusCode: 500
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Database operation failed',
    statusCode: 500
  },
  
  // Service Errors (503)
  AI_SERVICE_ERROR: {
    code: 'AI_SERVICE_ERROR',
    message: 'AI service temporarily unavailable',
    statusCode: 503
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service temporarily unavailable',
    statusCode: 503
  }
};

module.exports = ErrorCodes;
```

---

## 🏗️ Custom Error Classes

```javascript
// utils/errors.js

/**
 * Base Application Error
 */
class AppError extends Error {
  constructor(errorCode, details = null) {
    super(errorCode.message);
    this.name = this.constructor.name;
    this.code = errorCode.code;
    this.statusCode = errorCode.statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super({
      code: 'VALIDATION_ERROR',
      message: message || 'Validation failed',
      statusCode: 400
    }, details);
  }
}

/**
 * Authentication Error
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super({
      code: 'UNAUTHORIZED',
      message,
      statusCode: 401
    });
  }
}

/**
 * Authorization Error
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super({
      code: 'PERMISSION_DENIED',
      message,
      statusCode: 403
    });
  }
}

/**
 * Not Found Error
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super({
      code: `${resource.toUpperCase()}_NOT_FOUND`,
      message: `${resource} not found`,
      statusCode: 404
    });
  }
}

/**
 * Database Error
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    super({
      code: 'DATABASE_ERROR',
      message,
      statusCode: 500
    }, { originalError: originalError?.message });
  }
}

/**
 * External Service Error (OpenAI, etc.)
 */
class ExternalServiceError extends AppError {
  constructor(service, message, originalError = null) {
    super({
      code: `${service.toUpperCase()}_SERVICE_ERROR`,
      message: message || `${service} service error`,
      statusCode: 503
    }, { originalError: originalError?.message });
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  ExternalServiceError
};
```

---

## 🛡️ Global Error Handler Middleware

```javascript
// middleware/errorHandler.js

const { logger } = require('../utils/logger');

/**
 * Global Error Handler
 * Catches all errors and sends appropriate response
 */
function errorHandler(err, req, res, next) {
  // Log error
  logger.error('API Error', {
    error: {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    },
    request: {
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent')
    },
    user: req.user ? {
      userId: req.user.userId,
      businessId: req.user.businessId
    } : null
  });
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Build error response
  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An error occurred'
    },
    timestamp: new Date().toISOString()
  };
  
  // Add details if provided (validation errors, etc.)
  if (err.details) {
    errorResponse.error.details = err.details;
  }
  
  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }
  
  // Send response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found Handler
 * For routes that don't exist
 */
function notFoundHandler(req, res, next) {
  const error = new AppError({
    code: 'ROUTE_NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404
  });
  
  next(error);
}

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
```

**Usage in server.js:**

```javascript
// server.js
const express = require('express');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// ... all routes here ...

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);
```

---

## 💻 Error Handling in Controllers

### Example: Document Upload Controller

```javascript
// controllers/document.controller.js

const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError, NotFoundError, ExternalServiceError } = require('../utils/errors');
const { processDocument } = require('../services/documentProcessor.service');
const BusinessMember = require('../models/BusinessMember');
const Business = require('../models/Business');

/**
 * Upload Document
 * POST /api/business/:businessId/documents/upload
 */
const uploadDocument = asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.userId;
  const file = req.file;
  
  // Validate file exists
  if (!file) {
    throw new ValidationError('No file uploaded');
  }
  
  // Verify business exists
  const business = await Business.findById(businessId);
  if (!business) {
    throw new NotFoundError('Business');
  }
  
  // Verify user has access
  const membership = await BusinessMember.findOne({
    userId,
    businessId,
    status: 'active'
  });
  
  if (!membership) {
    throw new AuthorizationError('You do not have access to this business');
  }
  
  // Check permission
  if (!membership.permissions.canUploadDocuments) {
    throw new AuthorizationError('You do not have permission to upload documents');
  }
  
  try {
    // Process document
    const result = await processDocument(businessId, userId, file);
    
    // Success response
    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      document: result.document
    });
    
  } catch (error) {
    // Handle specific processing errors
    if (error.message.includes('OpenAI')) {
      throw new ExternalServiceError('OpenAI', 'Failed to create embeddings', error);
    }
    
    if (error.message.includes('ChromaDB')) {
      throw new ExternalServiceError('ChromaDB', 'Failed to store document', error);
    }
    
    if (error.message.includes('MongoDB')) {
      throw new DatabaseError('Failed to save document metadata', error);
    }
    
    // Re-throw other errors
    throw error;
  }
});

/**
 * Delete Document
 * DELETE /api/business/:businessId/documents/:documentId
 */
const deleteDocument = asyncHandler(async (req, res) => {
  const { businessId, documentId } = req.params;
  const userId = req.user.userId;
  
  // Verify business access
  const membership = await BusinessMember.findOne({
    userId,
    businessId,
    status: 'active'
  });
  
  if (!membership) {
    throw new AuthorizationError('Access denied');
  }
  
  // Check permission
  if (!membership.permissions.canDeleteDocuments) {
    throw new AuthorizationError('You do not have permission to delete documents');
  }
  
  // Find document
  const document = await Document.findOne({
    _id: documentId,
    businessId: businessId
  });
  
  if (!document) {
    throw new NotFoundError('Document');
  }
  
  try {
    // Delete from ChromaDB
    const chromaClient = new ChromaClient();
    const collection = await chromaClient.getCollection(`business_${businessId}`);
    await collection.delete({ ids: document.chromaIds });
    
    // Delete from MongoDB
    await Document.deleteOne({ _id: documentId });
    
    // Update business stats
    await Business.findByIdAndUpdate(businessId, {
      $inc: { 'stats.totalDocuments': -1 }
    });
    
    res.json({
      success: true,
      message: 'Document deleted successfully',
      documentId
    });
    
  } catch (error) {
    throw new DatabaseError('Failed to delete document', error);
  }
});

module.exports = {
  uploadDocument,
  deleteDocument
};
```

---

## 🔍 Validation Error Handling

```javascript
// middleware/validation.js

const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Check validation results
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format errors nicely
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

/**
 * Registration validation rules
 */
const validateRegister = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be 2-100 characters'),
  
  checkValidation
];

module.exports = {
  validateRegister,
  checkValidation
};
```

**Error Response Example:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "notanemail"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "value": "short"
      }
    ]
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

---

## 🔐 Authentication Error Handling

```javascript
// middleware/auth.js

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');

/**
 * Authenticate JWT Token
 */
function authenticateToken(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Access token required');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request
    req.user = {
      userId: decoded.userId,
      businessId: decoded.businessId,
      role: decoded.role,
      permissions: decoded.permissions
    };
    
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Access token has expired');
    }
    
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid access token');
    }
    
    throw error;
  }
}

module.exports = { authenticateToken };
```

---

## 💾 Database Error Handling

```javascript
// services/database.service.js

const mongoose = require('mongoose');
const { DatabaseError } = require('../utils/errors');

/**
 * Connect to MongoDB with error handling
 */
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB connected');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new DatabaseError('Failed to connect to database', error);
  }
}

/**
 * Safe database query with error handling
 */
async function safeQuery(operation, errorMessage) {
  try {
    return await operation();
  } catch (error) {
    console.error('Database query error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      throw new ValidationError(`${field} already exists`);
    }
    
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      throw new ValidationError('Database validation failed', errors);
    }
    
    if (error.name === 'CastError') {
      // Invalid ObjectId
      throw new ValidationError(`Invalid ${error.path}: ${error.value}`);
    }
    
    // Generic database error
    throw new DatabaseError(errorMessage, error);
  }
}

module.exports = {
  connectDatabase,
  safeQuery
};
```

---

## 🤖 OpenAI Error Handling

```javascript
// services/openai.service.js

const { OpenAI } = require('openai');
const { ExternalServiceError } = require('../utils/errors');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Create embedding with error handling
 */
async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    
    return response.data[0].embedding;
    
  } catch (error) {
    console.error('OpenAI embedding error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      throw new ExternalServiceError(
        'OpenAI',
        'API quota exceeded. Please check your billing.',
        error
      );
    }
    
    if (error.code === 'rate_limit_exceeded') {
      throw new ExternalServiceError(
        'OpenAI',
        'Rate limit exceeded. Please try again in a moment.',
        error
      );
    }
    
    if (error.code === 'invalid_api_key') {
      throw new ExternalServiceError(
        'OpenAI',
        'Invalid API key configuration.',
        error
      );
    }
    
    // Generic OpenAI error
    throw new ExternalServiceError(
      'OpenAI',
      'Failed to create embedding',
      error
    );
  }
}

/**
 * Generate chat completion with error handling
 */
async function generateCompletion(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
    
  } catch (error) {
    console.error('OpenAI completion error:', error);
    
    if (error.code === 'context_length_exceeded') {
      throw new ExternalServiceError(
        'OpenAI',
        'Message too long. Please try a shorter question.',
        error
      );
    }
    
    throw new ExternalServiceError(
      'OpenAI',
      'Failed to generate response',
      error
    );
  }
}

module.exports = {
  createEmbedding,
  generateCompletion
};
```

---

## 📁 File Upload Error Handling

```javascript
// middleware/fileUpload.js

const multer = require('multer');
const path = require('path');
const { ValidationError } = require('../utils/errors');

// Configure multer
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new ValidationError('Invalid file type'), false);
    } else {
      cb(null, true);
    }
  }
});

/**
 * Handle multer errors
 */
function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ValidationError('File size exceeds 10MB limit'));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ValidationError('Too many files. Maximum 1 file allowed'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ValidationError('Unexpected field in form data'));
    }
  }
  
  next(err);
}

module.exports = {
  upload,
  handleUploadError
};
```

---

## 🚨 Rate Limit Error Handling

```javascript
// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const publicChatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many questions. Please try again in 1 hour.',
      retryAfter: 3600
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Custom rate limit response
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
      },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = { publicChatLimiter };
```

---

## 📊 Error Logging

```javascript
// utils/logger.js

const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

/**
 * Log security events
 */
function logSecurityEvent(eventType, details) {
  logger.warn('SECURITY_EVENT', {
    type: eventType,
    ...details,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log error with context
 */
function logError(error, context = {}) {
  logger.error('Application Error', {
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    },
    context,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  logger,
  logSecurityEvent,
  logError
};
```

---

## ✅ Error Handling Checklist

### Development Phase:
- [ ] Custom error classes defined
- [ ] Error codes standardized
- [ ] Global error handler implemented
- [ ] Async errors caught (asyncHandler)
- [ ] Validation errors handled
- [ ] Database errors handled
- [ ] External API errors handled
- [ ] File upload errors handled

### Production Phase:
- [ ] Error logging configured
- [ ] Stack traces hidden in production
- [ ] Sensitive data not logged
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Rate limiting errors handled
- [ ] Database connection errors handled
- [ ] Graceful shutdown on critical errors

### User Experience:
- [ ] Clear error messages
- [ ] Helpful error details (when safe)
- [ ] Consistent error response format
- [ ] Appropriate HTTP status codes
- [ ] Retry instructions included
- [ ] Support contact info (optional)

---

## 🎯 Best Practices Summary

```
1. USE SPECIFIC ERROR TYPES
   ✅ throw new ValidationError('Invalid email')
   ❌ throw new Error('Invalid email')

2. ALWAYS USE TRY-CATCH
   ✅ Wrap database operations
   ✅ Wrap external API calls
   ✅ Wrap file operations

3. LOG EVERYTHING
   ✅ Log all errors with context
   ✅ Log security events
   ❌ Don't log passwords or tokens

4. FAIL GRACEFULLY
   ✅ Return useful error messages
   ✅ Clean up resources on error
   ✅ Rollback transactions

5. USE asyncHandler
   ✅ Wrap all async route handlers
   ✅ Automatically catches async errors
   ✅ Passes to error middleware

6. HIDE INTERNALS IN PRODUCTION
   ❌ Don't expose stack traces
   ❌ Don't expose database errors
   ❌ Don't expose file paths
```

**Error handling complete! Your API is production-ready! 🚀**
