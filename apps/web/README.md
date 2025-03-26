# 🏝️ VIBEZ FOUNDATION Web App 🌴

A tropical-themed web application for managing Donor-Advised Funds built on Endaoment's DAAS platform.

## 🍹 Overview

The VIBEZ FOUNDATION web app provides an engaging, island-themed user interface for creating and managing Donor-Advised Funds, making charitable donations, and tracking philanthropic impact with vibrant visualizations.

## 🌺 Features

- Create and manage Donor-Advised Funds with a tropical twist
- Browse and donate to charitable organizations
- Interactive dashboard with impact metrics
- Island-themed UI with delightful animations and sound effects
- Responsive design for all device sizes

## 🥥 Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Styled Components
- **Animation**: Framer Motion
- **Data Fetching**: React Query
- **API Integration**: RESTful API with Endaoment DAAS

## 🏄‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- API server running (see `/apps/api` README)

### Installation

1. Install dependencies:

```bash
cd apps/web
yarn install
```

2. Start the development server:

```bash
yarn dev
```

The application will be available at http://localhost:3000.

## 📁 Project Structure

```
apps/web/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Next.js pages
│   ├── styles/            # Global styles and theme
│   ├── store/             # Zustand state management
│   ├── api/               # API client and hooks
│   ├── interaction/       # Animation and sound system
│   └── examples/          # Example components and patterns
```

## 🚀 Development Workflow

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the web directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENDAOMENT_API_URL=https://api.endaoment.org
```

## 🎨 Interaction System

The web app includes a comprehensive interaction system that brings the tropical island theme to life with animations and sound effects. See the [Interaction System Documentation](src/interaction/README.md) for details.

## 🔄 API Integration

The web app communicates with the VIBEZ Foundation API. Key endpoints include:

- Authentication (register, login)
- Fund management (create, list, details)
- Organization browsing
- Donation processing

## 📱 Responsive Design

The application is designed to work seamlessly across devices:

- Mobile-first approach
- Responsive navigation
- Touch-optimized interactions
- Adaptive layouts for different screen sizes

## 🧪 Testing

Tests can be run with:

```bash
yarn test
```

## 🏗️ Build and Deployment

Build the application for production:

```bash
yarn build
```

The built application will be in the `.next` directory.

## 🤝 Contributing

Please see the project's [Contributing Guidelines](../../docs/CONTRIBUTING.md) for details on how to contribute.

## 📚 Additional Resources

- [Project Documentation](../../docs)
- [API Documentation](../api/README.md)
- [Next.js Documentation](https://nextjs.org/docs)

## 🏄‍♀️ Have fun!

Remember to enjoy the tropical vibes while developing! 🌊🥥 