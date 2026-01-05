# Data Flow & Processing - Business AI Assistant

> **Critical Understanding:** Files are temporary, data is permanent  
> **Architecture:** Node.js + Express + MongoDB + ChromaDB + OpenAI  
> **File Lifecycle:** Upload → Process → Store → Delete (safe!)

---

## 🔄 Complete Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE EXPLAINED                    │
└─────────────────────────────────────────────────────────────────┘

Question: "If I delete files from /uploads, do I lose business data?"

Answer: NO! Here's what happens:

┌──────────────────┐
│  1. FILE UPLOAD  │
│  /uploads/       │  ← TEMPORARY STORAGE
│  temp_abc.pdf    │     (Deleted after processing)
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ 2. TEXT EXTRACT  │  ← Reads file content
│ "We're open..."  │     Text stored in memory
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ 3. CREATE        │  ← OpenAI creates vector
│ EMBEDDING        │     [0.234, -0.123, ...]
└────────┬─────────┘
         │
         ↓ ─────────────────────────────────┐
         │                                  │
         ↓                                  ↓
┌──────────────────┐              ┌──────────────────┐
│ 4A. CHROMADB     │              │ 4B. MONGODB      │
│ Store embedding  │              │ Store metadata   │
│ + text content   │              │ (filename, etc)  │
│                  │              │                  │
│ PERMANENT! ✅    │              │ PERMANENT! ✅    │
└──────────────────┘              └──────────────────┘
         │
         ↓
┌──────────────────┐
│ 5. DELETE FILE   │
│ /uploads/        │  ← File deleted (safe!)
│ temp_abc.pdf     │     Data already in databases
└──────────────────┘

RESULT: Business data is SAFE in ChromaDB + MongoDB
        Deleting /uploads files = Just cleanup, no data loss!
```

---

## 📁 File Lifecycle: Step-by-Step

### Phase 1: Upload (Temporary Storage)

```javascript
// File arrives and is saved temporarily
POST /api/business/:id/documents/upload

Step 1: File arrives from client
├─ Original filename: "Business Hours.pdf"
├─ Saved as: "/uploads/temp_1234567890_abc123.pdf"
├─ Status: TEMPORARY
└─ Will be deleted: Yes, after processing

File location: /uploads/
Purpose: Temporary holding area for processing
Duration: ~5-10 seconds (until processing completes)
```

### Phase 2: Text Extraction

```javascript
// Extract text from uploaded file
const pdfParse = require('pdf-parse');
const fs = require('fs');

