import React, { createContext, useContext, useState, useEffect } from 'react';

// For this demo, we'll create a simple sound context that can play sounds
// In a real implementation, you would use a library like Howler.js

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundId: SoundId) => void;
}

export type SoundId = 
  | 'buttonClick'
  | 'hover'
  | 'success'
  | 'error'
  | 'notification';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Simple audio map for the demo
const soundFiles = {
  buttonClick: '/sounds/water-splash.mp3',
  hover: '/sounds/gentle-wave.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  notification: '/sounds/notification.mp3'
};

// Fallback behavior to avoid actually playing sounds in the demo
// In a real implementation, you would load and play actual sound files
const playSoundFallback = (id: SoundId) => {
  console.log(`[Sound Effect] Playing: ${id}`);
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playSound = (soundId: SoundId) => {
    if (isMuted) return;
    
    // In a real implementation, you would play actual sounds
    // For demo purposes, we'll just log to console
    playSoundFallback(soundId);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  
  return context;
}; 