# Loan Management System

A comprehensive loan management system built with React (TypeScript) frontend and Node.js backend with PostgreSQL database.

**Latest Update**: Implemented role-based notification filtering system with real-time updates and improved user experience.

## Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access control (Admin/User)
- Secure session management

### 📊 Dashboard
- Real-time statistics and analytics
- Quick overview of loans, items, and users
- Interactive charts and metrics

### 📦 Item Management
- Complete item catalog with categories
- Item condition tracking
- Quantity management
- Image and tag support
- Search and filter functionality

### 🏦 Loan Management
- Loan request system
- Approval workflow
- Return tracking
- Overdue notifications
- Loan history

### 🔔 Smart Notification System
- Role-based notification filtering
- Real-time notification updates
- Bell icon with unread count badge
- Dismiss and clear all functionality
- Mobile-responsive notification panel

### 👥 User Management (Admin)
- User registration approval
- Role assignment
- User activity monitoring

### 📅 Calendar Integration
- Visual loan scheduling
- Availability tracking
- Conflict detection

### 📈 Analytics & Reporting
- Usage statistics
- Popular items tracking
- User activity reports
- Export functionality

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Sequelize** ORM
- **CORS** enabled
- RESTful API design

## 📚 Documentation

**📋 User Guides:**
- **[📖 Complete User Guide](./USER_GUIDE.md)** - Comprehensive guide for all users
- **[📋 Borrowing Guide](./BORROWING_GUIDE.md)** - Detailed guide for users who want to borrow items
- **[📸 Visual Borrowing Tutorial](./VISUAL_BORROWING_TUTORIAL.md)** - Step-by-step visual guide for beginners

**🔧 Setup & Development:**
- **[🔧 Installation Guide](./INSTALLATION_GUIDE.md)** - Detailed step-by-step installation instructions
- **[⚡ Quick Start](./QUICK_START.md)** - Quick setup guide for experienced developers
- **[🤝 Contributing Guide](./CONTRIBUTING.md)** - Guidelines for contributing to the project

**📖 Technical Documentation:**
- **[🔔 Role-Based Notifications](./ROLE_BASED_NOTIFICATIONS.md)** - Documentation about notification system

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/nug31/loan.git
cd loan
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/loan_db
PORT=3002
```

### 3. Frontend Setup
```bash
# From project root
npm install
```

### 4. Database Setup
The application will automatically create tables and seed sample data on first run.

### 5. Running the Application

#### Start Backend (Terminal 1):
```bash
cd backend
node server-pg.js
```

#### Start Frontend (Terminal 2):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002

## Default Users

The system comes with pre-seeded users:

### Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin

### Regular User
- **Email**: john.doe@example.com
- **Password**: user123
- **Role**: User

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item (Admin)
- `PUT /api/items/:id` - Update item (Admin)
- `DELETE /api/items/:id` - Delete item (Admin)

### Loans
- `GET /api/loans` - Get user loans
- `POST /api/loans` - Create loan request
- `PUT /api/loans/:id` - Update loan status
- `DELETE /api/loans/:id` - Cancel loan

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Notifications
- `GET /api/notifications` - Get role-based notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/clear-all` - Clear all notifications

## Project Structure

```
loan/
├── backend/
│   ├── server-pg.js          # Main server file
│   ├── src/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   └── seeders/          # Database seeders
│   └── package.json
├── src/
│   ├── components/           # React components
│   │   ├── Admin/           # Admin-only components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Layout/          # Layout components
│   │   └── ...
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── package.json
```

## Contributing

We welcome contributions from the community! Please read our [**Contributing Guide**](./CONTRIBUTING.md) for detailed information on how to contribute to this project.

**Quick contributing steps:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request

For detailed guidelines, development setup, and coding standards, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.
