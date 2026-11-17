import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { 
  TERRAIN_SIZE, 
  SEGMENTS, 
  WATER_LEVEL, 
  RIVER_WATER_LEVEL,
  getHeightAt, 
  getRiverCenter,
  getEngineeredRoadGrade,
  createRealisticTerrainTextures 
} from './TerrainGenerator.js';
import { COLLISION_GROUPS } from './PhysicsEngine.js';

/**
 * Procedural Photorealistic 1024x1024 Asphalt Road Texture Generator
 * Features dark aggregate stone asphalt, realistic tire wear tracks,
 * crisp white outer boundary lines, dashed yellow center dividing lines with amber cat's eyes,
 * and beveled crushed gravel shoulder borders.
 */
function createAsphaltRoadTexture() {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Crushed Roadside Gravel Shoulders (outer 64px on each side)
  ctx.fillStyle = '#3f3a33';
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() < 0.5 ? Math.random() * 80 : 944 + Math.random() * 80;
    const ry = Math.random() * 1024;
    ctx.fillStyle = Math.random() < 0.5 ? '#554e44' : '#2d2924';
    ctx.fillRect(rx, ry, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  // 2. High-Grade Matte Dark Basalt Asphalt Deck (x: 64 to 960)
  ctx.fillStyle = '#1c2026';
  ctx.fillRect(64, 0, 896, 1024);

  // Subtle multi-scale mineral aggregate specks
  for (let i = 0; i < 9000; i++) {
    const x = 64 + Math.random() * 896;
    const y = Math.random() * 1024;
    const r = Math.random();
    ctx.fillStyle = r < 0.4 ? 'rgba(255, 255, 255, 0.045)' : (r < 0.8 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(217, 119, 6, 0.03)');
    ctx.fillRect(x, y, 2, 2);
  }

  // 3. Realistic Polished Wheel-Track Wear Paths (darker polished bitumen where tires roll)
  const drawWheelTrack = (cx, w) => {
    const grad = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    grad.addColorStop(0, 'rgba(18, 21, 26, 0)');
    grad.addColorStop(0.5, 'rgba(14, 16, 20, 0.55)');
    grad.addColorStop(1, 'rgba(18, 21, 26, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - w / 2, 0, w, 1024);
  };
  drawWheelTrack(210, 140);
  drawWheelTrack(390, 140);
  drawWheelTrack(634, 140);
  drawWheelTrack(814, 140);

  // 4. Solid Clean Reflective White Outer Shoulder Lines
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(84, 0, 18, 1024);
  ctx.fillRect(922, 0, 18, 1024);

  // 5. Double Dashed Golden Yellow Center Dividing Lines
  const dashLen = 160;
  const gapLen = 96;
  const period = dashLen + gapLen;
  ctx.fillStyle = '#f59e0b';

  for (let y = 0; y < 1024; y += period) {
    ctx.fillRect(494, y, 11, Math.min(dashLen, 1024 - y));
    ctx.fillRect(519, y, 11, Math.min(dashLen, 1024 - y));

    // Retroreflective Amber Road Marker Stud (Cat's Eye) in center of gap
    const markerY = y + dashLen + gapLen / 2;
    if (markerY < 1024) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(507, markerY - 4, 10, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(510, markerY - 2, 4, 4);
      ctx.fillStyle = '#f59e0b';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural Wooden Village Signpost Texture Generator
 * Features weathered dark oak woodgrain planks, gold inlay borders, corner brass rivets,
 * and carved golden serif lettering for the resume section titles.
 */
function createVillageSignTexture(title, subtitle) {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Weathered dark timber board
  ctx.fillStyle = '#22160d';
  ctx.fillRect(0, 0, 512, 256);

  // Border inlay
  ctx.strokeStyle = '#452b1a';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 492, 236);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(18, 18, 476, 220);

  // Subtle woodgrain texture
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = 2;
  for (let y = 25; y < 240; y += 12) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.bezierCurveTo(150, y + (Math.sin(y) * 4), 350, y - (Math.cos(y) * 4), 490, y);
    ctx.stroke();
  }

  // Corner brass rivets
  ctx.fillStyle = '#f59e0b';
  [[24, 24], [488, 24], [24, 232], [488, 232]].forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Main Section Title (Carved Warm Gold)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 42px "Cinzel", "Georgia", serif';
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.fillText(title, 256, 105);

  // Subtitle / Description
  if (subtitle) {
    ctx.font = '600 20px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fde68a';
    ctx.shadowBlur = 6;
    ctx.fillText(subtitle, 256, 168);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Realistic Mountain Dirt & Fine Gravel Trail Texture Generator
 * Warm golden-terracotta mountain earth matching user's reference picture.
 */
function createDirtTrailTexture() {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#9e6b43';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 15 + Math.random() * 35;
    const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
    const col = Math.random() < 0.5 ? 'rgba(184, 126, 82, 0.35)' : 'rgba(116, 68, 40, 0.4)';
    grad.addColorStop(0, col);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random();
    ctx.fillStyle = r < 0.4 ? '#c89a72' : (r < 0.75 ? '#653a1e' : '#dfb590');
    ctx.fillRect(x, y, 2 + Math.random() * 2, 2 + Math.random() * 2);
  }

  const pathGrad = ctx.createLinearGradient(0, 0, 512, 0);
  pathGrad.addColorStop(0, 'rgba(75, 45, 25, 0.45)');
  pathGrad.addColorStop(0.2, 'rgba(0, 0, 0, 0)');
  pathGrad.addColorStop(0.5, 'rgba(212, 163, 115, 0.25)');
  pathGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
  pathGrad.addColorStop(1, 'rgba(75, 45, 25, 0.45)');
  ctx.fillStyle = pathGrad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural Paved Plaza & Courtyard Asphalt Texture Generator
 * Solid dark basalt aggregate surface without lane stripes for roundabouts, stopping pads, and village aprons.
 */
function createPlazaAsphaltTexture() {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1c2026';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 7000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random();
    ctx.fillStyle = r < 0.4 ? 'rgba(255, 255, 255, 0.05)' : (r < 0.8 ? 'rgba(0, 0, 0, 0.09)' : 'rgba(217, 119, 6, 0.03)');
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Cinematic 500x500 Map Environment & Infrastructure
 * High-Performance (60 FPS, instant mount, zero CPU lockup):
 * - Enlarged 500x500 alpine continent with deep river gorge and waterfall
 * - Realistic animated mountain river with depth translucency & foam
 * - The Grand River Suspension Bridge with twin towers, catenary cables & road deck
 * - The Timber Trestle Valley Bridge in the pine forest
 * - Mountain Overpass Tunnel on the North Alpine Highway
 * - Photovoltaic Solar Array and Communications Mast near Windmill Summit
 * - The Iconic Sunset Cliff Precipice matching user's reference image
 * - Complete portfolio architecture & realistic pine forests
 */
export class LowPolyEnvironment {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;

    this.nightLights = [];
    this.windowMaterials = [];
    this.animatedProps = [];
    this.clouds = [];
    this.riverMesh = null;
    this.riverOrigY = [];

    this.initMaterials();
    this.createTerrainMesh();
    this.createRoadRibbons();
    this.createRealisticRiver();
    this.createGrandSuspensionBridge();
    this.createTimberTrestleBridge();
    this.createMountainOverpass();
    this.createSolarInfrastructure();
    this.createCloudOcean();
    this.createUtilityPolesAndCables();
    this.createVillageArchitecture();
    this.createSunsetCliffLookout();
    this.createWindmillLookout();
    this.createBouldersAndRocks();
    this.createFencesAndBarriers();
    this.createMeadowGrassTufts();
    this.createAlpinePines();
  }

  initMaterials() {
    const textureLoader = new THREE.TextureLoader();

    // 1. Realistic Repeating Alpine Grass for Continent
    const grassTex = textureLoader.load('/textures/realistic_grass.jpg');
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(65, 65);
    grassTex.colorSpace = THREE.SRGBColorSpace;

    // Smooth PBR Ground Material
    this.terrainMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.85,
      metalness: 0.04,
      flatShading: false
    });

    // 2. Realistic Terracotta Dirt Trail for Sunset Cliff
    this.dirtTrailMat = new THREE.MeshStandardMaterial({
      map: createDirtTrailTexture(),
      roughness: 0.94,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });

    // 3. Crisp Asphalt Road Ribbon Material with Painted Markings
    this.asphaltRoadMat = new THREE.MeshStandardMaterial({
      map: createAsphaltRoadTexture(),
      roughness: 0.78,
      metalness: 0.08,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });

    // 4. Solid Paved Plaza & Stopping Pad Asphalt (no yellow center stripes)
    this.plazaAsphaltMat = new THREE.MeshStandardMaterial({
      map: createPlazaAsphaltTexture(),
      roughness: 0.82,
      metalness: 0.06,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });

    // Realistic Translucent Mountain River Water
    this.waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a6285,
      emissive: 0x022536,
      emissiveIntensity: 0.32,
      roughness: 0.08,
      metalness: 0.18,
      transmission: 0.65,
      ior: 1.333,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });

    this.waterFoamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.82
    });

    // Structural Infrastructure Materials
    this.bridgeSteelMat = new THREE.MeshStandardMaterial({
      color: 0xc25e1a, // Golden Gate International Amber Bridge Steel
      roughness: 0.38,
      metalness: 0.72
    });

    this.bridgeConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Reinforced Slate Concrete Piers
      roughness: 0.88,
      metalness: 0.12
    });

    this.guardrailMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.85
    });

    this.solarPanelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x0284c7,
      emissiveIntensity: 0.18,
      roughness: 0.12,
      metalness: 0.92
    });

    // Cloud Materials (Warm Volumetric Sunset Cumulus matching reference artwork)
    this.cloudBaseMat = new THREE.MeshStandardMaterial({
      color: 0x483a54,
      emissive: 0x1f1629,
      emissiveIntensity: 0.32,
      roughness: 0.96,
      metalness: 0.0,
      transparent: true,
      opacity: 0.98,
      flatShading: false
    });

    this.cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x85390f,
      emissiveIntensity: 0.44,
      roughness: 0.90,
      metalness: 0.0,
      transparent: true,
      opacity: 0.97,
      flatShading: false
    });

    this.cloudHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xc25e1a,
      emissiveIntensity: 0.54,
      roughness: 0.84,
      metalness: 0.0,
      transparent: true,
      opacity: 0.98,
      flatShading: false
    });

    // Lush Cliff Meadow Grass Material (PBR with warm sunset sheen)
    this.grassTuftMat = new THREE.MeshStandardMaterial({
      color: 0x5a832e,
      roughness: 0.65,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    // Weathered Dark Timber & Stone
    this.weatheredWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1c,
      roughness: 0.88,
      metalness: 0.05
    });

    this.rusticPlankMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e26,
      roughness: 0.85,
      metalness: 0.05
    });

    this.darkRoofMat = new THREE.MeshStandardMaterial({
      color: 0x242830,
      roughness: 0.75,
      metalness: 0.12
    });

    this.stoneMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: true
    });

    this.darkBasaltMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true
    });

    // High-Tech Materials
    this.techMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      roughness: 0.35,
      metalness: 0.8
    });

    this.techPanelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.6
    });

    this.glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });

    this.glowingCyanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });

    this.glowingAmberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });

    this.windowMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xfb923c,
      emissiveIntensity: 0.75,
      roughness: 0.3
    });
    this.windowMaterials.push(this.windowMat);

    // Village Architecture, Facades, Awnings, Flowers & Sheep Materials
    this.whiteStuccoMat = new THREE.MeshStandardMaterial({
      color: 0xded8ce,
      roughness: 0.88,
      metalness: 0.04
    });

    this.terracottaAwningMat = new THREE.MeshStandardMaterial({
      color: 0xb94732,
      roughness: 0.72,
      metalness: 0.05
    });

    this.creamAwningMat = new THREE.MeshStandardMaterial({
      color: 0xf1ebe1,
      roughness: 0.8,
      metalness: 0.05
    });

    this.geraniumMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.6,
      metalness: 0.05
    });

    this.shrubMat = new THREE.MeshStandardMaterial({
      color: 0x2e4a23,
      roughness: 0.78,
      metalness: 0.05
    });

    this.woolSheepMat = new THREE.MeshStandardMaterial({
      color: 0xede8d0,
      roughness: 0.95,
      metalness: 0.02
    });

    this.darkSheepFaceMat = new THREE.MeshStandardMaterial({
      color: 0x242220,
      roughness: 0.9,
      metalness: 0.05
    });

    this.cableMat = new THREE.LineBasicMaterial({
      color: 0x1e2024,
      linewidth: 2
    });
  }

  createTerrainMesh() {
    const size = TERRAIN_SIZE;
    const segs = SEGMENTS;
    const geometry = new THREE.PlaneGeometry(size, size, segs, segs);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, getHeightAt(x, z));
    }

    geometry.computeVertexNormals();

    const terrainMesh = new THREE.Mesh(geometry, this.terrainMat);
    terrainMesh.name = "HighlandContinentTerrain";
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = false;
    this.scene.add(terrainMesh);
  }

  /**
   * Continuous 3D Road Network Ribbons draped smoothly over the terrain
   * Features crisp asphalt with markings for highways, and authentic terracotta dirt trail for Sunset Cliff
   */
  /**
   * Continuous 3D Road Network Ribbons draped smoothly over the terrain
   * Features crisp engineered asphalt highways, central roundabout, turnaround plazas,
   * beveled roadside shoulders, and authentic terracotta dirt trail for Sunset Cliff.
   */
  createRoadRibbons() {
    const roadGroup = new THREE.Group();
    roadGroup.name = "InfrastructureRoadNetwork";

    const buildRoadRibbon = (points, width, mat, vScale = 0.22) => {
      const curve = new THREE.CatmullRomCurve3(
        points.map(p => new THREE.Vector3(p.x, 0, p.z)),
        false,
        'catmullrom',
        0.25
      );
      const totalLen = curve.getLength();
      const numSteps = Math.max(8, Math.ceil(totalLen / 0.8));
      const sampledPoints = curve.getSpacedPoints(numSteps);

      const shoulderW = 0.65; // 65cm beveled gravel shoulder
      const totalVertices = sampledPoints.length * 4;
      const positions = new Float32Array(totalVertices * 3);
      const uvs = new Float32Array(totalVertices * 2);
      const indices = [];

      let accumDist = 0;
      for (let i = 0; i < sampledPoints.length; i++) {
        const cur = sampledPoints[i];
        if (i > 0) accumDist += cur.distanceTo(sampledPoints[i - 1]);

        let dx = 0, dz = 1;
        if (i < sampledPoints.length - 1) {
          dx = sampledPoints[i + 1].x - cur.x;
          dz = sampledPoints[i + 1].z - cur.z;
        } else {
          dx = cur.x - sampledPoints[i - 1].x;
          dz = cur.z - sampledPoints[i - 1].z;
        }
        const len = Math.hypot(dx, dz) || 1;
        const nx = -dz / len;
        const nz = dx / len;

        const roadCenterY = getEngineeredRoadGrade(cur.x, cur.z) + 0.12;
        const shoulderY = getEngineeredRoadGrade(cur.x, cur.z) + 0.02;

        const halfW = width / 2;
        const vBase = i * 4;

        // 0: Left outer shoulder
        positions[(vBase + 0) * 3]     = cur.x - nx * (halfW + shoulderW);
        positions[(vBase + 0) * 3 + 1] = shoulderY;
        positions[(vBase + 0) * 3 + 2] = cur.z - nz * (halfW + shoulderW);

        // 1: Left road edge
        positions[(vBase + 1) * 3]     = cur.x - nx * halfW;
        positions[(vBase + 1) * 3 + 1] = roadCenterY;
        positions[(vBase + 1) * 3 + 2] = cur.z - nz * halfW;

        // 2: Right road edge
        positions[(vBase + 2) * 3]     = cur.x + nx * halfW;
        positions[(vBase + 2) * 3 + 1] = roadCenterY;
        positions[(vBase + 2) * 3 + 2] = cur.z + nz * halfW;

        // 3: Right outer shoulder
        positions[(vBase + 3) * 3]     = cur.x + nx * (halfW + shoulderW);
        positions[(vBase + 3) * 3 + 1] = shoulderY;
        positions[(vBase + 3) * 3 + 2] = cur.z + nz * (halfW + shoulderW);

        // UV mapping
        const vCoord = accumDist * vScale;
        uvs[(vBase + 0) * 2]     = 0.0;
        uvs[(vBase + 0) * 2 + 1] = vCoord;

        uvs[(vBase + 1) * 2]     = 0.065;
        uvs[(vBase + 1) * 2 + 1] = vCoord;

        uvs[(vBase + 2) * 2]     = 0.935;
        uvs[(vBase + 2) * 2 + 1] = vCoord;

        uvs[(vBase + 3) * 2]     = 1.0;
        uvs[(vBase + 3) * 2 + 1] = vCoord;

        if (i < sampledPoints.length - 1) {
          indices.push(vBase, vBase + 1, vBase + 4);
          indices.push(vBase + 1, vBase + 5, vBase + 4);

          indices.push(vBase + 1, vBase + 2, vBase + 5);
          indices.push(vBase + 2, vBase + 6, vBase + 5);

          indices.push(vBase + 2, vBase + 3, vBase + 6);
          indices.push(vBase + 3, vBase + 7, vBase + 6);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      return mesh;
    };

    // Helper to build a paved circular turnaround plaza
    const buildTurnaroundPlaza = (cx, cz, radius, mat) => {
      const plazaGroup = new THREE.Group();
      const segs = 36;
      const roadY = getEngineeredRoadGrade(cx, cz) + 0.12;

      const diskGeo = new THREE.CircleGeometry(radius, segs);
      diskGeo.rotateX(-Math.PI / 2);
      const diskMesh = new THREE.Mesh(diskGeo, mat);
      diskMesh.position.set(cx, roadY, cz);
      diskMesh.receiveShadow = true;
      plazaGroup.add(diskMesh);

      const curbGeo = new THREE.RingGeometry(radius, radius + 0.6, segs);
      curbGeo.rotateX(-Math.PI / 2);
      const curbMesh = new THREE.Mesh(curbGeo, this.stoneMat);
      curbMesh.position.set(cx, roadY + 0.04, cz);
      plazaGroup.add(curbMesh);

      return plazaGroup;
    };

    // Helper to build Central Interchange Roundabout
    const buildRoundabout = (cx, cz, outerR, innerR, mat) => {
      const roGroup = new THREE.Group();
      const segs = 48;
      const roadY = getEngineeredRoadGrade(cx, cz) + 0.12;

      const ringGeo = new THREE.RingGeometry(innerR, outerR, segs);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, mat);
      ringMesh.position.set(cx, roadY, cz);
      ringMesh.receiveShadow = true;
      roGroup.add(ringMesh);

      const curbGeo = new THREE.RingGeometry(innerR - 0.45, innerR, segs);
      curbGeo.rotateX(-Math.PI / 2);
      const curbMesh = new THREE.Mesh(curbGeo, this.stoneMat);
      curbMesh.position.set(cx, roadY + 0.08, cz);
      roGroup.add(curbMesh);

      const grassGeo = new THREE.CircleGeometry(innerR - 0.45, segs);
      grassGeo.rotateX(-Math.PI / 2);
      const grassMesh = new THREE.Mesh(grassGeo, this.terrainMat);
      grassMesh.position.set(cx, roadY + 0.06, cz);
      grassMesh.receiveShadow = true;
      roGroup.add(grassMesh);

      return roGroup;
    };

    // 1. Central Interchange Roundabout (Solid dark basalt aggregate ring, no striped warping)
    roadGroup.add(buildRoundabout(0, 0, 15.5, 7.5, this.plazaAsphaltMat));

    // 2. South Sunset Highway (Paved Two-Lane Highway from Central Interchange down to Sunset Overlook)
    roadGroup.add(buildRoadRibbon([
      { x: 0, z: -14.5 },
      { x: 0, z: -40.0 },
      { x: 0, z: -70.0 },
      { x: 0, z: -98.0 }
    ], 6.0, this.asphaltRoadMat, 0.22));

    // 3. Sunset Cliff Overlook Turnaround Plaza
    roadGroup.add(buildTurnaroundPlaza(0, -98.0, 9.5, this.plazaAsphaltMat));

    // 4. Scenic Walking Footpath to Developer Cliff Lookout (matching reference photo)
    roadGroup.add(buildRoadRibbon([
      { x: 0, z: -98.0 },
      { x: -0.2, z: -106.0 },
      { x: 0, z: -114.5 }
    ], 2.8, this.dirtTrailMat, 0.18));

    // 5. East Tech Highway (West Approach to Grand Suspension Bridge)
    roadGroup.add(buildRoadRibbon([
      { x: 14.5, z: 0 },
      { x: 18.0, z: -4.5 },
      { x: 22.0, z: -10.0 }
    ], 6.0, this.asphaltRoadMat, 0.22));

    // 6. East Tech Highway Beyond Suspension Bridge (Fork to AI Campus & Vector Vault)
    roadGroup.add(buildRoadRibbon([
      { x: 68.0, z: -10.0 },
      { x: 78.0, z: 2.0 },
      { x: 88.0, z: 16.0 },
      { x: 95.0, z: 30.0 }
    ], 6.0, this.asphaltRoadMat, 0.22));

    roadGroup.add(buildRoadRibbon([
      { x: 68.0, z: -10.0 },
      { x: 76.0, z: -25.0 },
      { x: 90.0, z: -50.0 }
    ], 5.6, this.asphaltRoadMat, 0.22));

    // 7. Timber Bridge Scenic Forest Loop (Valley Route through Pine Forest)
    roadGroup.add(buildRoadRibbon([
      { x: 22.0, z: -10.0 },
      { x: 28.0, z: 18.0 },
      { x: 42.0, z: 42.0 },
      { x: 70.0, z: 58.0 }
    ], 5.6, this.asphaltRoadMat, 0.22));

    roadGroup.add(buildRoadRibbon([
      { x: 104.0, z: 58.0 },
      { x: 102.0, z: 44.0 },
      { x: 95.0, z: 30.0 }
    ], 5.6, this.asphaltRoadMat, 0.22));

    // 8. West Industrial Parkway (To Data Pipeline Station & QA Lab)
    roadGroup.add(buildRoadRibbon([
      { x: -14.5, z: 0 },
      { x: -30.0, z: 2.0 },
      { x: -50.0, z: 5.0 }
    ], 6.0, this.asphaltRoadMat, 0.22));

    roadGroup.add(buildRoadRibbon([
      { x: -50.0, z: 5.0 },
      { x: -75.0, z: 16.0 },
      { x: -100.0, z: 25.0 }
    ], 5.6, this.asphaltRoadMat, 0.22));

    roadGroup.add(buildRoadRibbon([
      { x: -50.0, z: 5.0 },
      { x: -70.0, z: -18.0 },
      { x: -90.0, z: -40.0 }
    ], 5.6, this.asphaltRoadMat, 0.22));

    // 9. North Alpine Mountain Pass (Through Mountain Overpass to Windmill Summit)
    roadGroup.add(buildRoadRibbon([
      { x: 0, z: 14.5 },
      { x: 0, z: 40.0 },
      { x: 0, z: 65.0 }
    ], 6.0, this.asphaltRoadMat, 0.22));

    roadGroup.add(buildRoadRibbon([
      { x: 0, z: 65.0 },
      { x: 16.0, z: 88.0 },
      { x: 18.0, z: 105.0 },
      { x: -10.0, z: 120.0 },
      { x: 0, z: 133.0 }
    ], 5.6, this.asphaltRoadMat, 0.22));

    roadGroup.add(buildTurnaroundPlaza(0, 134.0, 9.0, this.plazaAsphaltMat));

    // 10. Village Resume Section Access Roads & Arrival Turnaround Pads
    // 10a. About Lodge Access Lane (from South Highway shoulder to Lodge pad)
    roadGroup.add(buildRoadRibbon([
      { x: -3.0, z: -35.0 },
      { x: -10.0, z: -35.0 },
      { x: -20.0, z: -35.0 }
    ], 5.0, this.asphaltRoadMat, 0.22));
    roadGroup.add(buildTurnaroundPlaza(-20.0, -35.0, 5.8, this.plazaAsphaltMat));

    // Paved junction fillet connecting South Highway shoulder to About Lane
    const aboutJuncGeo = new THREE.PlaneGeometry(3.6, 6.4);
    aboutJuncGeo.rotateX(-Math.PI / 2);
    const aboutJuncMesh = new THREE.Mesh(aboutJuncGeo, this.plazaAsphaltMat);
    aboutJuncMesh.position.set(-3.0, getEngineeredRoadGrade(-3.0, -35.0) + 0.122, -35.0);
    aboutJuncMesh.receiveShadow = true;
    roadGroup.add(aboutJuncMesh);

    // 10b. Skills Forge Access Lane (from West Parkway to Forge pad)
    roadGroup.add(buildRoadRibbon([
      { x: -50.0, z: 5.0 },
      { x: -52.5, z: 8.5 },
      { x: -55.0, z: 12.0 }
    ], 5.0, this.asphaltRoadMat, 0.22));
    roadGroup.add(buildTurnaroundPlaza(-55.0, 12.0, 6.0, this.plazaAsphaltMat));

    // 10c. Experience Tavern Courtyard Pad (on the Timber Bridge Scenic Loop)
    roadGroup.add(buildTurnaroundPlaza(42.0, 48.0, 6.2, this.plazaAsphaltMat));

    // 10d. Projects Innovation Manor Courtyard Pad
    roadGroup.add(buildTurnaroundPlaza(92.0, 32.0, 6.5, this.plazaAsphaltMat));

    // 10e. Publications Scriptorium Access Lane & Pad
    roadGroup.add(buildRoadRibbon([
      { x: 76.0, z: -25.0 },
      { x: 80.0, z: -36.0 },
      { x: 84.0, z: -48.0 }
    ], 5.0, this.asphaltRoadMat, 0.22));
    roadGroup.add(buildTurnaroundPlaza(84.0, -48.0, 6.0, this.plazaAsphaltMat));

    // 10f. Certificates Academy Access Lane & Pad
    roadGroup.add(buildRoadRibbon([
      { x: -70.0, z: -18.0 },
      { x: -75.0, z: -28.0 },
      { x: -80.0, z: -38.0 }
    ], 5.0, this.asphaltRoadMat, 0.22));
    roadGroup.add(buildTurnaroundPlaza(-80.0, -38.0, 6.0, this.plazaAsphaltMat));

    // 10g. Contact Courier Posthouse Access Lane & Pad
    roadGroup.add(buildRoadRibbon([
      { x: -14.5, z: 2.0 },
      { x: -15.5, z: 16.0 },
      { x: -16.0, z: 30.0 }
    ], 5.0, this.asphaltRoadMat, 0.22));
    roadGroup.add(buildTurnaroundPlaza(-16.0, 30.0, 6.0, this.plazaAsphaltMat));

    this.scene.add(roadGroup);
  }

  /**
   * Realistic Translucent Mountain River with Shimmering Waves & Waterfall
   */
  createRealisticRiver() {
    const riverGroup = new THREE.Group();
    riverGroup.name = "MountainRiverSystem";

    const slices = 80;
    const zStart = -165;
    const zEnd = 160;
    const halfWidth = 7.2;

    const riverGeo = new THREE.PlaneGeometry(halfWidth * 2, zEnd - zStart, 6, slices);
    riverGeo.rotateX(-Math.PI / 2);

    const pos = riverGeo.attributes.position;
    const origY = [];

    for (let i = 0; i < pos.count; i++) {
      const localZ = pos.getZ(i);
      const worldZ = localZ;
      const localX = pos.getX(i);
      const riverCenterX = getRiverCenter(worldZ);

      pos.setX(i, riverCenterX + localX);
      const y = RIVER_WATER_LEVEL;
      pos.setY(i, y);
      origY.push(y);
    }

    riverGeo.computeVertexNormals();

    const riverMesh = new THREE.Mesh(riverGeo, this.waterMat);
    riverMesh.receiveShadow = true;
    riverGroup.add(riverMesh);
    this.riverMesh = riverMesh;
    this.riverOrigY = origY;

    // Dramatic Waterfall at the Southern Cliff Edge (z = -165) plunging into the cloud sea
    const fallX = getRiverCenter(-165);
    const fallGeo = new THREE.PlaneGeometry(14.0, 12.0, 4, 8);
    fallGeo.translate(0, -6.0, 0);

    const fallMesh = new THREE.Mesh(fallGeo, this.waterFoamMat);
    fallMesh.position.set(fallX, RIVER_WATER_LEVEL, -165.5);
    fallMesh.rotation.y = Math.PI;
    riverGroup.add(fallMesh);

    // Waterfall Mist Ambient Light
    const mistLight = new THREE.PointLight(0xffcaa2, 1.6, 35, 1.8);
    mistLight.position.set(fallX, WATER_LEVEL + 1.0, -168);
    riverGroup.add(mistLight);
    this.nightLights.push(mistLight);

    // Riverbank Rocks & Scenic Overlook Wooden Pier
    const dockGroup = new THREE.Group();
    const dockX = getRiverCenter(25) - 8.5;
    const dockZ = 25;
    dockGroup.position.set(dockX, RIVER_WATER_LEVEL + 0.3, dockZ);

    const dockDeck = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 8.0), this.rusticPlankMat);
    dockDeck.castShadow = true;
    dockGroup.add(dockDeck);

    const dockPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.5, 6), this.weatheredWoodMat);
    dockPost1.position.set(-2.0, -1.0, -3.5);
    dockGroup.add(dockPost1);

    const dockPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.5, 6), this.weatheredWoodMat);
    dockPost2.position.set(-2.0, -1.0, 3.5);
    dockGroup.add(dockPost2);

    const dockLantern = new THREE.PointLight(0xffa24c, 2.0, 12, 1.8);
    dockLantern.position.set(-1.8, 1.2, 0);
    dockGroup.add(dockLantern);
    this.nightLights.push(dockLantern);

    riverGroup.add(dockGroup);
    this.scene.add(riverGroup);
  }

  /**
   * The Grand River Suspension Bridge
   * Spans the gorge from x = 22 to x = 68 at z = -10 (Deck Y = 12.8)
   */
  createGrandSuspensionBridge() {
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = "GrandSuspensionBridge";

    const bz = -10.0;
    const xStart = 22.0;
    const xEnd = 68.0;
    const span = xEnd - xStart;
    const centerX = (xStart + xEnd) / 2; // 45.0
    const deckY = 12.8;
    const deckWidth = 7.6;

    // 1. Reinforced Concrete Abutment Piers on River Canyon Walls
    [xStart + 3, xEnd - 3].forEach((px) => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(5.2, 14.0, 9.4), this.bridgeConcreteMat);
      pier.position.set(px, deckY - 7.0, bz);
      pier.castShadow = true;
      bridgeGroup.add(pier);
    });

    // 2. Asphalt Roadway Deck
    const deckGeo = new THREE.BoxGeometry(span, 0.45, deckWidth);
    const deckMesh = new THREE.Mesh(deckGeo, this.asphaltRoadMat);
    deckMesh.position.set(centerX, deckY - 0.22, bz);
    deckMesh.receiveShadow = true;
    bridgeGroup.add(deckMesh);

    // 3. Steel Under-Truss Support Structure
    const trussGeo = new THREE.BoxGeometry(span - 4, 1.4, deckWidth - 0.8);
    const trussMesh = new THREE.Mesh(trussGeo, this.bridgeSteelMat);
    trussMesh.position.set(centerX, deckY - 1.1, bz);
    trussMesh.castShadow = true;
    bridgeGroup.add(trussMesh);

    // 4. Twin International Amber Suspension Towers
    const towerX1 = 32.0;
    const towerX2 = 58.0;
    const towerHeight = 16.5; // reaches y = 29.3

    [towerX1, towerX2].forEach((tx) => {
      const tower = new THREE.Group();
      tower.position.set(tx, deckY, bz);

      // Left & Right Tower Columns
      const colGeo = new THREE.BoxGeometry(1.2, towerHeight, 1.2);
      const colL = new THREE.Mesh(colGeo, this.bridgeSteelMat);
      colL.position.set(0, towerHeight / 2, -deckWidth / 2 - 0.2);
      colL.castShadow = true;
      tower.add(colL);

      const colR = new THREE.Mesh(colGeo, this.bridgeSteelMat);
      colR.position.set(0, towerHeight / 2, deckWidth / 2 + 0.2);
      colR.castShadow = true;
      tower.add(colR);

      // Cross Bracing Struts
      const strutGeo = new THREE.BoxGeometry(1.0, 0.8, deckWidth + 1.2);
      const strutTop = new THREE.Mesh(strutGeo, this.bridgeSteelMat);
      strutTop.position.set(0, towerHeight - 0.5, 0);
      tower.add(strutTop);

      const strutMid = new THREE.Mesh(strutGeo, this.bridgeSteelMat);
      strutMid.position.set(0, towerHeight * 0.55, 0);
      tower.add(strutMid);

      // Flashing Aviation Obstruction Beacons on Tower Tops
      const beaconL = new THREE.PointLight(0xef4444, 2.5, 20, 1.6);
      beaconL.position.set(0, towerHeight + 0.4, -deckWidth / 2 - 0.2);
      tower.add(beaconL);
      this.nightLights.push(beaconL);
      this.animatedProps.push({ mesh: beaconL, type: 'beaconBlink', speed: 3.0 });

      const beaconR = new THREE.PointLight(0xef4444, 2.5, 20, 1.6);
      beaconR.position.set(0, towerHeight + 0.4, deckWidth / 2 + 0.2);
      tower.add(beaconR);
      this.nightLights.push(beaconR);
      this.animatedProps.push({ mesh: beaconR, type: 'beaconBlink', speed: 3.0 });

      bridgeGroup.add(tower);
    });

    // 5. Catenary Suspension Cables & Vertical Suspenders
    [-deckWidth / 2 - 0.2, deckWidth / 2 + 0.2].forEach((zOff) => {
      const cablePoints = [];
      const segs = 32;
      for (let s = 0; s <= segs; s++) {
        const t = s / segs;
        const px = THREE.MathUtils.lerp(xStart, xEnd, t);

        // Parabolic cable sag between towers
        let py = deckY + 1.5;
        if (px >= towerX1 && px <= towerX2) {
          const midT = (px - towerX1) / (towerX2 - towerX1);
          const sag = Math.sin(midT * Math.PI) * (towerHeight - 2.5);
          py = (deckY + towerHeight) - sag;
        } else if (px < towerX1) {
          const endT = (px - xStart) / (towerX1 - xStart);
          py = THREE.MathUtils.lerp(deckY + 1.5, deckY + towerHeight, endT);
        } else {
          const endT = (px - towerX2) / (xEnd - towerX2);
          py = THREE.MathUtils.lerp(deckY + towerHeight, deckY + 1.5, endT);
        }

        cablePoints.push(new THREE.Vector3(px, py, bz + zOff));

        // Vertical Suspender Wire Ropes every ~2.5m
        if (s % 2 === 0 && px > towerX1 + 1.5 && px < towerX2 - 1.5) {
          const suspenderGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(px, py, bz + zOff),
            new THREE.Vector3(px, deckY, bz + zOff)
          ]);
          const suspender = new THREE.Line(suspenderGeo, this.cableMat);
          bridgeGroup.add(suspender);
        }
      }

      const mainCableGeo = new THREE.BufferGeometry().setFromPoints(cablePoints);
      const mainCable = new THREE.Line(mainCableGeo, this.cableMat);
      bridgeGroup.add(mainCable);
    });

    // 6. Steel Guardrails & Illuminated Streetlamps along Deck
    [-deckWidth / 2, deckWidth / 2].forEach((zRail) => {
      const railGeo = new THREE.BoxGeometry(span, 0.9, 0.12);
      const rail = new THREE.Mesh(railGeo, this.guardrailMat);
      rail.position.set(centerX, deckY + 0.45, bz + zRail);
      bridgeGroup.add(rail);
    });

    // 4 Warm Deck Streetlights
    [36.0, 42.0, 48.0, 54.0].forEach((lampX) => {
      const lamp = new THREE.Group();
      lamp.position.set(lampX, deckY, bz + deckWidth / 2 - 0.2);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.0, 6), this.techMetalMat);
      pole.position.y = 2.0;
      lamp.add(pole);

      const light = new THREE.PointLight(0xffd8a6, 2.0, 16, 1.8);
      light.position.set(0, 4.1, -0.6);
      light.castShadow = false; // PointLight shadows disabled for 60fps mobile & laptop GPU efficiency
      lamp.add(light);
      this.nightLights.push(light);

      bridgeGroup.add(lamp);
    });

    this.scene.add(bridgeGroup);

    // Solid Safety Guardrail Collision Boxes
    this.physicsWorld.addObstacle({
      type: 'box',
      x: centerX,
      z: bz - deckWidth / 2 - 0.4,
      halfW: span / 2,
      halfD: 0.4
    });
    this.physicsWorld.addObstacle({
      type: 'box',
      x: centerX,
      z: bz + deckWidth / 2 + 0.4,
      halfW: span / 2,
      halfD: 0.4
    });
  }

  /**
   * The Timber Trestle Valley Bridge in the Pine Forest
   * Spans x = 72 to 104 at z = 58 (Deck Y = 13.8)
   */
  createTimberTrestleBridge() {
    const trestleGroup = new THREE.Group();
    trestleGroup.name = "TimberTrestleBridge";

    const tz = 58.0;
    const xStart = 72.0;
    const xEnd = 104.0;
    const span = xEnd - xStart;
    const centerX = (xStart + xEnd) / 2;
    const deckY = 13.8;
    const deckW = 6.2;

    // Timber Plank Roadway Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(span, 0.4, deckW), this.rusticPlankMat);
    deck.position.set(centerX, deckY - 0.2, tz);
    deck.receiveShadow = true;
    trestleGroup.add(deck);

    // Heavy Timber Bents & Cross Braces every 6 meters
    for (let bx = xStart + 4; bx <= xEnd - 4; bx += 6.5) {
      const bent = new THREE.Group();
      bent.position.set(bx, 0, tz);

      const groundUnder = getHeightAt(bx, tz);
      const bentHeight = Math.max(3.0, deckY - groundUnder);

      [-deckW / 2 + 0.4, deckW / 2 - 0.4].forEach((postZ) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, bentHeight, 6), this.weatheredWoodMat);
        post.position.set(0, deckY - bentHeight / 2, postZ);
        post.castShadow = true;
        bent.add(post);
      });

      // Diagonal cross brace
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, deckW - 0.4), this.weatheredWoodMat);
      crossBeam.position.set(0, deckY - bentHeight * 0.5, 0);
      bent.add(crossBeam);

      trestleGroup.add(bent);
    }

    // Rustic Wood Railings
    [-deckW / 2, deckW / 2].forEach((rz) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(span, 0.8, 0.16), this.weatheredWoodMat);
      rail.position.set(centerX, deckY + 0.4, tz + rz);
      trestleGroup.add(rail);
    });

    this.scene.add(trestleGroup);

    this.physicsWorld.addObstacle({
      type: 'box',
      x: centerX,
      z: tz - deckW / 2 - 0.3,
      halfW: span / 2,
      halfD: 0.3
    });
    this.physicsWorld.addObstacle({
      type: 'box',
      x: centerX,
      z: tz + deckW / 2 + 0.3,
      halfW: span / 2,
      halfD: 0.3
    });
  }

  /**
   * Mountain Overpass Tunnel on the North Alpine Highway
   */
  createMountainOverpass() {
    const tunnelGroup = new THREE.Group();
    tunnelGroup.name = "MountainOverpassArch";

    const ox = 0.0;
    const oz = 65.0;
    const oy = getHeightAt(ox, oz);
    tunnelGroup.position.set(ox, oy, oz);

    // Left and Right Stone Abutments
    const abutmentGeo = new THREE.BoxGeometry(2.4, 7.5, 12.0);
    const abutL = new THREE.Mesh(abutmentGeo, this.stoneMat);
    abutL.position.set(-5.5, 3.75, 0);
    abutL.castShadow = true;
    tunnelGroup.add(abutL);

    const abutR = new THREE.Mesh(abutmentGeo, this.stoneMat);
    abutR.position.set(5.5, 3.75, 0);
    abutR.castShadow = true;
    tunnelGroup.add(abutR);

    // Arch Roof Slab
    const roof = new THREE.Mesh(new THREE.BoxGeometry(13.4, 1.8, 12.0), this.stoneMat);
    roof.position.set(0, 8.4, 0);
    roof.castShadow = true;
    tunnelGroup.add(roof);

    // Amber Tunnel Strip Lights
    [-3.0, 3.0].forEach((tz) => {
      const stripLight = new THREE.PointLight(0xf59e0b, 2.2, 14, 1.8);
      stripLight.position.set(0, 7.2, tz);
      tunnelGroup.add(stripLight);
      this.nightLights.push(stripLight);
    });

    this.scene.add(tunnelGroup);

    this.physicsWorld.addObstacle({ type: 'box', x: ox - 5.5, z: oz, halfW: 1.2, halfD: 6.0 });
    this.physicsWorld.addObstacle({ type: 'box', x: ox + 5.5, z: oz, halfW: 1.2, halfD: 6.0 });
  }

  /**
   * Solar Photovoltaic Array & High-Voltage Relay Infrastructure
   */
  createSolarInfrastructure() {
    const solarGroup = new THREE.Group();
    solarGroup.name = "SolarEnergyField";

    const sx = 28.0;
    const sz = 122.0;
    const sy = getHeightAt(sx, sz);
    solarGroup.position.set(sx, sy, sz);

    // Rows of Angled Solar Panels
    const panelGeo = new THREE.BoxGeometry(2.8, 0.1, 1.6);
    panelGeo.rotateX(Math.PI / 6); // angled 30 deg toward sunset

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const panel = new THREE.Mesh(panelGeo, this.solarPanelMat);
        panel.position.set((c - 1.5) * 3.4, 1.0, (r - 1.0) * 3.2);
        panel.castShadow = true;
        solarGroup.add(panel);

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 6), this.techMetalMat);
        leg.position.set((c - 1.5) * 3.4, 0.5, (r - 1.0) * 3.2);
        solarGroup.add(leg);
      }
    }

    // Transformer & Inverter Enclosure
    const transformer = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.2), this.techMetalMat);
    transformer.position.set(-8.0, 1.1, 0);
    transformer.castShadow = true;
    solarGroup.add(transformer);

    // Communications Lattice Mast with Blinking Beacon
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.5, 18.0, 6), this.techMetalMat);
    mast.position.set(-8.0, 9.0, 0);
    mast.castShadow = true;
    solarGroup.add(mast);

    const mastBeacon = new THREE.PointLight(0xef4444, 2.8, 25, 1.6);
    mastBeacon.position.set(-8.0, 18.2, 0);
    solarGroup.add(mastBeacon);
    this.nightLights.push(mastBeacon);
    this.animatedProps.push({ mesh: mastBeacon, type: 'beaconBlink', speed: 2.8 });

    this.scene.add(solarGroup);

    this.physicsWorld.addObstacle({ type: 'box', x: sx, z: sz, halfW: 7.5, halfD: 5.5 });
    this.physicsWorld.addObstacle({ type: 'box', x: sx - 8.0, z: sz, halfW: 2.0, halfD: 2.0 });
  }

  /**
   * Circling Cloud Ocean & Towering Volumetric Horizon Sunset Cumulus (Matching Reference Photo)
   */
  createCloudOcean() {
    const cloudGroup = new THREE.Group();
    cloudGroup.name = "SunsetCloudDeck";

    // High-polygon smooth sphere for soft, non-faceted, volumetric cloud billows
    const puffGeo = new THREE.SphereGeometry(1, 26, 18);
    puffGeo.computeVertexNormals();

    // 1. Low Cloud Blanket Ocean in the Abyss Circling the 500x500 Continent
    const clusterCount = 36;
    const rimRadius = 230;

    for (let i = 0; i < clusterCount; i++) {
      const angle = (i / clusterCount) * Math.PI * 2;
      const dist = rimRadius + (i % 2 === 0 ? 15 : 45);
      const cx = Math.cos(angle) * dist;
      const cz = Math.sin(angle) * dist;
      const cy = WATER_LEVEL - 8.5; // Stays safely in the deep abyss below the continent

      const cluster = new THREE.Group();
      cluster.position.set(cx, cy, cz);

      for (let p = 0; p < 4; p++) {
        // Base of cloud deck gets shaded tone, top gets golden highlight
        const mat = p === 0 ? this.cloudBaseMat : (p >= 2 ? this.cloudHighlightMat : this.cloudMat);
        const puff = new THREE.Mesh(puffGeo, mat);
        puff.scale.set(42 + p * 9, 3.5 + p * 0.8, 42 + p * 9);
        puff.position.set((p - 1.5) * 14, p * 0.8, (p - 1) * 12);
        cluster.add(puff);
      }

      cloudGroup.add(cluster);
      this.clouds.push({
        group: cluster,
        baseAngle: angle,
        baseDist: dist,
        rotSpeed: 0.00015 + (i % 3) * 0.00005
      });
    }

    this.scene.add(cloudGroup);
  }

  createUtilityPolesAndCables() {
    const poleGroup = new THREE.Group();
    poleGroup.name = "UtilityPoles";

    // Along South Sunset Highway from z = 5 down to z = -115 (safely 7.5m west of highway centerline)
    const poleCoords = [
      { x: -5.5, z: -114.0 }, // Edge pole at Sunset Cliff
      { x: -4.0, z: -111.5 }, // Twin leaning pole (matches user reference photo)
      { x: -7.5, z: -95.0 },
      { x: -7.5, z: -75.0 },
      { x: -7.5, z: -55.0 },
      { x: -7.5, z: -35.0 }, // Near cabin
      { x: -7.5, z: -15.0 },
      { x: -7.5, z: 5.0 }
    ];

    const poleTops = [];
    const mastGeo = new THREE.CylinderGeometry(0.18, 0.24, 8.5, 8);
    const crossArmGeo = new THREE.BoxGeometry(2.4, 0.14, 0.14);
    const insGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.18, 6);

    poleCoords.forEach((coord, idx) => {
      const groundY = getHeightAt(coord.x, coord.z);
      const pole = new THREE.Group();
      pole.position.set(coord.x, groundY, coord.z);

      if (idx === 1) {
        pole.rotation.z = -0.07;
        pole.rotation.x = 0.05;
      }

      const mast = new THREE.Mesh(mastGeo, this.weatheredWoodMat);
      mast.position.y = 4.25;
      mast.castShadow = true;
      pole.add(mast);

      const crossArm = new THREE.Mesh(crossArmGeo, this.weatheredWoodMat);
      crossArm.position.set(0, 7.8, 0);
      crossArm.castShadow = true;
      pole.add(crossArm);

      [-0.9, -0.3, 0.3, 0.9].forEach((xOff) => {
        const ins = new THREE.Mesh(insGeo, this.darkBasaltMat);
        ins.position.set(xOff, 7.92, 0);
        pole.add(ins);
      });

      poleGroup.add(pole);
      poleTops.push(new THREE.Vector3(coord.x, groundY + 7.92, coord.z));

      this.physicsWorld.addObstacle({
        type: 'circle',
        x: coord.x,
        z: coord.z,
        radius: 0.6
      });
    });

    // Sagging Catenary Cables
    for (let i = 0; i < poleTops.length - 1; i++) {
      const p1 = poleTops[i];
      const p2 = poleTops[i + 1];

      [-0.8, 0.8].forEach((xOff) => {
        const curvePoints = [];
        const segs = 10;
        for (let s = 0; s <= segs; s++) {
          const t = s / segs;
          const px = THREE.MathUtils.lerp(p1.x + xOff * 0.4, p2.x + xOff * 0.4, t);
          const pz = THREE.MathUtils.lerp(p1.z, p2.z, t);
          const sag = Math.sin(t * Math.PI) * 1.35;
          const py = THREE.MathUtils.lerp(p1.y, p2.y, t) - sag;
          curvePoints.push(new THREE.Vector3(px, py, pz));
        }

        const cableGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const cable = new THREE.Line(cableGeo, this.cableMat);
        poleGroup.add(cable);
      });
    }

    this.scene.add(poleGroup);
  }

  /**
   * Designated Waypoint Stopping Pad & Carved Village Signboard
   * Creates the physical arrival zone for each resume section:
   * - Glowing amber & cyan concentric ground waypoint beacon decals
   * - Floating, rotating, bobbing 3D waypoint diamond indicator
   * - Carved wooden signpost with section title & subtitle
   * - Hanging iron carriage lantern with warm amber ambient light
   */
  createStoppingPadBeacon(padX, padZ, title, subtitle, parentGroup) {
    const padY = getEngineeredRoadGrade(padX, padZ) + 0.12;

    // 1. Concentric Glowing Ground Waypoint Beacon Decals
    const ringGeo = new THREE.RingGeometry(2.2, 2.65, 36);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, this.glowingAmberMat);
    ringMesh.position.set(padX, padY + 0.03, padZ);
    parentGroup.add(ringMesh);

    const innerRingGeo = new THREE.RingGeometry(0.85, 1.05, 24);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, this.glowingCyanMat);
    innerRingMesh.position.set(padX, padY + 0.03, padZ);
    parentGroup.add(innerRingMesh);

    // 2. Floating Animated 3D Waypoint Diamond Beacon
    const beaconGeo = new THREE.OctahedronGeometry(0.55, 0);
    const beacon = new THREE.Mesh(beaconGeo, this.glowingAmberMat);
    beacon.scale.set(0.75, 1.45, 0.75);
    beacon.position.set(padX, padY + 2.2, padZ);
    parentGroup.add(beacon);
    this.animatedProps.push({
      mesh: beacon,
      type: 'waypointBob',
      basePosY: padY + 2.2,
      speed: 1.6
    });

    const beaconLight = new THREE.PointLight(0xf59e0b, 1.8, 12, 1.8);
    beaconLight.position.set(padX, padY + 2.2, padZ);
    parentGroup.add(beaconLight);
    this.nightLights.push(beaconLight);

    // 3. Hanging Carved Wooden Village Signpost next to the pad
    const signGroup = new THREE.Group();
    const signX = padX + 3.6;
    const signZ = padZ - 2.2;
    const signGroundY = getHeightAt(signX, signZ);
    signGroup.position.set(signX, signGroundY, signZ);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.4, 8), this.weatheredWoodMat);
    post.position.y = 1.7;
    post.castShadow = true;
    signGroup.add(post);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), this.weatheredWoodMat);
    arm.position.set(-0.75, 3.1, 0);
    arm.castShadow = true;
    signGroup.add(arm);

    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), this.weatheredWoodMat);
    brace.position.set(-0.4, 2.65, 0);
    brace.rotation.z = Math.PI / 4;
    signGroup.add(brace);

    const signTex = createVillageSignTexture(title, subtitle);
    const boardMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.8,
      metalness: 0.08
    });
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.08), boardMat);
    board.position.set(-0.85, 2.4, 0);
    board.castShadow = true;
    signGroup.add(board);

    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.28), this.glowingAmberMat);
    lantern.position.set(-1.45, 2.7, 0);
    signGroup.add(lantern);

    const lanternLight = new THREE.PointLight(0xffaa4d, 1.8, 10, 1.8);
    lanternLight.position.set(-1.45, 2.7, 0);
    signGroup.add(lanternLight);
    this.nightLights.push(lanternLight);

    parentGroup.add(signGroup);
  }

  /**
   * Village Architecture & Alpine Settlement
   * Replaces empty terrain with a living alpine village:
   * - Central Village Square (fountain, market stalls, bakery, weaver, carpenter, mill)
   * - South Highway Village Corridor (roadside chalets, blacksmith, herdsman cottage with sheep, barn, woodcutter cabin)
   * - Mountain Cliffside Shelters & Overlooks (A-frame timber huts, sheep flocks, telephone poles matching user reference photo)
   * - East Riverside & West Mountain Foothill Huts
   * - 7 Thematic Resume Landmark Pavilions (set back with stone paths & clear sightlines)
   */
  createVillageArchitecture() {
    const villageGroup = new THREE.Group();
    villageGroup.name = "VillageArchitecture";

    // ─── Procedural Architectural Helpers ───

    // Helper: Build a pitched gabled slate roof
    const buildGabledRoof = (w, d, pitchH, mat) => {
      const g = new THREE.Group();
      const halfW = w / 2;
      const hyp = Math.hypot(halfW, pitchH);
      const angle = Math.atan2(pitchH, halfW);

      const slopeL = new THREE.Mesh(new THREE.BoxGeometry(hyp + 0.4, 0.2, d + 0.6), mat);
      slopeL.position.set(-halfW / 2, pitchH / 2, 0);
      slopeL.rotation.z = angle;
      slopeL.castShadow = true;
      g.add(slopeL);

      const slopeR = new THREE.Mesh(new THREE.BoxGeometry(hyp + 0.4, 0.2, d + 0.6), mat);
      slopeR.position.set(halfW / 2, pitchH / 2, 0);
      slopeR.rotation.z = -angle;
      slopeR.castShadow = true;
      g.add(slopeR);

      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, d + 0.7), this.weatheredWoodMat);
      ridge.position.set(0, pitchH, 0);
      g.add(ridge);

      return g;
    };

    // Helper: Build an authentic grazing sheep (matches user reference photo)
    const buildSheep = (x, z, rotY = 0, scale = 1.0) => {
      const g = new THREE.Group();
      const gy = getHeightAt(x, z);
      g.position.set(x, gy, z);
      g.rotation.y = rotY;

      // Fluffy ellipsoid wool body
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.55 * scale, 8, 6), this.woolSheepMat);
      body.scale.set(1.35, 0.95, 1.05);
      body.position.y = 0.52 * scale;
      body.castShadow = true;
      g.add(body);

      // Dark face and drooping ears
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22 * scale, 8, 6), this.darkSheepFaceMat);
      head.position.set(0.62 * scale, 0.58 * scale, 0);
      head.scale.set(1.1, 0.9, 0.9);
      g.add(head);

      [[-0.14], [0.14]].forEach(([ez]) => {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.06 * scale, 0.22 * scale), this.darkSheepFaceMat);
        ear.position.set(0.56 * scale, 0.64 * scale, ez);
        ear.rotation.x = ez > 0 ? 0.35 : -0.35;
        g.add(ear);
      });

      // 4 Dark slender legs
      const legGeo = new THREE.CylinderGeometry(0.06 * scale, 0.05 * scale, 0.44 * scale, 6);
      [[-0.32 * scale, -0.22 * scale], [-0.32 * scale, 0.22 * scale], [0.32 * scale, -0.22 * scale], [0.32 * scale, 0.22 * scale]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, this.darkSheepFaceMat);
        leg.position.set(lx, 0.22 * scale, lz);
        g.add(leg);
      });

      villageGroup.add(g);
      return g;
    };

    // Helper: Build an authentic A-Frame Timber Mountain Shelter (matches user reference photo)
    const buildAFrameShelter = (x, z, rotY = 0, w = 3.8, d = 4.0, h = 3.4) => {
      const g = new THREE.Group();
      const gy = getHeightAt(x, z);
      g.position.set(x, gy, z);
      g.rotation.y = rotY;

      const halfW = w / 2;
      const hyp = Math.hypot(halfW, h);
      const angle = Math.atan2(h, halfW);

      // Weathered Timber Roof Slopes
      const slopeL = new THREE.Mesh(new THREE.BoxGeometry(hyp + 0.3, 0.16, d + 0.4), this.weatheredWoodMat);
      slopeL.position.set(-halfW / 2, h / 2, 0);
      slopeL.rotation.z = angle;
      slopeL.castShadow = true;
      g.add(slopeL);

      const slopeR = new THREE.Mesh(new THREE.BoxGeometry(hyp + 0.3, 0.16, d + 0.4), this.weatheredWoodMat);
      slopeR.position.set(halfW / 2, h / 2, 0);
      slopeR.rotation.z = -angle;
      slopeR.castShadow = true;
      g.add(slopeR);

      // Heavy Timber Ridge Beam
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, d + 0.6), this.weatheredWoodMat);
      ridge.position.set(0, h, 0);
      g.add(ridge);

      // Horizontal Timber Collar Tie & Front Rafter Beams
      const collar = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, 0.16, 0.16), this.weatheredWoodMat);
      collar.position.set(0, h * 0.52, d / 2);
      g.add(collar);

      // Back Plank Wall
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, h * 0.75, 0.18), this.rusticPlankMat);
      backWall.position.set(0, h * 0.38, -d / 2 + 0.1);
      g.add(backWall);

      // Floor plank deck
      const floor = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.2, d * 0.9), this.rusticPlankMat);
      floor.position.y = 0.1;
      g.add(floor);

      // Stacked Wooden Cargo Crates (matching reference photo)
      const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), this.weatheredWoodMat);
      crate1.position.set(-w * 0.65, 0.35, -d * 0.2);
      crate1.castShadow = true;
      g.add(crate1);

      const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.65), this.rusticPlankMat);
      crate2.position.set(-w * 0.65, 0.95, -d * 0.2);
      crate2.rotation.y = 0.25;
      crate2.castShadow = true;
      g.add(crate2);

      // Weathered Timber Bench beside shelter
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.45), this.rusticPlankMat);
      bench.position.set(w * 0.65, 0.45, d * 0.1);
      bench.castShadow = true;
      g.add(bench);
      [[-0.6], [0.6]].forEach(([bx]) => {
        const bLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.38), this.weatheredWoodMat);
        bLeg.position.set(w * 0.65 + bx, 0.225, d * 0.1);
        g.add(bLeg);
      });

      // Warm Interior Lantern Glow
      const lanternLight = new THREE.PointLight(0xffaa4d, 1.8, 10, 1.8);
      lanternLight.position.set(0, h * 0.6, 0);
      g.add(lanternLight);
      this.nightLights.push(lanternLight);

      villageGroup.add(g);
      this.physicsWorld.addObstacle({ type: 'box', x, z, halfW: w * 0.65, halfD: d * 0.6 });
      return g;
    };

    // Helper: Build a picturesque Alpine Chalet / Cottage with Balcony & Flower Boxes
    const buildAlpineChalet = (x, z, rotY, w, d, h, hasBalcony = true, isWhiteStucco = true, name = "") => {
      const g = new THREE.Group();
      const gy = getHeightAt(x, z);
      g.position.set(x, gy, z);
      g.rotation.y = rotY;

      // 1. Fieldstone Basement Foundation
      const baseH = 1.3;
      const base = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, baseH, d + 0.4), this.stoneMat);
      base.position.y = baseH / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      // 2. Main Floor Walls
      const wallMat = isWhiteStucco ? this.whiteStuccoMat : this.rusticPlankMat;
      const walls = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      walls.position.y = baseH + h / 2;
      walls.castShadow = true;
      walls.receiveShadow = true;
      g.add(walls);

      // Dark Timber Corner Framing Posts
      const halfW = w / 2;
      const halfD = d / 2;
      [[-halfW, -halfD], [-halfW, halfD], [halfW, -halfD], [halfW, halfD]].forEach(([cx, cz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, h + 0.2, 0.32), this.weatheredWoodMat);
        post.position.set(cx, baseH + h / 2, cz);
        g.add(post);
      });

      // 3. Overhanging Alpine Gabled Roof
      const pitchH = h * 0.6;
      const roof = buildGabledRoof(w + 1.2, d + 1.2, pitchH, this.darkRoofMat);
      roof.position.y = baseH + h;
      g.add(roof);

      // 4. Stone Chimney with Cap
      const chimX = -halfW * 0.6;
      const chimZ = -halfD * 0.6;
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.2, h + pitchH + 1.2, 1.2), this.stoneMat);
      chimney.position.set(chimX, (baseH + h + pitchH + 1.2) / 2, chimZ);
      chimney.castShadow = true;
      g.add(chimney);

      // 5. Glowing Multi-Pane Windows
      const winGeo = new THREE.BoxGeometry(0.12, 1.2, 1.0);
      [[-halfW * 0.4], [halfW * 0.4]].forEach(([wx]) => {
        const winFront = new THREE.Mesh(winGeo, this.glowingAmberMat);
        winFront.position.set(wx, baseH + h * 0.55, halfD + 0.06);
        winFront.rotation.y = Math.PI / 2;
        g.add(winFront);
      });

      // 6. Timber Balcony & Flower Boxes
      if (hasBalcony) {
        const balcY = baseH + h * 0.52;
        const balcDeck = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, 0.16, 1.3), this.rusticPlankMat);
        balcDeck.position.set(0, balcY, halfD + 0.65);
        balcDeck.castShadow = true;
        g.add(balcDeck);

        const balcRail = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, 0.75, 0.08), this.weatheredWoodMat);
        balcRail.position.set(0, balcY + 0.42, halfD + 1.26);
        g.add(balcRail);

        // Flower box with bright red geraniums
        const flowerBox = new THREE.Mesh(new THREE.BoxGeometry(w * 0.66, 0.22, 0.22), this.rusticPlankMat);
        flowerBox.position.set(0, balcY + 0.46, halfD + 1.35);
        g.add(flowerBox);

        for (let fl = -0.4; fl <= 0.4; fl += 0.2) {
          const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 5), this.geraniumMat);
          blossom.position.set(fl * (w * 0.66), balcY + 0.6, halfD + 1.35);
          g.add(blossom);
        }
      }

      // 7. Warm Porch Lamp with Glowing PointLight
      const porchLamp = new THREE.PointLight(0xffaa4d, 2.2, 14, 1.8);
      porchLamp.position.set(0, baseH + 1.8, halfD + 0.9);
      g.add(porchLamp);
      this.nightLights.push(porchLamp);

      villageGroup.add(g);
      this.physicsWorld.addObstacle({ type: 'box', x, z, halfW: halfW + 0.5, halfD: halfD + 0.5 });
      return g;
    };

    // Helper: Build a Rustic Log Cabin with Firewood Racks
    const buildRusticLogCabin = (x, z, rotY, w = 6.8, d = 5.4, h = 3.6) => {
      const g = new THREE.Group();
      const gy = getHeightAt(x, z);
      g.position.set(x, gy, z);
      g.rotation.y = rotY;

      // Heavy Log Walls
      const walls = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), this.rusticPlankMat);
      walls.position.y = h / 2;
      walls.castShadow = true;
      walls.receiveShadow = true;
      g.add(walls);

      // Cedar Shake Gable Roof
      const roof = buildGabledRoof(w + 1.2, d + 1.2, 2.4, this.darkRoofMat);
      roof.position.y = h;
      g.add(roof);

      // Stone Hearth Chimney
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.2, h + 2.6, 1.2), this.stoneMat);
      chimney.position.set(-w / 3, (h + 2.6) / 2, -d / 3);
      chimney.castShadow = true;
      g.add(chimney);

      // Stacked Cordwood Rack along side
      const woodRack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 2.8), this.weatheredWoodMat);
      woodRack.position.set(w / 2 + 0.45, 0.7, 0);
      woodRack.castShadow = true;
      g.add(woodRack);

      // Chopping Stump with Axe in front
      const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.65, 8), this.weatheredWoodMat);
      stump.position.set(1.6, 0.325, d / 2 + 1.6);
      stump.castShadow = true;
      g.add(stump);

      // Amber Window & Lantern
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 1.1), this.glowingAmberMat);
      win.position.set(0, h * 0.55, d / 2 + 0.06);
      win.rotation.y = Math.PI / 2;
      g.add(win);

      const lamp = new THREE.PointLight(0xffaa4d, 1.8, 12, 1.8);
      lamp.position.set(-1.4, 2.2, d / 2 + 0.6);
      g.add(lamp);
      this.nightLights.push(lamp);

      villageGroup.add(g);
      this.physicsWorld.addObstacle({ type: 'box', x, z, halfW: w / 2 + 0.5, halfD: d / 2 + 0.5 });
      return g;
    };

    // Helper: Build a Village Market Stall with Striped Awning & Crates
    const buildMarketStall = (x, z, rotY, isTerracotta = true) => {
      const g = new THREE.Group();
      const gy = getHeightAt(x, z);
      g.position.set(x, gy, z);
      g.rotation.y = rotY;

      // Table counter
      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.2), this.rusticPlankMat);
      counter.position.y = 0.425;
      counter.castShadow = true;
      g.add(counter);

      // 4 Timber Canopy Posts
      const postGeo = new THREE.BoxGeometry(0.12, 2.3, 0.12);
      [[-1.1, -0.5], [-1.1, 0.5], [1.1, -0.5], [1.1, 0.5]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(postGeo, this.weatheredWoodMat);
        post.position.set(px, 1.15, pz);
        g.add(post);
      });

      // Striped Canvas Awning
      const awningMat = isTerracotta ? this.terracottaAwningMat : this.creamAwningMat;
      const awning = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.6), awningMat);
      awning.position.set(0, 2.2, 0);
      awning.rotation.x = 0.12;
      awning.castShadow = true;
      g.add(awning);

      // Crates with produce
      const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.45), this.weatheredWoodMat);
      crate1.position.set(-0.6, 1.05, 0.1);
      g.add(crate1);

      const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.45), this.weatheredWoodMat);
      crate2.position.set(0.5, 1.025, 0);
      g.add(crate2);

      // Small hanging lantern
      const lamp = new THREE.PointLight(0xffaa4d, 1.4, 6, 1.8);
      lamp.position.set(0, 2.0, 0);
      g.add(lamp);
      this.nightLights.push(lamp);

      villageGroup.add(g);
      this.physicsWorld.addObstacle({ type: 'box', x, z, halfW: 1.4, halfD: 0.85 });
      return g;
    };

    // Helper: Build Central Village Stone Well / Fountain
    const buildVillageFountain = (x, z) => {
      const g = new THREE.Group();
      const gy = getEngineeredRoadGrade(x, z);
      g.position.set(x, gy, z);

      // Circular Stone Basin
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.5, 0.9, 18), this.stoneMat);
      basin.position.y = 0.45;
      basin.castShadow = true;
      basin.receiveShadow = true;
      g.add(basin);

      // Water disk inside
      const waterDisk = new THREE.Mesh(new THREE.CircleGeometry(2.2, 18), this.waterMat);
      waterDisk.rotateX(-Math.PI / 2);
      waterDisk.position.y = 0.75;
      g.add(waterDisk);

      // Central Column & Pyramidal Canopy
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 2.2, 8), this.stoneMat);
      col.position.y = 1.1;
      g.add(col);

      const canopyGeo = new THREE.ConeGeometry(2.6, 1.4, 6);
      const canopy = new THREE.Mesh(canopyGeo, this.darkRoofMat);
      canopy.position.y = 3.0;
      canopy.castShadow = true;
      g.add(canopy);

      // 4 Timber Support Posts
      const postGeo = new THREE.BoxGeometry(0.14, 2.4, 0.14);
      [[-1.4, -1.4], [-1.4, 1.4], [1.4, -1.4], [1.4, 1.4]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(postGeo, this.weatheredWoodMat);
        post.position.set(px, 1.6, pz);
        g.add(post);
      });

      // Wooden Bucket
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.35, 8), this.weatheredWoodMat);
      bucket.position.set(0.6, 1.0, 0.6);
      g.add(bucket);

      villageGroup.add(g);
      this.physicsWorld.addObstacle({ type: 'circle', x, z, radius: 2.6 });
      return g;
    };

    // Helper: Build a Village Streetlamp
    const buildStreetLamp = (x, z) => {
      const g = new THREE.Group();
      const gy = getHeightAt(x, z);
      g.position.set(x, gy, z);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 3.6, 8), this.weatheredWoodMat);
      post.position.y = 1.8;
      post.castShadow = true;
      g.add(post);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.08), this.weatheredWoodMat);
      arm.position.set(0.3, 3.5, 0);
      g.add(arm);

      const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.36), this.glowingAmberMat);
      lantern.position.set(0.6, 3.3, 0);
      g.add(lantern);

      const light = new THREE.PointLight(0xffaa4d, 2.0, 14, 1.8);
      light.position.set(0.6, 3.3, 0);
      g.add(light);
      this.nightLights.push(light);

      villageGroup.add(g);
      return g;
    };

    // Helper: Build a Paved Flagstone Garden Path between Waypoint Pad and Building Porch
    const buildFlagstonePath = (x1, z1, x2, z2, width = 2.4) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);
      const midX = (x1 + x2) / 2;
      const midZ = (z1 + z2) / 2;
      const midY = (getHeightAt(x1, z1) + getHeightAt(x2, z2)) / 2 + 0.12;

      const pathGeo = new THREE.PlaneGeometry(width, len);
      pathGeo.rotateX(-Math.PI / 2);
      const pathMesh = new THREE.Mesh(pathGeo, this.plazaAsphaltMat);
      pathMesh.position.set(midX, midY, midZ);
      pathMesh.rotation.y = angle;
      pathMesh.receiveShadow = true;
      villageGroup.add(pathMesh);
    };

    // ─── PART 1: CENTRAL VILLAGE SQUARE (At Roundabout, z: -25 to +25) ───
    buildVillageFountain(0, 0);

    // 4 Market Stalls surrounding the square
    buildMarketStall(-11.0, 9.0, 0.8, true);
    buildMarketStall(11.0, 9.0, -0.8, false);
    buildMarketStall(-11.0, -9.0, 2.3, false);
    buildMarketStall(11.0, -9.0, -2.3, true);

    // 4 Main Village Chalets & Workshops
    buildAlpineChalet(20.0, -18.0, -0.4, 7.8, 6.2, 4.2, true, true, "Boulangerie & Provisions");
    buildAlpineChalet(-20.0, -18.0, 0.4, 7.2, 5.8, 3.8, true, false, "Weaver's Cottage");
    buildAlpineChalet(21.0, 14.0, -2.7, 8.4, 6.4, 4.0, false, false, "Carpenter's Workshop");
    buildAlpineChalet(-21.0, 14.0, 2.7, 7.6, 6.0, 4.8, false, true, "Village Granary & Mill");

    // Streetlamps around roundabout
    buildStreetLamp(9.5, 3.0);
    buildStreetLamp(-9.5, 3.0);
    buildStreetLamp(3.0, 9.5);
    buildStreetLamp(-3.0, -9.5);

    // ─── PART 2: SOUTH HIGHWAY VILLAGE CORRIDOR (Spawn at z: -30 to -92) ───
    // Immediately visible at car spawn position (x: 0, z: -30)!
    buildAlpineChalet(-15.0, -25.0, 0.2, 7.4, 5.8, 4.0, true, true, "Roadside Chalet");
    buildAlpineChalet(15.0, -27.0, -0.2, 7.8, 6.2, 3.8, false, false, "Blacksmith & Farrier");

    // Herdsman Stone Thatched Cottage with grazing sheep flock
    buildAlpineChalet(16.0, -44.0, -0.5, 7.2, 5.4, 3.6, false, false, "Herdsman's Stone Cottage");
    buildSheep(20.5, -42.0, 0.4, 1.0);
    buildSheep(22.0, -45.0, -0.8, 0.95);
    buildSheep(18.5, -47.0, 1.2, 1.05);
    buildSheep(21.0, -49.0, -1.5, 0.85);

    // Meadow Timber Chalet
    buildAlpineChalet(-18.0, -54.0, 0.3, 7.6, 6.0, 4.4, true, false, "Highland Meadow Chalet");

    // Alpine Barn & Hayloft with Wooden Wagon
    buildAlpineChalet(16.0, -66.0, -0.3, 8.6, 6.8, 4.6, false, false, "Alpine Barn & Hayloft");

    // Woodcutter's Log Cabin with Firewood Stacks
    buildRusticLogCabin(-16.0, -76.0, 0.2, 7.4, 5.8, 3.6);

    // Wayfarer's Stone Mountain Shrine
    {
      const sx = 15.0, sz = -86.0;
      const sy = getHeightAt(sx, sz);
      const shrine = new THREE.Group();
      shrine.position.set(sx, sy, sz);
      shrine.rotation.y = -0.6;
      const shrineBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 1.8), this.stoneMat);
      shrineBase.position.y = 1.6;
      shrine.add(shrineBase);
      const shrineRoof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.4, 4), this.darkRoofMat);
      shrineRoof.position.y = 3.9;
      shrine.add(shrineRoof);
      const shrineLight = new THREE.PointLight(0xffaa4d, 1.8, 8, 1.8);
      shrineLight.position.set(0, 2.0, 0.8);
      shrine.add(shrineLight);
      this.nightLights.push(shrineLight);
      villageGroup.add(shrine);
      this.physicsWorld.addObstacle({ type: 'box', x: sx, z: sz, halfW: 1.6, halfD: 1.4 });
    }

    // Streetlamps along South Highway
    buildStreetLamp(3.8, -22.0);
    buildStreetLamp(-3.8, -48.0);
    buildStreetLamp(3.8, -74.0);

    // ─── PART 3: MOUNTAIN CLIFFSIDE SHELTERS & OVERLOOKS (Matches user reference photo) ───
    buildAFrameShelter(8.0, -108.0, -0.4, 3.6, 3.4, 3.2);
    buildSheep(11.0, -106.0, -0.6, 1.0);
    buildSheep(12.5, -109.0, 1.1, 0.9);

    buildRusticLogCabin(-14.0, -96.0, 0.3, 5.4, 4.6, 3.0);
    buildSheep(-18.0, -94.0, 0.2, 1.05);
    buildSheep(-17.0, -97.0, -1.0, 0.95);
    buildSheep(-19.5, -96.0, 1.8, 0.85);

    buildRusticLogCabin(13.0, -94.0, -0.3, 5.2, 4.4, 3.0);
    buildSheep(17.0, -93.0, -0.4, 1.0);
    buildSheep(16.5, -96.0, 0.8, 0.9);

    // ─── PART 4: RIVERSIDE & FOOTHILL HUTS ───
    // Fisherman's Stilt Hut & Dock by the River
    buildRusticLogCabin(25.0, -4.0, -0.8, 5.6, 4.8, 3.2);

    // Grand Suspension Bridge Tollhouse
    buildAlpineChalet(64.0, -8.0, 0.2, 6.2, 5.0, 3.6, false, true, "Bridge Tollhouse");

    // Forester's Cabin in Pine Forest
    buildRusticLogCabin(34.0, 22.0, 0.5, 6.4, 5.2, 3.4);

    // Stream Mill Cabin in West Foothills
    buildRusticLogCabin(-36.0, 14.0, 0.4, 6.2, 5.2, 3.4);

    // Mountain Ore Storehouse
    buildAlpineChalet(-45.0, -8.0, -0.2, 7.0, 5.6, 3.8, false, false, "Ore Storehouse");

    // ─── PART 5: THE 7 THEMATIC RESUME LANDMARK BUILDINGS ───
    // Each building is cleanly set back by 8-10m from its stopping pad with a flagstone garden path!

    // ─── 1. THE FOUNDER'S ALPINE LODGE (About Me & Bio) ───
    {
      const padX = -20.0, padZ = -35.0;
      const lx = -30.0, lz = -35.0; // Set back 10m west of stopping pad!
      const ly = getHeightAt(lx, lz);
      const lodge = new THREE.Group();
      lodge.position.set(lx, ly, lz);

      // Fieldstone Basement
      const base = new THREE.Mesh(new THREE.BoxGeometry(8.6, 1.4, 6.8), this.stoneMat);
      base.position.y = 0.7;
      base.castShadow = true;
      base.receiveShadow = true;
      lodge.add(base);

      // Timber Walls
      const walls = new THREE.Mesh(new THREE.BoxGeometry(8.0, 4.4, 6.2), this.rusticPlankMat);
      walls.position.y = 3.6;
      walls.castShadow = true;
      walls.receiveShadow = true;
      lodge.add(walls);

      // Dark Timber Corner Posts
      [[-3.9, -3.0], [-3.9, 3.0], [3.9, -3.0], [3.9, 3.0]].forEach(([cx, cz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.4, 0.35), this.weatheredWoodMat);
        post.position.set(cx, 3.6, cz);
        lodge.add(post);
      });

      // Front Covered Porch extending East toward stopping pad
      const porchDeck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 5.0), this.rusticPlankMat);
      porchDeck.position.set(4.4, 1.4, 0);
      porchDeck.castShadow = true;
      lodge.add(porchDeck);

      [[-2.2], [2.2]].forEach(([pz]) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.8, 0.22), this.weatheredWoodMat);
        col.position.set(5.4, 2.8, pz);
        lodge.add(col);
      });

      // Porch roof overhang
      const pRoof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 5.4), this.darkRoofMat);
      pRoof.position.set(4.4, 4.3, 0);
      pRoof.rotation.z = 0.12;
      lodge.add(pRoof);

      // Main Pitched Slate Roof
      const mainRoof = buildGabledRoof(8.4, 6.4, 2.8, this.darkRoofMat);
      mainRoof.position.y = 5.8;
      lodge.add(mainRoof);

      // Fieldstone Chimney
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.4, 1.4), this.stoneMat);
      chimney.position.set(-2.8, 4.8, -2.4);
      chimney.castShadow = true;
      lodge.add(chimney);

      // Glowing Amber Windows
      [[-1.6], [1.6]].forEach(([wz]) => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 1.1), this.glowingAmberMat);
        win.position.set(4.06, 3.6, wz);
        lodge.add(win);
      });

      // Warm Interior Glow & Porch Light
      const warmLight = new THREE.PointLight(0xffaa4d, 2.4, 16, 1.8);
      warmLight.position.set(4.5, 3.6, 0);
      lodge.add(warmLight);
      this.nightLights.push(warmLight);

      // Props: Stacked Firewood & Casks
      const firewood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 2.4), this.weatheredWoodMat);
      firewood.position.set(3.2, 1.9, 3.5);
      lodge.add(firewood);

      villageGroup.add(lodge);
      this.physicsWorld.addObstacle({ type: 'box', x: lx, z: lz, halfW: 4.8, halfD: 4.0 });

      // Flagstone walkway connecting stopping pad to front porch
      buildFlagstonePath(padX, padZ, lx + 4.4, lz, 2.4);

      // Waypoint Stopping Pad Beacon at (-20, -35)
      this.createStoppingPadBeacon(padX, padZ, "ABOUT ME", "Bio & Engineering Philosophy", villageGroup);
    }

    // ─── 2. THE ARTISAN'S TECH FORGE & MILL (Skills & Tech Stack) ───
    {
      const padX = -55.0, padZ = 12.0;
      const fx = -64.0, fz = 12.0; // Set back 9m west!
      const fy = getHeightAt(fx, fz);
      const forge = new THREE.Group();
      forge.position.set(fx, fy, fz);

      // Basalt Masonry Base & Workshop
      const walls = new THREE.Mesh(new THREE.BoxGeometry(9.4, 4.8, 7.4), this.darkBasaltMat);
      walls.position.y = 2.4;
      walls.castShadow = true;
      walls.receiveShadow = true;
      forge.add(walls);

      // Roof
      const roof = buildGabledRoof(9.8, 7.6, 3.0, this.darkRoofMat);
      roof.position.y = 4.8;
      forge.add(roof);

      // Massive Forge Hearth Chimney with glowing orange opening
      const forgeChimney = new THREE.Mesh(new THREE.BoxGeometry(2.4, 7.2, 2.4), this.darkBasaltMat);
      forgeChimney.position.set(-3.2, 4.8, 2.2);
      forgeChimney.castShadow = true;
      forge.add(forgeChimney);

      const hearthGlow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.2), this.glowingAmberMat);
      hearthGlow.position.set(4.75, 2.0, 1.5);
      forge.add(hearthGlow);

      const forgeLight = new THREE.PointLight(0xf97316, 3.2, 18, 1.8);
      forgeLight.position.set(4.8, 2.0, 1.5);
      forge.add(forgeLight);
      this.nightLights.push(forgeLight);

      // Rotating Mill Waterwheel on North Wall
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0, 2.2, -4.0);

      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.0, 8), this.weatheredWoodMat);
      axle.rotation.x = Math.PI / 2;
      wheelGroup.add(axle);

      const rimGeo = new THREE.TorusGeometry(2.2, 0.14, 8, 24);
      const rim1 = new THREE.Mesh(rimGeo, this.weatheredWoodMat);
      rim1.position.z = -0.3;
      wheelGroup.add(rim1);
      const rim2 = new THREE.Mesh(rimGeo, this.weatheredWoodMat);
      rim2.position.z = 0.3;
      wheelGroup.add(rim2);

      const paddleGeo = new THREE.BoxGeometry(0.12, 0.8, 0.65);
      for (let p = 0; p < 8; p++) {
        const angle = (p / 8) * Math.PI * 2;
        const paddle = new THREE.Mesh(paddleGeo, this.weatheredWoodMat);
        paddle.position.set(Math.cos(angle) * 2.0, Math.sin(angle) * 2.0, 0);
        paddle.rotation.z = angle + Math.PI / 2;
        wheelGroup.add(paddle);
      }
      forge.add(wheelGroup);
      this.animatedProps.push({ mesh: wheelGroup, type: 'rotateRotor', speed: 0.85 });

      // Anvil & Tool Bench Props
      const anvil = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.4), this.techMetalMat);
      anvil.position.set(5.4, 0.35, 1.5);
      forge.add(anvil);

      villageGroup.add(forge);
      this.physicsWorld.addObstacle({ type: 'box', x: fx, z: fz, halfW: 5.4, halfD: 4.4 });

      buildFlagstonePath(padX, padZ, fx + 4.8, fz, 2.4);
      this.createStoppingPadBeacon(padX, padZ, "TECH FORGE", "33+ Languages & Tech Stack", villageGroup);
    }

    // ─── 3. THE FOREST GUILD TAVERN (Engineering Experience) ───
    {
      const padX = 42.0, padZ = 48.0;
      const tx = 42.0, tz = 58.0; // Set back 10m north!
      const ty = getHeightAt(tx, tz);
      const tavern = new THREE.Group();
      tavern.position.set(tx, ty, tz);

      // Ground Floor: Stone Masonry
      const lowerFloor = new THREE.Mesh(new THREE.BoxGeometry(10.5, 4.0, 7.8), this.stoneMat);
      lowerFloor.position.y = 2.0;
      lowerFloor.castShadow = true;
      tavern.add(lowerFloor);

      // Upper Floor: Overhanging Timber Jetty
      const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(11.4, 3.8, 8.6), this.rusticPlankMat);
      upperFloor.position.y = 5.9;
      upperFloor.castShadow = true;
      tavern.add(upperFloor);

      // Steep Double-Pitched Roof with Dormers
      const tavernRoof = buildGabledRoof(11.8, 9.0, 3.6, this.darkRoofMat);
      tavernRoof.position.y = 7.8;
      tavern.add(tavernRoof);

      // Front Tavern Porch & Deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 2.6), this.rusticPlankMat);
      deck.position.set(0, 0.3, -4.5);
      deck.castShadow = true;
      tavern.add(deck);

      // Carriage Lanterns flanking entrance
      [[-2.5], [2.5]].forEach(([lx]) => {
        const lamp = new THREE.PointLight(0xffaa4d, 2.2, 14, 1.8);
        lamp.position.set(lx, 2.6, -4.0);
        tavern.add(lamp);
        this.nightLights.push(lamp);
      });

      // Beer/Cider Barrels & Wooden Benches
      [[-3.2], [3.2]].forEach(([bx]) => {
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 1.1, 10), this.weatheredWoodMat);
        barrel.position.set(bx, 0.85, -4.6);
        tavern.add(barrel);
      });

      villageGroup.add(tavern);
      this.physicsWorld.addObstacle({ type: 'box', x: tx, z: tz, halfW: 6.2, halfD: 5.0 });

      buildFlagstonePath(padX, padZ, tx, tz - 4.5, 2.4);
      this.createStoppingPadBeacon(padX, padZ, "GUILD TAVERN", "Engineering Work Experience", villageGroup);
    }

    // ─── 4. THE HIGHLAND INNOVATION MANOR (Flagship AI Projects) ───
    {
      const padX = 92.0, padZ = 32.0;
      const mx = 102.0, mz = 32.0; // Set back 10m east!
      const my = getHeightAt(mx, mz);
      const manor = new THREE.Group();
      manor.position.set(mx, my, mz);

      // Stone Ashlar Walls with Corner Quoins
      const mainHall = new THREE.Mesh(new THREE.BoxGeometry(12.4, 7.2, 9.0), this.stoneMat);
      mainHall.position.y = 3.6;
      mainHall.castShadow = true;
      manor.add(mainHall);

      // Slate Hipped Roof
      const manorRoof = buildGabledRoof(12.8, 9.4, 4.2, this.darkRoofMat);
      manorRoof.position.y = 7.2;
      manor.add(manorRoof);

      // Central Observation Cupola / Skylight Tower
      const cupola = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.4, 2.8), this.weatheredWoodMat);
      cupola.position.set(0, 11.2, 0);
      manor.add(cupola);

      const cupolaDome = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.8, 8), this.techMetalMat);
      cupolaDome.position.set(0, 13.0, 0);
      manor.add(cupolaDome);

      // Arched Entrance Portico
      const portico = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 2.2), this.stoneMat);
      portico.position.set(-6.8, 2.1, 0);
      portico.castShadow = true;
      manor.add(portico);

      // Glowing Multi-Pane Windows
      const winGeo = new THREE.BoxGeometry(0.12, 1.8, 1.2);
      [[-2.4, -4.55], [2.4, -4.55], [-2.4, 4.55], [2.4, 4.55]].forEach(([wx, wz]) => {
        const win = new THREE.Mesh(winGeo, this.glowingAmberMat);
        win.position.set(wx, 4.2, wz);
        manor.add(win);
      });

      const manorLight = new THREE.PointLight(0xf59e0b, 2.8, 20, 1.8);
      manorLight.position.set(-6.8, 3.2, 0);
      manor.add(manorLight);
      this.nightLights.push(manorLight);

      villageGroup.add(manor);
      this.physicsWorld.addObstacle({ type: 'box', x: mx, z: mz, halfW: 7.0, halfD: 5.2 });

      buildFlagstonePath(padX, padZ, mx - 6.8, mz, 2.4);
      this.createStoppingPadBeacon(padX, padZ, "INNOVATION MANOR", "Flagship AI Applications", villageGroup);
    }

    // ─── 5. THE SCHOLAR'S STONE SCRIPTORIUM (Published Research) ───
    {
      const padX = 84.0, padZ = -48.0;
      const sx = 92.0, sz = -50.0; // Set back 8m east!
      const sy = getHeightAt(sx, sz);
      const scriptorium = new THREE.Group();
      scriptorium.position.set(sx, sy, sz);

      // Heavy Ashlar Limestone Walls with Buttresses
      const nave = new THREE.Mesh(new THREE.BoxGeometry(9.6, 6.2, 7.2), this.stoneMat);
      nave.position.y = 3.1;
      nave.castShadow = true;
      scriptorium.add(nave);

      // External Stone Buttress Pillars
      [[-4.8, -3.8], [-4.8, 3.8], [4.8, -3.8], [4.8, 3.8]].forEach(([bx, bz]) => {
        const buttress = new THREE.Mesh(new THREE.BoxGeometry(1.0, 5.8, 1.0), this.stoneMat);
        buttress.position.set(bx, 2.9, bz);
        scriptorium.add(buttress);
      });

      // Steep Monastic Slate Roof
      const scriptRoof = buildGabledRoof(10.2, 7.6, 4.4, this.darkRoofMat);
      scriptRoof.position.y = 6.2;
      scriptorium.add(scriptRoof);

      // Gothic Arched Windows Glowing with Amber Light
      const gothicWin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 1.1), this.glowingAmberMat);
      gothicWin.position.set(-4.85, 3.8, 0);
      scriptorium.add(gothicWin);

      const scriptLight = new THREE.PointLight(0xffaa4d, 2.2, 16, 1.8);
      scriptLight.position.set(-5.2, 3.2, 0);
      scriptorium.add(scriptLight);
      this.nightLights.push(scriptLight);

      villageGroup.add(scriptorium);
      this.physicsWorld.addObstacle({ type: 'box', x: sx, z: sz, halfW: 5.6, halfD: 4.4 });

      buildFlagstonePath(padX, padZ, sx - 4.8, sz, 2.4);
      this.createStoppingPadBeacon(padX, padZ, "SCRIPTORIUM", "Published Research & Papers", villageGroup);
    }

    // ─── 6. THE VILLAGE ACADEMY OF SEALS (Credentials & Certifications) ───
    {
      const padX = -80.0, padZ = -38.0;
      const ax = -89.0, az = -38.0; // Set back 9m west!
      const ay = getHeightAt(ax, az);
      const academy = new THREE.Group();
      academy.position.set(ax, ay, az);

      // Foundation & Clapboard Walls
      const walls = new THREE.Mesh(new THREE.BoxGeometry(10.2, 5.6, 7.6), this.rusticPlankMat);
      walls.position.y = 2.8;
      walls.castShadow = true;
      academy.add(walls);

      // Classical Portico with 4 Timber Columns
      const porticoRoof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 5.4), this.stoneMat);
      porticoRoof.position.set(5.8, 4.8, 0);
      academy.add(porticoRoof);

      [[-2.2], [2.2]].forEach(([cz]) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.8, 0.32), this.stoneMat);
        col.position.set(6.8, 2.4, cz);
        academy.add(col);
      });

      // Gable Roof with Bell Cupola
      const academyRoof = buildGabledRoof(10.6, 8.0, 3.4, this.darkRoofMat);
      academyRoof.position.y = 5.6;
      academy.add(academyRoof);

      const bellTower = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), this.weatheredWoodMat);
      bellTower.position.set(0, 9.6, 0);
      academy.add(bellTower);

      const bellRoof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.6, 4), this.darkRoofMat);
      bellRoof.position.set(0, 11.2, 0);
      academy.add(bellRoof);

      villageGroup.add(academy);
      this.physicsWorld.addObstacle({ type: 'box', x: ax, z: az, halfW: 6.0, halfD: 4.6 });

      buildFlagstonePath(padX, padZ, ax + 5.8, az, 2.4);
      this.createStoppingPadBeacon(padX, padZ, "ACADEMY OF SEALS", "Certifications & Credentials", villageGroup);
    }

    // ─── 7. THE CROSSROADS COURIER POSTHOUSE (Contact & Collaboration) ───
    {
      const padX = -16.0, padZ = 30.0;
      const px = -24.0, pz = 30.0; // Set back 8m west!
      const py = getHeightAt(px, pz);
      const posthouse = new THREE.Group();
      posthouse.position.set(px, py, pz);

      // Stone & Timber Body
      const walls = new THREE.Mesh(new THREE.BoxGeometry(9.2, 5.2, 6.8), this.rusticPlankMat);
      walls.position.y = 2.6;
      walls.castShadow = true;
      posthouse.add(walls);

      // Gable Slate Roof
      const postRoof = buildGabledRoof(9.6, 7.2, 3.2, this.darkRoofMat);
      postRoof.position.y = 5.2;
      posthouse.add(postRoof);

      // Side Carriage Lean-To Shed
      const shedRoof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 5.8), this.darkRoofMat);
      shedRoof.position.set(-5.6, 3.4, 0);
      shedRoof.rotation.z = -0.22;
      posthouse.add(shedRoof);

      const postCol = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.0, 0.22), this.weatheredWoodMat);
      postCol.position.set(-6.8, 1.5, 2.4);
      posthouse.add(postCol);

      // Red Postal Dispatch Box on Front Porch
      const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
      const mailbox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.45), redMat);
      mailbox.position.set(2.4, 0.55, -3.8);
      posthouse.add(mailbox);

      // Warm Carriage Lamp
      const lamp = new THREE.PointLight(0xffaa4d, 2.2, 14, 1.8);
      lamp.position.set(0, 2.8, -3.6);
      posthouse.add(lamp);
      this.nightLights.push(lamp);

      villageGroup.add(posthouse);
      this.physicsWorld.addObstacle({ type: 'box', x: px, z: pz, halfW: 5.4, halfD: 4.2 });

      buildFlagstonePath(padX, padZ, px + 4.6, pz, 2.4);
      this.createStoppingPadBeacon(padX, padZ, "COURIER POSTHOUSE", "Contact & Resume Download", villageGroup);
    }

    this.scene.add(villageGroup);
  }

  createSunsetCliffLookout() {
    const lookout = new THREE.Group();
    lookout.name = "SunsetCliffPrecipice";

    const lx = 0;
    const lz = -115.0; // At the end of the long Sunset Highway
    const ly = getHeightAt(lx, lz);
    lookout.position.set(lx, ly, lz);

    // 1. Sitting Developer Figure (from user reference photo)
    const devGroup = new THREE.Group();
    devGroup.position.set(0.0, 0.08, -1.2);
    devGroup.rotation.y = Math.PI; // Facing South into golden clouds

    const clothesMat = new THREE.MeshStandardMaterial({ color: 0x3d4f3b, roughness: 0.85 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.9 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.7 });

    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.45), pantsMat);
    legs.position.y = 0.11;
    devGroup.add(legs);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.54, 0.32), clothesMat);
    torso.position.set(0, 0.44, -0.06);
    devGroup.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), skinMat);
    head.position.set(0, 0.78, -0.04);
    devGroup.add(head);

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.9 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.145, 8, 6), hairMat);
    hair.position.set(0, 0.82, -0.06);
    hair.scale.set(1.02, 0.85, 1.05);
    devGroup.add(hair);

    // Laptop resting on lap with illuminated screen
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.28, 0.18);
    laptopGroup.rotation.x = 0.2;

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.3), this.techMetalMat);
    laptopGroup.add(laptopBase);

    const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.02), screenGlowMat);
    laptopScreen.position.set(0, 0.14, 0.14);
    laptopScreen.rotation.x = -0.32;
    laptopGroup.add(laptopScreen);

    const laptopLight = new THREE.PointLight(0xbae6fd, 2.0, 4.5, 2.0);
    laptopLight.position.set(0, 0.25, 0.05);
    laptopGroup.add(laptopLight);
    this.nightLights.push(laptopLight);

    devGroup.add(laptopGroup);
    lookout.add(devGroup);

    // 2. Rustic A-Frame Timber Shelter (left side of trail)
    const shelterGroup = new THREE.Group();
    shelterGroup.position.set(-6.8, 0, 2.2);
    shelterGroup.rotation.y = 0.28;

    const aRoofL = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.16, 3.2), this.weatheredWoodMat);
    aRoofL.position.set(-1.15, 1.9, 0);
    aRoofL.rotation.z = Math.PI / 3.4;
    aRoofL.castShadow = true;
    shelterGroup.add(aRoofL);

    const aRoofR = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.16, 3.2), this.weatheredWoodMat);
    aRoofR.position.set(1.15, 1.9, 0);
    aRoofR.rotation.z = -Math.PI / 3.4;
    aRoofR.castShadow = true;
    shelterGroup.add(aRoofR);

    const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 3.4), this.weatheredWoodMat);
    ridgeBeam.position.y = 3.35;
    shelterGroup.add(ridgeBeam);

    const woolMat = new THREE.MeshStandardMaterial({ color: 0xede8d0, roughness: 0.95 });
    const sheep = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), woolMat);
    sheep.position.set(-3.2, 0.5, 1.4);
    sheep.scale.set(1.3, 0.9, 1.0);
    sheep.castShadow = true;
    shelterGroup.add(sheep);

    lookout.add(shelterGroup);

    // 3. Natural Cliff Edge Promontory Boulders
    const boulderGeo = new THREE.DodecahedronGeometry(1.8, 1);
    const b1 = new THREE.Mesh(boulderGeo, this.stoneMat);
    b1.position.set(-3.8, 0.8, -1.8);
    b1.scale.set(1.4, 1.1, 1.5);
    b1.castShadow = true;
    lookout.add(b1);

    const b2 = new THREE.Mesh(boulderGeo, this.darkBasaltMat);
    b2.position.set(4.4, 0.9, -1.0);
    b2.scale.set(1.5, 1.3, 1.3);
    b2.castShadow = true;
    lookout.add(b2);

    // 4. Weathered Timber Crate / Bench (right side of path, matching reference photo)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(2.4, 0.22, -0.2);
    benchGroup.rotation.y = -0.35;
    const benchPlank = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.5), this.rusticPlankMat);
    benchPlank.position.y = 0.45;
    benchPlank.castShadow = true;
    benchGroup.add(benchPlank);
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.4), this.weatheredWoodMat);
    leg1.position.set(-0.65, 0.225, 0);
    leg1.castShadow = true;
    benchGroup.add(leg1);
    const leg2 = leg1.clone();
    leg2.position.set(0.65, 0.225, 0);
    benchGroup.add(leg2);
    lookout.add(benchGroup);

    // 5. Designated Interactive Waypoint Stopping Pad & Signpost (matches prompt)
    this.createStoppingPadBeacon(0.0, -114.0, "SUNSET LOOKOUT", "Engineering Horizon", lookout);

    this.scene.add(lookout);

    this.physicsWorld.addObstacle({ type: 'circle', x: lx - 3.8, z: lz - 1.8, radius: 1.8 });
    this.physicsWorld.addObstacle({ type: 'circle', x: lx + 4.4, z: lz - 1.0, radius: 1.8 });
    this.physicsWorld.addObstacle({ type: 'box', x: lx - 6.8, z: lz + 2.2, halfW: 2.2, halfD: 2.0 });
  }

  createWindmillLookout() {
    const millGroup = new THREE.Group();
    millGroup.name = "WindmillPeak";

    const wx = 0;
    const wz = 135.0; // High North Alpine Summit
    const wy = getHeightAt(wx, wz);
    millGroup.position.set(wx, wy, wz);

    const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 4.2, 14.0, 8), this.weatheredWoodMat);
    tower.position.y = 7.0;
    tower.castShadow = true;
    millGroup.add(tower);

    const deck = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.4, 14), this.rusticPlankMat);
    deck.position.y = 9.8;
    deck.castShadow = true;
    millGroup.add(deck);

    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 13.5, 2.4);

    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), this.darkRoofMat);
    rotorGroup.add(hub);

    const bladeGeo = new THREE.BoxGeometry(0.4, 6.2, 0.08);
    bladeGeo.translate(0, 3.1, 0);

    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(bladeGeo, this.rusticPlankMat);
      blade.rotation.z = (b * Math.PI) / 2;
      blade.castShadow = true;
      rotorGroup.add(blade);
    }

    millGroup.add(rotorGroup);
    this.animatedProps.push({ mesh: rotorGroup, type: 'rotateRotor', speed: 1.2 });

    this.scene.add(millGroup);
    this.physicsWorld.addObstacle({ type: 'circle', x: wx, z: wz, radius: 4.8 });
  }

  createBouldersAndRocks() {
    const rockGroup = new THREE.Group();
    rockGroup.name = "PlateauBoulders";

    const boulderSpots = [
      { x: -14.5, z: -44.0, s: 1.3, mat: this.stoneMat },
      { x: 15.5, z: -34.0, s: 1.2, mat: this.darkBasaltMat },
      { x: -15.5, z: -85.0, s: 1.4, mat: this.stoneMat },
      { x: 16.5, z: -95.0, s: 1.3, mat: this.darkBasaltMat },
      { x: 45.0, z: 25.0, s: 1.8, mat: this.stoneMat },
      { x: -45.0, z: -15.0, s: 1.7, mat: this.darkBasaltMat },
      { x: 16.0, z: 85.0, s: 1.5, mat: this.stoneMat },
      { x: -18.0, z: 110.0, s: 1.4, mat: this.darkBasaltMat }
    ];

    const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);

    boulderSpots.forEach((b) => {
      const by = getHeightAt(b.x, b.z);
      const mesh = new THREE.Mesh(rockGeo, b.mat);
      mesh.position.set(b.x, by + b.s * 0.45, b.z);
      mesh.scale.set(b.s * 1.1, b.s * 0.85, b.s * 1.1);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.castShadow = true;
      rockGroup.add(mesh);

      this.physicsWorld.addObstacle({
        type: 'circle',
        x: b.x,
        z: b.z,
        radius: b.s * 0.85
      });
    });

    this.scene.add(rockGroup);
  }

  createFencesAndBarriers() {
    const fenceGroup = new THREE.Group();
    fenceGroup.name = "RoadFences";

    const fencePosts = [
      { x: -9.5, z: -30.0 }, { x: -9.5, z: -26.0 }, { x: -9.5, z: -22.0 },
      { x: -9.5, z: -18.0 }, { x: -9.5, z: -14.0 },
      { x: 8.0, z: -110.0 }, { x: 9.0, z: -105.0 }, { x: 9.5, z: -100.0 }
    ];

    const postGeo = new THREE.CylinderGeometry(0.09, 0.1, 1.4, 6);

    fencePosts.forEach((fp) => {
      const fy = getHeightAt(fp.x, fp.z);
      const post = new THREE.Mesh(postGeo, this.weatheredWoodMat);
      post.position.set(fp.x, fy + 0.7, fp.z);
      post.receiveShadow = true;
      fenceGroup.add(post);

      this.physicsWorld.addObstacle({
        type: 'circle',
        x: fp.x,
        z: fp.z,
        radius: 0.4
      });
    });

    this.scene.add(fenceGroup);
  }

  /**
   * Delicate Meadow Grass Tufts clustered around Sunset Cliff (Faithful to Reference Photo)
   */
  createMeadowGrassTufts() {
    // Elegant 3-sided tapered grass blade clump geometry
    const clumpGeo = new THREE.ConeGeometry(0.18, 0.45, 3);
    clumpGeo.translate(0, 0.225, 0);
    clumpGeo.computeVertexNormals();

    const tuftCount = 400;
    const instancedGrass = new THREE.InstancedMesh(clumpGeo, this.grassTuftMat, tuftCount);
    instancedGrass.name = "MeadowGrassTufts";
    instancedGrass.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let idx = 0;

    // Clustered in the meadow around Sunset Cliff (z: -85 to -118, x: -18 to 18, off-path)
    for (let i = 0; i < tuftCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const gx = side * (3.0 + Math.random() * 14.0);
      const gz = -85.0 - Math.random() * 32.0;
      const gy = getHeightAt(gx, gz);

      const scale = 0.75 + Math.random() * 0.8;
      dummy.position.set(gx, gy, gz);
      dummy.rotation.set((Math.random() - 0.5) * 0.2, Math.random() * Math.PI, (Math.random() - 0.5) * 0.2);
      dummy.scale.set(scale, scale * (0.85 + Math.random() * 0.5), scale);
      dummy.updateMatrix();

      instancedGrass.setMatrixAt(idx, dummy.matrix);

      const tone = Math.random();
      if (tone > 0.6) {
        color.setHex(0x84cc16); // Golden sunset highlight tip
      } else if (tone > 0.3) {
        color.setHex(0x65a30d); // Lush meadow green
      } else {
        color.setHex(0x4d7c0f); // Deep turf
      }
      instancedGrass.setColorAt(idx, color);
      idx++;
    }

    instancedGrass.instanceMatrix.needsUpdate = true;
    if (instancedGrass.instanceColor) instancedGrass.instanceColor.needsUpdate = true;
    this.scene.add(instancedGrass);
  }

  createAlpinePines() {
    const treeGroup = new THREE.Group();
    treeGroup.name = "AlpinePines";

    const treeCoords = [
      { x: -28.0, z: -55.0 },
      { x: 26.0, z: -50.0 },
      { x: -35.0, z: -85.0 },
      { x: 30.0, z: -95.0 },
      { x: -35.0, z: 15.0 },
      { x: -55.0, z: 45.0 },
      { x: 65.0, z: 20.0 },
      { x: 80.0, z: -20.0 },
      { x: 18.0, z: 75.0 },
      { x: -18.0, z: 90.0 },
      { x: 25.0, z: 110.0 },
      { x: -25.0, z: 125.0 }
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.24, 0.38, 4.0, 8);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x224227,
      roughness: 0.78,
      metalness: 0.05,
      flatShading: false
    });

    treeCoords.forEach((tc) => {
      const ty = getHeightAt(tc.x, tc.z);
      const tree = new THREE.Group();
      tree.position.set(tc.x, ty, tc.z);

      const trunk = new THREE.Mesh(trunkGeo, this.weatheredWoodMat);
      trunk.position.y = 2.0;
      trunk.castShadow = true;
      tree.add(trunk);

      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(2.6, 3.8, 12), foliageMat);
      cone1.position.y = 4.5;
      cone1.castShadow = true;
      tree.add(cone1);

      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.9, 2.8, 12), foliageMat);
      cone2.position.y = 6.4;
      cone2.castShadow = true;
      tree.add(cone2);

      const cone3 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.0, 10), foliageMat);
      cone3.position.y = 7.9;
      cone3.castShadow = true;
      tree.add(cone3);

      treeGroup.add(tree);

      this.physicsWorld.addObstacle({
        type: 'circle',
        x: tc.x,
        z: tc.z,
        radius: 0.7
      });
    });

    this.scene.add(treeGroup);
  }

  setNightMode(isNight) {
    this.nightLights.forEach((light) => {
      light.intensity = isNight ? 2.8 : 1.4;
    });

    this.windowMaterials.forEach((mat) => {
      mat.emissiveIntensity = isNight ? 1.0 : 0.4;
    });

    if (this.cloudMat) {
      if (isNight) {
        this.cloudMat.color.setHex(0x182032);
        this.cloudMat.emissive.setHex(0x0a0e18);
        this.cloudMat.opacity = 0.82;
      } else {
        this.cloudMat.color.setHex(0xffd2a6);
        this.cloudMat.emissive.setHex(0x5a2d12);
        this.cloudMat.opacity = 0.96;
      }
    }

    if (this.cloudHighlightMat) {
      if (isNight) {
        this.cloudHighlightMat.color.setHex(0x1c263c);
        this.cloudHighlightMat.emissive.setHex(0x0e1422);
      } else {
        this.cloudHighlightMat.color.setHex(0xffecd6);
        this.cloudHighlightMat.emissive.setHex(0x823c18);
      }
    }
  }

  update(delta) {
    const time = performance.now() * 0.001;

    // Realistic River Water Surface Flow & Ripples (Throttled to every 2nd frame, direct Float32Array write)
    if (this.riverMesh && this.riverOrigY.length > 0) {
      this._waterFrame = (this._waterFrame || 0) + 1;
      if (this._waterFrame % 2 === 0) {
        const pos = this.riverMesh.geometry.attributes.position;
        const count = pos.count;
        const arr = pos.array;
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const pz = arr[idx + 2];
          arr[idx + 1] = this.riverOrigY[i] + Math.sin(time * 2.5 + pz * 0.18) * 0.12;
        }
        pos.needsUpdate = true;
      }
    }

    // Cloud drift
    this.clouds.forEach((c) => {
      c.baseAngle += c.rotSpeed * delta * 60;
      c.group.position.x = Math.cos(c.baseAngle) * c.baseDist;
      c.group.position.z = Math.sin(c.baseAngle) * c.baseDist;
    });

    // Animated props
    this.animatedProps.forEach((prop) => {
      if (prop.type === 'rotateRotor') {
        prop.mesh.rotation.z += delta * prop.speed;
      } else if (prop.type === 'rotateSlow') {
        prop.mesh.rotation.y = Math.sin(time * prop.speed) * 0.35 + Math.PI / 6;
      } else if (prop.type === 'pulse') {
        const s = 1.0 + Math.sin(time * prop.speed) * 0.08;
        prop.mesh.scale.set(s, s, s);
      } else if (prop.type === 'beaconBlink') {
        prop.mesh.intensity = (Math.sin(time * prop.speed) > 0.4) ? 2.8 : 0.0;
      } else if (prop.type === 'waypointBob') {
        prop.mesh.rotation.y += delta * 1.6;
        prop.mesh.position.y = prop.basePosY + Math.sin(time * 2.8) * 0.18;
      }
    });
  }
}
