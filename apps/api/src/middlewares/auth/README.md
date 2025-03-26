# Authentication Middleware

This directory contains the authentication middleware for the VIBEZ Foundation API. It implements JWT-based authentication with role-based authorization.

## Structure

- `index.ts` - Exports authentication-related middleware
- `jwtAuth.ts` - JWT authentication implementation using Passport.js
- `validateRole.ts` - Role-based authorization middleware

## Usage

### JWT Authentication

The `jwtAuthenticate` middleware validates JWT tokens from requests and attaches the user to the request object if the token is valid.

```typescript
import { jwtAuthenticate } from '../middlewares/auth';

// Protected route that requires authentication
router.get('/protected', jwtAuthenticate, (req, res) => {
  // req.user is available here
  res.json({ message: 'This is a protected route', user: req.user });
});
```

### Role-Based Authorization

The `validateRole` middleware checks if the authenticated user has the required role(s).

```typescript
import { jwtAuthenticate, validateRole } from '../middlewares/auth';

// Route that requires admin role
router.delete('/users/:id', jwtAuthenticate, validateRole(['admin']), (req, res) => {
  // Delete user logic
});

// Route that allows multiple roles
router.post('/content', jwtAuthenticate, validateRole(['admin', 'editor']), (req, res) => {
  // Create content logic
});
```

## Known Issues

1. TypeScript has some typing issues with the jsonwebtoken library. The `generateToken` function in `auth.ts` uses `@ts-ignore` to bypass these issues temporarily.

2. The Express Request interface extension is defined in `types/express.d.ts` to make TypeScript recognize the `user` property on the request object.

## Future Improvements

1. Implement token refresh mechanism
2. Add support for social authentication
3. Fix TypeScript typing issues with jsonwebtoken
4. Add rate limiting to authentication endpoints
5. Implement email verification 