import React from 'react';
import WaterRippleBackground from '../effects/WaterRippleBackground';

const WaterRippleDemo: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <WaterRippleBackground color="#1A9EE2">
        <div style={{ 
          padding: '40px', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🌊 Water Ripple Effect 🏝️</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '30px' }}>
            Move your cursor across the blue background to create gentle ripples, like skimming your hand through water.
            Click on any empty area to create a bigger splash!
          </p>
          <p style={{ fontSize: '1rem', maxWidth: '600px', opacity: 0.8 }}>
            Notice the ambient ripples that appear randomly to create a calming, living water effect.
          </p>
          
          <div style={{ 
            marginTop: '50px', 
            display: 'flex', 
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button 
              style={{ 
                padding: '12px 24px', 
                background: 'white', 
                color: '#1A9EE2', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Interactive Button
            </button>
            
            <button 
              style={{ 
                padding: '12px 24px', 
                background: 'rgba(255, 255, 255, 0.2)', 
                color: 'white', 
                border: '2px solid white', 
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Another Button
            </button>
          </div>
        </div>
      </WaterRippleBackground>
    </div>
  );
};

export default WaterRippleDemo; 