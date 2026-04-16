import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, ArrowUpRight, Award } from 'lucide-react';
import './Publications.css';

const PUBLICATIONS_DATA = [
  {
    id: 1,
    category: 'Journal Article',
    title: 'AGRIVERSEAI – SMART AGRICULTURAL WEB APPLICATION FOR KARNATAKA PEOPLE',
    authors: 'Prof. Sagar Birje, Mr. Kiran B Nandani, Mr. Suprit K.L., et al.',
    date: 'May-2025',
    journal: 'IRJMETS Journal (Vol:07/Issue:05)',
    description: 'A voice-activated, bilingual smart agriculture assistant for Kannada-speaking farmers. DOI: 10.56726/IRJMETS78194. Integrates NLP and speech technology for crop advisory and disease diagnosis.',
    tags: ['NLP', 'Smart Agriculture', 'Voice Assistant', 'Kannada'],
    link: '/publications/agriverseAi.pdf'
  }
];

const Publications = () => {
  return (
    <section id="publications" className="publications-section">
      <div className="publications-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 className="section-title">
            Research & <span className="highlight">Publications</span>
          </motion.h2>
          <p className="section-subtitle">Academic papers and technical documentation</p>
        </motion.div>

        <div className="publications-grid">
          {PUBLICATIONS_DATA.map((pub, index) => (
            <motion.div 
              key={pub.id}
              className="pub-card glass-panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <div className="pub-badge">
                <BookOpen size={14} /> {pub.category}
              </div>
              
              <div className="pub-content">
                <div className="pub-meta">
                  <span className="pub-date">{pub.date}</span>
                  <span className="pub-journal"><Award size={12} /> {pub.journal}</span>
                </div>
                
                <h3 className="pub-title">{pub.title}</h3>
                <p className="pub-authors">By {pub.authors}</p>
                <p className="pub-desc">{pub.description}</p>
                
                <div className="pub-tags">
                  {pub.tags.map(tag => (
                    <span key={tag} className="pub-tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="pub-footer">
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="pub-link">
                  Read Paper <ArrowUpRight size={16} />
                </a>
                <FileText className="pub-icon" size={24} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
