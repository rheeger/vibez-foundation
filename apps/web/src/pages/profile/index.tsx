import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import ProfileInfoForm from '../../components/profile/ProfileInfoForm';
import PasswordChangeForm from '../../components/profile/PasswordChangeForm';
import NotificationsSettings from '../../components/profile/NotificationsSettings';

enum TabType {
  PROFILE = 'profile',
  SECURITY = 'security',
  NOTIFICATIONS = 'notifications',
}

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.PROFILE);
  
  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }
  
  if (!user) {
    return null; // Auth context will redirect to login
  }
  
  return (
    <>
      <Head>
        <title>Your Profile | Vibez Foundation</title>
        <meta name="description" content="Manage your Vibez Foundation profile" />
      </Head>
      
      <PageContainer>
        <ProfileHeader>
          <ProfileAvatarContainer>
            <ProfileAvatar size="large" editable />
          </ProfileAvatarContainer>
          <ProfileHeaderContent>
            <ProfileName>{user.name}</ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
          </ProfileHeaderContent>
        </ProfileHeader>
        
        <ContentContainer>
          <TabsContainer>
            <Tab
              isActive={activeTab === TabType.PROFILE}
              onClick={() => setActiveTab(TabType.PROFILE)}
            >
              Profile Information
            </Tab>
            <Tab
              isActive={activeTab === TabType.SECURITY}
              onClick={() => setActiveTab(TabType.SECURITY)}
            >
              Security
            </Tab>
            <Tab
              isActive={activeTab === TabType.NOTIFICATIONS}
              onClick={() => setActiveTab(TabType.NOTIFICATIONS)}
            >
              Notifications
            </Tab>
          </TabsContainer>
          
          <TabContent>
            {activeTab === TabType.PROFILE && <ProfileInfoForm />}
            {activeTab === TabType.SECURITY && <PasswordChangeForm />}
            {activeTab === TabType.NOTIFICATIONS && <NotificationsSettings />}
          </TabContent>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    margin-bottom: 3rem;
  }
`;

const ProfileAvatarContainer = styled.div`
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 2rem;
  }
`;

const ProfileHeaderContent = styled.div`
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const ProfileEmail = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: column;
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    padding-right: 2rem;
    margin-bottom: 0;
    min-width: 200px;
  }
`;

const Tab = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary.main : theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.primary.main : 'transparent'};
    
    @media (min-width: 768px) {
      height: 100%;
      width: 3px;
      bottom: auto;
      left: auto;
      right: -2rem;
      top: 0;
    }
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  @media (min-width: 768px) {
    padding: 1rem 0;
    text-align: left;
  }
`;

const TabContent = styled.div`
  flex: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default ProfilePage; 