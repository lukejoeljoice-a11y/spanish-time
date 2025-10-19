# Spanish Scrabble Game

## Overview

A web-based Spanish Scrabble game that combines language learning with classic board game mechanics. Players form Spanish words on a digital board and receive English translations and definitions, creating an educational gaming experience. The application features a classic Scrabble aesthetic with modern web interface design, complete with premium square multipliers, tile management, and score tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable UI elements. The design system uses Tailwind CSS for styling with custom color variables defined for both light and dark themes.

**Design System**:
- Typography: Inter (UI/body) and Merriweather (display/headings) from Google Fonts
- Color palette: Custom HSL-based theme supporting light/dark modes with Scrabble-specific colors (board base, tile colors, premium squares)
- Component variants: Extensive use of class-variance-authority for consistent component styling
- Responsive design: Mobile-first approach with breakpoints handled through Tailwind

**State Management**: 
- React hooks (useState, useCallback, useEffect) for local component state
- TanStack Query (React Query) for server state management and API caching
- Custom hooks for mobile detection and toast notifications

**Routing**: Wouter for lightweight client-side routing

**Key Frontend Features**:
- Drag-and-drop tile placement system
- Interactive 15x15 Scrabble board with premium squares (DL, TL, DW, TW)
- Player rack with 7 tile slots
- Real-time score calculation
- Translation modal for word definitions
- Theme toggle (light/dark mode)
- Toast notifications for user feedback

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Design**: RESTful JSON API with the following endpoints:
- POST `/api/validate-word` - Validates Spanish words and returns translations
- POST `/api/calculate-score` - Calculates word scores based on board position and premium squares
- POST `/api/new-tile-bag` - Creates a new randomized tile bag
- POST `/api/draw-tiles` - Draws tiles from the bag

**Game Logic**:
- Spanish letter distribution with point values (100 tiles total including 2 blank tiles)
- Board layout with premium square definitions (15x15 grid)
- Word validation against Spanish dictionary
- Score calculation with multiplier logic
- Tile bag management and random drawing

**Data Validation**: Zod schemas for request/response validation, ensuring type safety between frontend and backend

**Development Features**:
- Custom logging middleware for API requests
- Error handling middleware with status codes
- Vite integration for HMR in development
- Replit-specific plugins for development tooling

### Data Storage

**Primary Storage**: In-memory storage implementation (MemStorage class) for user data during development. The storage interface is designed to be swappable with database implementations.

**Database Schema** (Drizzle ORM):
- Users table with id, username, and password fields
- PostgreSQL dialect configured via Drizzle Kit
- Schema defined in TypeScript with Zod validation schemas

**Session Management**: Prepared for connect-pg-simple (PostgreSQL session store), though not fully implemented in current state

**Data Models**:
- User model with insert/select types
- TileData interface for game tiles (letter, points, id)
- Validation schemas for word checking and score calculation

### Code Organization

**Monorepo Structure**:
- `/client` - React frontend application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Route-level page components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and query client
- `/server` - Express backend
  - Game logic implementation
  - API routes
  - Storage abstraction layer
- `/shared` - Shared TypeScript types and schemas (used by both client and server)

**Build Configuration**:
- Vite config with path aliases (@, @shared, @assets)
- TypeScript strict mode with ESNext module system
- Separate builds for client (Vite) and server (esbuild)

**Type Safety**: Full TypeScript coverage with strict compiler options, shared types between frontend and backend preventing API contract mismatches

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI framework with concurrent features
- **Express**: Backend HTTP server framework
- **Vite**: Frontend build tool and dev server with HMR

### UI Component Libraries
- **Radix UI**: Headless accessible component primitives (accordion, dialog, dropdown, tooltip, etc.)
- **shadcn/ui**: Pre-built component system built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library for UI elements

### State & Data Management
- **TanStack Query (React Query)**: Server state management and caching
- **React Hook Form**: Form state management with @hookform/resolvers for validation
- **Wouter**: Lightweight routing library

### Database & Validation
- **Drizzle ORM**: Type-safe ORM for PostgreSQL with migration support
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **Zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle and Zod for schema validation

### Styling & UI Utilities
- **class-variance-authority**: Type-safe variant-based component styling
- **clsx & tailwind-merge**: Utility for conditional CSS class composition
- **cmdk**: Command menu component (command palette)
- **embla-carousel-react**: Carousel/slider component
- **date-fns**: Date manipulation and formatting

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **TSX**: TypeScript execution for Node.js development
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing

### API & External Services
The application is currently configured to validate Spanish words and provide English translations, suggesting integration with a Spanish-English dictionary API or service (implementation details not visible in provided code).

### Font Delivery
- **Google Fonts CDN**: Inter and Merriweather fonts loaded via CDN for typography system