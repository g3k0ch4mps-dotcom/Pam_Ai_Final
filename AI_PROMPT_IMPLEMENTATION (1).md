# 🚀 AI PROMPT: COMPLETE IMPLEMENTATION (Backend + Frontend)

**Copy this prompt and paste it into Cursor AI, Replit Agent, or v0.dev**

---

# PAMILO AI - Production Implementation Guide

## 📋 PROJECT CONTEXT

**Repository:** https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git

**What Exists (DO NOT DELETE):**
- ✅ Multi-tenant architecture (KEEP!)
- ✅ RBAC with 6 roles (KEEP!)
- ✅ Tenant isolation middleware (KEEP!)
- ✅ User, Business, Document, Conversation models
- ✅ OpenAI integration
- ✅ Basic API endpoints

**Your Task:**
ADD missing features to the existing codebase for production deployment.

---

## 🛠️ TECHNOLOGY STACK

### Backend (Keep + Add):
```javascript
Current (KEEP):
- Node.js 20.x
- Express 4.x
- MongoDB + Mongoose
- OpenAI API
- JWT auth

ADD:
- socket.io (real-time)
- nodemailer + @sendgrid/mail (emails)
- stripe (payments)
- google-auth-library (OAuth)
- redis (caching)
- bull (job queue)
```

### Frontend (Build):
```javascript
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TanStack Query (data fetching)
- Zustand (state)
- Socket.io-client
- Stripe Elements
```

---

## 📦 STEP 1: INSTALL DEPENDENCIES

### Backend:
```bash
cd backend
npm install socket.io google-auth-library nodemailer @sendgrid/mail stripe redis bull
```

### Frontend:
```bash
cd frontend
npm install next@14 react react-dom typescript @types/react @types/node
npm install tailwindcss postcss autoprefixer
npm install @tanstack/react-query zustand
npm install socket.io-client
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install lucide-react
npm install axios
npm install react-hook-form zod @hookform/resolvers
npm install recharts
```

---

## 🔧 STEP 2: ADD MISSING BACKEND FEATURES

### A. Update User Model

**File:** `backend/src/models/User.js`

ADD these fields (keep all existing):

```javascript
// Add after existing fields
googleId: String,
emailVerificationToken: String,
emailVerificationExpires: Date,
emailVerified: {
  type: Boolean,
  default: false
},
resetPasswordToken: String,
resetPasswordExpires: Date,
otpSecret: String,
otpEnabled: {
  type: Boolean,
  default: false
}
```

### B. Add Google OAuth

**File:** `backend/src/controllers/auth.controller.js`

ADD this method:

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const googleUser = ticket.getPayload();
    
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create user + business
      const slug = slugify(googleUser.given_name + '-' + Date.now());
      const business = await Business.create({
        businessName: googleUser.given_name + "'s Business",
        businessSlug: slug
      });
      
      user = await User.create({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        googleId: googleUser.sub,
        emailVerified: true,
        businessId: business._id,
        role: 'business_owner'
      });
    }
    
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        businessId: user.businessId,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Google authentication failed'
    });
  }
};
```

ADD route:
```javascript
router.post('/google', authController.googleAuth);
```

### C. Add Ticketing to Conversation Model

**File:** `backend/src/models/Conversation.js`

ADD these fields:

```javascript
// Add after existing fields
isTicket: { type: Boolean, default: false },
ticketNumber: { type: String, unique: true, sparse: true },
status: {
  type: String,
  enum: ['open', 'pending', 'in_progress', 'resolved', 'closed'],
  default: 'open'
},
priority: {
  type: String,
  enum: ['low', 'medium', 'high', 'urgent'],
  default: 'medium'
},
assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
tags: [String],
dueDate: Date,
resolvedAt: Date,
closedAt: Date,
customerEmail: String,
customerName: String,
channel: {
  type: String,
  enum: ['chat', 'email', 'widget'],
  default: 'chat'
}

