import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

const Intro = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800); // Super fast 1.8s timeout as requested
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      className="intro-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="intro-content">
        <div className="intro-center-box">
          <div className="intro-name-wrapper">
            <motion.h1 
              className="intro-name"
              layoutId="hero-name"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              SUPRIT L
            </motion.h1>
          </div>
          
          {/* Small Vertical Line */}
          <motion.div 
            className="intro-line"
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: "120%", opacity: [1, 1, 0] }}
            transition={{ 
              height: { duration: 0.3, ease: "circOut" },
              opacity: { duration: 0.2, delay: 1.4 } // Fades out right before transition
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Intro;
