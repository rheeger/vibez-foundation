/**
 * Island-themed Interaction System
 * 
 * A comprehensive system for animations, sounds, and interactions
 * to bring the tropical island theme to life across the application.
 */

// Animations
export * from './animations';

// Loading indicators
export * from './loaders';

// Sound system
export * from './sound';

// Micro-interactions
export * from './microInteractions';

// Navigation interactions
export * from './navigation';

// Helper function to initialize all systems
export const initializeInteractionSystems = async (): Promise<void> => {
  // Import dynamically to avoid circular dependencies
  const soundModule = await import('./sound');
  
  // Preload sound effects
  soundModule.preloadSounds();
  
  // Log initialization
  console.info('🌴 Island interaction systems initialized');
}; 