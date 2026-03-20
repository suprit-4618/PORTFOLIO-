import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Sparkles, Code, Rocket, Gamepad2 } from 'lucide-react';
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

  const interests = [
    {
      title: "Personal",
      icon: <Sparkles className="card-icon" />,
      tags: ["Movies/Series: Science Fiction", "Music: Eclectic Listener", "Travel: Globetrotter"]
    },
    {
      title: "R&D",
      icon: <Rocket className="card-icon" />,
      tags: ["Space Exploration", "Defense Technology"]
    },
    {
      title: "Tech Stack",
      icon: <Code className="card-icon" />,
      tags: ["AI & Data Science", "DevOps", "Full Stack"]
    }
  ];

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
            <h3 className="greeting">Hello! </h3>
            <p>
              I’m an AI & Data Science Engineer with a deep fascination for space exploration and defense systems. My work focuses on building intelligent solutions and contributing to open-source projects that push the boundaries of technology.
            </p>
            <p>
              When I'm not coding, you'll find me exploring virtual worlds as an avid gamer or experimenting with different ways of building solutions to real-world problems.
            </p>

          </motion.div>

          <motion.div variants={itemVariants} className="quick-facts">
            <div className="fact-item">
              <MapPin className="fact-icon" />
              <div>
                <h4>Location</h4>
                <p>Karnataka, India</p>
              </div>
            </div>
            <div className="fact-item">
              <GraduationCap className="fact-icon" />
              <div>
                <h4>Education</h4>
                <p>B.Tech in AI & Data Science</p>
              </div>
            </div>
            <div className="fact-item">
              <Gamepad2 className="fact-icon" />
              <div>
                <h4>Gaming</h4>
                <p>Nocturnal</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="interests-section" variants={itemVariants}>
          <h3>Areas of <span className="highlight">Interest</span></h3>
          <div className="interest-groups">
            {interests.map((group, index) => (
              <motion.div
                key={index}
                className="interest-card"
                whileHover={{ y: -10 }}
              >
                <div className="card-header">
                  {group.icon}
                  <h4>{group.title}</h4>
                </div>
                <ul className="tags">
                  {group.tags.map((tag, i) => (
                    <li key={i} className="tag">{tag}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
