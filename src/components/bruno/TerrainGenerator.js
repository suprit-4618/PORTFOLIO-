import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

/**
 * Deterministic mulberry32 PRNG
 */
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const terrainPrng = mulberry32(133742);
const noise2D = createNoise2D(terrainPrng);

const detailPrng = mulberry32(987654);
const detailNoise2D = createNoise2D(detailPrng);

// World Dimensions - Enlarged 500x500 Map
export const TERRAIN_SIZE = 500; // world units
export const SEGMENTS = 140;     // optimal resolution for physics + 60fps rendering
export const WATER_LEVEL = -4.0; // cloud ocean surface level
export const RIVER_WATER_LEVEL = 4.8; // alpine mountain river surface level

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Point-to-segment distance helper for road networks
 */
export function distToSegment(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const lenSq = dx * dx + dz * dz;
  if (lenSq === 0) return Math.hypot(px - ax, pz - az);
  let t = ((px - ax) * dx + (pz - az) * dz) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}

/**
 * Alpine River centerline analytical spline
 * Flows gracefully from the Northeast alpine peaks (z = +160)
 * through the eastern valley, under the Timber Bridge (z = +58),
 * under the Grand Suspension Bridge (z = -10),
 * and along the scenic eastern canyon to the Southern Waterfall (z = -165).
 * Consistently stays East of the South Highway (x >= 38) so the main straightaway is wide and open.
 */
export function getRiverCenter(z) {
  if (z >= 40) {
    // Upper mountain river
    const t = (z - 40) / 120; // 0 at z = 40, 1 at z = 160
    return 42.0 + t * 65.0 + Math.sin(z * 0.045) * 5.0;
  } else {
    // Lower river gorge
    const t = (z - 40) / -205; // 0 at z = 40, 1 at z = -165
    return 42.0 - t * 14.0 + Math.sin(z * 0.035) * 4.0;
  }
}

/**
 * River Gorge Evaluator
 */
export function getRiverGorge(x, z) {
  if (z < -170 || z > 165) return { inRiver: false, depthFactor: 0, distRiver: 999 };
  const riverX = getRiverCenter(z);
  const distRiver = Math.abs(x - riverX);

  const riverHalfWidth = 6.5;  // 13m wide river water surface
  const gorgeHalfWidth = 20.0; // 40m wide dramatic canyon

  if (distRiver > gorgeHalfWidth) {
    return { inRiver: false, depthFactor: 0, distRiver };
  }

  const depthFactor = 1.0 - smoothstep(riverHalfWidth, gorgeHalfWidth, distRiver);
  const inRiver = distRiver < riverHalfWidth;
  return { inRiver, depthFactor, distRiver };
}

/**
 * Analytical Road Grade Engine across the 500x500 Map
 * Provides perfectly smooth, engineered road slopes, bridge alignments,
 * and eliminates unnatural grade jumps or elevation clipping.
 */
