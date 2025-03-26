# 🌴 VIBEZ FOUNDATION: Key User Flow Prototypes 🏝️

This document outlines the core user flows for the VIBEZ FOUNDATION platform, with a focus on the interactive experience and animations for each step of these journeys.

## 🧩 Onboarding Flow

The onboarding flow introduces new users to the VIBEZ FOUNDATION platform and helps them create their first fund.

### Flow Stages

1. **Welcome Screen** - Introduction to the platform
2. **Value Proposition** - Explains the benefits of using VIBEZ
3. **How It Works** - Brief explanation of DAF mechanics
4. **Account Creation** - Email/password registration or social login
5. **Fund Creation Intro** - Prompts user to create their first fund

### Interactive Elements

#### Welcome Animation Sequence

```tsx
// src/components/onboarding/WelcomeAnimation.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

export const WelcomeAnimation = () => {
  const { config } = useAnimation();
  const { enableAnimations, reducedMotion } = config.preferences;
  
  // Island elements animation sequence
  const sunVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };
  
  const oceanVariants = {
    hidden: { opacity: 0, scaleX: 0.9 },
    visible: { 
      opacity: 1, 
      scaleX: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const palmVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 1.0,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };
  
  // Animation for palm trees swaying (if animations enabled and not reduced motion)
  const palmSwayAnimation = enableAnimations && !reducedMotion ? {
    rotate: [0, 2, 0, -2, 0],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut"
    }
  } : {};
  
  // Animation for ocean waves (if animations enabled and not reduced motion)
  const waveAnimation = enableAnimations && !reducedMotion ? {
    y: [0, -5, 0, -7, 0],
    transition: {
      repeat: Infinity,
      duration: 5,
      ease: "easeInOut"
    }
  } : {};
  
  return (
    <div className="welcome-animation-container">
      <motion.div 
        className="sun"
        variants={sunVariants}
        initial="hidden"
        animate="visible"
      />
      
      <motion.div 
        className="ocean"
        variants={oceanVariants}
        initial="hidden"
        animate="visible"
        whileInView={waveAnimation}
      />
      
      <motion.div 
        className="palm-tree left"
        variants={palmVariants}
        initial="hidden"
        animate="visible"
        whileInView={palmSwayAnimation}
      />
      
      <motion.div 
        className="palm-tree right"
        variants={palmVariants}
        initial="hidden"
        animate="visible"
        whileInView={palmSwayAnimation}
        style={{ transformOrigin: 'bottom center' }}
      />
      
      <motion.h1
        className="title"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Welcome to VIBEZ Foundation
      </motion.h1>
      
      <motion.p
        className="subtitle"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
      >
        Where giving feels like an island vacation
      </motion.p>
    </div>
  );
};
```

#### Onboarding Carousel

```tsx
// src/components/onboarding/OnboardingCarousel.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

const onboardingSteps = [
  {
    title: "Create Your Fund",
    description: "Set up your own Donor-Advised Fund with a tropical theme that makes giving feel like a vacation.",
    icon: "palm-fund"
  },
  {
    title: "Support Causes You Love",
    description: "Browse and donate to thousands of vetted nonprofits with just a few clicks.",
    icon: "heart-island"
  },
  {
    title: "Track Your Impact",
    description: "See how your donations create positive change through beautiful visualizations.",
    icon: "impact-wave"
  },
  {
    title: "Simplify Your Giving",
    description: "One tax receipt, unlimited giving. Manage all your philanthropy in one place.",
    icon: "umbrella-receipt"
  }
];

export const OnboardingCarousel = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { config, getResponsiveTransition } = useAnimation();
  const { playSound } = useSound();
  
  const { enableAnimations, reducedMotion } = config.preferences;
  const pageTransition = getResponsiveTransition('page');
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      playSound('buttonClick');
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      playSound('buttonClick');
      setCurrentStep(currentStep - 1);
    }
  };
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: pageTransition
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        ...pageTransition,
        duration: pageTransition.duration * 0.75
      }
    })
  };
  
  // Direction of slide animation
  const [[page, direction], setPage] = useState([0, 0]);
  
  const paginate = (newDirection: number) => {
    if (
      (currentStep === 0 && newDirection === -1) || 
      (currentStep === onboardingSteps.length - 1 && newDirection === 1)
    ) {
      return; // Don't paginate beyond limits
    }
    
    setPage([page + newDirection, newDirection]);
    setCurrentStep(currentStep + newDirection);
  };
  
  return (
    <div className="onboarding-carousel">
      <div className="carousel-container">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="carousel-slide"
          >
            <div className={`slide-icon ${onboardingSteps[currentStep].icon}`} />
            <h2>{onboardingSteps[currentStep].title}</h2>
            <p>{onboardingSteps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="carousel-controls">
        <button 
          onClick={() => paginate(-1)} 
          disabled={currentStep === 0}
          className="prev-button"
          aria-label="Previous slide"
        >
          <ArrowLeftIcon />
        </button>
        
        <div className="step-indicators">
          {onboardingSteps.map((_, index) => (
            <motion.button
              key={index}
              className={`step-dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => {
                const direction = index > currentStep ? 1 : -1;
                setPage([index, direction]);
                setCurrentStep(index);
              }}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                backgroundColor: index === currentStep ? '#1A9EE2' : '#CCCCCC'
              }}
              transition={{ duration: 0.2 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => paginate(1)} 
          disabled={currentStep === onboardingSteps.length - 1}
          className="next-button"
          aria-label="Next slide"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};
