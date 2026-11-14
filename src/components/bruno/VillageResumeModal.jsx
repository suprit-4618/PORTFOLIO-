import React, { useState, useEffect } from 'react';
import { 
  X, ArrowRight, ArrowUpRight, Download, Mail, Github, Linkedin, 
  ExternalLink, FileText, Sparkles, Cpu, Briefcase, Award, 
  BookOpen, User, Check, Send, Globe, Terminal, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projectsData';

/* ─────────────────────────────────────────────────────────────
   WordsPullUp: Cinematic typography reveal matching Prisma Hero
   ───────────────────────────────────────────────────────────── */
export const WordsPullUp = ({ text, className = "", showAsterisk = false }) => {
  const words = text.split(" ");
  return (
    <div className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 38, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.24em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.05em] -right-[0.34em] text-[0.42em] text-[#f59e0b] select-none">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Section Metadata & Editorial Copy
   ───────────────────────────────────────────────────────────── */
const SECTION_CONFIG = {
  about: {
    navLabel: "Story",
    stamp: "01 / 07 · THE FOUNDER'S ALPINE LODGE",
    megaTitle: "SUPRIT",
    showAsterisk: true,
    subtitle: "Applied Machine Learning & High-Performance Systems Architect",
    manifesto: "Bridging deep mathematical research with production-grade engineering. Architecting resilient full-stack systems, edge neural vision pipelines, and multi-agent systems designed to solve real-world community challenges.",
    ctaLabel: "Download Dossier (PDF)",
    ctaHref: "/Suprit_AI_Engineer.pdf",
    ctaDownload: "Suprit_AI_Engineer.pdf",
    ctaType: "download",
    coords: "LAT 15.8497° N, 74.4977° E · ELEV 1,280M · BELAGAVI / BENGALURU"
  },
  skills: {
    navLabel: "Arsenal",
    stamp: "02 / 07 · THE ARTISAN'S TECH FORGE",
    megaTitle: "ARSENAL",
    showAsterisk: true,
    subtitle: "33+ Production Frameworks, Neural Runtimes & Languages",
    manifesto: "A battle-hardened toolset spanning CUDA tensor optimization, distributed cloud backends, reactive TypeScript frontends, and low-latency WebGL spatial pipelines.",
    ctaLabel: "Explore Live Creations",
    ctaTargetTab: "projects",
    ctaType: "tab",
    coords: "CUDA 12.2 · PYTORCH 2.3 · REACT 19 · THREE.JS · AWS CLOUD"
  },
  experience: {
    navLabel: "Journey",
    stamp: "03 / 07 · THE FOREST GUILD TAVERN",
    megaTitle: "JOURNEY",
    showAsterisk: true,
    subtitle: "Track Record of Research, State Innovation & Enterprise Cloud",
    manifesto: "Proven delivery across statewide government innovation grant fellowships, fast-paced startup engineering environments, and enterprise cloud architecture simulations.",
    ctaLabel: "Download Full Record (PDF)",
    ctaHref: "/Suprit_AI_Engineer.pdf",
    ctaDownload: "Suprit_AI_Engineer.pdf",
    ctaType: "download",
    coords: "TAP ACADEMY · K-TECH (NAIN) · SALESFORCE FORAGE"
  },
  projects: {
    navLabel: "Creations",
    stamp: "04 / 07 · HIGHLAND INNOVATION MANOR",
    megaTitle: "CREATIONS",
    showAsterisk: true,
    subtitle: "Flagship AI Applications & Distributed Systems",
    manifesto: "End-to-end engineered software bridging complex neural network models, sub-50ms vector retrieval pipelines, and responsive, human-centered user experiences.",
    ctaLabel: "Inspect GitHub Repositories",
    ctaHref: "https://github.com/suprit-4618",
    ctaType: "external",
    coords: "AGRIVERSEAI · RAG SEARCH · JOB SCOUT · DOCTEST · JANISA"
  },
  publications: {
    navLabel: "Research",
    stamp: "05 / 07 · THE STONE SCRIPTORIUM",
    megaTitle: "RESEARCH",
    showAsterisk: true,
    subtitle: "Peer-Reviewed Scientific Publications & Applied Models",
    manifesto: "Empirical machine learning research published in international peer-reviewed journals, focused on localized computer vision and bilingual Kannada speech synthesis.",
    ctaLabel: "Read Published Paper (PDF)",
    ctaHref: "/publications/agriverseAi.pdf",
    ctaType: "external",
    coords: "IRJMETS JOURNAL · VOL 07 / ISSUE 05 · DOI: 10.56726/IRJMETS78194"
  },
  certificates: {
    navLabel: "Credentials",
    stamp: "06 / 07 · ACADEMY OF SEALS",
    megaTitle: "SEALS",
    showAsterisk: true,
    subtitle: "Verified Global Enterprise & Algorithmic Certifications",
    manifesto: "Industry-standard credentials validating verified competence across Salesforce cloud marketing automation, scalable AI systems, and algorithmic optimization.",
    ctaLabel: "Verify on Salesforce Trailhead",
    ctaHref: "https://trailhead.salesforce.com/en/credentials/verification/",
    ctaType: "external",
    coords: "CREDENTIAL ID: 8193916 · AWS PRACTITIONER · HACKERRANK"
  },
  contact: {
    navLabel: "Inquiries",
    stamp: "07 / 07 · CROSSROADS COURIER POSTHOUSE",
    megaTitle: "DISPATCH",
    showAsterisk: true,
    subtitle: "Direct Lines for Full-Time Roles & Global Research",
    manifesto: "Open for full-time software engineering roles, applied machine learning research initiatives, and technical advisory. Transmit an inquiry directly to Suprit's desk.",
    ctaLabel: "Send Direct Email",
    ctaHref: "mailto:supritkl@gmail.com",
    ctaType: "email",
    coords: "EMAIL: SUPRITKL@GMAIL.COM · LINKEDIN: /IN/SUPRIT-K-L"
  }
};

export const VillageResumeModal = ({ initialSection = 'about', onClose, onSelectProject }) => {
  const [activeTab, setActiveTab] = useState(initialSection || 'about');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    if (initialSection && SECTION_CONFIG[initialSection]) {
      setActiveTab(initialSection);
    }
  }, [initialSection]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentConfig = SECTION_CONFIG[activeTab] || SECTION_CONFIG.about;

  const handleCtaClick = () => {
    if (currentConfig.ctaType === 'tab' && currentConfig.ctaTargetTab) {
      setActiveTab(currentConfig.ctaTargetTab);
    }
  };

  const handleSendDispatch = (e) => {
    e.preventDefault();
    const mailto = `mailto:supritkl@gmail.com?subject=${encodeURIComponent(contactSubject || 'Portfolio Inquiry / Collaboration')}&body=${encodeURIComponent(contactMessage || 'Hello Suprit, I saw your 3D interactive portfolio and would like to connect.')}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="village-modal-backdrop" onClick={onClose}>
      <motion.div 
        className="village-modal-dialog"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Procedural Film Grain & Noise Overlay */}
        <div className="prisma-noise-overlay" />

        {/* Ambient Sunset Vignette */}
        <div className="prisma-ambient-glow" />

        {/* ─── Floating Top Capsule Navbar (Prisma Style) ─── */}
        <nav className="prisma-navbar-wrapper">
          <div className="prisma-navbar">
            {Object.keys(SECTION_CONFIG).map((key, idx) => {
              const cfg = SECTION_CONFIG[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  className={`prisma-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <span className="font-mono text-[10px] opacity-60">0{idx + 1}</span>
                  <span>{cfg.navLabel}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Close Button / ESC Pill */}
        <button className="prisma-close-pill" onClick={onClose} title="Close Canvas (Esc)">
          <span>ESC</span>
          <X size={15} />
        </button>

        {/* ─── Split Editorial Grid Canvas ─── */}
        <div className="prisma-canvas-body">
          
          {/* ─── LEFT HERO ZONE (Massive Typography & Manifesto) ─── */}
          <div className="prisma-hero-pane">
            
            {/* Index Stamp & Live Status */}
            <div className="prisma-index-stamp">
              <span className="prisma-status-dot" />
              <span>{currentConfig.stamp}</span>
            </div>

            {/* Massive Display Title with WordsPullUp */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab + "-title"}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="prisma-mega-title">
                  <WordsPullUp text={currentConfig.megaTitle} showAsterisk={currentConfig.showAsterisk} />
                </h1>
                <p className="prisma-hero-subtitle">{currentConfig.subtitle}</p>
              </motion.div>
            </AnimatePresence>

            {/* Manifesto Prose */}
            <AnimatePresence mode="wait">
              <motion.p 
                key={activeTab + "-manifesto"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="prisma-hero-manifesto"
              >
                {currentConfig.manifesto}
              </motion.p>
            </AnimatePresence>

            {/* Primary Action Button (The Prisma Round Pill) */}
            <div className="flex items-center gap-4 flex-wrap">
              {currentConfig.ctaType === 'tab' ? (
                <button onClick={handleCtaClick} className="prisma-cta-btn">
                  <span>{currentConfig.ctaLabel}</span>
                  <span className="prisma-cta-arrow">
                    <ArrowRight size={16} />
                  </span>
                </button>
              ) : currentConfig.ctaType === 'download' ? (
                <a 
                  href={currentConfig.ctaHref} 
                  download={currentConfig.ctaDownload} 
                  className="prisma-cta-btn"
                >
                  <span>{currentConfig.ctaLabel}</span>
                  <span className="prisma-cta-arrow">
                    <Download size={16} />
                  </span>
                </a>
              ) : (
                <a 
                  href={currentConfig.ctaHref} 
                  target={currentConfig.ctaType === 'email' ? '_self' : '_blank'} 
                  rel="noopener noreferrer" 
                  className="prisma-cta-btn"
                >
                  <span>{currentConfig.ctaLabel}</span>
                  <span className="prisma-cta-arrow">
                    <ArrowRight size={16} />
                  </span>
                </a>
              )}

              {activeTab !== 'contact' && (
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="text-xs uppercase tracking-widest text-[#E1E0CC]/60 hover:text-[#E1E0CC] transition-colors py-2 px-4 rounded-full border border-transparent hover:border-[#E1E0CC]/20"
                >
                  Dispatch Inquiry →
                </button>
              )}
            </div>

            {/* Telemetry Footer Coordinates */}
            <div className="prisma-footer-coords">
              {currentConfig.coords}
            </div>

          </div>

          {/* ─── RIGHT INTERACTIVE DOSSIER PANEL ─── */}
          <div className="prisma-dossier-pane">
            <AnimatePresence mode="wait">

              {/* 1. STORY / ABOUT ME */}
              {activeTab === 'about' && (
                <motion.div 
                  key="dossier-about"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  <div className="prisma-card">
                    <div className="prisma-card-label">Core Ethos & Engineering Philosophy</div>
                    <blockquote className="text-base italic text-[#E1E0CC] font-light border-l-2 border-[#f59e0b] pl-4 my-2">
                      "Real-world impact over artificial benchmarks. Writing clean, resilient systems that bridge mathematical machine learning with effortless human experiences."
                    </blockquote>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">Academic Foundations</div>
                    <h4 className="prisma-card-title">Bachelor of Engineering · Computer Science & Engineering</h4>
                    <p className="prisma-card-body">
                      Student Innovator & Research Lead at <b>K-tech (NAIN)</b>, spearheading localized crop diagnostics and voice NLP for regional agricultural communities.
                    </p>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">Architectural Pillars</div>
                    <div className="grid grid-cols-1 gap-2.5 mt-2">
                      <div className="flex items-start gap-3 text-sm text-[#E1E0CC]/80">
                        <span className="text-[#f59e0b] font-mono mt-0.5">01</span>
                        <span><b>Rigorous Engineering:</b> Clean code abstractions, zero latency leaks, and test-driven contracts.</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-[#E1E0CC]/80">
                        <span className="text-[#f59e0b] font-mono mt-0.5">02</span>
                        <span><b>Applied Neural AI:</b> Production-ready computer vision and voice models serving regional non-English speakers.</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-[#E1E0CC]/80">
                        <span className="text-[#f59e0b] font-mono mt-0.5">03</span>
                        <span><b>Spatial Mastery:</b> End-to-end fluency from PyTorch tensors down to WebGL canvas shaders.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. ARSENAL / SKILLS */}
              {activeTab === 'skills' && (
                <motion.div 
                  key="dossier-skills"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  <div className="prisma-card">
                    <div className="prisma-card-label">🧠 AI, Deep Learning & Vision</div>
                    <h4 className="prisma-card-title">Neural Compute Stack</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Python 3.11', 'PyTorch (CUDA)', 'TensorFlow', 'Scikit-Learn', 'OpenCV', 'LangChain', 'Pinecone', 'Gemini AI', 'Transformers', 'Hugging Face', 'Speech NLP'].map(s => (
                        <span key={s} className="prisma-pill-tag text-amber-200 border-amber-500/25 bg-amber-500/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">💻 Full-Stack & Spatial WebGL</div>
                    <h4 className="prisma-card-title">Interactive Reactive Systems</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['React 19', 'TypeScript', 'Three.js', 'WebGL', 'Cannon-es Physics', 'Node.js', 'Express', 'Tailwind CSS', 'HTML5 Canvas', 'REST APIs'].map(s => (
                        <span key={s} className="prisma-pill-tag text-sky-200 border-sky-500/25 bg-sky-500/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">☁️ Cloud, Databases & DevOps</div>
                    <h4 className="prisma-card-title">Distributed Foundations</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['AWS (EC2, S3, Lambda)', 'Docker', 'PostgreSQL', 'MySQL', 'Git & GitHub', 'Vite', 'Vercel', 'Linux / Bash'].map(s => (
                        <span key={s} className="prisma-pill-tag text-emerald-200 border-emerald-500/25 bg-emerald-500/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. JOURNEY / EXPERIENCE */}
              {activeTab === 'experience' && (
                <motion.div 
                  key="dossier-experience"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  <div className="prisma-card">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <div className="prisma-card-label">02/2026 — 06/2026 · BENGALURU</div>
                        <h4 className="prisma-card-title">Full Stack Web Development Intern</h4>
                        <p className="text-xs uppercase tracking-wider text-[#f59e0b] font-mono">TAP Academy</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 font-mono text-[#E1E0CC]">Development</span>
                    </div>
                    <p className="prisma-card-body mt-2">
                      Engineered modular full-stack web applications. Implemented React component trees, integrated RESTful backend APIs, and optimized SQL relational queries.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Java', 'JavaScript', 'React', 'SQL', 'REST APIs', 'Git'].map(s => (
                        <span key={s} className="prisma-pill-tag text-[11px] py-1 px-2.5">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="prisma-card">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <div className="prisma-card-label">04/2025 — PRESENT · BELAGAVI</div>
                        <h4 className="prisma-card-title">Student Innovator & Research Lead</h4>
                        <p className="text-xs uppercase tracking-wider text-[#f59e0b] font-mono">K-tech (NAIN)</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-[#f59e0b] font-mono">State Fellowship</span>
                    </div>
                    <p className="prisma-card-body mt-2">
                      Spearheaded the research and development of <b>AgriVerseAI</b>. Prototyped regional crop disease detection and voice NLP for regional Kannada-speaking agricultural communities under innovation grants.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Python', 'Computer Vision', 'PyTorch', 'Speech NLP', 'Research'].map(s => (
                        <span key={s} className="prisma-pill-tag text-[11px] py-1 px-2.5">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="prisma-card">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <div className="prisma-card-label">FORAGE INDUSTRY SIMULATION</div>
                        <h4 className="prisma-card-title">Salesforce Developer Simulation</h4>
                        <p className="text-xs uppercase tracking-wider text-[#f59e0b] font-mono">Salesforce Cloud</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 font-mono text-[#E1E0CC]">Certified</span>
                    </div>
                    <p className="prisma-card-body mt-2">
                      Built automated data models, validation rules, user journey email automations, and CRM workflows aligned with Salesforce Marketing Cloud standards.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 4. CREATIONS / PROJECTS */}
              {activeTab === 'projects' && (
                <motion.div 
                  key="dossier-projects"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-3.5"
                >
                  {PROJECTS_DATA.map((proj) => (
                    <div key={proj.id} className="prisma-card">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="prisma-card-label">{proj.category || 'AI System'} · {proj.year || '2025'}</div>
                          <h4 className="prisma-card-title">{proj.title}</h4>
                        </div>
                        {proj.metrics && proj.metrics[0] && (
                          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">
                            {proj.metrics[0].value} {proj.metrics[0].label}
                          </span>
                        )}
                      </div>

                      <p className="prisma-card-body line-clamp-2 mt-1">
                        {proj.description || proj.subtitle}
                      </p>

                      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E1E0CC]/10 flex-wrap">
                        <button
                          onClick={() => {
                            onClose();
                            if (onSelectProject) onSelectProject(proj.slug);
                          }}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E1E0CC] hover:text-[#f59e0b] transition-colors"
                        >
                          <span>Deep-Dive 3D Breakdown</span>
                          <ArrowUpRight size={14} />
                        </button>

                        <div className="flex items-center gap-3">
                          {proj.github && (
                            <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-[#E1E0CC]/60 hover:text-[#E1E0CC] transition-colors">
                              <Github size={16} />
                            </a>
                          )}
                          {proj.live && (
                            <a href={proj.live} target="_blank" rel="noopener noreferrer" className="text-[#E1E0CC]/60 hover:text-[#E1E0CC] transition-colors">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 5. RESEARCH / PUBLICATIONS */}
              {activeTab === 'publications' && (
                <motion.div 
                  key="dossier-publications"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  <div className="prisma-card">
                    <div className="prisma-card-label">Peer-Reviewed Journal Publication · IRJMETS</div>
                    <h4 className="prisma-card-title leading-snug">
                      AGRIVERSEAI – Smart Agricultural Web Application for Karnataka Regional Communities
                    </h4>
                    
                    <div className="space-y-1 my-3 text-xs font-mono text-[#E1E0CC]/80">
                      <div><b>Authors:</b> Prof. Sagar Birje, Mr. Kiran B Nandani, Mr. Suprit K.L., et al.</div>
                      <div><b>Journal:</b> IRJMETS Journal (Vol: 07 / Issue: 05)</div>
                      <div><b>DOI:</b> 10.56726/IRJMETS78194</div>
                    </div>

                    <p className="prisma-card-body">
                      A voice-activated, bilingual smart agriculture assistant integrating computer vision for automated crop disease classification and natural language speech synthesis for regional farmers in Karnataka. Achieved 95.4% accuracy across 38 crop disease classes.
                    </p>

                    <div className="flex flex-wrap gap-1.5 my-4">
                      {['Applied Machine Learning', 'Computer Vision', 'Speech NLP', 'MobileNetV2', 'Smart Agriculture'].map(t => (
                        <span key={t} className="prisma-pill-tag text-xs">{t}</span>
                      ))}
                    </div>

                    <a 
                      href="/publications/agriverseAi.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="prisma-cta-btn !py-2 !px-4 !text-xs mt-2"
                    >
                      <span>Read Publication (PDF)</span>
                      <span className="prisma-cta-arrow !w-6 !h-6">
                        <FileText size={13} />
                      </span>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* 6. CREDENTIALS / CERTIFICATES */}
              {activeTab === 'certificates' && (
                <motion.div 
                  key="dossier-certificates"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-3.5"
                >
                  <div className="prisma-card">
                    <div className="flex justify-between items-start">
                      <div className="prisma-card-label text-[#f59e0b]">Salesforce Certified</div>
                      <ShieldCheck size={18} className="text-[#f59e0b]" />
                    </div>
                    <h4 className="prisma-card-title">Marketing Cloud Engagement Specialist</h4>
                    <p className="text-xs font-mono text-[#E1E0CC]/60 mb-2">Credential ID: 8193916 · Issued Oct 08, 2026</p>
                    <p className="prisma-card-body">
                      Verified expertise in data modeling, journey automation, subscriber data architecture, and multi-channel marketing campaigns.
                    </p>
                    <a 
                      href="https://trailhead.salesforce.com/en/credentials/verification/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-[#f59e0b] hover:underline mt-3"
                    >
                      <span>Verify on Trailhead</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">Amazon Web Services</div>
                    <h4 className="prisma-card-title">AWS AI Practitioner Track</h4>
                    <p className="text-xs font-mono text-[#E1E0CC]/60 mb-2">Domain: Cloud ML & Foundation Models</p>
                    <p className="prisma-card-body">
                      Practical training on AWS SageMaker pipelines, Bedrock foundation models, S3 vector stores, and resilient microservice architectures.
                    </p>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">HackerRank Certified</div>
                    <h4 className="prisma-card-title">Python & Problem Solving Specialist</h4>
                    <p className="text-xs font-mono text-[#E1E0CC]/60 mb-2">Algorithmic Optimization & Data Structures</p>
                    <p className="prisma-card-body">
                      Validated mastery over algorithmic efficiency, recursion, graph traversals, and Pythonic optimization.
                    </p>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">DeepLearning.AI / Coursera</div>
                    <h4 className="prisma-card-title">Deep Learning Specialization</h4>
                    <p className="text-xs font-mono text-[#E1E0CC]/60 mb-2">Neural Networks, CNNs & Sequence Models</p>
                    <p className="prisma-card-body">
                      Comprehensive neural network design, hyperparameter tuning, convolutional feature extraction, and attention mechanisms.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 7. DISPATCH / CONTACT */}
              {activeTab === 'contact' && (
                <motion.div 
                  key="dossier-contact"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  <div className="prisma-card">
                    <div className="prisma-card-label">Direct Communication Lines</div>
                    
                    <div className="space-y-3 mt-3">
                      <a href="mailto:supritkl@gmail.com" className="flex items-center gap-3 text-sm text-[#E1E0CC] hover:text-[#f59e0b] transition-colors">
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-[#E1E0CC]/15">
                          <Mail size={15} />
                        </span>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-[#E1E0CC]/50">Primary Email</div>
                          <div className="font-medium">supritkl@gmail.com</div>
                        </div>
                      </a>

                      <a href="https://linkedin.com/in/suprit-k-l" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#E1E0CC] hover:text-[#f59e0b] transition-colors">
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-[#E1E0CC]/15">
                          <Linkedin size={15} />
                        </span>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-[#E1E0CC]/50">LinkedIn Profile</div>
                          <div className="font-medium">linkedin.com/in/suprit-k-l</div>
                        </div>
                      </a>

                      <a href="https://github.com/suprit-4618" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#E1E0CC] hover:text-[#f59e0b] transition-colors">
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-[#E1E0CC]/15">
                          <Github size={15} />
                        </span>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-[#E1E0CC]/50">GitHub Repositories</div>
                          <div className="font-medium">github.com/suprit-4618</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="prisma-card">
                    <div className="prisma-card-label">Instant Dispatch Composer</div>
                    <form onSubmit={handleSendDispatch} className="space-y-3 mt-2">
                      <input 
                        type="text" 
                        placeholder="Subject / Organization / Inquiry Type" 
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#E1E0CC]/15 text-sm text-[#E1E0CC] placeholder-[#E1E0CC]/40 focus:outline-none focus:border-[#E1E0CC]/50"
                      />
                      <textarea 
                        rows={3} 
                        placeholder="Enter your message or project opportunity..." 
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#E1E0CC]/15 text-sm text-[#E1E0CC] placeholder-[#E1E0CC]/40 focus:outline-none focus:border-[#E1E0CC]/50 resize-none"
                      />
                      <button 
                        type="submit" 
                        className="prisma-cta-btn !py-2 !px-5 !text-xs w-full justify-between"
                      >
                        <span>Launch Email Dispatch</span>
                        <span className="prisma-cta-arrow !w-7 !h-7">
                          <Send size={13} />
                        </span>
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
