# Database Design - Business AI Assistant

> **Databases:** MongoDB (primary) + ChromaDB (vector search)  
> **MongoDB Version:** 6.0+  
> **ChromaDB Version:** 1.7+  
> **Data Architecture:** Multi-tenant with complete business isolation

---

## 🎯 Database Overview

```
Two-Database Architecture:

┌────────────────────────┐
│      MongoDB           │
│  (Multi-tenant Store)  │
│                        │
│  • Users (RBAC + BIZ)  │
│  • Businesses          │
│  • Documents metadata  │
│  • Leads               │
│  • Chat logs           │
└────────────────────────┘

┌────────────────────────┐
│      ChromaDB          │
│  (Vector embeddings)   │
│                        │
│  • Document vectors    │
│  • Semantic search     │
│  • One collection per  │
│    business            │
└────────────────────────┘
```

**Why Two Databases?**
- MongoDB: Perfect for structured data (users, business info, metadata)
- ChromaDB: Specialized for vector similarity search (AI semantic search)

---

## 📊 MongoDB Collections

### 1. Users Collection

**Purpose:** Store business owners and team members

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  // Authentication
  email: "owner@luxurysalon.com",          // Unique, required
  passwordHash: "$2b$12$hashedpassword...", // bcrypt hashed
  
  // Profile
  firstName: "Sarah",                      // Required
  lastName: "Johnson",                     // Required
  
  // RBAC & Multi-tenancy
  role: "business_owner",                  // Enum: owner, admin, staff, viewer, super_admin
  businessId: ObjectId("biz_123abc"),      // Linked primary business
  isSystemUser: false,                     // Flag for support/super admins
  
  // Status
  isActive: true,                          // Can login?
  isEmailVerified: false,                  // Email confirmed?
  
  // Timestamps
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  lastLogin: ISODate("2024-12-29T10:30:00Z"),
  updatedAt: ISODate("2024-12-29T10:30:00Z")
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```

**Validation Rules:**
- `email`: Must be valid email format, unique
- `password`: Min 60 chars (bcrypt hash), never plain text
- `fullName`: 2-50 characters
- `isActive`: Boolean, default true

---

### 2. Businesses Collection

**Purpose:** Store business information and settings

```javascript
{
  _id: ObjectId("biz_123abc"),
  
  // Basic Info
  businessName: "Luxury Salon & Spa",         // Required, unique
  businessSlug: "luxury-salon-spa",           // URL-friendly, unique
  businessType: "salon",                      // e.g., "salon", "restaurant"
  industry: "beauty",                         // e.g., "beauty", "tech"
  description: "Premium hair and beauty...",  // Optional
  
  // Contact
  phone: "+1-555-0123",
  email: "info@luxurysalon.com",
  website: "https://luxurysalon.com",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    country: "USA",
    zipCode: "10001",
    coordinates: {                            // For maps
      lat: 40.7128,
      lng: -74.0060
    }
  },
  
  // Branding
  logo: "https://cdn.../logo.png",
  primaryColor: "#FF69B4",
  secondaryColor: "#FFB6C1",
  
  // Chat Settings
  chatSettings: {
    welcomeMessage: "Hi! Ask me anything...",
    isPublic: true,                           // Allow public chat?
    rateLimitPerIP: 10,                       // Questions/hour per IP
    showSources: false,                       // Show doc sources to customers?
    requireEmail: false                       // Collect customer email?
  },
  
  // Subscription (optional - for future)
  subscription: {
    plan: "free",                             // "free", "starter", "pro"
    status: "active",                         // "active", "suspended"
    expiresAt: ISODate("2025-12-31T23:59:59Z"),
    maxDocuments: 50,
    maxTeamMembers: 5
  },
  
  // Stats
  stats: {
    totalDocuments: 6,
    totalChats: 1240,
    totalTeamMembers: 3
  },
  
  // Metadata
  createdBy: ObjectId("user_456def"),         // Owner's user ID
  chromaCollectionId: "business_biz_123abc", // ChromaDB collection name
  isActive: true,
  
  // Timestamps
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-12-29T10:30:00Z")
}
```

**Indexes:**
```javascript
db.businesses.createIndex({ businessSlug: 1 }, { unique: true })
db.businesses.createIndex({ businessName: 1 }, { unique: true })
db.businesses.createIndex({ createdBy: 1 })
db.businesses.createIndex({ isActive: 1 })
```

---

> [!IMPORTANT]
> **Refactored Architecture**: As of January 2026, the `BusinessMembers` collection has been deprecated. Roles and Business associations are now stored directly on the `User` document for better performance and simpler security rules.

**User-to-Business Relationship:**
- One user belongs to ONE primary business.
- Role and Permission logic is centralized in `config/roles.js`.
- Security is enforced via `tenantIsolation.middleware.js` and `scopeToBusinessId` utility.

---

### 4. Documents Collection

**Purpose:** Store document metadata (not actual content - that's in ChromaDB)

```javascript
{
  _id: ObjectId("doc_001xyz"),
  
  // Ownership
  businessId: ObjectId("biz_123abc"),      // Which business owns this
  
  // File Info
  filename: "business_hours.pdf",          // Internal filename
  originalName: "Business Hours & Schedule.pdf", // User's filename
  fileType: "pdf",                         // "pdf", "txt", "docx", "csv"
  fileSize: 245678,                        // Bytes
  filePath: "/uploads/temp_xyz.pdf",       // Temp path (deleted after processing)
  
  // Content Processing
  textContent: "We're open Monday...",     // Extracted text (optional to store)
  textLength: 1250,                        // Character count
  
  // ChromaDB References
  chromaCollectionId: "business_biz_123abc", // ChromaDB collection
  chromaIds: [                             // IDs in ChromaDB
    "doc_001xyz_chunk_0",
    "doc_001xyz_chunk_1",
    "doc_001xyz_chunk_2"
  ],
  chunkCount: 3,                           // How many chunks
  
  // Categorization (optional)
  category: "Operations",                  // "HR", "Sales", "Marketing"
  tags: ["hours", "schedule", "open"],    // Searchable tags
  description: "Business operating hours", // User description
  
  // Processing Status
  status: "completed",                     // "processing", "completed", "failed"
  processingError: null,                   // Error message if failed
  processingTime: 4532,                    // Milliseconds to process
  
  // Upload Info
  uploadedBy: ObjectId("user_456def"),
  uploadedAt: ISODate("2024-12-29T10:30:00Z"),
  
  // Timestamps
  createdAt: ISODate("2024-12-29T10:30:00Z"),
  updatedAt: ISODate("2024-12-29T10:30:00Z")
}
```

**Indexes:**
```javascript
db.documents.createIndex({ businessId: 1 })
db.documents.createIndex({ uploadedBy: 1 })
db.documents.createIndex({ status: 1 })
db.documents.createIndex({ fileType: 1 })
db.documents.createIndex({ uploadedAt: -1 })
// Compound index for business-specific searches
db.documents.createIndex({ businessId: 1, uploadedAt: -1 })
```

---

### 5. PublicChats Collection

**Purpose:** Log anonymous customer chat interactions

```javascript
{
  _id: ObjectId("chat_001abc"),
  
  // Business Context
  businessId: ObjectId("biz_123abc"),
  businessName: "Luxury Salon & Spa",      // Denormalized for faster queries
  
  // Customer Identification (anonymous)
  sessionId: "sess_abc123xyz",             // Browser session
  ipAddress: "5e884898da28047151d0e56f8dc62927", // SHA-256 hashed for privacy
  userAgent: "Mozilla/5.0...",             // Browser info
  
  // Conversation
  question: "What are your business hours?",
  answer: "We're open Monday through Friday...",
  
  // AI Metadata
  sources: [                               // Which documents were used
    "business_hours.pdf",
    "faq.txt"
  ],
  confidence: 0.95,                        // AI confidence (0-1)
  relevanceScore: 0.87,                    // Search relevance
  
  // Performance
  responseTime: 1456,                      // Milliseconds
  embeddingTime: 125,                      // Time to create embedding
  searchTime: 87,                          // Time to search ChromaDB
  generationTime: 1244,                    // Time for GPT response
  
  // Cost Tracking
  embeddingCost: 0.00002,                  // Dollars
  completionCost: 0.0005,                  // Dollars
  totalCost: 0.00052,                      // Dollars
  
  // Feedback (optional)
  wasHelpful: null,                        // true/false/null
  feedbackText: null,                      // Customer feedback
  
  // Timestamps
  createdAt: ISODate("2024-12-29T10:30:00Z")
}
```

**Indexes:**
```javascript
db.publicChats.createIndex({ businessId: 1, createdAt: -1 })
db.publicChats.createIndex({ sessionId: 1 })
db.publicChats.createIndex({ createdAt: -1 })
// For analytics
db.publicChats.createIndex({ businessId: 1, question: "text" })
```

**Privacy Notes:**
- IP addresses are SHA-256 hashed (irreversible)
- No PII (Personally Identifiable Information) stored
- SessionId is random, doesn't link to real user
- GDPR compliant

---

### 6. Roles Collection (Optional - For Custom Roles)

**Purpose:** Define custom roles with specific permissions

```javascript
{
  _id: ObjectId("role_001xyz"),
  
  // Ownership
  businessId: ObjectId("biz_123abc"),
  
  // Role Definition
  roleName: "Sales Manager",
  roleSlug: "sales-manager",
  description: "Manages sales team and documentation",
  
  // Permissions
  permissions: {
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canManageTeam: true,              // Can manage sales team only
    canViewAnalytics: true,
    canManageSettings: false,
    canChat: true,
    // Custom permissions
    canAccessSalesData: true,
    canExportReports: true
  },
  
  // Metadata
  isSystemRole: false,                // true for owner, admin, etc.
  isActive: true,
  
  createdBy: ObjectId("user_456def"),
  createdAt: ISODate("2024-01-20T00:00:00Z"),
  updatedAt: ISODate("2024-12-29T10:30:00Z")
}
```

**Indexes:**
```javascript
db.roles.createIndex({ businessId: 1, roleSlug: 1 }, { unique: true })
db.roles.createIndex({ businessId: 1 })
```

---

## 🔷 ChromaDB Collections

### Collection Structure

**Collection Naming:** `business_{businessId}`

Example: `business_biz_123abc`

**Why Separate Collections?**
- Complete data isolation between businesses
- Easy to delete all business data (just drop collection)
- Better performance (smaller collections to search)
- Security (no accidental cross-business queries)

### Document Structure in ChromaDB

```javascript
{
  // Unique identifier
  id: "doc_001xyz_chunk_0",
  
  // The embedding vector (1,536 numbers)
  embedding: [
    0.0234,
    -0.0123,
    0.0567,
    0.0891,
    -0.0456,
    // ... 1,531 more numbers
    0.0234
  ],
  
  // The actual text content
  document: "We're open Monday through Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM. We're closed on Sundays and major holidays.",
  
  // Metadata for filtering and reference
  metadata: {
    businessId: "biz_123abc",         // Extra safety check
    documentId: "doc_001xyz",         // MongoDB document ID
    filename: "business_hours.pdf",
    fileType: "pdf",
    chunkIndex: 0,                    // If document split into chunks
    category: "Operations",
    uploadedAt: "2024-12-29T10:30:00Z"
  }
}
```

### ChromaDB Operations

```javascript
// Initialize ChromaDB
const { ChromaClient } = require('chromadb');
const client = new ChromaClient();

