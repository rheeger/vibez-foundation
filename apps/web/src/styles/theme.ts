// Theme definition for styled-components
export const theme = {
  colors: {
    primary: '#00BFFF', // Deep Sky Blue - ocean themed
    secondary: '#FFD700', // Gold - sun/sand themed
    accent: '#FF6347', // Tomato - tropical themed
    background: '#F0F8FF', // AliceBlue - light ocean blue
    text: '#333333',
    lightText: '#666666',
    error: '#FF0000',
    success: '#00FF00',
    warning: '#FFA500',
  },
  fonts: {
    main: "'Montserrat', sans-serif",
    heading: "'Poppins', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    largeDesktop: '1200px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
} as const; 