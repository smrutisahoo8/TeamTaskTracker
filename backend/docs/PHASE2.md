# Team Task Tracker - Phase 2: Authentication & RBAC

## Overview

Phase 2 implements complete authentication and role-based access control (RBAC) foundation using:
- JWT (JSON Web Tokens)
- Refresh Token Rotation
- bcrypt password hashing
- Database-first approach with SQL Server
- Express validators for request validation
- Repository pattern for data access

## Architecture

### Database Layer
- **Repository Pattern**: `UserRepository`, `RefreshTokenRepository`
- **Parameterized Queries**: All SQL queries use parameterized inputs to prevent SQL injection
- **Connection Pooling**: Managed MSSQL connection pool with configurable limits

### Authentication Flow

1. **Register**: POST `/api/auth/register`
   - Create user with hashed password
   - Default role: MEMBER
   - Email validation and uniqueness check

2. **Login**: POST `/api/auth/login`
   - Validate credentials
   - Generate access token (15 minutes)
   - Generate refresh token (7 days)
   - Store refresh token in database

3. **Refresh**: POST `/api/auth/refresh`
   - Validate refresh token
   - Revoke old token (refresh token rotation)
   - Issue new access + refresh tokens

4. **Logout**: POST `/api/auth/logout`
   - Revoke refresh token
   - Prevents token reuse

### Middleware

- **authenticate.ts**: Validates Bearer token, extracts JWT payload
- **authorize.ts**: RBAC middleware for role-based endpoint protection
- **error.middleware.ts**: Global error handling
- **logger.middleware.ts**: Request logging

### JWT Payload
```json
{
  "userId": 1,
  "organizationId": 1,
  "role": "MANAGER"
}
```

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts         // MSSQL connection pool
│   │   ├── index.ts            // Environment config
│   │   ├── swagger.ts          // Swagger documentation
│   │   └── redis.ts
│   ├── controllers/
│   │   └── auth.controller.ts  // Authentication handlers
│   ├── repositories/
│   │   ├── UserRepository.ts
│   │   └── RefreshTokenRepository.ts
│   ├── services/
│   │   └── AuthService.ts      // Business logic
│   ├── routes/
│   │   └── auth.routes.ts      // Authentication endpoints
│   ├── middleware/
│   │   ├── authenticate.ts     // JWT validation
│   │   ├── authorize.ts        // RBAC
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── validators/
│   │   └── auth.validator.ts   // Request validation
│   ├── interfaces/
│   │   └── domain.interface.ts // TypeScript types
│   ├── utils/
│   │   ├── jwt.ts              // Token generation/verification
│   │   ├── bcrypt.ts           // Password hashing
│   │   └── response.util.ts    // Standard response format
│   ├── constants/
│   │   ├── http.constants.ts
│   │   └── roles.constants.ts
│   └── app.ts
├── tests/
│   ├── health.test.ts
│   └── auth.test.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
PORT=4000
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=TeamTaskTrackerDB
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd

JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 2. Database Setup
Ensure SQL Server has these tables (database-first approach):
- Organizations
- Users
- Projects
- Tasks
- RefreshTokens

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access Swagger Documentation
```
http://localhost:4000/api/docs
```

## API Endpoints

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "organizationId": 1
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "MEMBER",
    "organizationId": 1
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "MEMBER",
      "organizationId": 1
    }
  }
}
```

### Refresh Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

### Logout
```bash
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200)**
```json
{
  "success": true,
  "data": null
}
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

Example: `Password123!`

## Token Expiry

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

## RBAC Usage

### Protect Admin-only Endpoint
```typescript
import { authorize } from './middleware/authorize';

router.post('/admin/users', authenticate, authorize(['ADMIN']), controller);
```

### Allow Multiple Roles
```typescript
router.patch('/projects/:id', 
  authenticate, 
  authorize(['ADMIN', 'MANAGER']), 
  controller
);
```

## Testing

Run test suite:
```bash
npm test
```

Tests cover:
- User registration with validation
- User login with password verification
- JWT generation and validation
- Refresh token rotation
- Logout and token revocation

## Error Response Format

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Security Best Practices

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **Token Rotation**: Old refresh token revoked when new one issued
3. **Parameterized Queries**: Prevents SQL injection
4. **Bearer Token**: Authorization header only, no query params
5. **HTTPS**: Use in production
6. **Secure Secrets**: Keep JWT secrets in environment variables

## Next Steps (Phase 3)

- Task management endpoints
- Project CRUD operations
- Team collaboration features
- Activity logging
- Advanced filtering and search