export function getEngineeredRoadGrade(x, z) {
  // 1. Central Interchange Roundabout around (0, 0)
  if (Math.hypot(x, z) < 18.0) {
    return 12.0;
  }

  // 2. South Sunset Highway (z from 0 to -100) & Sunset Turnaround Plaza / Cliff
  if (Math.abs(x) < 25.0 && z <= 0 && z >= -125.0) {
    if (z >= -65.0) {
      return 12.0; // Flat cruise straightaway from interchange to cabin
    } else if (z >= -100.0) {
      // Gentle scenic descent from 12.0 to 11.0 approaching the cliff turnaround loop
      const t = (-65.0 - z) / 35.0;
      return 12.0 - t * 1.0;
    } else {
      // Sunset Cliff lookout footpath and terrace
      const t = Math.min(1.0, (-100.0 - z) / 16.0);
      return 11.0 - t * 0.35;
    }
  }

  // 3. Grand Suspension Bridge Deck (x: 22 to 68, z: -10)
  if (x >= 20.0 && x <= 70.0 && Math.abs(z - (-10.0)) < 12.0) {
    return 12.8;
  }

  // 4. Timber Trestle Bridge Deck (x: 70 to 106, z: 58)
  if (x >= 68.0 && x <= 108.0 && Math.abs(z - 58.0) < 12.0) {
    return 13.8;
  }

  // 5. East Tech Highway (x: 0 to 105)
  if (x >= 0 && z >= -25.0 && z <= 50.0) {
    if (x <= 22.0) {
      const t = x / 22.0;
      return 12.0 + t * 0.8; // 12.0 -> 12.8 at bridge entrance
    } else if (x <= 68.0) {
      return 12.8;
    } else if (z >= -5.0) {
      // Route to AI Campus (x: 68 to 95, z: -10 to 30)
      const t = Math.min(1.0, (x - 68.0) / 27.0);
      return 12.8 + t * 1.4; // 12.8 -> 14.2 at AI Campus
    } else {
      // Route to Vector Vault (x: 68 to 90, z: -10 to -50)
      return 12.6;
    }
  }

  // 6. Scenic Timber Bridge Forest Loop
  if (x >= 20.0 && x <= 108.0 && z >= 10.0 && z <= 65.0) {
    if (x < 70.0) {
      const t = Math.min(1.0, (z - 10.0) / 48.0);
      return 12.8 + t * 1.0; // 12.8 -> 13.8 at Timber Bridge
    } else if (x <= 106.0) {
      return 13.8;
    } else {
      return 14.0;
    }
  }

  // 7. North Alpine Mountain Pass & Mountain Overpass (z: 0 to 140)
  if (z >= 0 && Math.abs(x) < 35.0) {
    if (z <= 65.0) {
      // Highway straight up to Mountain Overpass tunnel
      const t = z / 65.0;
      return 12.0 + t * 2.2; // 12.0 -> 14.2
    } else {
      // Serpentine mountain climb to Windmill Summit (z: 65 to 135)
      const t = Math.min(1.0, (z - 65.0) / 70.0);
      return 14.2 + t * 4.3; // 14.2 -> 18.5 at Summit
    }
  }

  // 8. West Industrial Parkway (x: 0 to -115, z: -45 to 35)
  if (x <= 0 && x >= -115.0) {
    if (z >= 0) {
      // To Data Pipeline Station
      const t = Math.min(1.0, Math.abs(x) / 100.0);
      return 12.0 + t * 0.4; // 12.0 -> 12.4
    } else {
      // To QA Testing Lab
      return 12.2;
    }
  }

  return 12.0;
}

/**
 * Road Network Evaluator for the Enlarged 500x500 World
 * Returns normalized influence [0..1] of paved roads and trails.
 */
