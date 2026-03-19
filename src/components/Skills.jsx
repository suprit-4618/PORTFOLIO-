import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

// ─── Skills Data ──────────────────────────────────────────────────────────────
const SKILLS = [
  // Languages
  { name: 'Python',       category: 'Languages' },
  { name: 'JavaScript',   category: 'Languages' },
  { name: 'Java',         category: 'Languages' },
  { name: 'PySpark',      category: 'Languages' },

  // AI / ML
  { name: 'TensorFlow',   category: 'AI / ML' },
  { name: 'PyTorch',      category: 'AI / ML' },
  { name: 'OpenCV',       category: 'AI / ML' },
  { name: 'Machine Learning', category: 'AI / ML' },
  { name: 'Data Science', category: 'AI / ML' },
  { name: 'MobileNetV2',  category: 'AI / ML' },

  // Backend
  { name: 'FastAPI',      category: 'Backend' },
  { name: 'Node.js',      category: 'Backend' },
  { name: 'Flask',        category: 'Backend' },
  { name: 'REST APIs',    category: 'Backend' },

  // Databases
  { name: 'PostgreSQL',   category: 'Databases' },
  { name: 'MongoDB',      category: 'Databases' },
  { name: 'SQL',          category: 'Databases' },
  { name: 'NoSQL',        category: 'Databases' },

  // Tools
  { name: 'Docker',       category: 'Tools' },
  { name: 'Airflow',      category: 'Tools' },
  { name: 'dbt',          category: 'Tools' },
  { name: 'Git',          category: 'Tools' },
  { name: 'Linux',        category: 'Tools' },
  { name: 'CI/CD',        category: 'Tools' },
  { name: 'Vercel',       category: 'Tools' },

  // 3D & Graphics
  { name: 'Three.js',     category: '3D & Graphics' },
  { name: 'WebGL',        category: '3D & Graphics' },
  { name: 'MediaPipe',    category: '3D & Graphics' },
  { name: 'Unreal Engine', category: '3D & Graphics' },
];

const CATEGORY_COLORS = {
  'Languages':    '139, 92, 246',   // violet
  'AI / ML':      '236, 72, 153',   // pink
  'Backend':      '6, 182, 212',    // cyan
  'Databases':    '251, 146, 60',   // orange
  'Tools':        '52, 211, 153',   // emerald
  '3D & Graphics':'248, 113, 113',  // red
};

// ─── Component ────────────────────────────────────────────────────────────────
const Skills = () => {
  const gridRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.skill-cube');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCx = rect.left + rect.width / 2;
      const cardCy = rect.top + rect.height / 2;
      const dx = e.clientX - cardCx;
      const dy = e.clientY - cardCy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Main glow intensity (0–1)
      const maxRadius = 260;
      const intensity = Math.max(0, 1 - dist / maxRadius);

      // Pop scale: tiles go from base 0.78 to 1.0 as cursor approaches
      // Use a power curve so only nearby tiles pop strongly
      const popIntensity = Math.pow(intensity, 1.4);

      card.style.setProperty('--glow', intensity);
      card.style.setProperty('--pop', popIntensity);
      card.style.setProperty('--cx', `${relX}px`);
      card.style.setProperty('--cy', `${relY}px`);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.skill-cube').forEach((card) => {
      card.style.setProperty('--glow', 0);
      card.style.setProperty('--pop', 0);
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
                  <span className="cube-category">{skill.category}</span>
                  <span className="cube-name">{skill.name}</span>
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
