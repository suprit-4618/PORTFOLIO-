// v1.0.8 - Starship Odyssey & Refined UI
import React, { useEffect, useState, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, FileDown, Menu, X, ChevronDown } from 'lucide-react';
import SpaceOdyssey from './components/SpaceOdyssey';
import About from './components/About';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Experience from './components/Experience';
import Publications from './components/Publications';
import Contact from './components/ContactSleek';
import CustomCursor from './components/CustomCursor';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import ParallaxWrapper from './components/ui/ParallaxWrapper';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Global Scroll Lock & Lenis Control
  useEffect(() => {
    if (selectedProject) {
      if (window.lenis) window.lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      lerp: 0.1,
    });

    window.lenis = lenis;
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = React.useRef();

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    });
  };

  // Parallax transforms for Hero
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const heroX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const heroY = useTransform(springY, [-0.5, 0.5], [20, -20]);
  const heroRotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const heroRotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  return (
    <>
      <Analytics />
      <div className="portfolio-container" onMouseMove={handleMouseMove}>
        {/* --- 3D SPACE ODYSSEY PARALLAX --- */}
        <SpaceOdyssey />
        
        <header className="header">
          <button 
            className="hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <nav className={`desktop-nav ${isMenuOpen ? 'hidden' : ''}`}>
            <ul className="nav-links">
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Journey</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#publications">Publications</a></li>
              <li><a href="#certificates">Certificates</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="mobile-nav-overlay"
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <ul className="mobile-nav-links">
                  <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
                  <li><a href="#experience" onClick={() => setIsMenuOpen(false)}>Journey</a></li>
                  <li><a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a></li>
                  <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a></li>
                  <li><a href="#publications" onClick={() => setIsMenuOpen(false)}>Publications</a></li>
                  <li><a href="#certificates" onClick={() => setIsMenuOpen(false)}>Certificates</a></li>
                  <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* --- SECTION 1: CINEMATIC LANDING (Planet Focus) --- */}
        <section className="cinematic-landing" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ textAlign: 'center' }}
          >
             <p style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', letterSpacing: '0.8em', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
               INITIATING VOYAGE
             </p>
             <motion.div
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
               <ChevronDown size={32} color="rgba(255,255,255,0.5)" />
             </motion.div>
          </motion.div>
        </section>

        {/* --- SECTION 2: HERO (The Name) --- */}
        <main id="hero" className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
          <div className="hero-content-wrapper">
            <motion.div 
              className="hero-content"
              style={{ x: heroX, y: heroY, rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: 'preserve-3d' }}
            >
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, scale: 0.9, translateZ: 50 }}
                whileInView={{ opacity: 1, scale: 1, translateZ: 100 }}
                viewport={{ once: false }}
                transition={{ duration: 1 }}
              >
                SUPRIT L
              </motion.h1>
              <p className="hero-tagline" style={{ transform: 'translateZ(50px)' }}>AI & DATA SCIENCE ENGINEER</p>
              
              <div className="btn-group">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#projects" 
                  className="btn primary-btn"
                >
                  VIEW MY WORK <ArrowRight className="btn-icon" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/Suprit.pdf" 
                  download="Suprit_L_Resume.pdf" 
                  className="btn secondary-btn"
                >
                  DOWNLOAD CV <FileDown className="btn-icon" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </main>

        {/* --- ABOUT --- */}
        <ParallaxWrapper speed={0.5} offset={30}>
          <About />
        </ParallaxWrapper>
        
        <ParallaxWrapper speed={0.3} offset={20}>
          <Experience />
        </ParallaxWrapper>
        
        <ParallaxWrapper speed={0.4} offset={40}>
          <Skills />
        </ParallaxWrapper>
        
        <Projects onProjectSelect={setSelectedProject} />
        
        <ParallaxWrapper speed={0.2} offset={15}>
          <Publications />
        </ParallaxWrapper>
        
        <ParallaxWrapper speed={0.3} offset={25}>
          <Certificates />
        </ParallaxWrapper>
        
        <Contact />
        <Footer />
        <ScrollToTop />
        <CustomCursor />
        <ChatBot />
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
