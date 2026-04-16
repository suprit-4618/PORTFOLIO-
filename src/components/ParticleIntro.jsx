import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT = 5000;

const ParticleIntro = ({ onFinish }) => {
  const containerRef = useRef();
  const canvasRef = useRef();
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    let renderer, scene, camera, points;
    let clock = new THREE.Clock();
    let phase = 'assembling'; // assembling, blasting
    
    // -- 1. Setup Scene --
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // -- 2. Generate Target Positions (Text Sampling) --
    const getTargets = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 512;
        ctx.fillStyle = 'white';
        // Fallback to sans-serif if Syne isn't ready
        ctx.font = '800 140px Syne, sans-serif'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUPRIT L', 512, 256);

        const pixels = ctx.getImageData(0, 0, 1024, 512).data;
        const pts = [];
        for (let y = 0; y < 512; y += 4) {
            for (let x = 0; x < 1024; x += 4) {
                if (pixels[(y * 1024 + x) * 4] > 128) {
                    pts.push(new THREE.Vector3((x - 512) * 0.012, -(y - 256) * 0.012, 0));
                }
            }
        }
        // Fallback to sphere if sampling fails
        if (pts.length === 0) {
            for(let i=0; i<1000; i++) {
                const phi = Math.acos(-1 + (2 * i) / 1000);
                const theta = Math.sqrt(1000 * Math.PI) * phi;
                pts.push(new THREE.Vector3(Math.cos(theta)*Math.sin(phi)*6, Math.sin(theta)*Math.sin(phi)*6, Math.cos(phi)*6));
            }
        }
        return pts;
    };

    const targetPoints = getTargets();
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(PARTICLE_COUNT * 3);
    const initialPosArray = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        // Start random
        initialPosArray[i3] = (Math.random() - 0.5) * 30;
        initialPosArray[i3+1] = (Math.random() - 0.5) * 30;
        initialPosArray[i3+2] = (Math.random() - 0.5) * 30;
        
        posArray[i3] = initialPosArray[i3];
        posArray[i3+1] = initialPosArray[i3+1];
        posArray[i3+2] = initialPosArray[i3+2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // -- 3. Animation Loop --
    let frameId;
    const animate = () => {
        const time = clock.getElapsedTime();
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const target = targetPoints[i % targetPoints.length];

            if (phase === 'blasting') {
                positions[i3 + 2] += 0.8; // Fly toward camera
            } else {
                // Lerp to target
                positions[i3] += (target.x - positions[i3]) * 0.07 + Math.sin(time + i) * 0.01;
                positions[i3+1] += (target.y - positions[i3+1]) * 0.07 + Math.cos(time + i) * 0.01;
                positions[i3+2] += (target.z - positions[i3+2]) * 0.07;
            }
        }
        geometry.attributes.position.needsUpdate = true;
        points.rotation.y = Math.sin(time * 0.2) * 0.05;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
    };

    animate();

    // -- 4. Timings --
    const t1 = setTimeout(() => setShowTagline(true), 1500);
    const t2 = setTimeout(() => phase = 'blasting', 3500);
    const t3 = setTimeout(() => {
        cancelAnimationFrame(frameId);
        onFinish();
    }, 4500);

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        cancelAnimationFrame(frameId);
        renderer.dispose();
    };
  }, [onFinish]);

  return (
    <div ref={containerRef} style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 10000, 
        background: '#000',
        cursor: 'none'
    }}>
      <canvas ref={canvasRef} />
      
      <AnimatePresence>
        {showTagline && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '65%',
                width: '100%',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <p style={{
                fontFamily: 'Space Mono',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.8em',
                textTransform: 'uppercase'
              }}>
                AI & DATA SCIENCE ENGINEER
              </p>
            </motion.div>
        )}
      </AnimatePresence>

      <div style={{
          position: 'absolute',
          inset: 0,
          background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
          opacity: 0.12,
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
      }} />
    </div>
  );
};

export default ParticleIntro;
