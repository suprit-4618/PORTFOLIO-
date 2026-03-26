import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, FileDown, Menu, X } from 'lucide-react';
import ParallaxBackground from './components/ParallaxBackground';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Experience from './components/Experience';
import Publications from './components/Publications';
import Contact from './components/ContactSleek';
import CustomCursor from './components/CustomCursor';
import Intro from './components/Intro';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
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
      lerp: 0.1, // Added lerp for smoother interpolation
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // --- Mouse Parallax for Hero Text ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map mouse position to parallax offset for hero text
  const parallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const parallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);

  // Use a ref to track if an animation frame is already requested
  const rafRef = React.useRef();

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Update Framer Motion values immediately
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
    
    // Throttle CSS variable updates to the next animation frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    });
  };

  const { scrollY } = useScroll();

  return (
    <>
      <Analytics />
      <AnimatePresence>
        {showIntro ? (
          <Intro key="intro" onFinish={() => setShowIntro(false)} />
        ) : (
          <motion.div 
            key="content"
            className="portfolio-container" 
            onMouseMove={handleMouseMove}
          >
            
            {/* --- Hero Wrapper --- */}
            <div className="hero-section-wrapper" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
              
              <ParallaxBackground />

              {/* OVERLAY FOR PERFECT SETTLE EFFECT */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.8, duration: 1.5 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#000',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              />

            <motion.header 
              className="header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              <button 
                className="hamburger" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
              <nav className={`desktop-nav ${isMenuOpen ? 'hidden' : ''}`}>
                <ul className="nav-links">
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}><a href="#about">About</a></motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}><a href="#experience">Journey</a></motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}><a href="#skills">Skills</a></motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}><a href="#projects">Projects</a></motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}><a href="#publications">Publications</a></motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}><a href="#certificates">Certificates</a></motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}><a href="#contact">Contact</a></motion.li>
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
            </motion.header>

            <main className="hero-section">
              <div className="hero-content-wrapper">
                <div className="hero-content">
                  <motion.h1 
                    className="hero-title"
                    layoutId="hero-name"
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    SUPRIT L
                  </motion.h1>
                  <motion.p className="hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}>AI & DATA SCIENCE ENGINEER</motion.p>
                  
                  <motion.div className="btn-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}>
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
                  </motion.div>
                </div>
              </div>
            </main>
            </div> {/* End Hero Wrapper */}

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1, duration: 1.5 }}
            >
              <About />
              <Experience />
              <Skills />
              <Projects />
              <Publications />
              <Certificates />
              <Contact />
              <CustomCursor />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
