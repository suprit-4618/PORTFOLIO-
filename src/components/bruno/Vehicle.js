import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getHeightAt, getBiomeAt, getSurfaceHeight, smoothstep } from './TerrainGenerator.js';
import { COLLISION_GROUPS } from './PhysicsEngine.js';

/**
 * High-Performance GT Supercar (Option C)
 * Features:
 * - Beautifully sculpted supercar body (splitter, cockpit canopy, side scoops, diffuser, GT wing)
 * - Detailed multi-piece alloy wheels with brake calipers and rubber tires
 * - Snappy, exhilarating speed (100+ km/h cruising, 165+ km/h Nitro Boost)
 * - True 4-Corner Tire & Ground Physics (exact tire surface contact, no floating/sinking)
 * - Independent wheel suspension compression reacting to road bumps and terrain contours
 * - Authentic 2D Traction & Drift Physics (momentum, centrifugal lateral slip, counter-steering)
 * - Real Airborne Gravity & Landing Suspension Dynamics
 * - Surface-dependent tire grip (crisp on asphalt, loose drift on dirt, slip on grass)
 * - Full Nitro Boost System with multi-tier exhaust flame jets and burnout tire smoke
 */
export class ToyCar {
  constructor(physicsWorld, scene) {
    this.physicsWorld = physicsWorld;
    this.scene = scene;

    // Movement & 2D Vector Velocity state
    const startX = 0.0;
    const startZ = -28.0;
    const startY = getSurfaceHeight(startX, startZ) + 0.20;
    this.position = new THREE.Vector3(startX, startY, startZ);
    this.velocity = new THREE.Vector2(0, 0); // World 2D velocity (vx, vz)
    this.verticalVelocity = 0; // Vertical gravity & suspension velocity (m/s)
    this.isGrounded = true;
    this.heading = Math.PI; // Face South toward Sunset Cliff (-Z)
    this.speed = 0; // Forward linear speed magnitude (m/s)
    this.longitudinalSpeed = 0; // Signed forward speed
    this.lateralSlip = 0; // Sideways slip velocity
    this.steering = 0; // Steering angle
    this.pitch = 0; // Suspension pitch
    this.roll = 0; // Dynamic cornering and terrain roll
    this.surfaceType = 'asphalt_road';

    // Exhilarating Speed & Handling Dynamics
    this.maxSpeed = 28.0; // Cruise top speed (~101 km/h)
    this.nitroMaxSpeed = 46.0; // Nitro boost top speed (~166 km/h!)
    this.maxReverse = -9.0;
    this.baseAccel = 34.0; // Snappy, instant acceleration
    this.nitroAccel = 60.0; // High-thrust nitro kick
    this.brakePower = 42.0; // Firm, responsive braking
    this.dragFactor = 0.015;
    this.turnSpeed = 3.2;
    this.driftTurnSpeed = 4.4;
    this.maxSteerAngle = 0.52;

    // Nitro Boost State
    this.nitroAmount = 100.0;
    this.isNitroActive = false;
    this.isDrifting = false;

    // Input state
    this.throttle = 0;
    this.brake = 0;

    // Visual Objects
    this.group = new THREE.Group();
    this.group.rotation.order = 'YXZ'; // Critical: Yaw -> Pitch -> Roll ensures pitch & roll rotate in car's local axes
    this.wheelMeshes = [];
    this.exhaustFlames = [];

    // Particle & Skid Mark Pools (Pre-allocated to prevent GC spikes)
    this.smokePool = [];
    this.skidPool = [];
    this.skidPoolIndex = 0;
    this.maxSkids = 60;
    this.maxSmoke = 24;

    this.buildPhysicsBody();
    this.buildVisualMesh();
    this.buildParticleMaterials();
    this.scene.add(this.group);
  }

