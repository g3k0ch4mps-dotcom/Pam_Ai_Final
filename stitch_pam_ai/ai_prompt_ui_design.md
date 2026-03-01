# 🎨 AI PROMPT: COMPLETE UI/UX DESIGN FOR PAMILO AI

**Copy this entire prompt and paste it into v0.dev, Claude with artifacts, or any AI design tool**

---

# PAMILO AI - Complete UI/UX Design System & Mockups

## 📋 PROJECT BRIEF

Design a modern, professional SaaS platform for Pamilo AI - an AI-powered customer support chatbot platform (similar to Intercom + Tidio). 

**Target Users:**
1. Business owners (manage their AI chatbot)
2. Team members (handle customer conversations)
3. Super admins (manage the entire platform)
4. End customers (use the chat widget)

**Design Style:** Clean, modern, professional, trustworthy (think Linear, Vercel, Stripe aesthetics)

---

## 🎨 DESIGN SYSTEM

### Color Palette

```css
/* Primary Colors */
--primary-500: #3B82F6;      /* Main brand blue */
--primary-600: #2563EB;      /* Hover states */
--primary-700: #1D4ED8;      /* Active states */
--primary-50: #EFF6FF;       /* Light backgrounds */

/* Secondary Colors */
--success-500: #10B981;      /* Success, online */
--warning-500: #F59E0B;      /* Warning, pending */
--error-500: #EF4444;        /* Error, urgent */
--info-500: #06B6D4;         /* Info messages */

/* Neutral Palette */
--gray-950: #030712;         /* Darkest text */
--gray-900: #111827;         /* Primary text */
--gray-700: #374151;         /* Secondary text */
--gray-500: #6B7280;         /* Tertiary text */
--gray-400: #9CA3AF;         /* Placeholder */
--gray-300: #D1D5DB;         /* Borders */
--gray-200: #E5E7EB;         /* Dividers */
--gray-100: #F3F4F6;         /* Hover backgrounds */
--gray-50: #F9FAFB;          /* Page backgrounds */
--white: #FFFFFF;            /* Cards, surfaces */
```

### Typography

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Type Scale */
--text-xs: 12px;     /* line-height: 16px */
--text-sm: 14px;     /* line-height: 20px */
--text-base: 16px;   /* line-height: 24px */
--text-lg: 18px;     /* line-height: 28px */
--text-xl: 20px;     /* line-height: 28px */
--text-2xl: 24px;    /* line-height: 32px */
--text-3xl: 30px;    /* line-height: 36px */
--text-4xl: 36px;    /* line-height: 40px */
--text-5xl: 48px;    /* line-height: 1 */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 🧩 COMPONENT LIBRARY

Design these reusable components:

### 1. Buttons

**Primary Button:**
- Background: primary-500
- Text: white
- Padding: 12px 24px
- Border-radius: radius-md
- Font: font-medium, text-base
- Hover: primary-600
- Active: primary-700
- Disabled: gray-300

**Secondary Button:**
- Background: white
- Text: gray-900
- Border: 1px solid gray-300
- Same padding/radius as primary
- Hover: gray-50

**Danger Button:**
- Background: error-500
- Text: white
- Same styling as primary

**Ghost Button:**
- Background: transparent
- Text: primary-500
- No border
- Hover: primary-50

**Sizes:** sm (10px 16px), md (12px 24px), lg (14px 28px)

### 2. Input Fields

**Text Input:**
- Background: white
- Border: 1px solid gray-300
- Border-radius: radius-md
- Padding: 12px 16px
- Font: text-base
- Focus: border primary-500, ring primary-100
- Error: border error-500
- Disabled: background gray-50

**With Icon:**
- Left icon: 40px left padding
- Right icon: 40px right padding

**Types:** text, email, password, search, textarea, select, multi-select, date picker, file upload

### 3. Cards

**Default Card:**
- Background: white
- Border: 1px solid gray-200
- Border-radius: radius-lg
- Padding: 24px
- Shadow: shadow-sm
- Hover: shadow-md, scale 1.02

**Stat Card:**
- Icon in top-left (48px circle, primary-50 background)
- Large number (text-3xl, font-bold)
- Label (text-sm, gray-600)
- Trend indicator (▲ +12% in green or ▼ -5% in red)

### 4. Navigation

**Sidebar (Collapsible):**
- Width: 256px expanded, 64px collapsed
- Background: white
- Border-right: 1px solid gray-200
- Logo at top
- Navigation items with icons
- Active item: primary-50 background, primary-600 text
- Collapse button at bottom

