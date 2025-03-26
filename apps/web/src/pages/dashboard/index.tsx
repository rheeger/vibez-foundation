import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useGetFunds } from '../../api/hooks';
import ProfileAvatar from '../../components/profile/ProfileAvatar';

const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: funds, isLoading: fundsLoading } = useGetFunds();
  
  // User is not authenticated - the auth context will redirect
  if (authLoading || !user) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }
  
  return (
    <>
      <Head>
        <title>Dashboard | Vibez Foundation</title>
        <meta name="description" content="Manage your Vibez Foundation funds and giving" />
      </Head>
      
      <PageContainer>
        <WelcomeSection>
          <WelcomeHeader>
            <div>
              <Greeting>Welcome back, {user.name?.split(' ')[0]}</Greeting>
              <Subheading>Here's an overview of your giving impact.</Subheading>
            </div>
            <Link href="/profile" passHref legacyBehavior>
              <ProfileLink>
                <ProfileAvatar size="medium" />
                <EditProfileText>Edit Profile</EditProfileText>
              </ProfileLink>
            </Link>
          </WelcomeHeader>
        </WelcomeSection>
        
        <GridContainer>
          <StatCard>
            <StatIconContainer color="primary">
              <StatIcon>🏝️</StatIcon>
            </StatIconContainer>
            <StatContent>
              <StatValue>{funds?.length || 0}</StatValue>
              <StatLabel>Total Funds</StatLabel>
              <StatDescription>Active donor-advised funds</StatDescription>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIconContainer color="secondary">
              <StatIcon>💰</StatIcon>
            </StatIconContainer>
            <StatContent>
              <StatValue>
                ${funds?.reduce((sum, fund) => sum + (fund.balance || 0), 0).toFixed(2) || '0.00'}
              </StatValue>
              <StatLabel>Total Balance</StatLabel>
              <StatDescription>Across all your funds</StatDescription>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIconContainer color="tertiary">
              <StatIcon>🌊</StatIcon>
            </StatIconContainer>
            <StatContent>
              <StatValue>12</StatValue>
              <StatLabel>Grants</StatLabel>
              <StatDescription>Made to organizations</StatDescription>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIconContainer color="quaternary">
              <StatIcon>🔄</StatIcon>
            </StatIconContainer>
            <StatContent>
              <StatValue>$3,450</StatValue>
              <StatLabel>Total Impact</StatLabel>
              <StatDescription>Cumulative giving amount</StatDescription>
            </StatContent>
          </StatCard>
        </GridContainer>
        
        <SectionHeader>
          <SectionTitle>Your Funds</SectionTitle>
          <CreateFundButton href="/funds/create">+ Create New Fund</CreateFundButton>
        </SectionHeader>
        
        {fundsLoading ? (
          <LoadingContainer>Loading your funds...</LoadingContainer>
        ) : funds && funds.length > 0 ? (
          <FundsList>
            {funds.map((fund) => (
              <FundCard key={fund.id}>
                <FundHeader>
                  <FundName>{fund.name}</FundName>
                  <FundBalance>${fund.balance.toFixed(2)}</FundBalance>
                </FundHeader>
                <FundDescription>{fund.description}</FundDescription>
                <FundActions>
                  <FundAction>Donate</FundAction>
                  <FundAction>Grant</FundAction>
                  <FundAction>Manage</FundAction>
                </FundActions>
              </FundCard>
            ))}
          </FundsList>
        ) : (
          <EmptyState>
            <EmptyStateIcon>🏝️</EmptyStateIcon>
            <EmptyStateTitle>No funds yet</EmptyStateTitle>
            <EmptyStateText>
              Create your first Donor-Advised Fund to start your giving journey.
            </EmptyStateText>
            <Link href="/funds/create" passHref legacyBehavior>
              <EmptyStateButton>Create a Fund</EmptyStateButton>
            </Link>
          </EmptyState>
        )}
        
        <SectionHeader>
          <SectionTitle>Recent Activity</SectionTitle>
          <ViewAllButton href="/dashboard/activity">View All</ViewAllButton>
        </SectionHeader>
        
        <ActivityList>
          <ActivityItem>
            <ActivityIcon type="donation">💰</ActivityIcon>
            <ActivityContent>
              <ActivityTitle>Donation to Coastal Cleanup Fund</ActivityTitle>
              <ActivityDetails>$1,000.00 • June 2, 2024</ActivityDetails>
            </ActivityContent>
          </ActivityItem>
          
          <ActivityItem>
            <ActivityIcon type="grant">🎁</ActivityIcon>
            <ActivityContent>
              <ActivityTitle>Grant to Ocean Conservation Society</ActivityTitle>
              <ActivityDetails>$500.00 • May 28, 2024</ActivityDetails>
            </ActivityContent>
          </ActivityItem>
          
          <ActivityItem>
            <ActivityIcon type="create">📝</ActivityIcon>
            <ActivityContent>
              <ActivityTitle>Created Marine Life Protection Fund</ActivityTitle>
              <ActivityDetails>May 15, 2024</ActivityDetails>
            </ActivityContent>
          </ActivityItem>
        </ActivityList>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const WelcomeSection = styled.section`
  margin-bottom: 2rem;
`;

const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const Greeting = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Subheading = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ProfileLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
`;

const EditProfileText = styled.span`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: 500;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const getIconColor = (color: string, theme: any) => {
  switch (color) {
    case 'primary':
      return theme.colors.primary.main;
    case 'secondary':
      return theme.colors.secondary.main;
    case 'tertiary':
      return '#FFC857'; // A golden yellow color
    case 'quaternary':
      return '#4ECDC4'; // A teal color
    default:
      return theme.colors.primary.main;
  }
};

const StatIconContainer = styled.div<{ color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${({ color, theme }) => `${getIconColor(color, theme)}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const StatIcon = styled.span`
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const StatDescription = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CreateFundButton = styled.a`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const ViewAllButton = styled.a`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FundsList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FundCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const FundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const FundName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FundBalance = styled.div`
  background-color: ${({ theme }) => `${theme.colors.success}15`};
  color: ${({ theme }) => theme.colors.success};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.875rem;
  font-weight: 600;
`;

const FundDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1rem 0;
  line-height: 1.5;
  // Limit to 3 lines
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FundActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FundAction = styled.button`
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  margin-bottom: 3rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyStateText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1.5rem 0;
  max-width: 300px;
`;

const EmptyStateButton = styled.a`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const ActivityList = styled.div`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ActivityItem = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
`;

const getActivityIconColor = (type: string, theme: any) => {
  switch (type) {
    case 'donation':
      return theme.colors.primary.main;
    case 'grant':
      return theme.colors.secondary.main;
    case 'create':
      return '#4ECDC4'; // Teal
    default:
      return theme.colors.primary.main;
  }
};

const ActivityIcon = styled.div<{ type: 'donation' | 'grant' | 'create' }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ type, theme }) => `${getActivityIconColor(type, theme)}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const ActivityDetails = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default DashboardPage; 