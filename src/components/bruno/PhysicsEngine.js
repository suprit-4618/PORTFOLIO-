import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { 
  TERRAIN_SIZE, 
  SEGMENTS, 
  sampleHeightGrid, 
  getHeightAt, 
  getBiomeAt 
} from './TerrainGenerator.js';

export const COLLISION_GROUPS = {
  TERRAIN: 1,
  VEHICLE: 2,
  PROP: 4,
  OBSTACLE: 8
};

/**
 * Procedural Highland Island Physics Engine
 * Features:
 * - Deterministic CANNON.Heightfield matching Three.js visual mesh
 * - Continuous high-precision 2D obstacle penetration solver
 * - 6 Thematic Portfolio Proximity Discovery Trigger Zones linked to real projects
 */
export class BrunoPhysicsWorld {
  constructor(scene) {
    this.scene = scene;
    this.dynamicObjects = [];
    this.triggerZones = [];
    this.beaconMeshes = [];
    this.staticObstacles = [];

    this.initCannon();
    this.createHeightfieldTerrain();
    this.setupThematicTriggerZones();
  }

  addObstacle(obstacle) {
    this.staticObstacles.push(obstacle);
  }

  resolveCollision(candidatePos, radius = 0.95) {
    let result = {
      collided: false,
      normal: { x: 0, z: 0 },
      hitObstacle: null
    };

    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < this.staticObstacles.length; i++) {
        const obs = this.staticObstacles[i];

        if (obs.type === 'circle' || obs.type === 'cylinder') {
          const dx = candidatePos.x - obs.x;
          const dz = candidatePos.z - obs.z;
          const distSq = dx * dx + dz * dz;
          const minDist = obs.radius + radius;

          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            let nx = 0, nz = 1;
            if (dist > 0.0001) {
              nx = dx / dist;
              nz = dz / dist;
            }
            const penetration = minDist - dist;
            candidatePos.x += nx * penetration;
            candidatePos.z += nz * penetration;

            result.collided = true;
            result.normal.x = nx;
            result.normal.z = nz;
            result.hitObstacle = obs;
          }
        } else if (obs.type === 'box') {
          const rot = obs.rotation || 0;
          const relX = candidatePos.x - obs.x;
          const relZ = candidatePos.z - obs.z;

          const cos = Math.cos(-rot);
          const sin = Math.sin(-rot);
          const localX = relX * cos - relZ * sin;
          const localZ = relX * sin + relZ * cos;

          const hw = obs.halfW;
          const hd = obs.halfD;

          const cx = Math.max(-hw, Math.min(hw, localX));
          const cz = Math.max(-hd, Math.min(hd, localZ));

          const ldx = localX - cx;
          const ldz = localZ - cz;
          const ldistSq = ldx * ldx + ldz * ldz;

          if (ldistSq < radius * radius) {
            let lnx = 0, lnz = 0, lpen = 0;

            if (ldistSq > 0.0001) {
              const ldist = Math.sqrt(ldistSq);
              lnx = ldx / ldist;
              lnz = ldz / ldist;
              lpen = radius - ldist;
            } else {
              const dLeft = Math.abs(localX - (-hw));
              const dRight = Math.abs(hw - localX);
              const dBack = Math.abs(localZ - (-hd));
              const dFront = Math.abs(hd - localZ);
              const minD = Math.min(dLeft, dRight, dBack, dFront);

              if (minD === dLeft) { lnx = -1; lpen = dLeft + radius; }
              else if (minD === dRight) { lnx = 1; lpen = dRight + radius; }
              else if (minD === dBack) { lnz = -1; lpen = dBack + radius; }
              else { lnz = 1; lpen = dFront + radius; }
            }

            const resolvedLocalX = localX + lnx * lpen;
            const resolvedLocalZ = localZ + lnz * lpen;

            const worldCos = Math.cos(rot);
            const worldSin = Math.sin(rot);
            candidatePos.x = obs.x + resolvedLocalX * worldCos - resolvedLocalZ * worldSin;
            candidatePos.z = obs.z + resolvedLocalX * worldSin + resolvedLocalZ * worldCos;

            const worldNx = lnx * worldCos - lnz * worldSin;
            const worldNz = lnx * worldSin + lnz * worldCos;

            result.collided = true;
            result.normal.x = worldNx;
            result.normal.z = worldNz;
            result.hitObstacle = obs;
          }
        }
      }
    }

    return result;
  }

  initCannon() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -24.0, 0);
    this.world.allowSleep = true;

    const groundMat = new CANNON.Material('ground');
    const carMat = new CANNON.Material('car');
    const obstacleMat = new CANNON.Material('obstacle');

    this.materials = {
      groundMaterial: groundMat,
      carMaterial: carMat,
      obstacleMaterial: obstacleMat
    };

    const carObstacleContact = new CANNON.ContactMaterial(carMat, obstacleMat, {
      friction: 0.5,
      restitution: 0.0
    });

    const carGroundContact = new CANNON.ContactMaterial(carMat, groundMat, {
      friction: 0.85,
      restitution: 0.0
    });

    this.world.addContactMaterial(carObstacleContact);
    this.world.addContactMaterial(carGroundContact);
  }

  createHeightfieldTerrain() {
    const heightGrid = sampleHeightGrid();
    const elementSize = TERRAIN_SIZE / SEGMENTS;

    const heightfieldShape = new CANNON.Heightfield(heightGrid, {
      elementSize: elementSize
    });

    const terrainBody = new CANNON.Body({
      mass: 0,
      material: this.materials.groundMaterial
    });

    terrainBody.addShape(heightfieldShape);
    terrainBody.collisionFilterGroup = COLLISION_GROUPS.TERRAIN;
    terrainBody.collisionFilterMask = COLLISION_GROUPS.PROP;

    terrainBody.position.set(-TERRAIN_SIZE / 2, 0, TERRAIN_SIZE / 2);
    terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.world.addBody(terrainBody);
    this.terrainBody = terrainBody;
  }

  setupThematicTriggerZones() {
    this.triggerZones = [
      {
        id: 'zone-about',
        category: 'about',
        type: 'resume',
        name: "The Founder's Alpine Lodge",
        tag: 'About Me & Bio',
        title: 'Suprit K.L. · Software Engineer & Researcher',
        desc: 'Meet Suprit: background in Applied Machine Learning, full-stack systems, education, and engineering philosophy.',
        data: { section: 'about' },
        center: new THREE.Vector2(-20, -35),
        radius: 12.0
      },
      {
        id: 'zone-skills',
        category: 'skills',
        type: 'resume',
        name: "The Artisan's Tech Forge",
        tag: 'Skills & Tech Stack',
        title: '33+ Core Languages, AI/ML & Cloud Frameworks',
        desc: 'Explore hands-on expertise: PyTorch, Python, React, Node.js, AWS, Docker, CUDA, Scikit-Learn, and systems architecture.',
        data: { section: 'skills' },
        center: new THREE.Vector2(-55, 12),
        radius: 12.0
      },
      {
        id: 'zone-experience',
        category: 'experience',
        type: 'resume',
        name: "The Forest Guild Tavern",
        tag: 'Engineering Experience',
        title: 'TAP Academy, K-tech NAIN & Salesforce Dev',
        desc: 'Professional work history, industry internships, research innovation grants, and technical milestones.',
        data: { section: 'experience' },
        center: new THREE.Vector2(42, 48),
        radius: 12.0
      },
      {
        id: 'zone-projects',
        category: 'projects',
        type: 'resume',
        name: "The Highland Innovation Manor",
        tag: 'Flagship AI Projects',
        title: 'AgriVerseAI, Semantic RAG, Job Scout & Rumi AI',
        desc: 'Deep-dive into 5 production-grade AI applications with interactive demonstrations and code architectures.',
        data: { section: 'projects' },
        center: new THREE.Vector2(92, 32),
        radius: 14.0
      },
      {
        id: 'zone-publications',
        category: 'publications',
        type: 'resume',
        name: "The Scholar's Stone Scriptorium",
        tag: 'Published Research',
        title: 'Peer-Reviewed Journal Papers & DOI Index',
        desc: 'Review published research in smart agronomy, computer vision, and bilingual regional NLP (IRJMETS DOI: 10.56726/IRJMETS78194).',
        data: { section: 'publications' },
        center: new THREE.Vector2(84, -48),
        radius: 12.0
      },
      {
        id: 'zone-certificates',
        category: 'certificates',
        type: 'resume',
        name: "The Village Academy of Seals",
        tag: 'Credentials & Badges',
        title: 'Salesforce, AWS, HackerRank & Udemy Certified',
        desc: 'Verified professional certifications including Salesforce Marketing Cloud Engagement Specialist (ID: 8193916) and AWS AI Track.',
        data: { section: 'certificates' },
        center: new THREE.Vector2(-80, -38),
        radius: 12.0
      },
      {
        id: 'zone-contact',
        category: 'contact',
        type: 'resume',
        name: "The Crossroads Courier Posthouse",
        tag: 'Contact & Collaboration',
        title: 'Send a Message, Connect & Download Resume',
        desc: 'Reach out directly: email supritkl@gmail.com, LinkedIn, GitHub, or download the official PDF resume.',
        data: { section: 'contact' },
        center: new THREE.Vector2(-16, 30),
        radius: 12.0
      },
      {
        id: 'zone-sunset-cliff',
        category: 'story',
        type: 'story',
        name: 'Sunset Precipice Lookout',
        tag: 'Engineering Vision',
        title: "Suprit's Horizon Over the Clouds",
        desc: 'Where software craft meets artificial intelligence high above the clouds. Building reliable, high-performance intelligent systems.',
        data: { section: 'horizon' },
        center: new THREE.Vector2(0, -114),
        radius: 12.0
      }
    ];

    // Animated holographic beacon rings on the ground
    const beaconGeo = new THREE.RingGeometry(3.6, 4.2, 32);
    beaconGeo.rotateX(-Math.PI / 2);

    this.triggerZones.forEach((z, idx) => {
      const colors = [0x10b981, 0x38bdf8, 0x818cf8, 0xf59e0b, 0xec4899, 0xf97316, 0x06b6d4];
      const beaconMat = new THREE.MeshBasicMaterial({
        color: colors[idx % colors.length],
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(beaconGeo, beaconMat);
      const groundY = getHeightAt(z.center.x, z.center.y) + 0.15;
      ring.position.set(z.center.x, groundY, z.center.y);
      this.scene.add(ring);
      this.beaconMeshes.push({ mesh: ring, baseY: groundY, phase: idx * 0.9 });
    });
  }

  updateVehicleBiome(vehiclePos) {
    const { type } = getBiomeAt(vehiclePos.x, vehiclePos.z);
    return type;
  }

  update(delta, carPosition) {
    this.world.step(1 / 60, delta, 8);

    const time = Date.now() * 0.003;
    this.beaconMeshes.forEach((b) => {
      if (b.mesh) {
        b.mesh.rotation.y += delta * 0.45;
        const scale = 1.0 + Math.sin(time + b.phase) * 0.1;
        b.mesh.scale.set(scale, scale, 1);
      }
    });

    const carPos2D = new THREE.Vector2(carPosition.x, carPosition.z);
    for (let zone of this.triggerZones) {
      const dist = carPos2D.distanceTo(zone.center);
      if (dist < zone.radius) {
        return zone;
      }
    }
    return null;
  }

  destroy() {
    this.beaconMeshes.forEach((b) => {
      this.scene.remove(b.mesh);
    });
    if (this.terrainBody) {
      this.world.removeBody(this.terrainBody);
    }
  }
}
