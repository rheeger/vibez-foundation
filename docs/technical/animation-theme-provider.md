# 🌴 VIBEZ FOUNDATION: Animation Theme Provider 🏝️

This document outlines the implementation of the Animation Theme Provider, which centralizes animation configuration and preferences across the VIBEZ FOUNDATION platform.

## 🎭 Purpose & Goals

The Animation Theme Provider serves several key purposes:

1. **Centralize animation configuration** in a single, manageable location
2. **Provide consistent animation patterns** across the application
3. **Respect user motion preferences** by honoring accessibility settings
4. **Optimize performance** by adapting animations based on device capability
5. **Simplify implementation** for developers through reusable animation presets

## 🛠️ Implementation

### Core Animation Context

```tsx
// src/contexts/AnimationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AnimationConfig {
  // Duration presets (in seconds)
  durations: {
    fast: number;
    medium: number;
    slow: number;
  };
  
  // Easing functions
  easings: {
    easeOut: number[];       // [0, 0, 0.2, 1]
    easeIn: number[];        // [0.4, 0, 1, 1]
    easeInOut: number[];     // [0.04, 0.62, 0.23, 0.98]
    waveLike: number[];      // [0.25, 0.46, 0.45, 0.94]
  };
  
  // Common transitions
  transitions: {
    button: {
      duration: number;
      ease: number[];
    };
    page: {
      duration: number;
      ease: number[];
    };
    modal: {
      duration: number;
      ease: number[];
    };
    hover: {
      duration: number;
      ease: number[];
    };
  };
  
  // Animation preferences
  preferences: {
    reducedMotion: boolean;
    enableAnimations: boolean;
    enableSoundEffects: boolean;
  };
  
  // Device capability
  performance: {
    level: 'high' | 'medium' | 'low';
    supportsAdvancedEffects: boolean;
  };
}

// Default configuration
const defaultConfig: AnimationConfig = {
  durations: {
    fast: 0.2,
    medium: 0.4, 
    slow: 0.7
  },
  
  easings: {
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeInOut: [0.04, 0.62, 0.23, 0.98],
    waveLike: [0.25, 0.46, 0.45, 0.94]
  },
  
  transitions: {
    button: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1]
    },
    page: {
      duration: 0.4,
      ease: [0.04, 0.62, 0.23, 0.98]
    },
    modal: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1]
    },
    hover: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1]
    }
  },
  
  preferences: {
    reducedMotion: false,
    enableAnimations: true,
    enableSoundEffects: true
  },
  
  performance: {
    level: 'high',
    supportsAdvancedEffects: true
  }
};

interface AnimationContextType {
  config: AnimationConfig;
  setReducedMotion: (value: boolean) => void;
  setEnableAnimations: (value: boolean) => void;
  setEnableSoundEffects: (value: boolean) => void;
  getResponsiveTransition: (type: keyof AnimationConfig['transitions']) => any;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AnimationConfig>(() => {
    // Check for saved preferences in localStorage
    const savedPreferences = localStorage.getItem('vibez-animation-preferences');
    const parsedPreferences = savedPreferences 
      ? JSON.parse(savedPreferences) 
      : {};
    
    return {
      ...defaultConfig,
      preferences: {
        ...defaultConfig.preferences,
        ...parsedPreferences
      }
    };
  });
  
  // Detect reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreferenceChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setConfig(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          reducedMotion: event.matches
        }
      }));
    };
    
    // Initial check
    handleMotionPreferenceChange(prefersReducedMotion);
    
    // Listen for changes
    prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);
  
  // Detect device performance capability
  useEffect(() => {
    const detectPerformanceLevel = () => {
      // Simple heuristic based on navigator.hardwareConcurrency
      const cores = navigator.hardwareConcurrency || 0;
      
      let performanceLevel: 'high' | 'medium' | 'low' = 'medium';
      
      if (cores >= 6) {
        performanceLevel = 'high';
      } else if (cores >= 2) {
        performanceLevel = 'medium';
      } else {
        performanceLevel = 'low';
      }
      
      // Check for advanced capabilities
      const supportsAdvancedEffects = !!(
        window.matchMedia('(min-resolution: 2dppx)').matches &&
        performanceLevel !== 'low'
      );
      
      setConfig(prev => ({
        ...prev,
        performance: {
          level: performanceLevel,
          supportsAdvancedEffects
        }
      }));
    };
    
    detectPerformanceLevel();
  }, []);
  
  // Preference setters
  const setReducedMotion = (value: boolean) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        preferences: {
          ...prev.preferences,
          reducedMotion: value
        }
      };
      
      // Save to localStorage
      localStorage.setItem(
        'vibez-animation-preferences',
        JSON.stringify(newConfig.preferences)
      );
      
      return newConfig;
    });
  };
  
  const setEnableAnimations = (value: boolean) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        preferences: {
          ...prev.preferences,
          enableAnimations: value
        }
      };
      
      localStorage.setItem(
        'vibez-animation-preferences',
        JSON.stringify(newConfig.preferences)
      );
      
      return newConfig;
    });
  };
  
  const setEnableSoundEffects = (value: boolean) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        preferences: {
          ...prev.preferences,
          enableSoundEffects: value
        }
      };
      
      localStorage.setItem(
        'vibez-animation-preferences',
        JSON.stringify(newConfig.preferences)
      );
      
      return newConfig;
    });
  };
  
  // Get responsive transition based on device performance and preferences
  const getResponsiveTransition = (type: keyof AnimationConfig['transitions']) => {
    const baseTransition = config.transitions[type];
    const { reducedMotion, enableAnimations } = config.preferences;
    const { level } = config.performance;
    
    // If animations are disabled, return instant transition
    if (!enableAnimations) {
      return { duration: 0 };
    }
    
    // If reduced motion is enabled, use simplified transition
    if (reducedMotion) {
      return {
        duration: baseTransition.duration * 0.5,
        ease: 'easeOut'
      };
    }
    
    // Adjust based on performance level
    const durationMultiplier = 
      level === 'high' ? 1 :
      level === 'medium' ? 0.85 :
      0.7;
    
    return {
      duration: baseTransition.duration * durationMultiplier,
      ease: baseTransition.ease
    };
  };
  
  return (
    <AnimationContext.Provider
      value={{
        config,
        setReducedMotion,
        setEnableAnimations,
        setEnableSoundEffects,
        getResponsiveTransition
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  
  return context;
};
```

