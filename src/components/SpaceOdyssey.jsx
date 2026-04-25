// SpaceOdyssey.jsx — Orbiting Starship (Standard Version)
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceOdyssey = () => {
    const containerRef = useRef();
    const canvasRef    = useRef();

    useEffect(() => {
        if (!canvasRef.current) return;

        let animId;
        let mouseX = 0, mouseY = 0;

        // ─── SCENE ───────────────────────────────────────────────
        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000005, 1);

        // ─── STARFIELD ───────────────────────────────────────────
        const buildStars = (count, size, color, opacity = 0.8) => {
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                pos[i*3]   = (Math.random() - 0.5) * 1200;
                pos[i*3+1] = (Math.random() - 0.5) * 1200;
                pos[i*3+2] = -Math.random() * 800;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            return new THREE.Points(geo, new THREE.PointsMaterial({
                size, color, transparent: true, opacity, sizeAttenuation: true,
            }));
        };

        const stars  = buildStars(5000, 0.08, 0xffffff, 0.7);
        const stars2 = buildStars(2000, 0.15, 0xaabbff, 0.6);
        const stars3 = buildStars(1000, 0.25, 0xffeedd, 0.5);
        scene.add(stars, stars2, stars3);
        const allStars = [stars, stars2, stars3];
        const starSpeeds = [0.03, 0.05, 0.08];

        // ─── STARSHIP ─────────────────────────────────────────────
        let ship;
        const shipGroup = new THREE.Group();
        
        // Procedural Fallback
        const createProceduralShip = () => {
            const hullTex = (() => {
                const s = 1024, cv = document.createElement('canvas');
                cv.width = cv.height = s;
                const cx = cv.getContext('2d');
                cx.fillStyle = '#1e1e24'; cx.fillRect(0,0,s,s);
                cx.strokeStyle = 'rgba(255,255,255,0.08)';
                for (let i = 0; i < 60; i++) {
                    const p = (i/60)*s;
                    cx.beginPath(); cx.moveTo(p,0); cx.lineTo(p,s); cx.stroke();
                    cx.beginPath(); cx.moveTo(0,p); cx.lineTo(s,p); cx.stroke();
                }
                const t = new THREE.CanvasTexture(cv);
                t.wrapS = t.wrapT = THREE.RepeatWrapping;
                return t;
            })();

            const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.95, roughness: 0.2, map: hullTex });
            const glowBlue = new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.8 });
            const glowRed  = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.8 });
            const windowMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });

            const group = new THREE.Group();
            const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 64), metalMat);
            saucer.scale.x = 1.3; saucer.rotation.x = Math.PI / 2; saucer.position.z = 1.2;
            const engineering = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 2.0, 32), metalMat);
            engineering.rotation.x = Math.PI / 2; engineering.position.set(0, -0.7, -0.3);
            const deflector = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32, 0, Math.PI*2, 0, Math.PI/2), glowBlue);
            deflector.rotation.x = -Math.PI/2; deflector.position.set(0, -0.7, 0.75);
            group.add(saucer, engineering, deflector);

            [-1, 1].forEach(side => {
                const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 2.8, 32), metalMat);
                nacelle.rotation.x = Math.PI / 2; nacelle.position.set(side * 1.4, 0.6, -1.2);
                const collector = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), glowRed);
                collector.position.y = 1.4; nacelle.add(collector);
                group.add(nacelle);
            });
            return { group, glowRed, glowBlue };
        };

        const procedural = createProceduralShip();
        shipGroup.add(procedural.group);
        ship = shipGroup;
        ship.scale.setScalar(0.7);
        scene.add(ship);

        import('three/examples/jsm/loaders/GLTFLoader').then(({ GLTFLoader }) => {
            const loader = new GLTFLoader();
            loader.load('/enterprise.glb', (gltf) => {
                scene.remove(shipGroup);
                ship = gltf.scene;
                ship.scale.setScalar(0.4); // "Toy size" - small relative to the planet
                scene.add(ship);
            });
        });

        const glowRed = procedural.glowRed;
        const glowBlue = procedural.glowBlue;

        // ─── PLANET ───────────────────────────────────────────────
        const PLANET_Z = -100;
        const pMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.9, metalness: 0.1 });
        const planet = new THREE.Mesh(new THREE.SphereGeometry(25, 64, 64), pMat);
        planet.position.z = PLANET_Z;
        scene.add(planet);
        new THREE.TextureLoader().load('/parallax/planet.png', tx => {
            pMat.map = tx; pMat.bumpMap = tx; pMat.bumpScale = 0.5;
            pMat.color.set(0xffffff); pMat.needsUpdate = true;
        });
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(25.5, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0x8899ff, transparent: true, opacity: 0.05, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        );
        atmosphere.position.z = PLANET_Z;
        scene.add(atmosphere);

        // ─── LIGHTING ─────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffffff, 0.05));
        const directionalLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
        directionalLight.position.set(-30, 20, 20); scene.add(directionalLight);

        // ─── ANIMATION STATE ──────────────────────────────────────
        let lastScrollY = window.scrollY;
        let warpSpeed   = 0;
        let elapsed     = 0;
        
        // Randomize Orbit Path once on load
        const orbitRotation = new THREE.Euler(
            (Math.random() - 0.5) * Math.PI * 0.5, // Tilt up/down
            (Math.random() - 0.5) * Math.PI * 2.0, // Rotate around Y
            (Math.random() - 0.5) * Math.PI * 0.2  // Slight roll
        );

        const onMouse = e => {
            mouseX = (e.clientX / window.innerWidth)  - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', onMouse);

        const tick = () => {
            animId   = requestAnimationFrame(tick);
            elapsed += 0.016;

            const curY  = window.scrollY;
            const delta = Math.abs(curY - lastScrollY);
            lastScrollY = curY;
            warpSpeed   = THREE.MathUtils.lerp(warpSpeed, Math.min(delta * 0.05, 12), 0.12);

            for (let s = 0; s < allStars.length; s++) {
                const arr = allStars[s].geometry.attributes.position.array;
                const spd = starSpeeds[s] + warpSpeed;
                for (let i = 0; i < arr.length; i += 3) {
                    arr[i+2] += spd;
                    if (arr[i+2] > 20) arr[i+2] = -780;
                }
                allStars[s].geometry.attributes.position.needsUpdate = true;
            }

            const pct   = curY / ((document.documentElement.scrollHeight - window.innerHeight) || 1);
            const angle = pct * Math.PI * 2.0;

            // Randomized Orbit Calculation
            const ORBIT_RADIUS = 45;
            const localPos = new THREE.Vector3(Math.sin(angle) * ORBIT_RADIUS, 0, Math.cos(angle) * ORBIT_RADIUS);
            
            // Apply the random orbit tilt
            localPos.applyEuler(orbitRotation);
            
            // Move to planet center
            ship.position.set(
                localPos.x,
                localPos.y,
                PLANET_Z + localPos.z
            );

            // Orient the ship to face its trajectory
            const tangent = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
            tangent.applyEuler(orbitRotation);
            const lookAtTarget = ship.position.clone().add(tangent);
            ship.lookAt(lookAtTarget);

            // Subtle mouse tilt
            ship.rotation.x += -mouseY * 0.2;
            ship.rotation.z += mouseX * 0.2;

            // Pulsing engines
            glowRed.opacity = 0.8 + Math.sin(elapsed * 4.0) * 0.2;
            glowBlue.opacity = 0.8 + Math.sin(elapsed * 4.0) * 0.2;

            // Planet slowly rotates
            planet.rotation.y = elapsed * 0.005 + pct * Math.PI * 0.5;

            renderer.render(scene, camera);
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
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: '#000005' }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default SpaceOdyssey;
