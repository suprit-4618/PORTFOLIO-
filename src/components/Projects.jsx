import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, X } from 'lucide-react';
import ProjectDetail from './ProjectDetail';
import './Projects.css';

// ─── Project Data ────────────────────────────────────────────────
// To add more projects, simply add a new object to this array.
const PROJECTS = [
  {
    id: 1,
    title: 'Janisa',
    subtitle: 'Holographic AI Interface',
    tech: ['Three.js', 'WebGL', 'MediaPipe Hands', 'JavaScript'],
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
    subtitle: 'Automated ETL Pipeline',
    tech: ['Apache Airflow', 'dbt', 'PostgreSQL', 'Docker', 'Python'],
    accent: '#7c6af7',
    github: 'https://github.com/suprit-4618/crypto-airflow-dbt-pipeline',
    live: null,
    brief: 'A fully automated crypto ETL pipeline that fetches live CoinGecko prices every 5 minutes, transforms them using dbt, and produces analytics-ready tables for real-time market tracking.',
    howItWorks: 'The pipeline uses Airflow to orchestrate two main DAGs: one for extracting raw JSON data from CoinGecko APIs into PostgreSQL, and another for triggering dbt transformations. dbt staging and fact models then convert the raw JSON into cleaned, latest-snapshot data.',
    why: 'The goal was to build a robust, containerized data engineering workflow that demonstrates best practices in orchestration, transformation, and the modern data stack (MDS).',
    problemSolves: [
      'Automates live price extraction without manual intervention',
      'Standardizes highly nested JSON API responses into flat SQL tables',
      'Provides a reliable, version-controlled analytics environment',
    ],
    limitations: [
      'Currently limited to BTC, ETH, and DOGE tracking',
      'Dependent on CoinGecko Public API rate limits',
      'Local deployment via Docker Compose (needs cloud scaling for production)',
    ],
  },
  {
    id: 3,
    title: 'Friday',
    subtitle: 'Advanced AI Assistant',
    tech: ['Gemini 2.0 Flash', 'Python', 'edge-tts', 'AI'],
    accent: '#f7a26a',
    github: null,
    live: null,
    brief: 'A next-generation local AI assistant featuring real-time voice interaction, multilingual support, and system control, powered by Google Gemini 2.0 Flash.',
    howItWorks: 'Friday integrates the Gemini API for deep natural language understanding and leverages edge-tts for high-quality neural speech. It processes voice commands to control system settings and interact across 20+ languages.',
    why: 'The goal was to create a highly responsive, multilingual personal assistant that offers direct system integration and natural voice-based command execution.',
    problemSolves: [
      'Enables hands-free system control and application management',
      'Provides low-latency multilingual translation and voice synthesis',
      'Integrates state-of-the-art LLMs for complex task assistance',
    ],
    limitations: [
      'Requires active internet for Gemini API and neural voice',
      'Speech recognition performance varies with background noise',
      'Hardware-dependent for local system control features',
    ],
  },
  {
    id: 4,
    title: 'AgriVerseAI',
    subtitle: 'Smart AI Agriculture',
    tech: ['TensorFlow', 'FastAPI', 'OpenCV', 'MobileNetV2'],
    accent: '#6af78a',
    github: null,
    live: null,
    gallery: [
      '/projects/agriverseai/Screenshot 2026-03-20 165701.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165721.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165730.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165740.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165752.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165804.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165821.png',
      '/projects/agriverseai/Screenshot 2026-03-20 165830.png'
    ],
    brief: 'A bilingual (Kannada & English), voice-activated smart agriculture assistant that provides real-time crop disease detection, weather insights, and market price tracking for farmers using advanced NLP.',
    howItWorks: 'The platform integrates Google Speech-to-Text and Gemini 2.0/2.5 Pro APIs for natural language understanding. It uses a MobileNetV2-based CNN model for crop disease detection and is built with a React.js/Flutter frontend and a Python (FastAPI) backend.',
    why: 'Developed to bridge the digital literacy gap for rural farmers in Karnataka by providing a voice-first, localized interface for critical agricultural decision-making.',
    problemSolves: [
      'Overcomes language barriers with bilingual voice support',
      'Minimizes crop losses through early disease diagnosis',
      'Provides direct access to government schemes and market prices',
    ],
    limitations: [
      'Detection accuracy depends on image quality and diversity',
      'Real-time data reliability depends on external APIs',
      'Performance can vary on low-end devices in rural areas',
    ],
  },
  {
    id: 5,
    title: 'AI Semantic Search',
    subtitle: 'Vector-Powered Retrieval',
    tech: ['Python', 'SentenceTransformers', 'Endee', 'PyTorch'],
    accent: '#f76ab4',
    github: 'https://github.com/suprit-4618/ai-semantic-search-endee',
    live: null,
    brief: 'An AI-powered semantic search system built using vector embeddings and the Endee Vector Database. It understands the meaning of queries beyond simple keywords.',
    howItWorks: 'Documents are converted into 384-dimensional vector embeddings using SentenceTransformers and stored in the Endee Vector Database. The system performs high-dimensional similarity search to find the closest document match.',
    why: 'This project demonstrates the power of transformer-based embeddings and vector databases in solving the limitations of traditional keyword-based search systems.',
    problemSolves: [
      'Overcomes keyword mismatch by identifying semantic intent',
      'Enables context-aware document discovery in unstructured text',
      'Demonstrates efficient high-dimensional vector similarity search',
    ],
    limitations: [
      'Currently optimized for small to medium-scale document sets',
      'Requires pre-generation of embeddings (static indexing)',
      'Search accuracy is dependent on the underlying embedding model',
    ],
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

      {/* ── Full-screen Editorial Detail ── */}
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Projects;
