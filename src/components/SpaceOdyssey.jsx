// v7.0 — Dark Void Space (no nebula)
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
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000005, 1); // near-absolute black

        // ─── STARFIELD ───────────────────────────────────────────
        // Three layers: faint background stars, mid-field, bright foreground
        const buildStars = (count, size, color, opacity = 0.8) => {
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                pos[i*3]   = (Math.random() - 0.5) * 900;
                pos[i*3+1] = (Math.random() - 0.5) * 900;
                pos[i*3+2] = -Math.random() * 500;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            return new THREE.Points(geo, new THREE.PointsMaterial({
                size, color, transparent: true, opacity, sizeAttenuation: true,
            }));
        };

        const stars  = buildStars(5000, 0.06, 0xffffff, 0.7);   // distant white
        const stars2 = buildStars(2000, 0.12, 0xaabbff, 0.6);   // blue-white hot stars
        const stars3 = buildStars(1000, 0.18, 0xffeedd, 0.5);   // warm foreground stars
        const stars4 = buildStars(200,  0.30, 0xffffff, 0.9);   // bright foreground stars
        scene.add(stars, stars2, stars3, stars4);
        const allStars = [stars, stars2, stars3, stars4];
        const starSpeeds = [0.025, 0.045, 0.06, 0.08];

        // ─── STARSHIP ─────────────────────────────────────────────
        // ─── STARSHIP (Cinematic High-Detail Version) ─────────────
        const hullTex = (() => {
            const s = 1024, cv = document.createElement('canvas');
            cv.width = cv.height = s;
            const cx = cv.getContext('2d');
            // Base metallic gray
            cx.fillStyle = '#1a1a1a'; cx.fillRect(0,0,s,s);
            // Plating lines
            cx.strokeStyle = 'rgba(255,255,255,0.05)';
            cx.lineWidth = 1;
            for (let i = 0; i < 40; i++) {
                const pos = (i / 40) * s;
                cx.beginPath(); cx.moveTo(pos, 0); cx.lineTo(pos, s); cx.stroke();
                cx.beginPath(); cx.moveTo(0, pos); cx.lineTo(s, pos); cx.stroke();
            }
            // Greeble patches (mechanical details)
            for (let i = 0; i < 300; i++) {
                cx.fillStyle = `rgba(255,255,255,${Math.random()*0.02})`;
                const w = Math.random() * 80 + 10, h = Math.random() * 40 + 5;
                cx.fillRect(Math.random()*s, Math.random()*s, w, h);
            }
            // Small technical markings
            cx.fillStyle = 'rgba(255,255,255,0.1)';
            for (let i = 0; i < 50; i++) {
                cx.fillText('NC-' + Math.floor(Math.random()*9000), Math.random()*s, Math.random()*s);
            }
            const t = new THREE.CanvasTexture(cv);
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(2, 2);
            return t;
        })();

        const metalMat = new THREE.MeshStandardMaterial({ 
            color: 0x999999, 
            metalness: 0.95, 
            roughness: 0.15, 
            map: hullTex,
            bumpMap: hullTex,
            bumpScale: 0.02
        });
        const glowBlue = new THREE.MeshBasicMaterial({ color: 0x00ccff });
        const glowRed  = new THREE.MeshBasicMaterial({ color: 0xff3300 });
        const windowMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });

        const shipGroup = new THREE.Group();

        // 1. Primary Hull (Saucer)
        const saucerGroup = new THREE.Group();
        const mainSaucer = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.45, 0.18, 64), metalMat);
        const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.15, 32), metalMat);
        bridge.position.y = 0.15;
        const saucerBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.2, 0.2, 32), metalMat);
        saucerBottom.position.y = -0.15;
        saucerGroup.add(mainSaucer, bridge, saucerBottom);
        saucerGroup.rotation.x = Math.PI / 2;
        saucerGroup.position.z = 1.0;
        shipGroup.add(saucerGroup);

        // 2. Engineering Hull (Secondary)
        const engineering = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 1.8, 32), metalMat);
        engineering.rotation.x = Math.PI / 2;
        engineering.position.set(0, -0.6, -0.2);
        shipGroup.add(engineering);

        // 3. Deflector Dish (Detail)
        const deflectorBase = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 16, 32), metalMat);
        deflectorBase.position.set(0, -0.6, 0.7);
        const deflectorGlow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16, 0, Math.PI*2, 0, Math.PI/2), glowBlue);
        deflectorGlow.rotation.x = -Math.PI/2;
        deflectorGlow.position.set(0, -0.6, 0.72);
        shipGroup.add(deflectorBase, deflectorGlow);

        // 4. Connecting Neck
        const neck = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.5), metalMat);
        neck.position.set(0, -0.3, 0.5);
        shipGroup.add(neck);

        // 5. Warp Nacelles & Pylons
        [-1, 1].forEach(side => {
            // Pylons
            const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.3), metalMat);
            pylon.position.set(side * 0.5, -0.2, -0.4);
            pylon.rotation.z = side * Math.PI / 5;
            pylon.rotation.x = -Math.PI / 10;
            
            // Nacelle body
            const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 2.4, 24), metalMat);
            nacelle.rotation.x = Math.PI / 2;
            nacelle.position.set(side * 1.1, 0.4, -0.8);
            
            // Bussard Collector (Front Glow)
            const collector = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), glowRed);
            collector.position.y = 1.2;
            nacelle.add(collector);

            // Warp Grilles (Side Glow)
            const grille = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 0.12), glowBlue);
            grille.position.set(side * 0.14, 0, 0);
            nacelle.add(grille);

            shipGroup.add(pylon, nacelle);
        });

        // 6. Tiny Windows (Scale indicators)
        const windowGeo = new THREE.BoxGeometry(0.015, 0.012, 0.01);
        for (let i = 0; i < 150; i++) {
            const w = new THREE.Mesh(windowGeo, windowMat);
            // Randomly place on saucer or hull
            if (Math.random() > 0.5) {
                const angle = Math.random() * Math.PI * 2;
                const r = 0.6 + Math.random() * 0.7;
                w.position.set(Math.cos(angle) * r, 0.1, Math.sin(angle) * r + 1.0);
            } else {
                w.position.set((Math.random()-0.5)*0.5, -0.6 + (Math.random()-0.5)*1.0, -0.5 + Math.random()*1.5);
            }
            shipGroup.add(w);
        }

        const ship = shipGroup;
        ship.scale.setScalar(0.7);
        scene.add(ship);

        // ─── PLANET ───────────────────────────────────────────────
        const PLANET_Z = -50;
        const pMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.9, metalness: 0.1 });
        const planet = new THREE.Mesh(new THREE.SphereGeometry(12, 48, 48), pMat);
        planet.position.z = PLANET_Z;
        scene.add(planet);
        new THREE.TextureLoader().load('/parallax/planet.png', tx => {
            pMat.map = tx; pMat.bumpMap = tx; pMat.bumpScale = 0.5;
            pMat.color.set(0xffffff); pMat.needsUpdate = true;
        });
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(12.3, 48, 48),
            new THREE.MeshBasicMaterial({ color: 0x8899ff, transparent: true, opacity: 0.04, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        );
        atmosphere.position.z = PLANET_Z;
        scene.add(atmosphere);

        // ─── LIGHTING ─────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffffff, 0.05));
        const sun = new THREE.DirectionalLight(0xfff5e0, 2.8);
        sun.position.set(-25, 18, 22); scene.add(sun);
        const fill = new THREE.DirectionalLight(0x2244ff, 0.3);
        fill.position.set(20, -10, -10); scene.add(fill);

        // ─── ANIMATION ────────────────────────────────────────────
        let lastScrollY = window.scrollY;
        let warpSpeed   = 0;
        let elapsed     = 0;

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

            // Warp speed star movement
            for (let s = 0; s < allStars.length; s++) {
                const arr = allStars[s].geometry.attributes.position.array;
                const spd = starSpeeds[s] + warpSpeed;
                for (let i = 0; i < arr.length; i += 3) {
                    arr[i+2] += spd;
                    if (arr[i+2] > 12) {
                        arr[i+2] = -480;
                        arr[i]   = (Math.random()-0.5)*900;
                        arr[i+1] = (Math.random()-0.5)*900;
                    }
                }
                allStars[s].geometry.attributes.position.needsUpdate = true;
            }

            const pct   = curY / ((document.documentElement.scrollHeight - window.innerHeight) || 1);
            const angle = pct * Math.PI * 1.5;

            // Ship orbit around planet
            ship.position.x = THREE.MathUtils.lerp(ship.position.x, Math.sin(angle) * 25, 0.04);
            ship.position.z = THREE.MathUtils.lerp(ship.position.z, PLANET_Z + Math.cos(angle) * 25, 0.04);
            ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, -mouseY * 0.3, 0.05);
            ship.rotation.y = THREE.MathUtils.lerp(ship.rotation.y, angle + mouseX * 0.3, 0.05);
            ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, mouseX * 0.09, 0.05);
            // Subtle emissive pulse for engines
            glowRed.opacity = 0.9 + Math.sin(elapsed * 5.0) * 0.1;
            glowBlue.opacity = 0.9 + Math.sin(elapsed * 5.0) * 0.1;

            // Planet grows as you scroll (flying toward it)
            const ps = THREE.MathUtils.lerp(0.38, 1.35, pct);
            planet.scale.setScalar(THREE.MathUtils.lerp(planet.scale.x, ps, 0.1));
            atmosphere.scale.setScalar(planet.scale.x);
            // Planet rotates slowly as it approaches — subtle scroll + gentle idle spin
            planet.rotation.y = Math.PI + (pct * Math.PI * 0.6) + elapsed * 0.015;

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
