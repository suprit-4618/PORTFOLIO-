import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BrunoPhysicsWorld } from './PhysicsEngine';
import { LowPolyEnvironment } from './Environment3D';
import { getHeightAt, getSurfaceHeight } from './TerrainGenerator';
import { ToyCar } from './Vehicle';
import { ToyBicycle } from './Bicycle';
import { VillageResumeModal } from './VillageResumeModal';
import { 
  RotateCcw, 
  ArrowUpRight, 
  Sparkles, 
  Sun, 
  Moon, 
  Sunset,
  Camera, 
  Car, 
  Bike,
  LogOut,
  Zap,
  Compass,
  ChevronDown
} from 'lucide-react';
import './BrunoUI.css';

/**
 * Multiple Professional Racing & Cinematic Camera Perspectives
 */
export const CAMERA_MODES = [
  { id: 'close', key: '1', label: 'NFS Chase', desc: 'Dynamic Close Follow with Speed FOV' },
  { id: 'far', key: '2', label: 'GTA Chase', desc: 'Wide High Pursuit Follow' },
  { id: 'hood', key: '3', label: 'Cockpit Hood', desc: 'First-Person Bonnet View' },
  { id: 'wheel', key: '4', label: 'Action Wheel', desc: 'Low Asphalt Ground Rush' },
  { id: 'topdown', key: '5', label: 'Helicopter', desc: 'Overhead Pursuit Tracking' },
  { id: 'rear', key: '6', label: 'Rear View', desc: 'Reverse Look at Exhaust & Sunset' },
  { id: 'cinematic', key: '7', label: 'Director Drone', desc: '360° Continuous Orbiting Flyby' },
  { id: 'satellite', key: '8', label: 'Satellite Map', desc: 'High-Altitude 360° Free Map Orbit' }
];

/**
 * Procedural Sky Atmosphere Texture Generator
 * Creates an authentic dusk/sunset vertical color ramp matching the user reference image
 */
