import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, GraduationCap, Heart, Tv, Coffee } from 'lucide-react';
import './About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="about" className="about-section">
      <motion.div 
        className="about-container glass-panel"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={itemVariants} className="section-title">
          About <span className="highlight">Me</span>
        </motion.h2>

        <div className="about-content">
          <motion.div variants={itemVariants} className="about-text">
            <h3 className="greeting">Hello! I'm SUPRIT L.</h3>
            <p>
              I am a passionate AI & Data Science Engineer dedicated to building intelligent systems and engaging digital experiences. I thrive on solving complex problems and turning data into actionable insights.
            </p>
            <p>
              When I'm not writing code or training models, you'll find me exploring my diverse range of interests and constantly learning new things.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="quick-facts">
            <div className="fact-item">
              <MapPin className="fact-icon" />
              <div>
                <h4>Location</h4>
                <p>[Your City, Country]</p>
              </div>
            </div>
            <div className="fact-item">
              <Calendar className="fact-icon" />
              <div>
                <h4>Age</h4>
                <p>[Your Age]</p>
              </div>
            </div>
            <div className="fact-item">
              <GraduationCap className="fact-icon" />
              <div>
                <h4>Education</h4>
                <p>[Your Degree / University]</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="interests-section">
          <h3>What I Love</h3>
          
          <div className="interest-groups">
            <div className="interest-card">
              <div className="card-header">
                <Coffee className="card-icon" />
                <h4>Free Time</h4>
              </div>
              <ul className="tags">
                <li className="tag">[Hobby 1]</li>
                <li className="tag">[Hobby 2]</li>
                <li className="tag">[Hobby 3]</li>
              </ul>
            </div>

            <div className="interest-card">
              <div className="card-header">
                <Heart className="card-icon" />
                <h4>Interests</h4>
              </div>
              <ul className="tags">
                <li className="tag">Artificial Intelligence</li>
                <li className="tag">Data Visualization</li>
                <li className="tag">[Interest 3]</li>
              </ul>
            </div>

            <div className="interest-card">
              <div className="card-header">
                <Tv className="card-icon" />
                <h4>Favorite Series</h4>
              </div>
              <ul className="tags">
                <li className="tag">[Series 1]</li>
                <li className="tag">[Series 2]</li>
                <li className="tag">[Series 3]</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
