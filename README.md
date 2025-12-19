# Schedule Management System

A full-stack web application for managing library duty schedules and user accounts. Built with React/TypeScript on the frontend and Node.js/Express on the backend, with MySQL as the database.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Scripts](#scripts)

## ✨ Features

- **User Management**: Support for multiple user roles (Student, Teacher, IT Staff, Admin)
- **Authentication**: JWT-based authentication with secure password hashing
- **Schedule Management**: Library duty scheduling system
- **Account Management**: User profile updates and role management
- **Security**: Rate limiting, CORS protection, and helmet security headers
- **Form Validation**: Client and server-side validation using Zod and Joi

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Hook Form** - Efficient form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Bootstrap Icons** - Icon library
- **Vitest** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Database
- **MySQL** - Relational database
- **Stored Procedures** - Database operations

## 📁 Project Structure

```
Schedule_system/
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database connection and queries
│   │   ├── controllers/
│   │   │   └── authentication.js    # Auth logic
│   │   ├── middleware/              # Custom middleware
│   │   ├── routes/
│   │   │   └── routes.js            # API routes
│   │   ├── services/                # Business logic
│   │   └── utils/
│   │       └── jwt.js               # JWT utilities
│   ├── postman/                     # Postman collections
│   ├── .env.example                 # Environment variables template
│   └── server.js                    # Entry point
│
├── frontend/                         # React frontend
│   └── library-duty-system/
│       ├── src/
│       │   ├── components/          # Reusable components
│       │   ├── pages/               # Page components
│       │   ├── context/             # React context (Auth)
│       │   ├── services/            # API services
│       │   ├── utils/               # Utility functions
│       │   ├── types/               # TypeScript types
│       │   ├── App.tsx              # Main app component
│       │   └── main.tsx             # Entry point
│       ├── public/                  # Static assets
│       └── vite.config.ts           # Vite configuration
│
└── database_schema/                 # SQL files
    ├── schema.sql                   # Database schema
    ├── procedure_create_*.sql       # Account creation procedures
    ├── p_update_*.sql               # Update procedures
    ├── p_view_*.sql                 # View procedures
    └── p_*.sql                      # Other stored procedures
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Schedule_system
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Setup Frontend

```bash
cd ../frontend/library-duty-system
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```dotenv
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=schedule_management

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
```

**Environment Variables Explanation:**
- `DB_HOST`: MySQL server hostname
- `DB_PORT`: MySQL server port (default: 3306)
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for signing JWT tokens (use a long, random string in production)
- `JWT_EXPIRES_IN`: Token expiration time
- `NODE_ENV`: Environment (development/production)
- `PORT`: Backend server port
- `FRONTEND_URL`: Frontend URL for CORS
- `BCRYPT_ROUNDS`: Number of rounds for password hashing

## 🗄️ Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE schedule_management;
USE schedule_management;
```

### 2. Import Database Schema

```bash
# From the project root
mysql -u root -p schedule_management < database_schema/schema.sql
```

### 3. Create Stored Procedures

Run the SQL files in the following order:

```bash
mysql -u root -p schedule_management < database_schema/procedure_create_student_account.sql
mysql -u root -p schedule_management < database_schema/procedure_create_teacher_account.sql
mysql -u root -p schedule_management < database_schema/procedure_create_it_account.sql
mysql -u root -p schedule_management < database_schema/p_update_student_profile.sql
mysql -u root -p schedule_management < database_schema/p_update_teacher_profile.sql
mysql -u root -p schedule_management < database_schema/p_update_user.sql
mysql -u root -p schedule_management < database_schema/p_alter_user_password.sql
mysql -u root -p schedule_management < database_schema/p_change_user_role.sql
mysql -u root -p schedule_management < database_schema/p_view_student_acc.sql
mysql -u root -p schedule_management < database_schema/p_view_teacher_account_by_id.sql
mysql -u root -p schedule_management < database_schema/p_view_student_account_by_id.sql
mysql -u root -p schedule_management < database_schema/p_view_all_teacher_acc.sql
mysql -u root -p schedule_management < database_schema/p_view_itstaff_by_id.sql
```

Or import all at once:

```bash
mysql -u root -p schedule_management < database_schema/*.sql
```

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend/library-duty-system
npm run dev
```

The frontend will start on `http://localhost:5173`

### Build for Production

**Frontend:**
```bash
cd frontend/library-duty-system
npm run build
```

**Backend:**
No build step required, ready to deploy with `npm start` or similar.

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### User Management Endpoints

- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile
- `GET /api/teachers` - Get all teachers
- `GET /api/students` - Get all students

### Schedule Endpoints

*(To be documented in API_TODO.md)*

For detailed API documentation, refer to the Postman collections in `backend/postman/collections/`

## 🧪 Testing

### Frontend Tests

```bash
cd frontend/library-duty-system

# Run tests
npm test

# Run tests with UI
npm test:ui
```

### Linting and Formatting

```bash
cd frontend/library-duty-system

# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 📝 Scripts

### Backend Scripts

```bash
npm run dev      # Start development server with auto-reload (nodemon)
npm test         # Start server
```

### Frontend Scripts

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run unit tests (Vitest)
npm test:ui      # Run tests with UI dashboard
npm run lint     # Check code quality
npm run lint:fix # Fix linting issues
npm run format   # Format code with Prettier
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with 12 rounds
- **CORS** - Restricted cross-origin requests
- **Helmet** - HTTP security headers
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Server-side validation with Joi
- **HTTPS Ready** - Compatible with HTTPS deployment

## 📧 Environment Best Practices

- Never commit `.env` files to version control
- Use strong, random values for `JWT_SECRET` in production
- Keep `BCRYPT_ROUNDS` at 12 or higher
- Adjust rate limits based on production needs
- Use environment-specific configurations

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## 📄 License

ISC

## 📞 Support

For issues or questions, refer to the API_TODO.md and setup.md files for additional context.

---

**Last Updated:** December 2025
