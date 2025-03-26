import { create } from 'zustand';

/**
 * Sound management system for tropical island theme
 */

// Types for the sound system
export type SoundType = 
  | 'waves'    // Ocean wave sounds
  | 'success'  // Success action sound
  | 'error'    // Error action sound
  | 'click'    // UI interaction sound
  | 'ambient'  // Background ambient sounds
  | 'notification' // Notification sounds
  | 'celebration'; // Celebration sounds for accomplishments

// Sound asset paths
export const SOUND_PATHS: Record<SoundType, string> = {
  waves: '/sounds/waves.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  click: '/sounds/click.mp3',
  ambient: '/sounds/tropical-ambient.mp3',
  notification: '/sounds/notification.mp3',
  celebration: '/sounds/celebration.mp3'
};

// Interface for the sound store
interface SoundStore {
  muted: boolean;
  volume: number;
  playingAmbient: boolean;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playSound: (sound: SoundType) => void;
  startAmbient: () => void;
  stopAmbient: () => void;
}

// Audio instances cache to prevent multiple instantiations
const audioInstances: Partial<Record<SoundType, HTMLAudioElement>> = {};

// Create the sound store with Zustand
export const useSoundStore = create<SoundStore>((set, get) => ({
  muted: false,
  volume: 0.5,
  playingAmbient: false,

  setMuted: (muted) => set({ muted }),

  setVolume: (volume) => {
    set({ volume });
    
    // Update volume for all active audio instances
    Object.values(audioInstances).forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  },

  toggleMute: () => {
    const currentMuted = get().muted;
    set({ muted: !currentMuted });
    
    // Mute/unmute all active audio instances
    Object.values(audioInstances).forEach(audio => {
      if (audio) {
        audio.muted = !currentMuted;
      }
    });
  },

  playSound: (sound) => {
    const { muted, volume } = get();
    if (muted) return;

    // Create or reuse audio instance
    if (!audioInstances[sound]) {
      audioInstances[sound] = new Audio(SOUND_PATHS[sound]);
    }
    
    const audio = audioInstances[sound];
    if (audio) {
      audio.volume = volume;
      
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error(`Error playing sound ${sound}:`, error);
      });
    }
  },

  startAmbient: () => {
    const { muted, volume } = get();
    if (muted) return;

    // Create ambient audio if it doesn't exist
    if (!audioInstances.ambient) {
      const ambient = new Audio(SOUND_PATHS.ambient);
      ambient.loop = true;
      ambient.volume = volume * 0.3; // Ambient at lower volume
      audioInstances.ambient = ambient;
    }

    const ambient = audioInstances.ambient;
    if (ambient) {
      ambient.play().catch(error => {
        console.error('Error playing ambient sound:', error);
      });
      set({ playingAmbient: true });
    }
  },

  stopAmbient: () => {
    const ambient = audioInstances.ambient;
    if (ambient) {
      ambient.pause();
      set({ playingAmbient: false });
    }
  }
}));

/**
 * Hook to play UI interaction sounds
 */
export const useUISound = () => {
  const { playSound } = useSoundStore();
  
  return {
    playClickSound: () => playSound('click'),
    playSuccessSound: () => playSound('success'),
    playErrorSound: () => playSound('error'),
    playNotificationSound: () => playSound('notification'),
    playCelebrationSound: () => playSound('celebration'),
  };
};

/**
 * Component to preload sounds when the app initializes
 */
export const preloadSounds = (): void => {
  Object.entries(SOUND_PATHS).forEach(([type, path]) => {
    const audio = new Audio();
    audio.src = path;
    audio.preload = 'auto';
    audioInstances[type as SoundType] = audio;
  });
}; 