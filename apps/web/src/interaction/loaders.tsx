import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { waveVariants, transitions } from './animations';

/**
 * Island-themed loading indicators
 */

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const WaveContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 40px;
  gap: 3px;
`;

const WaveBar = styled(motion.div)<{ index: number }>`
  width: 4px;
  height: ${props => 15 + props.index * 5}px;
  background: linear-gradient(to top, #4ECDC4, #2CB5E8);
  border-radius: 2px;
`;

const SunSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, #FFD700 30%, #FFA500 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:before {
    content: '';
    position: absolute;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid rgba(255, 165, 0, 0.3);
    border-top-color: #FFA500;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
`;

const PalmLoader = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const PalmTrunk = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 25px;
  background: linear-gradient(to top, #8B4513, #A0522D);
  border-radius: 2px;
`;

const PalmLeaf = styled(motion.div)<{ rotation: number }>`
  position: absolute;
  bottom: 22px;
  left: 50%;
  width: 20px;
  height: 8px;
  background: linear-gradient(to right, #32CD32, #228B22);
  border-radius: 50% 50% 0 0;
  transform-origin: 0 100%;
  transform: translateX(-50%) rotate(${props => props.rotation}deg);
`;

/**
 * Wave loading indicator with tropical colors
 */
export const WaveLoader: React.FC = () => {
  return (
    <WaveContainer>
      {[...Array(5)].map((_, index) => (
        <WaveBar
          key={index}
          index={index}
          variants={waveVariants}
          initial="idle"
          animate="wave"
          transition={{
            delay: index * 0.1,
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </WaveContainer>
  );
};

/**
 * Tropical sun spinner loading indicator
 */
export const SunLoader: React.FC = () => {
  return (
    <SpinnerContainer>
      <SunSpinner
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
      />
    </SpinnerContainer>
  );
};

/**
 * Palm tree loading indicator
 */
export const PalmTreeLoader: React.FC = () => {
  const leafAngles = [-40, -20, 0, 20, 40, 60, 80];
  
  return (
    <PalmLoader>
      <PalmTrunk
        animate={{ 
          height: ["25px", "27px", "25px"],
          scaleX: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />
      {leafAngles.map((angle, index) => (
        <PalmLeaf
          key={index}
          rotation={angle}
          animate={{ 
            rotate: [angle - 5, angle + 5, angle - 5] 
          }}
          transition={{
            duration: 2,
            delay: index * 0.1,
            repeat: Infinity
          }}
        />
      ))}
    </PalmLoader>
  );
};

/**
 * Loading indicator with configurable size and variant
 */
export const IslandLoader: React.FC<{
  variant?: 'sun' | 'wave' | 'palm';
  size?: 'small' | 'medium' | 'large';
}> = ({ variant = 'wave', size = 'medium' }) => {
  const getLoader = () => {
    switch (variant) {
      case 'sun':
        return <SunLoader />;
      case 'palm':
        return <PalmTreeLoader />;
      case 'wave':
      default:
        return <WaveLoader />;
    }
  };

  return (
    <div style={{ 
      transform: size === 'small' ? 'scale(0.7)' : 
                 size === 'large' ? 'scale(1.5)' : 'scale(1)'
    }}>
      {getLoader()}
    </div>
  );
}; 