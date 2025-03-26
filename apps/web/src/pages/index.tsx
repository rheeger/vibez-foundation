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
`;

const Title = styled.h1`
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled.h2`
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  max-width: 800px;
  width: 100%;
  backdrop-filter: blur(10px);
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
            Wah gwaan! Welcome to VIBEZ FOUNDATION, where charitable giving gets real irie! 
            Our platform brings a wicked Caribbean flavor to managing your Donor-Advised Funds, ya know?
          </p>
          <p>
            Create funds, link up with top-notch organizations, and track your blessings - all with that 
            authentic island feel. Skate your cursor 'cross the blue water to make some ripples, 
            or click anywhere to mek a big splash, seen?
          </p>
        </Card>
      </HomeContainer>
    </>
  );
} 