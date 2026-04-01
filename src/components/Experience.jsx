import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Circle } from 'lucide-react';
import './Experience.css';

const EXPERIENCE_DATA = [
  {
    id: 1,
    type: 'internship',
    role: 'Full Stack Web Development Intern',
    company: 'TAP Academy',
    location: 'Bengaluru, India',
    date: '02/2026 - Present',
    status: 'Ongoing',
    description: 'Currently undergoing structured training in full stack development. Developing web applications focusing on application flow, API integration, and database connectivity while gaining hands-on experience with Git and maintainable code.',
    skills: ['Java', 'JavaScript', 'React', 'SQL']
  },
  {
    id: 2,
    type: 'innovation',
    role: 'Student Innovator',
    company: 'K-tech (NAIN)',
    location: 'Belagavi, India',
    date: '04/2025 - Present',
    status: 'Ongoing',
    description: 'Selected as part of the institutional innovation team for the development of a smart reverse vending system. Gaining exposure to embedded hardware, sensors, actuators, and controller-based reward dispensing workflows.',
    skills: ['Embedded Systems', 'Hardware-Software Interaction', 'Sensors']
  }
];

const Experience = () => {
  const containerRef = React.useRef(null);
  
  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Snappier spring for a "liquid" feel without the lag
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001
  });

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My <span className="highlight">Journey</span>
        </motion.h2>

        <div className="timeline-wrapper" ref={containerRef}>
          <div className="timeline-line">
            <motion.div
              className="line-progress"
              style={{ 
                scaleY,
                originY: 0,
                height: '100%' 
              }}
            />
          </div>

          <div className="experience-list">
            {EXPERIENCE_DATA.map((item, index) => (
              <motion.div
                key={item.id}
                className={`experience-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.8 }}
                viewport={{ once: false, amount: 0.1, margin: "-10%" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 120, 
                  damping: 18,
                  delay: 0 // Removed delay for instant feedback
                }}
              >
                <div className="experience-dot">
                  <Circle size={12} fill="currentColor" />
                </div>

                <div className="experience-card glass-panel">
                  <div className="card-header">
                    <div className="type-icon">
                      {item.type === 'internship' ? <Briefcase size={20} /> : <GraduationCap size={22} />}
                    </div>
                    <div className="header-text">
                      <span className="date-tag">
                        <Calendar size={12} /> {item.date}
                        {item.status && <span className="status-badge">{item.status}</span>}
                      </span>
                      <h3 className="role-title">{item.role}</h3>
                      <h4 className="company-name">{item.company}</h4>
                    </div>
                  </div>

                  <p className="experience-desc">{item.description}</p>

                  <div className="experience-skills">
                    {item.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
