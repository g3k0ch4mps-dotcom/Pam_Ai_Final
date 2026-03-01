# 🚀 ANTIGRAVITY PROMPT: PAMILO AI - Complete Full-Stack Development

## 📋 PROJECT OVERVIEW

**Project Name:** Pamilo AI  
**Type:** Multi-tenant SaaS Platform (AI-Powered Customer Support)  
**Tech Stack:** Next.js 14 + Node.js + Express + MongoDB + OpenAI  
**Deployment Target:** Production VPS  
**Timeline:** 8-12 weeks

---

## 🎯 WHAT IS PAMILO AI?

Pamilo AI is a **Tidio/Intercom competitor** - a multi-tenant SaaS platform that provides AI-powered customer support chatbots for businesses. Think "AI customer support agent that never sleeps."

**Core Features:**
- Business owners can train AI on their documents/website
- AI automatically responds to customer questions 24/7
- Built-in lead capture, ticketing, team collaboration
- Embeddable chat widget for any website
- Real-time visitor tracking
- Multi-tenant with complete business isolation

---

## 📦 WHAT YOU'VE BEEN PROVIDED

### 1. **Existing Codebase** (85% Complete)
**Repository:** https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git

**What Already Exists (DO NOT DELETE OR REWRITE):**
```
✅ Multi-tenant architecture (businessId on all models) - EXCELLENT
✅ RBAC with 6 roles (business_owner, business_admin, business_staff, business_viewer, super_admin, support_admin)
✅ Tenant isolation middleware (perfect security)
✅ User, Business, Document, Conversation models (all with businessId)
✅ JWT authentication
✅ OpenAI integration (RAG system)
✅ Document upload & URL scraping
✅ Basic API endpoints (auth, documents, conversations, leads)
✅ Security middleware (helmet, rate limiting, XSS protection, etc.)
```

**Backend File Structure (Keep All):**
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js ✅ (MongoDB connection)
│   │   └── roles.js ✅ (6 roles with permissions)
│   ├── models/
│   │   ├── User.js ✅ (Multi-tenant + RBAC fields)
│   │   ├── Business.js ✅ (Complete schema)
│   │   ├── Document.js ✅ (businessId + search index)
│   │   ├── Conversation.js ✅ (businessId + participants)
│   │   ├── Lead.js ✅
│   │   └── ChatLog.js ✅
│   ├── middleware/
│   │   ├── auth.middleware.js ✅ (JWT verification)
│   │   ├── tenantIsolation.middleware.js ✅ (Perfect isolation)
│   │   ├── permission.middleware.js ✅ (RBAC enforcement)
│   │   ├── rateLimiter.middleware.js ✅
│   │   └── upload.middleware.js ✅
│   ├── controllers/
│   │   ├── auth.controller.js ✅
│   │   ├── business.controller.js ✅
│   │   ├── document.controller.js ✅
│   │   ├── chat.controller.js ✅
│   │   └── lead.controller.js ✅
│   ├── routes/
│   │   ├── auth.routes.js ✅
│   │   ├── business/index.js ✅ (Namespace)
│   │   ├── admin/index.js ✅ (Namespace)
│   │   └── [other routes] ✅
│   ├── services/
│   │   ├── openai.service.js ✅ (AI chat)
│   │   └── urlScraper.service.js ✅ (Web scraping)
│   └── server.js ✅ (Main entry point)
└── package.json ✅
```

### 2. **Figma Design** (pam_final_layout.fig)
Complete UI/UX designs for all pages.

### 3. **Stitch Export** (stitch_pam_ai.zip)
HTML/CSS exports of all pages:
- Landing page (Desktop + Mobile)
- Business Dashboard
- Dashboard Overview
- Inbox (Active Chat)
- Tickets Board
- Leads Management
- Online Visitors
- Knowledge Base
- Team Management
- Detailed Analytics
- Settings (Widget Customization)
- Super Admin Dashboard

### 4. **Implementation Guides**
- AI_PROMPT_UI_DESIGN.md (Design system specs)
- AI_PROMPT_IMPLEMENTATION.md (Technical implementation)
- CODE_REVIEW_AND_STATUS.md (Current status)

---

## 🎯 YOUR TASK

**You need to ADD the following features to the existing codebase:**

### BACKEND (Node.js + Express)

#### 1. **Google OAuth & Email OTP** ⭐ Priority 1
```javascript
Required:
- POST /api/auth/google (Google OAuth login/signup)
- POST /api/auth/request-otp (Send OTP to email)
- POST /api/auth/verify-otp (Verify OTP code)
- POST /api/auth/verify-email (Email verification)

