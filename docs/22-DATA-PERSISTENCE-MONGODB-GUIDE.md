# Data Persistence Guide - MongoDB Storage

> **Question:** Can we store leads in the database so they don't disappear?  
> **Answer:** YES! Everything is permanently stored in MongoDB!

> **Question:** Can we store conversations/questions from users?  
> **Answer:** YES! Every message is saved in the database!

---

## 🎯 What Gets Saved (PERMANENTLY!)

### **Everything is stored in MongoDB:**

```javascript
MongoDB Database: business-ai
├─ businesses (your businesses)
├─ users (business owners)
├─ documents (uploaded files/URLs)
├─ leads 👈 LEADS SAVED HERE (PERMANENT!)
│  ├─ name
│  ├─ email
│  ├─ phone
│  ├─ interests
│  ├─ questions 👈 ALL QUESTIONS SAVED!
│  ├─ chatHistory 👈 FULL CONVERSATION SAVED!
│  └─ leadScore
└─ publicchats (analytics)
```

---

## 📊 How Lead Data is Stored

### **When a customer chats, this is saved FOREVER:**

```javascript
// MongoDB Document (Lead Collection)
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  // Business reference (never lost!)
  businessId: ObjectId("507f1f77bcf86cd799439012"),
  businessSlug: "best-salon",
  sessionId: "session_abc123",
  
  // Contact Information (PERMANENT!)
  name: "Sarah Johnson",
  email: "sarah@email.com",
  phone: "555-123-4567",
  
  // Interests (SAVED!)
  interests: ["haircut", "balayage", "pricing"],
  
  // All Questions Asked (SAVED FOREVER!)
  questions: [
    "What are your prices?",
    "Do you do balayage?",
    "Can I book an appointment?",
    "What are your hours?",
    "Do you have parking?"
  ],
  
  // FULL Conversation History (EVERY MESSAGE!)
  chatHistory: [
    {
      role: "user",
      message: "What are your prices?",
      timestamp: ISODate("2026-01-13T14:30:00Z")
    },
    {
      role: "assistant",
      message: "Great question! Haircuts start at $30...",
      timestamp: ISODate("2026-01-13T14:30:05Z")
    },
    {
      role: "user",
      message: "Do you do balayage?",
      timestamp: ISODate("2026-01-13T14:31:00Z")
    },
    {
      role: "assistant",
      message: "Yes! We specialize in balayage...",
      timestamp: ISODate("2026-01-13T14:31:03Z")
    }
    // ... ALL messages saved!
  ],
  
  // Engagement Data (PERMANENT!)
  leadScore: 85,
  status: "new",
  source: "chat",
  
  // Timestamps (NEVER DELETED!)
  firstContact: ISODate("2026-01-13T14:30:00Z"),
  lastContact: ISODate("2026-01-13T14:35:00Z"),
  createdAt: ISODate("2026-01-13T14:30:00Z"),
  updatedAt: ISODate("2026-01-13T14:35:00Z")
}
```

**This data stays in MongoDB FOREVER unless you manually delete it!**

---

## 🔍 Why Data Might "Disappear" (Common Issues)

### **Issue 1: Frontend Not Fetching from Database**

**Problem:**
```javascript
// BAD CODE - Only stores in memory (disappears on refresh!)
const [leads, setLeads] = useState([]);

// User adds lead
setLeads([...leads, newLead]); // ❌ Only in React state!

// Refresh page → Gone! 😢
```

**Solution:**
```javascript
// GOOD CODE - Fetch from database
useEffect(() => {
  async function fetchLeads() {
    const response = await fetch('/api/business/123/leads');
    const data = await response.json();
    setLeads(data.leads); // ✅ From MongoDB!
  }
  
  fetchLeads();
}, []);

// Now data persists! 🎉
```

---

### **Issue 2: Not Saving to Database (Missing API Call)**

**Problem:**
```javascript
// User provides email
const email = "sarah@email.com";

// ❌ WRONG: Only stored in frontend
setUserEmail(email);

// Refresh → Lost!
```

**Solution:**
```javascript
// ✅ CORRECT: Save to backend/database
async function captureEmail(sessionId, email) {
  await fetch('/api/leads/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      email
    })
  });
  
  // Backend saves to MongoDB → Permanent!
}
```

---

### **Issue 3: Database Connection Lost**

**Problem:**
```javascript
// MongoDB connection string wrong or expired
MONGODB_URI=mongodb://localhost/mydb // ❌ Wrong!

// Data saved to local DB that resets
```

