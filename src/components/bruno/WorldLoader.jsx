import React, { useEffect, useState } from 'react';
import './WorldLoader.css';

export const WorldLoader = ({ 
  progress = 0, 
  stageText = 'Connecting...', 
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
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isReady, onFinish]);

  if (hasFinishedTransition) return null;

  const displayPercent = Math.min(100, Math.max(0, Math.round(internalProgress)));

  return (
    <div className={`construct-loader-screen ${isReady ? 'construct-fade-out' : ''}`}>
      <div className="construct-loader-inner">
        {/* Minimal Monospace Header */}
        <div className="construct-header-row">
          <span className="construct-tag">CONSTRUCT // 01</span>
          <span className="construct-coords">ALPINE HIGHWAY</span>
        </div>

        {/* Razor-thin 2px precision progress track */}
        <div className="construct-track">
          <div 
            className="construct-fill" 
            style={{ width: `${Math.max(4, displayPercent)}%` }}
          />
        </div>

        {/* Minimal Status & Percentage */}
        <div className="construct-status-row">
          <span className="construct-stage-label">{stageText}</span>
          <span className="construct-pct-label">{String(displayPercent).padStart(3, '0')}%</span>
        </div>

        {/* Crisp, understated PC/Laptop recommendation */}
        <div className="construct-device-tip">
          <span className="tip-dot" />
          <span className="tip-text">Use a PC or Laptop for the best driving experience</span>
        </div>
      </div>
    </div>
  );
};

export default WorldLoader;
