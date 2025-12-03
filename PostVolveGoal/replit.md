# PostVolve - Social Media Content Automation SaaS

## Overview
PostVolve is a SaaS application for social media content automation that generates viral news cards, schedules posts, and tracks analytics. The application features AI-powered content generation, multi-platform scheduling, and engagement tracking.

## Current State
- Full-stack React/TypeScript application with Express backend
- Complete dashboard UI with 5 main pages implemented
- Authentication infrastructure (UI only - logic not yet connected)
- Design system implemented with purple (#6D28D9) brand color

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter (client-side)
- **State Management**: TanStack Query
- **ORM**: Drizzle ORM (ready for PostgreSQL)
- **Auth**: Passport.js (infrastructure in place)

### Directory Structure
```
PostVolveGoal/
├── client/                    # Frontend React app
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── ui/           # shadcn/ui components
│       │   └── dashboard/    # Dashboard-specific components
│       ├── pages/            # Page components
│       │   └── dashboard/    # Dashboard pages
│       ├── hooks/            # Custom React hooks
│       └── lib/              # Utility functions
├── server/                   # Express backend
│   ├── routes.ts            # API routes
│   ├── auth.ts              # Passport authentication
│   └── storage.ts           # Session storage
├── shared/                   # Shared types and schemas
│   └── schema.ts            # Drizzle schema + Zod validation
└── design.json              # Design system tokens
```

### Key Components
1. **DashboardLayout** - Responsive sidebar navigation with mobile support
2. **Dashboard Home** - Stats cards + upcoming posts table
3. **Content Generation** - Category filters + content cards with edit modal
4. **Scheduler** - Calendar view + upcoming posts sidebar
5. **Analytics** - Metrics cards + bar chart + post history table
6. **Settings** - Auto-posting toggle, category selection, connected accounts

## Recent Changes (December 2024)
- Created complete dashboard UI with all 5 pages
- Implemented design system with design.json
- Built PostCustomizationModal for content editing
- Updated routing to include all dashboard pages
- Fixed TypeScript ReactNode import issue

## Notes
- The 401 errors on /api/user are expected - authentication is not yet connected to a database
- PostgreSQL database needs to be provisioned for full auth functionality
- All dashboard pages display mock data for now

## User Preferences
- UI-first approach: Build complete UI before connecting backend logic
- Purple (#6D28D9) as primary brand color
- Modern glass-morphism aesthetic with subtle shadows
- Responsive design supporting mobile and desktop
