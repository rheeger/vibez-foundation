# 🌴 VIBEZ FOUNDATION: Animation Standards & Timing Guidelines 🏝️

This document establishes the core standards for animations and transitions throughout the VIBEZ FOUNDATION platform, ensuring consistency, performance, and accessibility.

## 🌊 Animation Principles

Our animation system follows these core principles:

1. **Purpose Over Decoration**: Every animation should serve a clear purpose—guiding attention, providing feedback, or enhancing understanding.
2. **Island Rhythm**: Animations should feel natural and relaxed, like the gentle rhythm of island life.
3. **Progressive Disclosure**: Use animation to reveal information progressively, reducing cognitive load.
4. **Accessibility First**: All animations must be accessible, respectful of user preferences, and never disruptive.
5. **Performance Conscious**: Animations should be optimized for performance across all devices.

## ⏱️ Timing Guidelines

### Duration Standards

| Animation Type | Optimal Duration | Maximum Duration | Notes |
|----------------|------------------|------------------|-------|
| Micro-interactions | 150-250ms | 300ms | Keep very brief for frequent interactions |
| Hover/Focus | 200ms | 250ms | Quick enough to feel responsive |
| Button/Control | 200-300ms | 350ms | Slightly longer for primary actions |
| Page Transitions | 300-500ms | 700ms | Longer for major context shifts |
| Complex Notifications | 400-600ms | 800ms | Entrances can be slightly slower than exits |
| Loading States | 1000-2000ms | ∞ (looped) | Should loop smoothly for indeterminate waits |
| Success/Celebration | 500-800ms | 1200ms | Longer to create memorable moments |

### Easing Functions

| Purpose | Recommended Easing | Code Implementation | Visual Curve |
|---------|-------------------|---------------------|--------------|
| Standard UI Motion | ease-out | `[0, 0, 0.2, 1]` | Starts fast, ends slowly |
| Element Entrance | ease-out | `[0, 0, 0.2, 1]` | Quick arrival, gentle settle |
| Element Exit | ease-in | `[0.4, 0, 1, 1]` | Gentle start, quick departure |
| Page Transitions | ease-in-out | `[0.04, 0.62, 0.23, 0.98]` | Smooth start and end |
| Bouncy Feedback | spring | `{ type: "spring", stiffness: 100, damping: 10 }` | Natural bouncy motion |
| Flowing/Wave-like | custom cubic-bezier | `[0.25, 0.46, 0.45, 0.94]` | Simulates gentle wave motion |

### Staggered Animation Timing

For groups of elements (like lists, grids, or multi-part UI):

| Context | Stagger Delay | Maximum Total Duration | Example |
|---------|---------------|------------------------|---------|
| Small groups (2-5 items) | 50-75ms | 500ms | Navigation menu items |
| Medium groups (6-10 items) | 30-50ms | 700ms | Dashboard cards |
| Large groups (11+ items) | 15-30ms | 1000ms | Search results, lists |

## 🎭 Animation Implementation Standards

### Framer Motion Implementation

```tsx
// Standard page transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.04, 0.62, 0.23, 0.98] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 1, 1] 
    } 
  }
};

// Wave-like list stagger effect
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Usage:
<motion.ul
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### CSS Animation Standards

For simple animations that don't require JavaScript:

```css
/* Hover state standard */
.btn-primary {
  transition: transform 200ms ease-out, 
              box-shadow 200ms ease-out;
}

.btn-primary:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Loading animation example */
@keyframes palmSway {
  0% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
  100% { transform: rotate(-2deg); }
}

.loading-palm {
  animation: palmSway 2s ease-in-out infinite;
  transform-origin: bottom center;
}
```

## 🎮 Interaction Animation Patterns

### Button Interactions

```tsx
export const buttonVariants = {
  hover: { 
    scale: 1.03, 
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  },
  tap: { 
    scale: 0.98
  },
  disabled: { 
    opacity: 0.6
  }
};

// Usage:
<motion.button
  whileHover="hover"
  whileTap="tap"
  variants={buttonVariants}
  disabled={isDisabled}
  initial={isDisabled ? "disabled" : ""}
  animate={isDisabled ? "disabled" : ""}
>
  Submit
</motion.button>
```

### Form Feedback

```tsx
export const inputErrorVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { 
    opacity: 1, 
    height: "auto",
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2 }
  }
};

// Usage:
<AnimatePresence>
  {error && (
    <motion.div
      variants={inputErrorVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="error-message"
    >
      {error}
    </motion.div>
  )}
</AnimatePresence>
```

## 📱 Responsive Animation Guidelines

### Device-Specific Adjustments

| Device Type | Animation Adjustments | Performance Considerations |
|-------------|----------------------|---------------------------|
| Mobile Devices | Reduce animation distance by 25-30% | Avoid heavy filters and blurs |
| Low-Power Devices | Reduce animation duration by 15-20% | Minimize number of animated elements |
| High-End Devices | Full animation complexity | Can use more advanced effects |

### Implementation

```tsx
// Responsive animation example
const getResponsiveTransition = (isMobile) => ({
  scale: {
    duration: isMobile ? 0.2 : 0.3,
    ease: "easeOut"
  },
  opacity: {
    duration: isMobile ? 0.25 : 0.4,
    ease: "easeInOut"
  }
});

// Usage:
const isMobile = useBreakpointValue({ base: true, md: false });

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={getResponsiveTransition(isMobile)}
>
  {content}
</motion.div>
```

## ♿ Animation Accessibility

### Motion Reduction Support

Always respect user motion preferences:

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

const variants = {
  visible: prefersReducedMotion 
    ? { opacity: 1 }  // Simple fade only
    : { opacity: 1, y: 0 }  // Fade + movement
};

const transition = prefersReducedMotion
  ? { duration: 0.2 }  // Shorter duration
  : { duration: 0.4, type: "spring" };  // Full animation
```

### Animation Opt-Out

Always provide a way for users to disable non-essential animations:

```tsx
// Application settings provider example
export const AnimationSettingsProvider = ({ children }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  return (
    <AnimationContext.Provider value={{ animationsEnabled, setAnimationsEnabled }}>
      {children}
    </AnimationContext.Provider>
  );
};

// Usage in components
const { animationsEnabled } = useAnimationContext();

const transition = animationsEnabled 
  ? { type: "spring", stiffness: 400, damping: 10 }
  : { duration: 0 };  // Instant transition
```

## 🚀 Performance Guidelines

### Performance Optimization Techniques

1. **Animate only transform and opacity properties** when possible
2. **Avoid animating layout properties** that cause reflow (width, height, left, top)
3. **Use `will-change`** selectively for complex animations
4. **Cull animations** outside the viewport
5. **Throttle animations** on scroll events

### Implementation Examples

```tsx
// Efficient animation example
// Good: Only animates transform and opacity
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.3 }}
/>

// Avoid: Animating layout properties causes reflow
// <motion.div
//   initial={{ opacity: 0, width: "90%" }}
//   animate={{ opacity: 1, width: "100%" }}
//   exit={{ opacity: 0, width: "90%" }}
//   transition={{ duration: 0.3 }}
// />
```

## 📐 Animation Theme Provider

Create a ThemeProvider component that manages animation settings:

```tsx
// Animation settings in theme
export const theme = {
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
    },
    transitions: {
      button: {
        duration: 0.2,
        ease: [0, 0, 0.2, 1]
      },
      page: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  }
};

// Usage in components
const { animations } = useTheme();

<motion.div
  transition={{ 
    duration: animations.durations.medium,
    ease: animations.easings.waveLike
  }}
/>
```

---

⏱️ Last Updated: May 5, 2024 