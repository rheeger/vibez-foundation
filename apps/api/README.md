# VIBEZ Foundation API

This is the backend API for the VIBEZ Foundation platform, providing endpoints for fund management, donations, and integration with Endaoment DAAS.

## Technologies

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis for caching

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Configure environment variables by copying `.env.example` to `.env` and updating the values:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
yarn prisma:generate
```

4. Run database migrations:

```bash
yarn prisma:migrate:dev
```

### Development

Start the development server:

```bash
yarn dev
```

The server will be available at http://localhost:3001.

### Production Build

Build the application:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## API Documentation

### Available Endpoints

- GET `/api/health` - Health check endpoint
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - User login
- GET `/api/v1/users/me` - Get current user profile
- GET `/api/v1/funds` - List all funds
- POST `/api/v1/funds` - Create a new fund
- GET `/api/v1/funds/:id` - Get fund details
- GET `/api/v1/organizations` - List all organizations
- GET `/api/v1/organizations/:id` - Get organization details
- POST `/api/v1/donations` - Create a new donation

## Database Schema

The database schema includes the following models:

- User - Platform users
- Fund - User-created funds
- Organization - Charitable organizations
- FundOrganization - Many-to-many relationship between funds and organizations
- Donation - Donations made by users
- Favorite - User's favorite funds and organizations

## Endaoment DAAS Integration

The API integrates with Endaoment's DAAS (Donation as a Service) for processing donations and fund management.

## License

[MIT](LICENSE) 