import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './TechnicalSkills.css';

// ─── Skills Data ──────────────────────────────────────────────────────────────
const SKILLS = [
  { name: 'Python',       category: 'Languages' },
  { name: 'JavaScript',   category: 'Languages' },
  { name: 'Java',         category: 'Languages' },
  { name: 'PySpark',      category: 'Languages' },
  { name: 'TensorFlow',   category: 'AI / ML' },
  { name: 'PyTorch',      category: 'AI / ML' },
  { name: 'OpenCV',       category: 'AI / ML' },
  { name: 'Machine Learning', category: 'AI / ML' },
  { name: 'Data Science', category: 'AI / ML' },
  { name: 'MobileNetV2',  category: 'AI / ML' },
  { name: 'FastAPI',      category: 'Backend' },
  { name: 'Node.js',      category: 'Backend' },
  { name: 'Flask',        category: 'Backend' },
  { name: 'REST APIs',    category: 'Backend' },
  { name: 'PostgreSQL',   category: 'Databases' },
  { name: 'MongoDB',      category: 'Databases' },
  { name: 'SQL',          category: 'Databases' },
  { name: 'NoSQL',        category: 'Databases' },
  { name: 'Docker',       category: 'Tools' },
  { name: 'Airflow',      category: 'Tools' },
  { name: 'dbt',          category: 'Tools' },
  { name: 'Git',          category: 'Tools' },
  { name: 'Linux',        category: 'Tools' },
  { name: 'CI/CD',        category: 'Tools' },
  { name: 'Vercel',       category: 'Tools' },
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

const TechnicalSkills = () => {
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

      const maxRadius = 500; // Much wider influence for a 'wave' feel
      const intensity = Math.max(0, 1 - dist / maxRadius);
      // Use a more aggressive curve for the 'pop' so it's very clear when near
      const popIntensity = Math.pow(intensity, 1.2); 

      const maxTilt = 25; // More tilt
      const rx = ((relY - rect.height / 2) / (rect.height / 2)) * -maxTilt * intensity;
      const ry = ((relX - rect.width / 2) / (rect.width / 2)) * maxTilt * intensity;

      const mx = (relX / rect.width) * 100;
      const my = (relY / rect.height) * 100;

      card.style.setProperty('--glow', intensity);
      card.style.setProperty('--pop', popIntensity);
      card.style.setProperty('--rx', `${rx}deg`);
      card.style.setProperty('--ry', `${ry}deg`);
      card.style.setProperty('--mx', `${mx}%`);
      card.style.setProperty('--my', `${my}%`);
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
        <div className="skills-header">
          <h2 className="section-title">
            My <span className="highlight">Skills</span>
          </h2>
          <p className="skills-hint">Move your cursor across the grid</p>
        </div>

        <div
          className="skills-grid"
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="skill-cube"
              style={{ '--color': CATEGORY_COLORS[skill.category] || '139, 92, 246' }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.025, duration: 0.4, ease: 'easeOut' }}
            >
              <span className="cube-marker">+</span>
              <div className="cube-glow" />
              <div className="cube-refraction" />
              <div className="cube-body">
                <span className="cube-category">{skill.category}</span>
                <span className="cube-name">{skill.name}</span>
              </div>
              <div className="cube-sheen" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TechnicalSkills;
