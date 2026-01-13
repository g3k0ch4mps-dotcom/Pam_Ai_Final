# AI Implementation Prompt: Lead Capture & Enhanced Conversational UX

> **Project:** Business AI Assistant  
> **New Features:** Lead capture + Personalized conversations  
> **Role:** UX Expert specializing in conversational AI  
> **Approach:** Step-by-step with git commits and verification

---

## 🎯 YOUR MISSION

You are a **UX Expert** specializing in conversational AI and customer engagement. Your task is to transform the basic chatbot into an intelligent, friendly assistant that:

1. ✅ **Captures leads naturally** (name, phone, email, interests)
2. ✅ **Introduces itself properly** with business branding
3. ✅ **Feels human and approachable** (not robotic)
4. ✅ **Guides conversations smoothly** (natural flow)
5. ✅ **Stores lead data** for business insights
6. ✅ **Respects user privacy** (GDPR-friendly approach)

---

## 📚 UX PRINCIPLES FOR CONVERSATIONAL AI

### **The Golden Rules:**

1. **Don't interrogate** - Ask for info naturally, not like a form
2. **Give value first** - Help before asking for contact info
3. **One question at a time** - Don't overwhelm users
4. **Explain why** - Tell users why you need their info
5. **Make it optional** - Users can skip if they want
6. **Be transparent** - Always identify as AI
7. **Sound human** - Friendly, not robotic
8. **Remember context** - Don't ask for same info twice

---

## 🎨 DESIRED USER EXPERIENCE

### **Bad UX (Don't Do This):**

```
❌ Bot: Hello.
User: Hi, what are your prices?
Bot: Please provide your name.
User: Why?
Bot: Please provide your email.
User: [leaves chat] 🚫
```

**Why this fails:**
- No introduction
- Demands info before helping
- Doesn't explain why
- Robotic and pushy
- User gets frustrated

---

### **Good UX (Do This):**

```
✅ Bot: Hi! I'm Sarah, the AI assistant for Best Salon! 👋 
      How can I help you today?

User: What are your prices for haircuts?

Bot: Great question! A haircut starts at $30. 
     We also offer styling and coloring services.
     
     Would you like to see our full price list? Or do you 
     have questions about a specific service?

User: Do you do balayage?

Bot: Yes! We specialize in balayage coloring. Prices start 
     at $120 depending on hair length.
     
     I'd love to send you more details and availability. 
     What's the best email to reach you? (It's totally 
     optional - I can keep chatting here too!) 😊

User: sarah@email.com

Bot: Perfect! I'll remember that. And what should I call you?

User: Sarah

Bot: Nice to meet you, Sarah! 😊 
     
     Are you looking to book soon, or just exploring options?
```

**Why this works:**
- ✅ Warm, friendly introduction
- ✅ Helps FIRST before asking anything
- ✅ Asks for info naturally in context
- ✅ Makes it optional (no pressure)
- ✅ Explains benefit (send details)
- ✅ One question at a time
- ✅ Remembers user's name
- ✅ Continues conversation naturally

---

## 🎯 FEATURE REQUIREMENTS

### **Feature 1: Smart Introduction**

**Every conversation starts with:**

1. **AI identifies itself**
   - "Hi! I'm [AI Name], the AI assistant for [Business Name]!"
   - Make it clear it's an AI (transparency)
   
2. **Warm greeting**
   - Use emojis (👋 😊) to feel friendly
   - Sound excited to help
   
3. **Offer help immediately**
   - "How can I help you today?"
   - "What brings you here?"
   - "What can I help you with?"

**Examples:**

```javascript
// Salon
"Hi! I'm Jamie, the AI assistant for Luxe Hair Salon! 👋 
How can I help you today?"

// Restaurant
"Hey there! I'm Chef Bot, the AI helper for Tasty Bites Restaurant! 🍽️ 
What can I help you with today?"

// Gym
"Hi! I'm Flex, the AI assistant for PowerFit Gym! 💪 
Looking to get fit? What questions can I answer?"
```

---

### **Feature 2: Natural Lead Capture**

**The Smart Flow:**

```
1. User asks a question
   ↓
2. AI answers helpfully (GIVE VALUE FIRST)
   ↓
3. After 2-3 helpful exchanges, AI naturally asks for contact
   ↓
4. "I'd love to send you [benefit]. What's your email?"
   ↓
5. User provides email (or skips)
   ↓
6. AI asks for name naturally: "And what should I call you?"
   ↓
7. Continue conversation using their name
   ↓
8. Later in conversation: "Want updates? What's your phone number?"
   ↓
9. Optional: "What are you most interested in?" (for interests)
```

**Key Principles:**

✅ **Give before asking** - Answer 2-3 questions first  
✅ **One field at a time** - Don't ask for name + email + phone together  
✅ **Explain the benefit** - "I'd love to send you our menu"  
✅ **Make it optional** - "(It's optional - I can keep chatting here too!)"  
✅ **Natural timing** - Ask when it makes sense in conversation  
✅ **Remember what you have** - Don't ask for email twice  

**Trigger Moments for Lead Capture:**

1. **User asks about pricing** → Offer to email price list
2. **User asks about booking** → Ask for contact to schedule
3. **User shows strong interest** → Offer to send more info
4. **User asks multiple questions** → Offer follow-up via email
5. **After giving helpful answer** → "Want me to email this to you?"

---

### **Feature 3: Lead Data Storage**

**Database Schema:**

```javascript
// New model: Lead.js
{
  businessId: ObjectId,
  businessSlug: String,
  sessionId: String,
  
  // Contact Information
  name: String,
  email: String,
  phone: String,
  
  // Engagement Data
  interests: [String],  // e.g., ["haircuts", "coloring"]
  questions: [String],  // Questions they asked
  chatHistory: [{
    role: 'user' | 'assistant',
    message: String,
    timestamp: Date
  }],
  
  // Metadata
  source: 'chat',
  status: 'new' | 'contacted' | 'converted',
  leadScore: Number,  // Based on engagement
  
  // Timestamps
  firstContact: Date,
  lastContact: Date,
  createdAt: Date
}
```

**Lead Scoring Logic:**

```javascript
// Calculate lead quality
function calculateLeadScore(lead) {
  let score = 0;
  
  // Has contact info
  if (lead.email) score += 30;
  if (lead.phone) score += 20;
  if (lead.name) score += 10;
  
  // Engagement level
  score += Math.min(lead.questions.length * 5, 25);  // Max 25 points
  
  // Interests expressed
  score += lead.interests.length * 5;
  
  // Time spent (longer = more interested)
  const duration = lead.lastContact - lead.firstContact;
  if (duration > 5 * 60 * 1000) score += 10;  // 5+ minutes
  
  return Math.min(score, 100);  // Max 100
}
```