### Animation Preference UI

```tsx
// src/components/settings/AnimationSettings.tsx
import React from 'react';
import { Switch, FormControl, FormLabel, VStack, HStack, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

export const AnimationSettings = () => {
  const { 
    config, 
    setReducedMotion,
    setEnableAnimations,
    setEnableSoundEffects
  } = useAnimation();
  
  const { setVolume, volume } = useSound();
  
  const { reducedMotion, enableAnimations, enableSoundEffects } = config.preferences;
  
  return (
    <VStack spacing={6} align="stretch">
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0" htmlFor="enable-animations">
          Enable Animations
        </FormLabel>
        <Switch 
          id="enable-animations" 
          isChecked={enableAnimations}
          onChange={(e) => setEnableAnimations(e.target.checked)}
          colorScheme="teal"
        />
      </FormControl>
      
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0" htmlFor="reduced-motion">
          Reduce Motion (Simplified Animations)
        </FormLabel>
        <Switch 
          id="reduced-motion" 
          isChecked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
          colorScheme="teal"
          isDisabled={!enableAnimations}
        />
      </FormControl>
      
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0" htmlFor="enable-sound-effects">
          Enable Sound Effects
        </FormLabel>
        <Switch 
          id="enable-sound-effects" 
          isChecked={enableSoundEffects}
          onChange={(e) => setEnableSoundEffects(e.target.checked)}
          colorScheme="teal"
        />
      </FormControl>
      
      <FormControl isDisabled={!enableSoundEffects}>
        <FormLabel htmlFor="volume-slider">Sound Volume</FormLabel>
        <Slider
          id="volume-slider"
          value={volume}
          min={0}
          max={1}
          step={0.1}
          onChange={setVolume}
          colorScheme="teal"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      
      <Text fontSize="sm" color="gray.500">
        These settings help you customize the motion and sound experience.
        Your preferences will be remembered across visits.
      </Text>
    </VStack>
  );
};
```

