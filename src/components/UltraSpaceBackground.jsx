import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const UltraSpaceBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        // Very faint deep blue fog to blend distant stars into darkness
        scene.fog = new THREE.FogExp2(0x020205, 0.0006);
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.z = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x010103, 1);
        containerRef.current.appendChild(renderer.domElement);

        // ─── STARFIELD GENERATION ───
        
        // Helper to create a circular soft star texture procedurally
        const createStarTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)');
            gradient.addColorStop(0.3, 'rgba(200,220,255,0.4)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0,32,32);
            return new THREE.CanvasTexture(canvas);
        };
        const starTexture = createStarTexture();

        const starLayers = [];
        
        const buildStars = (count, size, colorsArray, depthMin, depthMax, opacity, speedFactor) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const color = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                // Random position in a wide cylinder along the Z axis
                const r = 10 + Math.random() * 2000;
                const theta = Math.random() * Math.PI * 2;
                pos[i*3] = r * Math.cos(theta); // x
                pos[i*3+1] = r * Math.sin(theta); // y
                pos[i*3+2] = -(Math.random() * (depthMax - depthMin) + depthMin); // z

                // Random color from array
                const c = new THREE.Color(colorsArray[Math.floor(Math.random() * colorsArray.length)]);
                color[i*3] = c.r;
                color[i*3+1] = c.g;
                color[i*3+2] = c.b;
            }

            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(color, 3));

            const mat = new THREE.PointsMaterial({
                size: size,
                map: starTexture,
                transparent: true,
                opacity: opacity,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });

            const points = new THREE.Points(geo, mat);
            scene.add(points);
            return { points, baseSpeed: speedFactor };
        };

        const colorsWarm = [0xffffff, 0xfff0dd, 0xffddaa, 0xffffff];
        const colorsCool = [0xffffff, 0xddf0ff, 0xbbddff, 0x88bbff];
        const colorsDeep = [0x5588ff, 0x8855ff, 0x444444];

        // 1. Huge amount of tiny distant stars
        starLayers.push(buildStars(12000, 1.5, colorsCool.concat(colorsDeep), 0, 4000, 0.4, 0.5));
        // 2. Medium stars
        starLayers.push(buildStars(4000, 3.5, colorsWarm, 0, 4000, 0.7, 0.8));
        // 3. Large, bright close stars
        starLayers.push(buildStars(1000, 7.0, colorsWarm.concat(colorsCool), 0, 4000, 1.0, 1.2));
        
        // ─── NEBULA DUST (For Volumetric Realism) ───
        const dustGeo = new THREE.BufferGeometry();
        const dustCount = 800;
        const dustPos = new Float32Array(dustCount * 3);
        for(let i=0; i<dustCount; i++){
            const r = 200 + Math.random() * 1500;
            const theta = Math.random() * Math.PI * 2;
            dustPos[i*3] = r * Math.cos(theta);
            dustPos[i*3+1] = r * Math.sin(theta);
            dustPos[i*3+2] = -(Math.random() * 4000);
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({
            size: 100,
            map: starTexture,
            transparent: true,
            opacity: 0.03,
            color: 0x113388,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const dust = new THREE.Points(dustGeo, dustMat);
        scene.add(dust);
        starLayers.push({ points: dust, baseSpeed: 0.4 });

        // ─── SCROLL & INTERACTION LOGIC ───
        let lastScrollY = window.scrollY;
        let targetSpeed = 1.0; // base ambient drift speed
        let currentSpeed = 1.0;
        
        let mouseX = 0;
        let mouseY = 0;

        const onScroll = () => {
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;
            
            // Speed up dramatically based on scroll delta
            targetSpeed = 1.0 + Math.abs(deltaY) * 1.5; 
            
            // Cap the max speed to prevent visual breakdown
            if (targetSpeed > 150) targetSpeed = 150;
        };

        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouseMove);

        // ─── ANIMATION LOOP ───
        let animId;
        const tick = () => {
            // Lerp the speed back to base speed over time for smooth braking
            currentSpeed += (targetSpeed - currentSpeed) * 0.1;
            targetSpeed += (1.0 - targetSpeed) * 0.05;

            // Move the camera smoothly based on mouse (Parallax)
            camera.position.x += (mouseX * 200 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 200 - camera.position.y) * 0.02;
            camera.lookAt(0, 0, -1000);

            // Move stars forward to simulate flying
            starLayers.forEach(layer => {
                const positions = layer.points.geometry.attributes.position.array;
                // Layer speed = its relative speed factor * global warp speed
                const speed = layer.baseSpeed * currentSpeed;

                for (let i = 2; i < positions.length; i += 3) {
                    positions[i] += speed; // move towards camera (+Z)
                    
                    // If star passes camera, reset it far back
                    if (positions[i] > 100) {
                        positions[i] -= 4000;
                    }
                }
                layer.points.geometry.attributes.position.needsUpdate = true;
                
                // Extremely slow rotation of the entire layer for dynamic feel
                layer.points.rotation.z += 0.0002 * layer.baseSpeed;
            });

            renderer.render(scene, camera);
            animId = requestAnimationFrame(tick);
        };
        tick();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: '#010103' }}>
        </div>
    );
};

export default UltraSpaceBackground;
