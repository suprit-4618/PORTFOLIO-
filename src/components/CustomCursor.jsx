import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Responsive spring dynamics
  const springConfig = { damping: 28, stiffness: 280, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only activate on devices with a mouse / pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, input, textarea, [data-cursor], .startup-project-card, .startup-cert-card');
      if (target === targetRef.current) return;
      
      targetRef.current = target;
      if (target) {
        setIsHovering(true);
        const customLabel = target.getAttribute('data-cursor');
        setCursorText(customLabel || '');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  const portalRoot = document.getElementById('cursor-portal');
  if (!portalRoot || !isVisible) return null;

  const haloSize = cursorText ? 58 : isHovering ? 40 : 22;

  return createPortal(
    <div style={{ pointerEvents: 'none', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999 }}>
      {/* Precision Ink-Black Core Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: mouseX,
          top: mouseY,
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#09090b',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1000000,
        }}
      />

      {/* Trailing Minimal Slate Ring */}
      <motion.div
        animate={{
          width: haloSize,
          height: haloSize,
          borderColor: isHovering ? '#09090b' : 'rgba(9, 9, 11, 0.25)',
          backgroundColor: isHovering ? 'rgba(9, 9, 11, 0.04)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        style={{
          position: 'fixed',
          left: smoothX,
          top: smoothY,
          borderRadius: '50%',
          borderStyle: 'solid',
          borderWidth: 1,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 999999,
        }}
      >
        {cursorText && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#09090b',
            }}
          >
            {cursorText}
          </span>
        )}
      </motion.div>
    </div>,
    portalRoot
  );
};

export default CustomCursor;
