# 🌴 VIBEZ FOUNDATION: Animation & Interaction Terminology 🏝️

This document defines the standardized terminology for animations and interactions used throughout the VIBEZ FOUNDATION platform to ensure consistency in documentation, code, and communication across teams.

## 🌊 Core Animation Concepts

### Animation Properties

| Term | Definition | Example Usage |
|------|------------|--------------|
| **Duration** | The length of time an animation takes to complete | `transition: { duration: 0.5 }` |
| **Easing** | The rate of change of animation over time (acceleration/deceleration) | `transition: { ease: [0.04, 0.62, 0.23, 0.98] }` |
| **Delay** | Time before an animation begins | `transition: { delay: 0.2 }` |
| **Stagger** | Sequential timing offset for multiple animated elements | `transition: { staggerChildren: 0.05 }` |
| **Loop** | Animation that repeats a specified number of times or infinitely | `transition: { repeat: Infinity }` |

### Animation Types

| Term | Definition | When to Use |
|------|------------|-------------|
| **Fade** | Change in opacity | Element entrance/exit, modals, notifications |
| **Scale** | Change in size | Buttons, interactive elements, emphasis |
| **Translate** | Movement along X, Y, or Z axis | Page transitions, element repositioning |
| **Rotate** | Angular movement around a point | Loading indicators, expandable elements |
| **Color Shift** | Transition between colors | Hover states, selection indicators, feedback |
| **Wave Motion** | Undulating movement resembling ocean waves | Page transitions, background elements |
| **Float** | Gentle vertical oscillation | UI elements to create "buoyancy" effect |

## 🏄‍♂️ User Interaction States

| State | Definition | Visual Treatment |
|-------|------------|------------------|
| **Default** | Normal, resting state | Standard appearance as defined in design system |
| **Hover** | Cursor is positioned over element | Subtle scale increase (1.02-1.05), brightness increase or shadow enhancement |
| **Focus** | Element has keyboard focus | Blue outline with sand texture, increased brightness |
| **Active/Pressed** | During click/tap action | Scale decrease (0.98), darker shade |
| **Selected** | Element is chosen/activated | Highlighted background, accent color border |
| **Disabled** | Element is unavailable | Reduced opacity (0.6), desaturated colors |
| **Loading** | Element is processing | Palm tree or wave animation |
| **Error** | Invalid state or action | Gentle shake animation, coral red highlight |
| **Success** | Completed action successfully | Brief scale pulse, green highlight, optional particle effect |

## 🌺 Interaction Patterns

| Pattern | Definition | Implementation |
|---------|------------|----------------|
| **Island Hopping** | Moving between major application sections | Page transitions with horizontal movement and wave effects |
| **Sand Ripples** | Visual feedback radiating from interaction point | Circular animation from touch/click point using Framer Motion |
| **Wave Wash** | Content transitioning in sequence | Staggered animations with children entering with slight delay |
| **Tide Validation** | Form validation that appears gradually | Progressive disclosure of validation messages with fade and slide |
| **Beach Pathway** | Guided user flow with clear direction | Visual indicators and animations directing to next step |
| **Palm Sway** | Gentle oscillation to draw attention | Subtle rotation and movement resembling palm trees in breeze |

## 📱 Responsive Animation Considerations

| Term | Definition | Implementation |
|------|------------|----------------|
| **Motion Reduction** | Simplified animations for users with motion sensitivity | Respect `prefers-reduced-motion` media query |
| **Progressive Enhancement** | Basic animations on all devices, enhanced on capable devices | Feature detection for advanced animation capabilities |
| **Performance Scaling** | Adjusting animation complexity based on device capability | Detect device performance and adjust accordingly |
| **Touch Adaptation** | Modifications to animations optimized for touch vs. pointer input | Different timing and feedback for touch devices |

## 🔄 Animation Timing Guidelines

| Interaction Type | Recommended Duration | Easing |
|------------------|---------------------|--------|
| Micro-interactions | 150-250ms | ease-out |
| Button feedback | 200-300ms | ease-in-out |
| Page transitions | 300-500ms | cubic-bezier(0.04, 0.62, 0.23, 0.98) |
| Loading states | 1000-2000ms | ease-in-out, looped |
| Success animations | 500-800ms | spring(40, 8, 0) |
| Form validation | 200-400ms | ease-out |

## 🔊 Sound Design Terminology

| Term | Definition | Example Usage |
|------|------------|--------------|
| **Earcon** | Brief, distinctive sound attached to specific actions | Button clicks, notifications, confirmations |
| **Ambient Audio** | Background soundscapes creating atmosphere | Ocean waves, gentle reggae instrumentals |
| **Interactive Audio** | Sounds triggered directly by user actions | Form submission, navigation, selection |
| **Feedback Audio** | Sounds indicating system status or response | Success, error, loading completion |
| **Audio Sprites** | Single audio file containing multiple short sounds | Efficient loading of multiple UI sounds |

---

⏱️ Last Updated: May 5, 2024 