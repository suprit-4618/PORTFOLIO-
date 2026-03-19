import React from 'react';
import './ParallaxBackground.css';

const ParallaxBackground = () => {
    return (
        <div className="parallax-container">
            <div 
                className="parallax-static-layer"
                style={{
                    backgroundImage: 'url(/parallax/6.png)',
                    zIndex: -1
                }}
            />
            {/* Gradient Overlay for bottom fade */}
            <div className="parallax-overlay" />
        </div>
    );
};

export default ParallaxBackground;
