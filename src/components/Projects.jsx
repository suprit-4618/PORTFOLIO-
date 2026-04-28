import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import './Projects.css';

// ─── Project Data ────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 1,
    title: 'Janisa',
    subtitle: 'Holographic AI Interface',
    bgImage: '/projects/bgs/janisa_bg.png',
    tech: ['Three.js', 'WebGL', 'MediaPipe Hands', 'JavaScript'],
    accent: '#00dcc8',
    github: 'https://github.com/suprit-4618/janisa-hologram',
    live: 'https://janisa-hologram.vercel.app',
    gallery: ['/projects/janisa/janisa_model.png'],
    brief: 'An interactive holographic visualization system that enables users to explore 3D models through gesture-based interaction. It allows real-time manipulation such as rotation and zoom, making complex structures easier to understand.',
    problemSolves: [
      'Eliminates difficulty in understanding complex 3D structures',
      'Makes abstract concepts visually clear and interactive',
      'Enhances learning through hands-on exploration',
    ],
  },
  {
    id: 2,
    title: 'Crypto Airflow',
    subtitle: 'Automated ETL Pipeline',
    bgImage: '/projects/bgs/crypto_airflow_bg.png',
    tech: ['Apache Airflow', 'dbt', 'PostgreSQL', 'Docker', 'Python'],
    accent: '#7c6af7',
    github: 'https://github.com/suprit-4618/crypto-airflow-dbt-pipeline',
    brief: 'A fully automated crypto ETL pipeline that fetches live CoinGecko prices every 5 minutes and transforms them using dbt.',
    problemSolves: [
      'Automates live price extraction without manual intervention',
      'Standardizes highly nested JSON API responses into flat SQL tables',
      'Provides a reliable, version-controlled analytics environment',
    ],
  },
  {
    id: 3,
    title: 'Friday',
    subtitle: 'Personal AI Agent',
    bgImage: '/projects/bgs/friday_bg.png',
    tech: ['Groq', 'FastAPI', 'Electron', 'React', 'Picovoice', 'Playwright'],
    accent: '#00d2ff',
    github: 'https://github.com/suprit-4618/FRIDAY',
    gallery: ['/projects/friday/friday_snapshot.png'],
    brief: 'A fully functional, voice-activated AI desktop assistant that wakes up on hearing its name and executes real system actions using Groq LLaMA 3.3.',
    problemSolves: [
      'Enables hands-free system control and application management',
      'Automates repetitive tasks like sending WhatsApp messages',
      'Provides voice-based access to complex AI reasoning',
    ],
  },
  {
    id: 4,
    title: 'AgriVerseAI',
    subtitle: 'Smart AI Agriculture',
    bgImage: '/projects/bgs/agriverseai_bg.png',
    tech: ['TensorFlow', 'FastAPI', 'OpenCV', 'MobileNetV2', 'Firebase', 'Render'],
    accent: '#6af78a',
    github: 'https://github.com/suprit-4618/AgriVerseAI',
    live: 'https://agriverseai-six.vercel.app',
    gallery: ['/projects/agriverseai/agri_1.png', '/projects/agriverseai/agri_2.png'],
    brief: 'A bilingual voice-activated smart agriculture assistant that provides crop disease detection and weather insights.',
    problemSolves: [
      'Overcomes language barriers with bilingual voice support',
      'Minimizes crop losses through early disease diagnosis',
      'Provides direct access to government schemes',
    ],
  },
  {
    id: 5,
    title: 'AI Semantic Search',
    subtitle: 'Vector-Powered Retrieval',
    bgImage: '/projects/bgs/semantic_search_bg.png',
    tech: ['Python', 'SentenceTransformers', 'Endee', 'PyTorch'],
    accent: '#f76ab4',
    github: 'https://github.com/suprit-4618/ai-semantic-search-endee',
    live: 'https://ai-semantic-search-endee-fznbrf5gfer5dczpjweoaz.streamlit.app/',
    gallery: [
      '/projects/ai-semantic-search/endee_project.png',
      '/projects/ai-semantic-search/semantic_search_1.png',
      '/projects/ai-semantic-search/semantic_search_2.png'
    ],
    brief: 'An AI-powered semantic search system built using vector embeddings and the Endee Vector Database.',
    problemSolves: [
      'Overcomes keyword mismatch by identifying semantic intent',
      'Enables context-aware document discovery',
    ],
  },
];

// ─── Fan angle per card index ─────────────────────────────────────
const getFanTransform = (index, total, isHovered) => {
  const spread = 28;
  const offset = (total - 1) / 2;
  const rotate = isHovered ? (index - offset) * spread : (index - offset) * 3;
  const translateX = isHovered ? (index - offset) * 85 : 0;
  const translateY = isHovered ? Math.abs(index - offset) * 14 : index * -4;
  return { rotate, translateX, translateY };
};

// ─── Individual 3D Card Component ─────────────────────────────
const ProjectCard = ({ project, index, total, deckHovered, onClick }) => {
  const { rotate: fanRotate, translateX: fanX, translateY: fanY } = getFanTransform(index, total, deckHovered);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      className="project-card"
      style={{ 
        '--accent': project.accent, 
        zIndex: index + 1,
        rotateX: deckHovered ? rotateX : 0,
        rotateY: deckHovered ? rotateY : 0,
        transformStyle: 'preserve-3d'
      }}
      animate={{ rotate: fanRotate, x: fanX, y: fanY }}
      transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 1.4 }}
      whileHover={{ scale: 1.07, zIndex: 100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
    >
      <div style={{ transform: 'translateZ(50px)', pointerEvents: 'none', height: '100%' }}>
        <div className="card-image" style={{ backgroundImage: `url(${project.bgImage})` }} />
        <div className="card-overlay" />
        <div className="card-glow" style={{ borderColor: project.accent }} />
        <div className="card-body">
          <h3 className="card-title">{project.title}</h3>
          <p className="card-subtitle">{project.subtitle}</p>
          <div className="card-view-hint">VIEW_CASE_STUDY <ArrowUpRight size={14} /></div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────
const Projects = ({ onProjectSelect }) => {
  const [deckHovered, setDeckHovered] = useState(false);
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
        <p className="projects-hint">Interactive Deck · Select to Explore</p>

        <div
          className="deck-wrapper"
          onMouseEnter={() => setDeckHovered(true)}
          onMouseLeave={() => setDeckHovered(false)}
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard 
              key={project.id}
              project={project}
              index={index}
              total={total}
              deckHovered={deckHovered}
              onClick={onProjectSelect}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
