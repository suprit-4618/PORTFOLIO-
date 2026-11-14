import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileDown } from 'lucide-react';
import './HeroStartup.css';

export const HeroStartup = ({ triggerIntro = true, onIntroComplete, onPhaseChange }) => {
  const [phase, setPhase] = useState(triggerIntro ? 'drawing' : 'settled'); // 'drawing' | 'revealing' | 'holding' | 'gliding' | 'settled'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [centerOffset, setCenterOffset] = useState(0);
  const containerRef = useRef(null);

  // Compute exact pixel offset to center the title on screen
  useEffect(() => {
    const calculateOffset = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const screenCenterX = window.innerWidth / 2;
        // Calculate offset so title center aligns with viewport center
        const offset = Math.max(0, screenCenterX - containerRect.left - 180);
        setCenterOffset(offset);
      }
    };

    calculateOffset();
    window.addEventListener('resize', calculateOffset);
    return () => window.removeEventListener('resize', calculateOffset);
  }, []);

  useEffect(() => {
    if (!triggerIntro) {
      setPhase('settled');
      if (onPhaseChange) onPhaseChange('settled');
      return;
    }

    if (onPhaseChange) onPhaseChange('drawing');

    // Stage 1: Bar drawn, name starts emerging (700ms)
    const t1 = setTimeout(() => {
      setPhase('revealing');
      if (onPhaseChange) onPhaseChange('revealing');
    }, 700);

    // Stage 2: Emergence finished, gentle hold (1800ms)
    const t2 = setTimeout(() => {
      setPhase('holding');
      if (onPhaseChange) onPhaseChange('holding');
    }, 1800);

    // Stage 3: Smooth continuous glide to left position + background blooms (2400ms)
    const t3 = setTimeout(() => {
      setPhase('gliding');
      if (onPhaseChange) onPhaseChange('gliding');
    }, 2400);

    // Stage 4: Settled in place -> Top navbar and full interactivity ready (3800ms)
    const t4 = setTimeout(() => {
      setPhase('settled');
      if (onPhaseChange) onPhaseChange('settled');
      if (onIntroComplete) onIntroComplete();
    }, 3800);

    // Fast forward on any key or click
    const handleSkip = (e) => {
      if (e.type === 'keydown' && !['Escape', 'Enter', ' ', 'ArrowRight'].includes(e.key)) return;
      setPhase('settled');
      if (onPhaseChange) onPhaseChange('settled');
      if (onIntroComplete) onIntroComplete();
    };

    window.addEventListener('keydown', handleSkip);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [triggerIntro, onIntroComplete, onPhaseChange]);

  // Subtle Mouse Parallax on Background Layer
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 22;
    const y = (e.clientY / innerHeight - 0.5) * 22;
    setMousePos({ x, y });
  };

  const isCenterMode = phase === 'drawing' || phase === 'revealing' || phase === 'holding';
  const isRevealed = phase !== 'drawing';
  const isBackgroundVisible = phase === 'gliding' || phase === 'settled';

  const fastForward = () => {
    if (phase !== 'settled') {
      setPhase('settled');
      if (onPhaseChange) onPhaseChange('settled');
      if (onIntroComplete) onIntroComplete();
    }
  };

  return (
    <section 
      id="hero" 
      className="hero-cinematic-stage"
      onMouseMove={handleMouseMove}
      onClick={fastForward}
    >
      {/* ─── 1. ATMOSPHERIC PARALLAX 3D MATTE BACKGROUND ─── */}
      <motion.div 
        className="hero-parallax-matte-layer"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ 
          opacity: isBackgroundVisible ? 1 : 0,
          scale: isBackgroundVisible ? 1 : 1.04,
          x: isBackgroundVisible ? mousePos.x : 0,
          y: isBackgroundVisible ? mousePos.y : 0
        }}
        transition={{ 
          opacity: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
          x: { duration: 0.3, ease: 'easeOut' },
          y: { duration: 0.3, ease: 'easeOut' }
        }}
      >
        <div 
          className="hero-parallax-image"
          style={{ backgroundImage: 'url(/parallax/matte_bg.png)' }}
        />
        <div className="hero-bottom-vignette" />
        <div className="hero-radial-glow" />
      </motion.div>

      {/* ─── 2. HERO CONTENT CONTAINER ─── */}
      <div className="hero-cinematic-container" ref={containerRef}>
        
        {/* Pure GPU-Accelerated Title Motion Node */}
        <motion.div 
          className="hero-title-motion-node"
          initial={{ x: centerOffset || 280 }}
          animate={{ 
            x: isCenterMode ? (centerOffset || 280) : 0 
          }}
          transition={{ 
            x: { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
          }}
          style={{ willChange: 'transform' }}
        >
          {/* Row with Masked Name and Vertical Bar */}
          <div className="hero-bar-reveal-row">
            
            {/* Masked Typography (Slides Right-to-Left out of the Bar) */}
            <div className="hero-name-mask">
              <motion.h1 
                className="hero-display-name"
                initial={{ x: '105%', opacity: 0 }}
                animate={{ 
                  x: isRevealed ? '0%' : '105%', 
                  opacity: isRevealed ? 1 : 0 
                }}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              >
                SUPRIT L
              </motion.h1>
            </div>

            {/* Luminous Vertical Bar */}
            <motion.div 
              className="hero-luminous-bar"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: isRevealed ? 1 : (phase === 'drawing' ? 1 : 0), 
                opacity: isBackgroundVisible ? 0 : 1,
                boxShadow: isRevealed 
                  ? '0 0 28px rgba(255, 255, 255, 0.95), 0 0 10px rgba(255, 255, 255, 0.7)' 
                  : '0 0 12px rgba(255, 255, 255, 0.4)'
              }}
              transition={{ 
                scaleY: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }}
            />

          </div>

          {/* Subtitle: AI & DATA SCIENCE ENGINEER */}
          <motion.div 
            className="hero-subtitle-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: isBackgroundVisible ? 1 : 0,
              y: isBackgroundVisible ? 0 : 15
            }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-subtitle-text">
              AI & DATA SCIENCE ENGINEER
            </span>
          </motion.div>

          {/* Action Buttons: VIEW MY WORK -> & DOWNLOAD CV */}
          <motion.div 
            className="hero-actions-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ 
              opacity: isBackgroundVisible ? 1 : 0,
              y: isBackgroundVisible ? 0 : 18
            }}
            transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#projects" className="hero-btn-solid">
              <span>VIEW MY WORK</span>
              <ArrowRight size={15} />
            </a>

            <a 
              href="/Suprit_AI_Engineer.pdf" 
              download="Suprit_AI_Engineer.pdf" 
              className="hero-btn-outline"
            >
              <span>DOWNLOAD CV</span>
              <FileDown size={15} />
            </a>
          </motion.div>

        </motion.div>

      </div>

      {/* Subtle Skip Prompt during intro */}
      {isCenterMode && (
        <motion.div 
          className="hero-skip-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <span>CLICK ANYWHERE OR PRESS ESC TO SKIP</span>
        </motion.div>
      )}
    </section>
  );
};

export default HeroStartup;
