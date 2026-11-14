import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  Github, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Terminal, 
  Eye, 
  X,
  Code,
  Activity,
  Maximize2,
  Copy,
  Check,
  Zap,
  Layers
} from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projectsData';
import './ImmersiveProjectDetails.css';

const SECTIONS = [
  { id: 'overview', label: 'About' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'techstack', label: 'Tech Stack' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'challenges', label: 'Insights' },
];

export const ImmersiveProjectDetails = ({ projectSlug, onClose, onNavigateProject }) => {
  const currentProject = useMemo(() => {
    return PROJECTS_DATA.find((p) => p.slug === projectSlug) || PROJECTS_DATA[0];
  }, [projectSlug]);

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === currentProject.id);
  const totalProjects = PROJECTS_DATA.length;
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % totalProjects];
  const prevProject = PROJECTS_DATA[(currentIndex - 1 + totalProjects) % totalProjects];

  const [activeSection, setActiveSection] = useState('overview');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const containerRef = useRef(null);

  // Global Scroll Lock & Keyboard Navigation
  useEffect(() => {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') navigateRelative('next');
      if (e.key === 'ArrowLeft') navigateRelative('prev');
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  // Track active section on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + 300;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(`proj-section-${SECTIONS[i].id}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateRelative = (dir) => {
    const nextIdx = dir === 'next' 
      ? (currentIndex + 1) % totalProjects 
      : (currentIndex - 1 + totalProjects) % totalProjects;
    
    if (onNavigateProject) {
      onNavigateProject(PROJECTS_DATA[nextIdx].slug);
    }

    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(`proj-section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleCopyCode = () => {
    if (!currentProject.codeSnippet) return;
    navigator.clipboard.writeText(currentProject.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const accentColor = currentProject.accent || '#10b981';

  return (
    <motion.div 
      className="immersive-project-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      ref={containerRef}
      style={{
        '--proj-accent': accentColor,
        '--proj-accent-secondary': currentProject.accentSecondary || '#059669'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <header className="immersive-top-nav">
        <button 
          onClick={onClose} 
          className="nav-back-btn"
          aria-label="Back to projects"
        >
          <ArrowLeft size={16} className="back-arrow-icon" />
          <span>Projects</span>
        </button>

        <div className="nav-center-identity">
          <span className="nav-project-name">{currentProject.title}</span>
        </div>

        <div className="nav-project-counter-group">
          <span className="project-counter-text">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
          </span>
          <div className="nav-arrow-btns">
            <button
              onClick={() => navigateRelative('prev')}
              className="circular-nav-btn"
              title={`Previous: ${prevProject.title}`}
              aria-label="Previous Project"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => navigateRelative('next')}
              className="circular-nav-btn"
              title={`Next: ${nextProject.title}`}
              aria-label="Next Project"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onClose}
              className="circular-nav-btn close-btn"
              title="Close (Esc)"
              aria-label="Close project"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. CINEMATIC HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="immersive-fullscreen-hero">
        <div 
          className="hero-background-image" 
          style={{
            backgroundImage: `url(${currentProject.bgImage || currentProject.fallbackImage})`
          }}
        />

        <div className="hero-cinematic-overlay" />
        <div className="hero-radial-vignette" />

        <div className="hero-content-wrapper">
          <motion.div 
            className="hero-content-inner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-category-tag">
              <span className="category-accent-dot" />
              <span>{currentProject.category}</span>
            </div>

            <h1 className="hero-project-title">
              {currentProject.title}
            </h1>

            <p className="hero-project-subtitle">
              {currentProject.subtitle}
            </p>

            <p className="hero-project-desc">
              {currentProject.description}
            </p>

            {/* Action Links */}
            <div className="hero-action-buttons">
              {currentProject.live && (
                <a 
                  href={currentProject.live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hero-btn primary-glow"
                >
                  <span>Launch Live</span>
                  <ArrowUpRight size={15} />
                </a>
              )}

              {currentProject.github && (
                <a 
                  href={currentProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hero-btn secondary-outline"
                >
                  <Github size={15} />
                  <span>GitHub</span>
                  <ArrowUpRight size={13} className="opacity-70" />
                </a>
              )}

              {currentProject.paper && (
                <a 
                  href={currentProject.paper} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hero-btn secondary-outline"
                >
                  <FileText size={15} />
                  <span>Research Paper</span>
                  <ArrowUpRight size={13} className="opacity-70" />
                </a>
              )}
            </div>

            {/* Metrics Ribbon */}
            {currentProject.metrics && currentProject.metrics.length > 0 && (
              <div className="hero-metrics-strip">
                {currentProject.metrics.map((m, idx) => (
                  <div key={idx} className="hero-metric-tile">
                    <span className="hero-metric-value">{m.value}</span>
                    <span className="hero-metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. STICKY IN-PAGE NAVIGATION TABS
          ───────────────────────────────────────────────────────────── */}
      <nav className="project-section-progress-nav" aria-label="Project sections">
        <div className="progress-nav-container">
          {SECTIONS.map((sec) => {
            // Hide gallery tab if no gallery images
            if (sec.id === 'gallery' && (!currentProject.gallery || currentProject.gallery.length === 0)) {
              return null;
            }
            // Hide challenges tab if no challenges
            if (sec.id === 'challenges' && (!currentProject.challenges || currentProject.challenges.length === 0)) {
              return null;
            }

            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`section-progress-link ${activeSection === sec.id ? 'active' : ''}`}
              >
                <span>{sec.label}</span>
                {activeSection === sec.id && (
                  <motion.div 
                    layoutId="activeSectionIndicator"
                    className="active-section-indicator-bar"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          4. CONTENT SECTIONS
          ───────────────────────────────────────────────────────────── */}
      <div className="immersive-details-body">
        
        {/* ── SECTION 01: ABOUT ── */}
        <section id="proj-section-overview" className="details-section">
          <div className="section-container">
            <h2 className="unslop-section-title">About the Project</h2>
            
            <div className="overview-narrative-block">
              <p className="narrative-paragraph">
                {currentProject.overview?.summary || currentProject.description}
              </p>
              {currentProject.solution?.description && (
                <p className="narrative-paragraph secondary">
                  {currentProject.solution.description}
                </p>
              )}
            </div>

            {/* Key Capabilities Grid */}
            {currentProject.features && currentProject.features.length > 0 && (
              <div className="features-unslop-grid">
                {currentProject.features.map((feat, idx) => (
                  <div key={idx} className="feature-unslop-card">
                    <div className="feature-icon-pill">
                      {idx === 0 && <Cpu size={18} />}
                      {idx === 1 && <Terminal size={18} />}
                      {idx === 2 && <Zap size={18} />}
                      {idx === 3 && <Database size={18} />}
                      {idx >= 4 && <CheckCircle2 size={18} />}
                    </div>
                    <h3 className="feature-unslop-title">{feat.title}</h3>
                    <p className="feature-unslop-desc">{feat.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 02: ARCHITECTURE & PIPELINE ── */}
        <section id="proj-section-architecture" className="details-section alt-bg">
          <div className="section-container">
            <h2 className="unslop-section-title">Architecture & Pipeline</h2>
            
            {/* Visual Pipeline Flow */}
            {currentProject.architecture?.stages && (
              <div className="architecture-steps-grid">
                {currentProject.architecture.stages.map((st, idx) => (
                  <div key={idx} className="architecture-step-card">
                    <span className="step-number-tag">{st.step}</span>
                    <h4 className="step-card-title">{st.title}</h4>
                    <p className="step-card-desc">{st.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Code Implementation */}
            {currentProject.codeSnippet && (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <div className="terminal-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <span className="code-lang-label">{currentProject.codeLanguage || 'Implementation'}</span>
                  <button onClick={handleCopyCode} className="code-copy-btn" title="Copy code">
                    {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="code-pre-block">
                  <code>{currentProject.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 03: TECH STACK ── */}
        <section id="proj-section-techstack" className="details-section">
          <div className="section-container">
            <h2 className="unslop-section-title">Tech Stack</h2>

            <div className="tech-stack-unslop-grid">
              {Object.entries(currentProject.techStack || {}).map(([domain, techs]) => (
                <div key={domain} className="tech-domain-unslop-card">
                  <h3 className="tech-domain-label">{domain}</h3>
                  <div className="tech-chips-wrap">
                    {techs.map((t) => (
                      <span key={t} className="tech-chip-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 04: GALLERY ── */}
        {currentProject.gallery && currentProject.gallery.length > 0 && (
          <section id="proj-section-gallery" className="details-section alt-bg">
            <div className="section-container">
              <h2 className="unslop-section-title">Project Gallery</h2>

              <div className="gallery-masonry-grid">
                {currentProject.gallery.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="gallery-image-frame"
                    onClick={() => setSelectedGalleryImg(item)}
                  >
                    <img 
                      src={item.src} 
                      alt={item.caption || `${currentProject.title} preview`}
                      loading="lazy" 
                      className="gallery-asset-img"
                    />
                    <div className="gallery-hover-glass">
                      <Maximize2 size={15} />
                      <span>{item.caption || 'View Full Image'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 05: CHALLENGES & INSIGHTS ── */}
        {currentProject.challenges && currentProject.challenges.length > 0 && (
          <section id="proj-section-challenges" className="details-section">
            <div className="section-container">
              <h2 className="unslop-section-title">Engineering Challenges & Solutions</h2>

              <div className="challenges-unslop-list">
                {currentProject.challenges.map((ch, idx) => (
                  <div key={idx} className="challenge-unslop-card">
                    <div className="challenge-index-tag">0{idx + 1}</div>
                    <div className="challenge-body">
                      <h3 className="challenge-title-text">{ch.title}</h3>
                      <p className="challenge-solution-text">{ch.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 06: UP NEXT PROJECT FOOTER ── */}
        <section className="details-section footer-navigation-section">
          <div className="section-container">
            <div 
              className="next-project-banner"
              onClick={() => navigateRelative('next')}
              role="button"
              tabIndex={0}
            >
              <div className="next-project-content">
                <span className="next-eyebrow">UP NEXT</span>
                <h3 className="next-project-title">{nextProject.title}</h3>
                <p className="next-project-subtitle">{nextProject.subtitle}</p>
              </div>
              <div className="next-arrow-circle">
                <ArrowRight size={20} />
              </div>
            </div>

            <div className="footer-back-action">
              <button onClick={onClose} className="footer-back-btn">
                <ArrowLeft size={15} />
                <span>Back to All Projects</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. LIGHTBOX MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedGalleryImg && (
          <motion.div 
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGalleryImg(null)}
          >
            <motion.div 
              className="lightbox-content-box"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedGalleryImg(null)} 
                className="lightbox-close-btn"
                aria-label="Close image"
              >
                <X size={18} />
              </button>
              <img 
                src={selectedGalleryImg.src} 
                alt={selectedGalleryImg.caption || 'Project visual'} 
                className="lightbox-full-img"
              />
              {selectedGalleryImg.caption && (
                <p className="lightbox-caption">{selectedGalleryImg.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImmersiveProjectDetails;
