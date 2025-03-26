# 🌴 VIBEZ FOUNDATION: Sound Design Guidelines 🏝️

This document outlines the sound design approach, implementation strategies, and best practices for the VIBEZ FOUNDATION platform.

## 🎵 Sound Design Philosophy

Our sound design follows these guiding principles:

1. **Subtle Enhancement**: Sounds should enhance the user experience without being distracting or annoying.
2. **Island Atmosphere**: All audio elements should evoke a tropical, Caribbean atmosphere.
3. **Purposeful Design**: Each sound has a clear purpose and meaning in the interface.
4. **Universal Control**: Users must always have the ability to mute/control sounds.
5. **Accessibility First**: Audio should never be the sole indicator of important information.

## 🔊 Sound Categories & Usage

### Ambient Background

| Sound Type | Purpose | Duration | Volume Level | Usage Guidelines |
|------------|---------|----------|--------------|------------------|
| Ocean Waves | Background atmosphere | 60-120s loops | Very low (0.2) | Home page, dashboard |
| Gentle Reggae | Music backdrop | 90-180s loops | Low (0.3) | Optional music toggle |
| Island Ambience | Atmospheric enhancement | 60-120s loops | Very low (0.2) | Exploration areas |

### Interactive Feedback

| Sound Type | Purpose | Duration | Volume Level | When to Use |
|------------|---------|----------|--------------|-------------|
| Soft Water Splash | Button clicks | 200-300ms | Low (0.4) | Main action buttons |
| Gentle Wave | Hover feedback | 150-200ms | Very low (0.3) | Navigation items, cards |
| Steel Drum Note | Success feedback | 500-800ms | Medium (0.5) | Completion, confirmation |
| Soft Sand Shift | Form interaction | 100-150ms | Very low (0.3) | Form field focus/change |
| Light Marimba | Notification | 400-600ms | Medium (0.5) | New information, alerts |
| Wind Chimes | Achievement | 800-1200ms | Medium (0.6) | Celebrations, milestones |

### System Feedback

| Sound Type | Purpose | Duration | Volume Level | When to Use |
|------------|---------|----------|--------------|-------------|
| Soft Coral Warning | Error states | 300-400ms | Low (0.4) | Form errors, problems |
| Gentle Waves | Loading states | 1-2s loops | Very low (0.3) | During processing |
| Deep Wave Crash | Important alert | 500-700ms | Medium (0.5) | Critical information |
| Light Shaker | Minor notification | 200-300ms | Low (0.4) | Status updates |

## 🎛️ Sound Management System

### Core Sound Provider

```tsx
// src/contexts/SoundContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

interface SoundContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playSound: (soundId: SoundId) => void;
  stopSound: (soundId: SoundId) => void;
  stopAllSounds: () => void;
}

export type SoundId = 
  | 'buttonClick'
  | 'hover'
  | 'success'
  | 'error'
  | 'notification'
  | 'loading'
  | 'achievement'
  | 'ambientWaves'
  | 'ambientMusic';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    // Get from localStorage or default to false
    const saved = localStorage.getItem('vibez-sound-muted');
    return saved ? JSON.parse(saved) : false;
  });
  const [volume, setVolumeState] = useState<number>(() => {
    // Get from localStorage or default to 0.5
    const saved = localStorage.getItem('vibez-sound-volume');
    return saved ? JSON.parse(saved) : 0.5;
  });
  
  // Sound definitions
  const sounds = {
    buttonClick: new Howl({ src: ['/sounds/water-splash.mp3'], volume: 0.4 * volume }),
    hover: new Howl({ src: ['/sounds/gentle-wave.mp3'], volume: 0.3 * volume }),
    success: new Howl({ src: ['/sounds/steel-drum.mp3'], volume: 0.5 * volume }),
    error: new Howl({ src: ['/sounds/coral-warning.mp3'], volume: 0.4 * volume }),
    notification: new Howl({ src: ['/sounds/light-marimba.mp3'], volume: 0.5 * volume }),
    loading: new Howl({ 
      src: ['/sounds/gentle-waves-loop.mp3'], 
      volume: 0.3 * volume,
      loop: true 
    }),
    achievement: new Howl({ src: ['/sounds/wind-chimes.mp3'], volume: 0.6 * volume }),
    ambientWaves: new Howl({ 
      src: ['/sounds/ocean-waves-loop.mp3'], 
      volume: 0.2 * volume,
      loop: true,
      fade: [0, 0.2, 5000]
    }),
    ambientMusic: new Howl({ 
      src: ['/sounds/reggae-loop.mp3'], 
      volume: 0.3 * volume,
      loop: true,
      fade: [0, 0.3, 5000]
    })
  };
  
  // Set global mute state
  useEffect(() => {
    Howler.mute(isMuted);
    localStorage.setItem('vibez-sound-muted', JSON.stringify(isMuted));
  }, [isMuted]);
  
  // Handle volume changes
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('vibez-sound-volume', JSON.stringify(newVolume));
    
    // Update volume for all sounds
    Object.keys(sounds).forEach(key => {
      const soundId = key as SoundId;
      const baseVolume = getBaseVolume(soundId);
      sounds[soundId].volume(baseVolume * newVolume);
    });
  };
  
  // Get base volume for a sound
  const getBaseVolume = (soundId: SoundId): number => {
    switch (soundId) {
      case 'buttonClick': return 0.4;
      case 'hover': return 0.3;
      case 'success': return 0.5;
      case 'error': return 0.4;
      case 'notification': return 0.5;
      case 'loading': return 0.3;
      case 'achievement': return 0.6;
      case 'ambientWaves': return 0.2;
      case 'ambientMusic': return 0.3;
      default: return 0.5;
    }
  };
  
  // Toggle mute state
  const toggleMute = () => setIsMuted(!isMuted);
  
  // Play a sound
  const playSound = (soundId: SoundId) => {
    if (!isMuted) {
      sounds[soundId].play();
    }
  };
  
  // Stop a specific sound
  const stopSound = (soundId: SoundId) => {
    sounds[soundId].stop();
  };
  
  // Stop all sounds
  const stopAllSounds = () => {
    Object.keys(sounds).forEach(key => {
      sounds[key as SoundId].stop();
    });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      Object.keys(sounds).forEach(key => {
        sounds[key as SoundId].unload();
      });
    };
  }, []);
  
  // Listen for page visibility changes (pause sounds when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause ambient sounds when tab is not visible
        sounds.ambientWaves.pause();
        sounds.ambientMusic.pause();
      } else {
        // Resume if not muted
        if (!isMuted) {
          // Only restart if they were playing before
          if (sounds.ambientWaves._state === 'loaded') sounds.ambientWaves.play();
          if (sounds.ambientMusic._state === 'loaded') sounds.ambientMusic.play();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMuted]);
  
  return (
    <SoundContext.Provider value={{
      isMuted,
      volume,
      toggleMute,
      setVolume,
      playSound,
      stopSound,
      stopAllSounds
    }}>
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
```