Dependencies to add:
- google-auth-library
- nodemailer or @sendgrid/mail

Update User model:
- googleId: String
- emailVerificationToken: String
- emailVerificationExpires: Date
- emailVerified: Boolean
- otpSecret: String
```

#### 2. **Ticketing System** ⭐ Priority 1
```javascript
Required:
- Add ticketing fields to Conversation model:
  - isTicket: Boolean
  - ticketNumber: String (auto-generate: TICKET-000001)
  - status: enum ['open', 'pending', 'in_progress', 'resolved', 'closed']
  - priority: enum ['low', 'medium', 'high', 'urgent']
  - assignedTo: ObjectId
  - tags: [String]
  - dueDate: Date
  - resolvedAt: Date
  - customerEmail, customerName, customerPhone

New endpoints:
- POST /api/business/v1/tickets (Create ticket)
- GET /api/business/v1/tickets (List tickets with filters)
- PATCH /api/business/v1/tickets/:id/assign (Assign to team member)
- PATCH /api/business/v1/tickets/:id/status (Update status)
- GET /api/business/v1/tickets/stats (Ticket statistics)

Create: backend/src/controllers/ticket.controller.js
Create: backend/src/routes/ticket.routes.js
```

#### 3. **Real-time Visitor Tracking** ⭐ Priority 2
```javascript
Required:
- WebSocket server using Socket.io
- Real-time visitor presence tracking
- Page view tracking
- Visitor journey tracking

New model: backend/src/models/Visitor.js
{
  businessId: ObjectId,
  sessionId: String,
  ipAddress: String,
  location: { country, city },
  isOnline: Boolean,
  currentPage: String,
  visitHistory: [{ page, timestamp, timeSpent }],
  totalPageViews: Number,
  totalTimeOnSite: Number,
  hasStartedChat: Boolean,
  conversationId: ObjectId
}

WebSocket namespaces:
- /visitor-tracking (public visitors)
- /admin (business dashboard)

Create: backend/src/sockets/visitor.socket.js
Update: backend/src/server.js (add Socket.io)

Dependencies to add:
- socket.io
```

#### 4. **Stripe Payment Integration** ⭐ Priority 2
```javascript
Required:
- Subscription checkout
- Customer portal
- Webhook handling
- Plan management

New endpoints:
- POST /api/business/v1/subscription/checkout (Create checkout session)
- POST /api/business/v1/subscription/portal (Customer portal)
- GET /api/business/v1/subscription (Get subscription info)
- POST /api/business/v1/subscription/cancel (Cancel subscription)
- POST /webhooks/stripe (Stripe webhook handler)

Update Business model:
subscription: {
  plan: String,
  status: String,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  features: {
    maxDocuments: Number,
    maxTeamMembers: Number,
    maxConversations: Number,
    customWidget: Boolean,
    advancedAnalytics: Boolean
  }
}

Create: backend/src/controllers/subscription.controller.js
Create: backend/src/controllers/webhook.controller.js
Create: backend/src/routes/subscription.routes.js

Dependencies to add:
- stripe
```

#### 5. **Email Service** ⭐ Priority 2
```javascript
Required:
- Email notifications for all events
- Team invitations
- Lead notifications
- Ticket assignments
- Welcome emails
- Password reset

Create: backend/src/services/email.service.js

Methods:
- sendVerificationEmail(email, otp)
- sendTeamInvitation(email, inviterName, businessName, inviteLink)
- sendLeadNotification(business, lead)
- sendTicketAssigned(user, ticket)
- sendWelcomeEmail(user, business)
- sendPasswordReset(email, resetLink)

Dependencies to add:
- nodemailer
- @sendgrid/mail (optional, better deliverability)
```

#### 6. **Additional API Endpoints**
```javascript
Missing endpoints to add:

Dashboard:
- GET /api/business/v1/dashboard/stats (Overview metrics)

Visitors:
- GET /api/business/v1/visitors/online (Real-time online visitors)
- GET /api/business/v1/visitors/history (Visitor history)
- GET /api/business/v1/visitors/stats (Visitor statistics)

