import React from 'react';
import { AnimationProvider } from './contexts/AnimationContext';
import { SoundProvider } from './contexts/SoundContext';
import WaterRippleDemo from './components/demo/WaterRippleDemo';

const App: React.FC = () => {
  return (
    <AnimationProvider>
      <SoundProvider>
        <WaterRippleDemo />
      </SoundProvider>
    </AnimationProvider>
  );
};

export default App; 