// Get or create collection for a business
const collection = await client.getOrCreateCollection({
  name: `business_${businessId}`,
  metadata: { description: 'Business documents' }
});

// Add document with embedding
await collection.add({
  ids: ['doc_001_chunk_0'],
  embeddings: [[0.0234, -0.0123, ...]],
  documents: ['We are open Monday...'],
  metadatas: [{
    businessId: 'biz_123',
    filename: 'hours.pdf'
  }]
});

// Search for similar documents
const results = await collection.query({
  queryEmbeddings: [[0.0231, -0.0119, ...]],
  nResults: 3
});
```

---

## 🔗 Database Relationships

```
┌─────────────┐
│   Users     │
│─────────────│
│ _id (PK)    │◄────────┐
│ email       │         │
│ fullName    │         │ createdBy (FK)
└──────┬──────┘         │
       │                │
       │ userId (FK)    │
       │ (1:N)          │
       ↓                │
┌──────────────────┐    │
│ BusinessMembers  │    │
│──────────────────│    │
│ _id (PK)         │    │
│ userId (FK) ─────┼────┘
│ businessId (FK)  ├───┐
│ role             │   │
│ permissions      │   │
└──────────────────┘   │ businessId (FK)
                       │ (N:1)
       ┌───────────────┼────────────────────────┐
       │               ↓                        │
       │      ┌──────────────┐                  │
       │      │  Businesses  │                  │
       │      │──────────────│                  │
       │      │ _id (PK)     │                  │
       │      │ businessName │                  │
       │      │ businessSlug │                  │
       │      │ createdBy    │                  │
       │      └──────┬───────┘                  │
       │             │                          │
       │ businessId  │ businessId               │
       │ (1:N)       │ (1:N)                    │
       ↓             ↓                          │
