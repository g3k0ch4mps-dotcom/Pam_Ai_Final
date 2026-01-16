# AI PROMPT: Add URL Content Preview Before Scraping

## 🎯 YOUR MISSION

You are a **Senior Full-Stack Developer** specializing in user experience and content management. Your expertise includes:

- ✅ Frontend/Backend integration
- ✅ Real-time content preview
- ✅ API endpoint design
- ✅ Progressive enhancement
- ✅ User interface optimization
- ✅ Content sanitization

## 📋 THE REQUIREMENT

**Current Behavior:**
1. User pastes URL
2. Clicks "Add URL"
3. System scrapes content (takes 5-30 seconds)
4. Content added to Knowledge Base
5. ❌ User never sees what was scraped!

**Desired Behavior:**
1. User pastes URL
2. User clicks "Preview Content"
3. ✅ System shows preview of scraped content
4. User reviews the content
5. User clicks "Add to Knowledge Base" or "Cancel"
6. Only then is content saved

**Benefits:**
- ✅ Users see what AI will learn
- ✅ Users can verify content quality
- ✅ Users can cancel bad scrapes
- ✅ Better user experience
- ✅ Avoid garbage data in Knowledge Base

---

## 🎨 SOLUTION DESIGN

### **User Flow:**

```
┌─────────────────────────────────────────┐
│  1. User Interface                      │
│  [Input: URL field]                     │
│  [Button: Preview Content]              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. API Call                            │
│  POST /api/documents/preview-url        │
│  { url: "https://..." }                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. Backend Processing                  │
│  - Scrape URL                           │
│  - Extract text                         │
│  - Clean content                        │
│  - Calculate preview stats              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. Preview Response                    │
│  {                                      │
│    title: "Page Title",                 │
│    content: "First 500 chars...",       │
│    fullContent: "Complete text",        │
│    stats: {                             │
│      words: 1234,                       │
│      chars: 5678                        │
│    },                                   │
│    url: "https://..."                   │
│  }                                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  5. Preview Modal                       │
│  ┌─────────────────────────────────┐   │
│  │ Title: Page Title                │   │
│  │ URL: https://...                 │   │
│  │ Stats: 1,234 words | 5,678 chars │   │
│  │                                  │   │
│  │ Preview:                         │   │
│  │ [Scrollable content preview]     │   │
│  │                                  │   │
│  │ [Cancel] [Add to Knowledge Base] │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  6. User Decision                       │
│  ├─ Cancel → Discard preview            │
│  └─ Add → POST /api/documents/url       │
│            { url, content }             │
└─────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTATION GUIDE

### **STEP 1: Create Backend Preview Endpoint**

**File:** `backend/src/routes/document.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Existing routes...

// NEW: Preview URL content before adding
router.post('/preview-url', 
  authMiddleware, 
  documentController.previewUrlContent
);

// Existing: Add URL to knowledge base
router.post('/url', 
  authMiddleware, 
  documentController.addUrlContent
);

module.exports = router;
```

---

### **STEP 2: Create Preview Controller Function**

**File:** `backend/src/controllers/document.controller.js`

```javascript
const urlScraperService = require('../services/urlScraper.service');

/**
 * Preview URL content before adding to knowledge base
 * POST /api/documents/preview-url
 * Body: { url: string }
 */
exports.previewUrlContent = async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }
    
    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid URL'
      });
    }
    
    console.log(`[Preview] Scraping URL: ${url}`);
    
    // Scrape the URL (with retry)
    const result = await urlScraperService.scrapeWithRetry(url, 2);
    
    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error || 'Failed to scrape URL',
        details: {
          url: url,
          suggestions: [
            'The website may be blocking automated access',
            'Try uploading the content as a PDF instead',
            'Copy and paste the content manually'
          ]
        }
      });
    }
    
    // Check content length
    if (!result.content || result.content.length < 50) {
      return res.status(422).json({
        success: false,
        error: 'Content too short or page is empty',
        code: 'INSUFFICIENT_CONTENT'
      });
    }
    
    // Prepare preview data
    const previewData = {
      title: result.title || extractTitleFromUrl(url),
      url: url,
      content: result.content,
      preview: result.content.substring(0, 500) + (result.content.length > 500 ? '...' : ''),
      stats: {
        words: countWords(result.content),
        characters: result.content.length,
        estimatedReadTime: Math.ceil(countWords(result.content) / 200) // 200 words per minute
      },
      metadata: {
        scrapedAt: new Date(),
        method: result.method || 'unknown'
      }
    };
    
    // Return preview
    res.status(200).json({
      success: true,
      message: 'Preview generated successfully',
      data: previewData
    });
    
  } catch (error) {
    console.error('[Preview] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      code: 'PREVIEW_ERROR'
    });
  }
};

