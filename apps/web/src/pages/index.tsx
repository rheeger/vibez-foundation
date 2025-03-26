import Head from 'next/head';
import styled from 'styled-components';

// Styled components for the home page
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, #E6F7FF 100%);
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const Subtitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Card = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  max-width: 800px;
  width: 100%;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>VIBEZ FOUNDATION - Tropical DAF Platform</title>
        <meta name="description" content="A tropically-themed Donor-Advised Fund provider built on Endaoment's DAFs as a Service platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <HomeContainer>
        <Title>🏝️ VIBEZ FOUNDATION 🌴</Title>
        <Subtitle>A tropically-themed philanthropy experience</Subtitle>
        
        <Card>
          <p>
            Welcome to VIBEZ FOUNDATION, where charitable giving meets island vibes! 
            Our platform provides a fun, tropical twist on managing your Donor-Advised Funds.
          </p>
          <p>
            Create funds, discover organizations, and track your impact - all with a refreshing 
            Caribbean atmosphere.
          </p>
        </Card>
      </HomeContainer>
    </>
  );
} 