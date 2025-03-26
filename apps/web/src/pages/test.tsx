import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useAppStore } from '../store/useAppStore';

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 100vh;
`;

const Card = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 800px;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TestButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const TestPage: React.FC = () => {
  const { setLoading, setError, isLoading, error } = useAppStore();
  
  const testZustandStore = () => {
    setLoading(true);
    
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      setError('This is a test error from Zustand');
      
      // Clear the error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }, 1000);
  };
  
  return (
    <>
      <Head>
        <title>Test Page - VIBEZ FOUNDATION</title>
      </Head>
      
      <TestContainer>
        <Title>Test Page</Title>
        
        <Card>
          <Section>
            <SectionTitle>Testing Zustand Store</SectionTitle>
            <p>Click the button below to test the Zustand store state management:</p>
            <TestButton onClick={testZustandStore} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Test Zustand'}
            </TestButton>
            
            {error && (
              <div style={{ marginTop: '1rem', color: 'red' }}>
                Error: {error}
              </div>
            )}
          </Section>
        </Card>
        
        <Card>
          <Section>
            <SectionTitle>Testing Styled Components</SectionTitle>
            <p>This page is styled using styled-components with our theme provider.</p>
          </Section>
        </Card>
      </TestContainer>
    </>
  );
};

export default TestPage; 