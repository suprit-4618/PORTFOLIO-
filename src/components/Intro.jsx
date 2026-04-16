import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

const Intro = ({ onFinish }) => {
  const videoRef = useRef(null);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);

  const handleFinish = () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinish();
    }
  };

  useEffect(() => {
    let safetyTimer;
    
    // In Strict Mode, this might run twice. Only start safety timer if video plays
    if (videoRef.current && !startedRef.current) {
      startedRef.current = true;
      videoRef.current.play().then(() => {
         // Start fallback timer only when play succeeds
         safetyTimer = setTimeout(handleFinish, 3500);
      }).catch(() => {
         // if play fails, fallback immediately
         handleFinish();
      });
    }

    return () => {
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className="intro-container">
      <video
        ref={videoRef}
        className="intro-video"
        src="/intro_text.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleFinish}
      />
      <div className="intro-overlay" />
    </div>
  );
};

export default Intro;
