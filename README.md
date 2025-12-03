# PostVolve - Social Media Content Automation SaaS

## Overview

PostVolve is a SaaS application designed to automate viral news card creation and distribution. The platform generates AI-powered "News Cards" - visually compelling social media graphics paired with engaging copy - across four content categories: Tech, AI, Business, and Motivation. The system provides end-to-end news card workflow management including generation, customization, scheduling, posting, and analytics tracking. Built as a full-stack TypeScript application, PostVolve targets thought leaders who want to maintain consistent social media presence with viral news cards without manual content creation overhead.

## Current State

- Next.js application with App Router
- Complete dashboard UI with 5 main pages implemented
- Authentication UI implemented (Supabase integration pending)
- Design system implemented with purple (#6D28D9) brand color
- All dashboard pages display mock data for now
- Supabase integration planned for database and authentication

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) + React 18 + TypeScript
- **Backend**: Express.js + TypeScript (API routes)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query
- **Animation**: Framer Motion
- **Validation**: Zod
- **Database**: Supabase (planned)
- **Auth**: Supabase Auth (planned)

## Project Structure

```
postvolve/
├── app/                      # Next.js App Router
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   └── dashboard/       # Dashboard-specific components
│   ├── dashboard/            # Dashboard pages
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── server/                   # Express backend (API routes)
│   ├── routes.ts            # API routes
│   ├── index.ts             # Server entry point
│   └── static.ts            # Static file serving
├── public/                   # Static assets
├── shared/                   # Shared types and schemas
│   └── schema.ts            # Zod validation schemas
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Dashboard Features

### 1. Dashboard Home (`/`)
Quick summary of performance and immediate actions:
- **Analytics Grid**: 3-4 analytics cards displaying high-level stats (Impressions, Posts Scheduled, Drafts)
- **Upcoming Posts Table**: Clean table showing next 5-10 scheduled or draft posts with columns for Title, Category, Scheduled Time, and Status
- **Quick Actions**: Large "Review Drafts" button linking to Content Generation page

### 2. Content Generation (`/generate`)
Main working area for reviewing and customizing AI-generated content:
- **Category Filter**: Filter chips for Tech, AI, Business, Motivation, and All categories
- **Content Card List**: Display drafts with visual preview and action area
- **Post Customization Modal**: Full-screen overlay for editing post copy and scheduling
- **Actions**: Review & Edit, Skip/Regenerate, and Generate More Content buttons

### 3. Scheduler (`/scheduler`)
Content scheduling interface:
- **Calendar View**: Visual calendar for scheduling posts
- **Upcoming Posts Sidebar**: List of scheduled content

### 4. Analytics (`/analytics`)
Performance tracking and review:
- **Global Metrics Grid**: 4-5 analytics cards showing total posts, average impressions, total engagement
- **Detailed Post Log**: Searchable/filterable data table of all past posts
- **Data Visualization**: Time-series chart showing impressions over the last 30 days

### 5. Settings (`/settings`)
Core engine preferences management:
- **Auto Posting Control**: Toggle switch for enabling automatic posting with schedule configuration
- **Content Category Selector**: Grid of filter chips to select/deselect content categories
- **Integration Status**: Card showing status of linked social accounts (LinkedIn, Twitter, etc.)

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14+ (App Router) with React 18 and TypeScript, using functional components and hooks exclusively. The application uses Next.js for build tooling, development server, and routing.

**Routing**: File-based routing using Next.js App Router. Routes are defined by the file structure in the `app/` directory. Protected routes use Next.js middleware for authentication checks.

**Component System**: Built on shadcn/ui, a component library based on Radix UI primitives with Tailwind CSS styling. The design system enforces consistent spacing, typography, and interaction patterns. Custom component variants are defined using class-variance-authority for type-safe prop-based styling.

**State Management**: TanStack Query (React Query) handles all server state, including data fetching, caching, and synchronization. Authentication state is managed through a custom AuthContext provider that wraps the application. No global client state management library is used - component state is handled with React hooks (useState, useEffect, etc.).

**Styling System**: Tailwind CSS with a custom design system defined in `design.json`. The primary brand color is purple (#6D28D9). CSS custom properties enable theme switching and consistent color usage. Typography uses Inter for body text and Plus Jakarta Sans for headings.

**Animation**: Framer Motion provides declarative animations with viewport-triggered fade-ins and stagger effects. All interactive elements use transition utilities for smooth state changes (300ms ease-in-out).

**Layout Pattern**: Dashboard pages use a persistent sidebar layout (DashboardLayout component) with mobile responsive behavior - sidebar collapses to a drawer on smaller screens. Desktop sidebar is fixed at 280px width.

### Backend Architecture

**Server Framework**: Express.js running on Node.js, configured as an ES module project (type: "module" in package.json).

**Authentication**: Supabase Auth (planned) will handle user authentication. Currently using mock authentication for frontend development.

**API Structure**: RESTful API with routes defined in server/routes.ts. Current endpoints include contact form submission (/api/contact). API responses follow a consistent JSON structure with success/error flags. Next.js API routes can also be used for additional endpoints.

**Database Layer**: Supabase (planned) will provide database and authentication. Currently using Zod schemas for validation.

**Build Process**: Next.js handles frontend build and optimization automatically. Server code can be bundled separately if needed for deployment.

**Development Setup**: Next.js dev server handles frontend with hot module replacement. Express server runs separately for API routes (optional, can use Next.js API routes instead).

### Database Design (Planned)

**Database**: Supabase (PostgreSQL) - Integration planned

**Schema Organization**: Zod schemas defined in `shared/schema.ts` for validation. These will be used with Supabase when integrated.

**Planned Tables**:
- **users**: User authentication and profile data
- **contactSubmissions**: Contact form submissions

## Design System

The design system is defined in `app/lib/design.json` and follows a modern, premium aesthetic with glass-morphism effects and subtle shadows.

### Color Palette

- **Primary**: Purple (#6D28D9) for interactive elements and brand identity
- **Primary Hover**: Darker purple (#4C1D95) for hover states
- **Secondary**: Dark blue (#1E3A8A) for data visualization
- **Background**: Light (#F7F9FB), Default (#FFFFFF), Dark (#1F2937)
- **Grayscale**: 100 (#F3F4F6), 200 (#E5E7EB), 300 (#D1D5DB), 500 (#6B7280)
- **State Colors**: Success (#10B981), Warning (#F59E0B), Error (#EF4444)

### Typography

- **Font Families**: Inter (body text), Plus Jakarta Sans (headings)
- **Headings**: H1 (3rem/800 weight), H2 (1.875rem/700 weight)
- **Body**: 1rem/400 weight
- **Caption**: 0.75rem/500 weight with muted color

### Component Specifications

**Buttons**:
- **Primary**: Used for CTAs, Save changes, Post Now - Purple background with white text, rounded corners, shadow, hover elevation
- **Secondary**: Used for Cancel, View History - Gray background with border, subtle hover

**Cards**:
- **Content Cards**: Display generated posts with visual preview and edit area, smooth hover effects with scale and shadow
- **Analytics Cards**: Display metrics with primary color top border, shadow, and padding

**Navigation**:
- **Sidebar Links**: Text with hover background, active state with primary color accent
- **Mobile**: Collapsible drawer menu for smaller screens

**Status Badges**: Color-coded status indicators (Scheduled: warning, Draft: gray, Posted: success, Error: error)

**Transitions**: All interactive elements use 300ms ease-in-out transitions with hover elevation effects.

## Key Components

1. **DashboardLayout** - Responsive sidebar navigation with mobile support
2. **PostCustomizationModal** - Full-screen modal for editing post content
3. **Analytics Cards** - Reusable metric display components
4. **Content Cards** - Post preview with visual and text areas
5. **Filter Chips** - Category selector components
6. **Data Tables** - Sortable, filterable tables for post history

## External Dependencies

### Third-Party Services

**Database**: Supabase (PostgreSQL) - Integration planned. Will handle both database and authentication.

### Required API Integrations (Not Yet Implemented)

The application is designed to integrate with social media platforms for posting, though these integrations are not yet connected:
- Social media platform OAuth flows (for account connection)
- Content posting APIs for automated publishing
- Analytics APIs for engagement tracking

### Development Tools

**Build Dependencies**: Next.js for frontend build and optimization, Tailwind CSS for styling, TypeScript compiler for type checking.

### Frontend Libraries

**UI Components**: Extensive Radix UI primitive collection (@radix-ui/*) providing accessible, unstyled components. Custom styling applied via Tailwind.

**Form Handling**: React Hook Form with @hookform/resolvers for validation integration.

**Validation**: Zod for schema definition and runtime validation, with zod-validation-error for user-friendly error messages.

**Utilities**: date-fns for date manipulation, clsx and tailwind-merge for class name composition.

### Backend Libraries

**Authentication**: Supabase Auth - Integration planned. Currently using mock authentication for frontend development.

**Security**: Built-in Node crypto module for password hashing (scrypt algorithm).

**Validation**: Zod schemas shared between client and server for consistent validation.

## Development

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (optional for now):
   - `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://postvolve.com`)
   - `PORT`: Server port for Express API (default: 5000, only if using `dev:full`)

3. Start development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run dev:full` - Start Express API server (optional, for API routes)
- `npm run build` - Build Next.js application for production
- `npm run start` - Start Next.js production server
- `npm run check` - Type check with TypeScript
- `npm run lint` - Run Next.js linter

## Notes

- Authentication is currently mocked - Supabase integration is planned
- All dashboard pages display mock data for now
- UI-first approach: Complete UI built before connecting backend logic
- Next.js handles frontend build and deployment automatically

## User Preferences

- Simple, everyday language for communication
- UI-first approach: Build complete UI before connecting backend logic
- Purple (#6D28D9) as primary brand color
- Modern glass-morphism aesthetic with subtle shadows
- Responsive design supporting mobile and desktop
- Premium hover effects with smooth transitions