**Solution:**
```javascript
// ✅ Use MongoDB Atlas (cloud - permanent)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/business-ai

// Now data is in the cloud, never lost!
```

---

## ✅ How to Ensure Data is REALLY Saved

### **Step 1: Verify MongoDB Connection**

```javascript
// backend/src/server.js

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
  });
```

**Check console logs:**
```bash
✅ MongoDB connected successfully
📊 Database: business-ai
🔗 Host: cluster0.xxxxx.mongodb.net
```

If you see this, MongoDB is working! ✅

---

### **Step 2: Verify Data is Being Saved**

```javascript
// In your publicChat controller

async function publicChat(req, res) {
  // ... existing code ...
  
  // Save to database
  const lead = await Lead.findOrCreate(businessId, sessionId);
  
  // Add email
  if (email) {
    lead.email = email;
    await lead.save();
    console.log('✅ Email saved to MongoDB:', email);
  }
  
  // Add question
  lead.questions.push(question);
  await lead.save();
  console.log('✅ Question saved to MongoDB:', question);
  
  // Add chat message
  lead.chatHistory.push({
    role: 'user',
    message: question,
    timestamp: new Date()
  });
  await lead.save();
  console.log('✅ Chat history updated in MongoDB');
  
  // ... rest of code ...
}
```

**Check backend logs:**
```bash
✅ Email saved to MongoDB: sarah@email.com
✅ Question saved to MongoDB: What are your prices?
✅ Chat history updated in MongoDB
```

If you see these logs, data IS being saved! ✅

---

### **Step 3: Verify Data in MongoDB**

**Option A: MongoDB Atlas Web UI**

1. Go to: https://cloud.mongodb.com
2. Click: "Browse Collections"
3. Select database: "business-ai"
4. Select collection: "leads"
5. See all your leads! ✅

**You'll see:**
```json
{
  "_id": ObjectId("..."),
  "name": "Sarah Johnson",
  "email": "sarah@email.com",
  "questions": ["What are your prices?", "Do you do balayage?"],
  "chatHistory": [...],
  // All data here!
}
```

---

**Option B: Create Test Script**

```javascript
// backend/scripts/check-leads.js

require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('../src/models/Lead');

async function checkLeads() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const leads = await Lead.find({});
  
  console.log('📊 Total Leads in Database:', leads.length);
  console.log('\n📝 Recent Leads:');
  
  leads.slice(0, 5).forEach(lead => {
    console.log('\n────────────────────');
    console.log('Name:', lead.name || 'Anonymous');
    console.log('Email:', lead.email || 'Not provided');
    console.log('Phone:', lead.phone || 'Not provided');
    console.log('Questions:', lead.questions.length);
    console.log('Chat Messages:', lead.chatHistory.length);
    console.log('Lead Score:', lead.leadScore);
    console.log('Created:', lead.createdAt);
  });
  
  await mongoose.connection.close();
}

checkLeads();
```

Run it:
```bash
node backend/scripts/check-leads.js
```

**Output:**
```
📊 Total Leads in Database: 47

📝 Recent Leads:

────────────────────
Name: Sarah Johnson
Email: sarah@email.com
Phone: 555-123-4567
Questions: 5
Chat Messages: 12
Lead Score: 85
Created: 2026-01-13T14:30:00Z
```

**If you see this, all data is saved permanently!** ✅

---

## 🎯 Complete Backend Implementation

### **Ensure Every Save Operation:**

