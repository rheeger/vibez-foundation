# 🌴 VIBEZ FOUNDATION: Component Interaction Patterns 🏝️

This document outlines the standardized interaction patterns for UI components across the VIBEZ FOUNDATION platform, ensuring consistent behavior and user experience.

## 🧩 Core Component Patterns

### Button Interactions

| State | Visual Feedback | Animation | Sound (Optional) |
|-------|----------------|-----------|------------------|
| Default | Standard appearance | n/a | n/a |
| Hover | Scale: 1.03, enhanced shadow | Scale duration: 200ms, ease-out | Soft wave brush |
| Focus | Blue outline with sand texture | Fade-in outline: 150ms | n/a |
| Active/Pressed | Scale: 0.98, darker shade | Scale duration: 150ms, ease-out | Soft tap |
| Loading | Palm tree or wave animation | Infinite loop, 2s cycle | Gentle ambient loop |
| Success | Green pulse, optional confetti | 600ms spring animation | Steel drum note |
| Error | Gentle shake, red highlight | 400ms shake animation | Low warning tone |
| Disabled | 60% opacity, desaturated | 200ms fade to disabled state | n/a |

```tsx
// Standard Button Component with Interaction Patterns
export const IslandButton = ({ 
  children, 
  onClick, 
  isLoading, 
  isSuccess, 
  isError, 
  disabled,
  ...props 
}) => {
  const [playHoverSound] = useSound('/sounds/wave-brush.mp3', { volume: 0.5 });
  const [playTapSound] = useSound('/sounds/soft-tap.mp3', { volume: 0.6 });
  const [playSuccessSound] = useSound('/sounds/steel-drum.mp3', { volume: 0.7 });
  const [playErrorSound] = useSound('/sounds/warning-tone.mp3', { volume: 0.6 });
  
  const buttonVariants = {
    default: { scale: 1 },
    hover: { scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
    pressed: { scale: 0.98 },
    disabled: { opacity: 0.6 },
    loading: { opacity: 0.9 },
    success: { scale: [1, 1.05, 1], backgroundColor: "#39B54A" },
    error: { x: [0, -5, 5, -5, 5, 0], backgroundColor: "#F8333C" }
  };
  
  const getButtonState = () => {
    if (disabled) return "disabled";
    if (isLoading) return "loading";
    if (isSuccess) return "success";
    if (isError) return "error";
    return "default";
  };
  
  const currentState = getButtonState();
  
  return (
    <motion.button
      variants={buttonVariants}
      initial="default"
      animate={currentState}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "pressed" : undefined}
      onHoverStart={() => !disabled && playHoverSound()}
      onTapStart={() => !disabled && playTapSound()}
      transition={{ duration: 0.2 }}
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingIndicator /> : children}
    </motion.button>
  );
};
```

### Form Input Interactions

| State | Visual Feedback | Animation | Sound (Optional) |
|-------|----------------|-----------|------------------|
| Default | Standard appearance | n/a | n/a |
| Focus | Highlighted border, subtle glow | Fade-in: 200ms | Soft water drop |
| Typing | Subtle pulse on border | Small pulse on keystroke | Soft click (first few keys only) |
| Valid | Green check icon, success border | 300ms fade-in | Gentle success tone |
| Invalid | Red border, error icon, message | Message slides in: 300ms | Soft error note |
| Disabled | Gray background, reduced opacity | 200ms fade to disabled state | n/a |