export function getTrailFactor(x, z) {
  let minDist = 999;

  // 1. Central Interchange Roundabout around (0, 0)
  const dCenter = Math.hypot(x, z);
  if (dCenter < 16.5) {
    minDist = Math.min(minDist, Math.abs(dCenter - 11.0));
  }

  // 2. South Sunset Highway (from Central Interchange to Sunset Cliff Overlook)
  if (z <= 5 && z >= -102.0) {
    minDist = Math.min(minDist, Math.abs(x));
  }

  // Sunset Overlook Turnaround Plaza at (0, -100)
  const dSunsetTurnaround = Math.hypot(x, z - (-100.0));
  if (dSunsetTurnaround < 12.0) {
    minDist = Math.min(minDist, Math.max(0, dSunsetTurnaround - 8.0));
  }

  // Walking Footpath from Overlook to Developer Cliff edge (0, -100 to 0, -116)
  if (z < -100.0 && z >= -116.0) {
    minDist = Math.min(minDist, Math.abs(x) * 1.6);
  }

  // 3. East Tech Highway (Crosses Grand Suspension Bridge at z = -10, x = 22..68)
  const dEast1 = distToSegment(x, z, 0, 0, 22, -10);
  const dBridge = (x >= 20 && x <= 70) ? Math.abs(z - (-10)) : 999;
  const dEast2 = distToSegment(x, z, 68, -10, 80, 5);
  const dEast3 = distToSegment(x, z, 80, 5, 95, 30); // to AI Campus
  const dEast4 = distToSegment(x, z, 68, -10, 78, -30);
  const dEast5 = distToSegment(x, z, 78, -30, 90, -50); // to Vector Vault
  minDist = Math.min(minDist, dEast1, dBridge, dEast2, dEast3, dEast4, dEast5);

  // 4. Timber Bridge Scenic Loop in Pine Forest
  const dTimberBridge = (x >= 70 && x <= 106) ? Math.abs(z - 58) : 999;
  const dRiverWest = distToSegment(x, z, 22, -10, 28, 20);
  const dRiverWest2 = distToSegment(x, z, 28, 20, 45, 45);
  const dRiverWest3 = distToSegment(x, z, 45, 45, 72, 58);
  const dRiverEast = distToSegment(x, z, 104, 58, 102, 44);
  const dRiverEast2 = distToSegment(x, z, 102, 44, 95, 30);
  minDist = Math.min(minDist, dTimberBridge, dRiverWest, dRiverWest2, dRiverWest3, dRiverEast, dRiverEast2);

  // 5. West Industrial Parkway
  const dWest1 = distToSegment(x, z, 0, 0, -30, 2);
  const dWest2 = distToSegment(x, z, -30, 2, -50, 5);
  const dWest3 = distToSegment(x, z, -50, 5, -75, 16);
  const dWest4 = distToSegment(x, z, -75, 16, -100, 25); // to Data Station
  const dWest5 = distToSegment(x, z, -50, 5, -70, -18);
  const dWest6 = distToSegment(x, z, -70, -18, -90, -40); // to QA Lab
  minDist = Math.min(minDist, dWest1, dWest2, dWest3, dWest4, dWest5, dWest6);

  // 6. North Alpine Mountain Pass & Serpentine Climb to Windmill Summit
  const dNorth1 = distToSegment(x, z, 0, 0, 0, 65);
  const dNorth2 = distToSegment(x, z, 0, 65, 16, 90);
  const dNorth3 = distToSegment(x, z, 16, 90, 18, 105);
  const dNorth4 = distToSegment(x, z, 18, 105, -10, 120);
  const dNorth5 = distToSegment(x, z, -10, 120, 0, 134);
  const dWindmillTurnaround = Math.hypot(x, z - 134.0);
  if (dWindmillTurnaround < 11.0) {
    minDist = Math.min(minDist, Math.max(0, dWindmillTurnaround - 7.5));
  }
  minDist = Math.min(minDist, dNorth1, dNorth2, dNorth3, dNorth4, dNorth5);

  // 7. Village Access Lanes & Arrival Pads to Resume Buildings
  const dAboutLane = distToSegment(x, z, 0, -35, -20, -35);
  const dSkillsLane = distToSegment(x, z, -50, 5, -55, 12);
  const dPubLane = distToSegment(x, z, 76, -25, 84, -48);
  const dCertLane = distToSegment(x, z, -70, -18, -80, -38);
  const dContactLane = distToSegment(x, z, -14, 0, -16, 30);
  minDist = Math.min(minDist, dAboutLane, dSkillsLane, dPubLane, dCertLane, dContactLane);

  // Wide, gentle 24m road corridor and right-of-way (eliminates sunken trench walls)
  return 1.0 - smoothstep(3.2, 22.0, minDist);
}

/**
 * Exact Elevation Engine across the 500x500 Map
 * Includes high plateau, mountain ridges, natural river canyon carving,
 * solid bridge decks, and ocean perimeter drop-off.
 */
