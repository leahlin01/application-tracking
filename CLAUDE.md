# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup & Database
```bash
# Install dependencies
npm install

# Generate Prisma client and run migrations  
npx prisma generate
npx prisma migrate dev

# Seed database with sample data
curl -X POST http://localhost:3000/api/seed
```

### Development
```bash
# Start dev server (uses Turbopack)
npm run dev

# Build application
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Seed database programmatically
npm run db:seed
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **UI**: React 19 + TypeScript + Tailwind CSS
- **Authorization**: Custom RBAC (Role-Based Access Control) system

### Database Schema Architecture

The system uses a multi-tenant architecture with role-based access control:

**Core Entities**:
- `users` - Authentication and role management (STUDENT, PARENT, TEACHER, ADMIN)
- `students` - Student profiles with academic information
- `universities` - University data with rankings, deadlines, tuition
- `applications` - Application tracking with status workflow
- `application_requirements` - Granular requirement tracking per application
- `parent_students` - Many-to-many relationship between parents and students
- `parent_notes` - Parent comments on applications

**Key Relationships**:
- User → Student (1:1 for students, 1:many for parents via parent_students)
- Student → Applications (1:many)
- University → Applications (1:many) 
- Application → Requirements (1:many)
- Application → ParentNotes (1:many)

### RBAC Permission System

Located in `src/lib/auth.ts`, the system implements fine-grained permissions:

- **Students**: Full CRUD on own applications and profile
- **Parents**: Read applications of linked students, CRUD on own notes
- **Teachers**: Read/update applications and student data (commented out)
- **Admins**: Full access (commented out)

Permission checking uses resource-action-conditions pattern with context validation.

### API Architecture

**Authentication Routes** (`/api/auth/`):
- `POST /login` - JWT authentication
- `POST /register` - User registration with role assignment

**Role-specific Routes**:
- `/api/student/` - Student application management
- `/api/parent/` - Parent application viewing and note management

**Shared Routes**:
- `/api/applications/` - General application CRUD
- `/api/universities/` - University data
- `/api/students/` - Student management

### Frontend Component Structure

**Authentication Components**:
- `AuthProvider` - React Context for auth state
- `ProtectedRoute` - Route-level role protection
- `LoginForm`/`RegisterForm` - Authentication forms

**Feature Components**:
- `Dashboard` - Main application dashboard
- `ApplicationList`/`ApplicationForm` - Application management
- `UniversitySearch` - University discovery
- `ParentNoteForm` - Parent note management
- `StudentBinding` - Parent-student linking

### Key Patterns & Conventions

1. **API Error Handling**: Standardized 401/403 responses with JSON error messages
2. **Type Safety**: Full TypeScript coverage with shared types in `src/types/`
3. **Database Queries**: Prisma client with relationship includes for data fetching
4. **Permission Middleware**: `requirePermission()` and `requireRole()` functions for API protection
5. **JWT Lifecycle**: 7-day expiration with server-side verification

### Application States & Workflows

**Application Status Flow**:
NOT_STARTED → IN_PROGRESS → SUBMITTED → UNDER_REVIEW → DECIDED

**Decision Types**: ACCEPTED | REJECTED | WAITLISTED | DEFERRED

**Application Types**: EARLY_DECISION | EARLY_ACTION | REGULAR_DECISION | ROLLING_ADMISSION

**Requirement Types**: ESSAY | RECOMMENDATION | TRANSCRIPT | TEST_SCORES | PORTFOLIO | INTERVIEW | SUPPLEMENTAL_MATERIALS

## Environment Setup

Required environment variables in `.env`:
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
```

## Testing

The codebase includes comprehensive testing documentation in `TESTING_GUIDE.md` with role-based permission testing scenarios and API endpoint testing examples.