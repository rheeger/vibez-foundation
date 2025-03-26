# Authentication Flow

This document outlines the authentication flow for the VIBEZ Foundation API, detailing how users register, log in, and access protected resources.

## Overview

The VIBEZ Foundation API uses a JWT (JSON Web Token) based authentication system. The authentication flow follows these steps:

1. User registers or logs in
2. Server validates credentials and issues a JWT token
3. Client stores the token
4. Client includes the token in subsequent API requests
5. Server validates the token and authorizes access

## Registration Process

New users can register with the following flow:

1. Client sends a POST request to `/api/auth/register` with user data:
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```

2. Server validates the request data
3. Server checks if the email is already registered
4. Server creates a new user account with a hashed password
5. Server generates and returns a JWT token:
   ```json
   {
     "success": true,
     "message": "User registered successfully",
     "data": {
       "user": {
         "id": "user-uuid",
         "email": "user@example.com",
         "firstName": "John",
         "lastName": "Doe",
         "isVerified": false
       },
       "token": "jwt-token-string"
     }
   }
   ```

## Login Process

Existing users can log in with:

1. Client sends a POST request to `/api/auth/login` with credentials:
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword"
   }
   ```

2. Server validates the credentials
3. If valid, server generates and returns a JWT token:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "user": {
         "id": "user-uuid",
         "email": "user@example.com",
         "firstName": "John",
         "lastName": "Doe",
         "profileImageUrl": "https://example.com/profile.jpg",
         "isVerified": true
       },
       "token": "jwt-token-string"
     }
   }
   ```

## Protected Routes Access

To access protected resources:

1. Client includes the JWT token in the Authorization header:
   ```
   Authorization: Bearer jwt-token-string
   ```

2. Server validates the token using the JWT middleware
3. If valid, the request is processed
4. If invalid or expired, a 401 Unauthorized response is returned

## User Profile Retrieval

Authenticated users can retrieve their profile information:

1. Client sends a GET request to `/api/auth/me` with the JWT token
2. Server returns the user's profile data:
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": "user-uuid",
         "email": "user@example.com",
         "firstName": "John",
         "lastName": "Doe",
         "profileImageUrl": "https://example.com/profile.jpg",
         "isVerified": true,
         "roles": ["user"]
       }
     }
   }
   ```

## Role-Based Authorization

The API supports role-based access control:

1. Users are assigned roles (e.g., "user", "admin")
2. Protected routes can require specific roles
3. The `validateRole` middleware checks if the user has the required role
4. If authorized, the request is processed
5. If unauthorized, a 403 Forbidden response is returned

## Token Structure

The JWT token contains:

- User ID
- Email
- Roles
- Expiration time

## Security Considerations

- JWT tokens are signed with a secret key
- Tokens expire after a configurable time period (default: 1 day)
- Passwords are hashed using bcrypt
- The API enforces HTTPS in production
- Token refresh mechanism will be implemented in future updates

## Implementation Details

The authentication system uses the following technologies:

- JWT for token generation and validation (jsonwebtoken)
- Passport for authentication middleware (passport, passport-jwt)
- Bcrypt for password hashing (bcrypt)
- Express validator for request validation (express-validator)

## Frontend Integration

Frontend applications should store the JWT token securely (e.g., HttpOnly cookies or localStorage) and include it in API requests. The token should be sent in the Authorization header as a Bearer token. 