Analytics:
- GET /api/business/v1/analytics/overview (Key metrics)
- GET /api/business/v1/analytics/conversations (Conversation analytics)
- GET /api/business/v1/analytics/leads (Lead analytics)
- GET /api/business/v1/analytics/export (Export data as CSV)

Settings:
- GET /api/business/v1/settings (Get business settings)
- PATCH /api/business/v1/settings/widget (Update widget customization)
- PATCH /api/business/v1/settings/branding (Update branding)

Super Admin:
- GET /api/admin/v1/businesses (List all businesses)
- GET /api/admin/v1/businesses/:id (Business details)
- PATCH /api/admin/v1/businesses/:id (Update business)
- POST /api/admin/v1/businesses/:id/activate (Activate business)
- POST /api/admin/v1/businesses/:id/deactivate (Deactivate business)
- GET /api/admin/v1/analytics/revenue (Revenue analytics)
- GET /api/admin/v1/analytics/growth (Growth metrics)
```

---

### FRONTEND (Next.js 14 + TypeScript)

#### **Tech Stack to Use:**
```typescript
Core:
- Next.js 14 (App Router)
- TypeScript
- React 19
- Tailwind CSS

UI Components:
- shadcn/ui (use heavily)
- Radix UI primitives
- Lucide React (icons)

Data Fetching:
- TanStack Query (React Query)
- Axios

State Management:
- Zustand (lightweight, simple)

Forms:
- React Hook Form
- Zod (validation)

Charts:
- Recharts

Real-time:
- Socket.io-client

Payments:
- @stripe/stripe-js
- @stripe/react-stripe-js
```

#### **Project Structure:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx (Landing page)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx (Dashboard layout with sidebar)
│   │   │   ├── dashboard/page.tsx (Overview)
│   │   │   ├── inbox/page.tsx (Conversations)
│   │   │   ├── tickets/page.tsx (Ticket board)
│   │   │   ├── leads/page.tsx (Leads management)
│   │   │   ├── visitors/page.tsx (Online visitors)
│   │   │   ├── documents/page.tsx (Knowledge base)
│   │   │   ├── team/page.tsx (Team management)
│   │   │   ├── analytics/page.tsx (Analytics)
│   │   │   └── settings/
│   │   │       ├── page.tsx (Settings tabs)
│   │   │       ├── business/page.tsx
│   │   │       ├── widget/page.tsx
│   │   │       └── billing/page.tsx
│   │   └── (admin)/
│   │       └── admin/
│   │           ├── layout.tsx
│   │           ├── dashboard/page.tsx
│   │           ├── businesses/page.tsx
│   │           └── analytics/page.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── ...
│   │   ├── inbox/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ChatThread.tsx
│   │   │   └── CustomerDetails.tsx
│   │   ├── tickets/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   └── ...
│   │   └── chat-widget/
│   │       ├── ChatWidget.tsx (Embeddable)
│   │       └── WidgetButton.tsx
│   ├── lib/
│   │   ├── api.ts (Axios instance + interceptors)
│   │   ├── socket.ts (Socket.io client)
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── business.service.ts
│   │   ├── conversation.service.ts
│   │   └── ...
│   └── types/
│       └── index.ts (TypeScript interfaces)
├── public/
│   ├── widget.js (Chat widget embed script)
│   └── ...
├── tailwind.config.ts
├── next.config.js
└── package.json
```

#### **Pages to Build:**

##### 1. **Landing Page** (/)
```typescript
- Hero section with CTA
- Features section (3 columns)
- How it works (3 steps)
- Pricing table (3-4 plans)
- Testimonials
- FAQ
- Footer

Use the HTML from: stitch_pam_ai/pamilo_ai_landing_page/code.html
Convert to React components with Tailwind CSS
```

##### 2. **Login** (/login)
```typescript
- Email/password form
- Google OAuth button
- "Remember me" checkbox
- "Forgot password" link
- Link to register

Features:
- Form validation (Zod)
- Loading states
- Error handling
- Redirect to /dashboard after login
```

##### 3. **Register** (/register)
```typescript
- First name, Last name
- Work email
- Password (with strength meter)
- Business name
- Google OAuth button
- Terms & Privacy checkbox

Features:
- Email verification flow
- Auto-create business on signup
- Set user as business_owner
```