**Top Bar:**
- Height: 64px
- Background: white
- Border-bottom: 1px solid gray-200
- Search bar in center
- Notification bell (with badge)
- Profile dropdown on right

### 5. Tables

**Data Table:**
- Header: gray-50 background, font-semibold
- Rows: white background, border-bottom gray-200
- Hover: gray-50 background
- Sortable columns (with arrow icons)
- Row actions (3-dot menu)
- Pagination at bottom
- Empty state with illustration

### 6. Status Badges

**Badge Styles:**
- Success: green-100 bg, green-700 text
- Warning: amber-100 bg, amber-700 text
- Error: red-100 bg, red-700 text
- Info: blue-100 bg, blue-700 text
- Neutral: gray-100 bg, gray-700 text
- Size: text-xs, padding 4px 8px, radius-full

### 7. Modals

**Modal Overlay:**
- Background: black with 50% opacity
- Blur effect

**Modal Container:**
- Background: white
- Border-radius: radius-xl
- Shadow: shadow-xl
- Max-width: 500px (sm), 700px (md), 900px (lg)
- Padding: 32px
- Close button (X) in top-right

### 8. Avatars

**Sizes:** xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
- Border-radius: radius-full
- Online indicator (green dot) in bottom-right
- Fallback: initials on colored background

### 9. Charts

Use modern, clean chart designs:
- Line charts (trends over time)
- Bar charts (comparisons)
- Donut charts (distributions)
- Area charts (volume)
- Clean grid lines, subtle colors

---

## 📱 PAGE DESIGNS

### A. PUBLIC WEBSITE

#### 1. LANDING PAGE (/)

**Hero Section:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  [Logo Pamilo AI]    Features  Pricing  About  [Login] [Try Free] │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│    ┌───────────────────────────┐  ┌─────────────────────────┐│
│    │                           │  │                         ││
│    │  AI-Powered Customer      │  │   [Animated             ││
│    │  Support That Never       │  │    illustration of      ││
│    │  Sleeps                   │  │    chat widget in       ││
│    │                           │  │    action - show        ││
│    │  Turn website visitors    │  │    multiple chat        ││
│    │  into customers with AI   │  │    bubbles, AI          ││
│    │  that understands your    │  │    responding,          ││
│    │  business                 │  │    customer happy]      ││
│    │                           │  │                         ││
│    │  [Start Free Trial →]     │  │                         ││
│    │  [Watch 2-min Demo]       │  │                         ││
│    │                           │  │                         ││
│    │  ✓ No credit card needed  │  │                         ││
│    │  ✓ Setup in 5 minutes     │  │                         ││
│    │  ✓ 14-day free trial      │  │                         ││
│    │                           │  │                         ││
│    └───────────────────────────┘  └─────────────────────────┘│
│                                                                │
│    Trusted by 1,000+ businesses                                │
│    [Logo] [Logo] [Logo] [Logo] [Logo]                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Features Section** (3-column grid):
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│              Why Businesses Love Pamilo AI                     │
│         Everything you need to automate support                │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ [Icon: 🤖]  │  │ [Icon: 💬]  │  │ [Icon: 📊]  │          │
│  │             │  │             │  │             │          │
│  │ AI-Powered  │  │ 24/7        │  │ Lead        │          │
│  │ Responses   │  │ Support     │  │ Capture     │          │
│  │             │  │             │  │             │          │
│  │ Trains on   │  │ Never miss  │  │ Capture     │          │
│  │ your docs   │  │ a customer  │  │ contact info│          │
│  │ & website   │  │ query       │  │ automatically│          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ [Icon: 👥]  │  │ [Icon: 🎨]  │  │ [Icon: 📈]  │          │
│  │             │  │             │  │             │          │
│  │ Team        │  │ Customizable│  │ Analytics   │          │
│  │ Collaboration│  │ Widget      │  │ Dashboard   │          │
│  │             │  │             │  │             │          │
│  │ Assign &    │  │ Match your  │  │ Track every │          │
│  │ manage      │  │ brand colors│  │ interaction │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**How It Works** (3 steps with visuals):
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                   Get Started in 3 Steps                       │
│                                                                │
│  1️⃣ ──────────→  2️⃣ ──────────→  3️⃣                          │
│                                                                │
│  Upload Docs      Train AI         Go Live                    │
│  & Website        in Minutes       & Support                  │
│                                                                │
│  [Screenshot]     [Screenshot]     [Screenshot]                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Pricing Section:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                Simple, Transparent Pricing                     │
│              [Monthly] [Yearly - Save 20%]                    │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Starter   │  │ Professional│  │ Enterprise  │          │
│  │             │  │             │  │             │          │
│  │   $19/mo    │  │   $49/mo    │  │   $199/mo   │          │
│  │             │  │    POPULAR  │  │             │          │
│  │ ✓ 1,000 msgs│  │ ✓ 10k msgs  │  │ ✓ Unlimited │          │
│  │ ✓ 5 docs    │  │ ✓ 50 docs   │  │ ✓ Unlimited │          │
│  │ ✓ 2 members │  │ ✓ 10 members│  │ ✓ Unlimited │          │
│  │ ✓ Email     │  │ ✓ Priority  │  │ ✓ Dedicated │          │
│  │   support   │  │   support   │  │   support   │          │
│  │             │  │ ✓ Analytics │  │ ✓ Custom    │          │
│  │             │  │ ✓ Custom    │  │   AI model  │          │
│  │             │  │   widget    │  │ ✓ SSO       │          │
│  │             │  │             │  │             │          │
│  │ [Start Free]│  │ [Start Free]│  │[Contact Us] │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Testimonials:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│              Loved by Support Teams Everywhere                 │
│                                                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌────────────┐│
│  │ ⭐⭐⭐⭐⭐         │  │ ⭐⭐⭐⭐⭐         │  │ ⭐⭐⭐⭐⭐  ││
│  │                   │  │                   │  │            ││
│  │ "Reduced response │  │ "Easy to set up   │  │ "Our       ││
│  │  time by 80%"     │  │  and customers    │  │  customers ││
│  │                   │  │  love it"         │  │  are happy"││
│  │ - Sarah, CEO      │  │ - Mike, Support   │  │ - Emma     ││
│  │   Acme Corp       │  │   Tech Inc        │  │   Shop LLC ││
│  └───────────────────┘  └───────────────────┘  └────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**CTA Section:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│            Ready to Transform Your Support?                    │
│         Start your free trial today - no credit card needed    │
│                                                                │
│                    [Start Free Trial →]                        │
│                                                                │
│              14-day trial • Cancel anytime                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Footer:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  [Logo]                                                        │
│  AI-powered customer support                                   │
│                                                                │
│  Product          Company         Resources      Legal         │
│  Features         About           Blog           Privacy       │
│  Pricing          Careers         Docs           Terms         │
│  Integration      Contact         Help           Security      │
│                                                                │
│  © 2026 Pamilo AI. All rights reserved.                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### 2. LOGIN PAGE (/login)

