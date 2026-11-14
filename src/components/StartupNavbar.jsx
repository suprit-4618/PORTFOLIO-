import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileDown, LogOut, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import './StartupNavbar.css';

export const StartupNavbar = ({ onExitToGateway, isVisible = true, theme = 'light', onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'ABOUT', href: '#hero' },
    { label: 'JOURNEY', href: '#experience' },
    { label: 'TECH STACK', href: '#skills' },
    { label: 'PUBLICATIONS', href: '#publications' },
    { label: 'CERTIFICATES', href: '#certificates' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <motion.header 
      className={`startup-navbar-wrapper ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ opacity: 0, y: -28 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -28,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="startup-navbar-container">
        
        {/* Bespoke Monogram / Brand */}
        <a href="#" className="startup-brand" aria-label="Suprit L. Home">
          <span className="brand-monogram">SL</span>
          <span className="brand-name">SUPRIT L<span className="brand-period">.</span></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="startup-desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="startup-nav-link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="startup-nav-actions">
          {/* Light / Dark Mode Toggle */}
          <button 
            onClick={onToggleTheme} 
            className="startup-btn startup-btn-theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={14} className="theme-icon-sun" /> : <Moon size={14} className="theme-icon-moon" />}
            <span className="theme-btn-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <a 
            href="/Suprit_AI_Engineer.pdf" 
            download="Suprit_AI_Engineer.pdf" 
            className="startup-btn startup-btn-ghost"
            title="Download CV / Resume (PDF)"
          >
            <FileDown size={14} />
            <span>CV</span>
          </a>

          <button 
            onClick={onExitToGateway} 
            className="startup-btn startup-btn-exit"
            title="Exit to Matrix Choice Gateway"
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="startup-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          className="startup-mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="startup-mobile-links">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="startup-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <ArrowUpRight size={14} />
              </a>
            ))}
            <div className="startup-mobile-actions-row">
              <button 
                onClick={() => {
                  if (onToggleTheme) onToggleTheme();
                  setMobileMenuOpen(false);
                }} 
                className="startup-btn startup-btn-theme w-full"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a 
                href="/Suprit_AI_Engineer.pdf" 
                download="Suprit_AI_Engineer.pdf" 
                className="startup-btn startup-btn-ghost w-full"
              >
                <FileDown size={14} />
                <span>Download Resume</span>
              </a>

              <button 
                onClick={onExitToGateway} 
                className="startup-btn startup-btn-exit w-full"
              >
                <LogOut size={14} />
                <span>Exit Gateway</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default StartupNavbar;
