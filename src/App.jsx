import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import ParallaxBackground from './components/ParallaxBackground';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import './index.css';

function App() {
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

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const { scrollY } = useScroll();

  // Bubble Overlay Visibility: Starts after landing parallax (e.g. 100vh)
  // We'll fade it in between 600px and 1000px scroll
  const bubbleOpacity = useTransform(scrollY, [600, 1000], [0, 1]);

  return (
    <>
      <motion.div style={{ opacity: bubbleOpacity, position: 'fixed', inset: 0, zIndex: -1 }}>
        <ParticleBackground />
      </motion.div>
      <div className="portfolio-container" onMouseMove={handleMouseMove}>
        
        {/* --- Hero Wrapper (Ensures 100vh height so parallax finishes before About begins) --- */}
        <div className="hero-section-wrapper" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          <ParallaxBackground />

        <header className="header">
          <nav>
            <ul className="nav-links">
              <motion.li initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}><a href="#about">About</a></motion.li>
              <motion.li initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}><a href="#skills">Skills</a></motion.li>
              <motion.li initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}><a href="#projects">Projects</a></motion.li>
              <motion.li initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}><a href="#contact">Contact</a></motion.li>
            </ul>
          </nav>
        </header>

        <main className="hero-section">
          <div className="hero-content-wrapper">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h1 className="hero-title">
                SUPRIT L
              </h1>
              
              <div className="btn-group">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#projects"
                  className="btn primary-btn"
                >
                  View My Work <ArrowRight className="btn-icon" />
                </motion.a>
              </div>

              <div className="social-links">
                <motion.a whileHover={{ y: -5, color: '#fff' }} href="#"><Github /></motion.a>
                <motion.a whileHover={{ y: -5, color: '#fff' }} href="#"><Linkedin /></motion.a>
                <motion.a whileHover={{ y: -5, color: '#fff' }} href="#"><Mail /></motion.a>
              </div>
            </motion.div>
          </div>
        </main>
        </div> {/* End Hero Wrapper */}

        <About />

        <Projects />

        <Skills />

      </div>
    </>
  );
}

export default App;
