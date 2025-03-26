import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  onClick,
  children,
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline';
  fullWidth: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  /* Variant styles */
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'outline':
        return 'transparent';
      default:
        return theme.colors.primary.main;
    }
  }};
  
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.text.onDark;
      case 'outline':
        return theme.colors.primary.main;
      default:
        return theme.colors.text.onDark;
    }
  }};
  
  border: ${({ theme, variant }) => {
    switch (variant) {
      case 'outline':
        return `2px solid ${theme.colors.primary.main}`;
      default:
        return 'none';
    }
  }};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, variant }) => {
      switch (variant) {
        case 'primary':
          return theme.colors.primary.dark;
        case 'secondary':
          return theme.colors.secondary.dark;
        case 'outline':
          return `${theme.colors.primary.main}10`;
        default:
          return theme.colors.primary.dark;
      }
    }};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme, variant }) => {
      switch (variant) {
        case 'primary':
          return `${theme.colors.primary.main}40`;
        case 'secondary':
          return `${theme.colors.secondary.main}40`;
        case 'outline':
          return `${theme.colors.primary.main}40`;
        default:
          return `${theme.colors.primary.main}40`;
      }
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Button; 