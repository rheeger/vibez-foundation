import React from 'react';
import { motion, useAnimation, MotionProps, Variants } from 'framer-motion';
import styled from 'styled-components';
import { transitions, tropicalHover } from './animations';
import { useUISound } from './sound';

/**
 * Library of micro-interactions to enhance the UI
 * with tropical island-themed animations and effects
 */

// =============== Hover Effects ===============

interface HoverableProps extends MotionProps {
  children: React.ReactNode;
  sound?: boolean;
  hoverScale?: number;
  hoverY?: number;
}

/**
 * Adds a tropical hover effect to any element
 */
export const Hoverable: React.FC<HoverableProps> = ({
  children,
  sound = true,
  hoverScale = 1.05,
  hoverY = -3,
  ...props
}) => {
  const { playClickSound } = useUISound();
  
  const handleHoverStart = () => {
    if (sound) {
      playClickSound();
    }
  };
  
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: transitions.gentle
      }}
      onHoverStart={handleHoverStart}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// =============== Button Effects ===============

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const ButtonContainer = styled(motion.button)<{
  $backgroundColor?: string;
  $size?: string;
  $fullWidth?: boolean;
}>`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor || '#4ECDC4'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  font-weight: 600;
  
  padding: ${({ $size }) => 
    $size === 'small' ? '8px 16px' : 
    $size === 'large' ? '14px 28px' : 
    '10px 20px'
  };
  
  font-size: ${({ $size }) => 
    $size === 'small' ? '14px' : 
    $size === 'large' ? '18px' : 
    '16px'
  };
`;

const RippleEffect = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  transform-origin: center;
`;

/**
 * Button with tropical ripple effect on click
 */
export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  color = 'white',
  backgroundColor = '#4ECDC4',
  size = 'medium',
  fullWidth = false
}) => {
  const rippleAnimation = useAnimation();
  const { playClickSound } = useUISound();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const { width, height, left, top } = button.getBoundingClientRect();
    
    // Calculate the ripple position relative to the button
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate the ripple size (diagonal of the button for full coverage)
    const rippleSize = Math.max(width, height) * 2;
    
    // Play click sound
    playClickSound();
    
    // Animate the ripple
    rippleAnimation.start({
      x,
      y,
      width: rippleSize,
      height: rippleSize,
      scale: 1.5,
      opacity: [0, 0.2, 0],
      transition: { duration: 0.6 }
    });
    
    // Call the provided onClick handler
    if (onClick) onClick();
  };

  return (
    <ButtonContainer
      $backgroundColor={backgroundColor}
      $size={size}
      $fullWidth={fullWidth}
      onClick={handleClick}
      whileHover={tropicalHover}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <RippleEffect
        initial={{ scale: 0, opacity: 0 }}
        animate={rippleAnimation}
      />
    </ButtonContainer>
  );
};

// =============== Focus Effects ===============

const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

/**
 * Wrapper to add error shake animation to form fields
 */
export const ShakeOnError: React.FC<{
  children: React.ReactNode;
  error: boolean;
  onComplete?: () => void;
}> = ({ children, error, onComplete }) => {
  const controls = useAnimation();
  const { playErrorSound } = useUISound();
  
  React.useEffect(() => {
    if (error) {
      playErrorSound();
      controls.start('shake').then(() => {
        if (onComplete) onComplete();
      });
    }
  }, [error, controls, onComplete, playErrorSound]);
  
  return (
    <motion.div
      animate={controls}
      variants={shakeVariants}
      initial="initial"
    >
      {children}
    </motion.div>
  );
};

// =============== Interactive Cards ===============

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  height?: string;
  width?: string;
}

const CardContainer = styled.div<{ $height?: string; $width?: string; }>`
  perspective: 1000px;
  height: ${props => props.$height || '200px'};
  width: ${props => props.$width || '300px'};
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const CardSide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CardFront = styled(CardSide)`
  background: linear-gradient(to bottom right, #4ECDC4, #1A535C);
  color: white;
`;

const CardBack = styled(CardSide)`
  background: linear-gradient(to bottom right, #FFE66D, #FF6B6B);
  color: #1A535C;
  transform: rotateY(180deg);
`;

/**
 * Interactive flip card with tropical styling
 */
export const FlipCard: React.FC<FlipCardProps> = ({
  frontContent,
  backContent,
  height,
  width
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const { playClickSound } = useUISound();
  
  const toggleFlip = () => {
    playClickSound();
    setIsFlipped(!isFlipped);
  };
  
  return (
    <CardContainer $height={height} $width={width} onClick={toggleFlip}>
      <CardInner
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={transitions.gentle}
      >
        <CardFront>{frontContent}</CardFront>
        <CardBack>{backContent}</CardBack>
      </CardInner>
    </CardContainer>
  );
};

// =============== Interactive Toggles ===============

interface IslandToggleProps {
  isActive: boolean;
  onChange: (active: boolean) => void;
  size?: 'small' | 'medium' | 'large';
}

const ToggleContainer = styled.div<{ $size: string }>`
  cursor: pointer;
  width: ${({ $size }) => 
    $size === 'small' ? '36px' : 
    $size === 'large' ? '60px' : '48px'
  };
  height: ${({ $size }) => 
    $size === 'small' ? '20px' : 
    $size === 'large' ? '32px' : '26px'
  };
  background-color: #B8B8B8;
  border-radius: 999px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
`;

const ToggleTrack = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  position: absolute;
  top: 0;
  left: 0;
`;

const ToggleThumb = styled(motion.div)<{ $size: string }>`
  width: ${({ $size }) => 
    $size === 'small' ? '16px' : 
    $size === 'large' ? '28px' : '22px'
  };
  height: ${({ $size }) => 
    $size === 'small' ? '16px' : 
    $size === 'large' ? '28px' : '22px'
  };
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
`;

const SunIcon = styled(motion.div)<{ $size: string }>`
  position: absolute;
  width: ${({ $size }) => 
    $size === 'small' ? '10px' : 
    $size === 'large' ? '18px' : '14px'
  };
  height: ${({ $size }) => 
    $size === 'small' ? '10px' : 
    $size === 'large' ? '18px' : '14px'
  };
  border-radius: 50%;
  background: #FFD700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

/**
 * Tropical-themed toggle switch with sun/moon animation
 */
export const IslandToggle: React.FC<IslandToggleProps> = ({
  isActive,
  onChange,
  size = 'medium'
}) => {
  const { playClickSound } = useUISound();
  
  const handleToggle = () => {
    playClickSound();
    onChange(!isActive);
  };
  
  return (
    <ToggleContainer $size={size} onClick={handleToggle}>
      <ToggleTrack
        animate={{
          backgroundColor: isActive ? '#4ECDC4' : '#B8B8B8'
        }}
      />
      <ToggleThumb
        $size={size}
        animate={{
          x: isActive 
            ? size === 'small' ? 16 : size === 'large' ? 28 : 22
            : 0
        }}
        transition={transitions.bounce}
      >
        <SunIcon
          $size={size}
          animate={{
            scale: isActive ? 1 : 0.6,
            backgroundColor: isActive ? '#FFD700' : '#DDDDDD'
          }}
        />
      </ToggleThumb>
    </ToggleContainer>
  );
}; 