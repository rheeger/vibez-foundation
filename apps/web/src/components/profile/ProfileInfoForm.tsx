import React, { useState } from 'react';
import styled from 'styled-components';
import { useUpdateProfile } from '../../api/hooks';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../auth/FormInput';
import Button from '../auth/Button';

const ProfileInfoForm: React.FC = () => {
  const { user } = useAuth();
  const { mutate: updateProfile, isLoading, isSuccess } = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      name: '',
      email: '',
      bio: '',
      location: '',
    };
    
    // Name validation
    if (!formData.name) {
      errors.name = 'Name is required';
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
    
    // Bio validation (optional, but limited to 500 chars)
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
      isValid = false;
    }
    
    // Location validation (optional)
    if (formData.location && formData.location.length > 100) {
      errors.location = 'Location must be less than 100 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updateProfile(formData, {
        onSuccess: () => {
          setSuccessMessage('Profile updated successfully!');
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }
      });
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Title>Profile Information</Title>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <FormInput
        id="name"
        name="name"
        label="Full Name"
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
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        required
      />
      
      <TextAreaContainer>
        <Label htmlFor="bio">
          Bio <Small>(Optional)</Small>
        </Label>
        <TextArea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={4}
          hasError={!!formErrors.bio}
        />
        {formErrors.bio && <ErrorMessage>{formErrors.bio}</ErrorMessage>}
        <CharCount limit={500} count={formData.bio.length} />
      </TextAreaContainer>
      
      <FormInput
        id="location"
        name="location"
        label="Location"
        value={formData.location}
        onChange={handleChange}
        error={formErrors.location}
        placeholder="City, Country"
      />
      
      <ButtonContainer>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save Changes
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

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Small = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error : theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError 
        ? `${theme.colors.error}20` 
        : `${theme.colors.primary.main}20`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.6;
  }
`;

const CharCount = ({ limit, count }: { limit: number; count: number }) => (
  <CharacterCount isNearLimit={count > limit * 0.8} isOverLimit={count > limit}>
    {count}/{limit}
  </CharacterCount>
);

const CharacterCount = styled.div<{
  isNearLimit: boolean;
  isOverLimit: boolean;
}>`
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.5rem;
  color: ${({ theme, isNearLimit, isOverLimit }) => {
    if (isOverLimit) return theme.colors.error;
    if (isNearLimit) return theme.colors.warning;
    return theme.colors.text.secondary;
  }};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export default ProfileInfoForm; 