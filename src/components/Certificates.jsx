import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import CertificateModal from './CertificateModal';
import './Certificates.css';
import awsLogo from '../assets/aws.png';
import hackerrankLogo from '../assets/hackerrank.svg';
import udemyLogo from '../assets/udemy.svg';
import forageLogo from '../assets/forage.png';

const COMPANY_CERTIFICATES = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    slug: awsLogo,
    accent: 'rgb(255, 153, 0)',
    description: 'Specialized certifications in Artificial Intelligence and Machine Learning.',
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
    slug: hackerrankLogo,
    accent: 'rgb(46, 214, 115)',
    description: 'Verified skills in Software Engineering, Python, and SQL.',
    certificates: [
      { title: 'Software Engineer Intern', link: '/certific/hackerrank/software_engineer_intern certificate.pdf' },
      { title: 'Python (Basic)', link: '/certific/hackerrank/python_basic certificate.pdf' },
      { title: 'SQL (Basic)', link: '/certific/hackerrank/sql_basic certificate.pdf' }
    ]
  },
  {
    id: 'forage',
    name: 'Forage',
    slug: forageLogo,
    accent: 'rgb(59, 130, 246)',
    description: 'Professional job simulations in Data Labelling and Technology.',
    certificates: [
      { title: 'Data Labelling Simulation', link: '/certific/Forage/Data labelling job simulation.pdf' },
      { title: 'Technology Job Simulation', link: '/certific/Forage/Technology Job Simulation.pdf' }
    ]
  },
  {
    id: 'udemy',
    name: 'Udemy',
    slug: udemyLogo,
    accent: 'rgb(164, 53, 240)',
    description: 'Comprehensive bootcamps in Python and Full-Stack development.',
    certificates: [
      { title: 'Complete Python Bootcamp', link: '/certific/Udemy/Python.pdf' }
    ]
  }
];

const Certificates = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="certificates" className="certificates-section">
      <div className="certificates-container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My <span className="highlight">Certificates</span>
        </motion.h2>

        <motion.div 
          className="certificates-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {COMPANY_CERTIFICATES.map((company) => (
            <motion.div
              key={company.id}
              className="cert-card company-card"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => setSelectedCompany(company)}
              style={{ '--cert-accent': company.accent }}
            >
              <div className="cert-card-inner">
                <div className="cert-header">
                  <div className="cert-logo-wrapper">
                    <img 
                      src={company.slug}
                      alt={company.name}
                      className="company-logo"
                      onError={(e) => {
                        e.target.src = 'https://api.iconify.design/ph:certificate-bold.svg';
                      }}
                    />
                  </div>
                </div>

                <div className="cert-body">
                  <h3 className="cert-title">{company.name}</h3>
                  <p className="cert-description">{company.description}</p>
                </div>

                <div className="cert-footer">
                  <span className="cert-count">
                    {company.certificates.length} {company.certificates.length === 1 ? 'Certificate' : 'Certificates'}
                  </span>
                  <div className="view-details">
                    Click to View <ExternalLink size={14} className="btn-arrow" />
                  </div>
                </div>
              </div>
              <div className="cert-glow" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedCompany && (
          <CertificateModal 
            company={selectedCompany} 
            onClose={() => setSelectedCompany(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