```
┌─────────────────────────────────────────────────────────────┐
│                         [Logo]                              │
│                                                             │
│                   Welcome Back                              │
│              Sign in to your account                        │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │  [Google Icon]  Continue with Google         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  ──────────────── OR ────────────────              │   │
│  │                                                    │   │
│  │  Email address                                     │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ name@company.com                             │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  Password                                          │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ ••••••••••••                          [👁]   │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  ☐ Remember me        [Forgot password?]          │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │          Sign in                             │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  Don't have an account? [Create account]          │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3. REGISTER PAGE (/register)

```
┌─────────────────────────────────────────────────────────────┐
│                         [Logo]                              │
│                                                             │
│              Start Your Free 14-Day Trial                   │
│              No credit card required                        │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │  [Google Icon]  Continue with Google         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  ──────────────── OR ────────────────              │   │
│  │                                                    │   │
│  │  First name              Last name                 │   │
│  │  ┌──────────────┐       ┌──────────────┐          │   │
│  │  │ John         │       │ Doe          │          │   │
│  │  └──────────────┘       └──────────────┘          │   │
│  │                                                    │   │
│  │  Work email                                        │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ you@company.com                              │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  Password                                          │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ ••••••••••••                          [👁]   │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  Must be at least 8 characters                    │   │
│  │                                                    │   │
│  │  Business name                                     │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ Acme Corp                                    │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  ☐ I agree to the Terms of Service and Privacy   │   │
│  │     Policy                                         │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │          Create account                      │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  Already have an account? [Sign in]               │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### B. BUSINESS DASHBOARD