## 📊 Usage Examples

### Basic Component with Animations

```tsx
// src/components/common/IslandButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

interface IslandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const IslandButton: React.FC<IslandButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  ...props
}) => {
  const { config, getResponsiveTransition } = useAnimation();
  const { playSound } = useSound();
  
  const { enableAnimations, reducedMotion } = config.preferences;
  
  // Get appropriate transition based on preferences and device capabilities
  const buttonTransition = getResponsiveTransition('button');
  
  // Base variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: enableAnimations 
      ? { 
          scale: reducedMotion ? 1 : 1.03, 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" 
        }
      : {},
    tap: enableAnimations 
      ? { 
          scale: reducedMotion ? 1 : 0.98
        }
      : {},
  };
  
  const handleHoverStart = () => {
    if (config.preferences.enableSoundEffects && !isLoading && !props.disabled) {
      playSound('hover');
    }
  };
  
  const handleTap = () => {
    if (config.preferences.enableSoundEffects && !isLoading && !props.disabled) {
      playSound('buttonClick');
    }
  };
  
  return (
    <motion.button
      className={`island-button ${variant} ${isLoading ? 'loading' : ''}`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={buttonTransition}
      onHoverStart={handleHoverStart}
      onTap={handleTap}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="loading-indicator">
          <span className="sr-only">Loading</span>
          {/* Loading animation that respects motion preferences */}
          <motion.div
            className="palm-loader"
            animate={
              enableAnimations && !reducedMotion
                ? {
                    rotate: [0, 10, 0, -10, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 2.5,
                    },
                  }
                : {}
            }
          />
        </div>
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          <span className="button-text">{children}</span>
        </>
      )}
    </motion.button>
  );
};
```

### Page Transition Component

```tsx
// src/components/layout/PageTransition.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { config, getResponsiveTransition } = useAnimation();
  const { enableAnimations, reducedMotion } = config.preferences;
  
  // Get responsive transition based on preferences and device capabilities
  const pageTransition = getResponsiveTransition('page');
  
  // Define variants based on animation preferences
  const pageVariants = {
    initial: enableAnimations
      ? {
          opacity: 0,
          y: reducedMotion ? 0 : 20,
        }
      : { opacity: 1 },
    animate: {
      opacity: 1,
      y: 0,
      transition: pageTransition,
    },
    exit: enableAnimations
      ? {
          opacity: 0,
          y: reducedMotion ? 0 : -20,
          transition: {
            ...pageTransition,
            duration: pageTransition.duration * 0.75,
          },
        }
      : { opacity: 1 },
  };
  
  return (
    <motion.div
      className="page-transition"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

// Usage in app layout with AnimatePresence
// src/components/layout/AppLayout.tsx
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';

export const AppLayout = ({ children, router }) => {
  return (
    <div className="app-layout">
      <Header />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={router.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
```

### Motion Preference Hook

