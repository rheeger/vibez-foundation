import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styled from 'styled-components';
import { useUISound } from './sound';
import { transitions, fadeVariants } from './animations';

/**
 * Responsive navigation interactions with island theme
 */

// Media query breakpoints
const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
};

// =============== Mobile Navigation ===============

const MobileNavContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, rgba(74, 189, 172, 0.97), rgba(26, 83, 92, 0.97));
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const MenuButton = styled.button<{ isOpen: boolean }>`
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  position: relative;
  cursor: pointer;
  z-index: 200;
  
  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: ${({ isOpen }) => isOpen ? '#fff' : '#1A535C'};
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: ${transitions.gentle.duration}s ease-in-out;
    
    &:nth-child(1) {
      top: ${({ isOpen }) => isOpen ? '18px' : '10px'};
      transform: ${({ isOpen }) => isOpen ? 'rotate(135deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      top: 18px;
      opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
      left: ${({ isOpen }) => isOpen ? '-60px' : '0'};
    }
    
    &:nth-child(3) {
      top: ${({ isOpen }) => isOpen ? '18px' : '26px'};
      transform: ${({ isOpen }) => isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

const NavList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
`;

const NavItem = styled(motion.li)`
  font-size: 1.8rem;
  font-weight: 600;
  
  a {
    color: white;
    text-decoration: none;
    display: inline-block;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      bottom: -5px;
      left: 0;
      background-color: #FFE66D;
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease-out;
    }
    
    &:hover:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

const SocialContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  a {
    color: white;
    font-size: 1.5rem;
    
    &:hover {
      color: #FFE66D;
    }
  }
`;

// Animation variants
const navListVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const navItemVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.gentle,
  },
};

// Mobile Navigation Menu Component
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{
    title: string;
    path: string;
  }>;
}

export const MobileNavigation: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navLinks,
}) => {
  const { playClickSound } = useUISound();
  
  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MobileNavContainer
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={transitions.gentle}
        >
          <NavList
            variants={navListVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <NavItem 
                key={link.path} 
                variants={navItemVariants}
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
              >
                <a href={link.path}>{link.title}</a>
              </NavItem>
            ))}
          </NavList>
          
          <SocialContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ...transitions.gentle }}
          >
            {/* Social icons would go here */}
            <a href="#" onClick={(e) => e.preventDefault()}>🌴</a>
            <a href="#" onClick={(e) => e.preventDefault()}>🏝️</a>
            <a href="#" onClick={(e) => e.preventDefault()}>🥥</a>
          </SocialContainer>
        </MobileNavContainer>
      )}
    </AnimatePresence>
  );
};

// Menu Toggle Button Component
interface MenuToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, toggle }) => {
  const { playClickSound } = useUISound();
  
  const handleClick = () => {
    playClickSound();
    toggle();
  };
  
  return (
    <MenuButton isOpen={isOpen} onClick={handleClick}>
      <span></span>
      <span></span>
      <span></span>
    </MenuButton>
  );
};

// =============== Page Transitions ===============

// Page transition container
const PageTransitionContainer = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100vh;
  background: #4ECDC4;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const TransitionText = styled(motion.h1)`
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const wavePathVariants: Variants = {
  initial: {
    d: "M 0 100 Q 250 50 500 100 Q 750 150 1000 100 L 1000 0 L 0 0 Z",
  },
  animate: {
    d: "M 0 100 Q 250 150 500 100 Q 750 50 1000 100 L 1000 0 L 0 0 Z",
  },
  exit: {
    d: "M 0 0 Q 250 0 500 0 Q 750 0 1000 0 L 1000 0 L 0 0 Z",
  },
};

// Island-themed page transition component
interface PageTransitionProps {
  isAnimating: boolean;
  destinationLabel?: string;
  onAnimationComplete?: () => void;
}

export const IslandPageTransition: React.FC<PageTransitionProps> = ({
  isAnimating,
  destinationLabel,
  onAnimationComplete,
}) => {
  return (
    <AnimatePresence>
      {isAnimating && (
        <PageTransitionContainer
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
          onAnimationComplete={onAnimationComplete}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            style={{ position: 'absolute', top: 0 }}
          >
            <motion.path
              fill="#4ECDC4"
              variants={wavePathVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </svg>
          
          {destinationLabel && (
            <TransitionText
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ delay: 0.2, ...transitions.gentle }}
            >
              {destinationLabel}
            </TransitionText>
          )}
        </PageTransitionContainer>
      )}
    </AnimatePresence>
  );
};

// =============== Responsive Navigation Bar ===============

const NavbarContainer = styled.nav<{ transparent?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  z-index: 50;
  transition: all 0.3s ease;
  background-color: ${({ transparent }) => 
    transparent ? 'transparent' : 'rgba(255, 255, 255, 0.9)'};
  box-shadow: ${({ transparent }) => 
    transparent ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.1)'};
`;

const LogoContainer = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A535C;
`;

const DesktopNavContainer = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: none;
  }
`;

const MobileMenuContainer = styled.div`
  display: none;
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: block;
  }
`;

const NavLinkStyled = styled(motion.a)<{ isActive?: boolean }>`
  color: #1A535C;
  text-decoration: none;
  font-weight: ${({ isActive }) => isActive ? '600' : '400'};
  padding: 0.5rem 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #4ECDC4;
    transform: scaleX(${({ isActive }) => isActive ? '1' : '0'});
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }
  
  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

interface NavbarProps {
  transparent?: boolean;
  logo?: React.ReactNode;
  navLinks: Array<{
    title: string;
    path: string;
    isActive?: boolean;
  }>;
}

export const ResponsiveNavbar: React.FC<NavbarProps> = ({
  transparent = false,
  logo,
  navLinks,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { playClickSound } = useUISound();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLinkClick = () => {
    playClickSound();
  };
  
  return (
    <>
      <NavbarContainer transparent={transparent}>
        <LogoContainer
          whileHover={{ scale: 1.05 }}
          transition={transitions.gentle}
        >
          {logo || <span>🌴 VIBEZ</span>}
        </LogoContainer>
        
        <DesktopNavContainer>
          {navLinks.map((link) => (
            <NavLinkStyled
              key={link.path}
              href={link.path}
              isActive={link.isActive}
              onClick={handleLinkClick}
              whileHover={{ y: -2 }}
              transition={transitions.gentle}
            >
              {link.title}
            </NavLinkStyled>
          ))}
        </DesktopNavContainer>
        
        <MobileMenuContainer>
          <MenuToggle isOpen={isMenuOpen} toggle={toggleMenu} />
        </MobileMenuContainer>
      </NavbarContainer>
      
      <MobileNavigation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}; 