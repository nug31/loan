# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Gudang Mitra is a professional 3D inventory management system with glassmorphism design. It's a full-stack React + Node.js application designed for inventory tracking, item requests, user management, and loan management with role-based access control.

**Live Demo**: https://gudang-mitra-app.netlify.app
**Backend**: Railway MySQL Database

## Architecture

### Full-Stack Structure
- **Frontend**: React 18 + TypeScript with Vite build tool
- **Backend**: Node.js Express server with Railway deployment
- **Database**: MySQL (Railway hosted) 
- **Styling**: Tailwind CSS with custom 3D effects and glassmorphism
- **Authentication**: Role-based (Admin/Manager/User) with bcrypt hashing

### Key Directories
- `/src` - React frontend application
- `/server` - Node.js backend API
- `/src/components` - Reusable UI components organized by feature
- `/src/pages` - Route-specific page components
- `/src/services` - API service layer for data fetching
- `/src/contexts` - React Context providers (AuthContext)
- `/src/utils` - Utility functions and helpers

### Authentication & Authorization
- Three user roles: `admin`, `manager`, `user`
- Managers and admins have elevated permissions
- Protected routes with role-based access control
- JWT-like session management via localStorage

## Common Development Commands

### Local Development Setup
```bash
# Install dependencies for both frontend and backend
npm install
cd server && npm install

# Start backend server (from server directory)
cd server
npm run dev

# Start frontend development server (from root)
npm run dev
```

### Build and Deploy
```bash
# Build frontend for production
npm run build

# Preview production build locally
npm run preview

# Lint frontend code
npm run lint

# Start production server
npm run start
```

### Database Operations
```bash
# Test database connection (from server directory)
cd server
node check-railway-db.cjs

# Check user data
node check-railway-users.cjs

# Import data to Railway
node import-to-railway.js
```

### Testing Specific Features
```bash
# Test authentication
node server/check-user-passwords.js

# Check request items
node server/check-request-items.js

# Verify table structure
node server/check-table-structure.js
```

## Development Environment

### Frontend Configuration
- **Vite Config**: Includes proxy setup for `/api` routes to `localhost:3002`
- **API URL**: Configured via `VITE_API_URL` environment variable
- **TypeScript**: Strict configuration with proper type definitions

### Backend Configuration
- **Main Server**: `server/railway-server.js`
- **Database Config**: Uses environment variables for Railway MySQL connection
- **OpenAI Integration**: AI chat feature (requires `OPENAI_API_KEY`)
- **CORS**: Configured for Netlify frontend and localhost development

### Environment Variables

**Frontend (.env.local)**:
```
VITE_API_URL=http://localhost:3002  # Development
VITE_API_URL=https://gudangmitra-production.up.railway.app/api  # Production
```

**Backend (.env.production)**:
```
DB_HOST=nozomi.proxy.rlwy.net
DB_PORT=21817
DB_USER=root
DB_PASSWORD=<railway-password>
DB_NAME=railway
DB_SSL=false
PORT=3002
NODE_ENV=production
CORS_ORIGIN=https://gudang-mitra-app.netlify.app
OPENAI_API_KEY=<openai-key>  # Optional for AI chat
```

## Key Patterns and Architecture Decisions

### Service Layer Architecture
All API interactions are abstracted through service classes in `/src/services`:
- `itemService.ts` - Item management
- `requestService.ts` - Request handling
- `userService.ts` - User management
- `loanService.ts` - Equipment loans
- `dashboardService.ts` - Dashboard data

### Component Organization
Components are organized by feature domain:
- `/auth` - Login, registration forms
- `/dashboard` - Dashboard statistics and widgets
- `/inventory` - Item management components
- `/ui` - Reusable UI components (Card, Button, Input, etc.)
- `/layout` - Layout components (Navbar, MainLayout)

### State Management
- **Authentication**: Context API via `AuthContext.tsx`
- **Component State**: React hooks for local state
- **API State**: Service layer with proper error handling

