import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Database, 
  Zap, 
  Wind, 
  GitBranch, 
  RefreshCw, 
  Triangle, 
  Boxes, 
  Layout,
  Layers,
  Cpu,
  BarChart3,
  Network,
  Code2,
  FileCode2,
  Coffee
} from 'lucide-react';
import './Skills.css';

// ─── Skills Data ──────────────────────────────────────────────────────────────
const SKILLS = [
  { name: 'Python', category: 'Languages', icon: <FileCode2 size={28} /> },
  { name: 'Java', category: 'Languages', icon: <Coffee size={28} /> },
  { name: 'JavaScript', category: 'Languages', icon: <Code2 size={28} /> },
  { name: 'PySpark', category: 'Languages', icon: <Zap size={28} /> },

  { name: 'Artificial Intelligence', category: 'AI / ML', icon: <Cpu size={28} /> },
  { name: 'Machine Learning', category: 'AI / ML', icon: <Network size={28} /> },
  { name: 'Data Science', category: 'AI / ML', icon: <BarChart3 size={28} /> },

  { name: 'FastAPI', category: 'Backend', icon: <Zap size={28} /> },

  { name: 'SQL', category: 'Databases', icon: <Database size={28} /> },
  { name: 'PostgreSQL', category: 'Databases', icon: <Database size={28} /> },
  { name: 'MongoDB', category: 'Databases', icon: <Layers size={28} /> },
  { name: 'NoSQL', category: 'Databases', icon: <Database size={28} /> },

  { name: 'Docker', category: 'Tools', icon: <Boxes size={28} /> },
  { name: 'Airflow', category: 'Tools', icon: <Wind size={28} /> },
  { name: 'Git', category: 'Tools', icon: <GitBranch size={28} /> },
  { name: 'CI/CD', category: 'Tools', icon: <RefreshCw size={28} /> },
  { name: 'Linux', category: 'Tools', icon: <Terminal size={28} /> },
  { name: 'Vercel', category: 'Tools', icon: <Triangle size={28} /> },

  { name: 'Three.js', category: '3D & Graphics', icon: <Boxes size={28} /> },
  { name: 'WebGL', category: '3D & Graphics', icon: <Layout size={28} /> },
  { name: 'MediaPipe', category: '3D & Graphics', icon: <Cpu size={28} /> },
  { name: 'Unreal Engine', category: '3D & Graphics', icon: <Layers size={28} /> },
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
                  <div className="cube-icon">{skill.icon}</div>
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