export function getHeightAt(x, z) {
  // 1. Broad Highland Continent Elevation
  const n1 = noise2D(x * 0.0055, z * 0.0055);
  const n2 = detailNoise2D(x * 0.016, z * 0.016) * 0.35;
  let baseH = 12.2 + (n1 + n2) * 2.8;

  // 2. High Alpine Landmarks
  // North Alpine Peak (Windmill Summit: x = 0, z = 135)
  const distWindmill = Math.hypot(x, z - 135);
  if (distWindmill < 65) {
    const f = 1.0 - smoothstep(0, 65, distWindmill);
    baseH += Math.pow(f, 1.4) * 9.5;
  }

  // East AI Research Ridge (x = 105, z = 40)
  const distAI = Math.hypot(x - 105, z - 40);
  if (distAI < 50) {
    const f = 1.0 - smoothstep(0, 50, distAI);
    baseH += Math.pow(f, 1.5) * 4.5;
  }

  // West Data Pipeline Ridge (x = -110, z = 30)
  const distData = Math.hypot(x + 110, z - 30);
  if (distData < 50) {
    const f = 1.0 - smoothstep(0, 50, distData);
    baseH += Math.pow(f, 1.5) * 4.2;
  }

  // Sunset Cliff Overlook (x = 0, z = -115) - gentle slope down to cliff edge
  const distCliff = Math.hypot(x, z - (-115));
  if (distCliff < 35) {
    const f = 1.0 - smoothstep(0, 35, distCliff);
    baseH -= f * 1.5;
  }

  // 3. River Canyon Carving
  const gorge = getRiverGorge(x, z);
  if (gorge.depthFactor > 0) {
    const riverBedY = 3.4;
    baseH = THREE.MathUtils.lerp(baseH, riverBedY, gorge.depthFactor);
  }

  // 4. Solid Bridge Decks (Overriding river canyon so vehicles drive flat across)
  // Grand Suspension Bridge: z = -10, x between 22 and 68
  if (Math.abs(z - (-10)) < 4.0 && x >= 22 && x <= 68) {
    const bridgeT = smoothstep(22, 27, x) * (1.0 - smoothstep(63, 68, x));
    baseH = THREE.MathUtils.lerp(baseH, 12.8, bridgeT);
  }

  // Timber Trestle Bridge: z = 58, x between 70 and 106
  if (Math.abs(z - 58) < 3.6 && x >= 70 && x <= 106) {
    const timberT = smoothstep(70, 75, x) * (1.0 - smoothstep(101, 106, x));
    baseH = THREE.MathUtils.lerp(baseH, 13.8, timberT);
  }

  // 5. Jagged Continental Cliff Perimeter Drop-off (into the sea of golden clouds)
  const angle = Math.atan2(z, x);
  const jaggedRadius = 195.0 + Math.sin(angle * 6) * 14.0 + Math.cos(angle * 11) * 9.0;
  const distCenter = Math.hypot(x, z);

  const cliffDrop = smoothstep(jaggedRadius - 8.0, jaggedRadius + 16.0, distCenter);
  let height = THREE.MathUtils.lerp(baseH, WATER_LEVEL - 5.0, cliffDrop);

  // 6. Smooth Engineered Road Bed Leveling
  const trail = getTrailFactor(x, z);
  if (trail > 0.01) {
    const roadGrade = getEngineeredRoadGrade(x, z);
    const blendWeight = Math.pow(trail, 0.82);
    height = THREE.MathUtils.lerp(height, roadGrade, blendWeight * 0.98);

    // Keep ground slightly below asphalt ribbon (+0.12m) to prevent z-fighting
    if (trail > 0.85) {
      height = Math.min(height, roadGrade);
    }
  }

  return Math.max(WATER_LEVEL - 6.0, height);
}

/**
 * Biome classifier
 */
export function getBiomeAt(x, z) {
  const height = getHeightAt(x, z);
  const trail = getTrailFactor(x, z);
  const dist = Math.hypot(x, z);
  const gorge = getRiverGorge(x, z);

  let type = 'grass';
  if (height < WATER_LEVEL + 0.5) {
    type = 'clouds';
  } else if (gorge.inRiver && !(Math.abs(z - (-10)) < 4.0 && x >= 22 && x <= 68)) {
    type = 'river';
  } else if (dist > 185 && height < 9.0) {
    type = 'cliff_rock';
  } else if (trail > 0.88) {
    type = 'asphalt_road';
  }

  return { type, height, trail };
}

/**
 * Exact Driving Surface Height (accounting for elevated road ribbons and bridges)
 */
export function getSurfaceHeight(x, z) {
  const trail = getTrailFactor(x, z);
  if (trail > 0.85) {
    const roadGrade = getEngineeredRoadGrade(x, z);
    return roadGrade + 0.12;
  }
  return getHeightAt(x, z);
}