---

### **Feature 4: Contextual Conversations**

**AI Should Remember:**

1. ✅ User's name (use it in responses)
2. ✅ What they already asked (don't repeat info)
3. ✅ Contact info already given (don't ask twice)
4. ✅ Their interests (personalize recommendations)

**Example:**

```
User: What are your hours?
Bot: We're open Mon-Fri 9am-6pm, and Sat 10am-4pm!

[5 minutes later]
User: Can I come on Saturday?
Bot: Absolutely! We're open Saturday 10am-4pm. 
     (Remembers hours, doesn't repeat full schedule)

User: What about prices?
Bot: Great question! What service are you interested in?
     
User: Haircuts
Bot: [Remembers "haircuts" as interest, stores it]
     Haircuts start at $30...
```

---

### **Feature 5: Privacy & Compliance**

**GDPR-Friendly Approach:**

1. **Inform users** - "I save conversations to help you better"
2. **Get consent** - "Is it okay if I remember your email for updates?"
3. **Allow opt-out** - "You can skip any question"
4. **Data deletion** - Business can delete leads
5. **Transparent storage** - Show what's saved

**Example:**

```
Bot: I'd love to send you our menu! What's your email?
     
     (I'll save this to send you updates - but you can 
     always unsubscribe anytime!) 📧

User: sarah@email.com

Bot: Perfect! Saved. I'll only send you helpful info 
     about our restaurant - no spam, promise! 😊
```

---

## 📋 IMPLEMENTATION STEPS

### **STEP 1: Create Lead Model**

**Task:** Create database model for storing leads

**What to do:**

1. **Create file:** `backend/src/models/Lead.js`

```javascript
// backend/src/models/Lead.js

const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Business reference
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  
  businessSlug: {
    type: String,
    required: true,
    index: true
  },
  
  // Session tracking
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // Contact information (all optional - collected gradually)
  name: {
    type: String,
    trim: true
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Basic email validation
  },
  
  phone: {
    type: String,
    trim: true
  },
  
  // Engagement data
  interests: [{
    type: String,
    trim: true
  }],
  
  questions: [{
    type: String
  }],
  
  chatHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Lead metadata
  source: {
    type: String,
    default: 'chat',
    enum: ['chat', 'form', 'import']
  },
  
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost']
  },
  
  leadScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Notes (business can add notes about lead)
  notes: String,
  
  // Timestamps
  firstContact: {
    type: Date,
    default: Date.now
  },
  
  lastContact: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Indexes for fast queries
leadSchema.index({ businessId: 1, createdAt: -1 });
leadSchema.index({ businessId: 1, status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ sessionId: 1 });

// Method to calculate lead score
leadSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Contact information
  if (this.email) score += 30;
  if (this.phone) score += 20;
  if (this.name) score += 10;
  
  // Engagement level (number of questions)
  score += Math.min(this.questions.length * 5, 25);
  
  // Interests expressed
  score += Math.min(this.interests.length * 5, 15);
  
  // Chat duration
  if (this.lastContact && this.firstContact) {
    const duration = this.lastContact - this.firstContact;
    const minutes = duration / (1000 * 60);
    
    if (minutes > 5) score += 10;
    if (minutes > 10) score += 5;
  }
  
  return Math.min(score, 100);
};

// Method to update lead score
leadSchema.methods.updateScore = async function() {
  this.leadScore = this.calculateScore();
  await this.save();
};

// Static method to find or create lead
leadSchema.statics.findOrCreate = async function(businessId, businessSlug, sessionId) {
  let lead = await this.findOne({ sessionId, businessId });
  
  if (!lead) {
    lead = await this.create({
      businessId,
      businessSlug,
      sessionId,
      firstContact: new Date(),
      lastContact: new Date()
    });
  }
  
  return lead;
};

module.exports = mongoose.model('Lead', leadSchema);
```

2. **Git commit:**
```bash
git add backend/src/models/Lead.js
git commit -m "feat: add Lead model for capturing customer contact info and engagement data"
```

**Deliverables:**
- [ ] Lead.js model created
- [ ] All fields properly defined
- [ ] Indexes added for performance
- [ ] Helper methods included
- [ ] Git commit completed

**Wait for verification before proceeding to Step 2**

---

### **STEP 2: Create Lead Service**

**Task:** Create service to manage lead capture logic

**What to do:**

1. **Create file:** `backend/src/services/lead.service.js`

```javascript
// backend/src/services/lead.service.js

const Lead = require('../models/Lead');

/**
 * Lead Service - Handles lead capture and management
 */
class LeadService {
  /**
   * Find or create a lead for a session
   */
  async findOrCreateLead(businessId, businessSlug, sessionId) {
    try {
      let lead = await Lead.findOne({ sessionId, businessId });
      
      if (!lead) {
        lead = await Lead.create({
          businessId,
          businessSlug,
          sessionId,
          firstContact: new Date(),
          lastContact: new Date()
        });
        
        console.log('✅ New lead created:', lead._id);
      }
      
      return lead;
    } catch (error) {
      console.error('❌ Error finding/creating lead:', error);
      throw error;
    }
  }
  
  /**
   * Update lead contact information
   */
  async updateContactInfo(sessionId, data) {
    try {
      const lead = await Lead.findOne({ sessionId });
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      // Update only provided fields
      if (data.name) lead.name = data.name;
      if (data.email) lead.email = data.email;
      if (data.phone) lead.phone = data.phone;
      
      lead.lastContact = new Date();
      
      // Recalculate score
      lead.leadScore = lead.calculateScore();
      
      await lead.save();
      
      console.log('✅ Lead updated:', lead._id);
      
      return lead;
    } catch (error) {
      console.error('❌ Error updating lead:', error);
      throw error;
    }
  }
  
  /**
   * Add question to lead history
   */
  async addQuestion(sessionId, question) {
    try {
      const lead = await Lead.findOne({ sessionId });
      
      if (!lead) return;
      
      // Add question if not duplicate
      if (!lead.questions.includes(question)) {
        lead.questions.push(question);
      }
      
      lead.lastContact = new Date();
      
      await lead.save();
      
      return lead;
    } catch (error) {
      console.error('❌ Error adding question:', error);
      throw error;
    }
  }
  
  /**
   * Add interest to lead
   */
  async addInterest(sessionId, interest) {
    try {
      const lead = await Lead.findOne({ sessionId });
      
      if (!lead) return;
      
      // Add interest if not duplicate
      const normalizedInterest = interest.toLowerCase();
      if (!lead.interests.includes(normalizedInterest)) {
        lead.interests.push(normalizedInterest);
      }
      
      lead.lastContact = new Date();
      lead.leadScore = lead.calculateScore();
      
      await lead.save();
      
      return lead;
    } catch (error) {
      console.error('❌ Error adding interest:', error);
      throw error;
    }
  }
  
  /**
   * Add message to chat history
   */
  async addChatMessage(sessionId, role, message) {
    try {
      const lead = await Lead.findOne({ sessionId });
      
      if (!lead) return;
      
      lead.chatHistory.push({
        role,
        message,
        timestamp: new Date()
      });
      
      // Keep only last 50 messages to avoid bloat
      if (lead.chatHistory.length > 50) {
        lead.chatHistory = lead.chatHistory.slice(-50);
      }
      
      lead.lastContact = new Date();
      
      await lead.save();
      
      return lead;
    } catch (error) {
      console.error('❌ Error adding chat message:', error);
      throw error;
    }
  }
  
  /**
   * Get lead by session ID
   */
  async getLeadBySession(sessionId) {
    try {
      return await Lead.findOne({ sessionId });
    } catch (error) {
      console.error('❌ Error getting lead:', error);
      throw error;
    }
  }
  
  /**
   * Get all leads for a business
   */
  async getBusinessLeads(businessId, filters = {}) {
    try {
      const query = { businessId };
      
      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.hasEmail) {
        query.email = { $exists: true, $ne: null };
      }
      
      if (filters.minScore) {
        query.leadScore = { $gte: filters.minScore };
      }
      
      const leads = await Lead.find(query)
        .sort({ leadScore: -1, createdAt: -1 })
        .limit(filters.limit || 100);
      
      return leads;
    } catch (error) {
      console.error('❌ Error getting business leads:', error);
      throw error;
    }
  }
  
  /**
   * Extract potential interests from question
   */
  extractInterests(question) {
    const interests = [];
    const keywords = {
      'haircut': ['haircut', 'trim', 'cut'],
      'coloring': ['color', 'dye', 'highlights', 'balayage', 'ombre'],
      'styling': ['style', 'styling', 'blowout', 'updo'],
      'pricing': ['price', 'cost', 'how much', 'expensive'],
      'booking': ['book', 'appointment', 'schedule', 'available'],
      'hours': ['hours', 'open', 'closed', 'time']
    };
    
    const lowerQuestion = question.toLowerCase();
    
    for (const [interest, words] of Object.entries(keywords)) {
      if (words.some(word => lowerQuestion.includes(word))) {
        interests.push(interest);
      }
    }
    
    return interests;
  }
}

module.exports = new LeadService();
```

2. **Git commit:**
```bash
git add backend/src/services/lead.service.js
git commit -m "feat: add lead service for managing customer data capture"
```

**Deliverables:**
- [ ] lead.service.js created
- [ ] CRUD operations for leads
- [ ] Interest extraction logic
- [ ] Lead scoring updates
- [ ] Git commit completed

**Wait for verification before proceeding to Step 3**

---

### **STEP 3: Create Conversation Prompts**

**Task:** Create intelligent, friendly AI prompts for different scenarios

**What to do:**

1. **Create file:** `backend/src/prompts/conversation.prompts.js`

```javascript
// backend/src/prompts/conversation.prompts.js

/**
 * Conversation Prompts for AI Assistant
 * These prompts guide the AI to be friendly, helpful, and capture leads naturally
 */

/**
 * Generate system prompt for AI assistant
 */
function getSystemPrompt(businessName, businessType, hasContactInfo) {
  const basePrompt = `You are a friendly AI assistant for ${businessName}.

YOUR PERSONALITY:
- Warm, friendly, and approachable
- Professional but not stiff
- Helpful and patient
- Use emojis occasionally (👋 😊 ✨) to feel friendly
- Sound like a real person, not a robot

YOUR ROLE:
- Help customers learn about ${businessName}
- Answer questions about services, pricing, hours, etc.
- Guide customers naturally toward booking or contacting the business
- Capture customer contact information naturally (when appropriate)

CONVERSATION GUIDELINES:
1. Always be helpful FIRST before asking for anything
2. Answer questions thoroughly and accurately
3. Use the customer's name once you know it
4. Keep responses concise (2-3 sentences usually)
5. Ask follow-up questions to understand their needs
6. Make recommendations based on their interests

LEAD CAPTURE STRATEGY:
${hasContactInfo.hasEmail ? '' : `- After answering 2-3 questions well, naturally offer to send more information via email
- Example: "I'd love to send you our full menu! What's the best email to reach you?"`}
${hasContactInfo.hasName ? '' : `- Once you have email, ask for their name naturally
- Example: "Perfect! And what should I call you?"`}
${hasContactInfo.hasPhone ? '' : `- If they show strong interest, offer to have someone call them
- Example: "Want me to have someone call you about booking? What's your number?"`}

IMPORTANT:
- Make contact info requests OPTIONAL ("It's totally optional!")
- Explain the benefit ("so I can send you details")
- One question at a time (don't ask for name + email together)
- If they skip, that's fine - keep helping anyway
- NEVER pressure or be pushy

Based on the information provided, answer the customer's question helpfully and naturally.`;

  return basePrompt;
}

/**
 * Generate introduction message
 */
function getIntroductionMessage(businessName, aiName = null) {
  const name = aiName || getDefaultAIName(businessName);
  
  const greetings = [
    `Hi! I'm ${name}, the AI assistant for ${businessName}! 👋 How can I help you today?`,
    `Hey there! I'm ${name}, here to help you with ${businessName}! 😊 What can I answer for you?`,
    `Hello! I'm ${name}, the virtual assistant for ${businessName}! What brings you here today?`
  ];
  
  // Return random greeting for variety
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Get default AI name based on business type
 */
function getDefaultAIName(businessName) {
  // Extract first word or create friendly name
  const firstName = businessName.split(' ')[0];
  
  const names = [
    `${firstName} Assistant`,
    'Alex',
    'Jamie',
    'Sam',
    'Riley'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate email capture prompt
 */
function getEmailCapturePrompt(context) {
  const prompts = [
    "I'd love to send you more details about this! What's the best email to reach you? (It's totally optional - I can keep chatting here too!) 📧",
    "Want me to email you our full information? What's your email address? (No pressure - you can skip this if you prefer!)",
    "I can send you all this info in an email if that's helpful! What's your email? (Or we can just keep chatting here - whatever works best for you!)"
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Generate name capture prompt
 */
function getNameCapturePrompt() {
  const prompts = [
    "Perfect! And what should I call you? 😊",
    "Great! What's your name?",
    "Awesome! And who am I chatting with?"
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Generate phone capture prompt
 */
function getPhoneCapturePrompt() {
  const prompts = [
    "Would you like someone from our team to give you a call? What's the best number to reach you?",
    "I can have our team call you to discuss this further! What's your phone number?",
    "Want a call back to answer any other questions? What number should we use?"
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Detect if user is providing contact information
 */
function detectContactInfo(message) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  
  return {
    hasEmail: emailRegex.test(message),
    email: message.match(emailRegex)?.[0] || null,
    hasPhone: phoneRegex.test(message),
    phone: message.match(phoneRegex)?.[0] || null
  };
}

/**
 * Check if it's a good time to ask for email
 */
function shouldAskForEmail(lead, messageCount) {
  // Don't ask if we already have email
  if (lead.email) return false;
  
  // Ask after 2-3 helpful exchanges
  if (messageCount < 4) return false;
  
  // Ask if user shows strong interest
  if (lead.leadScore > 30) return true;
  
  // Ask if user asks multiple questions
  if (lead.questions.length >= 3) return true;
  
  return false;
}

module.exports = {
  getSystemPrompt,
  getIntroductionMessage,
  getEmailCapturePrompt,
  getNameCapturePrompt,
  getPhoneCapturePrompt,
  detectContactInfo,
  shouldAskForEmail
};
```

2. **Git commit:**
```bash
git add backend/src/prompts/conversation.prompts.js
git commit -m "feat: add conversation prompts for natural lead capture UX"
```

**Deliverables:**
- [ ] conversation.prompts.js created
- [ ] System prompts for AI personality
- [ ] Introduction messages
- [ ] Lead capture prompts
- [ ] Contact info detection
- [ ] Git commit completed

**Wait for verification before proceeding to Step 4**

---

### **STEP 4: Update Public Chat Controller**

**Task:** Integrate lead capture into chat flow

**What to do:**

1. **Update:** `backend/src/controllers/publicChat.controller.js`

```javascript
// backend/src/controllers/publicChat.controller.js

const Business = require('../models/Business');
const PublicChat = require('../models/PublicChat');
const leadService = require('../services/lead.service');
const { searchWithFallback } = require('../services/search.service');
const { generateCompletion } = require('../services/completion.service');
const {
  getSystemPrompt,
  getIntroductionMessage,
  detectContactInfo,
  shouldAskForEmail,
  getEmailCapturePrompt
} = require('../prompts/conversation.prompts');

/**
 * Enhanced public chat with lead capture
 */
async function publicChat(req, res, next) {
  const startTime = Date.now();
  
  try {
    const { businessSlug } = req.params;
    const { question, sessionId, isFirstMessage } = req.body;
    
    // Validate inputs
    if (!question || !sessionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Question and sessionId are required'
        }
      });
    }
    
    console.log('💬 Public chat:', businessSlug, '| Session:', sessionId);
    
    // Find business
    const business = await Business.findOne({
      businessSlug: businessSlug,
      isActive: true
    });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'BUSINESS_NOT_FOUND',
          message: 'Business not found'
        }
      });
    }
    
    // Check if chat enabled
    if (!business.chatSettings.isPublic) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CHAT_DISABLED',
          message: 'Chat is not enabled'
        }
      });
    }
    
    // Find or create lead
    const lead = await leadService.findOrCreateLead(
      business._id,
      business.businessSlug,
      sessionId
    );
    
    // Add user message to chat history
    await leadService.addChatMessage(sessionId, 'user', question);
    
    // Detect and extract contact information from message
    const contactInfo = detectContactInfo(question);
    
    if (contactInfo.hasEmail && !lead.email) {
      await leadService.updateContactInfo(sessionId, {
        email: contactInfo.email
      });
      console.log('✅ Email captured:', contactInfo.email);
    }
    
    if (contactInfo.hasPhone && !lead.phone) {
      await leadService.updateContactInfo(sessionId, {
        phone: contactInfo.phone
      });
      console.log('✅ Phone captured:', contactInfo.phone);
    }
    
    // If first message, return introduction
    if (isFirstMessage) {
      const intro = getIntroductionMessage(business.businessName);
      
      await leadService.addChatMessage(sessionId, 'assistant', intro);
      
      return res.json({
        success: true,
        answer: intro,
        isIntroduction: true,
        businessName: business.businessName
      });
    }
    
    // Add question to lead
    await leadService.addQuestion(sessionId, question);
    
    // Extract and add interests
    const interests = leadService.extractInterests(question);
    for (const interest of interests) {
      await leadService.addInterest(sessionId, interest);
    }
    
    // Search documents
    const searchResults = await searchWithFallback(
      business._id,
      question,
      3
    );
    
    // Build context
    const context = buildContext(searchResults, business.businessName);
    
    // Get system prompt with lead info
    const systemPrompt = getSystemPrompt(
      business.businessName,
      business.businessType || 'business',
      {
        hasEmail: !!lead.email,
        hasName: !!lead.name,
        hasPhone: !!lead.phone
      }
    );
    
    // Generate answer
    const answer = await generateCompletion(question, context, systemPrompt);
    
    // Add AI response to chat history
    await leadService.addChatMessage(sessionId, 'assistant', answer);
    
    // Update lead score
    await lead.updateScore();
    
    // Check if we should ask for email
    const messageCount = lead.chatHistory.length;
    const shouldCaptureLead = shouldAskForEmail(lead, messageCount);
    
    let finalAnswer = answer;
    
    // Append email capture prompt if appropriate
    if (shouldCaptureLead && !lead.email) {
      const emailPrompt = getEmailCapturePrompt();
      finalAnswer = `${answer}\n\n${emailPrompt}`;
    }
    
    // Save to PublicChat for analytics
    await PublicChat.create({
      businessId: business._id,
      businessName: business.businessName,
      businessSlug: business.businessSlug,
      sessionId,
      leadId: lead._id,
      question,
      answer: finalAnswer,
      sources: searchResults.map(r => r.filename),
      responseTime: Date.now() - startTime,
      createdAt: new Date()
    });
    
    // Update business stats
    await Business.findByIdAndUpdate(business._id, {
      $inc: { 'stats.totalChats': 1 }
    });
    
    console.log('✅ Chat completed | Lead score:', lead.leadScore);
    
    // Return response
    res.json({
      success: true,
      answer: finalAnswer,
      leadScore: lead.leadScore,
      hasContactInfo: {
        name: !!lead.name,
        email: !!lead.email,
        phone: !!lead.phone
      }
    });
    
  } catch (error) {
    console.error('❌ Public chat error:', error);
    next(error);
  }
}

