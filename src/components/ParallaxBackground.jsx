import React from 'react';
import './ParallaxBackground.css';

const ParallaxBackground = () => {
    return (
        <div className="parallax-container">
            <div 
                className="parallax-static-layer"
                style={{
                    backgroundImage: 'url(/parallax/matte_bg.png)',
                    zIndex: -1
                }}
            />
            {/* Mask to cover the Gemini star in the bottom right corner */}
            <div className="parallax-mask" />
            {/* Gradient Overlay for bottom fade */}
            <div className="parallax-overlay" />
        </div>
    );
};

export default ParallaxBackground;