##### 4. **Dashboard Home** (/dashboard)
```typescript
Layout from: stitch_pam_ai/dashboard_overview/code.html

Components:
- 4 stat cards (Conversations, Leads, Tickets, Visitors)
- 2 charts (Volume trend, Status distribution)
- Recent conversations table
- Top performers table

Data:
- Fetch from: GET /api/business/v1/dashboard/stats
- Real-time updates via WebSocket
```

##### 5. **Inbox** (/dashboard/inbox)
```typescript
Layout from: stitch_pam_ai/inbox_-_active_chat/code.html

3-column layout:
- Left: Conversation list (filters, search)
- Middle: Chat thread
- Right: Customer details & actions

Features:
- Real-time message updates (Socket.io)
- Send messages
- Assign conversations
- Convert to ticket
- Capture lead info
- Filter by status, assigned user, tags
```

##### 6. **Tickets** (/dashboard/tickets)
```typescript
Layout from: stitch_pam_ai/tickets_board/code.html

Kanban board:
- Columns: Open, Pending, In Progress, Resolved, Closed
- Drag & drop (react-beautiful-dnd or dnd-kit)
- Ticket cards with priority badges
- Assign to team members
- Due date indicators

Features:
- Create ticket from modal
- Update status by dragging
- Filter by priority, assigned, tags
- Quick actions menu
```

##### 7. **Leads** (/dashboard/leads)
```typescript
Layout from: stitch_pam_ai/leads_management/code.html

Data table:
- Columns: Name, Email, Phone, Status, Source, Date
- Sortable columns
- Filters (status, source, date range)
- Search
- Bulk actions
- Export to CSV

Features:
- Status badges (New, Contacted, Won, Lost)
- Click row to view details
- Update lead status
```

##### 8. **Online Visitors** (/dashboard/visitors)
```typescript
Layout from: stitch_pam_ai/online_visitors/code.html

Grid of visitor cards:
- Visitor ID
- Location (country, city)
- Current page
- Time on site
- Pages viewed
- Visitor journey
- "Start Chat" button

Features:
- Real-time updates (Socket.io)
- Filter by country, page
- Click visitor to see full journey
- Initiate proactive chat
```

##### 9. **Documents** (/dashboard/documents)
```typescript
Layout from: stitch_pam_ai/knowledge_base/code.html

Features:
- Upload file (PDF, DOCX, TXT)
- Add URL (with auto-refresh option)
- Add text manually
- Document table with status
- Delete documents
- Processing indicators

Status badges:
- ✅ Indexed
- ⏳ Processing
- ❌ Failed
```

##### 10. **Team** (/dashboard/team)
```typescript
Layout from: stitch_pam_ai/team_management/code.html

Sections:
- Active members table
- Pending invitations
- Role permissions matrix
- Invite member form

Features:
- Invite via email
- Assign roles (owner, admin, staff, viewer)
- Remove team members
- Resend invitations
- Show online status
```

##### 11. **Analytics** (/dashboard/analytics)
```typescript
Layout from: stitch_pam_ai/detailed_analytics/code.html

Charts:
- Volume trend (line chart)
- Peak hours (heatmap)
- Source distribution (donut chart)
- Top questions (bar chart)

Tables:
- Team performance
- Conversation metrics

Features:
- Date range selector
- Export data
- Drill-down details
```

##### 12. **Settings - Widget** (/dashboard/settings/widget)
```typescript
Layout from: stitch_pam_ai/settings_-_widget_customization/code.html

Split view:
- Left: Customization form
  - Primary color picker
  - Widget position (radio buttons)
  - Avatar upload
  - Welcome message
  - Language selector
  - Auto-open delay

- Right: Live preview
  - Shows widget with applied customization
  - Interactive preview

Features:
- Save changes
- Copy embed code
- Reset to defaults
```

##### 13. **Super Admin Dashboard** (/admin/dashboard)
```typescript
Layout from: stitch_pam_ai/super_admin_dashboard/code.html

Features:
- System stats (Total businesses, MRR, Active users, Growth)
- Revenue chart (MRR over time)
- Recent businesses table
- Alerts (trials ending, payment failures)
- Quick actions (view business, deactivate)

Access:
- Only for users with role='super_admin'
- Guard with middleware
```

---