#### OVERALL LAYOUT:

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] Business Dashboard      [Search...]  [🔔 2] [Profile ▼]  │
├──────┬───────────────────────────────────────────────────────────┤
│      │                                                           │
│ 📊   │                                                           │
│Dash  │                                                           │
│      │                                                           │
│ 💬   │          MAIN CONTENT AREA                               │
│Inbox │          (Changes per page)                              │
│      │                                                           │
│ 🎫   │                                                           │
│Tickets│                                                          │
│      │                                                           │
│ 👥   │                                                           │
│Leads │                                                           │
│      │                                                           │
│ 👁   │                                                           │
│Visit.│                                                           │
│      │                                                           │
│ 📄   │                                                           │
│Docs  │                                                           │
│      │                                                           │
│ 👥   │                                                           │
│Team  │                                                           │
│      │                                                           │
│ 📊   │                                                           │
│Stats │                                                           │
│      │                                                           │
│ ⚙    │                                                           │
│Set.  │                                                           │
│      │                                                           │
└──────┴───────────────────────────────────────────────────────────┘
```

#### 1. DASHBOARD HOME

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard Overview                       Last 30 Days ▼  [📥]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  QUICK STATS (4 cards in row)                                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ 💬 Total     │ 👥 Leads     │ 🎫 Tickets   │ 👁 Visitors  │ │
│  │ Conversations│ Captured     │ Open         │ Today        │ │
│  │              │              │              │              │ │
│  │    1,234     │     345      │      89      │    2,567     │ │
│  │   +12% ▲     │   +23% ▲     │    -5% ▼     │   +45% ▲     │ │
│  │   vs last    │   vs last    │   vs last    │   vs last    │ │
│  │   period     │   period     │   period     │   period     │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  CHARTS (2 columns)                                              │
│  ┌────────────────────────────────┬──────────────────────────┐ │
│  │ 📈 Conversation Volume         │ 🍩 Status Distribution   │ │
│  │                                │                          │ │
│  │  [Line chart showing daily     │  [Donut chart showing]   │ │
│  │   conversation volume with     │  - Open: 45%             │ │
│  │   trend line]                  │  - Pending: 30%          │ │
│  │                                │  - Resolved: 25%         │ │
│  │   Peak: 156 on Dec 15         │                          │ │
│  └────────────────────────────────┴──────────────────────────┘ │
│                                                                  │
│  RECENT ACTIVITY (2 columns)                                    │
│  ┌────────────────────────────────┬──────────────────────────┐ │
│  │ 🆕 Recent Conversations        │ 🏆 Top Performers        │ │
│  │                                │                          │ │
│  │  [List of last 5 convos]       │  [Team member rankings]  │ │
│  │                                │                          │ │
│  │  • Customer Name               │  1. Alice (45 resolved)  │ │
│  │    Status badge | Time         │     ⭐ 4.8 CSAT          │ │
│  │                                │                          │ │
│  │  [View All →]                  │  [View All →]            │ │
│  └────────────────────────────────┴──────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 2. INBOX (3-COLUMN LAYOUT)

```
┌──────────────────────────────────────────────────────────────────┐
│  Conversations                              [+ New Conversation]  │
├──────────────────────────────────────────────────────────────────┤
│  [Search...] [All ▼] [Assigned ▼] [Tags ▼]                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ COLUMN 1: LIST │ COLUMN 2: THREAD  │ COLUMN 3: DETAILS         │
│ (25%)          │ (50%)             │ (25%)                      │
│                │                   │                            │
│ FILTERS:       │ John Doe          │ 👤 CUSTOMER                │
│ ○ All (245)    │ ───────────────   │ Name: John Doe             │
│ ○ Open (89)    │                   │ Email: john@email.com      │
│ ○ My (23)      │ Customer:         │ Phone: +1 555-0123         │
│                │ "Hi, I need help  │                            │
│ 🔴 John D.     │  with my order"   │ 🏷️ ACTIONS                 │
│   2m ago   ◀── │ 10:23 AM          │ ┌────────────────────────┐│
│   Support      │                   │ │ □ Capture Lead         ││
│                │ AI Bot:           │ │ □ Create Ticket        ││
│ 🟡 Sarah W.    │ "Hello! I'd be    │ │ □ Assign to Team       ││
│   15m ago      │  happy to help"   │ │ □ Mark Resolved        ││
│   Sales        │ 10:24 AM          │ └────────────────────────┘│
│                │                   │                            │
│ ⚪ Mike C.     │ Customer:         │ 🎯 STATUS                  │
│   1h ago       │ "Thanks! I need   │ Priority: [Medium ▼]       │
│   Billing      │  to know..."      │ Assigned: [Unassigned ▼]   │
│                │ 10:25 AM          │ Tags: [+ Add tag]          │
│ [Load more]    │                   │                            │
│                │ ───────────────   │ 📊 METRICS                 │
│                │ You (Bob):        │ Duration: 5m 23s           │
│                │ "I can help with  │ Messages: 6                │
│                │  that..."         │ Response time: 2m          │
│                │ 10:26 AM          │                            │
│                │                   │ 📎 FILES                   │
│                │ ───────────────   │ No files attached          │
│                │                   │                            │
│                │ [Type message...] │                            │
│                │              [→]  │                            │
│                │                   │                            │
└────────────────┴───────────────────┴────────────────────────────┘
```

#### 3. TICKETS (KANBAN BOARD)

```
┌──────────────────────────────────────────────────────────────────┐
│  Tickets                                   [+ Create Ticket]      │
├──────────────────────────────────────────────────────────────────┤
│  [Search...] [Priority ▼] [Assigned ▼] [Tags ▼]     [List View] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐       │
│ │ Open (24)│Pending(12)│ In      │Resolved │Closed(98)│       │
│ │          │          │Progress │  (45)   │          │       │
│ │          │          │  (18)   │         │          │       │
│ ├──────────┼──────────┼──────────┼──────────┼──────────┤       │
│ │          │          │          │         │          │       │
│ │ TICKET-1 │ TICKET-5 │ TICKET-8 │TICKET-12│TICKET-15 │       │
│ │ ────────│ ────────│ ────────│─────── │────────│       │
│ │ 🔴 Urgent│ 🟡 Medium│ 🟠 High  │✅ Done  │✓ Closed │       │
│ │          │          │          │         │          │       │
│ │ Customer │ Login    │ Payment  │ Email   │ Feature  │       │
│ │ can't... │ issues   │ failed   │ not...  │ request  │       │
│ │          │          │          │         │          │       │
│ │ 👤 Alice │ 👤 Bob   │ 👤 Carol │ 👤 Alice│ 👤 Bob   │       │
│ │ ⏰ 2h    │ ⏰ 1d    │ ⏰ 4h    │         │          │       │
│ │          │          │          │         │          │       │
│ │ TICKET-2 │ TICKET-6 │ TICKET-9 │TICKET-13│          │       │
│ │ ...      │ ...      │ ...      │ ...     │ ...      │       │
│ │          │          │          │         │          │       │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘       │
│                                                                  │
│ Drag & drop to change status                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 4. LEADS PAGE

