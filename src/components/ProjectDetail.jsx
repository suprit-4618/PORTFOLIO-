import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Github, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Rocket,
  ArrowUpRight
} from 'lucide-react';
import Lenis from 'lenis';
import { PROJECTS } from './Projects';
import './ProjectDetail.css';

const ProjectDetail = ({ project, onClose }) => {
  const [currentProject, setCurrentProject] = useState(project);
  const currentIndex = PROJECTS.findIndex(p => p.id === currentProject.id);
  const scrollRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Global Scroll Lock
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;
    
    if (window.lenis) window.lenis.stop();

    // Initialize Local Lenis for the description column
    if (scrollRef.current) {
      const lenis = new Lenis({
        wrapper: scrollRef.current,
        content: scrollRef.current.querySelector('.lenis-content'),
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      
      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (window.lenis) window.lenis.start();
      window.removeEventListener('keydown', handleEsc);
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, [onClose]);

  const navigateProject = (direction) => {
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PROJECTS.length;
    } else {
      nextIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    }
    
    // Animate out and change project
    setCurrentProject(PROJECTS[nextIndex]);
    
    // Reset internal scroll
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  if (!currentProject) return null;

  const accentColor = currentProject.accent || '#6366f1';
  const rgbAccent = hexToRgb(accentColor);

  return createPortal(
    <motion.div 
      className="project-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ '--accent-color': accentColor, '--accent-rgb': rgbAccent }}
      data-lenis-prevent
    >
      {/* FIXED CONTROLS */}
      <div className="detail-controls-fixed">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="nav-btn" onClick={() => navigateProject('prev')} aria-label="Previous Project">
            <ChevronLeft size={20} />
          </button>
          <button className="nav-btn" onClick={() => navigateProject('next')} aria-label="Next Project">
            <ChevronRight size={20} />
          </button>
        </div>
        <button className="close-detail-btn" onClick={onClose} aria-label="Close Project">
          <X size={24} />
        </button>
      </div>

      <div className="detail-layout">
        {/* STICKY LEFT: HERO VISUAL */}
        <section className="detail-hero-sticky">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentProject.id}
              className="hero-bg-wrapper"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div 
                className="hero-bg-image" 
                style={{ backgroundImage: `url(${currentProject.bgImage})` }}
              />
              <div className="hero-gradient-overlay" />
            </motion.div>
          </AnimatePresence>

          <div className="hero-header-content">
            <motion.div 
              className="detail-badge"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Case Study // {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
            </motion.div>
            <motion.h1 
              className="detail-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentProject.title}
            </motion.h1>
            <motion.p 
              className="detail-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentProject.subtitle}
            </motion.p>
          </div>
        </section>

        {/* SCROLLING RIGHT: DESCRIPTION & DETAILS */}
        <div className="detail-content-scroll" ref={scrollRef}>
          <div className="lenis-content">
            <div className="section-block">
              <span className="section-label">OVERVIEW</span>
              <p className="detail-description">{currentProject.brief}</p>
            </div>

            <div className="section-block">
              <span className="section-label">CHALLENGE & SOLUTIONS</span>
              <div className="problem-solves-list">
                {currentProject.problemSolves?.map((solve, i) => (
                  <motion.div 
                    key={i} 
                    className="solve-item"
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="solve-number">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                    <span className="solve-text">{solve}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <span className="section-label">TECHNOLOGIES</span>
              <div className="tech-stack-container">
                {currentProject.tech.map((t, i) => (
                  <span key={i} className="tech-pill">{t}</span>
                ))}
              </div>
            </div>

            <div className="section-block">
              <span className="section-label">RESOURCES</span>
              <div className="action-links">
                {currentProject.github && (
                  <a href={currentProject.github} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                    <Github size={18} />
                    <span>Source Code</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {currentProject.live && (
                  <a href={currentProject.live} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                    <Rocket size={18} />
                    <span>Live Demo</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {currentProject.gallery && currentProject.gallery.length > 0 && (
              <div className="section-block">
                <span className="section-label">GALLERY</span>
                <div className="gallery-stack">
                  {currentProject.gallery.map((img, i) => (
                    <motion.div 
                      key={i} 
                      className="gallery-item"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <img src={img} alt={`${currentProject.title} visual ${i+1}`} className="gallery-img" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <footer style={{ padding: '4rem 0', opacity: 0.2, textAlign: 'center' }}>
              <p style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', letterSpacing: '0.4em' }}>
                END OF CASE STUDY
              </p>
            </footer>
          </div>
        </div>
      </div>
    </motion.div>,
    document.getElementById('project-portal')
  );
};

// Helper
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '99, 102, 241';
}

export default ProjectDetail;
