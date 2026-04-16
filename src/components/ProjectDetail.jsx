import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, ChevronLeft, ChevronRight, ArrowRight, AppWindow } from 'lucide-react';
import './ProjectDetail.css';

const CinematicGallery = ({ project, onClose }) => {
  const [activeImg, setActiveImg] = useState(0);
  const gallery = project?.gallery || [];
  const overlayRef = useRef(null);

  useEffect(() => {
    // Robust Scroll Lock
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;
    
    // Stop Lenis Global
    if (window.lenis) window.lenis.stop();

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (window.lenis) window.lenis.start();
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <motion.div 
      className="studio-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={overlayRef}
      data-lenis-prevent 
    >
      <div className="studio-scroll-container">
        
        {/* --- CINEMATIC HERO --- */}
        <section className="studio-hero">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeImg}
              className="studio-hero-img"
              style={{ backgroundImage: `url(${gallery[activeImg] || project.bgImage})` }}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </AnimatePresence>
          <div className="studio-hero-gradient" />
          
          <div className="studio-header-nav">
            <div className="studio-brand">PROJECT_STUDIO // {project.id}</div>
            <button className="studio-close-btn" onClick={onClose} aria-label="Close Project">
              <X size={24} />
              <span>ESC</span>
            </button>
          </div>

          <div className="studio-hero-content">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {project.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {project.subtitle}
            </motion.p>
          </div>

          {gallery.length > 1 && (
            <div className="studio-gallery-controls">
              <button onClick={() => setActiveImg((p) => (p - 1 + gallery.length) % gallery.length)}>
                <ChevronLeft size={20} />
              </button>
              <div className="studio-gallery-dots">
                {gallery.map((_, i) => (
                  <div key={i} className={`studio-dot ${i === activeImg ? 'active' : ''}`} />
                ))}
              </div>
              <button onClick={() => setActiveImg((p) => (p + 1) % gallery.length)}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </section>

        {/* --- PREMIUM DOSSIER CARD --- */}
        <div className="studio-content-wrapper">
          <motion.div 
            className="studio-card"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <div className="studio-card-grid">
              
              <div className="studio-main-col">
                <div className="studio-label">THE MISSION</div>
                <p className="studio-description">{project.brief}</p>
                
                <div className="studio-label">CORE_SOLUTIONS</div>
                <div className="studio-solves">
                  {project.problemSolves?.map((solve, i) => (
                    <div key={i} className="studio-solve-item">
                      <div className="studio-solve-bullet" />
                      <span>{solve}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="studio-side-col">
                <div className="studio-label">TECHNOLOGIES</div>
                <div className="studio-tech-tags">
                  {project.tech.map((t, i) => (
                    <span key={i} className="studio-tech-tag">{t}</span>
                  ))}
                </div>

                <div className="studio-label">ACTION_LINKS</div>
                <div className="studio-btn-group">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="studio-link-btn primary">
                      <Github size={18} />
                      <span>VIEW REPOSITORY</span>
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="studio-link-btn secondary">
                      <AppWindow size={18} />
                      <span>LAUNCH PROJECT</span>
                    </a>
                  )}
                </div>

                <div className="studio-meta">
                  <div className="studio-meta-item">
                    <span>SECURITY_LEVEL</span>
                    <span>ENCRYPTED_L2</span>
                  </div>
                  <div className="studio-meta-item">
                    <span>SECTOR_ID</span>
                    <span>AI_LABS_0{project.id}</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
          
          <footer className="studio-footer">
            <p>© 2026 SUPRIT L. // ALL RIGHTS RESERVED // CINEMATIC_STUDIO_V1</p>
          </footer>
        </div>

      </div>
    </motion.div>
  );
};

const ProjectDetail = ({ project, onClose }) => {
  if (!project) return null;
  
  const portalRoot = document.getElementById('project-portal');
  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <CinematicGallery key={project.id} project={project} onClose={onClose} />
    </AnimatePresence>,
    portalRoot
  );
};

export default ProjectDetail;
