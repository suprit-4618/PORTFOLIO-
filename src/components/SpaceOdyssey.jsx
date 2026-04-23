import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceOdyssey = () => {
    const containerRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        let renderer, scene, camera, ship, planet, stars, stars2;
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        
        // -- 1. Setup --
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;
        
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current, 
            antialias: true, 
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // -- 2. Procedural Hull Texture (Federation Style) --
        const createHullTexture = () => {
            const size = 1024;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1a1a1a'; // Darker for premium feel
            ctx.fillRect(0, 0, size, size);
            
            // Subtle Azural Paneling
            for (let i = 0; i < 150; i++) {
                const w = Math.random() * 200 + 40;
                const h = Math.random() * 100 + 10;
                const x = Math.random() * size;
                const y = Math.random() * size;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.04})`;
                ctx.fillRect(x, y, w, h);
                ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                ctx.strokeRect(x, y, w, h);
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            return tex;
        };
        const hullTex = createHullTexture();

        // -- 3. Advanced Starfield --
        const createStars = (count, size, color) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                pos[i * 3] = (Math.random() - 0.5) * 400;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
                pos[i * 3 + 2] = (Math.random() - 0.5) * 200 - 100;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ size, color, transparent: true, opacity: 0.5 });
            return new THREE.Points(geo, mat);
        };
        stars = createStars(6000, 0.04, 0xffffff);
        stars2 = createStars(4000, 0.06, 0xaaaaaa);
        const stars3 = createStars(2000, 0.08, 0x8888ff); // Distant blueish stars
        scene.add(stars, stars2, stars3);

        // -- 4. THE CAPITAL STARSHIP (ENTERPRISE STYLE) --
        const shipGroup = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc, 
            metalness: 0.9, 
            roughness: 0.2, 
            map: hullTex,
            bumpMap: hullTex,
            bumpScale: 0.02
        });
        const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 1, roughness: 0.1 });
        const bussardMat = new THREE.MeshBasicMaterial({ color: 0xff3300 }); // Red Glow
        const warpMat = new THREE.MeshBasicMaterial({ color: 0x00ccff }); // Blue Glow
        const windowMat = new THREE.MeshBasicMaterial({ color: 0xffffaa }); // Yellow Window

        // A. Saucer Section (Primary Hull)
        const saucerGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.15, 48);
        const saucer = new THREE.Mesh(saucerGeo, metalMat);
        saucer.rotation.x = Math.PI / 2;
        saucer.position.z = 0.8;
        shipGroup.add(saucer);
        
        const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.1, 24), metalMat);
        bridge.position.y = 0.1;
        saucer.add(bridge);

        // B. Secondary Hull (Engineering)
        const secondaryHull = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.18, 1.2, 24), metalMat);
        secondaryHull.rotation.x = Math.PI / 2;
        secondaryHull.position.z = -0.4;
        secondaryHull.position.y = -0.4;
        shipGroup.add(secondaryHull);
        
        // Deflector Dish
        const deflectorGeo = new THREE.SphereGeometry(0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const deflector = new THREE.Mesh(deflectorGeo, warpMat);
        deflector.rotation.x = -Math.PI / 2;
        deflector.position.set(0, 0, 0.6);
        secondaryHull.add(deflector);

        // C. Connecting Neck
        const neck = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.3), metalMat);
        neck.position.set(0, -0.2, 0.3);
        shipGroup.add(neck);

        // D. Warp Nacelles & Pylons
        const nacelleGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.6, 16);
        const createNacelle = (side) => {
            const group = new THREE.Group();
            
            // Pylon
            const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.2), metalMat);
            pylon.position.set(side * 0.4, 0.2, -0.6);
            pylon.rotation.z = side * Math.PI / 6;
            shipGroup.add(pylon);
            
            // Nacelle Body
            const nacelle = new THREE.Mesh(nacelleGeo, metalMat);
            nacelle.rotation.x = Math.PI / 2;
            nacelle.position.set(side * 0.7, 0.5, -0.8);
            shipGroup.add(nacelle);
            
            // Bussard Collector (Front Red)
            const bussard = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), bussardMat);
            bussard.position.set(0, 0.8, 0);
            nacelle.add(bussard);
            
            // Warp Grille (Blue Stripe)
            const grille = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 0.1), warpMat);
            grille.position.set(side * 0.1, 0, 0);
            nacelle.add(grille);
            
            return nacelle;
        };
        const nacelleL = createNacelle(-1);
        const nacelleR = createNacelle(1);

        // E. Window Lights
        const windowGroup = new THREE.Group();
        for (let i = 0; i < 60; i++) {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.01, 0.015), windowMat);
            const r = 0.5 + Math.random() * 0.7;
            const a = Math.random() * Math.PI * 2;
            win.position.set(Math.cos(a) * r, 0.1, Math.sin(a) * r + 0.8);
            windowGroup.add(win);
        }
        shipGroup.add(windowGroup);

        ship = shipGroup;
        ship.scale.set(0.6, 0.6, 0.6); // Massive but scaled for view
        scene.add(ship);

        // -- 5. Planet --
        const textureLoader = new THREE.TextureLoader();
        const planetGeo = new THREE.SphereGeometry(12, 64, 64);
        planet = new THREE.Mesh(planetGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
        
        textureLoader.load('/parallax/planet.png', (tex) => {
            planet.material.map = tex;
            planet.material.color.set(0xffffff);
            planet.material.needsUpdate = true;
        });
        
        const PLANET_Z = -50;
        planet.position.set(0, 0, PLANET_Z);
        scene.add(planet);

        // -- 6. Atmosphere & Lights --
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambient);
        
        const direct = new THREE.DirectionalLight(0xffffff, 1.8);
        direct.position.set(10, 10, 10);
        scene.add(direct);

        // -- 7. Animation Logic --
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            const scroll = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            
            // Orbital Motion
            const orbitRadius = 25;
            const angle = scroll * Math.PI * 1.5; 
            
            const targetX_pos = Math.sin(angle) * orbitRadius;
            const targetZ_pos = PLANET_Z + Math.cos(angle) * orbitRadius;
            
            ship.position.x = THREE.MathUtils.lerp(ship.position.x, targetX_pos, 0.04);
            ship.position.z = THREE.MathUtils.lerp(ship.position.z, targetZ_pos, 0.04);
            
            // Mouse Banking (Graceful for Capital Ship)
            targetX = mouseX * 0.3;
            targetY = -mouseY * 0.3;
            
            ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, targetY, 0.05);
            ship.rotation.y = THREE.MathUtils.lerp(ship.rotation.y, angle + targetX, 0.05);
            ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, targetX * 0.3, 0.05);
            
            // Starfield Parallax
            stars.rotation.y += 0.0001 + (scroll * 0.001);
            stars2.rotation.y += 0.0002 + (scroll * 0.002);
            stars3.rotation.y += 0.0003 + (scroll * 0.003);
            
            // Engine Flicker
            bussardMat.opacity = 0.8 + Math.random() * 0.2;
            warpMat.opacity = 0.8 + Math.random() * 0.2;
            
            planet.rotation.y += 0.0005;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: -1, 
            pointerEvents: 'none',
            background: '#000' 
        }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default SpaceOdyssey;