### Styling Philosophy
- **Glassmorphism Design**: Semi-transparent elements with backdrop blur
- **3D Effects**: Custom shadows, animations, and transforms
- **Professional Theme**: Primary (indigo), secondary (teal), accent (orange) colors
- **Responsive Design**: Mobile-first approach with Tailwind utilities

## Database Schema

### Core Tables
- `users` - User accounts with roles
- `items` - Inventory items with categories
- `requests` - Item requests with approval workflow
- `request_items` - Join table for request-item relationships
- `loans` - Equipment borrowing system
- `categories` - Dynamic item categories

### Important Relationships
- Users can create multiple requests
- Requests can contain multiple items (many-to-many via request_items)
- Items belong to categories
- Loans track borrowed equipment

## Testing and Quality Assurance

### Test Accounts
- **Manager**: manager@gudangmitra.com / password123
- **User**: bob@gudangmitra.com / password123

### API Testing Endpoints
- `GET /api/test-connection` - Test database connectivity
- `POST /api/auth/login` - Test authentication
- `GET /api/items` - Test item retrieval

## Deployment Architecture

### Frontend (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Environment: `VITE_API_URL` pointing to Railway backend

### Backend (Railway)
- Root directory: `server`
- Start command: `node railway-server.js`
- MySQL database integration
- Environment variables for database connection

### Database (Railway MySQL)
- Hosted MySQL instance
- Connection pooling with 10 concurrent connections
- SSL disabled for Railway compatibility

## Common Issues and Solutions

### Database Connection Issues
```bash
# Check database connectivity
cd server && node check-railway-db.cjs

# Verify environment variables are loaded
node -e "require('dotenv').config({path: '.env.production'}); console.log(process.env.DB_HOST)"
```

### Frontend-Backend Communication
- Ensure CORS_ORIGIN matches your frontend URL
- Verify VITE_API_URL is correctly set
- Check network tab for API call failures

### Authentication Problems
- Check user exists in database: `node server/check-railway-users.cjs`
- Verify password hashing: `node server/check-user-passwords.js`
- Clear localStorage if token is corrupted

## Performance Considerations

### Frontend Optimization
- Vite's optimizeDeps excludes `lucide-react` for better performance
- React.StrictMode enabled for development
- Component lazy loading for better initial load

### Backend Optimization
- Database connection pooling (limit: 10)
- Prepared statements for SQL queries
- CORS optimization for specific origins

### Database Optimization
- Proper indexing on user emails and item IDs
- Connection pooling to prevent connection exhaustion
- Query logging for debugging

## AI Chat Feature

The application includes an optional bilingual AI chat system:
- Uses OpenAI GPT-3.5-turbo model
- Supports Indonesian and English
- Requires OPENAI_API_KEY environment variable
- See OPENAI_SETUP.md for detailed configuration

## Sticky Navbar Implementation

The application features a professional sticky navbar that remains visible during scroll:

### Key Features
- **Sticky Positioning**: Uses `position: sticky` with enhanced CSS for cross-browser support
- **Scroll Effects**: Transitions background blur and shadow on scroll
- **Performance Optimized**: Uses `requestAnimationFrame` throttling for smooth scroll detection
- **Visual Feedback**: Changes opacity, blur, and shadow when scrolled

### CSS Classes
- `.sticky-navbar` - Main sticky positioning class with hardware acceleration
- Custom CSS includes `will-change`, `backface-visibility`, and `transform` optimizations

### Testing
The sticky navbar can be tested on any page with sufficient content to scroll, such as the main dashboard or inventory pages.

## Important Notes

- The system supports dynamic item categories loaded from database
- Password authentication supports both plain text and bcrypt hashes
- The application maintains user sessions via localStorage
- All API endpoints are prefixed with `/api`
- Railway deployment requires specific environment variable configuration
- The frontend uses a proxy in development to avoid CORS issues
- Sticky navbar includes performance optimizations for smooth scrolling