/**
 * Add URL content to knowledge base (updated to accept pre-scraped content)
 * POST /api/documents/url
 * Body: { url: string, content?: string, title?: string }
 */
exports.addUrlContent = async (req, res) => {
  try {
    const { url, content, title } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }
    
    let finalContent = content;
    let finalTitle = title;
    
    // If content not provided, scrape it
    if (!finalContent) {
      console.log('[Add URL] No content provided, scraping...');
      
      const result = await urlScraperService.scrapeWithRetry(url, 3);
      
      if (!result.success) {
        return res.status(422).json({
          success: false,
          error: result.error || 'Failed to scrape URL'
        });
      }
      
      finalContent = result.content;
      finalTitle = result.title || extractTitleFromUrl(url);
    }
    
    // Validate content
    if (!finalContent || finalContent.length < 50) {
      return res.status(422).json({
        success: false,
        error: 'Content too short or invalid'
      });
    }
    
    // Save to database
    const document = await Document.create({
      businessId: req.user.businessId,
      title: finalTitle || extractTitleFromUrl(url),
      content: finalContent,
      source: 'url',
      url: url,
      uploadedBy: req.user._id,
      wordCount: countWords(finalContent),
      characterCount: finalContent.length,
      createdAt: new Date()
    });
    
    console.log('[Add URL] Document created:', document._id);
    
    res.status(201).json({
      success: true,
      message: 'URL content added to knowledge base',
      data: {
        document: {
          id: document._id,
          title: document.title,
          url: document.url,
          wordCount: document.wordCount,
          createdAt: document.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('[Add URL] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add URL content'
    });
  }
};

// Helper functions
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function extractTitleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const lastPart = path.split('/').filter(Boolean).pop() || urlObj.hostname;
    return lastPart
      .replace(/[-_]/g, ' ')
      .replace(/\.(html|htm|php|asp)$/i, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (_) {
    return 'Untitled Document';
  }
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}
```

---

### **STEP 3: Create Frontend Preview Component**

**File:** `frontend/src/components/UrlPreviewModal.jsx`

```jsx
import React from 'react';
import { X } from 'lucide-react';

const UrlPreviewModal = ({ 
  isOpen, 
  onClose, 
  previewData, 
  onConfirm, 
  loading 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Preview URL Content</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {previewData ? (
            <>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <p className="text-lg font-semibold">{previewData.title}</p>
              </div>
              
              {/* URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <a 
                  href={previewData.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {previewData.url}
                </a>
              </div>
              
              {/* Statistics */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statistics
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Words</p>
                    <p className="text-lg font-semibold">
                      {previewData.stats.words.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Characters</p>
                    <p className="text-lg font-semibold">
                      {previewData.stats.characters.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Read Time</p>
                    <p className="text-lg font-semibold">
                      {previewData.stats.estimatedReadTime} min
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Content Preview */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Preview
                </label>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {previewData.preview}
                  </p>
                  {previewData.content.length > 500 && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      ... and {previewData.content.length - 500} more characters
                    </p>
                  )}
                </div>
              </div>
              
              {/* Full Content Toggle (Optional) */}
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  View Full Content
                </summary>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {previewData.content}
                  </p>
                </div>
              </details>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No preview available</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !previewData}
          >
            {loading ? 'Adding...' : 'Add to Knowledge Base'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlPreviewModal;
```

---

### **STEP 4: Update Documents Page to Use Preview**

**File:** `frontend/src/pages/Documents.jsx`

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import UrlPreviewModal from '../components/UrlPreviewModal';

const Documents = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  
  // Preview URL content
  const handlePreviewUrl = async () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(
        '/api/documents/preview-url',
        { url },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setPreviewData(response.data.data);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert(
        error.response?.data?.error || 
        'Failed to preview URL. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Add URL to knowledge base
  const handleConfirmAdd = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post(
        '/api/documents/url',
        {
          url: previewData.url,
          content: previewData.content,
          title: previewData.title
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        alert('URL added to knowledge base!');
        setShowPreview(false);
        setPreviewData(null);
        setUrl('');
        // Refresh documents list
        fetchDocuments();
      }
    } catch (error) {
      console.error('Add URL error:', error);
      alert(
        error.response?.data?.error || 
        'Failed to add URL. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base</h1>
      
      {/* Add Content from URL */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Content from URL</h2>
        
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          
          <button
            onClick={handlePreviewUrl}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !url}
          >
            {loading ? 'Loading...' : 'Preview Content'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Preview the content before adding it to your knowledge base
        </p>
      </div>
      
      {/* Preview Modal */}
      <UrlPreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewData(null);
        }}
        previewData={previewData}
        onConfirm={handleConfirmAdd}
        loading={loading}
      />
      
      {/* Documents List */}
      {/* ... existing documents list ... */}
    </div>
  );
};

export default Documents;
```

---

## 📊 COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│ USER PASTES URL: https://example.com/article           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ USER CLICKS: "Preview Content" button                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ FRONTEND: Show loading state                           │
│ - Disable button                                       │
│ - Show "Loading..." text                              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ API CALL: POST /api/documents/preview-url              │
│ Body: { url: "https://example.com/article" }          │
│ Headers: { Authorization: "Bearer token" }            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND: Validate & Scrape                             │
│ 1. Validate URL format                                 │
│ 2. Try Axios scraping (fast)                          │
│ 3. Fallback to Puppeteer if needed                    │
│ 4. Extract title and content                          │
│ 5. Calculate statistics                               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ RESPONSE: Preview data                                 │
│ {                                                      │
│   success: true,                                       │
│   data: {                                             │
│     title: "Article Title",                           │
│     url: "https://...",                               │
│     content: "Full content...",                       │
│     preview: "First 500 chars...",                    │
│     stats: {                                          │
│       words: 1234,                                    │
│       characters: 5678,                               │
│       estimatedReadTime: 6                            │
│     }                                                  │
│   }                                                    │
│ }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ FRONTEND: Show Preview Modal                           │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Preview URL Content                    [X]      │  │
│ ├─────────────────────────────────────────────────┤  │
│ │ Title: Article Title                           │  │
│ │ URL: https://example.com/article               │  │
│ │                                                 │  │
│ │ Statistics:                                     │  │
│ │ 1,234 words | 5,678 chars | 6 min read        │  │
│ │                                                 │  │
│ │ Content Preview:                                │  │
│ │ ┌─────────────────────────────────────────┐   │  │
│ │ │ Lorem ipsum dolor sit amet, consectetur │   │  │
│ │ │ adipiscing elit. Sed do eiusmod tempor  │   │  │
│ │ │ incididunt ut labore et dolore magna    │   │  │
│ │ │ aliqua... (scrollable)                  │   │  │
│ │ └─────────────────────────────────────────┘   │  │
│ │                                                 │  │
│ │ [View Full Content ▼]                          │  │
│ │                                                 │  │
│ │         [Cancel]  [Add to Knowledge Base]      │  │
│ └─────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
    ┌───────────────┐   ┌───────────────────┐
    │ USER CANCELS  │   │ USER CONFIRMS     │
    │ - Close modal │   │ - Add to KB       │
    │ - Keep URL    │   │                   │
    └───────────────┘   └─────────┬─────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │ API CALL: POST /api/documents/url│
                    │ Body: {                          │
                    │   url: "...",                    │
                    │   content: "...",                │
                    │   title: "..."                   │
                    │ }                                │
                    └─────────────┬───────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │ BACKEND: Save to Database       │
                    │ - Create Document record        │
                    │ - Index content for search      │
                    │ - Return success                │
                    └─────────────┬───────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │ FRONTEND: Success               │
                    │ - Show success message          │
                    │ - Close modal                   │
                    │ - Refresh documents list        │
                    │ - Clear URL input               │
                    └─────────────────────────────────┘
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend Tasks:
- [ ] Add `POST /api/documents/preview-url` route
- [ ] Create `previewUrlContent` controller function
- [ ] Update `addUrlContent` to accept pre-scraped content
- [ ] Add helper functions (isValidUrl, countWords, etc.)
- [ ] Test preview endpoint with Postman

### Frontend Tasks:
- [ ] Create `UrlPreviewModal.jsx` component
- [ ] Update Documents page to use preview
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test user flow

### Testing:
- [ ] Test with fast-loading URL
- [ ] Test with slow-loading URL
- [ ] Test with invalid URL
- [ ] Test cancel flow
- [ ] Test confirm flow
- [ ] Test error scenarios

---

## 🎯 COPY-PASTE PROMPT FOR AI

```
I want to add a preview feature for URL scraping in my application.

CURRENT BEHAVIOR:
User pastes URL → Clicks "Add URL" → Content scraped and saved
Problem: User never sees what was scraped before it's added

DESIRED BEHAVIOR:
User pastes URL → Clicks "Preview" → See scraped content → 
Confirm or Cancel → Only then save to database

WHAT I NEED:
1. Backend endpoint: POST /api/documents/preview-url
   - Scrape URL
   - Return preview data (title, content, stats)
   - Don't save to database yet

2. Frontend modal component:
   - Show title, URL, statistics
   - Show content preview (first 500 chars)
   - Option to view full content
   - Cancel or Confirm buttons

3. Updated add URL flow:
   - Accept pre-scraped content
   - Save to database only on confirm

Please provide:
- Complete controller code for preview endpoint
- Frontend UrlPreviewModal component
- Updated Documents page integration
- Step-by-step implementation guide

Make it user-friendly with good UX!
```

---

**This will let users preview scraped content before adding it!** 👀