/**
 * Build context from search results
 */
function buildContext(searchResults, businessName) {
  if (searchResults.length === 0) {
    return `You are the AI assistant for ${businessName}. The customer asked a question but no relevant information was found in the knowledge base. Politely let them know you don't have that specific information, and offer to have someone from the business contact them directly to help.`;
  }
  
  const contextParts = searchResults.map((result, index) => {
    return `Information ${index + 1}:\n${result.content.slice(0, 500)}`;
  });
  
  return contextParts.join('\n\n');
}

module.exports = {
  publicChat
};
```

2. **Git commit:**
```bash
git add backend/src/controllers/publicChat.controller.js
git commit -m "feat: integrate lead capture into public chat flow with natural UX"
```

**Deliverables:**
- [ ] publicChat controller updated
- [ ] Lead tracking integrated
- [ ] Contact info detection working
- [ ] Natural email capture timing
- [ ] Git commit completed

**Wait for verification before proceeding to Step 5**

---

### **STEP 5: Create Lead Management API**

**Task:** Create endpoints for businesses to view and manage leads

**What to do:**

1. **Create file:** `backend/src/controllers/lead.controller.js`

```javascript
// backend/src/controllers/lead.controller.js

const leadService = require('../services/lead.service');
const Business = require('../models/Business');