## 🔧 TECHNICAL REQUIREMENTS

### **1. API Service Layer**
```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **2. Authentication Flow**
```typescript
// frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch current user
      // ...
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };
  
  // ... more methods
  
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

### **3. Real-time Socket Connection**
```typescript
// frontend/src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  
  connect(businessId: string) {
    this.socket = io('http://localhost:3000/visitor-tracking', {
      auth: {
        businessId
      }
    });
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
  on(event: string, callback: Function) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
```

### **4. Type Definitions**
```typescript
// frontend/src/types/index.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessId: string;
  role: 'business_owner' | 'business_admin' | 'business_staff' | 'business_viewer' | 'super_admin';
  emailVerified: boolean;
}

export interface Business {
  id: string;
  businessName: string;
  businessSlug: string;
  industry?: string;
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due';
  };
  widget: {
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    welcomeMessage: string;
    enabled: boolean;
  };
}

export interface Conversation {
  id: string;
  businessId: string;
  title: string;
  messages: Message[];
  isTicket: boolean;
  ticketNumber?: string;
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  customerEmail?: string;
  customerName?: string;
  createdAt: string;
  lastMessageAt: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
  source: 'chat' | 'widget' | 'form' | 'email';
  createdAt: string;
}

export interface Visitor {
  id: string;
  businessId: string;
  sessionId: string;
  isOnline: boolean;
  currentPage: string;
  location: {
    country: string;
    city: string;
  };
  totalPageViews: number;
  totalTimeOnSite: number;
  visitHistory: Array<{
    page: string;
    timestamp: string;
    timeSpent: number;
  }>;
}

// ... more types
```

---

## 🎨 DESIGN SYSTEM (Use These Exactly)

### **Colors**
```css
--primary-50: #EFF6FF
--primary-500: #44A194
--primary-600: #44A194
--primary-700: #44A194

--success-500: #10B981
--warning-500: #F59E0B
--error-500: #EF4444

--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-900: #111827
```

### **Typography**
```css
Font: Inter (from Google Fonts)

font-size:
- text-xs: 12px
- text-sm: 14px
- text-base: 16px
- text-lg: 18px
- text-xl: 20px
- text-2xl: 24px
- text-3xl: 30px
- text-4xl: 36px

font-weight:
- font-normal: 400
- font-medium: 500
- font-semibold: 600
- font-bold: 700
```

### **Spacing**
Use Tailwind's default spacing scale (4px base)

### **Components**
Use shadcn/ui components:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tabs
```

---

## ⚙️ ENVIRONMENT VARIABLES

### **Backend (.env)**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pamiloai

# Auth
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Google OAuth
GOOGLE_CLIENT_ID=your-app-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-...

# Email
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@pamiloai.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URLs
FRONTEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001

# Server
PORT=3000
NODE_ENV=development
```

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-app-id.apps.googleusercontent.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📝 CODING STANDARDS

### **1. TypeScript**
- Use TypeScript for all frontend code
- Define interfaces for all data structures
- Use strict mode
- No `any` types (use `unknown` if needed)

### **2. Component Structure**
```typescript
// Good component structure
'use client'; // Only if using hooks

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onSubmit: (data: any) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [state, setState] = useState('');
  
  return (
    <div>
      <h1>{title}</h1>
      {/* ... */}
    </div>
  );
}
```

### **3. API Calls**
```typescript
// Use React Query for data fetching
import { useQuery, useMutation } from '@tanstack/react-query';

export function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/business/v1/conversations')
  });
  
  const mutation = useMutation({
    mutationFn: (data) => api.post('/business/v1/tickets', data),
    onSuccess: () => {
      // Refetch or update cache
    }
  });
  
  return (
    // ...
  );
}
```

### **4. Error Handling**
- Always wrap API calls in try-catch
- Show user-friendly error messages
- Log errors to console
- Use toast notifications for feedback

### **5. Loading States**
- Show skeleton loaders for content
- Show spinners for buttons
- Disable buttons during loading
- Show progress bars for uploads

---

## ✅ TESTING CHECKLIST

### **Backend Tests**
- [ ] Google OAuth works (login/signup)
- [ ] Email OTP works
- [ ] Tickets can be created, assigned, updated
- [ ] WebSocket tracks visitors in real-time
- [ ] Stripe checkout creates session
- [ ] Stripe webhooks update subscription status
- [ ] Emails are sent for all events
- [ ] All API endpoints return correct data
- [ ] Tenant isolation is enforced (no cross-business data access)
- [ ] RBAC permissions work correctly

