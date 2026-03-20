import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ParticleText from './ParticleText';
import './ContactSleek.css';

const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('sending');

    const SERVICE_ID = "service_815bmsr";
    const TEMPLATE_ID = "template_hk89a6b";
    const PUBLIC_KEY = "yZCur9XrdhmW13u1o";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        formRef.current.reset();
        setTimeout(() => setStatus(null), 5000);
      }, () => {
        setStatus('error');
        setTimeout(() => setStatus(null), 5000);
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  // --- Mouse Tracking for Interactive Glow ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <section id="contact" className="contact-sleek-section">
      <div className="sleek-halo"></div>

      <motion.div
        className="sleek-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <header className="sleek-header">
          <motion.div variants={itemVariants} className="sleek-badge"></motion.div>
          <motion.div variants={itemVariants}>
            <ParticleText text="Let's Connect" />
          </motion.div>
          <motion.p variants={itemVariants} className="sleek-subtitle">
            Have a project in mind or just want to say hi? I'm always open to new opportunities.
          </motion.p>
        </header>

        <motion.div variants={itemVariants} className="sleek-form-wrapper">
          <motion.form
            ref={formRef}
            onSubmit={sendEmail}
            className="sleek-form sleek-glass-border"
            onMouseMove={handleMouseMove}
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 200, damping: 20 } }}
          >
            {/* Interactive Spotlight Glow */}
            <motion.div
              className="sleek-spotlight"
              style={{
                left: smoothX,
                top: smoothY
              }}
            />

            <div className="sleek-gloss"></div>

            <div className="sleek-form-grid">
              <motion.div className="sleek-input-group" variants={itemVariants}>
                <label>Name</label>
                <input type="text" name="from_name" placeholder="Your full name" required />
              </motion.div>
              <motion.div className="sleek-input-group" variants={itemVariants}>
                <label>Email</label>
                <input type="email" name="user_email" placeholder="email@example.com" required />
              </motion.div>
            </div>

            <motion.div className="sleek-input-group" variants={itemVariants}>
              <label>Message</label>
              <textarea name="message" rows="5" placeholder="What's on your mind?" required></textarea>
            </motion.div>

            <motion.button
              className={`sleek-submit ${status === 'sending' ? 'sending' : ''}`}
              disabled={status === 'sending'}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              <Send size={18} />
            </motion.button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sleek-status success">
                  <CheckCircle size={16} /> Message sent successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>

        <motion.div className="sleek-socials" variants={containerVariants}>
          <motion.a variants={itemVariants} whileHover={{ y: -5, borderColor: '#fff' }} href="https://github.com/suprit-4618" target="_blank" rel="noreferrer" className="sleek-social-link"><Github size={20} /></motion.a>
          <motion.a variants={itemVariants} whileHover={{ y: -5, borderColor: '#fff' }} href="https://www.linkedin.com/in/suprit-k-l" target="_blank" rel="noreferrer" className="sleek-social-link"><Linkedin size={20} /></motion.a>
          <motion.a variants={itemVariants} whileHover={{ y: -5, borderColor: '#fff' }} href="mailto:supritkl49@gmail.com" className="sleek-social-link"><Mail size={20} /></motion.a>
        </motion.div>
      </motion.div>

      <footer className="sleek-footer">
        <p>© 2026 SUPRIT L. Built with passion.</p>
      </footer>
    </section>
  );
};

export default Contact;
