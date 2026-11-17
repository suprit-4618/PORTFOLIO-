import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './MatrixChoice.css';

export const MatrixChoice = ({ onSelectChoice }) => {
  const canvasRef = useRef(null);
  const [hoveredPill, setHoveredPill] = useState(null); // 'blue' | 'red' | null

  // Matrix Digital Rain Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ010101010101';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    let animId;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`matrix-choice-root ${hoveredPill ? `glow-${hoveredPill}` : ''}`}>
      {/* Matrix Digital Rain Background */}
      <canvas ref={canvasRef} className="matrix-rain-canvas" />

      {/* Atmospheric Vignette Overlay */}
      <div className="matrix-vignette-overlay" />

      {/* Main Morpheus Choice Stage with Interactive Pill Palms */}
      <div className="matrix-pure-stage">
        <motion.div 
          className="matrix-morpheus-wrapper"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="matrix-morpheus-frame">
            <img 
              src="/minion-matrix.png" 
              alt="The Matrix Choice - Red Pill or Blue Pill" 
              className="matrix-morpheus-img"
              draggable="false"
            />

            {/* ─── BLUE PILL HOTSPOT (LEFT HAND -> CLASSIC PORTFOLIO) ─── */}
            <div 
              className="pill-hitbox blue-pill-hitbox"
              onMouseEnter={() => setHoveredPill('blue')}
              onMouseLeave={() => setHoveredPill(null)}
              onClick={() => onSelectChoice && onSelectChoice('scroll')}
              role="button"
              tabIndex={0}
              aria-label="Blue Pill - Classic Portfolio"
            >
              <div className="pill-aura blue-aura" />
              <div className="pill-touch-tag blue-tag">
                <span>PORTFOLIO</span>
              </div>
            </div>

            {/* ─── RED PILL HOTSPOT (RIGHT HAND -> 3D PLAYGROUND) ─── */}
            <div 
              className="pill-hitbox red-pill-hitbox"
              onMouseEnter={() => setHoveredPill('red')}
              onMouseLeave={() => setHoveredPill(null)}
              onClick={() => onSelectChoice && onSelectChoice('game')}
              role="button"
              tabIndex={0}
              aria-label="Red Pill - 3D World"
            >
              <div className="pill-aura red-aura" />
              <div className="pill-touch-tag red-tag">
                <span>3D WORLD</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatrixChoice;
