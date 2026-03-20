import React, { useRef, useEffect } from 'react';

const ParticleText = ({ text = "Let's Connect" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let particles = [];
    let mouse = { x: 0, y: 0, active: false };
    let animationFrameId;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.offsetWidth;
      canvas.height = 300; // Fixed height for the title area
      initParticles();
    };

    class Particle {
      constructor(x, y) {
        this.x = x; // START AT HOME
        this.y = y; // START AT HOME
        this.homeX = x;
        this.homeY = y;
        this.size = 1.6;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.96;
        this.spring = 0.04;
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // Return to home
        const dx = this.homeX - this.x;
        const dy = this.homeY - this.y;
        this.vx += dx * this.spring;
        this.vy += dy * this.spring;

        // Mouse interaction
        if (mouse.active) {
          const mdx = mouse.x - this.x;
          const mdy = mouse.y - this.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          const maxDist = 20; // REDUCED FROM 25
          if (dist < maxDist) {
            // Cubic falloff for ultra-smooth "feathering"
            const force = Math.pow((maxDist - dist) / maxDist, 3);
            this.vx -= mdx * force * 0.12; // ULTRA GENTLE
            this.vy -= mdy * force * 0.12;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;
      }
    }

    const initParticles = () => {
      const fontSize = Math.min(canvas.width / 8, 90);
      ctx.fillStyle = 'white';
      ctx.font = `bold ${fontSize}px Inter, sans-serif`; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = [];

      // Sample pixels
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          if (data[(y * canvas.width + x) * 4 + 3] > 128) {
            particles.push(new Particle(x, y));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <div ref={containerRef} className="particle-text-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticleText;
