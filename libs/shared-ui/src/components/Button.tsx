import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Variant styles
const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary}dd;
    }
    
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary}bb;
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.secondary}dd;
    }
    
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.secondary}bb;
    }
  `,
  tertiary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary}11;
    }
    
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary}22;
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.error}dd;
    }
    
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.error}bb;
    }
  `,
};

// Size styles
const sizeStyles = {
  small: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.fontSizes.small};
  `,
  medium: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSizes.medium};
  `,
  large: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.fontSizes.large};
  `,
};

const ButtonContainer = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $isFullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;
  outline: none;
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : 'auto')};
  
  /* Apply variant styles */
  ${({ $variant }) => variantStyles[$variant]}
  
  /* Apply size styles */
  ${({ $size }) => sizeStyles[$size]}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.xs};
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...rest
}) => {
  return (
    <ButtonContainer
      $variant={variant}
      $size={size}
      $isFullWidth={isFullWidth}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </ButtonContainer>
  );
};

export default Button; 