```

## 🏦 Fund Creation Flow

The fund creation flow guides users through establishing their Donor-Advised Fund with a tropical theme and initial funding.

### Flow Stages

1. **Fund Name & Description** - User enters fund details
2. **Funding Method** - Selection of funding source (credit card, bank, crypto)
3. **Initial Contribution** - Amount and payment information
4. **Fund Customization** - Optional themes and settings
5. **Review & Create** - Final confirmation
6. **Success & Next Steps** - Confirmation and guidance

### Interactive Elements

#### Multi-Step Form with Island Hopping Metaphor

```tsx
// src/components/funds/CreateFundForm.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

// Step components
import { FundDetailsStep } from './steps/FundDetailsStep';
import { FundingMethodStep } from './steps/FundingMethodStep';
import { InitialContributionStep } from './steps/InitialContributionStep';
import { FundCustomizationStep } from './steps/FundCustomizationStep';
import { ReviewStep } from './steps/ReviewStep';
import { SuccessStep } from './steps/SuccessStep';

export const CreateFundForm = () => {
  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fundingMethod: '',
    amount: '',
    paymentDetails: {},
    customization: {
      theme: 'classic-palm',
      visibility: 'public'
    }
  });
  
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  
  // Animation hooks
  const { config, getResponsiveTransition } = useAnimation();
  const { playSound } = useSound();
  const { enableAnimations, reducedMotion } = config.preferences;
  
  // Step definitions
  const steps = [
    { key: 'details', label: 'Fund Details', component: FundDetailsStep },
    { key: 'funding', label: 'Funding Method', component: FundingMethodStep },
    { key: 'amount', label: 'Initial Contribution', component: InitialContributionStep },
    { key: 'customize', label: 'Customization', component: FundCustomizationStep },
    { key: 'review', label: 'Review', component: ReviewStep },
    { key: 'success', label: 'Success', component: SuccessStep }
  ];
  
  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      playSound('buttonClick');
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      playSound('buttonClick');
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Form update handlers
  const updateFormData = (stepKey, data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Form submission
  const handleSubmit = async () => {
    setFormStatus('submitting');
    playSound('loading');
    
    try {
      // API call to create fund would go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      
      setFormStatus('success');
      playSound('success');
      setCurrentStep(steps.length - 1); // Move to success step
    } catch (error) {
      setFormStatus('error');
      playSound('error');
      console.error('Error creating fund:', error);
    }
  };
  
  // Animation variants
  const stepVariants = {
    initial: {
      opacity: 0,
      x: enableAnimations && !reducedMotion ? 100 : 0,
      y: enableAnimations && reducedMotion ? 50 : 0
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: getResponsiveTransition('page')
    },
    exit: {
      opacity: 0,
      x: enableAnimations && !reducedMotion ? -100 : 0,
      y: enableAnimations && reducedMotion ? -50 : 0,
      transition: {
        ...getResponsiveTransition('page'),
        duration: getResponsiveTransition('page').duration * 0.75
      }
    }
  };
  
  // Progress indicator animation
  const progressVariants = {
    initial: { width: '0%' },
    animate: { 
      width: `${(currentStep / (steps.length - 1)) * 100}%`,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };
  
  // Render current step component
  const CurrentStepComponent = steps[currentStep].component;
  
  return (
    <div className="create-fund-container">
      {/* Progress bar (styled as a wave) */}
      <div className="progress-container">
        <div className="step-indicators">
          {steps.slice(0, -1).map((step, index) => (
            <motion.div
              key={step.key}
              className={`step-indicator ${index <= currentStep ? 'active' : ''}`}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                backgroundColor: index <= currentStep ? '#1A9EE2' : '#CCCCCC'
              }}
              transition={{ duration: 0.3 }}
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
        
        <div className="progress-track">
          <motion.div
            className="progress-fill wave-fill"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </div>
      
      {/* Form steps */}
      <div className="form-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={steps[currentStep].key}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="step-container"
          >
            <h2 className="step-title">{steps[currentStep].label}</h2>
            
            <CurrentStepComponent
              formData={formData}
              updateFormData={(data) => updateFormData(steps[currentStep].key, data)}
              formStatus={formStatus}
            />
            
            {/* Navigation buttons */}
            {currentStep < steps.length - 1 && (
              <div className="form-navigation">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="back-button"
                    disabled={formStatus === 'submitting'}
                  >
                    Back
                  </button>
                )}
                
                {currentStep < steps.length - 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="next-button"
                    disabled={formStatus === 'submitting'}
                  >
                    Continue to {steps[currentStep + 1].label}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="submit-button"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Creating Fund...' : 'Create My Fund'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
```

#### Fund Creation Success Animation

```tsx
// src/components/funds/FundCreationSuccess.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

export const FundCreationSuccess = ({ fundName }) => {
  const { config } = useAnimation();
  const { playSound } = useSound();
  const { enableAnimations, reducedMotion } = config.preferences;
  
  // Play success sound and confetti on mount
  useEffect(() => {
    playSound('achievement');
    
    // Launch tropical confetti if animations enabled
    if (enableAnimations && !reducedMotion) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      
      const tropical_colors = ['#1A9EE2', '#FF8C42', '#39B54A', '#F2D0A4', '#FF6B6B'];
      
      // Create palm tree and island shapes for confetti
      const palm_tree = confetti.shapeFromText({ text: '🌴', scalar: 2 });
      const island = confetti.shapeFromText({ text: '🏝️', scalar: 2 });
      const sun = confetti.shapeFromText({ text: '☀️', scalar: 2 });
      
      (function frame() {
        const timeLeft = end - Date.now();
        
        if (timeLeft <= 0) return;
        
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: tropical_colors,
          shapes: [palm_tree, island, sun, 'circle'],
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: tropical_colors,
          shapes: [palm_tree, island, sun, 'circle'],
        });
        
        requestAnimationFrame(frame);
      }());
    }
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };
  
  return (
    <motion.div
      className="fund-creation-success"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="success-icon" variants={itemVariants}>
        <PalmTreeIcon size={64} />
      </motion.div>
      
      <motion.h1 variants={itemVariants}>
        Your Fund Has Been Created!
      </motion.h1>
      
      <motion.div className="fund-name" variants={itemVariants}>
        <h2>{fundName}</h2>
      </motion.div>
      
      <motion.p variants={itemVariants}>
        Congratulations! Your Donor-Advised Fund is ready for your generous giving journey.
      </motion.p>
      
      <motion.div className="action-buttons" variants={itemVariants}>
        <button className="primary-button">Start Donating</button>
        <button className="secondary-button">Visit Dashboard</button>
      </motion.div>
      
      <motion.div className="next-steps" variants={itemVariants}>
        <h3>Next Steps</h3>
        <ul>
          <li>Explore nonprofits to support</li>
          <li>Set up recurring donations</li>
          <li>Share your fund with others</li>
          <li>Track your impact</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
```

## 💸 Donation Flow

The donation flow guides users through the process of making donations from their fund to organizations of their choice.

### Flow Stages

1. **Organization Selection** - Browsing and choosing organizations
2. **Donation Details** - Amount and dedication options
3. **Review & Confirm** - Final verification
4. **Processing** - Transaction being processed
5. **Confirmation** - Success confirmation and impact

### Interactive Elements

#### Organization Selection Interface

```tsx
// src/components/donations/OrganizationSelector.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

export const OrganizationSelector = ({ onSelect }) => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { config, getResponsiveTransition } = useAnimation();
  const { playSound } = useSound();
  
  // Fetch organizations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API delay
        
        // Sample data
        const sampleOrgs = [
          { id: 1, name: 'Ocean Conservation Alliance', category: 'Environment', image: '/images/orgs/ocean.jpg' },
          { id: 2, name: 'Island Education Foundation', category: 'Education', image: '/images/orgs/education.jpg' },
          { id: 3, name: 'Caribbean Healthcare Initiative', category: 'Health', image: '/images/orgs/health.jpg' },
          { id: 4, name: 'Coral Reef Preservation', category: 'Environment', image: '/images/orgs/coral.jpg' },
          { id: 5, name: 'Tropical Music Academy', category: 'Arts', image: '/images/orgs/music.jpg' },
          // More organizations...
        ];
        
        setOrganizations(sampleOrgs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setIsLoading(false);
      }
    };
    
    fetchOrgs();
  }, []);
  
  // Handle organization selection
  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    playSound('buttonClick');
    
    if (onSelect) {
      onSelect(org);
    }
  };
  
  // Filter organizations based on search
  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };
  
  const orgCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };
  
  // Card hover animation
  const cardHoverAnimation = config.preferences.enableAnimations && !config.preferences.reducedMotion
    ? { 
        scale: 1.03, 
        y: -5, 
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        transition: getResponsiveTransition('hover')
      }
    : {};
  
  return (
    <div className="organization-selector">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {isLoading ? (
        <div className="loading-state">
          <motion.div
            className="palm-loader"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              transition: { repeat: Infinity, duration: 3 }
            }}
          />
          <p>Finding island-worthy causes...</p>
        </div>
      ) : (
        <motion.div
          className="organizations-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredOrgs.map(org => (
              <motion.div
                key={org.id}
                className={`org-card ${selectedOrg?.id === org.id ? 'selected' : ''}`}
                variants={orgCardVariants}
                whileHover={cardHoverAnimation}
                onClick={() => handleSelectOrg(org)}
                onHoverStart={() => playSound('hover')}
                layout
              >
                <div className="org-image-container">
                  <img src={org.image} alt={org.name} />
                </div>
                <div className="org-info">
                  <h3>{org.name}</h3>
                  <span className="category">{org.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredOrgs.length === 0 && (
            <div className="no-results">
              <p>No organizations found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')}>Clear Search</button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
```

#### Donation Confirmation Animation

```tsx
// src/components/donations/DonationConfirmation.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';
import { useSound } from '../../contexts/SoundContext';

export const DonationConfirmation = ({ donationData }) => {
  const { config } = useAnimation();
  const { playSound } = useSound();
  const { enableAnimations, reducedMotion } = config.preferences;
  
  useEffect(() => {
    // Play success sound
    playSound('achievement');
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };
  
  // Wave animation for impact visualization
  const waveAnimation = enableAnimations && !reducedMotion ? {
    pathLength: [0, 1],
    transition: { duration: 1.5, ease: "easeInOut" }
  } : { pathLength: 1 };
  
  return (
    <motion.div
      className="donation-confirmation"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="success-icon" variants={itemVariants}>
        <div className="palm-circle">
          <CheckIcon size={32} />
        </div>
      </motion.div>
      
      <motion.h1 variants={itemVariants}>
        Thank You for Your Donation!
      </motion.h1>
      
      <motion.div className="donation-details" variants={itemVariants}>
        <p>
          <strong>${donationData.amount}</strong> to <strong>{donationData.organization.name}</strong>
        </p>
        
        {donationData.dedication && (
          <p className="dedication">
            In {donationData.dedication.type} of {donationData.dedication.name}
          </p>
        )}
      </motion.div>
      
      <motion.div className="impact-visualization" variants={itemVariants}>
        <h3>Your Impact</h3>
        
        <div className="impact-graphic">
          <svg viewBox="0 0 400 100" className="wave-svg">
            <motion.path
              d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50 C350,20 400,80 400,50"
              fill="none"
              stroke="#1A9EE2"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={waveAnimation}
            />
            
            <motion.circle
              cx="370"
              cy="50"
              r="12"
              fill="#39B54A"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            />
          </svg>
          
          <div className="impact-text">
            <p>Your donation is on its way to making waves of change!</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div className="share-section" variants={itemVariants}>
        <h3>Share Your Generosity</h3>
        <div className="share-buttons">
          <button className="share-button twitter">
            <TwitterIcon /> Share on Twitter
          </button>
          <button className="share-button facebook">
            <FacebookIcon /> Share on Facebook
          </button>
        </div>
      </motion.div>
      
      <motion.div className="next-actions" variants={itemVariants}>
        <button className="primary-button">Return to My Fund</button>
        <button className="secondary-button">Make Another Donation</button>
      </motion.div>
    </motion.div>
  );
};
```

## 📊 Dashboard & Impact Visualization

The dashboard provides users with an overview of their fund, donations, and impact visualizations.

### Flow Components

1. **Fund Overview** - Fund balance and recent activity
2. **Donation History** - List of past donations
3. **Impact Metrics** - Visualization of donation impact
4. **Recommended Organizations** - Personalized recommendations

### Interactive Elements

#### Impact Visualization

```tsx
// src/components/dashboard/ImpactVisualization.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

export const ImpactVisualization = ({ impactData }) => {
  const { config } = useAnimation();
  const { enableAnimations, reducedMotion } = config.preferences;
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation control
  const controls = useAnimation();
  
  // Start animations when component becomes visible
  useEffect(() => {
    if (isVisible) {
      controls.start('visible');
    }
  }, [isVisible, controls]);
  
  // Categories of impact
  const impactCategories = [
    { name: 'Education', icon: '🏫', color: '#FF8C42', value: impactData.education || 0 },
    { name: 'Environment', icon: '🌊', color: '#1A9EE2', value: impactData.environment || 0 },
    { name: 'Health', icon: '❤️', color: '#FF6B6B', value: impactData.health || 0 },
    { name: 'Community', icon: '🏝️', color: '#39B54A', value: impactData.community || 0 },
    { name: 'Arts', icon: '🎭', color: '#F2D0A4', value: impactData.arts || 0 },
  ];
  
  // Find max value for scaling
  const maxValue = Math.max(...impactCategories.map(cat => cat.value));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const barVariants = {
    hidden: { scaleY: 0 },
    visible: (i) => ({
      scaleY: 1,
      transition: {
        duration: enableAnimations && !reducedMotion ? 0.8 : 0,
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: enableAnimations && !reducedMotion ? i * 0.1 : 0
      }
    })
  };
  
  return (
    <div 
      className="impact-visualization-container"
      ref={ref => {
        if (ref && typeof IntersectionObserver !== 'undefined') {
          const observer = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
                }
              });
            },
            { threshold: 0.1 }
          );
          observer.observe(ref);
        } else {
          // Fallback for browsers without IntersectionObserver
          setIsVisible(true);
        }
      }}
    >
      <h2>Your Impact Across Causes</h2>
      
      <motion.div
        className="impact-graph"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {impactCategories.map((category, index) => (
          <div key={category.name} className="impact-category">
            <div className="bar-container">
              <motion.div
                className="impact-bar"
                style={{ 
                  backgroundColor: category.color,
                  height: `${(category.value / maxValue) * 100}%`,
                  transformOrigin: 'bottom'
                }}
                custom={index}
                variants={barVariants}
              />
            </div>
            <div className="category-label">
              <span className="icon">{category.icon}</span>
              <span className="name">{category.name}</span>
            </div>
            <div className="value">${category.value}</div>
          </div>
        ))}
      </motion.div>
      
      <div className="impact-stats">
        <div className="stat">
          <h3>Total Impact</h3>
          <p className="amount">${impactData.total || 0}</p>
        </div>
        <div className="stat">
          <h3>Organizations Supported</h3>
          <p className="count">{impactData.organizationsCount || 0}</p>
        </div>
        <div className="stat">
          <h3>Top Category</h3>
          <p className="category">
            {impactCategories.sort((a, b) => b.value - a.value)[0].name}
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

⏱️ Last Updated: May 5, 2024 