import React, { useEffect, useState } from 'react';
import { Laptop, Sparkles, Compass } from 'lucide-react';
import './WorldLoader.css';

export const WorldLoader = ({ 
  progress = 0, 
  stageText = 'Initializing 3D Alpine Engine...', 
  isReady = false,
  onFinish
}) => {
  const [internalProgress, setInternalProgress] = useState(progress);
  const [hasFinishedTransition, setHasFinishedTransition] = useState(false);

  useEffect(() => {
    setInternalProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setHasFinishedTransition(true);
        if (onFinish) onFinish();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isReady, onFinish]);

  if (hasFinishedTransition) return null;

  return (
    <div className={`world-loader-overlay ${isReady ? 'loader-fade-out' : ''}`}>
      {/* Atmospheric ambient background glow */}
      <div className="loader-ambient-glow" />

      {/* Center presentation card */}
      <div className="loader-center-content">
        {/* Animated dual concentric glowing rings */}
        <div className="loader-rings-container">
          <div className="loader-ring outer-ring" />
          <div className="loader-ring inner-ring" />
          <div className="loader-core-icon">
            <Compass size={28} className="loader-compass-svg" />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="loader-title-group">
          <div className="loader-badge">
            <Sparkles size={13} className="text-amber-400" />
            <span>ALPINE 3D WORLD</span>
          </div>
          <h2 className="loader-heading">Entering Virtual Simulation</h2>
        </div>

        {/* Progress Bar & Status */}
        <div className="loader-progress-box">
          <div className="loader-progress-info">
            <span className="loader-stage-text">{stageText}</span>
            <span className="loader-percent-text">{Math.min(100, Math.round(internalProgress))}%</span>
          </div>
          <div className="loader-progress-track">
            <div 
              className="loader-progress-fill" 
              style={{ width: `${Math.min(100, Math.max(5, internalProgress))}%` }}
            >
              <div className="loader-progress-shimmer" />
            </div>
          </div>
        </div>

        {/* Crisp PC / Laptop Recommendation Banner */}
        <div className="world-loader-tip-card">
          <div className="tip-badge">
            <Laptop size={14} className="tip-icon" />
            <span>RECOMMENDED</span>
          </div>
          <p className="tip-text">
            Use a <b>PC or Laptop</b> for the best visual experience & fluid controls.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldLoader;