```
┌──────────────────────────────────────────────────────────────────┐
│  Leads (345)                                    [Export CSV ▼]    │
├──────────────────────────────────────────────────────────────────┤
│  SUMMARY BAR                                                     │
│  Total: 345  |  🆕 New: 56  |  📞 Contacted: 120  |  ✅ Won: 89 │
├──────────────────────────────────────────────────────────────────┤
│  [Search...] [Status ▼] [Source ▼] [Date ▼]         [Card View] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TABLE                                                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │☐│Name      │Email        │Phone    │Status │Source│Date│⚙││
│  ├─────────────────────────────────────────────────────────────┤│
│  │☐│John Doe  │j@mail.com   │+1 555...│🆕 New │Chat  │2h │⚙││
│  │☐│Sarah W.  │s@mail.com   │+1 555...│📞 Cont│Widget│1d │⚙││
│  │☐│Mike C.   │m@mail.com   │+1 555...│✅ Won │Email │3d │⚙││
│  │☐│Emma S.   │e@mail.com   │+1 555...│❌ Lost│Chat  │5d │⚙││
│  │☐│Alex K.   │a@mail.com   │+1 555...│🆕 New │Form  │1w │⚙││
│  │☐│...       │...          │...      │...    │...   │..││⚙││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [← Previous]  Page 1 of 35  [Next →]                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 5. ONLINE VISITORS

```
┌──────────────────────────────────────────────────────────────────┐
│  Online Visitors                           🟢 12 visitors online  │
├──────────────────────────────────────────────────────────────────┤
│  [Search by page...] [Country ▼] [Time ▼]          [Grid] [List]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GRID VIEW (3 columns)                                           │
│  ┌──────────────────────┬──────────────────────┬────────────────┐│
│  │ 🌐 Visitor #8473     │ 🌐 Visitor #8474     │ 🌐 Visitor... ││
│  │ ──────────────────   │ ──────────────────   │ ────────────...││
│  │ 📍 New York, US      │ 📍 London, UK        │ 📍 Tokyo, JP   ││
│  │                      │                      │                ││
│  │ 📄 Currently:        │ 📄 Currently:        │ 📄 Currently:  ││
│  │    /pricing          │    /features         │    /about      ││
│  │                      │                      │                ││
│  │ ⏱ On site: 2m 34s   │ ⏱ On site: 5m 12s   │ ⏱ On site: 1m...││
│  │ 👁 Pages: 5          │ 👁 Pages: 3          │ 👁 Pages: 2    ││
│  │                      │                      │                ││
│  │ 📊 Journey:          │ 📊 Journey:          │ 📊 Journey:    ││
│  │ / → /features →      │ / → /about →         │ / → /about     ││
│  │ /pricing (now)       │ /features (now)      │ (now)          ││
│  │                      │                      │                ││
│  │ [💬 Start Chat]      │ [💬 Start Chat]      │ [💬 Start...]  ││
│  │ [👁 Watch]           │ [👁 Watch]           │ [👁 Watch]     ││
│  └──────────────────────┴──────────────────────┴────────────────┘│
│                                                                  │
│  [Load more visitors...]                                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 6. DOCUMENTS