/**
 * 2D Height Grid for Cannon-es Physics Heightfield
 */
export function sampleHeightGrid() {
  const size = TERRAIN_SIZE;
  const segs = SEGMENTS;
  const grid = [];

  for (let i = 0; i <= segs; i++) {
    const row = [];
    const z = (i / segs - 0.5) * size;
    for (let j = 0; j <= segs; j++) {
      const x = (j / segs - 0.5) * size;
      row.push(getHeightAt(x, z));
    }
    grid.push(row);
  }

  return grid;
}

/**
 * High-Resolution (2048x2048) Procedural Canvas Texture Generator
 * Features asphalt highways with crisp road markings, authentic terracotta cliff trail
 * matching the user reference photo, river canyon rock banks, mountain grass meadows, and cliff rims.
 */
export function createRealisticTerrainTextures() {
  if (typeof document === 'undefined') {
    return { albedoTexture: new THREE.Texture() };
  }
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 1. Lush Mountain Highland Grass Base (warm alpine meadows matching reference photo)
  const grad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size * 0.45);
  grad.addColorStop(0, '#587a38');    // Warm sunlit alpine grass
  grad.addColorStop(0.55, '#44612b'); // Rich sage meadow turf
  grad.addColorStop(0.82, '#314421'); // Deep mountain verge
  grad.addColorStop(1, '#20291a');    // Dark cliff rim
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // 2. Fine organic stippling for natural grass variation
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 1 + Math.random() * 4, 1 + Math.random() * 4);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 1 + Math.random() * 4, 1 + Math.random() * 4);
  }

  const worldToCanvas = (wx, wz) => ({
    x: ((wx / TERRAIN_SIZE) + 0.5) * size,
    y: ((wz / TERRAIN_SIZE) + 0.5) * size
  });

  // 3. Paint Mountain Riverbed Canyon
  ctx.beginPath();
  const riverP0 = worldToCanvas(getRiverCenter(-170), -170);
  ctx.moveTo(riverP0.x, riverP0.y);
  for (let rz = -165; rz <= 160; rz += 4) {
    const rp = worldToCanvas(getRiverCenter(rz), rz);
    ctx.lineTo(rp.x, rp.y);
  }
  // Canyon rock bed (wide dark basalt)
  ctx.strokeStyle = 'rgba(28, 34, 38, 0.95)';
  ctx.lineWidth = (32 / TERRAIN_SIZE) * size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Water edge wet shale
  ctx.strokeStyle = '#182b36';
  ctx.lineWidth = (18 / TERRAIN_SIZE) * size;
  ctx.stroke();

  // 4. Render Proper Asphalt Highway Network with Crisp Striping
  const drawHighway = (points, isCliffTrail = false) => {
    if (points.length < 2) return;

    if (isCliffTrail) {
      // Warm terracotta / dirt & gravel path leading to Sunset Cliff (Faithful to Reference Artwork)
      // A. Outer soft earthen verge
      ctx.beginPath();
      const p0 = worldToCanvas(points[0].x, points[0].z);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < points.length; i++) {
        const p = worldToCanvas(points[i].x, points[i].z);
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(139, 82, 42, 0.45)';
      ctx.lineWidth = (8.0 / TERRAIN_SIZE) * size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // B. Main terracotta dirt path
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < points.length; i++) {
        const p = worldToCanvas(points[i].x, points[i].z);
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = '#9d5a2d';
      ctx.lineWidth = (5.2 / TERRAIN_SIZE) * size;
      ctx.stroke();

      // C. Inner packed trail with warm highlight
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < points.length; i++) {
        const p = worldToCanvas(points[i].x, points[i].z);
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = '#ba723f';
      ctx.lineWidth = (3.0 / TERRAIN_SIZE) * size;
      ctx.stroke();
      return;
    }

    // A. Outer Gravel/Dirt Shoulder (8.0m wide)
    ctx.beginPath();
    const p0 = worldToCanvas(points[0].x, points[0].z);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < points.length; i++) {
      const p = worldToCanvas(points[i].x, points[i].z);
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = 'rgba(92, 70, 48, 0.75)';
    ctx.lineWidth = (8.0 / TERRAIN_SIZE) * size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);
    ctx.stroke();

    // B. Smooth Dark Asphalt Road Surface (5.6m wide)
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < points.length; i++) {
      const p = worldToCanvas(points[i].x, points[i].z);
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = '#1e2229';
    ctx.lineWidth = (5.6 / TERRAIN_SIZE) * size;
    ctx.stroke();

    // C. Crisp Solid White Shoulder Stripe Left (offset ~2.2m)
    // Draw offset parallel lines
    const drawOffsetLine = (offsetDist, color, width, dash = []) => {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const cur = points[i];
        let nx = 0, nz = 1;
        if (i < points.length - 1) {
          const next = points[i + 1];
          const dx = next.x - cur.x;
          const dz = next.z - cur.z;
          const len = Math.hypot(dx, dz) || 1;
          nx = -dz / len;
          nz = dx / len;
        } else if (i > 0) {
          const prev = points[i - 1];
          const dx = cur.x - prev.x;
          const dz = cur.z - prev.z;
          const len = Math.hypot(dx, dz) || 1;
          nx = -dz / len;
          nz = dx / len;
        }

        const ox = cur.x + nx * offsetDist;
        const oz = cur.z + nz * offsetDist;
        const p = worldToCanvas(ox, oz);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = (width / TERRAIN_SIZE) * size;
      ctx.setLineDash(dash);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // White edge stripes (0.16m wide at ±2.2m)
    drawOffsetLine(-2.2, 'rgba(255, 255, 255, 0.85)', 0.16);
    drawOffsetLine(2.2, 'rgba(255, 255, 255, 0.85)', 0.16);

    // Double golden yellow center lines (0.14m wide at ±0.15m)
    drawOffsetLine(-0.16, '#fbbf24', 0.14);
    drawOffsetLine(0.16, '#fbbf24', 0.14);
  };

  // Route 1A: South Sunset Highway Paved Section
  drawHighway([
    { x: 0, z: -70 },
    { x: 0, z: -30 },
    { x: 0, z: 0 }
  ]);

  // Route 1B: Terracotta Dirt Trail leading up to Sunset Cliff (matching user reference artwork)
  drawHighway([
    { x: 0, z: -118 },
    { x: 0, z: -95 },
    { x: 0, z: -70 }
  ], true);

  // Route 2: East Tech Highway (across Grand Suspension Bridge)
  drawHighway([
    { x: 0, z: 0 },
    { x: 24, z: -10 },
    { x: 66, z: -10 },
    { x: 95, z: 30 }
  ]);
  drawHighway([
    { x: 66, z: -10 },
    { x: 90, z: -50 }
  ]);

  // Route 3: West Industrial Parkway
  drawHighway([
    { x: 0, z: 0 },
    { x: -50, z: 5 },
    { x: -100, z: 25 }
  ]);
  drawHighway([
    { x: -50, z: 5 },
    { x: -90, z: -40 }
  ]);

  // Route 4: North Alpine Pass to Windmill Summit
  drawHighway([
    { x: 0, z: 0 },
    { x: 0, z: 65 },
    { x: 20, z: 95 },
    { x: -15, z: 115 },
    { x: 0, z: 135 }
  ]);

  // Route 5: Scenic Timber Bridge Route
  drawHighway([
    { x: 24, z: -10 },
    { x: 26, z: 35 },
    { x: 72, z: 58 },
    { x: 104, z: 58 },
    { x: 95, z: 30 }
  ]);

  // 5. Cliff Edge Rock Perimeter
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.43, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(34, 38, 44, 0.95)';
  ctx.lineWidth = (24 / TERRAIN_SIZE) * size;
  ctx.stroke();

  const albedoTexture = new THREE.CanvasTexture(canvas);
  albedoTexture.wrapS = THREE.ClampToEdgeWrapping;
  albedoTexture.wrapT = THREE.ClampToEdgeWrapping;
  albedoTexture.generateMipmaps = true;

  return { albedoTexture };
}
