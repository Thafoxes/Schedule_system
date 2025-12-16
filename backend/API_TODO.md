# Backend API Development - Authentication System

## 🎯 **Project Goal**
Create REST API endpoints to connect the existing React frontend authentication system with MySQL database using the existing SQL procedures. Focus on login/register functionality only - dashboard features will be handled by other developers.

## 📊 **Current Status**
- ✅ Frontend authentication UI complete (LoginForm, RegisterForm)
- ✅ Database schema and SQL procedures exist
- ✅ Backend project structure created
- 🔄 **Currently Working On**: REST API Implementation

---

## 🔧 **Phase 1: Basic Server Setup**

### 1.1 Core Server Configuration
- [x] Install required npm packages (express, mysql2, bcrypt, etc.)
- [X] Create main server.js file
- [X] Set up environment configuration (.env)
- [X] Create database connection configuration
- [X] Test basic server startup and health endpoint

### 1.2 Security & Middleware Setup
- [X] Configure CORS for frontend communication
- [X] Set up rate limiting for API protection
- [X] Add request validation middleware
- [X] Implement security headers (helmet)
- [X] Set up JSON body parsing

---

## 🗄️ **Phase 2: Database Integration**

### 2.1 Database Connection Setup
- [ ] Create MySQL connection pool
- [ ] Test database connectivity
- [ ] Add connection error handling
- [ ] Set up database query utilities

### 2.2 SQL Procedures Integration
- [ ] **Student Registration**: Connect to `procedure_create_student_account.sql`
- [ ] **Teacher Registration**: Connect to `procedure_create_teacher_account.sql`
- [ ] **Admin Registration**: Connect to `procedure_create_it_account.sql`
- [ ] **User Profile Retrieval**: 
  - [ ] `p_view_student_account_by_id.sql`
  - [ ] `p_view_teacher_account_by_id.sql`
  - [ ] `p_view_itstaff_by_id.sql`
- [ ] **User Authentication**: Query existing user tables for login validation

---

## 🔐 **Phase 3: Authentication API Endpoints**

### 3.1 User Registration API
**Endpoint**: `POST /api/auth/register`

**Tasks**:
- [ ] Create registration controller
- [ ] Add input validation (email, password, role, etc.)
- [ ] Hash passwords using bcrypt
- [ ] Call appropriate SQL procedure based on role:
  - [ ] Student → `procedure_create_student_account.sql`
  - [ ] Teacher → `procedure_create_teacher_account.sql` 
  - [ ] Admin → `procedure_create_it_account.sql` (restricted)
- [ ] Handle duplicate email validation
- [ ] Return appropriate success/error responses
- [ ] Add registration validation rules

**Expected Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@graduate.utm.my",
  "password": "SecurePass123",
  "role": "student",
  "studentId": "A12CS1234" // for students only
}
```

### 3.2 User Login API
**Endpoint**: `POST /api/auth/login`

**Tasks**:
- [ ] Create login controller
- [ ] Validate email and password format
- [ ] Query database for user credentials
- [ ] Compare hashed passwords using bcrypt
- [ ] Generate JWT tokens upon successful login
- [ ] Handle "Remember Me" functionality (longer token expiry)
- [ ] Return user profile data and role
- [ ] Add login attempt rate limiting

**Expected Request Body**:
```json
{
  "email": "john.doe@graduate.utm.my",
  "password": "SecurePass123",
  "rememberMe": true
}
```

**Expected Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@graduate.utm.my",
    "role": "student",
    "studentId": "A12CS1234"
  }
}
```

### 3.3 User Profile API
**Endpoint**: `GET /api/auth/me`

**Tasks**:
- [ ] Create JWT authentication middleware
- [ ] Extract user ID from JWT token
- [ ] Call appropriate view procedure based on user role:
  - [ ] Student → `p_view_student_account_by_id.sql`
  - [ ] Teacher → `p_view_teacher_account_by_id.sql`
  - [ ] Admin → `p_view_itstaff_by_id.sql`
- [ ] Return current user profile data
- [ ] Handle invalid/expired tokens