```
┌──────────────────────────────────────────────────────────────────┐
│  Knowledge Base                             [+ Add Document ▼]    │
├──────────────────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                                   │
│  [📁 Upload File] [🌐 Add URL] [✍️ Add Text]                      │
├──────────────────────────────────────────────────────────────────┤
│  [Search...] [Type ▼] [Status ▼] [Date ▼]         [Grid] [List]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TABLE                                                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │☐│Icon│Name            │Type │Status  │Size  │Updated│⚙   ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │☐│📄 │FAQ Document    │PDF  │✅ Ready│2.3MB │2h ago │⚙   ││
│  │☐│🌐 │Website Content │URL  │⏳ Proc.│-     │5m ago │⚙   ││
│  │☐│📄 │Pricing Guide   │DOCX │✅ Ready│1.1MB │1d ago │⚙   ││
│  │☐│📄 │Product Manual  │PDF  │❌ Error│4.2MB │2d ago │⚙   ││
│  │☐│✍️ │Support KB      │Text │✅ Ready│-     │1w ago │⚙   ││
│  │☐│...│...             │...  │...     │...   │...    │...││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Status: ✅ Indexed  ⏳ Processing  ❌ Failed  ⏸ Paused          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 7. TEAM

```
┌──────────────────────────────────────────────────────────────────┐
│  Team Members (4/10)                        [+ Invite Member]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ACTIVE MEMBERS                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │Avatar│Name        │Email          │Role   │Status  │⚙      ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ JD  │John Doe    │john@acme.com  │Owner  │🟢 Online│       ││
│  │ JS  │Jane Smith  │jane@acme.com  │Admin  │🟢 Online│[Edit] ││
│  │ BJ  │Bob Jones   │bob@acme.com   │Staff  │🟡 Away  │[Edit] ││
│  │ AW  │Alice Wong  │alice@acme.com │Viewer │⚪ Offline│[Edit] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  PENDING INVITATIONS (2)                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Email              │ Role  │ Sent      │ Actions            ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ sarah@acme.com     │ Staff │ 2 days ago│ [Resend] [Cancel] ││
│  │ mike@acme.com      │ Admin │ 5 days ago│ [Resend] [Cancel] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ROLES & PERMISSIONS                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Role   │ Conversations │ Leads │ Docs │ Team │ Settings   ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Owner  │      ✅       │  ✅   │  ✅  │  ✅  │     ✅     ││
│  │ Admin  │      ✅       │  ✅   │  ✅  │  ✅  │     ❌     ││
│  │ Staff  │      ✅       │  ✅   │  ✅  │  ❌  │     ❌     ││
│  │ Viewer │      ✅       │  ❌   │  ✅  │  ❌  │     ❌     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 8. ANALYTICS

