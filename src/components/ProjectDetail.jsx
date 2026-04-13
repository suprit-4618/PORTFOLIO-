import React, { useState, useEffect, useMemo, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, ArrowUpRight, Cpu, Layout, Info, Terminal, Calendar, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProjectDetail.css';

/* ─── HUD Decryption Component ────────────────────────────── */
const HUDText = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  
  useEffect(() => {
    let timeout;
    let iteration = 0;
    const finalBuffer = text.split("");
    
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(
          finalBuffer
            .map((char, index) => {
              if (index < iteration) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text); // Final snap to guarantee precision
        }
        iteration += 2; // Increased from 1/3 for snappier resolution
      }, 30);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className={className}>{displayText || (text[0] + "... ")}</span>;
};

/* ─── HUD Widget Frame ───────────────────────────────────── */
const HUDWidget = ({ title, icon: Icon, children, className = "", delay = 0 }) => (
  <motion.div 
    className={`hud-widget ${className}`}
    initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="hud-w-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
      {Icon && <Icon size={12} className="hud-w-icon" style={{ opacity: 0.5 }} />}
      <span style={{ fontSize: '0.55rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.4 }}>{title}</span>
    </div>
    <div className="hud-w-content" style={{ flex: 1, position: 'relative' }}>
      {children}
    </div>
  </motion.div>
);

/* ─── Main Project Detail ────────────────────────────────── */
const ProjectDetail = ({ project, onClose }) => {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);
  const scrollRef = useRef(null);

  const gallery = project?.gallery || [];

  // Lock scroll
  useEffect(() => {
    if (!project) return;
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="hud-overlay"
        initial={{ opacity: 0, clipPath: 'inset(50% 0 50% 0)' }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
        exit={{ opacity: 0, clipPath: 'inset(50% 0 50% 0)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ '--accent': project.accent }}
      >
        <div className="hud-grid-bg" />
        <div className="hud-scan-line" />

        {/* ── HUD HEADER ────────────────────────────────────── */}
        <header className="hud-header">
          <div className="hud-header-left">
            <div className="hud-status">Project // Stable // FW:HUD-V3</div>
            <div className="hud-title-wrap">
              <h1 className="hud-title">
                <HUDText text={project.title} delay={0.4} />
              </h1>
              <span className="hud-subtitle">
                <HUDText text={project.subtitle} delay={0.8} />
              </span>
            </div>
          </div>
          <button className="hud-close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {/* ── HUD CONTENT BENTO ─────────────────────────────── */}
        <div className="hud-container" ref={scrollRef}>
          
          {/* Main Visual Viewport */}
          <HUDWidget 
            title="Visual_Feed" 
            icon={Layout} 
            className="hud-viewport" 
            delay={0.5}
          >
            <motion.div 
              style={{ 
                height: '100%', 
                backgroundImage: `url(${gallery[galleryIdx] || project.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              key={galleryIdx}
              initial={{ opacity: 0, filter: 'brightness(2) contrast(1.5)' }}
              animate={{ opacity: 1, filter: 'brightness(1) contrast(1)' }}
              transition={{ duration: 0.8 }}
            />
            <div className="hud-viewport-scrim" />
            <div className="hud-viewport-tools">
              <div className="hud-v-label">VIEWPORT_CH_01 // {String(galleryIdx + 1).padStart(2, '0')}</div>
              {gallery.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button 
                    onClick={() => setGalleryIdx((p) => (p - 1 + gallery.length) % gallery.length)}
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--hud-border)', color: '#fff', padding: '0.5rem' }}
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <button 
                    onClick={() => setGalleryIdx((p) => (p + 1) % gallery.length)}
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--hud-border)', color: '#fff', padding: '0.5rem' }}
                   >
                     <ChevronRight size={16} />
                   </button>
                </div>
              )}
            </div>
          </HUDWidget>

          {/* Dossier Text */}
          <HUDWidget 
            title="Project_Dossier" 
            icon={Terminal} 
            className="hud-dossier" 
            delay={0.6}
          >
            <p className="hud-text">
              <HUDText 
                text={project.brief} 
                delay={1.2} 
                className="hud-typewriter-body"
              />
            </p>
          </HUDWidget>

          {/* Stats / Solves */}
          <HUDWidget 
            title="Analysis_Report" 
            icon={Activity} 
            className="hud-stats" 
            delay={0.7}
          >
            <ul className="hud-list">
              {project.problemSolves?.map((item, i) => (
                <li key={i} className="hud-list-item">
                  <HUDText text={item} delay={1.5 + i * 0.1} />
                </li>
              ))}
            </ul>
          </HUDWidget>

          {/* Tech Stack Marquee */}
          <HUDWidget 
            title="System_Architecture" 
            icon={Cpu} 
            className="hud-tech-widget" 
            delay={0.8}
          >
            <div className="hud-marquee">
              <motion.div 
                className="hud-marquee-inner"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: '2rem' }}
              >
                {[...project.tech, ...project.tech].map((t, i) => (
                  <span key={i} className="hud-m-item">{t}</span>
                ))}
              </motion.div>
            </div>
          </HUDWidget>

          {/* Meta Information */}
          <HUDWidget 
            title="Project_Metadata" 
            icon={Info} 
            className="hud-meta" 
            delay={0.9}
          >
            <div className="hud-m-row">
              <span className="hud-m-label">Project_UID</span>
              <span className="hud-m-val">PRJ-00{project.id}-S</span>
            </div>
            <div className="hud-m-row">
              <span className="hud-m-label">Status</span>
              <span className="hud-m-val" style={{ color: project.accent }}>LIVE_ENCRYPTED</span>
            </div>
            <div className="hud-m-row">
              <span className="hud-m-label">Core_Foundation</span>
              <span className="hud-m-val">{project.tech[0]}</span>
            </div>
          </HUDWidget>

          {/* Action Links */}
          <div className="hud-actions">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="hud-btn h6">
                <Github size={20} />
                <span className="hud-btn-label">Access Repo</span>
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="hud-btn">
                <ExternalLink size={20} />
                <span className="hud-btn-label">Live Link</span>
              </a>
            )}
          </div>

        </div>

        {/* ── CSS Injection For Marquee (Simplest way) ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          .hud-typewriter-body {
            display: block;
            margin-top: 0.5rem;
          }
          @media (max-width: 1024px) {
            .hud-container {
               display: block !important;
            }
            .hud-widget {
               margin-bottom: 1rem;
            }
          }
        `}} />

      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetail;
