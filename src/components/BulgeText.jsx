import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BulgeText = ({ text = "SUPRIT L" }) => {
  const containerRef = useRef();
  const canvasRef = useRef();
  const requestRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const observerRef = useRef();
  const isVisible = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Intersection Observer for Performance ---
    observerRef.current = new IntersectionObserver((entries) => {
      isVisible.current = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observerRef.current.observe(containerRef.current);

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = 200;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Texture Setup ---
    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d');
    textCanvas.width = 1200;
    textCanvas.height = 300;
    
    ctx.font = '800 150px Inter, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.15em';
    ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

    const texture = new THREE.CanvasTexture(textCanvas);
    
    // --- Material & Geometry ---
    const geometry = new THREE.PlaneGeometry(8, 2, 64, 64);
    
    const vertexShader = `
      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform float uRadius;
      uniform float uStrength;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        float dist = distance(uv, uMouse);
        
        if (dist < uRadius) {
          float power = 1.0 - (dist / uRadius);
          float bulge = smoothstep(0.0, 1.0, power);
          pos.z += bulge * uStrength;
        }
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
        vec4 color = texture2D(uTexture, vUv);
        if (color.a < 0.1) discard;
        gl_FragColor = color;
      }
    `;

    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.35 },
      uStrength: { value: 0.4 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Interaction ---
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // UV space
      mouseRef.current.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- Animation ---
    const animate = () => {
        if (isVisible.current) {
            // Smoothly follow mouse in UV space
            uniforms.uMouse.value.lerp(mouseRef.current, 0.1);
            renderer.render(scene, camera);
        }
        requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // --- Dynamic Scaling ---
    const handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = 200;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        
        const fovRad = (45 * Math.PI) / 180;
        const visibleHeightAtDistanceOne = 2 * Math.tan(fovRad / 2);
        const visibleWidthAtDistanceOne = visibleHeightAtDistanceOne * (w / h);
        const targetWidth = 9; 
        camera.position.z = Math.max(5, targetWidth / visibleWidthAtDistanceOne);
        
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
        cancelAnimationFrame(requestRef.current);
        if (observerRef.current) observerRef.current.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [text]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BulgeText;