```javascript
// backend/src/controllers/publicChat.controller.js

async function publicChat(req, res) {
  try {
    const { businessSlug } = req.params;
    const { question, sessionId } = req.body;
    
    // Find business
    const business = await Business.findOne({ businessSlug });
    
    console.log('💬 Chat message received');
    
    // ========================================
    // SAVE TO DATABASE: Find or Create Lead
    // ========================================
    let lead = await Lead.findOne({ 
      sessionId,
      businessId: business._id 
    });
    
    if (!lead) {
      lead = await Lead.create({
        businessId: business._id,
        businessSlug: business.businessSlug,
        sessionId,
        questions: [],
        chatHistory: [],
        interests: [],
        leadScore: 0,
        firstContact: new Date()
      });
      console.log('✅ NEW LEAD CREATED - ID:', lead._id);
    }
    
    // ========================================
    // SAVE TO DATABASE: Email Detection
    // ========================================
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = question.match(emailRegex);
    
    if (emailMatch && !lead.email) {
      lead.email = emailMatch[0];
      await lead.save();
      console.log('✅ EMAIL SAVED:', lead.email);
    }
    
    // ========================================
    // SAVE TO DATABASE: Phone Detection
    // ========================================
    const phoneRegex = /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const phoneMatch = question.match(phoneRegex);
    
    if (phoneMatch && !lead.phone) {
      lead.phone = phoneMatch[0];
      await lead.save();
      console.log('✅ PHONE SAVED:', lead.phone);
    }
    
    // ========================================
    // SAVE TO DATABASE: Question
    // ========================================
    if (!lead.questions.includes(question)) {
      lead.questions.push(question);
      await lead.save();
      console.log('✅ QUESTION SAVED (Total:', lead.questions.length + ')');
    }
    
    // ========================================
    // SAVE TO DATABASE: User Message
    // ========================================
    lead.chatHistory.push({
      role: 'user',
      message: question,
      timestamp: new Date()
    });
    await lead.save();
    console.log('✅ USER MESSAGE SAVED TO HISTORY');
    
    // ========================================
    // Generate AI Response
    // ========================================
    const answer = await generateAIAnswer(question, business);
    
    // ========================================
    // SAVE TO DATABASE: AI Response
    // ========================================
    lead.chatHistory.push({
      role: 'assistant',
      message: answer,
      timestamp: new Date()
    });
    await lead.save();
    console.log('✅ AI RESPONSE SAVED TO HISTORY');
    
    // ========================================
    // SAVE TO DATABASE: Update Score & Timestamp
    // ========================================
    lead.lastContact = new Date();
    lead.leadScore = calculateLeadScore(lead);
    await lead.save();
    console.log('✅ LEAD UPDATED - Score:', lead.leadScore);
    
    console.log('🎉 ALL DATA SAVED TO MONGODB!\n');
    
    // Return response
    res.json({ success: true, answer });
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

function calculateLeadScore(lead) {
  let score = 0;
  if (lead.email) score += 30;
  if (lead.phone) score += 20;
  if (lead.name) score += 10;
  score += Math.min(lead.questions.length * 5, 25);
  score += Math.min(lead.interests.length * 5, 15);
  return Math.min(score, 100);
}

module.exports = { publicChat };
```

---

## 🎯 Complete Frontend Implementation

### **Fetch Leads from Database:**

```javascript
// frontend/src/pages/Leads.jsx

import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const businessId = localStorage.getItem('businessId');
  
  // ========================================
  // FETCH FROM DATABASE ON PAGE LOAD
  // ========================================
  useEffect(() => {
    fetchLeadsFromDatabase();
  }, []);
  
  const fetchLeadsFromDatabase = async () => {
    try {
      console.log('📥 Fetching leads from MongoDB...');
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/business/${businessId}/leads`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Loaded', data.leads.length, 'leads from MongoDB');
        setLeads(data.leads);
        
        // Show sample lead data
        if (data.leads.length > 0) {
          const sample = data.leads[0];
          console.log('\n📋 Sample Lead from Database:');
          console.log('- Name:', sample.name || 'Anonymous');
          console.log('- Email:', sample.email || 'Not provided');
          console.log('- Questions:', sample.questions);
          console.log('- Chat History:', sample.chatHistory?.length, 'messages');
          console.log('- Lead Score:', sample.leadScore);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch leads:', error);
      alert('Could not load leads from database');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading">
        <p>Loading leads from MongoDB...</p>
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <div className="no-leads">
        <h2>No leads yet</h2>
        <p>All leads are saved to MongoDB permanently.</p>
        <p>Share your chat link to start capturing leads!</p>
        <button onClick={fetchLeadsFromDatabase}>
          Refresh from Database
        </button>
      </div>
    );
  }
  
  return (
    <div className="leads-page">
      <div className="header">
        <h1>Customer Leads (MongoDB)</h1>
        <button onClick={fetchLeadsFromDatabase}>
          🔄 Refresh
        </button>
      </div>
      
      <div className="stats">
        <div className="stat">
          <h3>{leads.length}</h3>
          <p>Total Leads</p>
        </div>
        <div className="stat">
          <h3>{leads.filter(l => l.email).length}</h3>
          <p>With Email</p>
        </div>
        <div className="stat">
          <h3>{leads.filter(l => l.leadScore >= 50).length}</h3>
          <p>Hot Leads</p>
        </div>
      </div>
      
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Questions</th>
            <th>Messages</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name || 'Anonymous'}</td>
              <td>{lead.email || '-'}</td>
              <td>{lead.phone || '-'}</td>
              <td>{lead.questionCount}</td>
              <td>{lead.chatHistory?.length || 0}</td>
              <td>
                <span className={`score ${lead.leadScore >= 70 ? 'hot' : lead.leadScore >= 40 ? 'warm' : 'cold'}`}>
                  {lead.leadScore}
                </span>
              </td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leads;
