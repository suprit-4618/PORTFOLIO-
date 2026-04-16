import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Intro.css';

const GlitchIntro = ({ onFinish }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Stage 1: Initial pause
    const startTimer = setTimeout(() => setIsOpen(true), 600);
    
    // Stage 2: Finish and handoff
    const finishTimer = setTimeout(() => {
        setIsFinished(true);
        setTimeout(onFinish, 600); // Wait for text fade
    }, 3200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const name = "SUPRIT L";

  return (
    <motion.div 
      className={`shutter-wrapper ${isOpen ? 'open' : ''}`}
      animate={isFinished ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div className="shutter-grain" />
      <div className="shutter-scan" />
      
      {/* 3D SHUTTER BLADES */}
      <div className="shutter-blades-container">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="shutter-blade" />
        ))}
      </div>

      {/* TYPOGRAPHIC LOCKUP */}
      <div className="shutter-content">
        <motion.div
           initial={{ opacity: 0, scale: 1.1 }}
           animate={isOpen ? { opacity: 1, scale: 1 } : {}}
           transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
            <h1 className="shutter-title">{name}</h1>
            <p className="shutter-tagline">AI & DATA SCIENCE ENGINEER</p>
        </motion.div>
      </div>

      {/* Subtle Frame Detail */}
      <div style={{
          position: 'absolute',
          inset: '2rem',
          border: '1px solid rgba(255,255,255,0.03)',
          pointerEvents: 'none',
          zIndex: 5
      }} />
    </motion.div>
  );
};

export default GlitchIntro;
