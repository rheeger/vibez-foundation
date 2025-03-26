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
    easeOut: number[];
    easeIn: number[];
    easeInOut: number[];
    waveLike: number[];
  };
  
  // Animation preferences
  preferences: {
    reducedMotion: boolean;
    enableAnimations: boolean;
    enableSoundEffects: boolean;
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
  
  preferences: {
    reducedMotion: false,
    enableAnimations: true,
    enableSoundEffects: true
  }
};

interface AnimationContextType {
  config: AnimationConfig;
  setReducedMotion: (value: boolean) => void;
  setEnableAnimations: (value: boolean) => void;
  setEnableSoundEffects: (value: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AnimationConfig>(() => {
    // In a real app, you might get this from localStorage
    return defaultConfig;
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
    prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange as any);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionPreferenceChange as any);
    };
  }, []);
  
  // Preference setters
  const setReducedMotion = (value: boolean) => {
    setConfig(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        reducedMotion: value
      }
    }));
  };
  
  const setEnableAnimations = (value: boolean) => {
    setConfig(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        enableAnimations: value
      }
    }));
  };
  
  const setEnableSoundEffects = (value: boolean) => {
    setConfig(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        enableSoundEffects: value
      }
    }));
  };
  
  return (
    <AnimationContext.Provider
      value={{
        config,
        setReducedMotion,
        setEnableAnimations,
        setEnableSoundEffects
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