import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import MatrixChoice from './components/MatrixChoice';
import StartupNavbar from './components/StartupNavbar';
import HeroStartup from './components/HeroStartup';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Experience from './components/Experience';
import Publications from './components/Publications';
import Contact from './components/ContactSleek';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import WorldLoader from './components/bruno/WorldLoader';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

// Lazy load heavy Three.js / CANNON 3D physics and immersive project view for ultra-fast initial load
const BrunoWorld = lazy(() => import('./components/bruno/BrunoWorld'));
const ImmersiveProjectDetails = lazy(() => import('./components/project-details/ImmersiveProjectDetails'));

function App() {
  const [viewMode, setViewMode] = useState('choice'); // 'choice' | 'game' | 'scroll'
  const [showResumeTransition, setShowResumeTransition] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(null);

  // Theme Mode ('light' | 'dark') with persistence and system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Sync deep links on initial mount (?project=slug)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialProject = params.get('project');
    if (initialProject) {
      setSelectedProjectSlug(initialProject);
      setViewMode('scroll');
    }
  }, []);

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const project = params.get('project');
      setSelectedProjectSlug(project || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Project navigation handlers
  const handleOpenProject = useCallback((slug) => {
    setSelectedProjectSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set('project', slug);
    window.history.pushState({ project: slug }, '', url.toString());
  }, []);

  const handleCloseProject = useCallback(() => {
    setSelectedProjectSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.pushState({}, '', url.toString());
  }, []);

  const handleNavigateProject = useCallback((nextSlug) => {
    setSelectedProjectSlug(nextSlug);
    const url = new URL(window.location.href);
    url.searchParams.set('project', nextSlug);
    window.history.replaceState({ project: nextSlug }, '', url.toString());
  }, []);

  // Handle switching view modes with transition
  const handleSelectChoice = (mode) => {
    if (mode === 'scroll') {
      setShowResumeTransition(true);
      setIsNavbarVisible(false);
    }
    setViewMode(mode);
  };

  // Global Scroll Lock & Lenis Control
  useEffect(() => {
    if (viewMode === 'game' || viewMode === 'choice' || showResumeTransition || selectedProjectSlug) {
      if (window.lenis) window.lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
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
    }
  }, [viewMode, showResumeTransition, selectedProjectSlug]);

  return (
    <div className="portfolio-app-root">
      <Analytics />

      {/* ─── 1. MATRIX MORPHEUS MINION CHOICE PORTAL ─── */}
      {viewMode === 'choice' && (
        <MatrixChoice onSelectChoice={handleSelectChoice} />
      )}

      {/* ─── 2. 3D LOW-POLY VILLAGE PLAYGROUND ─── */}
      {viewMode === 'game' && (
        <Suspense fallback={
          <WorldLoader 
            progress={32}
            stageText="Streaming 3D Alpine Engine..."
            isReady={false}
          />
        }>
          <BrunoWorld 
            onToggleClassicView={() => handleSelectChoice('scroll')}
            onExitToGateway={() => setViewMode('choice')}
            onSelectProject={(projectOrSlug) => {
              const slug = typeof projectOrSlug === 'string' ? projectOrSlug : (projectOrSlug?.slug || projectOrSlug?.id);
              handleOpenProject(slug);
            }}
          />
        </Suspense>
      )}

      {/* ─── 3. RESUME PORTFOLIO (Atmospheric Dark Hero & Fluid Entrance) ─── */}
      {viewMode === 'scroll' && (
        <div className="portfolio-container" style={{ position: 'relative', zIndex: 10, background: '#050608', minHeight: '100vh', color: '#ffffff' }}>
          <StartupNavbar 
            isVisible={isNavbarVisible} 
            onExitToGateway={() => setViewMode('choice')} 
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main>
            <HeroStartup 
              triggerIntro={showResumeTransition} 
              onPhaseChange={(phase) => {
                if (phase === 'settled') {
                  setIsNavbarVisible(true);
                } else {
                  setIsNavbarVisible(false);
                }
              }}
              onIntroComplete={() => {
                setShowResumeTransition(false);
                setIsNavbarVisible(true);
              }} 
            />
            <div className="portfolio-main-sections" style={{ position: 'relative', zIndex: 20 }}>
              <Experience />
              <Skills />
              <Publications />
              <Certificates />
              <Projects onProjectSelect={handleOpenProject} />
              <Contact />
            </div>
          </main>
          <Footer />
        </div>
      )}

      {/* ─── 4. IMMERSIVE FULLSCREEN PROJECT DETAILS EXPERIENCE ─── */}
      <AnimatePresence>
        {selectedProjectSlug && (
          <Suspense fallback={null}>
            <ImmersiveProjectDetails
              projectSlug={selectedProjectSlug}
              onClose={handleCloseProject}
              onNavigateProject={handleNavigateProject}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      <CustomCursor />
    </div>
  );
}

export default App;
