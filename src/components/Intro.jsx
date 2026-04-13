import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

const Intro = ({ onFinish }) => {
  const videoRef = useRef(null);

  const finishedRef = useRef(false);

  useEffect(() => {
    // Force video to play (muted autoplay is allowed in all browsers)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // Match exact video duration for the snap-point
    const timer = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
    }, 2000); 

    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <motion.div
      className="intro-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{ willChange: 'opacity' }}
    >
      {/* Full-screen video plays as the intro animation */}
      <video
        ref={videoRef}
        className="intro-video"
        src="/intro_text.mp4"
        muted
        playsInline
        preload="auto"
      />

      {/* Subtle dark overlay so video doesn't blow out */}
      <div className="intro-overlay" />
    </motion.div>
  );
};

export default Intro;