```
┌──────────────────────────────────────────────────────────────────┐
│  Analytics                         [Last 30 Days ▼]  [📥 Export] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  KEY METRICS (4 cards)                                           │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ Total        │ Avg Response │ Resolution   │ Customer     │ │
│  │ Conversations│ Time         │ Rate         │ Satisfaction │ │
│  │              │              │              │              │ │
│  │    1,234     │   5m 23s     │     87%      │   4.6 ⭐     │ │
│  │   +12% ▲     │   -15% ▼     │    +5% ▲     │   +0.2 ▲     │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  CHARTS (2 rows × 2 columns)                                     │
│  ┌────────────────────────────────┬──────────────────────────┐ │
│  │ 📈 Volume Trend                │ 🕒 Peak Hours            │ │
│  │  (Line chart showing daily     │  (Heatmap showing busiest│ │
│  │   conversation volume)         │   hours of the day)      │ │
│  └────────────────────────────────┴──────────────────────────┘ │
│  ┌────────────────────────────────┬──────────────────────────┐ │
│  │ 🍩 Sources                     │ 📊 Top Questions         │ │
│  │  (Donut chart: Widget 60%,     │  (Bar chart showing most │ │
│  │   Email 25%, Chat 15%)         │   asked questions)       │ │
│  └────────────────────────────────┴──────────────────────────┘ │
│                                                                  │
│  TEAM PERFORMANCE                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Member │ Handled │ Avg Time │ Resolution │ CSAT │ Trend   ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Alice  │   45    │  4m 32s  │    92%     │ 4.8⭐│ 📈 +5%  ││
│  │ Bob    │   38    │  6m 15s  │    85%     │ 4.6⭐│ 📉 -2%  ││
│  │ Carol  │   32    │  3m 47s  │    95%     │ 4.9⭐│ 📈 +8%  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 9. SETTINGS (Tabbed)

```
┌──────────────────────────────────────────────────────────────────┐
│  Settings                                                        │
├──────────────────────────────────────────────────────────────────┤
│  [Business] [Widget] [Team] [Integrations] [Billing] [Advanced] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WIDGET TAB (Split view)                                         │
│  ┌──────────────────────┬───────────────────────────────────┐  │
│  │ CUSTOMIZATION        │ LIVE PREVIEW                      │  │
│  │                      │ ┌───────────────────────────────┐ │  │
│  │ Primary Color:       │ │ Your Website                  │ │  │
│  │ [🎨 #3B82F6] ──────  │ │                               │ │  │
│  │                      │ │                               │ │  │
│  │ Widget Position:     │ │  Lorem ipsum dolor sit amet,  │ │  │
│  │ ◉ Bottom Right       │ │  consectetur adipiscing elit. │ │  │
│  │ ○ Bottom Left        │ │                               │ │  │
│  │ ○ Top Right          │ │  [Chat Widget              ◀──┘│  │
│  │ ○ Top Left           │ │   Preview Here]               │  │
│  │                      │ │                               │  │
│  │ Avatar:              │ │   Shows your customization    │  │
│  │ [Current: 👤]        │ │   in real-time                │  │
│  │ [📸 Upload New]      │ │                               │  │
│  │                      │ └───────────────────────────────┘ │  │
│  │ Welcome Message:     │                                   │  │
│  │ ┌──────────────────┐ │ WIDGET CODE:                      │  │
│  │ │Hi! How can we    │ │ ┌───────────────────────────────┐ │  │
│  │ │help you today?   │ │ │<script src="https://..."></script>││
│  │ └──────────────────┘ │ │                               │ │  │
│  │                      │ │ [Copy Code]                   │ │  │
│  │ Language:            │ └───────────────────────────────┘ │  │
│  │ [English ▼]          │                                   │  │
│  │                      │ ADVANCED:                         │  │
│  │ Auto-open delay:     │ ☐ Auto-open after 5s              │  │
│  │ [5 seconds]          │ ☐ Show on mobile                  │  │
│  │                      │ ☐ Collect email before chat       │  │
│  │ [Save Changes]       │                                   │  │
│  │                      │                                   │  │
│  └──────────────────────┴───────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### C. SUPER ADMIN DASHBOARD

```
┌──────────────────────────────────────────────────────────────────┐
│  Super Admin Dashboard              [Search] [🔔] [Profile ▼]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYSTEM STATS (4 cards)                                          │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ 🏢 Total     │ 💰 Monthly   │ 👥 Active    │ 📈 Growth    │ │
│  │ Businesses   │ Revenue      │ Users        │ This Week    │ │
│  │              │              │              │              │ │
│  │     247      │  $12,450     │   1,893      │     +15      │ │
│  │    +5 ▲      │   +8% ▲      │   +12% ▲     │    +3% ▲     │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  REVENUE CHART                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📈 Monthly Recurring Revenue (MRR)                          ││
│  │  (Area chart showing revenue growth over time)              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  RECENT BUSINESSES                              [View All →]    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Business    │ Plan │ Team│ Status    │ Revenue │ Actions  ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Acme Corp   │ Pro  │  4  │ ✅ Active │ $49/mo  │ [⚙ View]││
│  │ Tech Inc    │ Ent. │ 12  │ ✅ Active │ $199/mo │ [⚙ View]││
│  │ Shop LLC    │ Start│  2  │ ⏳ Trial  │ $0      │ [⚙ View]││
│  │ Retail Co   │ Pro  │  6  │ ✅ Active │ $49/mo  │ [⚙ View]││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ALERTS & NOTIFICATIONS                                          │
│  ⚠️ 3 trials ending in 7 days                                    │
│  ⚠️ 2 payment failures (retry pending)                           │
│  ⚠️ 1 support ticket unresolved (48h)                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### D. CHAT WIDGET (Embeddable)

#### CLOSED STATE:
```
┌─────────────────┐
│ 💬              │
│                 │
│ Chat with us!   │
│ We're online 🟢 │
└─────────────────┘
```

#### OPEN STATE:
```
┌─────────────────────────────┐
│ Acme Corp Support       [✕] │
├─────────────────────────────┤
│ Welcome! How can we help?   │
│                             │
│ ┌─────────────────────────┐ │
│ │ You:                    │ │
│ │ Hi, I have a question   │ │
│ │ 10:23 AM                │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ AI Assistant:           │ │
│ │ Hello! I'd be happy to  │ │
│ │ help. What can I assist │ │
│ │ you with today?         │ │
│ │ 10:24 AM ✓              │ │
│ └─────────────────────────┘ │
│                             │
│ ─────────────────────────   │
│                             │
│ [Type your message...]  [→] │
│                             │
│ Powered by Pamilo AI        │
└─────────────────────────────┘
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Mobile Adaptations:
- Sidebar → Hamburger menu at top
- Tables → Stack as cards
- 3-column inbox → Single column with tabs
- Charts → Simplified, scroll horizontally if needed
- Buttons → Full width
- Bottom navigation bar for main actions

---

## ✨ INTERACTIONS & ANIMATIONS

### Transitions:
- All: 200ms ease-in-out
- Page loads: Fade in (300ms)
- Modals: Scale + fade (250ms)
- Dropdowns: Slide down (150ms)

### Hover Effects:
- Buttons: Darken, scale 1.05
- Cards: Elevate shadow, scale 1.02
- Links: Underline slide-in
- Table rows: Background change

### Loading States:
- Skeleton screens (pulsing gray boxes)
- Spinner (for button actions)
- Progress bars (for uploads)

### Empty States:
- Friendly illustration
- Encouraging message
- Clear CTA button

---

## 🎯 DELIVERABLES REQUIRED

Please provide:

1. **Complete Design System**
   - Color palette (with hex codes)
   - Typography scale
   - Component library
   - Spacing system
   - Icon set

2. **All Page Mockups** (30+ screens)
   - Landing page
   - Login/register
   - Dashboard home
   - All business dashboard pages
   - Super admin dashboard
   - Chat widget

3. **Responsive Variants**
   - Desktop (1440px)
   - Tablet (768px)
   - Mobile (375px)

4. **Interactive Prototype**
   - Clickable navigation
   - Key user flows
   - Hover states

5. **Design Files**
   - Figma file (preferred)
   - Or Adobe XD / Sketch
   - Component library
   - Design tokens (JSON)

6. **Developer Handoff**
   - Style guide document
   - Component specifications
   - Spacing/sizing guide
   - Asset export (icons, images)

7. **Accessibility**
   - WCAG 2.1 AA compliant
   - Color contrast ratios noted
   - Screen reader considerations

---

## 🎨 STYLE INSPIRATION

Design in the style of:
- **Linear** (clean, professional)
- **Vercel** (modern, minimalist)
- **Stripe** (trustworthy, polished)
- **Notion** (intuitive, functional)

Avoid:
- Cluttered interfaces
- Too many colors
- Heavy gradients
- Cartoonish elements
- Overly decorative

---

## ✅ DESIGN CHECKLIST

Your design is complete when:
- [ ] All 30+ pages designed
- [ ] Responsive variants for mobile/tablet
- [ ] Component library created
- [ ] Interactive prototype built
- [ ] Design tokens exported
- [ ] Developer handoff docs ready
- [ ] Accessibility standards met
- [ ] Icons and assets exported

---

**Make it beautiful, modern, and professional!** 🎨

Design in the style of world-class SaaS products. Focus on clarity, usability, and polish.