  buildPhysicsBody() {
    const startY = getSurfaceHeight(this.position.x, this.position.z) + 0.20;
    this.body = new CANNON.Body({
      mass: 150,
      position: new CANNON.Vec3(this.position.x, startY, this.position.z),
      material: this.physicsWorld.materials.carMaterial,
      linearDamping: 0.05,
      angularDamping: 0.99
    });

    const chassisSphere = new CANNON.Sphere(0.95);
    this.body.addShape(chassisSphere, new CANNON.Vec3(0, 0.7, 0));

    this.body.collisionFilterGroup = COLLISION_GROUPS.VEHICLE;
    this.body.collisionFilterMask = COLLISION_GROUPS.PROP | COLLISION_GROUPS.OBSTACLE;
    this.body.angularFactor.set(0, 1, 0);

    this.physicsWorld.world.addBody(this.body);
  }

  buildVisualMesh() {
    // Automotive PBR Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xdf2626, // Gloss Italian Racing Crimson
      roughness: 0.28,
      metalness: 0.28
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x181a1e, // Matte Carbon Fiber
      roughness: 0.45,
      metalness: 0.3
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0a101d, // Deep Privacy Tint
      roughness: 0.1,
      metalness: 0.75,
      transparent: true,
      opacity: 0.88
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95
    });

    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Red Sport Brake Calipers
      roughness: 0.3,
      metalness: 0.4
    });

    const wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430, // Gunmetal Alloy
      roughness: 0.25,
      metalness: 0.85
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x121418, // Rubber Tread
      roughness: 0.92
    });

    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xf8fafc,
      emissiveIntensity: 1.4
    });

    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.2
    });

    // 1. Lower Aerodynamic Belly & Splitter
    const bellyGeo = new THREE.BoxGeometry(2.0, 0.2, 4.2);
    const belly = new THREE.Mesh(bellyGeo, carbonMat);
    belly.position.y = 0.12;
    belly.castShadow = true;
    belly.receiveShadow = true;
    this.group.add(belly);

    // Front Aerodynamic Splitter
    const splitterGeo = new THREE.BoxGeometry(2.06, 0.08, 0.4);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(0, 0.08, 2.2);
    splitter.castShadow = true;
    this.group.add(splitter);

    // 2. Sculpted Supercar Main Body (Tapered Hood & Fenders)
    const mainChassisGeo = new THREE.BoxGeometry(1.92, 0.42, 3.8);
    const mainChassis = new THREE.Mesh(mainChassisGeo, bodyMat);
    mainChassis.position.y = 0.35;
    mainChassis.castShadow = true;
    this.group.add(mainChassis);

    // Sculpted Hood Scoop / Intake
    const hoodGeo = new THREE.BoxGeometry(1.5, 0.15, 1.4);
    const hood = new THREE.Mesh(hoodGeo, bodyMat);
    hood.position.set(0, 0.52, 1.1);
    hood.rotation.x = -0.06;
    hood.castShadow = true;
    this.group.add(hood);

    // 3. Curved Glass Cockpit Canopy
    const canopyGeo = new THREE.BoxGeometry(1.38, 0.45, 1.8);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.position.set(0, 0.76, -0.15);
    canopy.castShadow = true;
    this.group.add(canopy);

    // Interior Dashboard Glow (Visible through canopy)
    const dashGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.08, 0.15),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    dashGlow.position.set(0, 0.65, 0.6);
    this.group.add(dashGlow);

    // 4. Rear Engine Cover & Aero Diffuser
    const engineCoverGeo = new THREE.BoxGeometry(1.6, 0.22, 1.2);
    const engineCover = new THREE.Mesh(engineCoverGeo, carbonMat);
    engineCover.position.set(0, 0.56, -1.25);
    engineCover.castShadow = true;
    this.group.add(engineCover);

    // 5. Swan-Neck Carbon Fiber GT Rear Wing
    const wingGeo = new THREE.BoxGeometry(1.95, 0.06, 0.42);
    const wing = new THREE.Mesh(wingGeo, carbonMat);
    wing.position.set(0, 1.08, -1.85);
    wing.castShadow = true;
    this.group.add(wing);

    // Wing Endplates
    const endplateGeo = new THREE.BoxGeometry(0.04, 0.28, 0.44);
    [-0.98, 0.98].forEach((ex) => {
      const endplate = new THREE.Mesh(endplateGeo, carbonMat);
      endplate.position.set(ex, 1.08, -1.85);
      this.group.add(endplate);
    });

    // Wing Support Pylons
    const pylonGeo = new THREE.BoxGeometry(0.08, 0.48, 0.12);
    [-0.55, 0.55].forEach((px) => {
      const pylon = new THREE.Mesh(pylonGeo, carbonMat);
      pylon.position.set(px, 0.82, -1.8);
      pylon.rotation.x = -0.15;
      this.group.add(pylon);
    });

    // 6. Aggressive Front LED Headlights
    const lightGeo = new THREE.BoxGeometry(0.38, 0.08, 0.12);
    [-0.68, 0.68].forEach((hx) => {
      const head = new THREE.Mesh(lightGeo, headlightMat);
      head.position.set(hx, 0.42, 1.95);
      head.rotation.y = (hx > 0 ? -0.15 : 0.15);
      this.group.add(head);
    });

    // High-Intensity Projection Driving Spotlights
    this.spotLeft = new THREE.SpotLight(0xfffbeb, 0, 55, Math.PI / 5.5, 0.5, 1.2);
    this.spotLeft.position.set(-0.68, 0.45, 1.95);
    this.spotLeft.target.position.set(-0.68, 0.1, 20);
    this.group.add(this.spotLeft);
    this.group.add(this.spotLeft.target);

    this.spotRight = new THREE.SpotLight(0xfffbeb, 0, 55, Math.PI / 5.5, 0.5, 1.2);
    this.spotRight.position.set(0.68, 0.45, 1.95);
    this.spotRight.target.position.set(0.68, 0.1, 20);
    this.group.add(this.spotRight);
    this.group.add(this.spotRight.target);

    // 7. Full-Width Continuous Rear Neon Light Bar
    const tailBarGeo = new THREE.BoxGeometry(1.82, 0.08, 0.06);
    const tailBar = new THREE.Mesh(tailBarGeo, taillightMat);
    tailBar.position.set(0, 0.45, -1.98);
    this.group.add(tailBar);

    // 8. Quad Titanium Exhaust Tips & Animated Nitrous Flame Emitters
    const exhaustGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.28, 12);
    exhaustGeo.rotateX(Math.PI / 2);

    const flameGeo = new THREE.ConeGeometry(0.18, 0.95, 8);
    flameGeo.rotateX(-Math.PI / 2);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95
    });

    [-0.55, -0.35, 0.35, 0.55].forEach((ex, idx) => {
      const tip = new THREE.Mesh(exhaustGeo, chromeMat);
      tip.position.set(ex, 0.22, -1.96);
      this.group.add(tip);

      // Center pair have active nitrous exhaust jets
      if (idx === 1 || idx === 2) {
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(ex, 0.22, -2.5);
        flame.visible = false;
        this.group.add(flame);
        this.exhaustFlames.push(flame);
      }
    });

    // 9. Staggered Racing Wheels with Gunmetal Rims & Red Calipers
    const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 20);
    tireGeo.rotateZ(Math.PI / 2);

    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.34, 16);
    rimGeo.rotateZ(Math.PI / 2);

    const caliperGeo = new THREE.BoxGeometry(0.08, 0.18, 0.12);

    const wheelPlacements = [
      { id: 'FL', x: -1.06, y: 0.22, z: 1.25, isFront: true, isLeft: true },
      { id: 'FR', x: 1.06, y: 0.22, z: 1.25, isFront: true, isLeft: false },
      { id: 'RL', x: -1.06, y: 0.24, z: -1.25, isFront: false, isLeft: true },
      { id: 'RR', x: 1.06, y: 0.24, z: -1.25, isFront: false, isLeft: false }
    ];

    wheelPlacements.forEach((p) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(p.x, p.y, p.z);

      const spinner = new THREE.Group();
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, wheelRimMat);
      spinner.add(tire);
      spinner.add(rim);

      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(p.x > 0 ? -0.12 : 0.12, 0.12, 0);

      wheelGroup.add(spinner);
      wheelGroup.add(caliper);

      this.group.add(wheelGroup);
      this.wheelMeshes.push({
        id: p.id,
        group: wheelGroup,
        spinner,
        isFront: p.isFront,
        isLeft: p.isLeft,
        restY: p.y
      });
    });

    this.group.position.copy(this.position);
  }

  buildParticleMaterials() {
    this.smokeGeo = new THREE.DodecahedronGeometry(0.28, 0);
    this.smokeMat = new THREE.MeshBasicMaterial({
      color: 0xc49b71,
      transparent: true,
      opacity: 0.45
    });

    this.skidGeo = new THREE.PlaneGeometry(0.32, 0.8);
    this.skidGeo.rotateX(-Math.PI / 2);
    this.skidMat = new THREE.MeshBasicMaterial({
      color: 0x2e231b,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });

    for (let i = 0; i < this.maxSmoke; i++) {
      const puff = new THREE.Mesh(this.smokeGeo, this.smokeMat.clone());
      puff.visible = false;
      this.scene.add(puff);
      this.smokePool.push({
        mesh: puff,
        life: 0,
        decay: 0.038,
        velY: 0
      });
    }

    // Pre-allocate skid mark mesh pool to eliminate runtime allocations
    this.skidPool = [];
    this.skidPoolIndex = 0;
    for (let i = 0; i < this.maxSkids; i++) {
      const skid = new THREE.Mesh(this.skidGeo, this.skidMat);
      skid.visible = false;
      this.scene.add(skid);
      this.skidPool.push(skid);
    }
  }

  spawnDriftEffects() {
    const fwdX = Math.sin(this.heading);
    const fwdZ = Math.cos(this.heading);
    const rightX = Math.cos(this.heading);
    const rightZ = -Math.sin(this.heading);

    [-1.06, 1.06].forEach((sideX) => {
      const skid = this.skidPool[this.skidPoolIndex];
      this.skidPoolIndex = (this.skidPoolIndex + 1) % this.maxSkids;

      const rx = this.position.x - fwdX * 1.25 + rightX * sideX;
      const rz = this.position.z - fwdZ * 1.25 + rightZ * sideX;
      const ry = getSurfaceHeight(rx, rz) + 0.02;

      skid.position.set(rx, ry, rz);
      skid.rotation.y = this.heading;
      skid.visible = true;
    });

    const puff = this.smokePool.find((p) => p.life <= 0);
    if (puff) {
      const sideX = (Math.random() > 0.5 ? 1 : -1) * 1.06;
      const rx = this.position.x - fwdX * 1.25 + rightX * sideX;
      const rz = this.position.z - fwdZ * 1.25 + rightZ * sideX;
      const ry = getSurfaceHeight(rx, rz) + 0.06;

      puff.mesh.position.set(rx, ry, rz);
      puff.mesh.scale.setScalar(0.7 + Math.random() * 0.6);
      puff.mesh.material.opacity = 0.45;
      puff.mesh.visible = true;
      puff.life = 1.0;
      puff.decay = 0.038;
      puff.velY = 0.8 + Math.random() * 0.4;
    }
  }

  applyInput(delta, input) {
    // 1. Surface Biome Friction & Grip Dynamics
    const biome = getBiomeAt(this.position.x, this.position.z);
    this.surfaceType = biome.type;

    let grip = 1.0;
    let rollingResistance = 5.5;
    let speedLimitMult = 1.0;

    if (this.surfaceType === 'asphalt_road') {
      grip = 1.08;
      rollingResistance = 4.8;
      speedLimitMult = 1.0;
    } else if (this.surfaceType === 'dirt_trail') {
      grip = 0.82; // Authentic loose dirt slip
      rollingResistance = 7.2;
      speedLimitMult = 0.95;
    } else if (this.surfaceType === 'grass') {
      grip = 0.68; // Off-road turf slip
      rollingResistance = 12.0;
      speedLimitMult = 0.84;
    } else if (this.surfaceType === 'river') {
      grip = 0.35; // Water hydroplane
      rollingResistance = 26.0;
      speedLimitMult = 0.45;
    }

    // 2. Nitro Boost Handling
    const wantsNitro = !!input.nitro && input.forward && this.nitroAmount > 5.0 && Math.abs(this.longitudinalSpeed) > 1.5;
    if (wantsNitro) {
      this.isNitroActive = true;
      this.nitroAmount = Math.max(0, this.nitroAmount - delta * 26.0);
    } else {
      this.isNitroActive = false;
      this.nitroAmount = Math.min(100.0, this.nitroAmount + delta * 14.0);
    }

    const currentMaxSpeed = (this.isNitroActive ? this.nitroMaxSpeed : this.maxSpeed) * speedLimitMult;
    const currentAccel = (this.isNitroActive ? this.nitroAccel : this.baseAccel) * grip;

    // 3. High-Precision Steering with Speed-Sensitive Damping
    let targetSteer = 0;
    if (input.left) targetSteer += this.maxSteerAngle;
    if (input.right) targetSteer -= this.maxSteerAngle;
    this.steering = THREE.MathUtils.lerp(this.steering, targetSteer, delta * 12.0);

    // 4. Drift Check
    this.isDrifting = (!!input.drift) && (input.left || input.right) && Math.abs(this.longitudinalSpeed) > 3.0 && this.isGrounded;

    // 5. Angular Heading Updates (Steering Turn Rate)
    const activeTurnSpeed = this.isDrifting ? this.driftTurnSpeed : this.turnSpeed;
    if (Math.abs(this.longitudinalSpeed) > 0.05 || input.forward || input.backward) {
      const forwardDir = this.longitudinalSpeed >= 0 ? 1 : -1;
      const speedFactor = Math.min(1.0, Math.max(0.45, Math.abs(this.longitudinalSpeed) / 2.4));
      const turnGrip = this.isGrounded ? grip : 0.2; // In air, slight gyroscopic leveling
      const turnAmount = this.steering * activeTurnSpeed * delta * forwardDir * speedFactor * turnGrip;
      this.heading += turnAmount;
    }

    // 6. Vector 2D Decomposition (Local Forward & Lateral Velocities)
    const fwdX = Math.sin(this.heading);
    const fwdZ = Math.cos(this.heading);
    const rightX = Math.cos(this.heading);
    const rightZ = -Math.sin(this.heading);

    let vFwd = this.velocity.x * fwdX + this.velocity.y * fwdZ;
    let vLat = this.velocity.x * rightX + this.velocity.y * rightZ;

    // 7. Engine Traction & Braking (Longitudinal Force)
    if (input.forward && this.isGrounded) {
      this.throttle = THREE.MathUtils.lerp(this.throttle, 1.0, delta * 8.0);
      this.brake = THREE.MathUtils.lerp(this.brake, 0.0, delta * 12.0);

      const speedRatio = Math.max(0, Math.min(1.0, vFwd / currentMaxSpeed));
      const powerCurve = Math.max(0.35, 1.0 - Math.pow(speedRatio, 1.4));
      const accelStep = currentAccel * powerCurve * this.throttle * delta;
      vFwd = Math.min(currentMaxSpeed, vFwd + accelStep);
    } else if (input.backward && this.isGrounded) {
      this.throttle = THREE.MathUtils.lerp(this.throttle, 0.0, delta * 12.0);

      if (vFwd > 0.5) {
        this.brake = THREE.MathUtils.lerp(this.brake, 1.0, delta * 12.0);
        vFwd = Math.max(0, vFwd - this.brakePower * grip * this.brake * delta);
      } else {
        this.brake = THREE.MathUtils.lerp(this.brake, 0.0, delta * 10.0);
        vFwd = Math.max(this.maxReverse, vFwd - (this.baseAccel * 0.65 * grip) * delta);
      }
    } else {
      this.throttle = THREE.MathUtils.lerp(this.throttle, 0.0, delta * 8.0);
      this.brake = THREE.MathUtils.lerp(this.brake, 0.0, delta * 8.0);

      const coastDecel = (rollingResistance + Math.abs(vFwd) * this.dragFactor * 4.0) * delta;
      if (vFwd > 0) vFwd = Math.max(0, vFwd - coastDecel);
      else if (vFwd < 0) vFwd = Math.min(0, vFwd + coastDecel);
    }

    // 8. Tire Lateral Friction & Centrifugal Drift Sliding
    let lateralGripFactor = grip * 16.0;
    if (this.isDrifting) {
      lateralGripFactor *= 0.28; // Tires lose lateral friction for authentic powerslide
    } else if (!this.isGrounded) {
      lateralGripFactor = 0.4; // Zero tire friction in air
    }
    vLat = THREE.MathUtils.lerp(vLat, 0, Math.min(1.0, lateralGripFactor * delta));

    // 9. Reassemble World 2D Velocity Vector
    this.velocity.x = fwdX * vFwd + rightX * vLat;
    this.velocity.y = fwdZ * vFwd + rightZ * vLat;
    this.longitudinalSpeed = vFwd;
    this.lateralSlip = vLat;
    this.speed = Math.hypot(this.velocity.x, this.velocity.y) * (vFwd >= 0 ? 1 : -1);

    // 10. Multi-Step Continuous Obstacle Collision Resolution
    const totalDist = Math.hypot(this.velocity.x, this.velocity.y) * delta;
    const steps = Math.max(1, Math.ceil(totalDist / 0.35));
    const stepDelta = delta / steps;
    let anyCollision = false;
    let lastCol = null;

    for (let s = 0; s < steps; s++) {
      const candidatePos = {
        x: this.position.x + this.velocity.x * stepDelta,
        z: this.position.z + this.velocity.y * stepDelta
      };

      const col = this.physicsWorld ? this.physicsWorld.resolveCollision(candidatePos, 1.05) : { collided: false };

      this.position.x = Math.max(-235, Math.min(235, candidatePos.x));
      this.position.z = Math.max(-235, Math.min(235, candidatePos.z));

      if (col.collided) {
        anyCollision = true;
        lastCol = col;
      }
    }

    if (anyCollision && lastCol) {
      const dot = this.velocity.x * lastCol.normal.x + this.velocity.y * lastCol.normal.z;
      if (dot < 0) {
        this.velocity.x -= lastCol.normal.x * dot * 1.3;
        this.velocity.y -= lastCol.normal.z * dot * 1.3;
        this.velocity.multiplyScalar(0.72);
      }
    }

    this.body.position.x = this.position.x;
    this.body.position.z = this.position.z;
    this.body.velocity.x = this.velocity.x;
    this.body.velocity.z = this.velocity.y;
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.heading);
  }

  syncTransform(delta) {
    const fwdX = Math.sin(this.heading);
    const fwdZ = Math.cos(this.heading);
    const rightX = Math.cos(this.heading);
    const rightZ = -Math.sin(this.heading);

    const halfWB = 1.25;
    const halfTrack = 1.06;

    // 1. True 4-Corner Wheel Ground Sampling (Accounting for elevated asphalt & dirt trails)
    const FL_x = this.position.x + fwdX * halfWB - rightX * halfTrack;
    const FL_z = this.position.z + fwdZ * halfWB - rightZ * halfTrack;
    const FR_x = this.position.x + fwdX * halfWB + rightX * halfTrack;
    const FR_z = this.position.z + fwdZ * halfWB + rightZ * halfTrack;
    const RL_x = this.position.x - fwdX * halfWB - rightX * halfTrack;
    const RL_z = this.position.z - fwdZ * halfWB - rightZ * halfTrack;
    const RR_x = this.position.x - fwdX * halfWB + rightX * halfTrack;
    const RR_z = this.position.z - fwdZ * halfWB + rightZ * halfTrack;

    const yFL = getSurfaceHeight(FL_x, FL_z);
    const yFR = getSurfaceHeight(FR_x, FR_z);
    const yRL = getSurfaceHeight(RL_x, RL_z);
    const yRR = getSurfaceHeight(RR_x, RR_z);

    const frontGroundY = (yFL + yFR) / 2;
    const rearGroundY = (yRL + yRR) / 2;
    const leftGroundY = (yFL + yRL) / 2;
    const rightGroundY = (yFR + yRR) / 2;
    const groundCenterY = (frontGroundY + rearGroundY) / 2;

    // Ride height: front wheels restY = 0.22, radius = 0.42 -> bottom is at local -0.20
    // Setting targetY = groundCenterY + 0.20 places tire bottoms exactly at ground level
    const rideHeight = 0.20;
    const targetY = groundCenterY + rideHeight;

    // 2. Real Vertical Gravity & Ground Dynamics
    const groundThreshold = targetY + 0.08;
    if (this.position.y > groundThreshold) {
      // Airborne! Real freefall gravity
      this.isGrounded = false;
      this.verticalVelocity -= 26.0 * delta;
      this.position.y += this.verticalVelocity * delta;

      // Ground landing collision
      if (this.position.y <= targetY) {
        this.position.y = targetY;
        this.verticalVelocity = 0;
        this.isGrounded = true;
      }
    } else {
      // Firmly Grounded with fast, responsive tracking & hard zero-penetration clamp
      this.isGrounded = true;
      this.position.y = THREE.MathUtils.lerp(this.position.y, targetY, Math.min(1.0, delta * 30.0));
      if (this.position.y < targetY) {
        this.position.y = targetY;
        if (this.verticalVelocity < 0) this.verticalVelocity = 0;
      }
    }

    this.body.position.y = this.position.y;
    this.body.velocity.y = this.verticalVelocity;

    // 3. Dynamic Suspension Pitch & Weight Transfer
    // In 'YXZ' rotation order, positive local X tilts nose DOWN.
    // Downhill (front < rear => rear - front > 0) tilts nose DOWN (positive pitch).
    // Uphill (front > rear => rear - front < 0) tilts nose UP (negative pitch).
    const terrainPitch = Math.atan2(rearGroundY - frontGroundY, halfWB * 2);
    const squatPitch = -0.04 * this.throttle;
    const divePitch = 0.06 * this.brake;
    const targetPitch = terrainPitch + squatPitch + divePitch;
    this.pitch = THREE.MathUtils.lerp(this.pitch, targetPitch, Math.min(1.0, delta * 20.0));

    // 4. Dynamic Terrain Roll (Camber Alignment) & High-G Cornering Roll
    const terrainRoll = Math.atan2(rightGroundY - leftGroundY, halfTrack * 2);
    const speedRatio = Math.min(1.0, Math.abs(this.longitudinalSpeed) / this.maxSpeed);
    const corneringRoll = -this.steering * speedRatio * 0.10;
    const targetRoll = terrainRoll + corneringRoll;
    this.roll = THREE.MathUtils.lerp(this.roll, targetRoll, Math.min(1.0, delta * 18.0));

    // Sync visual group transform
    this.group.position.copy(this.position);
    this.group.rotation.set(this.pitch, this.heading, this.roll);

    // 5. Independent 4-Wheel Suspension Struts & Realistic Wheel Spin
    const wheelRadius = 0.42;
    const wheelSamplePoints = {
      FL: { x: FL_x, y: yFL, z: FL_z },
      FR: { x: FR_x, y: yFR, z: FR_z },
      RL: { x: RL_x, y: yRL, z: RL_z },
      RR: { x: RR_x, y: yRR, z: RR_z }
    };

    const invQuat = this.group.quaternion.clone().invert();
    const tempHubVec = new THREE.Vector3();

    // Burnout drive wheel slip when launching from standstill or drifting
    let driveSlip = 0;
    if (this.throttle > 0.6 && Math.abs(this.longitudinalSpeed) < 6.0 && this.isGrounded) {
      driveSlip = (6.0 - Math.abs(this.longitudinalSpeed)) * 1.8;
    } else if (this.isDrifting) {
      driveSlip = 8.0;
    }

    const wheelAngleDelta = (this.longitudinalSpeed / wheelRadius) * delta;

    this.wheelMeshes.forEach((w) => {
      // Steer front wheels
      if (w.isFront) {
        w.group.rotation.y = this.steering;
      }

      // Independent suspension: place wheel hub so tire bottom touches exact ground elevation
      const pt = wheelSamplePoints[w.id];
      const idealWorldHubY = (pt ? pt.y : groundCenterY) + wheelRadius;
      const worldHubX = pt ? pt.x : this.position.x;
      const worldHubZ = pt ? pt.z : this.position.z;

      tempHubVec.set(worldHubX - this.position.x, idealWorldHubY - this.position.y, worldHubZ - this.position.z);
      tempHubVec.applyQuaternion(invQuat);

      // Clamp suspension travel to ±14cm around restY
      const targetLocalY = THREE.MathUtils.clamp(tempHubVec.y, w.restY - 0.14, w.restY + 0.14);
      w.group.position.y = THREE.MathUtils.lerp(w.group.position.y, targetLocalY, Math.min(1.0, delta * 30.0));

      // Wheel rotation (rear wheels include burnout/drift power slip)
      const spinDelta = (!w.isFront) ? (wheelAngleDelta + driveSlip * delta) : wheelAngleDelta;
      w.spinner.rotation.x += spinDelta;
    });

    // 6. Nitrous Exhaust Flame Jets
    const flameActive = this.isNitroActive;
    this.exhaustFlames.forEach((flame) => {
      flame.visible = flameActive;
      if (flameActive) {
        const flicker = 0.85 + Math.random() * 0.4;
        flame.scale.set(flicker, flicker, flicker * (1.3 + Math.random() * 0.5));
      }
    });

    // 7. Drift Skid Marks & Dust
    if (this.isDrifting || (this.isNitroActive && Math.random() > 0.4) || (Math.abs(this.lateralSlip) > 2.5)) {
      this.spawnDriftEffects();
    }

    // 8. Pooled Smoke Lifecycle
    for (let i = 0; i < this.smokePool.length; i++) {
      const p = this.smokePool[i];
      if (p.life > 0) {
        p.life -= p.decay;
        p.mesh.position.y += p.velY * delta;
        p.mesh.scale.multiplyScalar(1.025);
        p.mesh.material.opacity = p.life * 0.45;

        if (p.life <= 0) {
          p.mesh.visible = false;
        }
      }
    }
  }

  getSpeedKmH() {
    return Math.round(Math.abs(this.speed) * 3.6);
  }

  getNitroPercent() {
    return Math.round(this.nitroAmount);
  }

  isBoosting() {
    return this.isNitroActive;
  }

  setNightMode(isNight) {
    const intensity = isNight ? 5.0 : 0;
    if (this.spotLeft) this.spotLeft.intensity = intensity;
    if (this.spotRight) this.spotRight.intensity = intensity;
  }

  reset(x = 0.0, z = -28.0, heading = Math.PI) {
    const groundY = getSurfaceHeight(x, z) + 0.20;
    this.position.set(x, groundY, z);
    this.velocity.set(0, 0);
    this.verticalVelocity = 0;
    this.isGrounded = true;
    this.speed = 0;
    this.longitudinalSpeed = 0;
    this.lateralSlip = 0;
    this.throttle = 0;
    this.brake = 0;
    this.steering = 0;
    this.heading = heading;
    this.pitch = 0;
    this.roll = 0;
    this.isDrifting = false;
    this.isNitroActive = false;
    this.nitroAmount = 100.0;

    this.body.position.set(x, groundY, z);
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), heading);

    this.group.position.copy(this.position);
    this.group.rotation.set(0, heading, 0);

    if (this.skidPool) {
      this.skidPool.forEach((s) => { s.visible = false; });
      this.skidPoolIndex = 0;
    }

    this.smokePool.forEach((p) => {
      p.life = 0;
      p.mesh.visible = false;
    });

    this.exhaustFlames.forEach((flame) => {
      flame.visible = false;
    });
  }

  destroy() {
    if (this.skidPool) {
      this.skidPool.forEach((s) => this.scene.remove(s));
    }
    this.smokePool.forEach((p) => {
      this.scene.remove(p.mesh);
      if (p.mesh.material) p.mesh.material.dispose();
    });
    if (this.smokeGeo) this.smokeGeo.dispose();
    if (this.skidGeo) this.skidGeo.dispose();
    if (this.skidMat) this.skidMat.dispose();
    this.physicsWorld.world.removeBody(this.body);
    this.scene.remove(this.group);
  }
}
