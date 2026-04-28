import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NebulaBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        // Deep smoky black background with a tiny bit of red
        scene.fog = new THREE.FogExp2(0x050002, 0.0015);
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        // Position camera to look into the nebula
        camera.position.z = 1;
        camera.rotation.x = 1.16;
        camera.rotation.y = -0.12;
        camera.rotation.z = 0.27;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x030002, 1);
        containerRef.current.appendChild(renderer.domElement);

        // Ambient Light to give base color
        const ambient = new THREE.AmbientLight(0x401010); // dark red ambient
        scene.add(ambient);

        // Directional Light for dramatic shading on clouds
        const directionalLight = new THREE.DirectionalLight(0xff8c19); // warm light
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        // Flash lights for energy effect / highlights inside nebula
        const flash = new THREE.PointLight(0xffb6c1, 30, 600, 1.7); // Light pink flash
        flash.position.set(200, 300, 100);
        scene.add(flash);

        // Generate procedural smoke texture using a canvas radial gradient
        const createSmokeTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
            gradient.addColorStop(0, 'rgba(255,255,255,0.6)');
            gradient.addColorStop(0.2, 'rgba(240,240,240,0.4)');
            gradient.addColorStop(0.5, 'rgba(200,200,200,0.1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 512, 512);
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        };

        const smokeTexture = createSmokeTexture();

        // Create Smoke Particles
        const cloudParticles = [];
        const cloudGeo = new THREE.PlaneGeometry(600, 600);
        
        // Deep Crimson and Burgundy Colors
        const colors = [
            0x800020, // Burgundy
            0x4a0404, // Dark Red
            0x8b0000, // Dark Red
            0xff1493, // Deep Pink (highlights)
            0x2a0000  // Very dark smoky red
        ];

        for (let p = 0; p < 70; p++) {
            const cloudMaterial = new THREE.MeshLambertMaterial({
                map: smokeTexture,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                color: colors[Math.floor(Math.random() * colors.length)]
            });

            const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 1000 - 500,
                500,
                Math.random() * 800 - 400
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 360;
            cloud.material.opacity = 0.3 + Math.random() * 0.4;
            scene.add(cloud);
            cloudParticles.push(cloud);
        }

        // Add Stars
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 3000;
        const posArray = new Float32Array(starsCount * 3);
        for(let i = 0; i < starsCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 2000;
            posArray[i+1] = (Math.random() - 0.5) * 2000;
            posArray[i+2] = (Math.random() - 0.5) * 2000;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Procedural Star Texture
        const createStarTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(0.8, 'rgba(255,255,255,0.1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0,16,16);
            return new THREE.CanvasTexture(canvas);
        };
        const starTexture = createStarTexture();

        const starsMaterial = new THREE.PointsMaterial({
            size: 3,
            map: starTexture,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: 0xffffff
        });
        const starMesh = new THREE.Points(starsGeo, starsMaterial);
        scene.add(starMesh);

        // Track mouse for subtle parallax
        let mouseX = 0;
        let mouseY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        let animId;
        const clock = new THREE.Clock();

        const tick = () => {
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            // Slowly rotate clouds to simulate swirling gas
            cloudParticles.forEach(p => {
                p.rotation.z -= delta * 0.1;
            });

            // Occasional lightning/glow flashes in the nebula for organic depth
            if (Math.random() > 0.95 || flash.power > 100) {
                if (flash.power < 100) {
                    flash.position.set(
                        Math.random() * 400 - 200,
                        300 + Math.random() * 200,
                        100
                    );
                }
                flash.power = 50 + Math.random() * 300;
            } else {
                flash.power = 0;
            }

            // Slowly rotate the entire starfield and shift based on mouse
            starMesh.rotation.y = elapsedTime * 0.01;
            starMesh.rotation.x = elapsedTime * 0.005;

            // Parallax effect on camera
            camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 50 - camera.position.y) * 0.05;

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
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: '#020004' }}>
        </div>
    );
};

export default NebulaBackground;
