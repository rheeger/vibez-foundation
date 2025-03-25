# 🌴 VIBEZ FOUNDATION: Frontend Engineering Agent Guidelines 🏝️

This document provides essential context and best practices for AI agents working on frontend engineering tasks for VIBEZ FOUNDATION.

## 🌊 Project Context

VIBEZ FOUNDATION is a tropical-themed Donor-Advised Fund provider built on Endaoment's DAFs as a Service platform. The UI emphasizes a fun, Caribbean/reggae-inspired experience with island aesthetics, making philanthropy feel like a vacation.

## 🧩 Key Responsibilities

As a Frontend Engineering Agent, your primary responsibilities include:

1. Building React components that match our tropical design system
2. Implementing responsive layouts and animations
3. Integrating with backend APIs and state management
4. Writing clean, type-safe TypeScript code
5. Ensuring accessibility compliance
6. Creating unit and integration tests
7. Optimizing performance

## 🏗️ Technical Framework

### Core Technologies
- **React 18+**: Functional components with hooks
- **TypeScript**: Strict mode enabled
- **Next.js**: For routing and SSR/SSG
- **Styled-components**: For component styling
- **React Query**: For data fetching and caching
- **Zustand**: For global state management
- **Vitest**: For unit and component testing

### Project Structure

```
apps/web/
├── components/        # Shared UI components
│   ├── common/        # Basic UI elements
│   ├── layouts/       # Page layouts
│   └── features/      # Feature-specific components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages
├── services/          # API services
├── styles/            # Global styles and themes
├── types/             # TypeScript definitions
└── utils/             # Utility functions
```

### Component Architecture

For new components, follow this directory structure:

```
ComponentName/
├── ComponentName.tsx              # Main component
├── ComponentName.styles.ts        # Styled components
├── ComponentName.test.tsx         # Tests
├── ComponentName.stories.tsx      # Storybook stories
├── useComponentName.ts            # Component-specific hook (if needed)
└── index.ts                       # Export file
```

## 🎨 Design Implementation Guidelines

### Tropical Theme Integration

- Use the color palette defined in `docs/design/brand-guidelines.md`
- Incorporate tropical imagery and motifs (palm trees, waves, etc.)
- Design components that feel relaxed and inviting
- Implement Caribbean-inspired animations (gentle waves, palm sway)

### CSS Best Practices

- Use the theming system in styled-components
- Implement responsive designs using flexible layouts
- Follow mobile-first approach
- Use CSS variables for consistent styling
- Implement smooth transitions and animations
- Ensure proper dark mode support

### UI Components to Implement

1. **Island Cards**: Content containers with tropical styling
2. **Wave Buttons**: Call-to-action buttons with wave animations
3. **Palm Tree Progress**: Loading and progress indicators
4. **Tropical Forms**: Input fields with island-themed validation
5. **Paradise Navigation**: Themed navigation components
6. **Impact Visualizations**: Charts and graphs with tropical aesthetics

## 💻 Code Quality Standards

### TypeScript Best Practices

- Define explicit interfaces for all props
- Use discriminated unions for complex state
- Leverage TypeScript's utility types
- Avoid `any` and `as` casts when possible
- Create reusable type definitions in `types/` directory

Example component structure:

```tsx
import React from 'react';
import { StyledCard, CardHeader, CardContent } from './IslandCard.styles';

export interface IslandCardProps {
  title: string;
  image?: string;
  variant: 'beach' | 'jungle' | 'ocean';
  children: React.ReactNode;
  onAction?: () => void;
}

export const IslandCard: React.FC<IslandCardProps> = ({
  title,
  image,
  variant,
  children,
  onAction,
}) => {
  return (
    <StyledCard variant={variant}>
      <CardHeader>
        {image && <img src={image} alt={title} />}
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {onAction && (
        <button onClick={onAction}>Explore</button>
      )}
    </StyledCard>
  );
};
```

### Performance Considerations

- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize images and assets
- Code-split large components
- Use useMemo and useCallback appropriately
- Implement lazy loading for off-screen content

### Accessibility Requirements

- Ensure WCAG 2.1 AA compliance
- Use semantic HTML elements
- Implement proper keyboard navigation
- Add aria attributes where necessary
- Ensure sufficient color contrast
- Test with screen readers

## 🧪 Testing Approach

- Write unit tests for all components
- Create integration tests for user flows
- Test responsive behavior
- Verify accessibility compliance
- Test animations and transitions
- Ensure cross-browser compatibility

Example test structure:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { IslandCard } from './IslandCard';

describe('IslandCard', () => {
  it('renders the title correctly', () => {
    render(
      <IslandCard title="Tropical Paradise" variant="beach">
        Content
      </IslandCard>
    );
    
    expect(screen.getByText('Tropical Paradise')).toBeInTheDocument();
  });
  
  it('calls onAction when button is clicked', () => {
    const handleAction = jest.fn();
    render(
      <IslandCard title="Tropical Paradise" variant="beach" onAction={handleAction}>
        Content
      </IslandCard>
    );
    
    fireEvent.click(screen.getByText('Explore'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
```

## 🔄 API Integration

- Use React Query for data fetching and caching
- Implement proper error handling
- Show loading states
- Create service files for API interactions
- Type all API responses

Example service:

```tsx
import axios from 'axios';

interface Organization {
  id: string;
  name: string;
  mission: string;
  category: string;
}

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await axios.get('/api/organizations');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch organizations', error);
    throw error;
  }
};
```

## 📱 Responsive Design Implementation

- Follow mobile-first approach
- Use flexbox and CSS grid for layouts
- Implement responsive typography
- Add appropriate breakpoints
- Ensure touch-friendly interactions on mobile
- Test on various screen sizes

## 🎵 Audio and Animation Integration

- Implement background reggae music (user-toggleable)
- Add tropical sound effects for interactions
- Create smooth page transitions
- Implement micro-interactions for engagement
- Ensure animations don't impact performance
- Make animations subtle and not distracting

## 🧠 State Management Guidelines

- Use React Query for server state
- Use Zustand for global application state
- Keep component state local when possible
- Create custom hooks for complex state logic
- Document state structures

Example Zustand store:

```tsx
import create from 'zustand';

interface ThemeState {
  theme: 'beach' | 'jungle' | 'ocean';
  setTheme: (theme: 'beach' | 'jungle' | 'ocean') => void;
  playMusic: boolean;
  toggleMusic: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'beach',
  setTheme: (theme) => set({ theme }),
  playMusic: false,
  toggleMusic: () => set((state) => ({ playMusic: !state.playMusic })),
}));
```

## 🚀 Common Workflows

### Creating a New Page

1. Add a new file in `pages/` directory
2. Import layout components
3. Implement data fetching with React Query
4. Create page-specific components as needed
5. Add proper meta tags for SEO
6. Implement responsive design
7. Add tests for the page

### Creating a New Component

1. Follow component directory structure
2. Implement component with props interface
3. Create styled-components for styling
4. Write unit tests
5. Create Storybook stories
6. Document the component

## 💡 Tips for Success

- Review the design guidelines thoroughly
- Use existing components before creating new ones
- Follow the tropical theme consistently
- Test on multiple browsers and devices
- Prioritize accessibility
- Optimize for performance
- Write clear documentation

---

⏱️ Last Updated: [Current Date] 