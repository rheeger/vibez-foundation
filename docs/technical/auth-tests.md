# Authentication Endpoints Test Cases

This document outlines test cases for the authentication endpoints to ensure they function correctly.

## Registration Tests

### Valid Registration
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "Password123!",
    "firstName": "Jane",
    "lastName": "Doe"
  }
  ```
- **Expected Response**:
  - Status: 201 Created
  - Response contains user data (id, email, firstName, lastName) and a JWT token

### Invalid Email Format
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "invalid-email",
    "password": "Password123!",
    "firstName": "Jane",
    "lastName": "Doe"
  }
  ```
- **Expected Response**:
  - Status: 400 Bad Request
  - Error message indicating invalid email format

### Password Too Short
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "short",
    "firstName": "Jane",
    "lastName": "Doe"
  }
  ```
- **Expected Response**:
  - Status: 400 Bad Request
  - Error message indicating password is too short

### Missing Required Fields
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**:
  - Status: 400 Bad Request
  - Error message indicating missing required fields

### Email Already Exists
- **Endpoint**: `POST /api/auth/register`
- **Precondition**: User with email "existing@example.com" already exists
- **Request Body**:
  ```json
  {
    "email": "existing@example.com",
    "password": "Password123!",
    "firstName": "Jane",
    "lastName": "Doe"
  }
  ```
- **Expected Response**:
  - Status: 400 Bad Request
  - Error message indicating email is already registered

## Login Tests

### Valid Login
- **Endpoint**: `POST /api/auth/login`
- **Precondition**: User exists with email "user@example.com" and password "Password123!"
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**:
  - Status: 200 OK
  - Response contains user data and a JWT token

### Invalid Email
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "nonexistent@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**:
  - Status: 401 Unauthorized
  - Error message indicating invalid credentials

### Invalid Password
- **Endpoint**: `POST /api/auth/login`
- **Precondition**: User exists with email "user@example.com" and password "Password123!"
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "WrongPassword!"
  }
  ```
- **Expected Response**:
  - Status: 401 Unauthorized
  - Error message indicating invalid credentials

### Inactive Account
- **Endpoint**: `POST /api/auth/login`
- **Precondition**: User exists with email "inactive@example.com" but account is inactive
- **Request Body**:
  ```json
  {
    "email": "inactive@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**:
  - Status: 401 Unauthorized
  - Error message indicating account is inactive

## Profile Retrieval Tests

### Valid Token
- **Endpoint**: `GET /api/auth/me`
- **Headers**: 
  ```
  Authorization: Bearer <valid-jwt-token>
  ```
- **Expected Response**:
  - Status: 200 OK
  - Response contains user profile data

### Invalid Token
- **Endpoint**: `GET /api/auth/me`
- **Headers**: 
  ```
  Authorization: Bearer invalid-token
  ```
- **Expected Response**:
  - Status: 401 Unauthorized
  - Error message indicating invalid token

### Missing Token
- **Endpoint**: `GET /api/auth/me`
- **Headers**: No Authorization header
- **Expected Response**:
  - Status: 401 Unauthorized
  - Error message indicating missing token

### Expired Token
- **Endpoint**: `GET /api/auth/me`
- **Headers**: 
  ```
  Authorization: Bearer <expired-jwt-token>
  ```
- **Expected Response**:
  - Status: 401 Unauthorized
  - Error message indicating expired token 