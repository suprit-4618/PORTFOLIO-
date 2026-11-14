import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './ResumeIntroTransition.css';

export const ResumeIntroTransition = ({ onComplete }) => {
  const [phase, setPhase] = useState('entering'); // 'entering' | 'revealing' | 'gliding' | 'done'

  useEffect(() => {
    // Stage 1: Reveal starts at 750ms (Bar drawn, text emerges centered)
    const timer1 = setTimeout(() => {
      setPhase('revealing');
    }, 750);

    // Stage 2: Glide starts at 2800ms (Hold/read phase complete, dissolve)
    const timer2 = setTimeout(() => {
      setPhase('gliding');
    }, 2800);

    // Stage 3: Complete at 3800ms (Handoff to clean white portfolio)
    const timer3 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 3800);

    // Instant skip listener (Keypress / Escape / Space / Enter / Click)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        if (onComplete) onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleFastForward = () => {
    if (onComplete) onComplete();
  };

  return (
    <motion.div 
      className={`resume-intro-overlay ${phase === 'gliding' ? 'is-gliding' : ''}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'gliding' ? 0 : 1 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleFastForward}
    >
      {/* Deep Dark Ink Backdrop with Soft Radial Spotlight */}
      <div className="resume-intro-ambient-stage">
        <div className="resume-intro-spotlight" />
      </div>

      {/* Main Orchestrated Centered Lockup */}
      <motion.div 
        className="resume-intro-lockup"
        initial={{ x: '-50%', y: '-50%', scale: 1 }}
        animate={{ 
          x: '-50%', 
          y: phase === 'gliding' ? '-56%' : '-50%',
          scale: phase === 'gliding' ? 1.02 : 1,
          opacity: phase === 'gliding' ? 0 : 1
        }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        
        {/* Title + Luminous Vertical Cursor Line (Centred) */}
        <div className="resume-intro-title-line">
          <motion.div 
            className="resume-intro-name-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: phase === 'revealing' || phase === 'gliding' ? 1 : 0,
              y: phase === 'revealing' || phase === 'gliding' ? 0 : 15
            }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="resume-intro-title">
              SUPRIT L<span className="intro-title-period">.</span>
            </h1>
          </motion.div>

          <motion.div 
            className="resume-intro-vertical-bar"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: 1, 
              opacity: 1,
              boxShadow: phase === 'revealing' || phase === 'gliding' 
                ? '0 0 28px rgba(255, 255, 255, 0.95), 0 0 10px rgba(255, 255, 255, 0.7)' 
                : '0 0 12px rgba(255, 255, 255, 0.4)'
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Subtitle Role (Centred) */}
        <motion.div 
          className="resume-intro-sub-wrapper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: phase === 'revealing' || phase === 'gliding' ? 1 : 0,
            y: phase === 'revealing' || phase === 'gliding' ? 0 : 10
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="resume-intro-role">
            AI & DATA PLATFORMS ENGINEER
          </span>
        </motion.div>

        {/* Micro System Metadata Row (Centred) */}
        <motion.div 
          className="resume-intro-meta"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: phase === 'revealing' || phase === 'gliding' ? 0.75 : 0,
            y: phase === 'revealing' || phase === 'gliding' ? 0 : 10
          }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="intro-meta-item">SYS.INITIALIZE // PORTFOLIO MODE</span>
          <span className="intro-meta-dot">•</span>
          <span className="intro-meta-item">KARNATAKA, IN</span>
        </motion.div>

      </motion.div>

      {/* Discreet Click / Keypress Skip Hint */}
      <motion.div 
        className="resume-intro-skip-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span>CLICK ANYWHERE OR PRESS ESC TO SKIP</span>
      </motion.div>
    </motion.div>
  );
};

export default ResumeIntroTransition;
