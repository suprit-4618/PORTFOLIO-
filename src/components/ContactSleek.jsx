import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle, ArrowUpRight, Copy, Check, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './ContactSleek.css';

export const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);
  const [formData, setFormData] = useState({ user_name: '', user_email: '', subject: '', message: '' });

  const emailAddress = "supritkl49@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getMailtoLink = () => {
    const subj = encodeURIComponent(formData.subject || `Portfolio Contact from ${formData.user_name || 'Visitor'}`);
    const body = encodeURIComponent(`From: ${formData.user_name} (${formData.user_email})\n\nMessage:\n${formData.message}`);
    return `mailto:${emailAddress}?subject=${subj}&body=${body}`;
  };

  const copyFullDraft = () => {
    const draft = `To: ${emailAddress}\nSubject: ${formData.subject || 'Portfolio Contact'}\nFrom: ${formData.user_name} (${formData.user_email})\n\n${formData.message}`;
    navigator.clipboard.writeText(draft);
    setMsgCopied(true);
    setTimeout(() => setMsgCopied(false), 3000);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const form = formRef.current;
    if (form) {
      if (form.from_name) form.from_name.value = formData.user_name;
      if (form.from_email) form.from_email.value = formData.user_email;
      if (form.reply_to) form.reply_to.value = formData.user_email;
    }

    const SERVICE_ID = "service_815bmsr";
    const TEMPLATE_ID = "template_hk89a6b";
    const PUBLIC_KEY = "yZCur9XrdhmW13u1o";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((response) => {
        console.log('EmailJS delivery success:', response.status, response.text);
        setStatus('success');
        setFormData({ user_name: '', user_email: '', subject: '', message: '' });
        if (formRef.current) formRef.current.reset();
        setTimeout(() => setStatus(null), 6000);
      }, (error) => {
        console.error('EmailJS delivery error:', error);
        const detailedErr = error?.text || error?.message || 'Email service connection failed';
        setErrorMessage(detailedErr);
        setStatus('error');
      });
  };

  return (
    <section id="contact" className="startup-contact-section" aria-label="Contact">
      <div className="startup-contact-container">

        {/* Section Header */}
        <div className="startup-section-header">
          <h2 className="startup-section-title">
            Contact
          </h2>
        </div>

        {/* Contact Layout Grid */}
        <div className="startup-contact-grid">

          {/* Left Column: Direct Info & Social Channels */}
          <motion.div
            className="contact-info-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="contact-card-headline">Get in Touch</h3>

            {/* Direct Email Box */}
            <div className="contact-email-box">
              <div className="email-meta-block">
                <span className="email-label-tag">Email</span>
                <a href={`mailto:${emailAddress}`} className="email-link-text">
                  {emailAddress}
                </a>
              </div>

              <button
                onClick={copyEmail}
                className="email-copy-btn"
                aria-label="Copy email address"
                title="Copy to clipboard"
              >
                {copied ? <Check size={15} className="copy-success-icon" /> : <Copy size={15} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Location */}
            <div className="contact-meta-row">
              <div className="meta-item-box">
                <MapPin size={15} className="meta-item-icon" />
                <span>Karnataka, India (UTC +05:30)</span>
              </div>
            </div>

            {/* Social Network Links */}
            <div className="contact-social-grid">
              <a
                href="https://github.com/suprit-4618"
                target="_blank"
                rel="noopener noreferrer"
                className="startup-social-pill"
              >
                <Github size={15} />
                <span>GitHub</span>
                <ArrowUpRight size={13} />
              </a>

              <a
                href="https://www.linkedin.com/in/suprit-k-l"
                target="_blank"
                rel="noopener noreferrer"
                className="startup-social-pill"
              >
                <Linkedin size={15} />
                <span>LinkedIn</span>
                <ArrowUpRight size={13} />
              </a>

              <a
                href={`mailto:${emailAddress}`}
                className="startup-social-pill"
              >
                <Mail size={15} />
                <span>Email</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Message Terminal */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <form ref={formRef} onSubmit={sendEmail} className="startup-contact-form">
              {/* Hidden EmailJS standard aliases for full template compatibility */}
              <input type="hidden" name="from_name" />
              <input type="hidden" name="from_email" />
              <input type="hidden" name="reply_to" />
              <input type="hidden" name="to_name" value="Suprit" />

              <div className="form-input-row">
                <div className="form-group">
                  <label htmlFor="user_name" className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                    className="startup-input-field"
                    placeholder="e.g. Alphonso"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="user_email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    required
                    className="startup-input-field"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="startup-input-field"
                  placeholder="Inquiry / Collaboration"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="startup-input-field startup-textarea"
                  placeholder="Share details about your project or inquiry..."
                />
              </div>

              {/* Status Feedbacks */}
              {status === 'success' && (
                <div className="form-status-alert success">
                  <CheckCircle2 size={16} />
                  <span>Message delivered successfully. I will get back to you shortly.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="form-status-alert error" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={17} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600 }}>Email service returned an error ({errorMessage || 'Gmail token expired'}).</span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.84rem', opacity: 0.9, lineHeight: 1.45 }}>
                    Your message is saved below! You can send it directly to <b>{emailAddress}</b> in one click:
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', marginTop: '4px' }}>
                    <a
                      href={getMailtoLink()}
                      className="email-fallback-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#dc2626',
                        color: '#fff',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Mail size={14} />
                      <span>Open in Mail App (Pre-filled)</span>
                    </a>

                    <button
                      type="button"
                      onClick={copyFullDraft}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1f2937',
                        border: '1px solid #d1d5db',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {msgCopied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{msgCopied ? 'Message Copied!' : 'Copy Form Draft'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="startup-submit-btn"
              >
                <Send size={15} />
                <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              </button>

            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
