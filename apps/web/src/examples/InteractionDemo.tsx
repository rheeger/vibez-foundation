import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  WaveLoader,
  SunLoader,
  PalmTreeLoader,
  RippleButton,
  FlipCard,
  IslandToggle,
  Hoverable,
  useUISound
} from '../interaction';

const DemoContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
`;

const SectionTitle = styled.h2`
  color: #1A535C;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #4ECDC4;
  padding-bottom: 0.5rem;
`;

const DemoSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DemoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 1rem 0;
  align-items: center;
`;

const DemoItem = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ItemLabel = styled.span`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
`;

/**
 * Interactive demo showcasing the island-themed interaction components
 */
export const InteractionDemo: React.FC = () => {
  const [isToggleActive, setIsToggleActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { playSuccessSound, playErrorSound, playClickSound } = useUISound();
  
  const handleStartLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      playSuccessSound();
    }, 3000);
  };
  
  return (
    <DemoContainer>
      <h1>🌴 Island Interaction System Demo</h1>
      <p>
        This demo showcases the tropical island-themed interaction components
        created for the VIBEZ FOUNDATION project.
      </p>
      
      <SectionTitle>Loading Indicators</SectionTitle>
      <DemoSection>
        <DemoRow>
          <DemoItem>
            <WaveLoader />
            <ItemLabel>Wave Loader</ItemLabel>
          </DemoItem>
          
          <DemoItem>
            <SunLoader />
            <ItemLabel>Sun Loader</ItemLabel>
          </DemoItem>
          
          <DemoItem>
            <PalmTreeLoader />
            <ItemLabel>Palm Tree Loader</ItemLabel>
          </DemoItem>
        </DemoRow>
        
        <DemoRow>
          <RippleButton onClick={handleStartLoading} disabled={isLoading}>
            {isLoading ? <WaveLoader /> : 'Test Loading Sequence'}
          </RippleButton>
        </DemoRow>
      </DemoSection>
      
      <SectionTitle>Buttons & Interactions</SectionTitle>
      <DemoSection>
        <DemoRow>
          <DemoItem>
            <RippleButton onClick={() => playClickSound()}>
              Island Button
            </RippleButton>
            <ItemLabel>Ripple Button</ItemLabel>
          </DemoItem>
          
          <DemoItem>
            <Hoverable>
              <div style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#1A535C', 
                color: 'white',
                borderRadius: '4px'
              }}>
                Hover Me
              </div>
            </Hoverable>
            <ItemLabel>Hoverable Element</ItemLabel>
          </DemoItem>
          
          <DemoItem>
            <IslandToggle 
              isActive={isToggleActive} 
              onChange={setIsToggleActive} 
            />
            <ItemLabel>Island Toggle</ItemLabel>
          </DemoItem>
        </DemoRow>
        
        <DemoRow>
          <DemoItem>
            <RippleButton 
              onClick={() => playSuccessSound()} 
              backgroundColor="#4CAF50"
            >
              Success Sound
            </RippleButton>
          </DemoItem>
          
          <DemoItem>
            <RippleButton 
              onClick={() => playErrorSound()} 
              backgroundColor="#F44336"
            >
              Error Sound
            </RippleButton>
          </DemoItem>
        </DemoRow>
      </DemoSection>
      
      <SectionTitle>Interactive Cards</SectionTitle>
      <DemoSection>
        <DemoRow>
          <FlipCard
            frontContent={
              <div style={{ padding: '1rem' }}>
                <h3>Island Front</h3>
                <p>Click to flip</p>
              </div>
            }
            backContent={
              <div style={{ padding: '1rem' }}>
                <h3>Island Back</h3>
                <p>Hello from the other side</p>
              </div>
            }
          />
        </DemoRow>
      </DemoSection>
    </DemoContainer>
  );
}; 