# Quick Start Guide

## 🚀 For Experienced Developers

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Git

### Quick Setup
```bash
# 1. Clone and install
git clone https://github.com/nug31/loan.git
cd loan
npm install
cd backend && npm install && cd ..

# 2. Setup database
createdb loan_db  # Or use your preferred method

# 3. Configure environment
cd backend
cp .env.example .env
# Edit .env with your database credentials

# 4. Start servers
# Terminal 1 - Backend
cd backend
node server-pg.js

# Terminal 2 - Frontend  
npm run dev
```

### Default Access
- **App**: http://localhost:3000
- **API**: http://localhost:3002
- **Admin**: admin@example.com / admin123
- **User**: john.doe@example.com / user123

### Key Features Test
1. **Login** with default credentials
2. **Catalog** - Browse available items
3. **Request Loan** - Submit loan request
4. **Notifications** - Check bell icon
5. **Admin Panel** - Manage items, users, loans

### API Endpoints
```
GET    /api/dashboard/stats     # Dashboard stats
GET    /api/items               # Items catalog
POST   /api/loans               # Create loan request
GET    /api/notifications       # Role-based notifications
```

### Troubleshooting
- **Port conflicts**: Change PORT in .env (backend) or use --port flag (frontend)
- **DB connection**: Check DATABASE_URL in .env
- **CORS issues**: Ensure both servers are running

### Project Structure
```
loan/
├── backend/          # Node.js + Express API
├── src/              # React frontend
├── public/           # Static assets
└── package.json      # Frontend dependencies
```

Need help? Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) or [USER_GUIDE.md](./USER_GUIDE.md)