### Sound Component Examples

```tsx
// Sound Toggle Component
export const SoundToggle = () => {
  const { isMuted, toggleMute } = useSound();
  
  return (
    <motion.button
      className="sound-toggle"
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
    </motion.button>
  );
};

// Volume Control Component
export const VolumeControl = () => {
  const { volume, setVolume, isMuted } = useSound();
  
  return (
    <div className="volume-control">
      <label htmlFor="volume-slider">Volume</label>
      <input
        id="volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        disabled={isMuted}
      />
    </div>
  );
};

// Sound Button Component
export const SoundButton = ({ onClick, children, soundId = 'buttonClick', ...props }) => {
  const { playSound } = useSound();
  
  const handleClick = (e) => {
    playSound(soundId);
    if (onClick) onClick(e);
  };
  
  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};
```

## 🎧 Accessibility Considerations

### Audio Alternatives

All sound feedback must have visual counterparts:

| Sound Type | Visual Alternative |
|------------|-------------------|
| Button Click | Visual state change (color, size) |
| Error Tone | Error message and icon |
| Success Sound | Success animation and icon |
| Notification | Visual notification with icon |
| Loading Sound | Loading animation |

### Implementation Examples

```tsx
// Accessible Notification
export const AccessibleNotification = ({ message, type, hasSound = true }) => {
  const { playSound } = useSound();
  
  useEffect(() => {
    if (hasSound) {
      switch (type) {
        case 'success':
          playSound('success');
          break;
        case 'error':
          playSound('error');
          break;
        default:
          playSound('notification');
      }
    }
  }, [message, type, hasSound, playSound]);
  
  return (
    <div className={`notification ${type}`} role="alert">
      <div className="notification-icon">
        {type === 'success' && <SuccessIcon />}
        {type === 'error' && <ErrorIcon />}
        {type === 'info' && <InfoIcon />}
      </div>
      <div className="notification-message">{message}</div>
    </div>
  );
};
```

### User Preferences

Always respect user preferences for sounds:

1. **First Visit**: Sounds should be enabled but at a low volume (0.3-0.4)
2. **User Settings**: Provide clear controls for:
   - Master sound toggle (on/off)
   - Volume level (0.0-1.0)
   - Categories of sounds (UI, Ambient, Notifications)
3. **Persistence**: Save sound preferences to localStorage
4. **Reduced Motion Connection**: If a user has `prefers-reduced-motion` enabled, consider defaulting sounds to off

## 📱 Mobile Sound Considerations

### Mobile-Specific Patterns

1. **Auto-Mute on Mobile**: Consider auto-muting on mobile by default
2. **Respect Silent Mode**: Detect and respect device silent mode
3. **Touch Feedbacks**: Use lighter sounds for touch feedback (to avoid fatigue)
4. **Data Usage**: Optimize sound file sizes for mobile
5. **Sound Preloading**: Only preload essential sounds on mobile

### Implementation Example

```tsx
// Mobile Sound Detection
useEffect(() => {
  // Check if mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Try to detect silent mode (iOS)
    const checkSilentMode = () => {
      const audio = new Audio();
      audio.volume = 0;
      
      // If we can't play, device might be in silent mode
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Normal mode - audio can play
            audio.pause();
          })
          .catch(() => {
            // Silent mode might be enabled
            setIsMuted(true);
          });
      }
    };
    
    checkSilentMode();
  }
}, []);
```

