import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp, Heart, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer className="big-footer">
            <div className="footer-glow"></div>

            <motion.div
                className="footer-container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* --- Main Grid --- */}
                <div className="footer-main-grid">

                    {/* Column 1: Identity */}
                    <div className="footer-col brand-col">
                        <motion.h2 variants={itemVariants} className="footer-logo">
                            SUPRIT <span className="highlight">L</span>
                        </motion.h2>
                        <motion.p variants={itemVariants} className="footer-tagline">
                            Building things that are not yet there.
                        </motion.p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="footer-col links-col">
                        <motion.h4 variants={itemVariants}>Sitemap</motion.h4>
                        <ul className="footer-links">
                            <motion.li variants={itemVariants}><a href="#about">About</a></motion.li>
                            <motion.li variants={itemVariants}><a href="#experience">Journey</a></motion.li>
                            <motion.li variants={itemVariants}><a href="#projects">Projects</a></motion.li>
                            <motion.li variants={itemVariants}><a href="#publications">Publications</a></motion.li>
                            <motion.li variants={itemVariants}><a href="#contact">Contact</a></motion.li>
                        </ul>
                    </div>

                    {/* Column 3: Socials */}
                    <div className="footer-col social-col">
                        <motion.h4 variants={itemVariants}>Connect</motion.h4>
                        <div className="footer-social-icons">
                            <motion.a
                                variants={itemVariants}
                                whileHover={{ y: -5, color: '#fff' }}
                                href="https://github.com/suprit-4618"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github size={20} />
                            </motion.a>
                            <motion.a
                                variants={itemVariants}
                                whileHover={{ y: -5, color: '#fff' }}
                                href="https://www.linkedin.com/in/suprit-k-l"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin size={20} />
                            </motion.a>
                            <motion.a
                                variants={itemVariants}
                                whileHover={{ y: -5, color: '#fff' }}
                                href="mailto:supritkl49@gmail.com"
                            >
                                <Mail size={20} />
                            </motion.a>
                        </div>
                        <motion.p variants={itemVariants} className="footer-email">
                            supritkl49@gmail.com
                        </motion.p>
                    </div>

                </div>

                {/* --- Bottom Bar --- */}
                <div className="footer-bottom-bar">
                    <p className="copyright">
                        © {currentYear} SUPRIT L. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
