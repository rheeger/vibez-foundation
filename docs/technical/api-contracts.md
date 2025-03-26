# 🌴 VIBEZ FOUNDATION: API Contracts for Frontend 🏝️

This document outlines the API contracts between the VIBEZ FOUNDATION backend and frontend.

## 📝 API Overview

| Base URL                  | Environment |
|---------------------------|-------------|
| `http://localhost:3001/api` | Development |
| `https://api.vibezfoundation.org/api` | Production |

All API endpoints follow these conventions:
- REST architecture
- JSON request/response format
- Bearer token authentication
- Versioned endpoints (/api/v1/...)
- Consistent error formats

## 👤 Authentication API

### Register User

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false,
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "meta": {
    "tokens": {
      "accessToken": "jwt-token-here",
      "expiresIn": 900 // 15 minutes in seconds
    }
  }
}
```

### Login User

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "https://example.com/profile.jpg",
    "isVerified": true
  },
  "meta": {
    "tokens": {
      "accessToken": "jwt-token-here",
      "expiresIn": 900 // 15 minutes in seconds
    }
  }
}
```

### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**
*Uses HTTP-only refresh token cookie*

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token-here",
    "expiresIn": 900 // 15 minutes in seconds
  }
}
```

### Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "https://example.com/profile.jpg",
    "bio": "Passionate philanthropist",
    "isVerified": true,
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

## 💰 Funds API

### List User Funds

**Endpoint:** `GET /api/v1/funds`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort`: Sort field and direction (e.g., `createdAt:desc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
      "name": "Ocean Conservation Fund",
      "description": "Supporting ocean cleanup initiatives",
      "imageUrl": "https://example.com/ocean.jpg",
      "goalAmount": 10000,
      "raisedAmount": 3500,
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-2345678901bc",
      "name": "Coral Reef Protection",
      "description": "Preserving coral reef ecosystems",
      "imageUrl": "https://example.com/coral.jpg",
      "goalAmount": 5000,
      "raisedAmount": 1200,
      "isActive": true,
      "createdAt": "2023-01-15T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### Get Fund Details

**Endpoint:** `GET /api/v1/funds/:id`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "name": "Ocean Conservation Fund",
    "description": "Supporting ocean cleanup initiatives",
    "imageUrl": "https://example.com/ocean.jpg",
    "goalAmount": 10000,
    "raisedAmount": 3500,
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-10T00:00:00Z",
    "creator": {
      "id": "user-id-here",
      "name": "John Doe"
    },
    "organizations": [
      {
        "id": "org-id-1",
        "name": "Ocean Cleanup Foundation",
        "allocationPercentage": 60
      },
      {
        "id": "org-id-2",
        "name": "Marine Conservation Society",
        "allocationPercentage": 40
      }
    ]
  }
}
```

### Create Fund

**Endpoint:** `POST /api/v1/funds`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request:**
```json
{
  "name": "Coral Reef Protection",
  "description": "Preserving coral reef ecosystems around tropical islands",
  "imageUrl": "https://example.com/coral.jpg",
  "goalAmount": 5000,
  "organizations": [
    {
      "id": "org-id-1",
      "allocationPercentage": 100
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "b2c3d4e5-f6g7-8901-bcde-2345678901bc",
    "name": "Coral Reef Protection",
    "description": "Preserving coral reef ecosystems around tropical islands",
    "imageUrl": "https://example.com/coral.jpg",
    "goalAmount": 5000,
    "raisedAmount": 0,
    "isActive": true,
    "createdAt": "2023-01-15T00:00:00Z",
    "updatedAt": "2023-01-15T00:00:00Z",
    "endaomentFundId": "endaoment-fund-id-here"
  }
}
```

### Update Fund

**Endpoint:** `PATCH /api/v1/funds/:id`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request:**
```json
{
  "name": "Updated Coral Reef Protection",
  "description": "Updated description",
  "imageUrl": "https://example.com/updated-coral.jpg",
  "goalAmount": 7500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "b2c3d4e5-f6g7-8901-bcde-2345678901bc",
    "name": "Updated Coral Reef Protection",
    "description": "Updated description",
    "imageUrl": "https://example.com/updated-coral.jpg",
    "goalAmount": 7500,
    "raisedAmount": 1200,
    "isActive": true,
    "updatedAt": "2023-01-20T00:00:00Z"
  }
}
```

### Delete Fund

**Endpoint:** `DELETE /api/v1/funds/:id`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Fund successfully deleted"
  }
}
```

## 🏢 Organizations API

### List Organizations

**Endpoint:** `GET /api/v1/organizations`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `q`: Search query
- `cause`: Filter by cause
- `sort`: Sort field and direction (e.g., `name:asc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
      "name": "Ocean Cleanup Foundation",
      "description": "Developing technologies to rid the oceans of plastic",
      "ein": "12-3456789",
      "imageUrl": "https://example.com/ocean-cleanup.jpg",
      "website": "https://example.com",
      "cause": "Environment",
      "isVerified": true
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-2345678901bc",
      "name": "Marine Conservation Society",
      "description": "Protecting marine wildlife and habitats",
      "ein": "98-7654321",
      "imageUrl": "https://example.com/marine-conservation.jpg",
      "website": "https://example.com",
      "cause": "Environment",
      "isVerified": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### Get Organization Details