async function extractTextFromPDF(filePath) {
  try {
    // Read file buffer
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse PDF
    const data = await pdfParse(dataBuffer);
    
    // Extract text
    const text = data.text;
    
    console.log('Extracted text:', text);
    
    return {
      text: text,
      pages: data.numpages,
      wordCount: text.split(' ').length
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Example extracted text
const extractedText = `
Luxury Salon & Spa Business Hours

We are open Monday through Friday from 9 AM to 6 PM.
Saturday: 10 AM to 4 PM
Sunday: Closed

Our services include:
- Haircuts: $50
- Hair coloring: $150
- Styling: $35
- Spa treatments: $120

Location: 123 Main Street, New York, NY
Phone: (555) 123-4567
`;

// At this point:
// ✓ Text is in memory (variable)
// ✓ Original file still in /uploads (temporary)
// ✓ No data in databases yet
```

### Phase 3: Create Embeddings

```javascript
// Convert text to vector using OpenAI
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    
    const embedding = response.data[0].embedding;
    
    console.log('Embedding created:', embedding.length, 'dimensions');
    // Output: Embedding created: 1536 dimensions
    
    return embedding; // [0.0234, -0.0123, 0.0567, ...]
  } catch (error) {
    console.error('Embedding creation error:', error);
    throw new Error('Failed to create embedding');
  }
}

// Example:
const embedding = await createEmbedding(extractedText);
// Result: Array of 1,536 numbers

// At this point:
// ✓ Text is in memory
// ✓ Embedding is in memory
// ✓ Original file still in /uploads (temporary)
// ✓ No data in databases yet
```

### Phase 4: Store in Databases (PERMANENT!)

```javascript
// 4A. Store in ChromaDB (PERMANENT)
const { ChromaClient } = require('chromadb');

async function storeInChromaDB(businessId, documentId, text, embedding) {
  try {
    const client = new ChromaClient();
    
    // Get business-specific collection
    const collectionName = `business_${businessId}`;
    const collection = await client.getOrCreateCollection({
      name: collectionName
    });
    
    // Store document with embedding
    await collection.add({
      ids: [documentId],
      embeddings: [embedding],
      documents: [text],
      metadatas: [{
        businessId: businessId,
        documentId: documentId,
        filename: 'business_hours.pdf',
        uploadedAt: new Date().toISOString()
      }]
    });
    
    console.log('✅ Stored in ChromaDB (PERMANENT)');
    
    return {
      collectionName,
      documentId,
      stored: true
    };
  } catch (error) {
    console.error('ChromaDB storage error:', error);
    throw new Error('Failed to store in ChromaDB');
  }
}

// 4B. Store metadata in MongoDB (PERMANENT)
const Document = require('./models/Document');

async function storeInMongoDB(businessId, fileInfo, chromaInfo) {
  try {
    const document = await Document.create({
      businessId: businessId,
      filename: fileInfo.filename,
      originalName: fileInfo.originalName,
      fileType: 'pdf',
      fileSize: fileInfo.fileSize,
      chromaCollectionId: chromaInfo.collectionName,
      chromaIds: [chromaInfo.documentId],
      textLength: fileInfo.textLength,
      status: 'completed',
      uploadedBy: fileInfo.uploadedBy,
      uploadedAt: new Date()
    });
    
    console.log('✅ Stored in MongoDB (PERMANENT)');
    
    return document;
  } catch (error) {
    console.error('MongoDB storage error:', error);
    throw new Error('Failed to store in MongoDB');
  }
}

// Execute both storage operations
const chromaResult = await storeInChromaDB(
  'biz_123',
  'doc_001',
  extractedText,
  embedding
);

const mongoResult = await storeInMongoDB(
  'biz_123',
  {
    filename: 'business_hours.pdf',
    originalName: 'Business Hours.pdf',
    fileSize: 245678,
    textLength: extractedText.length,
    uploadedBy: 'user_456'
  },
  chromaResult
);

// At this point:
// ✅ Data in ChromaDB (PERMANENT - embeddings + text)
// ✅ Data in MongoDB (PERMANENT - metadata)
// ✓ Original file still in /uploads (no longer needed!)
```

### Phase 5: Delete Temporary File (Safe!)

```javascript
// Delete the temporary uploaded file
const fs = require('fs');
const path = require('path');

async function cleanupTempFile(filePath) {
  try {
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete file
      fs.unlinkSync(filePath);
      console.log('✅ Temporary file deleted:', filePath);
    }
    
    return { deleted: true };
  } catch (error) {
    console.error('File cleanup error:', error);
    // Don't throw error - file cleanup is not critical
    // Data is already safely stored in databases
    console.warn('⚠️ Could not delete temp file (non-critical)');
  }
}

// Delete the temporary file
await cleanupTempFile('/uploads/temp_1234567890_abc123.pdf');

// At this point:
// ✅ Data in ChromaDB (PERMANENT)
// ✅ Data in MongoDB (PERMANENT)
// ✅ Temp file deleted from /uploads
// 
// RESULT: No data loss! Everything is safe in databases.
```

---

## 🔍 Data Retrieval: How It Works

### Customer Asks Question

```javascript
// Customer question arrives
POST /api/public/luxury-salon/chat
{
  "question": "What are your business hours?",
  "sessionId": "sess_abc123"
}

// Processing flow:
async function handleCustomerQuestion(businessSlug, question) {
  // 1. Find business
  const business = await Business.findOne({ businessSlug });
  const businessId = business._id;
  
  // 2. Create embedding for question
  const questionEmbedding = await createEmbedding(question);
  
  // 3. Search ChromaDB for similar content
  const results = await searchChromaDB(businessId, questionEmbedding);
  
  // 4. Generate answer using GPT
  const answer = await generateAnswer(question, results);
  
  // 5. Save chat log (optional)
  await saveChatLog(businessId, question, answer);
  
  return answer;
}

