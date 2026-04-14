import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!<>{}[]";

const ScrambleText = ({ text, delay = 0, duration = 1 }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let timeout;
    let interval;
    
    timeout = setTimeout(() => {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText((prev) => {
          const currentText = text.split("").map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (letter === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("");
          
          if (iteration >= text.length) {
            clearInterval(interval);
          }
          iteration += 1 / (duration * 6); 
          
          return currentText;
        });
      }, 30);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, duration]);

  return <>{displayText || "\u00A0"}</>;
};

const Intro = ({ onFinish }) => {
  useEffect(() => {
    // Total duration of intro before triggering unmount and letting site load
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="intro-container"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: "-100vh", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <div className="intro-glitch-wrapper">
        <motion.h1 
          className="intro-title"
          initial={{ filter: 'blur(10px)', opacity: 0, scale: 0.95 }}
          animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ScrambleText text="SUPRIT L" delay={0.3} duration={1} />
        </motion.h1>
        
        <motion.div 
          className="intro-subtitle"
          initial={{ filter: 'blur(5px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <ScrambleText text="AI & DATA SCIENCE ENGINEER" delay={1.2} duration={0.8} />
        </motion.div>
      </div>
      
      <div className="intro-loading-bar-wrapper">
         <motion.div 
            className="intro-loading-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.2, delay: 0.4, ease: "circInOut" }}
         />
      </div>

      <div className="intro-overlay" />
    </motion.div>
  );
};

export default Intro;
