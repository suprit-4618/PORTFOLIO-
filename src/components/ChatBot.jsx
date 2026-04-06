import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { CHATBOT_CONFIG, getResponse } from '../lib/chatbotData';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: CHATBOT_CONFIG.greeting, sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessage(false);
    }
  }, [messages, isOpen]);

  const windowRef = useRef(null);
  
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;

    const stopPropagation = (e) => e.stopPropagation();

    // Native event listener ensures it runs before/alongside Lenis and stops propagation perfectly
    el.addEventListener('wheel', stopPropagation, { passive: false });
    el.addEventListener('touchmove', stopPropagation, { passive: false });

    return () => {
      el.removeEventListener('wheel', stopPropagation);
      el.removeEventListener('touchmove', stopPropagation);
    };
  }, [isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = getResponse(text);
      const botMessage = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend(inputText);
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={windowRef}
            initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="chat-window"
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="bot-avatar">
                   <Bot size={20} strokeWidth={2.5} />
                </div>
                <span className="bot-name">{CHATBOT_CONFIG.name}</span>
              </div>
              <div className="chat-header-actions">
                <button onClick={() => setIsOpen(false)} title="Close Chat">
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="chat-messages"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="quick-questions">
                {CHATBOT_CONFIG.quickQuestions.map((q, i) => (
                  <button 
                    key={i} 
                    className="quick-btn"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chat-input-wrapper">
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                className="send-btn"
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {hasNewMessage && !isOpen && <div className="nudge-badge" />}
      </motion.button>
    </div>
  );
};

export default ChatBot;
