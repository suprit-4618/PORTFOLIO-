import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, FileText, ExternalLink } from 'lucide-react';
import './Certificates.css';
import salesforceLogo from '../assets/salesforce.svg';
import awsLogo from '../assets/aws.png';
import hackerrankLogo from '../assets/hackerrank.svg';
import udemyLogo from '../assets/udemy.svg';
import forageLogo from '../assets/forage.png';

const COMPANY_CERTIFICATES = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: salesforceLogo,
    color: '#00A1E0',
    bgGlow: 'rgba(0, 161, 224, 0.15)',
    highlights: [
      'Marketing Cloud Engagement Specialist',
      'Data Modeling & Automation',
      'Credential ID: 8193916'
    ],
    certificates: [
      { 
        title: 'Marketing Cloud Engagement Specialist', 
        link: '/certific/Salesforce/Cert8193916_MarketingCloudEngagementSpecialist_20261008.pdf',
        credentialId: '8193916',
        issueDate: 'October 08, 2026',
        verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/'
      }
    ]
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: awsLogo,
    color: '#FF9900',
    bgGlow: 'rgba(255, 153, 0, 0.15)',
    highlights: [
      'AWS AI Practitioner Track',
      'Foundation Models & Optimization',
      'Prompt Engineering & GenAI',
      'Responsible AI & Governance'
    ],
    certificates: [
      { title: 'AWS AI Practitioner Learning Plan', link: '/certific/AWS AI PRACTITIONER/AWS Artificial Intelligence Practitioner Learning Plan.pdf' },
      { title: 'AWS Fundamentals of ML & AI', link: '/certific/AWS AI PRACTITIONER/AWS fundamentals of Machine Learnining and Artificial Intelligence.pdf' },
      { title: 'Developing Machine Learning Solutions', link: '/certific/AWS AI PRACTITIONER/Developing Machine Learning Solutions.pdf' },
      { title: 'Essentials of Prompt Engineering', link: '/certific/AWS AI PRACTITIONER/Essentials of Prompt Enginerring.pdf' },
      { title: 'Generative AI Solutions', link: '/certific/AWS AI PRACTITIONER/Generative AI solutions.pdf' },
      { title: 'Optimizing Foundation Models', link: '/certific/AWS AI PRACTITIONER/Optimizing Foundation Models.pdf' },
      { title: 'Responsible AI & Intelligence Practices', link: '/certific/AWS AI PRACTITIONER/Responsible AI and intelligencce Practices.pdf' },
      { title: 'Security, Compliance, Governance', link: '/certific/AWS AI PRACTITIONER/Seccurity, Compilance, Governance.pdf' },
      { title: 'Uses and Applications', link: '/certific/AWS AI PRACTITIONER/USES AND APPLICATIONS.pdf' }
    ]
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    logo: hackerrankLogo,
    color: '#00EA64',
    bgGlow: 'rgba(0, 234, 100, 0.15)',
    highlights: [
      'Software Engineer Intern Assessment',
      'Python (Basic) Certification',
      'SQL (Basic) Relational Queries'
    ],
    certificates: [
      { title: 'Software Engineer Intern', link: '/certific/hackerrank/software_engineer_intern certificate.pdf' },
      { title: 'Python (Basic)', link: '/certific/hackerrank/python_basic certificate.pdf' },
      { title: 'SQL (Basic)', link: '/certific/hackerrank/sql_basic certificate.pdf' }
    ]
  },
  {
    id: 'forage',
    name: 'Forage Simulations',
    logo: forageLogo,
    color: '#6366F1',
    bgGlow: 'rgba(99, 102, 241, 0.15)',
    highlights: [
      'Data Labelling Job Simulation',
      'Technology Job Simulation',
      'Enterprise Engineering Practice'
    ],
    certificates: [
      { title: 'Data Labelling Job Simulation', link: '/certific/Forage/Data labelling job simulation.pdf' },
      { title: 'Technology Job Simulation', link: '/certific/Forage/Technology Job Simulation.pdf' }
    ]
  },
  {
    id: 'udemy',
    name: 'Udemy Academy',
    logo: udemyLogo,
    color: '#A435F0',
    bgGlow: 'rgba(164, 53, 240, 0.15)',
    highlights: [
      'Complete Python Bootcamp',
      'Scripting & OOP Architecture'
    ],
    certificates: [
      { title: 'Complete Python Bootcamp', link: '/certific/Udemy/Python.pdf' }
    ]
  }
];