### **Frontend Tests**
- [ ] All pages render correctly
- [ ] Login/register flow works
- [ ] Dashboard loads real data
- [ ] Inbox shows conversations and allows replies
- [ ] Tickets can be created and moved on kanban
- [ ] Leads table displays and filters work
- [ ] Visitors page shows real-time data
- [ ] Documents can be uploaded
- [ ] Team members can be invited
- [ ] Settings save correctly
- [ ] Widget customization works
- [ ] Real-time updates via WebSocket work
- [ ] Mobile responsive

---

## 🚀 DEPLOYMENT PREPARATION

### **1. Build Commands**
```bash
# Backend
cd backend
npm install
npm run build (if applicable)
npm start

# Frontend
cd frontend
npm install
npm run build
npm start
```

### **2. Production Checklist**
- [ ] Environment variables set
- [ ] MongoDB indexes created
- [ ] Stripe webhooks configured
- [ ] SSL certificates ready
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Cloudflare DNS configured
- [ ] Error tracking (Sentry) configured
- [ ] Backups automated

---

## 🎯 PRIORITY ORDER

**Phase 1 (Weeks 1-2): Core Backend Features**
1. Google OAuth + Email OTP
2. Ticketing system
3. Email service
4. Additional API endpoints

**Phase 2 (Weeks 3-4): Real-time & Payments**
1. WebSocket visitor tracking
2. Stripe integration
3. Webhook handling

**Phase 3 (Weeks 5-7): Complete Frontend**
1. Landing page + Auth pages
2. Dashboard + Inbox + Tickets
3. Leads + Visitors + Documents
4. Team + Analytics + Settings
5. Super Admin Dashboard

**Phase 4 (Week 8): Testing & Polish**
1. Integration testing
2. Bug fixes
3. Performance optimization
4. Documentation

---

## 📞 SUCCESS CRITERIA

**Your implementation is complete when:**

✅ A business owner can:
- Sign up with Google or email
- Upload documents to train AI
- Embed chat widget on their website
- See real-time visitors on their site
- View and respond to conversations
- Create and assign tickets to team
- Invite team members with roles
- Capture leads automatically
- Customize widget appearance
- Subscribe via Stripe
- View analytics and reports

✅ Team members can:
- Log in and see assigned conversations
- Reply to customer messages
- Update ticket status
- View leads (based on permissions)

✅ Super admin can:
- View all businesses
- Activate/deactivate businesses
- See system-wide analytics
- Manage subscriptions

✅ Technical requirements:
- Multi-tenant isolation works (no data leaks)
- Real-time updates via WebSocket
- Stripe payments work end-to-end
- All API endpoints functional
- Frontend responsive and polished
- Production-ready security

---

## 🎨 REFERENCE FILES

**Use these as reference:**
- Figma: `pam_final_layout.fig` (Design source)
- Stitch HTML: `stitch_pam_ai/` (HTML/CSS exports)
- Backend repo: https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
- Design guide: `AI_PROMPT_UI_DESIGN.md`
- Implementation guide: `AI_PROMPT_IMPLEMENTATION.md`

---

## 💡 IMPORTANT NOTES

1. **DO NOT DELETE existing code** - Only add to it
2. **Keep multi-tenant architecture** - It's excellent and production-ready
3. **Use Stitch exports** - Convert HTML to React components
4. **Follow design system** - Use exact colors, spacing, typography
5. **Use shadcn/ui** - Don't build components from scratch
6. **TypeScript everywhere** - Maintain type safety
7. **Test tenant isolation** - Critical for security
8. **Real-time is important** - WebSocket should work smoothly
9. **Mobile responsive** - All pages must work on mobile
10. **Production-ready** - Write code like it's going live tomorrow

---

## 🚀 START BUILDING!

You have everything you need:
- ✅ Existing codebase (85% done)
- ✅ Complete designs (Figma + Stitch)
- ✅ Technical specifications
- ✅ Type definitions
- ✅ Code examples

**Build a production-ready, scalable, multi-tenant SaaS platform that will compete with Tidio and Intercom!**

Good luck! 🎉
