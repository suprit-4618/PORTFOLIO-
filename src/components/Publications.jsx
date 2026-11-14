import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, ArrowUpRight, Award, ExternalLink } from 'lucide-react';
import './Publications.css';

const PUBLICATIONS_DATA = [
  {
    id: 1,
    category: 'Peer-Reviewed Journal Publication',
    title: 'AGRIVERSEAI – Smart Agricultural Web Application for Karnataka Regional Communities',
    authors: 'Prof. Sagar Birje, Mr. Kiran B Nandani, Mr. Suprit K.L., et al.',
    date: 'May 2025',
    journal: 'IRJMETS Journal (Vol: 07 / Issue: 05)',
    doi: '10.56726/IRJMETS78194',
    description: 'A voice-activated, bilingual smart agriculture assistant integrating computer vision for automated crop disease classification and natural language speech synthesis for regional farmers in Karnataka.',
    tags: ['Applied Machine Learning', 'Computer Vision', 'Speech NLP', 'Smart Agriculture', 'MobileNetV2'],
    link: '/publications/agriverseAi.pdf'
  }
];

export const Publications = () => {
  return (
    <section id="publications" className="startup-publications-section" aria-label="Scientific Research & Publications">
      {/* ASCII Floral Artwork Background */}
      <div className="pub-ascii-bg-wrapper" aria-hidden="true">
        <img
          src="/research-ascii-bg.jpg"
          alt=""
          className="pub-ascii-bg-img"
          loading="lazy"
        />
        <div className="pub-ascii-bg-overlay" />
      </div>

      <div className="startup-publications-container">
        
        {/* Section Header */}
        <div className="startup-section-header">
          <h2 className="startup-section-title">
            Published <span className="title-highlight">Research</span>
          </h2>
        </div>

        {/* Publications Grid */}
        <div className="startup-publications-grid">
          {PUBLICATIONS_DATA.map((pub, index) => (
            <motion.div
              key={pub.id}
              className="startup-pub-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pub-card-top-row">
                <div className="pub-badge-group">
                  <span className="pub-type-badge">
                    <BookOpen size={13} />
                    <span>{pub.category}</span>
                  </span>
                  <span className="pub-journal-badge">
                    <Award size={13} />
                    <span>{pub.journal}</span>
                  </span>
                </div>
                <span className="pub-date-chip">{pub.date}</span>
              </div>

              <div className="pub-content-block">
                <h3 className="pub-main-title">{pub.title}</h3>
                <p className="pub-authors-line">
                  <strong className="authors-label">Authors:</strong> {pub.authors}
                </p>
                <p className="pub-abstract-text">{pub.description}</p>
                
                {pub.doi && (
                  <div className="pub-doi-badge">
                    <span className="doi-tag">DOI:</span>
                    <span className="doi-value">{pub.doi}</span>
                  </div>
                )}
              </div>

              <div className="pub-footer-row">
                <div className="pub-tags-row">
                  {pub.tags.map((tag) => (
                    <span key={tag} className="startup-tech-chip">{tag}</span>
                  ))}
                </div>

                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-read-btn"
                  title="Open full paper PDF in new tab"
                >
                  <FileText size={14} />
                  <span>Read Paper PDF</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Publications;
