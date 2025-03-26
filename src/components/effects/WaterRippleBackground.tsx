import React, { useRef, useEffect } from 'react';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

interface WaterRippleBackgroundProps {
  color?: string;
  dampening?: number;
  ambientRippleFrequency?: number;
  children?: React.ReactNode;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  strength: number;
  lifetime: number;
  maxLifetime: number;
}

export const WaterRippleBackground: React.FC<WaterRippleBackgroundProps> = ({
  color = '#1A9EE2',
  dampening = 0.97,
  ambientRippleFrequency = 3000,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const ripples = useRef<Ripple[]>([]);
  const ambientRippleTimer = useRef<NodeJS.Timeout | null>(null);
  
  const { config } = useAnimation();
  const { playSound } = useSound();
  const { enableAnimations } = config.preferences;

  // Previous and current buffer for water simulation
  const buffer1 = useRef<number[]>([]);
  const buffer2 = useRef<number[]>([]);
  const currentBuffer = useRef<number[]>([]);
  
  // Water simulation parameters
  const gridSize = 64; // Resolution of the water simulation grid
  
  useEffect(() => {
    if (!enableAnimations) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas and simulation
    const setupCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      
      // Initialize buffers based on grid size
      const totalCells = gridSize * gridSize;
      buffer1.current = new Array(totalCells).fill(0);
      buffer2.current = new Array(totalCells).fill(0);
      currentBuffer.current = buffer1.current;
    };
    
    // Handle window resize
    const handleResize = () => {
      setupCanvas();
    };
    
    // Add ripple at specific position
    const addRipple = (x: number, y: number, strength: number = 3, lifetime: number = 1000) => {
      ripples.current.push({
        x,
        y,
        radius: 1,
        strength,
        lifetime,
        maxLifetime: lifetime
      });
      
      // Draw initial ripple impact on the buffer
      const { width, height } = canvas;
      const gridX = Math.floor((x / width) * gridSize);
      const gridY = Math.floor((y / height) * gridSize);
      
      // Ensure we're within bounds
      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        const idx = gridY * gridSize + gridX;
        currentBuffer.current[idx] = strength * 50; // Initial displacement
        
        // Also affect surrounding cells to create a wider initial impact
        const radius = 2;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = gridX + dx;
            const ny = gridY + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance <= radius) {
                const falloff = 1 - (distance / radius);
                const nidx = ny * gridSize + nx;
                currentBuffer.current[nidx] += strength * 30 * falloff;
              }
            }
          }
        }
      }
    };
    
    // Create a random ambient ripple
    const createAmbientRipple = () => {
      const { width, height } = canvas;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const strength = 0.5 + Math.random() * 1.5; // Random strength between 0.5 and 2
      
      addRipple(x, y, strength, 1500 + Math.random() * 1000);
      
      // Very small splash sound for ambient ripples
      if (Math.random() < 0.3) { // Only play sound for 30% of ambient ripples to avoid too much noise
        playSound('hover');
      }
      
      // Schedule next ambient ripple
      ambientRippleTimer.current = setTimeout(
        createAmbientRipple, 
        ambientRippleFrequency * (0.5 + Math.random())
      );
    };
    
    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      // Only create ripples if the mouse has moved enough
      if (lastMousePosition.current) {
        const { x: lastX, y: lastY } = lastMousePosition.current;
        const dx = x - lastX;
        const dy = y - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          addRipple(x, y, 1, 800);
          lastMousePosition.current = { x, y };
        }
      } else {
        lastMousePosition.current = { x, y };
      }
    };
    
    // Handle mouse click
    const handleMouseClick = (e: MouseEvent) => {
      // Skip if clicking on an interactive element
      if ((e.target as HTMLElement).tagName === 'BUTTON' || 
          (e.target as HTMLElement).tagName === 'A' ||
          (e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).closest('[role="button"]')) {
        return;
      }
      
      const { left, top } = canvas.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      // Create a stronger ripple for clicks
      addRipple(x, y, 5, 1500);
      
      // Play splash sound for clicks
      playSound('buttonClick');
    };
    
    // Update water physics
    const updateWater = () => {
      // Swap buffers
      const current = currentBuffer.current === buffer1.current ? buffer1.current : buffer2.current;
      const next = currentBuffer.current === buffer1.current ? buffer2.current : buffer1.current;
      
      // Water wave propagation
      for (let y = 1; y < gridSize - 1; y++) {
        for (let x = 1; x < gridSize - 1; x++) {
          const idx = y * gridSize + x;
          
          // Sample neighbors
          const north = current[(y - 1) * gridSize + x];
          const south = current[(y + 1) * gridSize + x];
          const east = current[y * gridSize + x + 1];
          const west = current[y * gridSize + x - 1];
          
          // Average of the four neighbors
          next[idx] = (north + south + east + west) / 2 - next[idx];
          
          // Apply dampening
          next[idx] *= dampening;
        }
      }
      
      // Update current buffer reference for next frame
      currentBuffer.current = next;
      
      return next;
    };
    
    // Render the water 
    const renderWater = (buffer: number[]) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const { width, height } = canvas;
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;
      
      // Draw water surface
      ctx.fillStyle = color;
      
      for (let y = 0; y < gridSize - 1; y++) {
        for (let x = 0; x < gridSize - 1; x++) {
          const idx = y * gridSize + x;
          const value = buffer[idx];
          
          // Calculate positions
          const x1 = x * cellWidth;
          const y1 = y * cellHeight;
          const x2 = (x + 1) * cellWidth;
          const y2 = (y + 1) * cellHeight;
          
          // Use displacement for lighting effect
          const brightness = Math.min(1, Math.max(0.8, 0.9 + value * 0.01));
          const adjustedColor = adjustColorBrightness(color, brightness);
          
          // Draw cell
          ctx.fillStyle = adjustedColor;
          ctx.fillRect(x1, y1, cellWidth + 1, cellHeight + 1);
        }
      }
    };
    
    // Helper to adjust color brightness
    const adjustColorBrightness = (hexColor: string, factor: number) => {
      // Convert hex to RGB
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // Adjust brightness
      const adjustedR = Math.min(255, Math.max(0, Math.round(r * factor)));
      const adjustedG = Math.min(255, Math.max(0, Math.round(g * factor)));
      const adjustedB = Math.min(255, Math.max(0, Math.round(b * factor)));
      
      // Convert back to hex
      return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
    };
    
    // Main animation loop
    const animate = () => {
      // Update water physics
      const buffer = updateWater();
      
      // Update ripples
      const now = Date.now();
      ripples.current = ripples.current.filter(ripple => {
        ripple.radius += 1;
        ripple.lifetime -= 16.67; // Approximate milliseconds per frame
        return ripple.lifetime > 0;
      });
      
      // Render the water surface
      renderWater(buffer);
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    setupCanvas();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);
    
    // Start animation loop
    animate();
    
    // Start ambient ripples
    createAmbientRipple();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (ambientRippleTimer.current) {
        clearTimeout(ambientRippleTimer.current);
      }
    };
  }, [color, dampening, enableAnimations, ambientRippleFrequency, playSound]);

  return (
    <div 
      ref={containerRef}
      className="water-ripple-background"
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: color
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
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