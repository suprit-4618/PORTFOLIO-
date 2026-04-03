import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

const LiquidBackground = () => {
    const containerRef = useRef();
    const canvasRef = useRef();
    const requestRef = useRef();
    const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
    const observerRef = useRef();
    const isVisible = useRef(true);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Intersection Observer for Performance ---
        observerRef.current = new IntersectionObserver((entries) => {
            isVisible.current = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        observerRef.current.observe(containerRef.current);

        const scene = new THREE.Scene();
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current,
            antialias: true 
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.PlaneGeometry(2, 2);
        
        const fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uMouse;
            varying vec2 vUv;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            float smoothNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = noise(i);
                float b = noise(i + vec2(1.0, 0.0));
                float c = noise(i + vec2(0.0, 1.0));
                float d = noise(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            float fbm(vec2 p) {
                float v = 0.0;
                float a = 0.5;
                for (int i = 0; i < 5; i++) {
                    v += a * smoothNoise(p);
                    p *= 2.0;
                    a *= 0.5;
                }
                return v;
            }

            void main() {
                vec2 uv = vUv;
                float t = uTime * 0.15;
                
                vec2 movement = vec2(fbm(uv + t), fbm(uv - t));
                float n = fbm(uv * 2.5 + movement + uMouse * 0.1);
                
                // Additive Mouse Glow
                float mDist = distance(uv, uMouse * 0.5 + 0.5);
                float glow = smoothstep(0.45, 0.0, mDist) * 0.3;
                
                vec3 color1 = vec3(0.01, 0.0, 0.06); 
                vec3 color2 = vec3(0.06, 0.0, 0.12); 
                vec3 accent = vec3(0.0, 0.4, 0.5); 
                
                vec3 finalColor = mix(color1, color2, n);
                finalColor = mix(finalColor, accent, pow(n, 12.0) * (0.4 + glow));
                finalColor += accent * glow;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uMouse: { value: new THREE.Vector2(0, 0) }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setSize(w, h);
            uniforms.uResolution.value.set(w, h);
        };
        window.addEventListener('resize', handleResize);

        const animate = (time) => {
            if (isVisible.current) {
                uniforms.uTime.value = time * 0.001;
                uniforms.uMouse.value.lerp(mouseRef.current, 0.05);
                renderer.render(scene, camera);
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(requestRef.current);
            if (observerRef.current) observerRef.current.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="liquid-bg-container" style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: -1,
            pointerEvents: 'none'
        }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
            <div className="bg-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, transparent, rgba(0,0,0,0.85))',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default LiquidBackground;