/**
 * Get all leads for a business
 */
async function getLeads(req, res, next) {
  try {
    const { businessId } = req.params;
    const { status, hasEmail, minScore, limit } = req.query;
    
    // Verify business access
    // (Assume you have auth middleware that checks this)
    
    const leads = await leadService.getBusinessLeads(businessId, {
      status,
      hasEmail: hasEmail === 'true',
      minScore: minScore ? parseInt(minScore) : undefined,
      limit: limit ? parseInt(limit) : 100
    });
    
    res.json({
      success: true,
      count: leads.length,
      leads: leads.map(lead => ({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        interests: lead.interests,
        questionCount: lead.questions.length,
        leadScore: lead.leadScore,
        status: lead.status,
        firstContact: lead.firstContact,
        lastContact: lead.lastContact
      }))
    });
    
  } catch (error) {
    console.error('❌ Get leads error:', error);
    next(error);
  }
}

/**
 * Get single lead details
 */
async function getLeadDetails(req, res, next) {
  try {
    const { businessId, leadId } = req.params;
    
    const lead = await leadService.getLeadBySession(leadId);
    
    if (!lead || lead.businessId.toString() !== businessId) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lead not found' }
      });
    }
    
    res.json({
      success: true,
      lead: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        interests: lead.interests,
        questions: lead.questions,
        chatHistory: lead.chatHistory,
        leadScore: lead.leadScore,
        status: lead.status,
        notes: lead.notes,
        firstContact: lead.firstContact,
        lastContact: lead.lastContact,
        createdAt: lead.createdAt
      }
    });
    
  } catch (error) {
    console.error('❌ Get lead details error:', error);
    next(error);
  }
}

