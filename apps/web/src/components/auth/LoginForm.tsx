import React, { useState } from 'react';
import styled from 'styled-components';
import { useLogin } from '../../api/hooks';
import FormInput from './FormInput';
import Button from './Button';
import { useRouter } from 'next/router';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { mutate: login, isLoading, isError, error } = useLogin();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '' };
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      login(formData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard');
          }
        },
      });
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Title>Welcome Back</Title>
      <Subtitle>Sign in to your account</Subtitle>
      
      {isError && <ErrorAlert>{error?.message || 'Login failed'}</ErrorAlert>}
      
      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="your.email@example.com"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        required
      />
      
      <FormInput
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        required
      />
      
      <ForgotPasswordLink href="/auth/forgot-password">
        Forgot password?
      </ForgotPasswordLink>
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
      >
        Sign In
      </Button>
      
      <SignupPrompt>
        Don't have an account?{' '}
        <SignupLink href="/auth/register">Create an account</SignupLink>
      </SignupPrompt>
    </Form>
  );
};

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
`;

const ErrorAlert = styled.div`
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const ForgotPasswordLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary.main};
  text-align: right;
  display: block;
  margin-bottom: 1.5rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignupPrompt = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 2rem;
`;

const SignupLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginForm; 