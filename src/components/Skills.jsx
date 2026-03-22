import React, { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Skills.css';
import javaIcon from '../assets/java.svg';
import mysqlIcon from '../assets/mysql.png';

// ─── Skills Data (Direct mapping to Simple Icons slugs) ────────────────────
const SKILLS = [
  { name: 'Python', category: 'Languages', slug: 'python' },
  { name: 'Java', category: 'Languages', slug: javaIcon },
  { name: 'JavaScript', category: 'Languages', slug: 'javascript' },
  { name: 'PySpark', category: 'Languages', slug: 'apachespark' },

  { name: 'Artificial Intelligence', category: 'AI / ML', slug: 'googlegemini' },
  { name: 'Machine Learning', category: 'AI / ML', slug: 'scikitlearn' },
  { name: 'Data Science', category: 'AI / ML', slug: 'jupyter' },

  { name: 'FastAPI', category: 'Backend', slug: 'fastapi' },

  { name: 'MySQL', category: 'Databases', slug: mysqlIcon },
  { name: 'PostgreSQL', category: 'Databases', slug: 'postgresql' },
  { name: 'MongoDB', category: 'Databases', slug: 'mongodb' },

  { name: 'Docker', category: 'Tools', slug: 'docker' },
  { name: 'Airflow', category: 'Tools', slug: 'apacheairflow' },
  { name: 'Git', category: 'Tools', slug: 'git' },
  { name: 'CI/CD', category: 'Tools', slug: 'githubactions' },
  { name: 'Linux', category: 'Tools', slug: 'linux' },
  { name: 'Vercel', category: 'Tools', slug: 'vercel' },

  { name: 'Three.js', category: '3D & Graphics', slug: 'threedotjs' },
  { name: 'WebGL', category: '3D & Graphics', slug: 'webgl' },
  { name: 'MediaPipe', category: '3D & Graphics', slug: 'google' },
  { name: 'Unreal Engine', category: '3D & Graphics', slug: 'unrealengine' },
];

const CATEGORY_COLORS = {
  'Languages':    '139, 92, 246',   // violet
  'AI / ML':      '236, 72, 153',   // pink
  'Backend':      '6, 182, 212',    // cyan
  'Databases':    '251, 146, 60',   // orange
  'Tools':        '52, 211, 153',   // emerald
  '3D & Graphics':'248, 113, 113',  // red
};

const Skills = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    // Initializing state
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.reveal-cube');
      cards.forEach(card => card.style.setProperty('--glow', '0'));
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.reveal-cube');
    if (cards.length === 0) return;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCx = rect.left + rect.width / 2;
      const cardCy = rect.top + rect.height / 2;
      const dx = e.clientX - cardCx;
      const dy = e.clientY - cardCy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Glow intensity fades off with distance
      const maxRadius = 300; 
      const intensity = Math.max(0, 1 - dist / maxRadius);

      card.style.setProperty('--glow', intensity);
      card.style.setProperty('--cx', `${relX}px`);
      card.style.setProperty('--cy', `${relY}px`);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.reveal-cube').forEach((card) => {
      card.style.setProperty('--glow', '0');
    });
  }, []);

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        {/* Header (No motion for absolute stealth) */}
        <div className="skills-header">
           <motion.h2 
             className="section-title"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
             Tech <span className="highlight">Stack</span>
           </motion.h2>
           <p className="skills-hint">Move your cursor across the grid</p>
         </div>

        {/* Grid */}
        <div
          className="skills-grid"
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {SKILLS.map((skill) => {
            const color = CATEGORY_COLORS[skill.category] || '139, 92, 246';
            return (
              <div
                key={skill.name}
                className="reveal-cube"
                style={{ '--color': color }}
              >
                {/* Glow layer */}
                <div className="reveal-glow" />

                {/* Card content */}
                <div className="reveal-body">
                  <div className="reveal-icon">
                    <img 
                      src={ (skill.slug.includes('/') || skill.slug.startsWith('data:')) ? skill.slug : `https://cdn.simpleicons.org/${skill.slug}`} 
                      alt={skill.name}
                      onLoad={(e) => e.target.style.opacity = '1'}
                      onError={(e) => {
                        // Fallback or debug
                        console.warn('Icon load failed:', skill.slug);
                        e.target.style.display = 'none';
                      }}
                      className="tech-logo"
                    />
                  </div>
                  <span className="reveal-name">{skill.name}</span>
                </div>

                {/* Global sheen */}
                <div className="reveal-sheen" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
