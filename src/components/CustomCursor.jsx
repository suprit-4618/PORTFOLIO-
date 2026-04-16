import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // 'default' or 'magnetic'
  const targetRef = React.useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // "Buttery" smooth springs for the follower
  const springConfig = { damping: 35, stiffness: 200, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, .magnetic');
      if (target === targetRef.current) return;
      
      targetRef.current = target;
      if (target) {
        setIsHovering(true);
        setCursorType('magnetic');
      } else {
        setIsHovering(false);
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  // Smaller, subtler halo
  const haloSize = isHovering ? 35 : 20;
  
  return (
    <>
      {/* Main Pointer Dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%"
        }}
      />

      {/* Trailing Halo */}
      <motion.div
        className={`custom-cursor-halo ${cursorType}`}
        animate={{
          width: haloSize,
          height: haloSize,
          backgroundColor: 'transparent',
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          borderWidth: isHovering ? 2 : 1
        }}
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%"
        }}
      />
    </>
  );
};

export default CustomCursor;
