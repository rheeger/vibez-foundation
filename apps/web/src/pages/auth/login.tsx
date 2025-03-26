import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import LoginForm from '../../components/auth/LoginForm';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginPage: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const router = useRouter();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  return (
    <>
      <Head>
        <title>Login | Vibez Foundation</title>
        <meta name="description" content="Sign in to your Vibez Foundation account" />
      </Head>
      
      <PageContainer>
        <ContentContainer>
          <LogoContainer>
            <LogoText>VIBEZ</LogoText>
            <LogoSubtext>FOUNDATION</LogoSubtext>
          </LogoContainer>
          
          <FormContainer>
            <LoginForm />
          </FormContainer>
          
          <ImageContainer>
            <BackgroundImage src="/images/auth-bg.jpg" alt="" />
          </ImageContainer>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.main};
  padding: 2rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  position: relative;
  
  @media (min-width: 768px) {
    flex-direction: row;
    min-height: 600px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    overflow: hidden;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  
  @media (max-width: 767px) {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.main};
`;

const LogoSubtext = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 1.5px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  z-index: 1;
  
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const ImageContainer = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    width: 50%;
    position: relative;
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

export default LoginPage; 