### 3.4 User Logout API
**Endpoint**: `POST /api/auth/logout`

**Tasks**:
- [ ] Create logout controller
- [ ] Implement token blacklisting (optional)
- [ ] Clear any server-side session data
- [ ] Return success response

---

## 🛡️ **Phase 4: Security & Validation**

### 4.1 Input Validation
- [ ] Email format validation
- [ ] Password strength requirements
- [ ] Role validation (student/teacher/admin)
- [ ] Student ID format validation
- [ ] XSS protection and input sanitization

### 4.2 Authentication Security
- [ ] JWT token generation and verification
- [ ] Password hashing with bcrypt (salt rounds: 12)
- [ ] Rate limiting for auth endpoints (5 attempts/minute)
- [ ] CSRF protection setup
- [ ] Secure environment variable management

### 4.3 Error Handling
- [ ] Standardized API error responses
- [ ] Database error handling
- [ ] JWT token error handling
- [ ] Validation error formatting
- [ ] Logging for debugging and monitoring

---

## 🔗 **Phase 5: Frontend Integration**

### 5.1 Frontend Service Layer
- [ ] Create API service functions in frontend
- [ ] Set up Axios HTTP client configuration
- [ ] Add JWT token storage (localStorage/sessionStorage)
- [ ] Implement automatic token attachment to requests

### 5.2 Replace Mock Data
- [ ] Connect LoginForm to real `/api/auth/login` endpoint
- [ ] Connect RegisterForm to real `/api/auth/register` endpoint
- [ ] Update dashboard user data to use `/api/auth/me` endpoint
- [ ] Add real API error handling and user feedback

### 5.3 Authentication Flow
- [ ] Implement login success → dashboard navigation
- [ ] Add token expiry handling and auto-logout
- [ ] Handle registration success → auto-login flow
- [ ] Add loading states during API calls
- [ ] Implement proper error messages from API

---

## 📋 **Phase 6: Testing & Documentation**

### 6.1 API Testing
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Test with valid and invalid data
- [ ] Test error scenarios (wrong password, duplicate email, etc.)
- [ ] Test JWT token generation and verification
- [ ] Test database connection and SQL procedure calls

### 6.2 Frontend-Backend Integration Testing
- [ ] Test complete registration flow (frontend → API → database)
- [ ] Test complete login flow (frontend → API → database)  
- [ ] Test dashboard user data loading
- [ ] Test logout functionality
- [ ] Test token expiry and renewal

---

## 🚀 **Deployment Preparation**

### 6.1 Environment Setup
- [ ] Production environment variables
- [ ] Database connection for production
- [ ] CORS configuration for production frontend URL
- [ ] Security headers for production

### 6.2 Documentation for Handover
- [ ] API endpoint documentation
- [ ] Database integration guide  
- [ ] Frontend service layer documentation
- [ ] Deployment instructions
- [ ] Environment variable reference

---

## 📝 **Current Working Files**

### Backend Files to Create:
```
backend/
├── .env                          # Environment configuration
├── server.js                     # Main Express server
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection setup
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── validation.js        # Input validation
│   ├── routes/
│   │   └── auth.js              # Auth route definitions
│   └── services/
│       └── authService.js       # Business logic
```

### Frontend Files to Update:
```
library-duty-system/src/
├── services/
│   └── api.js                   # API service layer
├── utils/
│   └── auth.js                  # Authentication utilities
└── components/forms/
    ├── LoginForm.tsx            # Connect to real API
    └── RegisterForm.tsx         # Connect to real API
```

---

## 🎯 **Success Criteria**

### ✅ **Complete Success When**:
1. User can register through frontend form → data saves to MySQL database
2. User can login with registered credentials → receives JWT token
3. User profile loads correctly in dashboard from database
4. User can logout and token is invalidated
5. All SQL procedures are integrated and working
6. Frontend completely replaced mock data with real API calls

### 🔄 **Ready for Handover When**:
- Authentication system is fully functional
- API documentation is complete
- Frontend integration is working
- Backend team can extend API for dashboard features

---

**Next Action**: Start with Phase 1.1 - Create basic server.js and .env configuration files.