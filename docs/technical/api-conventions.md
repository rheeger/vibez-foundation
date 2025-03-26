# 🌴 VIBEZ FOUNDATION: API Naming Conventions & Patterns 🏝️

This document defines the standard API conventions for the VIBEZ FOUNDATION backend.

## RESTful Resource Naming

| Resource | Singular | Plural | Example Path |
|----------|----------|--------|-------------|
| User | `user` | `users` | `/api/v1/users/:id` |
| Fund | `fund` | `funds` | `/api/v1/funds/:id` |
| Organization | `organization` | `organizations` | `/api/v1/organizations/:id` |
| Donation | `donation` | `donations` | `/api/v1/donations/:id` |
| Favorite | `favorite` | `favorites` | `/api/v1/favorites/:id` |

## HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve resources | `GET /api/v1/funds` |
| POST | Create resources | `POST /api/v1/funds` |
| PUT | Replace resources | `PUT /api/v1/funds/:id` |
| PATCH | Partially update resources | `PATCH /api/v1/funds/:id` |
| DELETE | Remove resources | `DELETE /api/v1/funds/:id` |

## URL Structure

```
/api/v{version}/{resource}[/{resourceId}[/{subresource}[/{subresourceId}]]]
```

Examples:
- `GET /api/v1/funds` - List all funds
- `GET /api/v1/funds/123` - Get a specific fund
- `GET /api/v1/funds/123/organizations` - List organizations in a fund
- `POST /api/v1/funds/123/organizations` - Add an organization to a fund

## Query Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `page` | Pagination page number | `?page=2` |
| `limit` | Results per page | `?limit=20` |
| `sort` | Sort field and direction | `?sort=createdAt:desc` |
| `fields` | Field selection | `?fields=name,description` |
| `q` | Search query | `?q=ocean` |
| `filter[field]` | Field filtering | `?filter[isActive]=true` |

## Response Format

```json
{
  "success": true,
  "data": {
    // Resource data
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

For errors:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {} // Optional additional details
  }
}
```

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `BAD_REQUEST` | Invalid request syntax |
| 401 | `UNAUTHORIZED` | Authentication required |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict |
| 422 | `VALIDATION_ERROR` | Validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_SERVER_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Temporary unavailability |

## API Versioning

- All endpoints use the `/api/v{version}/` prefix
- Current version: `v1`
- Breaking changes require a new API version
- Multiple versions may be supported simultaneously during transitions

## Resource Relationships

- Nested routes for has-many relationships: `/api/v1/funds/:id/organizations`
- Reference by ID for belongs-to relationships: `organizationId` field in request body
- Include parameter for eager loading: `?include=organizations,donations`

## Batch Operations

- Batch create: `POST /api/v1/funds/batch` with array of resources
- Batch update: `PATCH /api/v1/funds/batch` with array of partial resources
- Batch delete: `DELETE /api/v1/funds/batch` with array of IDs

## Authentication

- All authenticated endpoints require `Authorization: Bearer {token}` header
- Authentication errors return 401 status code
- Permission errors return 403 status code

---

⏱️ Last Updated: May 5, 2024 