/**
 * Update lead status
 */
async function updateLeadStatus(req, res, next) {
  try {
    const { businessId, leadId } = req.params;
    const { status, notes } = req.body;
    
    const lead = await leadService.getLeadBySession(leadId);
    
    if (!lead || lead.businessId.toString() !== businessId) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lead not found' }
      });
    }
    
    if (status) {
      lead.status = status;
    }
    
    if (notes) {
      lead.notes = notes;
    }
    
    await lead.save();
    
    res.json({
      success: true,
      message: 'Lead updated',
      lead: {
        id: lead._id,
        status: lead.status,
        notes: lead.notes
      }
    });
    
  } catch (error) {
    console.error('❌ Update lead error:', error);
    next(error);
  }
}

/**
 * Export leads as CSV
 */
async function exportLeads(req, res, next) {
  try {
    const { businessId } = req.params;
    
    const leads = await leadService.getBusinessLeads(businessId, {});
    
    // Create CSV
    const csv = [
      ['Name', 'Email', 'Phone', 'Interests', 'Lead Score', 'Status', 'First Contact', 'Last Contact'],
      ...leads.map(lead => [
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.interests.join('; '),
        lead.leadScore,
        lead.status,
        lead.firstContact.toISOString(),
        lead.lastContact.toISOString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
    
  } catch (error) {
    console.error('❌ Export leads error:', error);
    next(error);
  }
}

module.exports = {
  getLeads,
  getLeadDetails,
  updateLeadStatus,
  exportLeads
};
```

2. **Create routes:** `backend/src/routes/lead.routes.js`

```javascript
// backend/src/routes/lead.routes.js

const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { authenticateToken } = require('../middleware/auth');
const { checkBusinessAccess } = require('../middleware/businessAccess');

/**
 * Lead management routes
 * All require authentication and business access
 */

// Get all leads for business
router.get(
  '/business/:businessId/leads',
  authenticateToken,
  checkBusinessAccess,
  leadController.getLeads
);

// Get single lead details
router.get(
  '/business/:businessId/leads/:leadId',
  authenticateToken,
  checkBusinessAccess,
  leadController.getLeadDetails
);

// Update lead status
router.patch(
  '/business/:businessId/leads/:leadId',
  authenticateToken,
  checkBusinessAccess,
  leadController.updateLeadStatus
);

// Export leads as CSV
router.get(
  '/business/:businessId/leads/export/csv',
  authenticateToken,
  checkBusinessAccess,
  leadController.exportLeads
);

module.exports = router;
```

3. **Update server.js to include lead routes:**

```javascript
// backend/src/server.js

// Add to your routes
const leadRoutes = require('./routes/lead.routes');
app.use('/api', leadRoutes);
```

4. **Git commit:**
```bash
git add backend/src/controllers/lead.controller.js backend/src/routes/lead.routes.js backend/src/server.js
git commit -m "feat: add lead management API for viewing and exporting customer data"
```

**Deliverables:**
- [ ] lead.controller.js created
- [ ] lead.routes.js created
- [ ] CRUD endpoints for leads
- [ ] CSV export functionality
- [ ] Server.js updated
- [ ] Git commit completed

**Wait for verification before proceeding to Step 6**

---

### **STEP 6: Update Frontend Chat Widget**

**Task:** Update chat widget to send isFirstMessage flag

**What to do:**

1. **Update:** `frontend/src/components/ChatWidget.jsx` (or wherever your chat is)

```javascript
// frontend/src/components/ChatWidget.jsx

import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';

function ChatWidget({ businessSlug }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Generate session ID on mount
  useEffect(() => {
    const existingSession = localStorage.getItem('chat_session_id');
    if (existingSession) {
      setSessionId(existingSession);
      setIsFirstMessage(false);
    } else {
      const newSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat_session_id', newSession);
      setSessionId(newSession);
    }
  }, []);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Load introduction on first load
  useEffect(() => {
    if (sessionId && isFirstMessage && messages.length === 0) {
      loadIntroduction();
    }
  }, [sessionId]);
  
  const loadIntroduction = async () => {
    try {
      const response = await fetch(`${API_URL}/api/public/chat/${businessSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Hi',
          sessionId,
          isFirstMessage: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages([{
          role: 'assistant',
          content: data.answer,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error loading introduction:', error);
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/public/chat/${businessSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          sessionId,
          isFirstMessage: false  // Always false after intro
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.answer,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Update first message flag
        if (isFirstMessage) {
          setIsFirstMessage(false);
        }
      } else {
        throw new Error(data.error?.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again!',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Chat with us! 💬</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWidget;
```

2. **Add CSS:**

```css
/* frontend/src/components/ChatWidget.css */

.chat-widget {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 16px;
  text-align: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-content {
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #007bff;
  color: white;
}

.message.assistant .message-content {
  background: white;
  border: 1px solid #ddd;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 10px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

.chat-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: white;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #007bff;
}

.chat-input button {
  margin-left: 8px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-input button:not(:disabled):hover {
  background: #0056b3;
}
```

3. **Git commit:**
```bash
git add frontend/src/components/ChatWidget.jsx frontend/src/components/ChatWidget.css
git commit -m "feat: update chat widget with introduction message and improved UX"
```

**Deliverables:**
- [ ] ChatWidget component updated
- [ ] Introduction message displayed
- [ ] Session management working
- [ ] Improved UI/UX
- [ ] Git commit completed

**Wait for verification before proceeding to Step 7**

---

### **STEP 7: Create Leads Dashboard (Frontend)**

**Task:** Create UI for businesses to view captured leads

> **YES! Business owners can absolutely see customer leads in their dashboard!**
> 
> This is a crucial feature - businesses need to see who's interested in their services!
> 
> **What Business Owners Will See:**
> - All customer leads in a beautiful table
> - Contact info (name, email, phone)
> - What they're interested in
> - Lead quality score (0-100)
> - Full chat history
> - Export to CSV for email marketing

**What to do:**

1. **Create:** `frontend/src/pages/Leads.jsx`

```javascript
// frontend/src/pages/Leads.jsx

import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './Leads.css';

function Leads({ businessId }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  
  useEffect(() => {
    fetchLeads();
  }, [filter]);
  
  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = new URL(`${API_URL}/api/business/${businessId}/leads`);
      
      if (filter === 'email') {
        url.searchParams.append('hasEmail', 'true');
      } else if (filter === 'hot') {
        url.searchParams.append('minScore', '50');
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const exportLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/business/${businessId}/leads/export/csv`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting leads:', error);
    }
  };
  
  const getScoreColor = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };
  
  if (loading) {
    return <div className="loading">Loading leads...</div>;
  }
  
  return (
    <div className="leads-page">
      <div className="leads-header">
        <h1>Customer Leads</h1>
        <div className="leads-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Leads</option>
            <option value="email">Has Email</option>
            <option value="hot">Hot Leads (50+)</option>
          </select>
          
          <button onClick={exportLeads} className="export-btn">
            📊 Export CSV
          </button>
        </div>
      </div>
      
      <div className="leads-stats">
        <div className="stat-card">
          <div className="stat-number">{leads.length}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {leads.filter(l => l.email).length}
          </div>
          <div className="stat-label">With Email</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {leads.filter(l => l.leadScore >= 50).length}
          </div>
          <div className="stat-label">Hot Leads</div>
        </div>
      </div>
      
      <div className="leads-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Interests</th>
              <th>Questions</th>
              <th>Score</th>
              <th>Last Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-leads">
                  No leads yet. Share your chat link to start capturing leads!
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.name || '-'}</td>
                  <td>{lead.email || '-'}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>
                    <div className="interests">
                      {lead.interests.slice(0, 2).map((interest, i) => (
                        <span key={i} className="interest-tag">
                          {interest}
                        </span>
                      ))}
                      {lead.interests.length > 2 && (
                        <span className="interest-more">
                          +{lead.interests.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{lead.questionCount}</td>
                  <td>
                    <span className={`score-badge ${getScoreColor(lead.leadScore)}`}>
                      {lead.leadScore}
                    </span>
                  </td>
                  <td>
                    {new Date(lead.lastContact).toLocaleDateString()}
                  </td>
                  <td>
                    <button 
                      onClick={() => setSelectedLead(lead)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {selectedLead && (
        <LeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

function LeadModal({ lead, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Lead Details</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-group">
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> {lead.name || 'Not provided'}</p>
            <p><strong>Email:</strong> {lead.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> {lead.phone || 'Not provided'}</p>
          </div>
          
          <div className="detail-group">
            <h3>Interests</h3>
            <div className="interests">
              {lead.interests.map((interest, i) => (
                <span key={i} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="detail-group">
            <h3>Activity</h3>
            <p><strong>Questions Asked:</strong> {lead.questionCount}</p>
            <p><strong>Lead Score:</strong> {lead.leadScore}</p>
            <p><strong>Status:</strong> {lead.status}</p>
            <p><strong>First Contact:</strong> {new Date(lead.firstContact).toLocaleString()}</p>
            <p><strong>Last Contact:</strong> {new Date(lead.lastContact).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leads;
```

2. **Add CSS:** `frontend/src/pages/Leads.css`

```css
/* frontend/src/pages/Leads.css */

.leads-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.leads-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.leads-header h1 {
  margin: 0;
  font-size: 28px;
}

.leads-actions {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.export-btn {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.export-btn:hover {
  background: #218838;
}

.leads-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.leads-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

tr:hover {
  background: #f8f9fa;
}

.no-leads {
  text-align: center;
  padding: 40px;
  color: #999;
}

.interests {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.interest-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #e7f3ff;
  color: #007bff;
  border-radius: 12px;
  font-size: 12px;
}

.interest-more {
  display: inline-block;
  padding: 4px 8px;
  background: #f8f9fa;
  color: #666;
  border-radius: 12px;
  font-size: 12px;
}

.score-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
}

.score-badge.high {
  background: #d4edda;
  color: #155724;
}

.score-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.score-badge.low {
  background: #f8d7da;
  color: #721c24;
}

.view-btn {
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.view-btn:hover {
  background: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-group {
  margin-bottom: 24px;
}

.detail-group h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #495057;
}

.detail-group p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
}
```

3. **Add to navigation:**

Update your dashboard navigation to include Leads page.

4. **Git commit:**
```bash
git add frontend/src/pages/Leads.jsx frontend/src/pages/Leads.css
git commit -m "feat: add leads dashboard for viewing and managing customer data"
```

**Deliverables:**
- [ ] Leads page created
- [ ] Lead filtering working
- [ ] Lead details modal
- [ ] CSV export button
- [ ] Git commit completed

**Wait for verification before proceeding to Step 8**

---

### **STEP 8: Testing & Documentation**

**Task:** Test the complete lead capture flow and document it

**What to do:**

1. **Create test plan:** `docs/LEAD_CAPTURE_TESTING.md`

```markdown
# Lead Capture Feature - Testing Guide

## Test Scenarios

### Scenario 1: First-Time Visitor
**Steps:**
1. Open chat widget
2. Observe introduction message
3. Ask a question: "What are your prices?"
4. AI should answer without asking for info
5. Ask 2-3 more questions
6. After 3rd question, AI should naturally ask for email
7. Provide email in response
8. AI should thank and ask for name
9. Provide name
10. AI should use name in responses

**Expected Results:**
- ✅ Warm introduction displayed
- ✅ Helpful answers before any requests
- ✅ Natural email request after 2-3 exchanges
- ✅ Name request after email provided
- ✅ Personalized responses using name

### Scenario 2: Email Detection
**Steps:**
1. Start chat
2. In response, include email: "Yes, my email is test@email.com"
3. AI should recognize email automatically
4. Check leads dashboard

**Expected Results:**
- ✅ Email detected and saved
- ✅ Lead appears in dashboard with email

### Scenario 3: Phone Detection
**Steps:**
1. Chat with AI
2. Mention phone: "You can call me at 555-123-4567"
3. Check leads dashboard

**Expected Results:**
- ✅ Phone detected and saved
- ✅ Lead updated with phone number

### Scenario 4: Lead Scoring
**Steps:**
1. Ask multiple questions (5+)
2. Provide email and name
3. Express strong interests
4. Check lead score in dashboard

**Expected Results:**
- ✅ Lead score increases with engagement
- ✅ High score (50+) for engaged users

### Scenario 5: Lead Management
**Steps:**
1. Go to Leads dashboard
2. Filter by "Has Email"
3. View lead details
4. Export CSV

**Expected Results:**
- ✅ Filtering works correctly
- ✅ Lead details show all info
- ✅ CSV downloads with all leads

## Manual Testing Checklist

### Chat Widget
- [ ] Introduction message displays
- [ ] User can send messages
- [ ] AI responses are friendly
- [ ] Emojis render correctly
- [ ] No robotic language
- [ ] Session persists on refresh

### Lead Capture
- [ ] Email detected automatically
- [ ] Phone detected automatically
- [ ] Name captured when asked
- [ ] Interests extracted from questions
- [ ] Lead score calculated correctly
- [ ] All data saved to database

### Lead Dashboard
- [ ] All leads displayed
- [ ] Filters work correctly
- [ ] Lead details accessible
- [ ] CSV export works
- [ ] Stats accurate

### UX Quality
- [ ] AI sounds human and friendly
- [ ] No pressure to provide info
- [ ] Info requests feel natural
- [ ] Context maintained across messages
- [ ] No repetitive questions

## Database Verification

Check MongoDB collections:

```javascript
// Check lead was created
db.leads.findOne({ sessionId: "session_..." })

// Verify data structure
{
  businessId: ObjectId,
  sessionId: String,
  name: String,
  email: String,
  phone: String,
  interests: Array,
  questions: Array,
  chatHistory: Array,
  leadScore: Number,
  status: "new"
}
```

## API Testing

### Test Endpoints:

```bash
# Get all leads
GET /api/business/:businessId/leads
Authorization: Bearer <token>

# Get lead details
GET /api/business/:businessId/leads/:leadId
Authorization: Bearer <token>

# Export leads
GET /api/business/:businessId/leads/export/csv
Authorization: Bearer <token>
```

## Known Issues

Document any issues found during testing:

1. Issue: [Description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Priority: High/Medium/Low

## Performance Testing

- [ ] Chat responds within 2 seconds
- [ ] Lead dashboard loads < 1 second
- [ ] CSV export completes < 5 seconds
- [ ] No memory leaks in long conversations

## Security Testing

- [ ] Lead data isolated by business
- [ ] Auth required for lead access
- [ ] No XSS vulnerabilities in chat
- [ ] Email/phone validation working
- [ ] No SQL injection possible

## Sign-Off

Tested by: __________
Date: __________
Status: ✅ PASS / ❌ FAIL
Notes: __________
```

2. **Create feature documentation:** `docs/LEAD_CAPTURE_FEATURE.md`

```markdown
# Lead Capture Feature Documentation

## Overview

The Business AI Assistant now captures customer contact information naturally during conversations.

## Key Features

### 1. Natural Introduction
Every chat starts with a friendly introduction:
- AI introduces itself with business name
- Warm, personalized greeting
- Immediately offers to help

### 2. Smart Lead Capture
- Gives helpful answers FIRST (2-3 exchanges)
- Asks for email naturally when appropriate
- Asks for name after email
- Detects email/phone in messages automatically
- Makes requests optional (no pressure)

### 3. Lead Tracking
- Stores name, email, phone
- Tracks interests from questions
- Logs full chat history
- Calculates lead quality score (0-100)

### 4. Business Dashboard
- View all leads
- Filter by status, contact info, score
- View detailed lead information
- Export leads as CSV

## User Experience Principles

### Give Before Asking
✅ Do: Answer 2-3 questions helpfully first
❌ Don't: Ask for contact info immediately

### One Question at a Time
✅ Do: "What's your email?" then "What's your name?"
❌ Don't: "Please provide your name, email, and phone"

### Explain the Benefit
✅ Do: "I'd love to send you our menu! What's your email?"
❌ Don't: "Please provide your email address."

### Make It Optional
✅ Do: "What's your email? (It's optional - I can keep chatting here too!)"
❌ Don't: "I need your email to continue."

### Sound Human
✅ Do: "Perfect! And what should I call you? 😊"
❌ Don't: "Input name value:"

## Technical Implementation

### Database Schema

**Lead Model:**
- businessId, sessionId (required)
- name, email, phone (optional, captured gradually)
- interests[] (extracted from questions)
- questions[] (all questions asked)
- chatHistory[] (full conversation)
- leadScore (0-100, auto-calculated)
- status (new/contacted/qualified/converted)

### API Endpoints

```
GET    /api/business/:id/leads              # Get all leads
GET    /api/business/:id/leads/:leadId      # Get lead details
PATCH  /api/business/:id/leads/:leadId      # Update lead
GET    /api/business/:id/leads/export/csv   # Export CSV
```

### Lead Scoring Algorithm

```
Email provided: +30 points
Phone provided: +20 points
Name provided: +10 points
Each question: +5 points (max 25)
Each interest: +5 points (max 15)
Chat duration 5+ min: +10 points
Chat duration 10+ min: +5 points

Maximum: 100 points
```

### Conversation Flow

```
1. First message → Introduction (no ask)
2. User questions 1-2 → Answer helpfully
3. User question 3 → Answer + ask for email (optional)
4. Email provided → Thank + ask for name
5. Name provided → Use name in responses
6. Strong interest shown → Optionally ask for phone
7. Continue helpful conversation
```

## Business Benefits

### Better Lead Quality
- Engaged users (score 50+) are warm leads
- Full context from chat history
- Interests clearly identified

### Higher Conversion
- Natural approach = more contact info shared
- No pressure = better user experience
- Personalized follow-up possible

### Actionable Insights
- See what customers ask about
- Identify common interests
- Track engagement levels

## Privacy & Compliance

### GDPR Friendly
- All requests are optional
- Users can skip any question
- Data deletion available
- Clear about data storage

### Transparency
- AI clearly identifies itself
- Explains why contact info is needed
- Shows benefit of providing info

## Usage Guidelines

### For Business Owners
1. Share chat link with customers
2. Monitor leads dashboard daily
3. Follow up with hot leads (50+) first
4. Use interests to personalize outreach
5. Export leads weekly for CRM

### For Developers
1. Don't modify conversation prompts without UX review
2. Test lead capture flow after any changes
3. Monitor lead scores for accuracy
4. Keep chat responses under 3 sentences typically
5. Never make contact info mandatory

## Future Enhancements

Planned features:
- [ ] Webhook notifications for new leads
- [ ] Lead assignment to team members
- [ ] Email automation for follow-ups
- [ ] SMS notifications for hot leads
- [ ] Integration with popular CRMs
- [ ] A/B testing different prompts
- [ ] Lead source tracking
- [ ] Conversation analytics

## Support

For issues or questions:
- Technical: See code comments
- UX: See conversation.prompts.js
- Database: See Lead model
- API: See lead.controller.js
```

3. **Git commit:**
```bash
git add docs/LEAD_CAPTURE_TESTING.md docs/LEAD_CAPTURE_FEATURE.md
git commit -m "docs: add comprehensive testing guide and feature documentation for lead capture"
```

**Deliverables:**
- [ ] Testing guide created
- [ ] Feature documentation created
- [ ] All scenarios tested
- [ ] Git commit completed

**Wait for verification before proceeding to final step**

---

### **STEP 9: Final Testing & Deployment**

**Task:** Complete end-to-end testing and deploy

**What to do:**

1. **Run complete test suite**
2. **Verify all git commits are clear**
3. **Update CHANGELOG**
4. **Deploy to Railway (if not already)**
5. **Test in production**

**Final Git Commit:**
```bash
git add .
git commit -m "feat: complete lead capture and conversational UX enhancement

- Added Lead model for capturing customer data
- Implemented natural lead capture in chat flow
- Created friendly AI introduction messages
- Added lead management dashboard
- Built CSV export functionality
- Comprehensive testing and documentation

Features:
- Smart introduction with business branding
- Natural email/name/phone capture
- Automatic contact detection
- Lead scoring (0-100)
- Interest tracking
- Chat history logging
- Business dashboard for leads
- CSV export

UX Improvements:
- Helpful answers before asking
- One question at a time
- Optional contact requests
- Human-friendly language
- Emoji usage for warmth
- Context-aware responses

Breaking changes: None
Migration required: Run 'npm install' for new dependencies"

git push origin main
```

**Deliverables:**
- [ ] All features tested
- [ ] Git history clean and clear
- [ ] Documentation complete
- [ ] Deployed to Railway
- [ ] Production testing complete

---

## 🎯 SUCCESS CRITERIA

The implementation is complete when:

- [✅] Lead model created and working
- [✅] Natural conversation flow implemented
- [✅] Email/name/phone capture working
- [✅] Automatic contact detection functional
- [✅] Lead scoring calculated correctly
- [✅] Chat history logged
- [✅] Business dashboard shows leads
- [✅] CSV export works
- [✅] All git commits clear and descriptive
- [✅] Testing guide completed
- [✅] Feature documentation done
- [✅] Deployed and working in production

---

## 📋 VERIFICATION CHECKLIST

**After each step, provide:**

1. **Code Changes:**
   - Files created/modified
   - Key functions implemented
   - Git commit message

2. **Test Results:**
   - Feature tested manually
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Next Steps:**
   - Ready for next step?
   - Any blockers?
   - Questions?

**Wait for "PROCEED TO NEXT STEP" confirmation before continuing**

---

## 🎯 REMEMBER

**UX Principles:**
- Give value BEFORE asking
- One question at a time
- Make requests optional
- Explain the benefit
- Sound human, not robotic
- No pressure or guilt

**Technical Principles:**
- Clear git commits for each step
- Test after each change
- Document as you go
- Keep it simple first
- Optimize later

---

**Let's build an amazing conversational experience!** 🚀