```tsx
// Form Input Component with Interaction Patterns
export const BeachInput = ({
  label,
  error,
  success,
  onChange,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [playFocusSound] = useSound('/sounds/water-drop.mp3', { volume: 0.4 });
  const [playSuccessSound] = useSound('/sounds/success-tone.mp3', { volume: 0.5 });
  const [playErrorSound] = useSound('/sounds/error-note.mp3', { volume: 0.5 });
  
  const containerVariants = {
    default: { borderColor: "#CCCCCC" },
    focus: { borderColor: "#1A9EE2", boxShadow: "0 0 0 2px rgba(26, 158, 226, 0.2)" },
    success: { borderColor: "#39B54A" },
    error: { borderColor: "#F8333C" },
    disabled: { opacity: 0.6, backgroundColor: "#F5F5F5" }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    playFocusSound();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const getInputState = () => {
    if (disabled) return "disabled";
    if (isFocused) return "focus";
    if (error) return "error";
    if (success) return "success";
    return "default";
  };
  
  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <motion.div
        variants={containerVariants}
        animate={getInputState()}
        transition={{ duration: 0.2 }}
        className="input-wrapper"
      >
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="success-icon"
              onAnimationComplete={() => success && playSuccessSound()}
            >
              <CheckIcon />
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="error-icon"
              onAnimationComplete={() => error && playErrorSound()}
            >
              <AlertIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### Card Interactions

| State | Visual Feedback | Animation | Sound (Optional) |
|-------|----------------|-----------|------------------|
| Default | Standard appearance | n/a | n/a |
| Hover | Lifted appearance, enhanced shadow | Rise up 5px: 300ms | Gentle wave |
| Focus | Blue outline | Fade-in outline: 200ms | n/a |
| Active/Selected | Highlighted border/background | 300ms transition | Soft confirmation |
| Expanded | Grows to show more content | Expand: 400ms | n/a |
| Exit/Remove | Fade and slide out | 300ms fade + slide | Soft splash |

```tsx
// Interactive Card Component
export const IslandCard = ({
  children,
  onClick,
  isSelected,
  isExpandable,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playHoverSound] = useSound('/sounds/gentle-wave.mp3', { volume: 0.4 });
  const [playSelectSound] = useSound('/sounds/soft-confirmation.mp3', { volume: 0.5 });
  
  const cardVariants = {
    default: { y: 0, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" },
    hover: { y: -5, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.12)" },
    selected: { 
      borderColor: "#1A9EE2", 
      y: -3,
      boxShadow: "0 5px 12px rgba(26, 158, 226, 0.2)" 
    },
    expanded: { 
      height: "auto", 
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" 
    }
  };
  
  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
    if (onClick) {
      onClick();
      playSelectSound();
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="default"
      animate={isSelected ? "selected" : isExpanded ? "expanded" : "default"}
      whileHover="hover"
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={handleClick}
      onHoverStart={() => playHoverSound()}
      className={`island-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
      {...props}
    >
      {children}
      {isExpandable && (
        <motion.div
          className="expand-icon"
          initial={{ rotate: 0 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon />
        </motion.div>
      )}
    </motion.div>
  );
};
```

## 🌊 Navigation Patterns

### Main Navigation

| Interaction | Visual Feedback | Animation | Sound (Optional) |
|-------------|----------------|-----------|------------------|
| Hover | Subtle scale, brightness increase | 200ms scale + brightness | Soft wave splash |
| Selected | Highlighted with accent color | 300ms color transition | Steel drum note |
| Transition Between Sections | Wave-like page transition | 500ms page transition | Ocean ambience transition |

```tsx
// Main Navigation Component
export const IslandNavigation = ({ items, currentPath }) => {
  const [playSplashSound] = useSound('/sounds/wave-splash.mp3', { volume: 0.4 });
  const [playSelectSound] = useSound('/sounds/steel-drum-nav.mp3', { volume: 0.5 });
  
  const itemVariants = {
    default: { scale: 1, color: "#333333" },
    hover: { scale: 1.05, color: "#1A9EE2" },
    selected: { scale: 1, color: "#1A9EE2", fontWeight: 700 }
  };
  
  return (
    <nav className="island-navigation">
      <ul>
        {items.map(item => (
          <motion.li
            key={item.path}
            variants={itemVariants}
            initial="default"
            animate={currentPath === item.path ? "selected" : "default"}
            whileHover="hover"
            transition={{ duration: 0.2 }}
            onHoverStart={() => playSplashSound()}
            onClick={() => currentPath !== item.path && playSelectSound()}
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};
```

### Page Transitions

```tsx
// Page transition wrapper
export const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.5 }
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
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
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container"
    >
      {children}
    </motion.div>
  );
};

// Usage:
// In the main app router/layout
<AnimatePresence mode="wait">
  <PageTransition key={router.pathname}>
    <Component {...pageProps} />
  </PageTransition>
</AnimatePresence>
```

## 🎬 Feedback & Notification Patterns

### Toast/Notification

| Type | Visual Feedback | Animation | Sound (Optional) |
|------|----------------|-----------|------------------|
| Info | Blue background, wave icon | Slide in from top: 300ms | Gentle wave |
| Success | Green background, palm tree icon | Slide + scale: 400ms | Steel drum |
| Warning | Orange background, sun icon | Pulse animation: 400ms | Soft marimba |
| Error | Red background, warning icon | Shake + slide: 400ms | Warning tone |

```tsx
// Toast/Notification Component
export const IslandToast = ({ 
  type = 'info', 
  message, 
  onClose,
  duration = 5000,
  ...props 
}) => {
  const [playSoundEffect] = useSound(() => {
    switch (type) {
      case 'success': return '/sounds/steel-drum.mp3';
      case 'warning': return '/sounds/soft-marimba.mp3';
      case 'error': return '/sounds/warning-tone.mp3';
      default: return '/sounds/gentle-wave.mp3';
    }
  }, { volume: 0.5 });
  
  useEffect(() => {
    playSoundEffect();
  }, []);
  
  const toastVariants = {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };
  
  // Additional animations based on type
  const typeSpecificAnimations = {
    success: {},
    info: {},
    warning: {
      animate: {
        ...toastVariants.animate,
        y: [0, -3, 0],
        transition: {
          y: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
            ease: "easeInOut"
          }
        }
      }
    },
    error: {
      animate: {
        ...toastVariants.animate,
        x: [0, -2, 2, -2, 2, 0],
        transition: {
          x: {
            delay: 0.3,
            duration: 0.4
          }
        }
      }
    }
  };
  
  const variants = {
    ...toastVariants,
    ...(typeSpecificAnimations[type] || {})
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success': return <PalmTreeIcon />;
      case 'warning': return <SunIcon />;
      case 'error': return <WarningIcon />;
      default: return <WaveIcon />;
    }
  };
  
  // Auto-dismiss
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  return (
    <motion.div
      className={`island-toast ${type}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      {...props}
    >
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        {message}
      </div>
      <motion.button
        className="toast-close"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <CloseIcon />
      </motion.button>
    </motion.div>
  );
};
```

### Loading States

| Context | Visual Pattern | Animation | Sound (Optional) |
|---------|---------------|-----------|------------------|
| Page Loading | Full-screen palm trees and waves | Gentle sway, 2s cycle | Ocean waves ambient |
| Component Loading | Island silhouette or palm tree | Subtle bounce, 1.5s cycle | None |
| Button Loading | Small wave or palm animation | 1s rotation/wave cycle | None |
| Progress Bar | Wave filling from left | Fluid fill animation | Increasing pitch on completion |

```tsx
// PageLoader Component
export const PageLoader = () => {
  return (
    <motion.div
      className="page-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loader-content">
        <motion.div 
          className="palm-tree left"
          animate={{ 
            rotate: [-2, 2, -2],
            transition: {
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div 
          className="palm-tree right"
          animate={{ 
            rotate: [2, -2, 2],
            transition: {
              repeat: Infinity,
              duration: 3.2,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div 
          className="wave"
          animate={{ 
            y: [-5, 5, -5],
            transition: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div 
          className="loading-text"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }
          }}
        >
          Loading paradise...
        </motion.div>
      </div>
    </motion.div>
  );
};

// Wave Progress Bar Component
export const WaveProgressBar = ({ progress, ...props }) => {
  return (
    <div className="wave-progress-container" {...props}>
      <motion.div 
        className="wave-fill"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 50 
        }}
      >
        <motion.div 
          className="wave-top"
          animate={{ 
            x: [-20, 0, -20],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>
      <div className="progress-text">{Math.round(progress)}%</div>
    </div>
  );
};
```

## 🔄 Common Interaction Flows

### Form Submission Flow

```tsx
// Form submission component with validation and feedback
export const IslandForm = ({ onSubmit, initialValues, children }) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, validating, submitting, success, error
  
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    submitting: {
      opacity: 0.7,
    },
    success: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.5
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    setStatus('validating');
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setStatus('submitting');
      
      try {
        await onSubmit(values);
        setStatus('success');
        
        // Reset form after success animation
        setTimeout(() => {
          setStatus('idle');
          setValues(initialValues || {});
        }, 2000);
      } catch (error) {
        setStatus('error');
        setErrors({ form: error.message });
      }
    } else {
      setStatus('error');
    }
  };
  
  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate={status}
      className={`island-form status-${status}`}
      onSubmit={handleSubmit}
    >
      {/* Form fields rendered as children with specific props */}
      {typeof children === 'function' 
        ? children({ 
            values, 
            errors, 
            status, 
            handleChange: (name, value) => setValues({...values, [name]: value})
          }) 
        : children
      }
      
      {/* Status indicators */}
      {status === 'submitting' && <LoadingIndicator />}
      
      {status === 'success' && (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Success! Your information has been saved.
        </motion.div>
      )}
      
      {errors.form && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {errors.form}
        </motion.div>
      )}
    </motion.form>
  );
};
```

### Modal Dialog Interaction

```tsx
// Modal Component with Interactions
export const IslandModal = ({
  isOpen,
  onClose,
  title,
  children,
  ...props
}) => {
  const [playOpenSound] = useSound('/sounds/modal-open.mp3', { volume: 0.5 });
  const [playCloseSound] = useSound('/sounds/modal-close.mp3', { volume: 0.5 });
  
  useEffect(() => {
    if (isOpen) {
      playOpenSound();
    }
  }, [isOpen, playOpenSound]);
  
  const handleClose = () => {
    playCloseSound();
    onClose();
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
          />
          
          <motion.div
            className="island-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            {...props}
          >
            <div className="modal-header">
              <h2>{title}</h2>
              <motion.button
                className="close-button"
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <CloseIcon />
              </motion.button>
            </div>
            
            <div className="modal-content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

---

⏱️ Last Updated: May 5, 2024 