## 🔄 Sound Integration Patterns

### Interactive Elements

```tsx
// Interactive Button with Sound
export const SoundButton = ({ onClick, soundType = 'buttonClick', children, ...props }) => {
  const { playSound } = useSound();
  
  const handleClick = (e) => {
    playSound(soundType);
    if (onClick) onClick(e);
  };
  
  return (
    <button 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Interactive Card with Hover Sound
export const SoundCard = ({ children, ...props }) => {
  const { playSound } = useSound();
  
  return (
    <motion.div
      className="interactive-card"
      onHoverStart={() => playSound('hover')}
      onClick={() => playSound('buttonClick')}
      whileHover={{ scale: 1.03 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

### Form Feedback

```tsx
// Form Input with Sound Feedback
export const SoundFormField = ({ 
  label,
  error,
  success,
  onChange,
  ...props
}) => {
  const { playSound } = useSound();
  const [focused, setFocused] = useState(false);
  
  const handleFocus = () => {
    setFocused(true);
    playSound('hover');
  };
  
  const handleBlur = () => {
    setFocused(false);
  };
  
  // Play appropriate sounds on validation state changes
  useEffect(() => {
    if (error) {
      playSound('error');
    } else if (success) {
      playSound('success');
    }
  }, [error, success, playSound]);
  
  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      <input
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
```

### Background Music Management

```tsx
// Background Music Controller
export const BackgroundMusicController = () => {
  const { playSound, stopSound, isMuted } = useSound();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const toggleMusic = () => {
    if (isPlaying) {
      stopSound('ambientMusic');
      setIsPlaying(false);
    } else {
      playSound('ambientMusic');
      setIsPlaying(true);
    }
  };
  
  // Pause when muted
  useEffect(() => {
    if (isMuted && isPlaying) {
      stopSound('ambientMusic');
    } else if (!isMuted && isPlaying) {
      playSound('ambientMusic');
    }
  }, [isMuted, isPlaying, playSound, stopSound]);
  
  return (
    <button
      className={`music-control ${isPlaying ? 'playing' : ''}`}
      onClick={toggleMusic}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
      <span>Island Vibes</span>
    </button>
  );
};
```

## 🎼 Sound Asset Organization

### Directory Structure

```
/public
  /sounds
    /ui
      button-click.mp3
      hover.mp3
      success.mp3
      error.mp3
      notification.mp3
    /ambient
      ocean-waves.mp3
      island-breeze.mp3
      reggae-loop.mp3
    /feedback
      achievement.mp3
      completed.mp3
      warning.mp3
    /effects
      wave-splash.mp3
      palm-sway.mp3
      steel-drum.mp3
```

### Sound Sprite Implementation

For performance optimization, especially on mobile:

```tsx
// Sound sprite definition
const soundSprite = {
  src: ['/sounds/ui-sprite.mp3'],
  sprite: {
    buttonClick: [0, 300],
    hover: [400, 200],
    success: [700, 600],
    error: [1400, 400],
    notification: [1900, 500]
  }
};

// Usage
const uiSounds = new Howl(soundSprite);

// Play a specific sound from the sprite
uiSounds.play('buttonClick');
```

## 🧪 Sound Testing Guidelines

### Testing Checklist

- [ ] Verify all sounds play at appropriate times
- [ ] Confirm volume levels are balanced across all sounds
- [ ] Test mute functionality works properly
- [ ] Verify sounds stop when navigating away
- [ ] Test with various device volume settings
- [ ] Confirm sounds don't overlap or conflict
- [ ] Verify handling of rapid interactions (debounce)
- [ ] Test memory usage under heavy sound usage
- [ ] Confirm user preferences are properly saved

### Browser-Specific Considerations

| Browser | Consideration |
|---------|---------------|
| Safari | Requires user interaction before playing audio |
| Mobile Chrome | May throttle background audio |
| Firefox | Best support for audio control |
| IE/Edge | May have playback delay on first sound |

### Implementation Example

```tsx
// Sound initialization with browser detection
useEffect(() => {
  const initializeAudio = () => {
    // Safari and Mobile Chrome require user interaction
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobileChrome = /android.*chrome/i.test(navigator.userAgent);
    
    if (isSafari || isMobileChrome) {
      // Set a flag to initialize audio on first user interaction
      const handleFirstInteraction = () => {
        // Create and play a silent sound to unlock audio
        const unlockAudio = new Audio();
        unlockAudio.play().then(() => {
          // Audio is now unlocked
          setAudioUnlocked(true);
          
          // Remove event listeners
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        }).catch(err => {
          console.error('Failed to unlock audio:', err);
        });
      };
      
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
      
      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    } else {
      // Other browsers can initialize audio immediately
      setAudioUnlocked(true);
      return () => {};
    }
  };
  
  return initializeAudio();
}, []);
```

---

⏱️ Last Updated: May 5, 2024 