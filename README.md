# PostVolve - Social Media Content Automation SaaS

## Overview

PostVolve is a SaaS application designed to automate viral news card creation and distribution. The platform generates AI-powered "News Cards" - visually compelling social media graphics paired with engaging copy - across four core content categories (Tech, AI, Business, Motivation) plus an optional **Custom** voice where users can define their own niche.

**Core Vision**: Move beyond simple topic-based automation by allowing users to provide specific, high-value source material for their posts. PostVolve is a **Content Repurposing and Curation Engine**, not just a scheduler.

## Key Differentiators

| Feature | PostVolve Advantage |
|---------|---------------------|
| **Integrated Review Dashboard** | Every draft requires user review by default, ensuring brand voice consistency |
| **Unified AI Engine** | Single Gemini model for text + image generation ensures visual/textual alignment |
| **Platform-Aware Output** | AI outputs different copy lengths and hashtag usage per platform automatically |
| **URL-Based Content Grounding** | Generate posts from external sources, positioning users as curators/authorities |
| **Clean UI/UX** | Purpose-built interface vs. complex N8N workflow configurations |

## Current State

### ✅ Implemented
- Next.js application with App Router
- Complete landing page with 3D animated dashboard preview
- Dashboard UI with 7 main pages (Home, Generate, Scheduler, Analytics, Billing, Account, Settings)
- Authentication pages (Sign In, Sign Up, Forgot Password, Reset Password)
- User onboarding flow (platforms, categories, schedule)
- Pricing page with plan comparison
- Legal pages (Terms of Service, Privacy Policy)
- Collapsible sidebar with plan indicator and responsive design
- Generate Now modal (Lanes 2 & 3 UI: URL, Custom Prompt, Upload)
- Enhanced Post Customization modal with platform selection and preview
- Lane badges on draft cards (Auto/URL/Custom indicators)
- Multiple schedules UI in Settings
- Billing page with subscription management and usage tracking
- Account page with profile settings and security options

### 🚧 In Progress / Planned
- Supabase integration for database and authentication
- Real AI integration with Gemini API (to power all three lanes)
- Social media platform OAuth connections
- Backend API endpoints for content generation

## Content Generation: The Three Lanes

PostVolve offers three distinct lanes for content generation, all feeding into the central Draft Review Dashboard.

### Lane 1: Automated (Scheduled Generation)
| Aspect | Details |
|--------|---------|
| **Trigger** | User sets daily schedule & categories in Settings |
| **Purpose** | Consistency & Volume - generates news cards daily |
| **Implementation** | Scheduled Serverless Function (Cron Job) calling Gemini API |
| **Status** | 🟡 UI exists, backend pending |

### Lane 2: URL-Driven Generation
| Aspect | Details |
|--------|---------|
| **Trigger** | User pastes a Blog/Article URL and clicks "Generate" |
| **Purpose** | Source-Specific Authority - AI researches the link, summarizes key points |
| **Implementation** | Synchronous API endpoint with URL context to Gemini API |
| **Status** | 🟡 UI complete, backend pending |

### Lane 3: Custom Prompt/Upload
| Aspect | Details |
|--------|---------|
| **Trigger** | User types a specific prompt or uploads an image/document |
| **Purpose** | Creative Control - user directs AI precisely |
| **Implementation** | Synchronous API endpoint with text/image input to Gemini API |
| **Status** | 🟡 UI complete, backend pending |

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query
- **Animation**: Framer Motion
- **Validation**: Zod
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI Engine**: Google Gemini API (Text + Image Generation)

## Project Structure

