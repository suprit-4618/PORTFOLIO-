import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight, X } from 'lucide-react';
import './ProjectDetail.css';

// Animation variants
const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const leftVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const rightVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const sectionVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12 + 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (j) => ({
    opacity: 1,
    x: 0,
    transition: { delay: j * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
};

const SECTIONS = (project) => {
  const items = [];
  if (project.brief)        items.push({ label: 'Overview',            content: project.brief,        type: 'text' });
  if (project.howItWorks)   items.push({ label: 'How It Works',        content: project.howItWorks,   type: 'text' });
  if (project.why)          items.push({ label: 'Motivation',          content: project.why,          type: 'text' });
  if (project.problemSolves?.length) items.push({ label: 'What It Solves', content: project.problemSolves, type: 'list' });
  if (project.limitations?.length)   items.push({ label: 'Limitations',    content: project.limitations,   type: 'list' });
  return items;
};

const ProjectDetail = ({ project, onClose }) => {
  // Lock body scroll while open
  useEffect(() => {
    if (!project) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Prevent layout shift if scrollbar disappears
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => { 
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [project]);

  if (!project) return null;
  const sections = SECTIONS(project);

  return (
    <AnimatePresence>
      <motion.div
        className="pd-overlay"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="overlay"
      >
        {/* ── Left Panel ── */}
        <motion.aside
          className="pd-left"
          style={{ '--accent': project.accent }}
          variants={leftVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Noise texture overlay for the left panel */}
          <div className="pd-noise" />

          <div className="pd-left-inner">
            <button className="pd-close" onClick={onClose}>
              <X size={18} />
            </button>

            {/* Category label */}
            <motion.p 
              className="pd-category"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {project.subtitle}
            </motion.p>

            {/* Giant title */}
            <motion.h1 
              className="pd-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              {project.title}
            </motion.h1>

            {/* Divider */}
            <motion.div 
              className="pd-divider"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            />

            {/* Tech badges */}
            <div className="pd-tech">
              {project.tech.map((t, i) => (
                <motion.span 
                  key={t} 
                  className="pd-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.05 }}
                >
                  {t}
                </motion.span>
              ))}
            </div>

            {/* Links at bottom */}
            <div className="pd-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="pd-link">
                  <Github size={14} /> GitHub <ArrowUpRight size={12} />
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className="pd-link pd-link-live">
                  <ExternalLink size={14} /> Live Demo <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </motion.aside>

        {/* ── Right Panel ── */}
        <motion.main
          className="pd-right"
          variants={rightVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="pd-sections">
            {sections.map((sec, i) => (
              <motion.div
                key={sec.label}
                className="pd-section"
                custom={i}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Section label with index number */}
                <div className="pd-section-header">
                  <span className="pd-section-num" style={{ color: project.accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="pd-section-label">{sec.label}</h3>
                </div>

                {sec.type === 'text' ? (
                  <p className="pd-section-text">{sec.content}</p>
                ) : (
                  <ul className="pd-section-list">
                    {sec.content.map((item, j) => (
                      <motion.li 
                        key={j} 
                        style={{ '--accent': project.accent }}
                        custom={j}
                        variants={itemVariants}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            {/* Empty state for projects with no content yet */}
            {sections.length === 0 && (
              <motion.p
                className="pd-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Details for this project are coming soon.
              </motion.p>
            )}
          </div>
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetail;
