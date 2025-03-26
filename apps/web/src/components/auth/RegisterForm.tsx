import React, { useState } from 'react';
import styled from 'styled-components';
import { useRegister } from '../../api/hooks';
import FormInput from './FormInput';
import Button from './Button';
import { useRouter } from 'next/router';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { mutate: register, isLoading, isError, error } = useRegister();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
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
    const errors = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
    
    // Name validation
    if (!formData.name) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }
    
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
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Password confirmation validation
    if (!formData.passwordConfirm) {
      errors.passwordConfirm = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      register(formData, {
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
      <Title>Create Account</Title>
      <Subtitle>Join the Vibez Foundation community</Subtitle>
      
      {isError && <ErrorAlert>{error?.message || 'Registration failed'}</ErrorAlert>}
      
      <FormInput
        id="name"
        name="name"
        label="Full Name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
        required
      />
      
      <FormInput
        id="email"
        name="email"
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
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        required
      />
      
      <FormInput
        id="passwordConfirm"
        name="passwordConfirm"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={formData.passwordConfirm}
        onChange={handleChange}
        error={formErrors.passwordConfirm}
        required
      />
      
      <TermsText>
        By creating an account, you agree to our{' '}
        <TermsLink href="/terms">Terms of Service</TermsLink> and{' '}
        <TermsLink href="/privacy">Privacy Policy</TermsLink>.
      </TermsText>
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
      >
        Create Account
      </Button>
      
      <LoginPrompt>
        Already have an account?{' '}
        <LoginLink href="/auth/login">Sign in</LoginLink>
      </LoginPrompt>
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

const TermsText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const TermsLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginPrompt = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 2rem;
`;

const LoginLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default RegisterForm; 