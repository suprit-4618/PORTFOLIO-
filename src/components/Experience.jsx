import React from 'react';
import { Briefcase, Lightbulb, GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import StackingCards, { StackingCardItem } from './ui/stacking-cards';
import './Experience.css';

const EXPERIENCES = [
  {
    id: 1,
    indexNumber: '01',
    role: 'Full Stack Web Development Intern',
    organization: 'TAP Academy',
    location: 'Bengaluru, India',
    period: '02/2026 — 06/2026',
    status: 'Completed Internship',
    // TAP Academy — Peach Card
    cardBg: '#F6D6C9',
    accent: '#B96846',
    headingColor: '#49352A',
    panelBg: '#FFF7F0',
    tagBg: '#F9E9DE',
    border: '#E5C7B5',
    textBody: '#6F5849',
    textMeta: '#6F5849',
    divider: '#E5C7B5',
    icon: <Briefcase size={20} />,
    description: 'Underwent rigorous development training and engineered modular full-stack web applications. Implemented React component trees, integrated RESTful backend APIs, and optimized SQL relational queries for clean data management.',
    highlights: [
      'Engineered responsive React web interfaces with state management',
      'Implemented RESTful microservice endpoints with Java and SQL backends',
      'Conducted database query optimization and Git collaborative workflows'
    ],
    skills: ['Java', 'JavaScript', 'React', 'SQL', 'REST APIs', 'Git']
  },
  {
    id: 2,
    indexNumber: '02',
    role: 'Student Innovator',
    organization: 'K-tech (NAIN)',
    location: 'Belagavi, India',
    period: '04/2025 — Present',
    status: 'Active Innovation Cohort',
    // K-tech (NAIN) — Apricot Card
    cardBg: '#EFC3A5',
    accent: '#B96846',
    headingColor: '#49352A',
    panelBg: '#FFF7F0',
    tagBg: '#F9E9DE',
    border: '#E5C7B5',
    textBody: '#6F5849',
    textMeta: '#6F5849',
    divider: '#E5C7B5',
    icon: <Lightbulb size={20} />,
    description: 'Selected as part of the institutional technology innovation cohort developing a smart reverse vending ecosystem. Architected embedded controller logic, sensor-actuator hardware communication protocols, and automated reward calculation pipelines.',
    highlights: [
      'Architected embedded IoT logic and serial sensor communication',
      'Engineered automated incentive computation pipelines for reverse vending',
      'Collaborated with incubation mentors on patentable product roadmaps'
    ],
    skills: ['Embedded Systems', 'IoT Architecture', 'Sensor Protocols', 'Hardware Integration']
  },
  {
    id: 3,
    indexNumber: '03',
    role: 'Bachelor of Engineering in AI & Data Science',
    organization: 'Visvesvaraya Technological University',
    location: 'Karnataka, India',
    period: '2022 — 2026',
    status: 'Candidate (Final Year)',
    // Visvesvaraya Technological University — Muted Tan Card
    cardBg: '#D8BFA8',
    accent: '#B96846',
    headingColor: '#49352A',
    panelBg: '#FFF7F0',
    tagBg: '#F9E9DE',
    border: '#E5C7B5',
    textBody: '#6F5849',
    textMeta: '#6F5849',
    divider: '#E5C7B5',
    icon: <GraduationCap size={20} />,
    description: 'Comprehensive curriculum focusing on Machine Learning, Natural Language Processing, Deep Learning, Distributed Data Systems, and Statistical Modeling. Authored peer-reviewed research papers and built open-source technical systems.',
    highlights: [
      'Specialization in Neural Networks, NLP, and Distributed Big Data Systems',
      'Lead author on published agricultural AI research paper in IRJMETS Journal',
      'Developed multiple production-grade end-to-end applied AI systems'
    ],
    skills: ['Machine Learning', 'Data Science', 'Algorithms', 'Deep Learning', 'PySpark']
  }
];

export const Experience = () => {
  return (
    <section id="experience" className="startup-experience-section" aria-label="Professional Experience & Timeline">
      <div className="startup-experience-container">
        
        {/* Section Header */}
        <div className="startup-section-header">
          <h2 className="startup-section-title">
            Experiences
          </h2>
        </div>

        {/* 21st.dev Scroll-Driven Stacking Cards Showcase */}
        <StackingCards
          totalCards={EXPERIENCES.length}
          scaleMultiplier={0.03}
          className="experience-stacking-stream"
        >
          {EXPERIENCES.map((item, index) => (
            <StackingCardItem
              key={item.id}
              index={index}
              topPosition={`calc(84px + ${index * 26}px)`}
              className="experience-card-item-wrapper"
            >
              <article 
                className="experience-stack-card"
                style={{
                  '--card-bg': item.cardBg,
                  '--card-accent': item.accent,
                  '--card-heading': item.headingColor,
                  '--card-panel-bg': item.panelBg,
                  '--card-tag-bg': item.tagBg,
                  '--card-border': item.border,
                  '--card-text-body': item.textBody,
                  '--card-text-meta': item.textMeta,
                  '--card-divider': item.divider,
                }}
              >
                {/* Top decorative accent line */}
                <div className="card-accent-top-line" />

                <div className="card-inner-grid">
                  {/* Left Column: Organization & Metadata */}
                  <div className="card-left-column">
                    <div className="card-org-row">
                      <div className="card-org-icon-frame" aria-hidden="true">
                        {item.icon}
                      </div>
                      <div className="card-org-text-group">
                        <h4 className="card-org-title">{item.organization}</h4>
                      </div>
                    </div>

                    <div className="card-meta-list">
                      <div className="card-meta-item">
                        <Calendar size={14} className="meta-icon" />
                        <span>{item.period}</span>
                      </div>
                      <div className="card-meta-item">
                        <MapPin size={14} className="meta-icon" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Role & Key Contributions */}
                  <div className="card-right-column">
                    <div className="card-role-header">
                      <h3 className="card-role-headline">{item.role}</h3>
                    </div>

                    <p className="card-description-narrative">
                      {item.description}
                    </p>

                    {/* Achievements List */}
                    <div className="card-highlights-container">
                      <span className="highlights-caption">KEY CONTRIBUTIONS & FOCUS</span>
                      <div className="highlights-items-group">
                        {item.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="highlight-entry">
                            <CheckCircle2 size={16} className="highlight-check-icon" />
                            <span className="highlight-entry-text">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech & Competency Chips */}
                    <div className="card-technologies-row" aria-label="Applied Technologies">
                      {item.skills.map((skill) => (
                        <span key={skill} className="card-tech-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </StackingCardItem>
          ))}
        </StackingCards>

      </div>
    </section>
  );
};

export default Experience;