function createSkyDomeTexture() {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.00, '#0c101c'); // Zenith: Deep night-navy
  grad.addColorStop(0.30, '#15192c'); // High sky: Twilight indigo
  grad.addColorStop(0.46, '#382236'); // Mid sky: Dusk plum/violet
  grad.addColorStop(0.56, '#863b33'); // Upper sunset: Warm terracotta
  grad.addColorStop(0.66, '#d96c2b'); // Mid sunset: Salmon amber
  grad.addColorStop(0.74, '#f59e0b'); // Horizon: Radiant golden sunset
  grad.addColorStop(0.82, '#b85422'); // Cloud crest: Golden haze
  grad.addColorStop(1.00, '#24161a'); // Lower earth/haze

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const BrunoWorld = ({ onSelectProject, onToggleClassicView, onExitToGateway }) => {
  const containerRef = useRef(null);

  // Experience States
  const [activeZone, setActiveZone] = useState(null);
  const [isVillageModalOpen, setIsVillageModalOpen] = useState(false);
  const isVillageModalOpenRef = useRef(false);
  isVillageModalOpenRef.current = isVillageModalOpen;
  const [villageModalSection, setVillageModalSection] = useState('about');
  const [isMobile, setIsMobile] = useState(false);
  const [timeMode, setTimeMode] = useState('sunset'); // 'sunset' (matches reference image) | 'night' | 'day'
  const [cameraMode, setCameraMode] = useState('close'); // Multiple dynamic angles
  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [cameraToast, setCameraToast] = useState(null);
  const cameraToastTimeoutRef = useRef(null);
  const [activeVehicleType, setActiveVehicleType] = useState('car'); // 'car' or 'bicycle'
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [nitroPercent, setNitroPercent] = useState(100);
  const [isBoosting, setIsBoosting] = useState(false);
  const [vehHeading, setVehHeading] = useState(0);
  const [vehPos, setVehPos] = useState({ x: -10, z: -20 });

  // Core Three.js references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const physicsWorldRef = useRef(null);
  const environmentRef = useRef(null);
  const carRef = useRef(null);
  const bikeRef = useRef(null);
  const activeVehicleRef = useRef(null);
  const sunLightRef = useRef(null);
  const moonLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const skyDomeRef = useRef(null);
  const animFrameRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());

  // 3D Garage Floating Selector Labels
  const carMarkerRef = useRef(null);
  const bikeMarkerRef = useRef(null);

  // GTA V & Need for Speed Dual Spring-Damper Follow Camera Rig
  const cameraStateRef = useRef({
    camPos: new THREE.Vector3(0.0, getHeightAt(0.0, -28.0) + 2.4, -20.5),
    lookTarget: new THREE.Vector3(0.0, getHeightAt(0.0, -28.0) + 1.2, -40.0),
    currentFOV: 58.0,
    currentRoll: 0.0,

    freeLookYaw: 0.0,
    freeLookPitch: 0.0,
    lastLookTime: 0,
    isDragging: false,
    dragButton: 0,
    lastMouseX: 0,
    lastMouseY: 0,

    orbitRadius: 75.0,
    orbitTheta: Math.PI * 1.15,
    orbitPhi: 0.55,
    panOffset: new THREE.Vector3(0, 0, 0)
  });

  // Input states (Forward, Backward, Left, Right, Drift, Nitro)
  const inputRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    drift: false,
    nitro: false
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard Event Listeners (Option C & Option D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isVillageModalOpenRef.current) return;
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;

      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (code === 'KeyW' || key === 'w' || code === 'KeyZ' || key === 'z' || code === 'ArrowUp' || key === 'arrowup') {
        inputRef.current.forward = true;
      }
      if (code === 'KeyS' || key === 's' || code === 'ArrowDown' || key === 'arrowdown') {
        inputRef.current.backward = true;
      }
      if (code === 'KeyA' || key === 'a' || code === 'KeyQ' || key === 'q' || code === 'ArrowLeft' || key === 'arrowleft') {
        inputRef.current.left = true;
      }
      if (code === 'KeyD' || key === 'd' || code === 'ArrowRight' || key === 'arrowright') {
        inputRef.current.right = true;
      }
      if (code === 'Space' || key === ' ' || key === 'space') {
        inputRef.current.drift = true;
        e.preventDefault();
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        inputRef.current.nitro = true;
      }
      if (code === 'KeyR' || key === 'r') {
        handleReset();
      }
      if (code === 'KeyV' || key === 'v') {
        selectVehicleInWorld(activeVehicleType === 'car' ? 'bicycle' : 'car');
      }
      if (code === 'KeyC' || key === 'c') {
        toggleCameraMode();
      }
      if (code === 'Digit1' || key === '1' || code === 'Numpad1') selectCameraMode('close');
      if (code === 'Digit2' || key === '2' || code === 'Numpad2') selectCameraMode('far');
      if (code === 'Digit3' || key === '3' || code === 'Numpad3') selectCameraMode('hood');
      if (code === 'Digit4' || key === '4' || code === 'Numpad4') selectCameraMode('wheel');
      if (code === 'Digit5' || key === '5' || code === 'Numpad5') selectCameraMode('topdown');
      if (code === 'Digit6' || key === '6' || code === 'Numpad6') selectCameraMode('rear');
      if (code === 'Digit7' || key === '7' || code === 'Numpad7') selectCameraMode('cinematic');
      if (code === 'Digit8' || key === '8' || code === 'Numpad8') selectCameraMode('satellite');
      if (code === 'KeyN' || key === 'n') {
        cycleTimeMode();
      }
      if (code === 'Enter' || key === 'enter') {
        if (activeZone) {
          handleOpenDiscovery();
        }
      }
    };

    const handleKeyUp = (e) => {
      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (code === 'KeyW' || key === 'w' || code === 'KeyZ' || key === 'z' || code === 'ArrowUp' || key === 'arrowup') {
        inputRef.current.forward = false;
      }
      if (code === 'KeyS' || key === 's' || code === 'ArrowDown' || key === 'arrowdown') {
        inputRef.current.backward = false;
      }
      if (code === 'KeyA' || key === 'a' || code === 'KeyQ' || key === 'q' || code === 'ArrowLeft' || key === 'arrowleft') {
        inputRef.current.left = false;
      }
      if (code === 'KeyD' || key === 'd' || code === 'ArrowRight' || key === 'arrowright') {
        inputRef.current.right = false;
      }
      if (code === 'Space' || key === ' ' || key === 'space') {
        inputRef.current.drift = false;
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        inputRef.current.nitro = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        inputRef.current = { forward: false, backward: false, left: false, right: false, drift: false, nitro: false };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeVehicleType, activeZone]);

  // Main Three.js Scene Setup & Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Atmospheric Golden-Hour Fog (matching the user reference image)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181c2b);
    scene.fog = new THREE.FogExp2(0x382230, 0.0030);
    sceneRef.current = scene;

    // Atmospheric Sky Dome with realistic sunset cumulus panorama from reference video
    const textureLoader = new THREE.TextureLoader();
    const cloudsPanoTex = textureLoader.load('/textures/sunset_clouds_panorama.jpg');
    cloudsPanoTex.wrapS = THREE.RepeatWrapping;
    cloudsPanoTex.wrapT = THREE.ClampToEdgeWrapping;
    cloudsPanoTex.repeat.set(1, 1);
    cloudsPanoTex.colorSpace = THREE.SRGBColorSpace;

    const skyGeo = new THREE.SphereGeometry(650, 64, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      map: cloudsPanoTex,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.name = "AtmosphericSkyDome";
    skyDome.rotation.y = Math.PI * 0.95; // Aligns towering golden sunset cumulus clouds directly behind Sunset Cliff
    scene.add(skyDome);
    skyDomeRef.current = skyDome;

    // 2. Perspective Camera (Out on open highway facing south)
    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      850
    );
    const startGroundY = getHeightAt(0.0, -30.0);
    camera.position.set(0.0, startGroundY + 2.4, -22.5);
    camera.lookAt(0.0, startGroundY + 1.2, -45.0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with Filmic Tone Mapping & High Precision Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Cinematic Lighting Rig (Warm Sunset Key + Sunset Ambient Fill)
    const ambientLight = new THREE.AmbientLight(0x523d34, 1.25);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xffcaa2, 0x382822, 1.1);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Golden Sunset Directional Light (low raking angle across 500m landscape)
    const sunLight = new THREE.DirectionalLight(0xff9d4d, 2.8);
    sunLight.position.set(130, 60, -120);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 700;
    sunLight.shadow.camera.left = -240;
    sunLight.shadow.camera.right = 240;
    sunLight.shadow.camera.top = 240;
    sunLight.shadow.camera.bottom = -240;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    scene.add(sunLight.target);
    sunLightRef.current = sunLight;

    // Warm Sunset Fill Light from rear-left to light car body and roadside elements
    const fillLight = new THREE.DirectionalLight(0xfca5a5, 0.75);
    fillLight.position.set(-65, 45, 60);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Subtle Cool Rim Fill Light
    const moonLight = new THREE.DirectionalLight(0x60a5fa, 0.25);
    moonLight.position.set(-80, 65, 80);
    scene.add(moonLight);
    moonLightRef.current = moonLight;

    // 5. Physics World & Photorealistic Cloud-Plateau Environment
    const physicsWorld = new BrunoPhysicsWorld(scene);
    physicsWorldRef.current = physicsWorld;

    const environment = new LowPolyEnvironment(scene, physicsWorld);
    environmentRef.current = environment;

    // 6. Instantiate Vehicles
    const car = new ToyCar(physicsWorld, scene);
    car.reset(0.0, -30.0, Math.PI);
    carRef.current = car;

    const bike = new ToyBicycle(physicsWorld, scene);
    bike.reset(-14.0, -25.0);
    bikeRef.current = bike;

    activeVehicleRef.current = car;

    // 7. Main Animation & Physics Loop
    let lastTime = performance.now();
    let hudThrottleCounter = 0;

    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const activeVeh = activeVehicleRef.current;
      if (typeof window !== 'undefined') window.__activeVeh = activeVeh;

      if (activeVeh) {
        // Apply Driving Input (Option C)
        activeVeh.applyInput(delta, inputRef.current);

        // Step Physics & Detect Trigger Zones (Option D)
        const currentZone = physicsWorld.update(delta, activeVeh.position);
        setActiveZone((prev) => {
          const prevId = prev ? prev.id : null;
          const nextId = currentZone ? currentZone.id : null;
          if (prevId === nextId) return prev;
          return currentZone;
        });

        // Sync Vehicle Transform
        activeVeh.syncTransform(delta);

        // Update HUD Telemetry every 3 frames for optimal React performance
        hudThrottleCounter++;
        if (hudThrottleCounter % 3 === 0) {
          setCurrentSpeed(activeVeh.getSpeedKmH ? activeVeh.getSpeedKmH() : Math.round(Math.abs(activeVeh.speed || 0) * 3.6));
          setNitroPercent(activeVeh.getNitroPercent ? activeVeh.getNitroPercent() : 100);
          setIsBoosting(activeVeh.isBoosting ? activeVeh.isBoosting() : false);
          setVehHeading(activeVeh.heading || 0);
          setVehPos({ x: activeVeh.position.x, z: activeVeh.position.z });
        }
      }

      // Sync inactive parked vehicle
      if (activeVeh === carRef.current && bikeRef.current) {
        bikeRef.current.syncTransform(delta);
      } else if (activeVeh === bikeRef.current && carRef.current) {
        carRef.current.syncTransform(delta);
      }

      // Update Environment Animations (cloud drift, windmill, dishes)
      environment.update(delta);

      // ─── DYNAMIC CAMERA MOMENTS & FOLLOW RIG ───
      const camState = cameraStateRef.current;
      const isDriving = inputRef.current.forward || inputRef.current.backward || inputRef.current.left || inputRef.current.right || inputRef.current.drift || inputRef.current.nitro;

      const currentCamMode = cameraModeRef.current;

      if (currentCamMode !== 'satellite' && activeVeh && activeVeh.position) {
        const isCar = activeVehicleType === 'car';
        const speed = activeVeh.speed || 0;
        const maxSpeed = activeVeh.maxSpeed || 28.0;
        const speedRatio = Math.min(1.0, Math.abs(speed) / maxSpeed);
        const heading = (activeVeh.mesh ? activeVeh.mesh.rotation.y : activeVeh.heading || 0);
        const fwdX = Math.sin(heading);
        const fwdZ = Math.cos(heading);
        const rightX = Math.cos(heading);
        const rightZ = -Math.sin(heading);

        // Automated Cinematic Moment A: The Grand Suspension Bridge Crossing
        const onGrandBridge = Math.abs(activeVeh.position.z - (-10)) < 4.2 && activeVeh.position.x >= 22 && activeVeh.position.x <= 68;

        // Automated Cinematic Moment B: Sunset Cliff Horizon Vista
        const nearSunsetCliff = activeVeh.position.z < -95;

        // Automated Idle Beauty Cam
        if (isDriving || Math.abs(speed) > 0.4 || camState.isDragging) {
          camState.idleTimer = 0;
        } else {
          camState.idleTimer = (camState.idleTimer || 0) + delta;
        }
        const isIdleOrbit = (camState.idleTimer > 3.8);

        if (currentCamMode === 'hood') {
          // Camera Mode 3: Cockpit Hood Cam (First-Person Bonnet View)
          const targetLook = new THREE.Vector3(
            activeVeh.position.x + fwdX * 28.0,
            activeVeh.position.y + (isCar ? 0.88 : 1.35),
            activeVeh.position.z + fwdZ * 28.0
          );
          camState.lookTarget.lerp(targetLook, 1.0 - Math.exp(-22.0 * delta));

          const desiredCamPos = new THREE.Vector3(
            activeVeh.position.x + fwdX * (isCar ? 0.55 : 0.2),
            activeVeh.position.y + (isCar ? 0.95 : 1.45),
            activeVeh.position.z + fwdZ * (isCar ? 0.55 : 0.2)
          );
          camState.camPos.lerp(desiredCamPos, 1.0 - Math.exp(-24.0 * delta));

          const targetFOV = 68.0 + (activeVeh.isBoosting && activeVeh.isBoosting() ? 14.0 : speedRatio * 8.0);
          camState.currentFOV = THREE.MathUtils.lerp(camState.currentFOV, targetFOV, 1.0 - Math.exp(-9.0 * delta));

        } else if (currentCamMode === 'wheel') {
          // Camera Mode 4: Action Wheel Cam (Low-slung asphalt ground rush alongside front wheel)
          const sideOffset = isCar ? -1.65 : -0.85;
          const fwdOffset = isCar ? 0.95 : 0.55;
          const heightOffset = isCar ? 0.52 : 0.62;

          const desiredCamPos = new THREE.Vector3(
            activeVeh.position.x + rightX * sideOffset + fwdX * fwdOffset,
            Math.max(0.25, activeVeh.position.y + heightOffset),
            activeVeh.position.z + rightZ * sideOffset + fwdZ * fwdOffset
          );
          camState.camPos.lerp(desiredCamPos, 1.0 - Math.exp(-18.0 * delta));

          const targetLook = new THREE.Vector3(
            activeVeh.position.x + fwdX * 22.0 + rightX * (sideOffset * 0.2),
            activeVeh.position.y + 0.65,
            activeVeh.position.z + fwdZ * 22.0 + rightZ * (sideOffset * 0.2)
          );
          camState.lookTarget.lerp(targetLook, 1.0 - Math.exp(-20.0 * delta));

          const targetFOV = 70.0 + speedRatio * 12.0;
          camState.currentFOV = THREE.MathUtils.lerp(camState.currentFOV, targetFOV, 1.0 - Math.exp(-8.0 * delta));

        } else if (currentCamMode === 'topdown') {
          // Camera Mode 5: Helicopter Pursuit / Bird's Eye Tracking Cam
          const desiredCamPos = new THREE.Vector3(
            activeVeh.position.x - fwdX * 5.2,
            activeVeh.position.y + 12.5,
            activeVeh.position.z - fwdZ * 5.2
          );
          camState.camPos.lerp(desiredCamPos, 1.0 - Math.exp(-7.5 * delta));

          const targetLook = new THREE.Vector3(
            activeVeh.position.x + fwdX * 5.0,
            activeVeh.position.y + 0.4,
            activeVeh.position.z + fwdZ * 5.0
          );
          camState.lookTarget.lerp(targetLook, 1.0 - Math.exp(-10.0 * delta));

          camState.currentFOV = THREE.MathUtils.lerp(camState.currentFOV, 48.0, delta * 5.0);

        } else if (currentCamMode === 'rear') {
          // Camera Mode 6: Rear View Cam (Looking backwards over spoiler & exhaust)
          const desiredCamPos = new THREE.Vector3(
            activeVeh.position.x - fwdX * (isCar ? 0.45 : 0.3),
            activeVeh.position.y + (isCar ? 1.55 : 1.7),
            activeVeh.position.z - fwdZ * (isCar ? 0.45 : 0.3)
          );
          camState.camPos.lerp(desiredCamPos, 1.0 - Math.exp(-22.0 * delta));

          const targetLook = new THREE.Vector3(
            activeVeh.position.x - fwdX * 28.0,
            activeVeh.position.y + 1.15,
            activeVeh.position.z - fwdZ * 28.0
          );
          camState.lookTarget.lerp(targetLook, 1.0 - Math.exp(-22.0 * delta));

          const targetFOV = 64.0 + speedRatio * 6.0;
          camState.currentFOV = THREE.MathUtils.lerp(camState.currentFOV, targetFOV, 1.0 - Math.exp(-8.0 * delta));

        } else if (currentCamMode === 'cinematic' || isIdleOrbit) {
          // Camera Mode 7: Dynamic Director Drone Orbit / Idle Beauty Cam
          camState.cinematicAngle = (camState.cinematicAngle || 0) + delta * (isIdleOrbit ? 0.22 : 0.35);
          const orbitDist = isIdleOrbit ? 7.5 : 12.0;
          const orbitHeight = isIdleOrbit ? 2.2 : 3.8;

          const desiredCamPos = new THREE.Vector3(
            activeVeh.position.x + Math.sin(camState.cinematicAngle) * orbitDist,
            Math.max(1.2, activeVeh.position.y + orbitHeight),
            activeVeh.position.z + Math.cos(camState.cinematicAngle) * orbitDist
          );
          camState.camPos.lerp(desiredCamPos, 1.0 - Math.exp(-5.0 * delta));

          const targetLook = new THREE.Vector3(
            activeVeh.position.x,
            activeVeh.position.y + 1.1,
            activeVeh.position.z
          );
          camState.lookTarget.lerp(targetLook, 1.0 - Math.exp(-8.0 * delta));

          camState.currentFOV = THREE.MathUtils.lerp(camState.currentFOV, 56.0, delta * 4.0);

        } else {
          // Camera Modes 1 & 2: NFS Close Chase & GTA Far Chase with Automated Moments
          const isClose = currentCamMode === 'close';
          const posLag = isClose ? 10.0 : 8.2;
          const lookLag = 14.0;

          let baseDist = isClose ? (isCar ? 5.2 : 4.4) : (isCar ? 8.2 : 6.8);
          let camHeight = isClose ? (isCar ? 2.1 : 1.9) : (isCar ? 3.4 : 2.8);
          let lookAheadDist = (isClose ? (isCar ? 3.0 : 2.4) : (isCar ? 4.8 : 3.6)) * (0.8 + 0.2 * speedRatio);
          let lookHeight = 1.1;
          let baseFOV = isClose ? 58.0 : 54.0;
          let speedFOVBonus = isClose ? 12.0 : 9.0;
          let nitroFOVBonus = (activeVeh.isBoosting && activeVeh.isBoosting()) ? 12.0 : 0.0;

          // Moment A: Grand Suspension Bridge Low-Angle Side-Tracking
          let momentAngleOffset = 0;
          if (onGrandBridge) {
            momentAngleOffset = 0.55;
            baseDist = 8.5;
            camHeight = 2.4;
            lookAheadDist = 5.5;
            baseFOV = 62.0;
          }

          // Moment B: Sunset Cliff Horizon Vista
          if (nearSunsetCliff) {
            camHeight = 1.6;
            lookAheadDist = 6.0;
            baseFOV = 66.0;
          }

          // Free-look auto-centering
          const timeSinceLook = (now - camState.lastLookTime) / 1000.0;
          if (!camState.isDragging) {
            if (isDriving || speedRatio > 0.05) {
              camState.freeLookYaw = THREE.MathUtils.lerp(camState.freeLookYaw, 0, delta * 5.0);
              camState.freeLookPitch = THREE.MathUtils.lerp(camState.freeLookPitch, 0, delta * 5.0);
            } else if (timeSinceLook > 0.75) {
              camState.freeLookYaw = THREE.MathUtils.lerp(camState.freeLookYaw, 0, delta * 2.5);
              camState.freeLookPitch = THREE.MathUtils.lerp(camState.freeLookPitch, 0, delta * 2.5);
            }
          }

          const targetLook = new THREE.Vector3(
            activeVeh.position.x + fwdX * lookAheadDist,
            activeVeh.position.y + lookHeight,
            activeVeh.position.z + fwdZ * lookAheadDist
          );
          camState.lookTarget.lerp(targetLook, 1.0 - Math.exp(-lookLag * delta));

          const chaseAngle = heading + Math.PI + camState.freeLookYaw + momentAngleOffset;
          const currentDist = baseDist + speedRatio * (isClose ? 1.0 : 1.6);
          const cosPitch = Math.cos(camState.freeLookPitch);
          const sinPitch = Math.sin(camState.freeLookPitch);

          let desiredX = activeVeh.position.x + Math.sin(chaseAngle) * currentDist * cosPitch;
          let desiredY = Math.max(0.6, activeVeh.position.y + camHeight + sinPitch * currentDist * 0.7);
          let desiredZ = activeVeh.position.z + Math.cos(chaseAngle) * currentDist * cosPitch;

          const desiredCamPos = new THREE.Vector3(desiredX, desiredY, desiredZ);
          camState.camPos.lerp(desiredCamPos, 1.0 - Math.exp(-posLag * delta));

          const targetFOV = baseFOV + Math.pow(speedRatio, 1.3) * speedFOVBonus + nitroFOVBonus;
          camState.currentFOV = THREE.MathUtils.lerp(camState.currentFOV, targetFOV, 1.0 - Math.exp(-7.0 * delta));
        }

        camera.fov = camState.currentFOV;
        camera.updateProjectionMatrix();
        camera.position.copy(camState.camPos);
        camera.lookAt(camState.lookTarget);

        // Subtle Dutch Angle on High-G Steering
        const steerAmount = activeVeh.steering || 0;
        const targetRoll = -steerAmount * speedRatio * 0.04;
        camState.currentRoll = THREE.MathUtils.lerp(camState.currentRoll, targetRoll, delta * 8.0);
        camera.rotation.z += camState.currentRoll;

        sunLight.target.position.copy(camState.lookTarget);
      } else {
        // Camera Mode 8: Satellite Drone Orbit (High-Altitude Free Map View)
        const satelliteCenter = (activeVeh && activeVeh.position)
          ? new THREE.Vector3(activeVeh.position.x, activeVeh.position.y + 2.0, activeVeh.position.z).add(camState.panOffset)
          : new THREE.Vector3(0, 10.0, 0).add(camState.panOffset);
        camState.lookTarget.lerp(satelliteCenter, delta * 5.0);

        const sinPhi = Math.sin(camState.orbitPhi);
        const cosPhi = Math.cos(camState.orbitPhi);
        const sinTheta = Math.sin(camState.orbitTheta);
        const cosTheta = Math.cos(camState.orbitTheta);

        const satX = camState.lookTarget.x + camState.orbitRadius * sinPhi * sinTheta;
        const satY = Math.max(12.0, camState.lookTarget.y + camState.orbitRadius * cosPhi);
        const satZ = camState.lookTarget.z + camState.orbitRadius * sinPhi * cosTheta;

        const satDesired = new THREE.Vector3(satX, satY, satZ);
        camState.camPos.lerp(satDesired, 1.0 - Math.exp(-6.0 * delta));

        camera.fov = THREE.MathUtils.lerp(camera.fov, 48.0, delta * 5.0);
        camera.updateProjectionMatrix();

        camera.position.copy(camState.camPos);
        camera.lookAt(camState.lookTarget);
        sunLight.target.position.copy(camState.lookTarget);
      }

      if (skyDomeRef.current) {
        skyDomeRef.current.position.copy(camera.position);
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      if (carRef.current) carRef.current.destroy();
      if (bikeRef.current) bikeRef.current.destroy();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Time of Day Cycle Transition (Sunset / Night / Day)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (timeMode === 'sunset') {
      // Atmospheric Golden Hour (Matches User Reference Image across 500m map)
      scene.background.setHex(0x161828);
      scene.fog.color.setHex(0x282035);
      scene.fog.density = 0.0007;

      if (skyDomeRef.current) skyDomeRef.current.material.color.setHex(0xffffff);
      if (sunLightRef.current) {
        sunLightRef.current.color.setHex(0xffaa5e);
        sunLightRef.current.intensity = 2.4;
        sunLightRef.current.position.set(-50, 46, -140);
      }
      if (ambientLightRef.current) {
        ambientLightRef.current.color.setHex(0x5a6375);
        ambientLightRef.current.intensity = 0.95;
      }
      if (hemiLightRef.current) {
        hemiLightRef.current.color.setHex(0xffddbb);
        hemiLightRef.current.groundColor.setHex(0x2d4022);
        hemiLightRef.current.intensity = 0.9;
      }
      if (fillLightRef.current) fillLightRef.current.intensity = 0.55;
      if (moonLightRef.current) moonLightRef.current.intensity = 0.15;
    } else if (timeMode === 'night') {
      // Midnight Twilight
      scene.background.setHex(0x070b16);
      scene.fog.color.setHex(0x070b16);
      scene.fog.density = 0.0025;

      if (skyDomeRef.current) skyDomeRef.current.material.color.setHex(0x182035);
      if (sunLightRef.current) sunLightRef.current.intensity = 0.05;
      if (ambientLightRef.current) {
        ambientLightRef.current.color.setHex(0x0f172a);
        ambientLightRef.current.intensity = 0.35;
      }
      if (hemiLightRef.current) hemiLightRef.current.intensity = 0.25;
      if (fillLightRef.current) fillLightRef.current.intensity = 0.1;
      if (moonLightRef.current) moonLightRef.current.intensity = 0.6;
    } else {
      // Crisp Morning Daylight
      scene.background.setHex(0x60a5fa);
      scene.fog.color.setHex(0x7dd3fc);
      scene.fog.density = 0.0018;

      if (skyDomeRef.current) skyDomeRef.current.material.color.setHex(0x88ccff);
      if (sunLightRef.current) {
        sunLightRef.current.color.setHex(0xfffbeb);
        sunLightRef.current.intensity = 2.2;
        sunLightRef.current.position.set(65, 85, -65);
      }
      if (ambientLightRef.current) {
        ambientLightRef.current.color.setHex(0xe0f2fe);
        ambientLightRef.current.intensity = 1.0;
      }
      if (hemiLightRef.current) {
        hemiLightRef.current.color.setHex(0xbae6fd);
        hemiLightRef.current.groundColor.setHex(0x443322);
        hemiLightRef.current.intensity = 0.9;
      }
      if (fillLightRef.current) fillLightRef.current.intensity = 0.4;
      if (moonLightRef.current) moonLightRef.current.intensity = 0.0;
    }

    if (environmentRef.current) environmentRef.current.setNightMode(timeMode === 'night');
    if (carRef.current) carRef.current.setNightMode(timeMode === 'night');
    if (bikeRef.current) bikeRef.current.setNightMode(timeMode === 'night');
  }, [timeMode]);

  const cycleTimeMode = () => {
    setTimeMode((prev) => {
      if (prev === 'sunset') return 'night';
      if (prev === 'night') return 'day';
      return 'sunset';
    });
  };

  const selectVehicleInWorld = (type) => {
    setActiveVehicleType(type);
    if (type === 'bicycle' && bikeRef.current) {
      activeVehicleRef.current = bikeRef.current;
    } else if (carRef.current) {
      activeVehicleRef.current = carRef.current;
    }
  };

  const handleReset = () => {
    const startY = getSurfaceHeight(0.0, -30.0);
    if (carRef.current) carRef.current.reset(0.0, -30.0, Math.PI);
    if (bikeRef.current) bikeRef.current.reset(-14.0, -25.0);
    const camState = cameraStateRef.current;
    camState.camPos.set(0.0, startY + 2.4, -22.5);
    camState.lookTarget.set(0.0, startY + 1.2, -45.0);
    camState.freeLookYaw = 0;
    camState.freeLookPitch = 0;
    camState.idleTimer = 0;
  };

  const selectCameraMode = (modeId) => {
    const modeObj = CAMERA_MODES.find(m => m.id === modeId);
    if (!modeObj) return;
    setCameraMode(modeId);
    cameraModeRef.current = modeId;
    setCameraToast(modeObj);
    if (cameraToastTimeoutRef.current) clearTimeout(cameraToastTimeoutRef.current);
    cameraToastTimeoutRef.current = setTimeout(() => {
      setCameraToast(null);
    }, 2200);
  };

  const toggleCameraMode = () => {
    setCameraMode((prev) => {
      const currentIndex = CAMERA_MODES.findIndex(m => m.id === prev);
      const nextIndex = (currentIndex + 1) % CAMERA_MODES.length;
      const nextMode = CAMERA_MODES[nextIndex];
      cameraModeRef.current = nextMode.id;
      setCameraToast(nextMode);
      if (cameraToastTimeoutRef.current) clearTimeout(cameraToastTimeoutRef.current);
      cameraToastTimeoutRef.current = setTimeout(() => {
        setCameraToast(null);
      }, 2200);
      return nextMode.id;
    });
  };

  if (typeof window !== 'undefined') {
    window.__setCameraMode = selectCameraMode;
    window.__toggleCameraMode = toggleCameraMode;
  }

  const handlePointerDown = (e) => {
    if (!e.target.closest('.camera-dropdown-wrapper')) {
      setShowCameraMenu(false);
    }
    if (e.target.closest('button') || e.target.closest('.discovery-badge') || e.target.closest('.tactical-radar')) return;

    const camState = cameraStateRef.current;
    camState.isDragging = true;
    camState.dragButton = e.button;
    camState.lastMouseX = e.clientX;
    camState.lastMouseY = e.clientY;
    camState.lastLookTime = performance.now();
  };

  const handlePointerMove = (e) => {
    const camState = cameraStateRef.current;
    if (!camState.isDragging) return;

    const deltaX = e.clientX - camState.lastMouseX;
    const deltaY = e.clientY - camState.lastMouseY;
    camState.lastMouseX = e.clientX;
    camState.lastMouseY = e.clientY;
    camState.lastLookTime = performance.now();

    if (cameraMode !== 'satellite') {
      camState.freeLookYaw -= deltaX * 0.0055;
      camState.freeLookPitch = THREE.MathUtils.clamp(
        camState.freeLookPitch - deltaY * 0.0045,
        -0.22,
        0.65
      );
    } else {
      if (camState.dragButton === 0 && !e.shiftKey && !e.altKey) {
        camState.orbitTheta -= deltaX * 0.006;
        camState.orbitPhi = THREE.MathUtils.clamp(
          camState.orbitPhi - deltaY * 0.006,
          0.15,
          1.35
        );
      } else if (camState.dragButton === 2 || camState.dragButton === 1 || e.shiftKey || e.altKey) {
        const panSpeed = camState.orbitRadius * 0.0012;
        const forwardX = Math.sin(camState.orbitTheta);
        const forwardZ = Math.cos(camState.orbitTheta);
        const rightX = Math.cos(camState.orbitTheta);
        const rightZ = -Math.sin(camState.orbitTheta);

        camState.panOffset.x += (-rightX * deltaX + forwardX * deltaY) * panSpeed;
        camState.panOffset.z += (-rightZ * deltaX + forwardZ * deltaY) * panSpeed;
      }
    }
  };

  const handlePointerUp = () => {
    const camState = cameraStateRef.current;
    camState.isDragging = false;
    camState.lastLookTime = performance.now();
  };

  const handleWheel = (e) => {
    if (e.target.closest('.discovery-badge') || e.target.closest('.tactical-radar')) return;
    const camState = cameraStateRef.current;
    if (cameraMode === 'satellite') {
      camState.orbitRadius = THREE.MathUtils.clamp(
        camState.orbitRadius + e.deltaY * 0.05,
        25.0,
        240.0
      );
    }
  };

  const handleOpenDiscovery = () => {
    if (!activeZone) return;
    // Park vehicle and zero driving inputs while modal is open
    inputRef.current.forward = false;
    inputRef.current.backward = false;
    inputRef.current.left = false;
    inputRef.current.right = false;
    inputRef.current.nitro = false;
    inputRef.current.drift = false;

    if (activeZone.type === 'resume' || activeZone.category) {
      setVillageModalSection(activeZone.category || 'about');
      setIsVillageModalOpen(true);
    } else if (activeZone.type === 'story') {
      setVillageModalSection('about');
      setIsVillageModalOpen(true);
    } else if (activeZone.slug && onSelectProject) {
      onSelectProject(activeZone.slug);
    } else if (onToggleClassicView) {
      onToggleClassicView();
    }
  };

  // Landmark Radar Blip points across the Enlarged 500x500 Map
  const radarLandmarks = [
    { name: "About Lodge", x: -20, z: -35, color: '#38bdf8' },
    { name: "Skills Forge", x: -55, z: 12, color: '#f59e0b' },
    { name: "Experience Tavern", x: 42, z: 48, color: '#10b981' },
    { name: "Projects Manor", x: 92, z: 32, color: '#a855f7' },
    { name: "Publications Scriptorium", x: 84, z: -48, color: '#06b6d4' },
    { name: "Certificates Academy", x: -80, z: -38, color: '#ec4899' },
    { name: "Contact Posthouse", x: -16, z: 30, color: '#eab308' },
    { name: "Sunset Cliff Lookout", x: 0, z: -114, color: '#f97316' }
  ];

  const currentCameraObj = CAMERA_MODES.find(m => m.id === cameraMode) || CAMERA_MODES[0];

  return (
    <div 
      className="bruno-world-container"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ─── 1. TOP MINIMALIST HUD HEADER ─── */}
      <header className="bruno-hud-header">
        <div className="hud-left-group">
          {/* Vehicle Switcher */}
          <button 
            className="hud-btn"
            onClick={() => selectVehicleInWorld(activeVehicleType === 'car' ? 'bicycle' : 'car')}
            title={activeVehicleType === 'bicycle' ? 'Switch to Sports Car (V)' : 'Switch to Bicycle & Rider (V)'}
          >
            {activeVehicleType === 'bicycle' ? <Bike size={18} /> : <Car size={18} />}
            <span className="hud-label-text">{activeVehicleType === 'bicycle' ? 'Bicycle' : 'Sports Car'}</span>
          </button>
        </div>

        <div className="hud-right-group">
          {/* Atmosphere Toggle (Sunset / Night / Day) */}
          <button 
            className="hud-btn"
            onClick={cycleTimeMode}
            title={`Atmosphere: ${timeMode.toUpperCase()} (N)`}
          >
            {timeMode === 'sunset' && <Sunset size={18} color="#f97316" />}
            {timeMode === 'night' && <Moon size={18} color="#93c5fd" />}
            {timeMode === 'day' && <Sun size={18} color="#fbbf24" />}
            <span className="hud-label-text capitalize">{timeMode}</span>
          </button>

          {/* Camera View Switcher with Dropdown Angles Palette */}
          <div className="camera-dropdown-wrapper">
            <button 
              className={`hud-btn ${showCameraMenu ? 'hud-btn-active' : ''}`}
              onClick={() => setShowCameraMenu(prev => !prev)}
              title="Camera Angles (C or Keys 1-8)"
            >
              <Camera size={16} />
              <span className="hud-label-text">
                {currentCameraObj ? `${currentCameraObj.key} · ${currentCameraObj.label}` : 'Camera'}
              </span>
              <ChevronDown size={14} className={`cam-chevron ${showCameraMenu ? 'open' : ''}`} />
            </button>

            {/* Quick Camera Angles Palette */}
            {showCameraMenu && (
              <div className="camera-angles-palette">
                <div className="cam-palette-header">
                  <span>SELECT CAMERA ANGLE</span>
                  <span className="cam-palette-tip">Keys 1 - 8 / Tap C</span>
                </div>
                <div className="cam-palette-grid">
                  {CAMERA_MODES.map((m) => {
                    const isActive = cameraMode === m.id;
                    return (
                      <button
                        key={m.id}
                        className={`cam-palette-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          selectCameraMode(m.id);
                          setShowCameraMenu(false);
                        }}
                      >
                        <span className="cam-item-key">{m.key}</span>
                        <span className="cam-item-name">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reset Position */}
          <button 
            className="hud-btn"
            onClick={handleReset}
            title="Reset Position (R)"
          >
            <RotateCcw size={18} />
          </button>

          {/* Exit to Gateway */}
          <button 
            className="hud-btn hud-btn-primary"
            onClick={onExitToGateway || onToggleClassicView}
            title="Exit 3D World"
          >
            <LogOut size={16} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* ─── CINEMATIC CAMERA ANGLE SWITCH TOAST BADGE ─── */}
      {cameraToast && (
        <div className="camera-toast-badge">
          <div className="cam-toast-inner">
            <span className="cam-shutter-dot" />
            <Camera size={14} className="text-[#f59e0b]" />
            <span className="cam-toast-badge-pill">CAM 0{cameraToast.key}</span>
            <span className="cam-toast-title">{cameraToast.label}</span>
            <span className="cam-toast-desc">— {cameraToast.desc}</span>
          </div>
        </div>
      )}

      {/* ─── 2. TACTICAL RADAR MINIMAP (Option D) ─── */}
      <div className="tactical-radar-container">
        <div className="tactical-radar">
          <div className="radar-grid">
            <div className="radar-ring inner"></div>
            <div className="radar-ring mid"></div>
            <div className="radar-ring outer"></div>
            <div className="radar-crosshair-h"></div>
            <div className="radar-crosshair-v"></div>
          </div>

          {/* Landmark Blips */}
          {radarLandmarks.map((lm, idx) => {
            const relX = lm.x - vehPos.x;
            const relZ = lm.z - vehPos.z;
            const radarScale = 0.28; // Scaled for 500x500 map to fit 120px circular radar
            const rX = 60 + relX * radarScale;
            const rY = 60 + relZ * radarScale;
            const clampedX = Math.max(8, Math.min(112, rX));
            const clampedY = Math.max(8, Math.min(112, rY));

            return (
              <div 
                key={idx}
                className="radar-blip"
                style={{ 
                  left: `${clampedX}px`, 
                  top: `${clampedY}px`,
                  backgroundColor: lm.color,
                  boxShadow: `0 0 6px ${lm.color}`
                }}
                title={lm.name}
              />
            );
          })}

          {/* Player Vehicle Marker at Center */}
          <div 
            className="radar-player"
            style={{ transform: `translate(-50%, -50%) rotate(${vehHeading}rad)` }}
          >
            <div className="radar-player-arrow" />
          </div>

          <div className="radar-compass-n">N</div>
        </div>
      </div>

      {/* ─── 3. DIGITAL SPEEDOMETER & NITRO GAUGE (Option C) ─── */}
      <div className="speedometer-gauge-container">
        <div className="speedometer-box">
          <div className="speed-readout">
            <span className="speed-number">{currentSpeed}</span>
            <span className="speed-unit">KM/H</span>
          </div>

          {/* Nitro Boost Bar */}
          <div className={`nitro-bar-wrapper ${isBoosting ? 'nitro-active' : ''}`}>
            <div className="nitro-label">
              <Zap size={12} className={isBoosting ? 'animate-pulse text-cyan-400' : 'text-amber-400'} />
              <span>NOS</span>
            </div>
            <div className="nitro-track">
              <div 
                className="nitro-fill"
                style={{ width: `${nitroPercent}%` }}
              />
            </div>
            <span className="nitro-val">{nitroPercent}%</span>
          </div>
        </div>
      </div>

      {/* ─── 4. DESKTOP KEYBOARD CONTROLS GUIDE RIBBON ─── */}
      <div className="controls-guide-ribbon">
        <span className="guide-pill"><b>WASD</b> Drive</span>
        <span className="guide-pill"><b>Shift</b> Nitro</span>
        <span className="guide-pill"><b>Space</b> Drift</span>
        <span className="guide-pill"><b>Enter</b> Inspect</span>
        <span className="guide-pill"><b>C</b> / <b>1-8</b> Camera</span>
        <span className="guide-pill"><b>V</b> Vehicle</span>
        <span className="guide-pill"><b>N</b> Sky</span>
        <span className="guide-pill"><b>R</b> Reset</span>
      </div>

      {/* ─── 5. THEMATIC DISCOVERY NOTIFICATION POPUP (Option D) ─── */}
      {activeZone && !isVillageModalOpen && (
        <div className="discovery-badge-container">
          <div className="discovery-badge">
            <div className="discovery-header">
              <span className="discovery-tag">
                <Sparkles size={13} style={{ marginRight: 4 }} />
                {activeZone.tag}
              </span>
              <span className="discovery-zone-name">{activeZone.name}</span>
            </div>

            <h3 className="discovery-title">{activeZone.title}</h3>
            <p className="discovery-desc">{activeZone.desc}</p>

            <div className="discovery-actions">
              <button 
                className="discovery-action-btn primary enter-blink-action"
                onClick={handleOpenDiscovery}
              >
                <span className="enter-key-pill">ENTER</span>
                <span>Open {activeZone.tag || 'Details'}</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. MOBILE ON-SCREEN CONTROLS ─── */}
      <div className="mobile-controls-layer">
        <div className="mobile-dpad-left">
          <button 
            className="ctrl-btn steer-btn"
            onPointerDown={(e) => { e.preventDefault(); inputRef.current.left = true; }}
            onPointerUp={(e) => { e.preventDefault(); inputRef.current.left = false; }}
            onPointerLeave={() => { inputRef.current.left = false; }}
            title="Steer Left"
          >
            ◀
          </button>
          <button 
            className="ctrl-btn steer-btn"
            onPointerDown={(e) => { e.preventDefault(); inputRef.current.right = true; }}
            onPointerUp={(e) => { e.preventDefault(); inputRef.current.right = false; }}
            onPointerLeave={() => { inputRef.current.right = false; }}
            title="Steer Right"
          >
            ▶
          </button>
        </div>

        <div className="mobile-dpad-right">
          <button 
            className="ctrl-btn nitro-btn"
            onPointerDown={(e) => { e.preventDefault(); inputRef.current.nitro = true; }}
            onPointerUp={(e) => { e.preventDefault(); inputRef.current.nitro = false; }}
            onPointerLeave={() => { inputRef.current.nitro = false; }}
            title="Nitro Boost"
          >
            ⚡
          </button>
          <button 
            className="ctrl-btn drift-btn"
            onPointerDown={(e) => { e.preventDefault(); inputRef.current.drift = true; }}
            onPointerUp={(e) => { e.preventDefault(); inputRef.current.drift = false; }}
            onPointerLeave={() => { inputRef.current.drift = false; }}
            title="Drift"
          >
            🌀
          </button>
          <button 
            className="ctrl-btn accel-btn"
            onPointerDown={(e) => { e.preventDefault(); inputRef.current.forward = true; }}
            onPointerUp={(e) => { e.preventDefault(); inputRef.current.forward = false; }}
            onPointerLeave={() => { inputRef.current.forward = false; }}
            title="Drive Forward"
          >
            ▲
          </button>
          <button 
            className="ctrl-btn brake-btn"
            onPointerDown={(e) => { e.preventDefault(); inputRef.current.backward = true; }}
            onPointerUp={(e) => { e.preventDefault(); inputRef.current.backward = false; }}
            onPointerLeave={() => { inputRef.current.backward = false; }}
            title="Brake / Reverse"
          >
            ▼
          </button>
        </div>
      </div>

      {/* ─── 7. IMMERSIVE VILLAGE RESUME MODAL ─── */}
      {isVillageModalOpen && (
        <VillageResumeModal 
          initialSection={villageModalSection}
          onClose={() => setIsVillageModalOpen(false)}
          onSelectProject={(slug) => {
            setIsVillageModalOpen(false);
            if (onSelectProject) onSelectProject(slug);
          }}
        />
      )}
    </div>
  );
};

export default BrunoWorld;