```
postvolve/
├── app/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   └── dashboard/             # Dashboard-specific components
│   │       ├── DashboardLayout.tsx
│   │       ├── PostCustomizationModal.tsx
│   │       └── GenerateNowModal.tsx
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard home
│   │   ├── generate/page.tsx      # Content generation (Lanes 2 & 3)
│   │   ├── scheduler/page.tsx     # Calendar scheduling
│   │   ├── analytics/page.tsx     # Performance metrics
│   │   ├── billing/page.tsx       # Subscription management
│   │   ├── account/page.tsx       # Profile & security settings
│   │   └── settings/page.tsx      # Auto-posting & preferences
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── onboarding/page.tsx
│   ├── pricing/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   ├── contact/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── hooks/
│   │   ├── use-auth.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   ├── layout.tsx
│   ├── page.tsx                   # Landing page
│   └── globals.css
├── public/
│   ├── dashboard-preview.png
│   ├── favicon.png
│   ├── onboarding.png
│   ├── signin.jpeg
│   └── signup.png
├── shared/
│   └── schema.ts                  # Zod validation schemas
└── tailwind.config.ts
```

## Pages

### Public Pages
- **Landing Page** (`/`) - Hero with floating icons, features, trusted partners marquee, testimonials
- **Pricing** (`/pricing`) - 3-tier pricing with comparison table and FAQ
- **Contact** (`/contact`) - Contact form
- **Terms** (`/terms`) - Terms of Service
- **Privacy** (`/privacy`) - Privacy Policy

### Auth Pages
- **Sign In** (`/signin`) → Redirects to `/dashboard`
- **Sign Up** (`/signup`) → Redirects to `/onboarding`
- **Onboarding** (`/onboarding`) - 3-step setup: platforms, categories, schedule
- **Forgot Password** (`/forgot-password`)
- **Reset Password** (`/reset-password`)

### Dashboard Pages
- **Dashboard Home** (`/dashboard`) - Drafts overview, category cards, active projects
- **Content Generation** (`/dashboard/generate`) - Review AI-generated drafts, Generate Now modal (Lanes 2 & 3), lane badges
- **Scheduler** (`/dashboard/scheduler`) - Calendar view, upcoming posts sidebar
- **Analytics** (`/dashboard/analytics`) - Metrics grid, impressions chart, post history
- **Billing** (`/dashboard/billing`) - Subscription management, usage meters, payment history, plan comparison
- **Account** (`/dashboard/account`) - Profile settings, password change, timezone, danger zone
- **Settings** (`/dashboard/settings`) - Auto-posting with multiple schedules, categories, connected accounts, notifications

## Pricing Tiers

| Feature | Starter ($39/mo) | Plus ($99/mo) | Pro ($299/mo) |
|---------|------------------|------------------------|---------------------|
| Daily Auto-Posts | 1 per day | 3 per day | Unlimited |
| Content Categories | All 4 | All 4 | All 4 + Custom |
| Social Accounts | 1 | 5 | Unlimited |
| Post Scheduling | ✓ | ✓ | ✓ |
| Content Customization | - | ✓ | ✓ |
| Multiple Schedules | - | ✓ | ✓ |
| Advanced Analytics | - | ✓ | ✓ |
| Performance Reports | - | ✓ | ✓ |
| Competitor Analysis | - | - | ✓ |
| Brand Voice Tuning | - | - | ✓ |
| Team Collaboration | - | - | ✓ |
| Dedicated Support | - | - | ✓ |

## Planned Features (Roadmap)

### MVP Core
- [ ] Supabase database integration
- [ ] Supabase authentication
- [ ] Lane 1: Automated generation with Gemini API
- [ ] Real analytics data tracking
- [ ] Social platform OAuth (LinkedIn, Twitter/X)

### MVP Extension
- [ ] Lane 2: URL-driven generation interface
- [ ] Lane 3: Custom prompt/upload interface
- [ ] "Generate Now" modal with lane selection
- [ ] Platform-specific post preview
- [ ] Per-post platform selection

### Post-MVP
- [ ] Auto-publish mode (Zero-Touch Toggle)
- [ ] Multiple schedules per day
- [ ] Brand voice tuning (Enterprise)
- [ ] Team collaboration features
- [ ] Competitor analysis
- [ ] API access for Enterprise