// Add pre-save hook
conversationSchema.pre('save', async function(next) {
  if (this.isNew && this.isTicket && !this.ticketNumber) {
    const count = await this.constructor.countDocuments({ 
      businessId: this.businessId,
      isTicket: true 
    });
    this.ticketNumber = `TICKET-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});
```

### D. Add Visitor Tracking Model

**File:** `backend/src/models/Visitor.js` (NEW)

```javascript
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  sessionId: { type: String, required: true, index: true },
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String
  },
  isOnline: { type: Boolean, default: true },
  currentPage: String,
  visitHistory: [{
    page: String,
    timestamp: Date,
    timeSpent: Number
  }],
  totalPageViews: { type: Number, default: 0 },
  totalTimeOnSite: { type: Number, default: 0 },
  hasStartedChat: { type: Boolean, default: false },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

visitorSchema.index({ businessId: 1, isOnline: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
```

### E. Add WebSocket Server

**File:** `backend/src/server.js`

MODIFY:

```javascript
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Add socket handlers
require('./sockets/visitor.socket')(io);

// CHANGE app.listen to server.listen
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
```

**File:** `backend/src/sockets/visitor.socket.js` (NEW)

```javascript
const Visitor = require('../models/Visitor');
const Business = require('../models/Business');

module.exports = (io) => {
  const visitorNamespace = io.of('/visitor-tracking');
  
  visitorNamespace.on('connection', (socket) => {
    let currentVisitor = null;
    
    socket.on('visitor:identify', async (data) => {
      const { businessSlug, sessionId, page } = data;
      
      try {
        const business = await Business.findOne({ businessSlug });
        if (!business) return;
        
        currentVisitor = await Visitor.findOneAndUpdate(
          { businessId: business._id, sessionId },
          {
            $set: {
              isOnline: true,
              currentPage: page,
              ipAddress: socket.handshake.address
            },
            $inc: { totalPageViews: 1 },
            $setOnInsert: { sessionId, businessId: business._id }
          },
          { upsert: true, new: true }
        );
        
        socket.join(`business:${business._id}`);
        
        visitorNamespace.to(`business:${business._id}`).emit('visitor:online', {
          visitorId: currentVisitor._id,
          page
        });
      } catch (error) {
        console.error('Visitor identify error:', error);
      }
    });
    
    socket.on('disconnect', async () => {
      if (currentVisitor) {
        currentVisitor.isOnline = false;
        await currentVisitor.save();
        
        visitorNamespace.to(`business:${currentVisitor.businessId}`).emit('visitor:offline', {
          visitorId: currentVisitor._id
        });
      }
    });
  });
};
```

### F. Add Stripe Integration

**File:** `backend/src/controllers/subscription.controller.js` (NEW)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Business = require('../models/Business');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;
    const business = req.business;
    
    let customerId = business.subscription?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { businessId: business._id.toString() }
      });
      customerId = customer.id;
      
      business.subscription = business.subscription || {};
      business.subscription.stripeCustomerId = customerId;
      await business.save();
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: { businessId: business._id.toString() }
    });
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
};
```

ADD routes in `backend/src/routes/subscription.routes.js`.

---

## 🎨 STEP 3: BUILD FRONTEND

### A. Setup Next.js

**File:** `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### B. Setup Tailwind

**File:** `frontend/tailwind.config.ts`

```javascript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        }
      }
    },
  },
  plugins: [],
}

export default config
```

### C. Create API Service Layer

**File:** `frontend/src/lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: any) => 
    api.post('/auth/register', data),
  googleAuth: (token: string) => 
    api.post('/auth/google', { token }),
  getCurrentUser: () => 
    api.get('/auth/me')
};

export const businessService = {
  getDashboard: () => 
    api.get('/business/v1/dashboard/stats'),
  getConversations: (params?: any) => 
    api.get('/business/v1/conversations', { params }),
  getTickets: (params?: any) => 
    api.get('/business/v1/tickets', { params }),
  getLeads: (params?: any) => 
    api.get('/business/v1/leads', { params }),
};

export default api;
```

### D. Create Auth Context

**File:** `frontend/src/contexts/AuthContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### E. Create Login Page

**File:** `frontend/src/app/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### F. Create Dashboard Page

**File:** `frontend/src/app/dashboard/page.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { businessService } from '@/lib/api';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => businessService.getDashboard()
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  const stats = data?.data?.stats;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-6">
        <StatCard 
          title="Total Conversations"
          value={stats?.conversations || 0}
          trend="+12%"
        />
        <StatCard 
          title="Leads Captured"
          value={stats?.leads || 0}
          trend="+23%"
        />
        <StatCard 
          title="Tickets Open"
          value={stats?.tickets || 0}
          trend="-5%"
        />
        <StatCard 
          title="Visitors Today"
          value={stats?.visitors || 0}
          trend="+45%"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-green-500 text-sm mt-1">{trend}</p>
    </div>
  );
}
```

---

## ⚙️ STEP 4: ENVIRONMENT VARIABLES

### Backend `.env`:
```env
# Database
MONGODB_URI=mongodb+srv://...

# Auth
JWT_SECRET=your-super-secret-key-minimum-32-chars
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# AI
OPENAI_API_KEY=sk-...

# Email
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@pamiloai.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
FRONTEND_URL=https://pamiloai.com
CORS_ORIGIN=https://pamiloai.com

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## ✅ SUCCESS CRITERIA

Implementation is complete when:
- ✅ Google OAuth works
- ✅ Tickets can be created and managed
- ✅ WebSocket tracks visitors in real-time
- ✅ Stripe checkout works
- ✅ Frontend connects to backend
- ✅ All pages load real data
- ✅ Dashboard shows live metrics
- ✅ Chat widget embeddable
- ✅ Multi-tenant isolation working
- ✅ No breaking changes to existing code

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to VPS:
- [ ] All environment variables set
- [ ] MongoDB indexes created
- [ ] Stripe webhooks configured
- [ ] SSL certificates installed
- [ ] Nginx configured
- [ ] PM2 process manager setup
- [ ] Cloudflare DNS configured
- [ ] Backups automated
- [ ] Monitoring enabled (Sentry)
- [ ] Load testing completed

---

**Build it production-ready!** 🚀