┌───────────────┐  ┌──────────────┐            │
│  Documents    │  │ PublicChats  │            │
│───────────────│  │──────────────│            │
│ _id (PK)      │  │ _id (PK)     │            │
│ businessId FK │  │ businessId FK│            │
│ filename      │  │ question     │            │
│ chromaIds[]   │  │ answer       │            │
└───────────────┘  └──────────────┘            │
       │                                        │
       │ (References via chromaIds)             │
       ↓                                        │
┌───────────────────────────────────┐           │
│  ChromaDB Collections             │           │
│───────────────────────────────────│           │
│  Collection: "business_{id}"      │◄──────────┘
│                                   │
│  {                                │
│    id: "doc_001_chunk_0",         │
│    embedding: [...],              │
│    document: "text",              │
│    metadata: {businessId, ...}    │
│  }                                │
└───────────────────────────────────┘
```

---

## 📏 Data Sizing Estimates

### MongoDB Storage

```
Per Business (typical):
├── Business document: ~5 KB
├── 5 team members: 5 × 2 KB = 10 KB
├── 10 documents metadata: 10 × 3 KB = 30 KB
├── 1,000 chat logs: 1,000 × 1 KB = 1 MB
└── Total: ~1.05 MB per business

For 1,000 businesses:
└── ~1.05 GB total

