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
        this.x = x;
        this.y = y;
        this.homeX = x;
        this.homeY = y;
        this.size = 1.6;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.94; // slightly more fluid
        this.spring = 0.05;
        this.color = 'rgba(255, 255, 255, 0.7)';
        this.interactionFactor = 0;
      }

      draw() {
        // Dynamic color transition based on interaction
        const cyan = [0, 242, 255]; // #00f2ff
        const white = [255, 255, 255];
        
        const r = Math.round(white[0] + (cyan[0] - white[0]) * this.interactionFactor);
        const g = Math.round(white[1] + (cyan[1] - white[1]) * this.interactionFactor);
        const b = Math.round(white[2] + (cyan[2] - white[2]) * this.interactionFactor);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + this.interactionFactor * 0.6})`;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
      }

      update() {
        const dx = this.homeX - this.x;
        const dy = this.homeY - this.y;
        this.vx += dx * this.spring;
        this.vy += dy * this.spring;

        if (mouse.active) {
          const mdx = mouse.x - this.x;
          const mdy = mouse.y - this.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          const maxDist = 35; // increased interaction range
          
          if (dist < maxDist) {
            const force = Math.pow((maxDist - dist) / maxDist, 2);
            this.vx -= mdx * force * 0.2;
            this.vy -= mdy * force * 0.2;
            this.interactionFactor = Math.min(1, this.interactionFactor + 0.1);
          } else {
            this.interactionFactor = Math.max(0, this.interactionFactor - 0.02);
          }
        } else {
          this.interactionFactor = Math.max(0, this.interactionFactor - 0.02);
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

      // Sample pixels with higher density (step 3)
      for (let y = 0; y < canvas.height; y += 3) {
        for (let x = 0; x < canvas.width; x += 3) {
          if (data[(y * canvas.width + x) * 4 + 3] > 128) {
            particles.push(new Particle(x, y));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Plexus Effect: Draw lines between nearby interacting particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Only draw lines if particle is somewhat active to save performance
        if (p1.interactionFactor > 0.1) {
          for (let j = i + 1; j < particles.length; j += 4) { // Sample neighbors for performance
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = dx * dx + dy * dy;

            if (dist < 400) { // 20px distance
              ctx.strokeStyle = `rgba(0, 242, 255, ${p1.interactionFactor * 0.2})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
      
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