```tsx
// src/hooks/useMotionPreference.tsx
import { useAnimation } from '../contexts/AnimationContext';

export const useMotionPreference = () => {
  const { config } = useAnimation();
  const { reducedMotion, enableAnimations } = config.preferences;
  
  // No animations
  if (!enableAnimations) {
    return {
      shouldAnimate: false,
      shouldReduceMotion: true,
      duration: {
        fast: 0,
        medium: 0,
        slow: 0
      }
    };
  }
  
  // Reduced animations
  if (reducedMotion) {
    return {
      shouldAnimate: true,
      shouldReduceMotion: true,
      duration: {
        fast: config.durations.fast * 0.5,
        medium: config.durations.medium * 0.5,
        slow: config.durations.slow * 0.5
      }
    };
  }
  
  // Full animations
  return {
    shouldAnimate: true,
    shouldReduceMotion: false,
    duration: config.durations
  };
};

// Usage example
const MyAnimatedComponent = () => {
  const { shouldAnimate, shouldReduceMotion, duration } = useMotionPreference();
  
  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration.medium,
        ease: 'easeOut'
      }
    }
  };
  
  return shouldAnimate ? (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      Animated content
    </motion.div>
  ) : (
    <div>Static content</div>
  );
};
```

## 🎨 Theme Integration

The Animation Theme Provider works in conjunction with the application's design system, integrating with theme values for a consistent experience.

```tsx
// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  // Color, typography, spacing, etc.
  
  // Animation configuration that syncs with AnimationProvider
  animations: {
    durations: {
      fast: 0.2,
      medium: 0.4,
      slow: 0.7
    },
    easings: {
      easeOut: [0, 0, 0.2, 1],
      easeIn: [0.4, 0, 1, 1],
      easeInOut: [0.04, 0.62, 0.23, 0.98],
      waveLike: [0.25, 0.46, 0.45, 0.94]
    }
  }
});

// Integration in main app
// src/pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { AnimationProvider } from '../contexts/AnimationContext';
import { SoundProvider } from '../contexts/SoundContext';
import { theme } from '../theme';

function MyApp({ Component, pageProps, router }) {
  return (
    <ChakraProvider theme={theme}>
      <AnimationProvider>
        <SoundProvider>
          <AppLayout router={router}>
            <Component {...pageProps} />
          </AppLayout>
        </SoundProvider>
      </AnimationProvider>
    </ChakraProvider>
  );
}

export default MyApp;
```

## 📱 Motion Detection Implementation

```tsx
// src/hooks/useMotionDetection.tsx
import { useState, useEffect } from 'react';

interface MotionCapabilities {
  prefersReducedMotion: boolean;
  devicePerformance: 'high' | 'medium' | 'low';
  supportsAdvancedEffects: boolean;
}

export const useMotionDetection = (): MotionCapabilities => {
  const [capabilities, setCapabilities] = useState<MotionCapabilities>({
    prefersReducedMotion: false,
    devicePerformance: 'medium',
    supportsAdvancedEffects: true
  });
  
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Detect device performance
    const detectPerformance = () => {
      const cores = navigator.hardwareConcurrency || 0;
      
      // Simple heuristic for device performance
      let performanceLevel: 'high' | 'medium' | 'low' = 'medium';
      
      if (cores >= 6) {
        performanceLevel = 'high';
      } else if (cores >= 2) {
        performanceLevel = 'medium';
      } else {
        performanceLevel = 'low';
      }
      
      // Battery status (if available)
      if ('getBattery' in navigator) {
        // @ts-ignore - Not in all typescript definitions
        navigator.getBattery().then((battery: any) => {
          // Reduce performance level if battery is low and not charging
          if (battery.level < 0.2 && !battery.charging && performanceLevel !== 'low') {
            performanceLevel = 'medium';
          }
        }).catch(() => {
          // Battery API failed, continue with current performance level
        });
      }
      
      // Check for advanced capabilities
      const devicePixelRatio = window.devicePixelRatio || 1;
      const supportsAdvancedEffects = devicePixelRatio >= 1.5 && performanceLevel !== 'low';
      
      setCapabilities({
        prefersReducedMotion: prefersReducedMotionQuery.matches,
        devicePerformance: performanceLevel,
        supportsAdvancedEffects
      });
    };
    
    // Initial detection
    detectPerformance();
    
    // Listen for reduced motion preference changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({
        ...prev,
        prefersReducedMotion: e.matches
      }));
    };
    
    prefersReducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      prefersReducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);
  
  return capabilities;
};
```

---

⏱️ Last Updated: May 5, 2024 