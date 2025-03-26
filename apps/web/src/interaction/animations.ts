import { Variants } from 'framer-motion';

/**
 * Island-themed animation variants for use with Framer Motion
 */

// Fade animations with tropical-inspired timing
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for tropical feel
    }
  },
  exit: {
    opacity: 0,
    transition: { 
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

// Wave animations for tropical elements
export const waveVariants: Variants = {
  idle: {
    y: 0,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 2,
      ease: 'easeInOut'
    }
  },
  wave: {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 2,
      ease: 'easeInOut'
    }
  }
};

// Page transitions with island-inspired motion
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Staggered children animations
export const staggerChildren: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Island-themed hover animations
export const tropicalHover = {
  scale: 1.05,
  y: -5,
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

// Transition presets
export const transitions = {
  bounce: {
    type: "spring",
    stiffness: 300,
    damping: 15
  },
  gentle: {
    duration: 0.6,
    ease: [0.43, 0.13, 0.23, 0.96]
  },
  swift: {
    duration: 0.3,
    ease: [0.43, 0.13, 0.23, 0.96]
  }
}; 