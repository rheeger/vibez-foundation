import React, { useRef, useEffect, useState } from 'react';
// Import Ripples only on client side
// import { Ripples } from '@figliolia/ripples';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

// Define the Ripples type
type RipplesType = any; // This will be properly typed when dynamically imported

interface WaterRippleBackgroundProps {
  color?: string;
  dropRadius?: number;
  perturbance?: number;
  ambientRippleFrequency?: number;
  children?: React.ReactNode;
}

// Create a fallback component for SSR or when animations are disabled
const FallbackBackground: React.FC<{ 
  color: string; 
  children: React.ReactNode; 
}> = ({ color, children }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundImage: 'url(/images/coral-reef.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </div>
  </div>
);

export const WaterRippleBackground: React.FC<WaterRippleBackgroundProps> = ({
  color = '#1A9EE2',
  dropRadius = 20,
  perturbance = 0.015,
  ambientRippleFrequency = 6000,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ripplesInstance = useRef<RipplesType | null>(null);
  const ambientRippleTimer = useRef<NodeJS.Timeout | null>(null);
  const multiRippleTimer = useRef<NodeJS.Timeout | null>(null);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const [RipplesModule, setRipplesModule] = useState<{ Ripples: any } | null>(null);
  
  const { config } = useAnimation();
  const { playSound } = useSound();
  const { enableAnimations } = config.preferences;

  // Import Ripples dynamically when on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && enableAnimations) {
      import('@figliolia/ripples').then((module) => {
        setRipplesModule(module);
      }).catch(error => {
        console.error('Failed to load Ripples module:', error);
      });
    }
  }, [enableAnimations]);

  useEffect(() => {
    // Skip setup on server-side rendering or if module is not loaded yet
    if (typeof window === 'undefined' || !enableAnimations || !RipplesModule) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Use the coral reef image instead of a solid color
    const imageUrl = '/images/coral-reef.png';
    
    try {
      // Initialize the ripples effect with the image
      ripplesInstance.current = new RipplesModule.Ripples(container, {
        resolution: 768,
        dropRadius,
        perturbance,
        interactive: true,
        imageUrl
      });
    } catch (error) {
      console.error('Error initializing ripples effect:', error);
      return;
    }

    // Create a cluster of ripples to enhance interaction visuals
    const createRippleCluster = () => {
      if (!ripplesInstance.current || !container) return;
      
      const { width, height } = container.getBoundingClientRect();
      
      // Choose a random center point for the cluster
      const centerX = Math.random() * width;
      const centerY = Math.random() * height;
      
      // Create 2-3 ripples around the center point (reduced from 2-4)
      const clusterSize = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < clusterSize; i++) {
        // Calculate position with small offsets from center
        const radius = 30 + Math.random() * 40; // Distance from center
        const angle = Math.random() * Math.PI * 2; // Random angle
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Stagger the ripples slightly in time
        setTimeout(() => {
          if (ripplesInstance.current && x >= 0 && x <= width && y >= 0 && y <= height) {
            // Reduced strength for more subtle effect
            const strength = 0.15 + Math.random() * 0.2;
            ripplesInstance.current.drop(x, y, dropRadius * 0.6, strength);
          }
        }, i * 120); // Slightly quicker stagger
      }
      
      // Play a soft sound occasionally for clusters (reduced probability)
      if (Math.random() < 0.2) {
        playSound('hover');
      }
      
      // Schedule next cluster with more consistent timing (less random variation)
      multiRippleTimer.current = setTimeout(
        createRippleCluster,
        ambientRippleFrequency * 3 * (0.9 + Math.random() * 0.2)
      );
    };
    
    // Create ambient ripples with more even distribution and higher frequency
    const createAmbientRipple = () => {
      if (!ripplesInstance.current || !container) return;
      
      const { width, height } = container.getBoundingClientRect();
      
      // Use a grid-based approach with more cells for better distribution
      const gridCols = 5;
      const gridRows = 5;
      
      // Choose a random cell from the grid
      const cellX = Math.floor(Math.random() * gridCols);
      const cellY = Math.floor(Math.random() * gridRows);
      
      // Calculate position within the cell, with some randomness
      const cellWidth = width / gridCols;
      const cellHeight = height / gridRows;
      const x = cellX * cellWidth + Math.random() * cellWidth;
      const y = cellY * cellHeight + Math.random() * cellHeight;
      
      // Gentler strength for more subtle ambient ripples
      const strength = 0.15 + Math.random() * 0.2;
      
      // Add a drop at the calculated position
      ripplesInstance.current.drop(x, y, dropRadius * 0.7, strength);
      
      // Reduced sound frequency for ambient ripples
      if (Math.random() < 0.05) {
        playSound('hover');
      }
      
      // Schedule next ambient ripple with less variation for more consistent appearance
      // This creates a more continuous effect
      ambientRippleTimer.current = setTimeout(
        createAmbientRipple, 
        ambientRippleFrequency * (0.7 + Math.random() * 0.6)
      );
    };
    
    // Handle mouse move with more consistent ripple creation
    const handleMouseMove = (e: MouseEvent) => {
      if (!ripplesInstance.current || !container) return;
      
      const rect = container.getBoundingClientRect();
      
      // Get mouse position relative to container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Only create ripples if the mouse has moved enough
      if (lastMousePosition.current) {
        const { x: lastX, y: lastY } = lastMousePosition.current;
        const dx = x - lastX;
        const dy = y - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create ripples less frequently but more consistently
        if (distance > 30) {
          ripplesInstance.current.drop(x, y, dropRadius * 0.6, 0.3);
          lastMousePosition.current = { x, y };
          
          // Occasionally create a small, secondary ripple near the main one
          if (Math.random() < 0.3) {
            const secondaryX = x + (Math.random() * 40 - 20);
            const secondaryY = y + (Math.random() * 40 - 20);
            
            setTimeout(() => {
              if (ripplesInstance.current) {
                ripplesInstance.current.drop(secondaryX, secondaryY, dropRadius * 0.4, 0.2);
              }
            }, 100);
          }
        }
      } else {
        lastMousePosition.current = { x, y };
      }
    };
    
    // Handle mouse click with more impact
    const handleMouseClick = (e: MouseEvent) => {
      if (!ripplesInstance.current || !container) return;
      
      // Skip if clicking on an interactive element
      if ((e.target as HTMLElement).tagName === 'BUTTON' || 
          (e.target as HTMLElement).tagName === 'A' ||
          (e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).closest('[role="button"]')) {
        return;
      }
      
      const rect = container.getBoundingClientRect();
      
      // Get mouse position relative to container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create a stronger ripple for clicks, but still gentler than before
      ripplesInstance.current.drop(x, y, dropRadius * 2, 1.5);
      
      // Add 2-3 smaller, secondary ripples around the main click
      const secondaryCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < secondaryCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const secondaryX = x + Math.cos(angle) * distance;
        const secondaryY = y + Math.sin(angle) * distance;
        
        setTimeout(() => {
          if (ripplesInstance.current) {
            ripplesInstance.current.drop(secondaryX, secondaryY, dropRadius * 0.8, 0.7);
          }
        }, 100 + i * 80);
      }
      
      // Play splash sound for clicks
      playSound('buttonClick');
    };
    
    // Handle window resize
    const handleResize = () => {
      if (ripplesInstance.current) {
        ripplesInstance.current.updateSize();
      }
    };
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleMouseClick);
    
    // Start multiple ambient ripples for a more continuous effect
    createAmbientRipple();
    setTimeout(() => createAmbientRipple(), ambientRippleFrequency * 0.5);
    setTimeout(() => createAmbientRipple(), ambientRippleFrequency * 1.0);
    
    // Start ripple clusters on a delay
    setTimeout(() => createRippleCluster(), ambientRippleFrequency * 0.5);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleMouseClick);
      
      if (ambientRippleTimer.current) {
        clearTimeout(ambientRippleTimer.current);
      }
      
      if (multiRippleTimer.current) {
        clearTimeout(multiRippleTimer.current);
      }
      
      if (ripplesInstance.current) {
        ripplesInstance.current.destroy();
      }
    };
  }, [color, dropRadius, perturbance, enableAnimations, ambientRippleFrequency, playSound, RipplesModule]);

  // Skip rendering the water effect during server-side rendering
  if (typeof window === 'undefined' || !enableAnimations) {
    return <FallbackBackground color={color}>{children}</FallbackBackground>;
  }

  return (
    <div 
      ref={containerRef}
      className="water-ripple-background"
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundImage: 'url(/images/coral-reef.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div 
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default WaterRippleBackground; 