// Step 3: Search ChromaDB
async function searchChromaDB(businessId, questionEmbedding) {
  const client = new ChromaClient();
  const collection = await client.getCollection(`business_${businessId}`);
  
  // Query for similar documents
  const results = await collection.query({
    queryEmbeddings: [questionEmbedding],
    nResults: 3
  });
  
  // Returns:
  // {
  //   documents: [
  //     "We are open Monday-Friday 9 AM to 6 PM...",
  //     "Saturday: 10 AM to 4 PM...",
  //     "Location: 123 Main Street..."
  //   ],
  //   distances: [0.05, 0.15, 0.42],
  //   metadatas: [...]
  // }
  
  return results;
}

// Step 4: Generate answer
async function generateAnswer(question, searchResults) {
  const context = searchResults.documents.join('\n\n');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Answer based only on the provided context.'
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`
      }
    ]
  });
  
  return completion.choices[0].message.content;
}

// IMPORTANT: Original file is NOT needed for this!
// All data comes from ChromaDB (which has the text content)
```

---

## 📊 Complete Processing Pipeline with Error Handling

```javascript
// services/documentProcessor.service.js

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const { OpenAI } = require('openai');
const { ChromaClient } = require('chromadb');
const Document = require('../models/Document');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chromaClient = new ChromaClient();

/**
 * Main document processing function
 * Handles: Upload → Extract → Embed → Store → Cleanup
 */
async function processDocument(businessId, userId, fileInfo) {
  const { path: filePath, originalname, mimetype, size } = fileInfo;
  
  let extractedText = null;
  let embedding = null;
  let documentId = null;
  
  try {
    console.log('📄 Starting document processing:', originalname);
    
    // Step 1: Extract text based on file type
    console.log('🔍 Extracting text...');
    extractedText = await extractText(filePath, mimetype);
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content found in document');
    }
    
    console.log('✅ Text extracted:', extractedText.length, 'characters');
    
    // Step 2: Create embedding
    console.log('🧠 Creating embedding...');
    embedding = await createEmbedding(extractedText);
    console.log('✅ Embedding created');
    
    // Step 3: Store in ChromaDB
    console.log('💾 Storing in ChromaDB...');
    documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await storeInChromaDB(
      businessId,
      documentId,
      extractedText,
      embedding,
      {
        filename: originalname,
        fileType: mimetype
      }
    );
    console.log('✅ Stored in ChromaDB');
    
    // Step 4: Store metadata in MongoDB
    console.log('💾 Storing metadata in MongoDB...');
    const document = await Document.create({
      businessId,
      filename: originalname,
      originalName: originalname,
      fileType: mimetype.split('/')[1],
      fileSize: size,
      chromaCollectionId: `business_${businessId}`,
      chromaIds: [documentId],
      textLength: extractedText.length,
      status: 'completed',
      uploadedBy: userId,
      uploadedAt: new Date()
    });
    console.log('✅ Stored in MongoDB');
    
    // Step 5: Delete temporary file (safe now!)
    console.log('🗑️ Cleaning up temporary file...');
    await cleanupTempFile(filePath);
    console.log('✅ Temporary file deleted');
    
    // Return success
    return {
      success: true,
      document: {
        id: document._id,
        filename: document.filename,
        fileType: document.fileType,
        fileSize: document.fileSize,
        textLength: document.textLength,
        status: 'completed',
        uploadedAt: document.uploadedAt
      }
    };
    
  } catch (error) {
    console.error('❌ Document processing error:', error);
    
    // Cleanup on error
    try {
      // Try to delete temp file even if processing failed
      await cleanupTempFile(filePath);
      
      // If ChromaDB storage succeeded but MongoDB failed, clean up ChromaDB
      if (documentId) {
        await removeFromChromaDB(businessId, documentId);
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    // If MongoDB record was created, update status to failed
    if (documentId) {
      await Document.findOneAndUpdate(
        { chromaIds: documentId },
        {
          status: 'failed',
          processingError: error.message
        }
      );
    }
    
    throw error;
  }
}

/**
 * Extract text from different file types
 */
async function extractText(filePath, mimetype) {
  try {
    switch (mimetype) {
      case 'application/pdf':
        return await extractTextFromPDF(filePath);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromDOCX(filePath);
      
      case 'text/plain':
      case 'text/csv':
      case 'text/markdown':
      case 'application/json':
        return await extractTextFromPlainFile(filePath);
      
      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from plain text files
 */
async function extractTextFromPlainFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`File read failed: ${error.message}`);
  }
}

/**
 * Create embedding using OpenAI
 */
async function createEmbedding(text) {
  try {
    // Limit text length (OpenAI has token limits)
    const maxChars = 8000; // ~2000 tokens
    const truncatedText = text.slice(0, maxChars);
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: truncatedText
    });
    
    return response.data[0].embedding;
  } catch (error) {
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }
    throw new Error(`Embedding creation failed: ${error.message}`);
  }
}

/**
 * Store in ChromaDB
 */
async function storeInChromaDB(businessId, documentId, text, embedding, metadata) {
  try {
    const collectionName = `business_${businessId}`;
    const collection = await chromaClient.getOrCreateCollection({
      name: collectionName
    });
    
    await collection.add({
      ids: [documentId],
      embeddings: [embedding],
      documents: [text],
      metadatas: [{
        businessId: businessId.toString(),
        documentId,
        ...metadata,
        uploadedAt: new Date().toISOString()
      }]
    });
    
    return true;
  } catch (error) {
    throw new Error(`ChromaDB storage failed: ${error.message}`);
  }
}

/**
 * Remove from ChromaDB (cleanup on error)
 */
async function removeFromChromaDB(businessId, documentId) {
  try {
    const collectionName = `business_${businessId}`;
    const collection = await chromaClient.getCollection(collectionName);
    await collection.delete({ ids: [documentId] });
  } catch (error) {
    console.error('ChromaDB cleanup error:', error);
  }
}

/**
 * Delete temporary file
 */
async function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted temp file:', filePath);
    }
  } catch (error) {
    console.warn('Could not delete temp file:', error.message);
    // Don't throw - file cleanup is not critical
  }
}

module.exports = {
  processDocument
};
```

---

## 🗑️ Document Deletion: What Happens?

### When Business Owner Deletes Document

```javascript
// DELETE /api/business/:businessId/documents/:documentId

async function deleteDocument(businessId, documentId, userId) {
  try {
    // 1. Find document in MongoDB
    const document = await Document.findOne({
      _id: documentId,
      businessId: businessId
    });
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // 2. Delete from ChromaDB
    console.log('Deleting from ChromaDB...');
    const collectionName = `business_${businessId}`;
    const collection = await chromaClient.getCollection(collectionName);
    
    await collection.delete({
      ids: document.chromaIds
    });
    console.log('✅ Deleted from ChromaDB');
    
    // 3. Delete from MongoDB
    console.log('Deleting from MongoDB...');
    await Document.deleteOne({ _id: documentId });
    console.log('✅ Deleted from MongoDB');
    
    // 4. Update business stats
    await Business.findByIdAndUpdate(businessId, {
      $inc: { 'stats.totalDocuments': -1 }
    });
    
    return {
      success: true,
      message: 'Document deleted successfully',
      documentId
    };
    
  } catch (error) {
    console.error('Document deletion error:', error);
    throw error;
  }
}

// What gets deleted:
// ✅ Embedding from ChromaDB (can't be searched anymore)
// ✅ Text content from ChromaDB
// ✅ Metadata from MongoDB
// ✅ Document no longer appears in AI answers

// What was already deleted:
// ✅ Original file from /uploads (deleted right after upload processing)
```

---

## 💾 Data Storage Summary

```
┌──────────────────────────────────────────────────────────────┐
│              WHERE IS BUSINESS DATA STORED?                  │
└──────────────────────────────────────────────────────────────┘

1. ChromaDB (PERMANENT)
   ├─ Location: ./chroma_data/
   ├─ Contains:
   │  ├─ Document embeddings (vectors)
   │  ├─ Full text content
   │  └─ Metadata
   ├─ Searchable: Yes (for AI questions)
   └─ Backed up: Yes (copy folder)

2. MongoDB (PERMANENT)
   ├─ Location: Cloud (MongoDB Atlas)
   ├─ Contains:
   │  ├─ Document metadata
   │  ├─ Business info
   │  ├─ User accounts
   │  └─ Chat logs
   ├─ Backed up: Yes (automatic snapshots)
   └─ Accessible: From anywhere

3. /uploads/ (TEMPORARY - DELETED)
   ├─ Location: Server filesystem
   ├─ Contains: Uploaded files (temporarily)
   ├─ Duration: 5-10 seconds
   ├─ Purpose: Processing only
   └─ Deleted: Yes, after text extraction

RESULT:
✅ Business data is SAFE in databases
✅ Deleting /uploads does NOT delete business data
✅ Even if /uploads folder is completely empty, all data remains
```

---

## ⚠️ Error Handling Scenarios

### Scenario 1: File Upload Fails

```javascript
// Error: File too large
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds 10MB limit"
  }
}

// What happens:
// ❌ File rejected before saving
// ❌ No temp file created
// ❌ No data in databases
// ✅ No cleanup needed
```

### Scenario 2: Text Extraction Fails

```javascript
// Error: Corrupted PDF
{
  "success": false,
  "error": {
    "code": "EXTRACTION_ERROR",
    "message": "Failed to extract text from PDF"
  }
}

// What happens:
// ✅ Temp file created in /uploads
// ❌ Text extraction fails
// ❌ No embedding created
// ❌ No data in databases
// ✅ Temp file deleted (cleanup)
```

### Scenario 3: OpenAI API Fails

```javascript
// Error: OpenAI quota exceeded
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "OpenAI API quota exceeded"
  }
}

// What happens:
// ✅ Temp file created
// ✅ Text extracted
// ❌ Embedding creation fails
// ❌ No data in databases
// ✅ Temp file deleted (cleanup)
```

### Scenario 4: ChromaDB Storage Fails

```javascript
// Error: ChromaDB connection lost
{
  "success": false,
  "error": {
    "code": "STORAGE_ERROR",
    "message": "Failed to store in vector database"
  }
}

// What happens:
// ✅ Temp file created
// ✅ Text extracted
// ✅ Embedding created
// ❌ ChromaDB storage fails
// ❌ MongoDB not updated
// ✅ Temp file deleted (cleanup)
// ✅ No partial data (atomic operation)
```

### Scenario 5: MongoDB Storage Fails

```javascript
// Error: MongoDB connection lost
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Failed to save document metadata"
  }
}

// What happens:
// ✅ Temp file created
// ✅ Text extracted
// ✅ Embedding created
// ✅ Data in ChromaDB
// ❌ MongoDB save fails
// 🔄 Rollback: Delete from ChromaDB
// ✅ Temp file deleted (cleanup)
// ✅ No orphaned data
```

---

## 🔄 Automatic Cleanup System

```javascript
// utils/cleanup.js

/**
 * Clean up old temporary files
 * Run this periodically (e.g., every hour)
 */
async function cleanupOldTempFiles() {
  const uploadsDir = path.join(__dirname, '../uploads');
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  try {
    const files = fs.readdirSync(uploadsDir);
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const age = Date.now() - stats.mtimeMs;
      
      // Delete files older than 1 hour
      if (age > maxAge) {
        fs.unlinkSync(filePath);
        console.log('Deleted old temp file:', file);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

// Run cleanup every hour
setInterval(cleanupOldTempFiles, 60 * 60 * 1000);

module.exports = { cleanupOldTempFiles };
```

---

## ✅ Key Takeaways

```
1. FILES ARE TEMPORARY
   - Uploaded files stored in /uploads
   - Only kept during processing (5-10 seconds)
   - Automatically deleted after processing
   - Safe to manually delete /uploads folder

2. DATA IS PERMANENT
   - Text content → ChromaDB (permanent)
   - Embeddings → ChromaDB (permanent)
   - Metadata → MongoDB (permanent)
   - Chat logs → MongoDB (permanent)

3. DELETION IS SAFE
   - Deleting files from /uploads = OK ✅
   - Data already in databases
   - No business information lost
   - AI continues to work perfectly

4. ERROR HANDLING
   - Atomic operations (all or nothing)
   - Automatic rollback on failure
   - Temp files always cleaned up
   - No orphaned data

5. BACKUP STRATEGY
   - ChromaDB: Copy ./chroma_data/ folder
   - MongoDB: Automatic cloud backups
   - /uploads: No backup needed (temporary)
```

**Remember:** Once processing is complete, the original file is no longer needed. All business data lives safely in the databases! 🎉
