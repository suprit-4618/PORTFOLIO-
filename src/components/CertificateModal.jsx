import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import './CertificateModal.css';

const CertificateModal = ({ company, onClose }) => {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!company) return null;

  const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(12px)',
      transition: { duration: 0.4, ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, 
      backdropFilter: 'blur(0px)',
      transition: { duration: 0.3, ease: 'easeIn' } 
    }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 40, rotateX: 10 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 25,
        staggerChildren: 0.07,
        delayChildren: 0.2
      } 
    },
    exit: { 
      scale: 0.85, 
      opacity: 0, 
      y: 20, 
      transition: { duration: 0.3, ease: 'circIn' } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 20
      } 
    }
  };

  return (
    <motion.div
      className="cm-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="cm-content glass-panel"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
        style={{ '--cert-accent': company.accent }}
      >
        <button className="cm-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="cm-header">
          <div className="cm-logo-wrapper">
            <img 
              src={company.slug}
              alt={company.name}
              className="cm-company-logo"
              onError={(e) => {
                e.target.src = 'https://api.iconify.design/ph:certificate-bold.svg';
              }}
            />
          </div>
          <div>
            <h2 className="cm-company-name">{company.name}</h2>
            <p className="cm-subtitle">Certificates & Certifications</p>
          </div>
        </div>

        <div className="cm-list-wrapper">
          <div className="cm-list">
            {company.certificates.map((cert, index) => (
              <motion.div 
                key={index} 
                className="cm-item"
                variants={itemVariants}
                whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="cm-item-icon">
                  {index % 2 === 0 ? <Award size={18} /> : <ShieldCheck size={18} />}
                </div>
                <div className="cm-item-text">
                  <h4 className="cm-item-title">{cert.title}</h4>
                </div>
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cm-item-verify">
                  Verify <ExternalLink size={12} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Glow decoration */}
        <div className="cm-glow" />
      </motion.div>
    </motion.div>
  );
};

export default CertificateModal;
