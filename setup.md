# Library Duty Assignment System - Setup Guide

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your system:

### Required Software:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Verify Installation:
```bash
node --version    # Should show v18+ 
npm --version     # Should show 9+
mysql --version   # Should show 8.0+
```

---

## 🗄️ Database Setup

### Step 1: Create Database
1. Start MySQL server
2. Connect to MySQL:
```bash
mysql -u root -p
```

3. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS schedule_management;
USE schedule_management;
```

4. Import the schema:
```bash
# From the project root directory
mysql -u root -p schedule_management < database_schema/schema.sql
```

5. Verify tables are created:
```sql
SHOW TABLES;
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
# Install production dependencies
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv helmet express-rate-limit joi

# Install development dependencies  
npm install -D nodemon @types/node
```

### Step 3: Environment Configuration
Create a `.env` file in the `backend` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=schedule_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_chars
JWT_EXPIRES_IN=24h

# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional - for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**⚠️ Important**: Replace `your_mysql_password_here` with your actual MySQL root password.

### Step 4: Create Required Files
Create the following directory structure in `backend/`:

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── services/
├── .env
├── server.js
└── package.json
```

### Step 5: Test Backend Server
```bash
# Start the development server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📊 Health check: http://localhost:5000/api/health
✅ Database connected successfully
```

### Step 6: Verify Backend Health
Visit: http://localhost:5000/api/health

Expected response:
```json
{
  "status": "OK",
  "message": "Library Duty System API is running",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd library-duty-system
```

### Step 2: Install Dependencies
```bash
# Install all frontend dependencies
npm install

# Verify React Router and form libraries are installed
npm install react-router-dom react-hook-form @hookform/resolvers zod bootstrap-icons
```

### Step 3: Install Additional UI Dependencies (if needed)
```bash
npm install framer-motion  # For animations (if not already installed)
```

### Step 4: Environment Configuration (Optional)
Create a `.env` file in the `library-duty-system` directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Library Duty Assignment System
VITE_APP_VERSION=1.0.0
```

### Step 5: Test Frontend Server
```bash
# Start the development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 6: Verify Frontend
Visit: http://localhost:5173

You should see the login interface with animated PS3 XMB-style background.

---

## 🚀 Running the Complete Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd library-duty-system  
npm run dev
```

### Option 2: Use Concurrent Running (Recommended)

Install concurrently in the project root:
```bash
# From Schedule_system directory (project root)
npm init -y
npm install -D concurrently
```

Add to `package.json` in root:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix library-duty-system\"",
    "start:backend": "npm run dev --prefix backend",
    "start:frontend": "npm run dev --prefix library-duty-system"
  }
}
```

Then run both with:
```bash
npm run dev
```

---

## 🧪 Testing the Setup

### 1. Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Frontend Access
- Visit: http://localhost:5173
- Try switching between Student/Teacher/Admin tabs
- Check if background colors change dynamically

### 3. Database Connection
- Backend logs should show "✅ Database connected successfully"
- No database connection errors in terminal

---

## 📁 Project Structure Overview

```
Schedule_system/
├── backend/                          # REST API Server
│   ├── src/
│   │   ├── config/database.js       # MySQL connection
│   │   ├── controllers/             # API endpoint logic
│   │   ├── middleware/              # Authentication, validation
│   │   ├── routes/                  # API routes
│   │   └── services/                # Business logic
│   ├── .env                         # Backend environment variables
│   ├── server.js                    # Express server entry point
│   └── package.json
├── library-duty-system/             # React Frontend
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── pages/                   # Page components (to be created)
│   │   ├── layouts/                 # Layout components (to be created)
│   │   ├── utils/                   # Utility functions
│   │   └── styles/                  # CSS and themes
│   ├── .env                         # Frontend environment variables
│   └── package.json
├── database_schema/                 # MySQL database files
│   ├── schema.sql                   # Main database structure
│   └── *.sql                        # Stored procedures
├── setup.md                         # This setup guide
└── todo.md                          # Development progress tracker
```

---

## 🛠️ Troubleshooting

### Common Issues:

#### 1. **Backend won't start - "Database connection failed"**
- Check if MySQL server is running
- Verify database credentials in `.env`
- Ensure `schedule_management` database exists
- Test connection: `mysql -u root -p schedule_management`

#### 2. **Frontend shows blank page**
- Check browser console for errors
- Verify Node.js version is 18+
- Try deleting `node_modules` and running `npm install` again

#### 3. **Port already in use**
- Backend: Change `PORT=5001` in `.env`
- Frontend: Use `npm run dev -- --port 5174`

#### 4. **CORS errors**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check if both servers are running on correct ports

#### 5. **"Cannot resolve module" errors**
- Run `npm install` in the respective directory
- Clear npm cache: `npm cache clean --force`

### Getting Help:
1. Check terminal logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure both MySQL and Node.js services are running
4. Check firewall settings for ports 3000, 5000, and 5173

---

## 📝 Next Steps After Setup

1. **✅ Verify both servers are running**
2. **✅ Test database connection**  
3. **✅ Check frontend UI loads correctly**
4. **🔄 Continue with authentication API development**
5. **🔄 Integrate frontend with backend APIs**

---

## 🎯 Development Workflow

### Daily Development:
```bash
# Start both servers
npm run dev

# Backend API: http://localhost:5000
# Frontend UI: http://localhost:5173
# Database: MySQL on localhost:3306
```

### Before Development:
1. Pull latest changes: `git pull`
2. Install any new dependencies: `npm install` (in both directories)
3. Check if database schema changed: Review `database_schema/`

---

**🎉 Setup Complete!** You're ready to continue with Phase 4.5.2: Authentication API Endpoints development.