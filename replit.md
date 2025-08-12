# AgriConnect Rwanda

## Overview

AgriConnect Rwanda is a full-stack web application designed to connect farmers with customers in Rwanda's agricultural market. The platform provides a marketplace for agricultural products with location-based farmer discovery, price comparison, and machine learning-powered recommendations. The application supports English and Kinyarwanda languages and is tailored specifically for Rwanda's geographical structure (provinces, districts, sectors).

The system serves three user types: farmers who can list and manage their products, customers who can browse and purchase products, and administrators who oversee the platform operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme featuring Rwanda's national colors
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit OAuth integration with Passport.js
- **API Design**: RESTful API with structured error handling and request logging

### Database Design
- **Primary Database**: PostgreSQL with comprehensive schema for Rwanda's agricultural marketplace
- **Core Entities**: Users, farmers, products, orders, reviews, and Rwanda's administrative divisions
- **Location Structure**: Hierarchical location data (provinces → districts → sectors) matching Rwanda's administrative structure
- **Session Storage**: Dedicated sessions table for authentication persistence

### Authentication & Authorization
- **Provider**: Replit OAuth with OpenID Connect
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Role-based Access**: Three user types (customer, farmer, admin) with different dashboard access
- **Security**: Secure session cookies, CSRF protection, and proper error handling

### Machine Learning Integration
- **Demand Predictions**: ML models for forecasting product demand
- **Recommendation System**: Personalized product and farmer recommendations
- **Price Analysis**: Intelligent price comparison and market insights

## External Dependencies

### Core Development Stack
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Authentication**: Replit OAuth infrastructure
- **Frontend Framework**: React 18 with TypeScript
- **Build Tools**: Vite with TypeScript support

### UI and Styling
- **Component Library**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icon library
- **Fonts**: Google Fonts integration (Inter, DM Sans, Geist Mono, etc.)

### Data Management
- **HTTP Client**: Native fetch API with React Query
- **Form Handling**: React Hook Form with Zod schema validation
- **Date Utilities**: date-fns for date manipulation
- **State Management**: TanStack React Query for server state

### Development Tools
- **Type Checking**: TypeScript with strict configuration
- **Session Storage**: connect-pg-simple for PostgreSQL session store
- **Development Server**: Vite dev server with HMR
- **Build Process**: ESBuild for production builds

### Rwanda-Specific Features
- **Geographical Data**: Complete Rwanda administrative divisions (provinces, districts, sectors)
- **Localization**: Kinyarwanda language support alongside English
- **Agricultural Categories**: Rwanda-specific crop and livestock categories
- **Local Currency**: Rwandan Franc (RWF) price formatting