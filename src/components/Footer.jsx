import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="startup-footer" aria-label="Site Footer">
      <div className="startup-footer-container">

        {/* Top Grid: Symmetrically Balanced Across Container */}
        <div className="footer-top-grid">

          <div className="footer-nav-col">
            <span className="footer-section-title">Navigation</span>
            <ul className="footer-links-list footer-nav-grid-list">
              <li><a href="#hero">Overview</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#skills">Stack</a></li>
              <li><a href="#publications">Research</a></li>
              <li><a href="#certificates">Credentials</a></li>
              <li><a href="#projects">Works</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-connect-col">
            <span className="footer-section-title">Connect</span>
            <ul className="footer-links-list">
              <li>
                <a href="https://github.com/suprit-4618" target="_blank" rel="noopener noreferrer">
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/suprit-l-4618a8291/" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:supritkl49@gmail.com">
                  <Mail size={14} /> supritkl49@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-legal-copy">
            © {currentYear} Suprit L.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
