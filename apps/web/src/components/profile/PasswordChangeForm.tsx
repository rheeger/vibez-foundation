import React, { useState } from 'react';
import styled from 'styled-components';
import { useUpdatePassword } from '../../api/hooks';
import FormInput from '../auth/FormInput';
import Button from '../auth/Button';

const PasswordChangeForm: React.FC = () => {
  const { mutate: updatePassword, isLoading, isError, isSuccess } = useUpdatePassword();
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message when form changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };
    
    // Current password validation
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    // New password validation
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    } else if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
      isValid = false;
    }
    
    // Password confirmation validation
    if (!formData.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updatePassword(
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        },
        {
          onSuccess: (data) => {
            // Clear form on success
            setFormData({
              currentPassword: '',
              newPassword: '',
              confirmNewPassword: '',
            });
            
            setSuccessMessage(data.message || 'Password updated successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage('');
            }, 3000);
          },
          onError: (error: Error) => {
            // If the error is related to current password, show it
            if (error.message.toLowerCase().includes('current password')) {
              setFormErrors((prev) => ({
                ...prev,
                currentPassword: error.message,
              }));
            }
          },
        }
      );
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Title>Change Password</Title>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <FormInput
        id="currentPassword"
        name="currentPassword"
        label="Current Password"
        type="password"
        value={formData.currentPassword}
        onChange={handleChange}
        error={formErrors.currentPassword}
        required
      />
      
      <FormInput
        id="newPassword"
        name="newPassword"
        label="New Password"
        type="password"
        value={formData.newPassword}
        onChange={handleChange}
        error={formErrors.newPassword}
        required
      />
      
      <FormInput
        id="confirmNewPassword"
        name="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        value={formData.confirmNewPassword}
        onChange={handleChange}
        error={formErrors.confirmNewPassword}
        required
      />
      
      <PasswordRequirements>
        <RequirementTitle>Password requirements:</RequirementTitle>
        <RequirementList>
          <Requirement isValid={formData.newPassword.length >= 8}>
            At least 8 characters long
          </Requirement>
          <Requirement isValid={/[A-Z]/.test(formData.newPassword)}>
            Contains uppercase letter
          </Requirement>
          <Requirement isValid={/[a-z]/.test(formData.newPassword)}>
            Contains lowercase letter
          </Requirement>
          <Requirement isValid={/[0-9]/.test(formData.newPassword)}>
            Contains a number
          </Requirement>
        </RequirementList>
      </PasswordRequirements>
      
      <ButtonContainer>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Update Password
        </Button>
      </ButtonContainer>
    </Form>
  );
};

const Form = styled.form`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.success}15`};
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const PasswordRequirements = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

const RequirementTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RequirementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Requirement = styled.li<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  margin-bottom: 0.25rem;
  color: ${({ theme, isValid }) =>
    isValid ? theme.colors.success : theme.colors.text.secondary};
  
  &:before {
    content: ${({ isValid }) => (isValid ? '"✓"' : '"○"')};
    margin-right: 0.5rem;
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export default PasswordChangeForm; 