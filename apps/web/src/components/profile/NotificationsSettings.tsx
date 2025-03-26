import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateProfile } from '../../api/hooks';
import Button from '../auth/Button';

const NotificationsSettings: React.FC = () => {
  const { user } = useAuth();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState('');
  
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.notifications ?? true,
    marketingEmails: false,
    newDonationAlerts: true,
    monthlyReports: true,
    impactUpdates: true,
  });
  
  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    // Clear success message when preferences change
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const handleSave = () => {
    updateProfile(
      {
        preferences: {
          notifications: preferences.emailNotifications,
          theme: user?.preferences?.theme || 'light',
        },
      },
      {
        onSuccess: () => {
          setSuccessMessage('Notification preferences updated successfully!');
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        },
      }
    );
  };
  
  return (
    <Container>
      <Title>Notification Preferences</Title>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <ToggleList>
        <ToggleItem>
          <ToggleLabel>
            <div>
              <ToggleTitle>Email Notifications</ToggleTitle>
              <ToggleDescription>
                Receive notifications about your account via email
              </ToggleDescription>
            </div>
            <ToggleSwitch
              checked={preferences.emailNotifications}
              onClick={() => handleToggle('emailNotifications')}
            />
          </ToggleLabel>
        </ToggleItem>
        
        <ToggleItem disabled={!preferences.emailNotifications}>
          <ToggleLabel>
            <div>
              <ToggleTitle>Marketing Emails</ToggleTitle>
              <ToggleDescription>
                Receive emails about new features and promotions
              </ToggleDescription>
            </div>
            <ToggleSwitch
              checked={preferences.marketingEmails && preferences.emailNotifications}
              onClick={() => handleToggle('marketingEmails')}
              disabled={!preferences.emailNotifications}
            />
          </ToggleLabel>
        </ToggleItem>
        
        <ToggleItem disabled={!preferences.emailNotifications}>
          <ToggleLabel>
            <div>
              <ToggleTitle>New Donation Alerts</ToggleTitle>
              <ToggleDescription>
                Get notified when new donations are made to your funds
              </ToggleDescription>
            </div>
            <ToggleSwitch
              checked={preferences.newDonationAlerts && preferences.emailNotifications}
              onClick={() => handleToggle('newDonationAlerts')}
              disabled={!preferences.emailNotifications}
            />
          </ToggleLabel>
        </ToggleItem>
        
        <ToggleItem disabled={!preferences.emailNotifications}>
          <ToggleLabel>
            <div>
              <ToggleTitle>Monthly Reports</ToggleTitle>
              <ToggleDescription>
                Receive monthly summaries of your giving activity
              </ToggleDescription>
            </div>
            <ToggleSwitch
              checked={preferences.monthlyReports && preferences.emailNotifications}
              onClick={() => handleToggle('monthlyReports')}
              disabled={!preferences.emailNotifications}
            />
          </ToggleLabel>
        </ToggleItem>
        
        <ToggleItem disabled={!preferences.emailNotifications}>
          <ToggleLabel>
            <div>
              <ToggleTitle>Impact Updates</ToggleTitle>
              <ToggleDescription>
                Get updates about the impact of your donations
              </ToggleDescription>
            </div>
            <ToggleSwitch
              checked={preferences.impactUpdates && preferences.emailNotifications}
              onClick={() => handleToggle('impactUpdates')}
              disabled={!preferences.emailNotifications}
            />
          </ToggleLabel>
        </ToggleItem>
      </ToggleList>
      
      <ButtonContainer>
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          isLoading={isLoading}
        >
          Save Preferences
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
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

const ToggleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ToggleItem = styled.li<{ disabled?: boolean }>`
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: opacity 0.2s;
  
  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const ToggleLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const ToggleTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ToggleDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface ToggleSwitchProps {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onClick,
  disabled = false,
}) => (
  <SwitchContainer onClick={disabled ? undefined : onClick} disabled={disabled}>
    <SwitchInput type="checkbox" checked={checked} readOnly />
    <SwitchSlider checked={checked} />
  </SwitchContainer>
);

const SwitchContainer = styled.div<{ disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme, checked }) => 
    checked ? theme.colors.primary.main : theme.colors.border};
  border-radius: 34px;
  transition: 0.4s;
  
  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: ${({ checked }) => (checked ? '26px' : '4px')};
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export default NotificationsSettings; 