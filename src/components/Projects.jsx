import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, X } from 'lucide-react';
import './Projects.css';

// ─── Project Data ────────────────────────────────────────────────
// To add more projects, simply add a new object to this array.
const PROJECTS = [
  {
    id: 1,
    title: 'Janisa',
    subtitle: 'Holographic AI Interface',
    tech: ['JavaScript', 'Python', 'CSS', 'HTML'],
    accent: '#00dcc8',
    github: 'https://github.com/suprit-4618/janisa-hologram',
    live: 'https://janisa-hologram.vercel.app',
    brief: 'An interactive holographic visualization system that enables users to explore 3D models through gesture-based interaction. It allows real-time manipulation such as rotation and zoom, making complex structures easier to understand. Designed for education, it enhances learning through immersive and interactive visualization.',
    howItWorks: 'The system runs on a web interface where users load 3D models. A camera captures hand gestures, which are processed using computer vision to control actions like rotate, zoom, and interact with the model in real time.',
    why: 'The goal was to improve educational understanding by allowing users to interact with models instead of relying only on imagination. Viewing objects from multiple angles makes learning more intuitive and engaging.',
    problemSolves: [
      'Eliminates difficulty in understanding complex 3D structures',
      'Makes abstract concepts visually clear and interactive',
      'Enhances learning through hands-on exploration',
    ],
    limitations: [
      'Real-time 2D-to-3D reconstruction was explored but not implemented due to accuracy and computational limitations',
      'Gesture recognition performance depends on lighting conditions and camera quality',
      'High-quality 3D rendering may require better hardware for smooth interaction',
    ],
  },
  {
    id: 2,
    title: 'Crypto Airflow',
    subtitle: 'Crypto Data Engineering Pipeline',
    tech: ['Python', 'Apache Airflow', 'dbt'],
    accent: '#7c6af7',
    github: 'https://github.com/suprit-4618/crypto-airflow-dbt-pipeline',
    live: null,
    brief: 'Details coming soon.',
    howItWorks: null,
    why: null,
    problemSolves: [],
    limitations: [],
  },
  {
    id: 3,
    title: 'Friday',
    subtitle: 'Personal AI Assistant',
    tech: ['Python', 'AI/ML'],
    accent: '#f7a26a',
    github: null,
    live: null,
    brief: 'Details coming soon.',
    howItWorks: null,
    why: null,
    problemSolves: [],
    limitations: [],
  },
  {
    id: 4,
    title: 'AgriVerseAi',
    subtitle: 'AI for Agriculture',
    tech: ['Python', 'Computer Vision', 'AI'],
    accent: '#6af78a',
    github: null,
    live: null,
    brief: 'Details coming soon.',
    howItWorks: null,
    why: null,
    problemSolves: [],
    limitations: [],
  },
  {
    id: 5,
    title: 'AI Semantic Search',
    subtitle: 'Vector-powered Semantic Search',
    tech: ['Python', 'Embeddings', 'endee'],
    accent: '#f76ab4',
    github: 'https://github.com/suprit-4618/ai-semantic-search-endee',
    live: null,
    brief: 'Details coming soon.',
    howItWorks: null,
    why: null,
    problemSolves: [],
    limitations: [],
  },
];

// ─── Fan angle per card index ─────────────────────────────────────
const getFanTransform = (index, total, isHovered) => {
  const spread = 22;  // degrees between cards
  const offset = (total - 1) / 2;
  const rotate = isHovered ? (index - offset) * spread : (index - offset) * 1.5;
  const translateX = isHovered ? (index - offset) * 70 : 0;
  const translateY = isHovered ? Math.abs(index - offset) * 14 : index * -2;
  return { rotate, translateX, translateY };
};

// ─── Component ────────────────────────────────────────────────────
const Projects = () => {
  const [deckHovered, setDeckHovered] = useState(false);
  const [selected, setSelected] = useState(null);

  const total = PROJECTS.length;

  return (
    <section id="projects" className="projects-section">
      <motion.div
        className="projects-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">
          My <span className="highlight">Projects</span>
        </h2>
        <p className="projects-hint">Hover the deck · Click a card to explore</p>

        {/* ── Card Deck ── */}
        <div
          className="deck-wrapper"
          onMouseEnter={() => setDeckHovered(true)}
          onMouseLeave={() => setDeckHovered(false)}
        >
          {PROJECTS.map((project, index) => {
            const { rotate, translateX, translateY } = getFanTransform(index, total, deckHovered);

            return (
              <motion.div
                key={project.id}
                className="project-card"
                style={{ '--accent': project.accent, zIndex: index + 1 }}
                animate={{ rotate, x: translateX, y: translateY }}
                transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 1.4, restDelta: 0.001 }}
                whileHover={{ scale: 1.07, zIndex: 20, transition: { type: 'spring', stiffness: 200, damping: 22 } }}
                onClick={() => setSelected(project)}
              >
                {/* Glossy sheen */}
                <div className="card-gloss" />

                {/* Glow border accent */}
                <div className="card-glow" style={{ borderColor: project.accent }} />

                {/* Card content */}
                <div className="card-body">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-subtitle">{project.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Modal / Detail Overlay ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal-card"
              style={{ '--accent': selected.accent }}
              initial={{ scale: 0.8, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X size={20} />
              </button>

              <h2 className="modal-title">{selected.title}</h2>
              <p className="modal-subtitle">{selected.subtitle}</p>

              <div className="modal-tags">
                {selected.tech.map((t) => (
                  <span key={t} className="card-tech-tag" style={{ borderColor: selected.accent }}>
                    {t}
                  </span>
                ))}
              </div>

              {selected.brief && (
                <div className="modal-section">
                  <h4 className="modal-section-title">About</h4>
                  <p className="modal-description">{selected.brief}</p>
                </div>
              )}

              {selected.howItWorks && (
                <div className="modal-section">
                  <h4 className="modal-section-title">How It Works</h4>
                  <p className="modal-description">{selected.howItWorks}</p>
                </div>
              )}

              {selected.why && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Why This Project</h4>
                  <p className="modal-description">{selected.why}</p>
                </div>
              )}

              {selected.problemSolves?.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Problem It Solves</h4>
                  <ul className="modal-list">
                    {selected.problemSolves.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {selected.limitations?.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Constraints & Limitations</h4>
                  <ul className="modal-list">
                    {selected.limitations.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
              )}

              <div className="modal-links">
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noreferrer" className="modal-link">
                    <Github size={16} /> GitHub
                  </a>
                )}
                {selected.live && (
                  <a href={selected.live} target="_blank" rel="noreferrer" className="modal-link primary">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
