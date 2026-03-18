import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import About from './components/About';
import './index.css';

function App() {
  // --- Scroll Parallax for Background ---
  const { scrollY } = useScroll();
  // Sky translates down by 10vh, pushing it back in parallax depth
  const skyY = useTransform(scrollY, [0, 1000], ['0vh', '10vh']);
  // Forest dragged down (starts at 30vh) to reveal more sky, translates up to 0vh on scroll
  const forestY = useTransform(scrollY, [0, 1000], ['30vh', '0vh']);

  // --- Mouse Parallax for Hero Text ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map mouse position to parallax offset
  const parallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const parallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  return (
    <>
      <ParticleBackground />
      <div className="portfolio-container" onMouseMove={handleMouseMove}>
        
        {/* --- Hero Wrapper (Ensures 100vh height so parallax finishes before About begins) --- */}
        <div className="hero-section-wrapper" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          {/* --- Scroll Parallax Background Container --- */}
          <div 
            className="scroll-parallax-bg" 
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              overflow: 'hidden', zIndex: 0, pointerEvents: 'none',
              // Fades out only the very bottom edge of the parallax section (85% to 100%) so the particles overlay right at the end!
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
            }}
          >
          {/* Layer 1: Distant Sky (Slow) */}
          <motion.div
            style={{
              position: 'absolute',
              top: '-15vh', left: '-5vw', right: '-5vw', bottom: '-15vh',
              backgroundImage: `url('/sky.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              y: skyY
            }}
          />
          {/* Layer 2: Foreground Forest (Faster, Growing) */}
          <motion.div
            style={{
              position: 'absolute',
              top: '-10vh', left: '-5vw', right: '-5vw', bottom: '-20vh',
              backgroundImage: `url('/forest.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'bottom center',
              backgroundRepeat: 'no-repeat',
              mixBlendMode: 'multiply', // Removes the white background so the sky is visible
              y: forestY
            }}
          />
          </div>
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
          {/* Parallax wrapper */}
          <motion.div style={{ x: parallaxX, y: parallaxY }}>
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
            <h1 className="hero-title">
              SUPRIT L
            </h1>
            <p className="hero-subtitle">
              AI & Data Science Engineer
            </p>
            <div className="btn-group">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="btn primary-btn"
              >
                View My Work <ArrowRight className="btn-icon" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="btn secondary-btn"
              >
                Contact Me
              </motion.a>
            </div>

            <div className="social-links">
              <motion.a whileHover={{ y: -5, color: '#fff' }} href="#"><Github /></motion.a>
              <motion.a whileHover={{ y: -5, color: '#fff' }} href="#"><Linkedin /></motion.a>
              <motion.a whileHover={{ y: -5, color: '#fff' }} href="#"><Mail /></motion.a>
            </div>
            </motion.div>
          </motion.div>
        </main>
        </div> {/* End Hero Wrapper */}

        <About />

        {/* Temporary space to allow scrolling and testing parallax */}
        <section id="skills" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, backgroundColor: 'transparent' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '3rem', color: '#fff' }}
          >
            Skills Section Coming Soon
          </motion.h2>
        </section>
      </div>
    </>
  );
}

export default App;
