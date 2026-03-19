import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

// ─── Skills Data ──────────────────────────────────────────────────────────────
const SKILLS = [
  // Languages
  { name: 'Python',       category: 'Languages', icon: 'python' },
  { name: 'Java',         category: 'Languages', icon: 'openjdk' },
  { name: 'JavaScript',   category: 'Languages', icon: 'javascript' },
  { name: 'PySpark',      category: 'Languages', icon: 'apachespark' },

  // AI / ML & Data
  { name: 'Artificial Intelligence', category: 'AI / ML & Data', icon: null },
  { name: 'Machine Learning', category: 'AI / ML & Data', icon: null },
  { name: 'Data Science', category: 'AI / ML & Data', icon: null },

  // Backend & APIs
  { name: 'FastAPI',      category: 'Backend & APIs', icon: 'fastapi' },

  // Databases
  { name: 'SQL',          category: 'Databases', icon: 'postgresql' }, 
  { name: 'PostgreSQL',   category: 'Databases', icon: 'postgresql' },
  { name: 'MongoDB',      category: 'Databases', icon: 'mongodb' },
  { name: 'NoSQL',        category: 'Databases', icon: null },

  // Tools & Platforms
  { name: 'Docker',       category: 'Tools & Platforms', icon: 'docker' },
  { name: 'Airflow',      category: 'Tools & Platforms', icon: 'apacheairflow' },
  { name: 'Git',          category: 'Tools & Platforms', icon: 'git' },
  { name: 'CI/CD',        category: 'Tools & Platforms', icon: null },
  { name: 'Linux',        category: 'Tools & Platforms', icon: 'linux' },
  { name: 'Vercel',       category: 'Tools & Platforms', icon: 'vercel' },

  // Simulation, 3D & Web Graphics
  { name: 'Three.js',     category: 'Simulation, 3D & Web Graphics', icon: 'three.js' },
  { name: 'WebGL',        category: 'Simulation, 3D & Web Graphics', icon: 'webgl' },
  { name: 'MediaPipe',    category: 'Simulation, 3D & Web Graphics', icon: 'google' },
  { name: 'Unreal Engine', category: 'Simulation, 3D & Web Graphics', icon: 'unrealengine' },
];

const CATEGORY_COLORS = {
  'Languages':                    '139, 92, 246',   // violet
  'AI / ML & Data':               '236, 72, 153',   // pink
  'Backend & APIs':               '6, 182, 212',    // cyan
  'Databases':                    '251, 146, 60',   // orange
  'Tools & Platforms':            '52, 211, 153',   // emerald
  'Simulation, 3D & Web Graphics':'248, 113, 113',  // red
};

// ─── Component ────────────────────────────────────────────────────────────────
const Skills = () => {
  const gridRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.skill-cube');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      // Distance from cursor to center of this card
      const cardCx = rect.left + rect.width / 2;
      const cardCy = rect.top + rect.height / 2;
      const dx = e.clientX - cardCx;
      const dy = e.clientY - cardCy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Relative cursor position within the card (for the foreground gradient)
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Glow intensity fades off with distance (max radius ~300 px)
      const maxRadius = 300;
      const intensity = Math.max(0, 1 - dist / maxRadius);

      card.style.setProperty('--glow', intensity);
      card.style.setProperty('--cx', `${relX}px`);
      card.style.setProperty('--cy', `${relY}px`);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.skill-cube').forEach((card) => {
      card.style.setProperty('--glow', 0);
    });
  }, []);

  return (
    <section id="skills" className="skills-section">
      <motion.div
        className="skills-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="skills-header">
          <h2 className="section-title">
            My <span className="highlight">Skills</span>
          </h2>
          <p className="skills-hint">Move your cursor across the grid</p>
        </div>

        {/* Grid */}
        <div
          className="skills-grid"
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {SKILLS.map((skill, i) => {
            const color = CATEGORY_COLORS[skill.category] || '139, 92, 246';
            return (
              <motion.div
                key={skill.name}
                className="skill-cube"
                style={{ '--color': color }}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.025, duration: 0.4, ease: 'easeOut' }}
              >
                {/* Glow layer (follows cursor) */}
                <div className="cube-glow" />

                {/* Card content */}
                <div className="cube-body">
                  {skill.icon ? (
                    <img 
                      src={`https://cdn.simpleicons.org/${skill.icon}/white`} 
                      alt={skill.name}
                      className="cube-icon"
                    />
                  ) : (
                    <span className="cube-name">{skill.name}</span>
                  )}
                  <span className="cube-category">{skill.category}</span>
                </div>

                {/* Sheen */}
                <div className="cube-sheen" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