export const Certificates = () => {
  const [activeCompany, setActiveCompany] = useState(null);

  return (
    <section id="certificates" className="startup-certificates-section" aria-label="Verified Certifications">
      {/* Ambient Artistic Color Atmosphere */}
      <div className="cert-ambient-glow cert-glow-left" aria-hidden="true" />
      <div className="cert-ambient-glow cert-glow-right" aria-hidden="true" />
      <div className="cert-ambient-glow cert-glow-center" aria-hidden="true" />

      <div className="startup-certificates-container">
        
        {/* Section Header */}
        <div className="startup-section-header">
          <h2 className="startup-section-title">
            <span className="title-artistic-gradient">Certifications</span>
          </h2>
        </div>

        {/* Certificates Bento Grid */}
        <div className="startup-certificates-grid">
          {COMPANY_CERTIFICATES.map((comp, index) => (
            <motion.div
              key={comp.id}
              className="startup-cert-card"
              style={{
                '--card-accent': comp.color,
                '--card-glow': comp.bgGlow,
              }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveCompany(comp)}
            >
              {/* Inner Artistic Aura & Color Wash */}
              <div className="cert-card-artistic-glow" />

              <div className="cert-card-top-bar">
                <div className="cert-logo-wrapper">
                  <img src={comp.logo} alt={`${comp.name} logo`} className="cert-logo-img" />
                </div>
                <div className="cert-card-arrow-pill">
                  <ArrowUpRight size={17} />
                </div>
              </div>

              <div className="cert-card-info">
                <h3 className="cert-org-title">{comp.name}</h3>
                <div className="cert-tags-cloud">
                  {comp.highlights.map((tag, i) => (
                    <span key={i} className="cert-artistic-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cert-card-bottom-row">
                <button
                  className="cert-view-trigger-btn"
                  onClick={() => setActiveCompany(comp)}
                >
                  <span>View {comp.certificates.length > 1 ? `${comp.certificates.length} Certificates` : 'Certificate'}</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certificate Modal / Drawer */}
        <AnimatePresence>
          {activeCompany && (
            <div className="cert-modal-backdrop" onClick={() => setActiveCompany(null)}>
              <motion.div
                className="cert-modal-card"
                style={{
                  '--modal-accent': activeCompany.color,
                  '--modal-glow': activeCompany.bgGlow,
                }}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="cert-modal-top-bar">
                  <div className="modal-title-group">
                    <div className="modal-logo-wrapper">
                      <img src={activeCompany.logo} alt={activeCompany.name} className="modal-org-logo" />
                    </div>
                    <div>
                      <h3 className="modal-org-name">{activeCompany.name}</h3>
                      <p className="modal-org-meta">{activeCompany.certificates.length} Verified {activeCompany.certificates.length === 1 ? 'Credential' : 'Credentials'}</p>
                    </div>
                  </div>

                  <button
                    className="modal-close-btn"
                    onClick={() => setActiveCompany(null)}
                    aria-label="Close certificate modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="cert-modal-items-list">
                  {activeCompany.certificates.map((cert, idx) => (
                    <div key={idx} className="cert-modal-row">
                      <div className="cert-row-left">
                        <FileText size={16} className="cert-row-icon" />
                        <div className="cert-row-meta-col">
                          <span className="cert-row-title">{cert.title}</span>
                          {(cert.credentialId || cert.issueDate) && (
                            <div className="cert-row-subline">
                              {cert.credentialId && <span className="cert-sub-id">ID: {cert.credentialId}</span>}
                              {cert.issueDate && <span className="cert-sub-date">{cert.issueDate}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="cert-row-actions">
                        {cert.verifyUrl && (
                          <a
                            href={cert.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-verify-btn"
                            title="Verify credential"
                          >
                            <span>Verify</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cert-pdf-view-btn"
                          title="Open PDF in new tab"
                        >
                          <span>PDF</span>
                          <ArrowUpRight size={13} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Certificates;