**Endpoint:** `GET /api/v1/organizations/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "name": "Ocean Cleanup Foundation",
    "description": "Developing technologies to rid the oceans of plastic",
    "ein": "12-3456789",
    "imageUrl": "https://example.com/ocean-cleanup.jpg",
    "website": "https://example.com",
    "cause": "Environment",
    "isVerified": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "endaomentOrgId": "endaoment-org-id-here"
  }
}
```

## 💸 Donations API

### Make Donation

**Endpoint:** `POST /api/v1/donations`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request:**
```json
{
  "amount": 100,
  "fundId": "fund-id-here",
  "message": "Keep up the great work!",
  "isAnonymous": false,
  "paymentDetails": {
    "paymentMethodId": "payment-method-id"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "amount": 100,
    "status": "pending",
    "message": "Keep up the great work!",
    "isAnonymous": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "fund": {
      "id": "fund-id-here",
      "name": "Ocean Conservation Fund"
    },
    "transactionId": "transaction-id-here"
  }
}
```

### List User Donations

**Endpoint:** `GET /api/v1/donations`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `status`: Filter by status (pending, completed, failed)
- `sort`: Sort field and direction (e.g., `createdAt:desc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
      "amount": 100,
      "status": "completed",
      "message": "Keep up the great work!",
      "isAnonymous": false,
      "createdAt": "2023-01-01T00:00:00Z",
      "fund": {
        "id": "fund-id-here",
        "name": "Ocean Conservation Fund"
      }
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-2345678901bc",
      "amount": 50,
      "status": "pending",
      "isAnonymous": true,
      "createdAt": "2023-01-15T00:00:00Z",
      "organization": {
        "id": "org-id-here",
        "name": "Marine Conservation Society"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### Get Donation Details

**Endpoint:** `GET /api/v1/donations/:id`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "amount": 100,
    "status": "completed",
    "message": "Keep up the great work!",
    "isAnonymous": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:05:00Z",
    "fund": {
      "id": "fund-id-here",
      "name": "Ocean Conservation Fund"
    },
    "transactionId": "transaction-id-here"
  }
}
```

## ⭐ Favorites API

### Add Favorite

**Endpoint:** `POST /api/v1/favorites`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request:**
```json
{
  "fundId": "fund-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "createdAt": "2023-01-01T00:00:00Z",
    "fundId": "fund-id-here"
  }
}
```

### List User Favorites

**Endpoint:** `GET /api/v1/favorites`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
      "createdAt": "2023-01-01T00:00:00Z",
      "fund": {
        "id": "fund-id-here",
        "name": "Ocean Conservation Fund",
        "description": "Supporting ocean cleanup initiatives",
        "imageUrl": "https://example.com/ocean.jpg"
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Remove Favorite

**Endpoint:** `DELETE /api/v1/favorites/:id`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Favorite successfully removed"
  }
}
```

## 👤 User Profile API

### Update Profile

**Endpoint:** `PATCH /api/v1/users/profile`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "bio": "Passionate about ocean conservation",
  "profileImageUrl": "https://example.com/updated-profile.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "email": "user@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "bio": "Passionate about ocean conservation",
    "profileImageUrl": "https://example.com/updated-profile.jpg",
    "updatedAt": "2023-01-15T00:00:00Z"
  }
}
```

### Change Password

**Endpoint:** `PATCH /api/v1/users/password`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password successfully updated"
  }
}
```

## ❌ Error Responses

All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional additional information
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request format or parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `ACCESS_DENIED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Validation Error Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Must be a valid email address",
        "password": "Must be at least 8 characters long"
      }
    }
  }
}
```

---

⏱️ Last Updated: May 5, 2024 