MongoDB Atlas Free Tier: 512 MB
Can handle: ~480 businesses with chat logs
           or ~10,000 businesses without chat logs
```

### ChromaDB Storage

```
Per Document:
├── Embedding: 1,536 × 4 bytes (float32) = 6.1 KB
├── Text content: ~2 KB average
├── Metadata: ~0.5 KB
└── Total: ~8.5 KB per document

Per Business (10 documents):
└── ~85 KB

For 1,000 businesses:
└── ~85 MB total

Disk space is cheap, so ChromaDB scales well!
```

---

## 🛡️ Data Security

### MongoDB Security

```javascript
// 1. Field-level encryption (optional)
const encryptedFields = {
  fields: [
    {
      path: 'address.street',
      bsonType: 'string',
      algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
    }
  ]
};

// 2. Role-based access control
db.createUser({
  user: 'appUser',
  pwd: 'securePassword',
  roles: [
    { role: 'readWrite', db: 'business-ai' }
  ]
});

// 3. Network restrictions
// In MongoDB Atlas: IP Whitelist

// 4. Always use connection string with auth
const mongoUri = 'mongodb+srv://user:pass@cluster.mongodb.net/dbname';
```

### Data Isolation Enforcement

```javascript
// ALWAYS filter by businessId
async function getDocuments(businessId, userId) {
  // 1. Verify user has access to business
  const member = await BusinessMember.findOne({
    userId: userId,
    businessId: businessId,
    status: 'active'
  });
  
  if (!member) {
    throw new Error('Access denied');
  }
  
  // 2. Get documents ONLY for this business
  const documents = await Document.find({
    businessId: businessId  // CRITICAL: Always include this!
  });
  
  return documents;
}
```

---

## 🔄 Backup Strategy

### MongoDB Backups

```bash
# Daily automated backups (MongoDB Atlas)
# - Point-in-time recovery
# - 7-day retention (free tier)
# - Downloadable snapshots

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname" --out=./backup

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname" ./backup
```

### ChromaDB Backups

```bash
# ChromaDB stores data in ./chroma_data/
# Simple backup: Copy the folder

# Backup
tar -czf chroma_backup_$(date +%Y%m%d).tar.gz ./chroma_data/

# Restore
tar -xzf chroma_backup_20241229.tar.gz
```

---

## 📊 Query Patterns

### Common Queries

```javascript
// 1. Get user's businesses
db.businessMembers.find({
  userId: ObjectId("user_456def"),
  status: "active"
}).populate('businessId');

// 2. Get business team
db.businessMembers.find({
  businessId: ObjectId("biz_123abc"),
  status: "active"
}).populate('userId');

// 3. Get business documents
db.documents.find({
  businessId: ObjectId("biz_123abc"),
  status: "completed"
}).sort({ uploadedAt: -1 });

// 4. Chat analytics
db.publicChats.aggregate([
  { $match: { businessId: ObjectId("biz_123abc") } },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

// 5. Most asked questions
db.publicChats.aggregate([
  { $match: { businessId: ObjectId("biz_123abc") } },
  { $group: {
      _id: "$question",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);
```

---

## ✅ Database Checklist

**Before Going Live:**
- [ ] All indexes created
- [ ] Unique constraints verified
- [ ] MongoDB connection string secured in .env
- [ ] ChromaDB data directory backed up
- [ ] businessId filtering enforced in all queries
- [ ] No sensitive data in logs
- [ ] IP whitelist configured (MongoDB Atlas)
- [ ] Rate limiting on database operations
- [ ] Monitoring alerts set up
- [ ] Backup strategy tested

**Performance Optimization:**
- [ ] Indexes on frequently queried fields
- [ ] Compound indexes for common query patterns
- [ ] Old chat logs archived (older than 90 days)
- [ ] Connection pooling configured
- [ ] Query timeout limits set

Ready for production! 🚀
