import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const AliveNebulaBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        camera.position.set(0, 0, 50);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Cinematic Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 2.0));
        const camLight = new THREE.PointLight(0xff0066, 15, 1000); // Pink spotlight
        scene.add(camLight);
        
        const blueLight = new THREE.PointLight(0x0066ff, 15, 1000); // Blue fill
        blueLight.position.set(-100, -100, 100);
        scene.add(blueLight);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        let nebula;
        loader.load('/nebula.glb', (gltf) => {
            nebula = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(nebula);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            nebula.position.sub(center);
            
            // Scale to be immersive
            const scale = 100 / Math.max(size.x, size.y, size.z);
            nebula.scale.set(scale, scale, scale);

            nebula.traverse(child => {
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide;
                    child.material.transparent = true;
                    // Boost the natural nebula colors
                    if (child.material.emissive) {
                        child.material.emissiveIntensity = 3.0;
                    }
                }
            });

            scene.add(nebula);
        });

        let mouseX = 0, mouseY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        };

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);

        let animId;
        const tick = () => {
            if (nebula) {
                nebula.rotation.y += 0.001;
                // Parallax
                camera.position.x += (mouseX * 30 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 30 - camera.position.y) * 0.05;
                camera.lookAt(0, 0, 0);
                camLight.position.copy(camera.position);

                // Flight effect
                const scrollY = window.scrollY;
                nebula.position.z = scrollY * 0.1;
            }
            renderer.render(scene, camera);
            animId = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            dracoLoader.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: -1, background: '#000' }}>
        </div>
    );
};

export default AliveNebulaBackground;