```

---

## ✅ Testing Data Persistence

### **Test 1: Create a Lead**

```bash
# 1. Start backend
npm run dev

# 2. Open chat widget
# 3. Type: "What are your prices?"

# Expected Backend Logs:
✅ NEW LEAD CREATED - ID: 507f...
✅ QUESTION SAVED (Total: 1)
✅ USER MESSAGE SAVED TO HISTORY
✅ AI RESPONSE SAVED TO HISTORY
✅ LEAD UPDATED - Score: 5
🎉 ALL DATA SAVED TO MONGODB!
```

---

### **Test 2: Provide Email**

```bash
# In chat, type: "My email is test@email.com"

# Expected Backend Logs:
✅ EMAIL SAVED: test@email.com
✅ QUESTION SAVED (Total: 2)
✅ USER MESSAGE SAVED TO HISTORY
✅ AI RESPONSE SAVED TO HISTORY
✅ LEAD UPDATED - Score: 35
🎉 ALL DATA SAVED TO MONGODB!
```

---

### **Test 3: Restart Server**

```bash
# 1. Stop backend (Ctrl+C)
# 2. Start again (npm run dev)
# 3. Go to Leads page
# 4. Click "Refresh"

# Expected Result:
✅ All leads still there!
✅ All questions still there!
✅ All conversations still there!
✅ Nothing lost!

# This proves data is in MongoDB, not just memory!
```

---

### **Test 4: Check MongoDB Directly**

```bash
# Option 1: MongoDB Atlas Web UI
1. Go to: https://cloud.mongodb.com
2. Click: "Browse Collections"
3. Select: "leads" collection
4. See all your data! ✅

# Option 2: Run test script
node backend/scripts/check-leads.js

# Expected Output:
📊 Total Leads in Database: 5
📝 Recent Leads:
────────────────────
Name: Anonymous
Email: test@email.com
Phone: Not provided
Questions: 2
Chat Messages: 4
Lead Score: 35
```

---

## 📋 Checklist: Data Persistence

### **Backend Checklist:**

- [ ] MongoDB connection string is MongoDB Atlas (cloud)
- [ ] Console shows "✅ MongoDB connected successfully"
- [ ] Lead model has proper schema
- [ ] Every update calls `await lead.save()`
- [ ] Backend logs show "✅ SAVED TO MONGODB"
- [ ] No errors in backend console

### **Frontend Checklist:**

- [ ] `useEffect` fetches leads on page load
- [ ] Uses API call, not just local state
- [ ] Refresh button re-fetches from database
- [ ] Handles loading state
- [ ] Shows data from API response

### **Database Checklist:**

- [ ] Can see leads in MongoDB Atlas web UI
- [ ] Collections exist (leads, businesses, users)
- [ ] Documents have all expected fields
- [ ] Data persists after server restart
- [ ] createdAt timestamps present

---

## 🎯 Summary

### **YES! Everything is saved permanently!**

✅ **Lead Information:**
- Name, email, phone
- Saved to MongoDB
- Never deleted automatically

✅ **All Questions:**
- Every question customer asks
- Stored in `questions` array
- Permanent record

✅ **Full Conversations:**
- Every message (user + AI)
- Stored in `chatHistory` array
- Complete chat transcript

✅ **Engagement Data:**
- Interests, lead score, timestamps
- Updated in real-time
- Always accessible

### **Where it's stored:**
- 🗄️ MongoDB Atlas (cloud database)
- ☁️ Permanent storage
- 🔒 Secure and backed up
- ♾️ Never expires

### **How to verify:**
- 👀 Check MongoDB Atlas web UI
- 📊 Run test script
- 🖥️ Check backend console logs
- 🌐 Fetch in frontend dashboard

**The implementation guide already includes all the code to save everything permanently!** 🎉

**If data is disappearing, it's likely:**
1. ❌ Frontend not fetching from database (add `useEffect` with API call)
2. ❌ Using local MongoDB instead of Atlas (change connection string)
3. ❌ Missing `await lead.save()` calls (add them after every change)

**Let me know which specific issue you're facing and I'll help fix it!** 💪
