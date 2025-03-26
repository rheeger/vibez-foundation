import React, { createContext, useContext, useState, useEffect } from 'react';

// For this implementation, we'll create a simple sound context that can play sounds
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

// Fallback behavior to avoid actually playing sounds if audio files aren't available
const playSoundFallback = (id: SoundId) => {
  console.log(`[Sound Effect] Playing: ${id}`);
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [audioCache, setAudioCache] = useState<Record<SoundId, HTMLAudioElement | null>>({} as any);

  // Initialize audio elements - client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {  // Only run on client-side
      // Initialize audio elements
      const cache: Record<SoundId, HTMLAudioElement | null> = {} as any;
      
      (Object.keys(soundFiles) as SoundId[]).forEach(key => {
        try {
          // Attempt to create audio elements
          const audio = new Audio(soundFiles[key as keyof typeof soundFiles]);
          audio.preload = 'auto';
          audio.volume = key === 'buttonClick' ? 0.6 : 0.4;  // Different volume levels based on sound type
          cache[key] = audio;
        } catch (err) {
          console.error(`Failed to load sound: ${key}`, err);
          cache[key] = null;
        }
      });
      
      setAudioCache(cache);
    }
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playSound = (soundId: SoundId) => {
    if (isMuted || typeof window === 'undefined') return;
    
    if (audioCache[soundId]) {
      try {
        // Stop and reset current sound if it's already playing
        const sound = audioCache[soundId]!;
        sound.pause();
        sound.currentTime = 0;
        
        // Play the sound
        sound.play().catch(err => {
          console.error(`Error playing sound ${soundId}:`, err);
          playSoundFallback(soundId);
        });
      } catch (err) {
        console.error(`Error playing sound ${soundId}:`, err);
        playSoundFallback(soundId);
      }
    } else {
      // Fallback if sound isn't loaded
      playSoundFallback(soundId);
    }
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