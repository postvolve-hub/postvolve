# PostVolve - Social Media Content Automation SaaS

## Overview

PostVolve is a SaaS application designed to automate social media content creation and distribution. The platform generates AI-powered "News Cards" - visually compelling social media graphics paired with engaging copy - across four content categories: Tech, AI, Business, and Motivation. The system provides end-to-end content workflow management including generation, customization, scheduling, and analytics tracking. Built as a full-stack TypeScript application, PostVolve targets content creators and thought leaders who want to maintain consistent social media presence without manual content creation overhead.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using functional components and hooks exclusively. The application leverages Vite for build tooling and development server.

**Routing**: Client-side routing implemented with Wouter, a minimal routing library. All routes are defined in a centralized Switch/Route structure within App.tsx. Protected routes use a custom ProtectedRoute wrapper that checks authentication status.

**Component System**: Built on shadcn/ui, a component library based on Radix UI primitives with Tailwind CSS styling. The design system enforces consistent spacing, typography, and interaction patterns. Custom component variants are defined using class-variance-authority for type-safe prop-based styling.

**State Management**: TanStack Query (React Query) handles all server state, including data fetching, caching, and synchronization. Authentication state is managed through a custom AuthContext provider that wraps the application. No global client state management library is used - component state is handled with React hooks (useState, useEffect, etc.).

**Styling System**: Tailwind CSS with a custom design system defined in theme tokens. The primary brand color is purple (#6D28D9). CSS custom properties enable theme switching and consistent color usage. Typography uses Inter for body text and Plus Jakarta Sans for headings.

**Animation**: Framer Motion provides declarative animations with viewport-triggered fade-ins and stagger effects. All interactive elements use transition utilities for smooth state changes.

**Layout Pattern**: Dashboard pages use a persistent sidebar layout (DashboardLayout component) with mobile responsive behavior - sidebar collapses to a drawer on smaller screens.

### Backend Architecture

**Server Framework**: Express.js running on Node.js, configured as an ES module project (type: "module" in package.json).

**Authentication**: Passport.js with local strategy handles user authentication. Sessions are stored in PostgreSQL using connect-pg-simple. Password hashing uses Node's built-in scrypt algorithm with salt generation.

**API Structure**: RESTful API with routes defined in server/routes.ts. Current endpoints include contact form submission (/api/contact) and authentication endpoints (login, logout, register). API responses follow a consistent JSON structure with success/error flags.

**Database Layer**: Drizzle ORM provides type-safe database access with schema-first design. Database operations are abstracted through a storage interface (IStorage) implemented by DatabaseStorage class, enabling potential swapping of storage backends.

**Build Process**: Custom build script bundles server code with esbuild, selectively bundling frequently-used dependencies to reduce cold start times (important for serverless deployments). Client build uses Vite's production build.

**Development Setup**: Dual-mode development - Vite dev server for client with HMR, tsx watch mode for server. In production, static client files are served by Express from the dist directory.

### Database Design

**ORM**: Drizzle ORM with PostgreSQL dialect configured via drizzle.config.ts.

**Schema Organization**: Centralized schema definition in shared/schema.ts, enabling type sharing between client and server. Zod schemas are automatically generated from Drizzle table definitions using drizzle-zod for runtime validation.

**Current Tables**:
- **users**: Standard authentication table with id (serial), username (unique), email (unique), password (hashed), createdAt timestamp
- **contactSubmissions**: Stores contact form data with firstName, lastName, email, subject, message fields

**Migration Strategy**: Schema changes pushed directly to database using drizzle-kit push command (not migration-based in current setup).

**Connection**: Uses Neon serverless PostgreSQL driver (@neondatabase/serverless) with connection pooling for production reliability. Database URL configured via environment variable.

### Design System

**Color Palette**: Primary purple (#6D28D9) for interactive elements and brand identity, with darker hover state (#4C1D95). Secondary dark blue (#1E3A8A) for data visualization. Grayscale system for backgrounds and text hierarchy.

**Typography Scale**: Responsive sizing with defined weights for headings (h1: 3rem/800 weight, h2: 1.875rem/700 weight) and body text (1rem/400 weight). Caption text at 0.75rem with muted color.

**Component Tokens**: Standardized border radius, shadow depths, transition timing (300ms ease-in-out), and spacing scale. All interactive elements receive hover-elevate and active-elevate-2 classes for consistent depth changes.

**Responsive Strategy**: Mobile-first approach using Tailwind breakpoints (sm:, lg:). Dashboard navigation adapts from fixed sidebar (desktop) to collapsible drawer (mobile).

## External Dependencies

### Third-Party Services

**Database**: Neon serverless PostgreSQL (configured via DATABASE_URL environment variable). Application expects PostgreSQL-compatible database with connection pooling support.

**Session Storage**: PostgreSQL-backed session store using connect-pg-simple. Sessions table auto-created on first run.

### Required API Integrations (Not Yet Implemented)

The application is designed to integrate with social media platforms for posting, though these integrations are not yet connected:
- Social media platform OAuth flows (for account connection)
- Content posting APIs for automated publishing
- Analytics APIs for engagement tracking

### Development Tools

**Replit Plugins**: Application includes Replit-specific Vite plugins (cartographer, dev-banner, runtime-error-modal) for enhanced development experience on Replit platform.

**Build Dependencies**: esbuild for server bundling, Vite for client bundling, Tailwind CSS for styling, TypeScript compiler for type checking.

### Frontend Libraries

**UI Components**: Extensive Radix UI primitive collection (@radix-ui/*) providing accessible, unstyled components. Custom styling applied via Tailwind.

**Form Handling**: React Hook Form with @hookform/resolvers for validation integration.

**Validation**: Zod for schema definition and runtime validation, with zod-validation-error for user-friendly error messages.

**Utilities**: date-fns for date manipulation, nanoid for ID generation, clsx and tailwind-merge for class name composition.

### Backend Libraries

**Authentication**: Passport.js with passport-local strategy, express-session for session management.

**Security**: Built-in Node crypto module for password hashing (scrypt algorithm).

**Validation**: Zod schemas shared between client and server for consistent validation.