## UI Components Needed

### Generate Now Modal (Priority: High)
```
┌─────────────────────────────────────────────────────────┐
│  How would you like to create?                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │  🔗 URL     │ │  ✏️ Prompt  │ │  📎 Upload  │        │
│  │  Paste a   │ │  Write your │ │  Add image  │        │
│  │  link      │ │  own prompt │ │  or doc     │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Enhanced Post Modal (Priority: High)
- Platform toggles (LinkedIn, Twitter, Facebook, Instagram)
- Platform-specific character counts
- Preview per platform
- Image regenerate button
- Lane indicator badge

### Lane Badges for Draft Cards
- 🤖 Auto (Lane 1)
- 🔗 URL (Lane 2)  
- ✏️ Custom (Lane 3)

## Design System

### Colors
- **Primary**: Purple (#6D28D9)
- **Primary Hover**: (#4C1D95)
- **Background**: Light (#F7F9FB), White (#FFFFFF)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Plus Jakarta Sans
- **Body**: Inter

### Components
- Glass-morphism aesthetic with subtle shadows
- Responsive sidebar (collapsible on desktop, drawer on mobile)
- Mac-style window frames for previews
- Smooth transitions (300ms ease-in-out)
- Infinite marquee for partner logos

## Database Schema ✅ IMPLEMENTED

**Full PostgreSQL schema with 12 tables, RLS policies, and helper functions.**

📁 **Migration Files**: `supabase/migrations/001_initial_schema.sql`  
📁 **TypeScript Types**: `shared/types/database.types.ts`  
📁 **Helper Functions**: `app/lib/database.ts`

### Core Tables (12 total)

| Table | Description | Status |
|-------|-------------|--------|
| `users` | User profiles & auth | ✅ Ready |
| `subscriptions` | Billing plans & limits | ✅ Ready |
| `invoices` | Payment history | ✅ Ready |
| `user_settings` | User preferences | ✅ Ready |
| `posting_schedules` | Auto-post schedules | ✅ Ready |
| `connected_accounts` | Social OAuth tokens | ✅ Ready |
| `posts` | Content drafts & published | ✅ Ready |
| `post_platforms` | Platform-specific content | ✅ Ready |
| `post_analytics` | Performance metrics | ✅ Ready |
| `daily_analytics` | Aggregated stats | ✅ Ready |
| `usage_tracking` | Monthly usage for billing | ✅ Ready |
| `activity_log` | Audit trail | ✅ Ready |

### Key Features
- ✅ Row Level Security (RLS) on all tables
- ✅ Automated `updated_at` timestamps
- ✅ Helper functions for common operations
- ✅ Full TypeScript type definitions
- ✅ Optimized indexes for performance
- ✅ Soft delete for posts
- ✅ Auto-calculated engagement rates

### Setup Instructions
See detailed migration guide: `supabase/README.md`

## Development

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `env.example.txt` to `.env.local`
   - Fill in your Supabase credentials and API keys
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For admin operations
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run database migration:**
   - Open Supabase Dashboard → SQL Editor
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run the migration
   - See `supabase/README.md` for detailed instructions

4. **Test database connection:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/test-db
   ```

5. **Start development:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

### Scripts
- `npm run dev` - Development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Run ESLint

### Testing Database
After migration, test your database connection:
- API Route: `GET /api/test-db` (development only)
- Helper functions: See `app/lib/database.ts`
- Type safety: All queries are fully typed with TypeScript

## Notes

- ✅ **UI Complete**: All 90+ screens designed and implemented
- ✅ **Database Schema**: Full PostgreSQL schema with RLS ready
- 🚧 **AI Integration**: Gemini API setup pending
- 🚧 **OAuth**: Social media platform connections pending
- 🚧 **Payments**: Stripe integration for billing pending
