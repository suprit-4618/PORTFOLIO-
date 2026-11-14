import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getHeightAt, getBiomeAt, getSurfaceHeight } from './TerrainGenerator.js';
import { COLLISION_GROUPS } from './PhysicsEngine.js';

/**
 * Stylized Low-Poly Bicycle with Animated Pedaling Rider
 * Features:
 * - Stylized village bicycle with diamond frame, handlebars, basket, spoke wheels, and night headlight
 * - Low-poly cyclist with animated pedaling legs
 * - Dynamic banking/leaning into turns
 * - Real Cannon.js dynamic physics body
 * - Dynamic terrain height and pitch tracking
 */
export class ToyBicycle {
  constructor(physicsWorld, scene) {
    this.physicsWorld = physicsWorld;
    this.scene = scene;

    // Movement state
    const startX = -6.5;
    const startZ = -20.0;
    const startY = getHeightAt(startX, startZ) + 0.45;
    this.position = new THREE.Vector3(startX, startY, startZ);
    this.heading = 0; // Yaw in radians (0 = forward along +Z towards Gate & Town Square)
    this.speed = 0; // Linear speed
    this.steering = 0; // Steer angle
    this.bankAngle = 0; // Roll angle during turning
    this.pitch = 0;

    // Cozy, Relaxing Village Bicycle Dynamics
    this.maxSpeed = 8.5; // Cozy, controllable village cycling pace
    this.maxReverse = -3.5; // Gentle reverse pedaling
    this.baseAccel = 8.0; // Natural, progressive human pedaling curve
    this.brakePower = 18.0; // Gentle, responsive handbrake
    this.naturalDecel = 4.5; // Coasting deceleration
    this.turnSpeed = 2.2; // Smooth turning
    this.maxSteerAngle = 0.50;

    // Smooth Input Inertia
    this.pedalPower = 0; // 0 to 1 smooth pedaling effort
    this.brake = 0;

    // Animation states
    this.pedalRotation = 0; // Crankset angle in radians
    this.wheelRotation = 0;

    // Visual Objects
    this.group = new THREE.Group();
    this.group.rotation.order = 'YXZ';
    this.wheelMeshes = [];
    this.pedalMeshes = [];
    this.legRig = null;

    // Night Headlight
    this.headlightSpot = null;
    this.isNight = false;

    this.buildPhysicsBody();
    this.buildBicycleMesh();
    this.buildRiderMesh();
    this.buildHeadlight();
    this.scene.add(this.group);
  }

  buildPhysicsBody() {
    const startY = getHeightAt(this.position.x, this.position.z) + 0.45;
    this.body = new CANNON.Body({
      mass: 85, // Rider + Bicycle mass
      position: new CANNON.Vec3(this.position.x, startY, this.position.z),
      material: this.physicsWorld.materials.carMaterial,
      linearDamping: 0.05,
      angularDamping: 0.99
    });

    const chassisShape = new CANNON.Sphere(0.6);
    this.body.addShape(chassisShape, new CANNON.Vec3(0, 0.4, 0));

    // Vehicle collides with smashable props and solid obstacles, not the static terrain heightfield
    this.body.collisionFilterGroup = COLLISION_GROUPS.VEHICLE;
    this.body.collisionFilterMask = COLLISION_GROUPS.PROP | COLLISION_GROUPS.OBSTACLE;

    // Lock X & Z rotation so bicycle stays upright
    this.body.angularFactor.set(0, 1, 0);
    this.physicsWorld.world.addBody(this.body);
  }

  buildBicycleMesh() {
    // Materials
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9, // Electric Sky Blue frame
      roughness: 0.35,
      metalness: 0.2
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Silver chrome handlebars & cranks
      roughness: 0.25,
      metalness: 0.8
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1e242d, // Rubber tire
      roughness: 0.9
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3
    });

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Brown leather saddle & grips
      roughness: 0.7
    });

    const basketMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Woven wicker basket
      roughness: 0.85
    });

    // 1. Frame Tubes (Diamond Frame)
    const tubeMat = frameMat;
    const makeTube = (r1, r2, len) => {
      const geo = new THREE.CylinderGeometry(r1, r2, len, 8);
      return new THREE.Mesh(geo, tubeMat);
    };

    // Main frame group
    const frameGroup = new THREE.Group();

    // Bottom bracket (center of pedals) at (0, 0.35, 0)
    const bb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 12), chromeMat);
    bb.rotation.z = Math.PI / 2;
    bb.position.set(0, 0.35, 0);
    frameGroup.add(bb);

    // Seat tube (from BB to Saddle)
    const seatTube = makeTube(0.035, 0.035, 0.65);
    seatTube.position.set(0, 0.65, -0.15);
    seatTube.rotation.x = 0.25;
    frameGroup.add(seatTube);

    // Saddle / Seat
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.32), leatherMat);
    saddle.position.set(0, 0.98, -0.22);
    saddle.castShadow = true;
    frameGroup.add(saddle);

    // Down tube (from BB to Head tube)
    const downTube = makeTube(0.035, 0.035, 0.85);
    downTube.position.set(0, 0.6, 0.38);
    downTube.rotation.x = -0.65;
    frameGroup.add(downTube);

    // Top tube (horizontal from below seat to head tube)
    const topTube = makeTube(0.032, 0.032, 0.78);
    topTube.position.set(0, 0.88, 0.32);
    topTube.rotation.x = -0.12;
    frameGroup.add(topTube);

    // Head tube & Front Fork Steer Group
    this.steerGroup = new THREE.Group();
    this.steerGroup.position.set(0, 0.92, 0.72);

    const headStem = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.35, 8), chromeMat);
    this.steerGroup.add(headStem);

    // Handlebars
    const barGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.8, 8);
    barGeo.rotateZ(Math.PI / 2);
    const handlebars = new THREE.Mesh(barGeo, chromeMat);
    handlebars.position.set(0, 0.16, 0.05);
    this.steerGroup.add(handlebars);

    // Handlebar grips
    const gripGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.14, 8);
    gripGeo.rotateZ(Math.PI / 2);
    const leftGrip = new THREE.Mesh(gripGeo, leatherMat);
    leftGrip.position.set(-0.35, 0.16, 0.05);
    this.steerGroup.add(leftGrip);
    const rightGrip = new THREE.Mesh(gripGeo, leatherMat);
    rightGrip.position.set(0.35, 0.16, 0.05);
    this.steerGroup.add(rightGrip);

    // Front wicker basket
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.28), basketMat);
    basket.position.set(0, 0.08, 0.2);
    basket.castShadow = true;
    this.steerGroup.add(basket);

    // Front fork legs
    const forkLeft = makeTube(0.025, 0.02, 0.65);
    forkLeft.position.set(-0.09, -0.32, 0.06);
    forkLeft.rotation.x = -0.15;
    this.steerGroup.add(forkLeft);

    const forkRight = makeTube(0.025, 0.02, 0.65);
    forkRight.position.set(0.09, -0.32, 0.06);
    forkRight.rotation.x = -0.15;
    this.steerGroup.add(forkRight);

    // Front Wheel (attached to steerGroup so it pivots when turning)
    const frontWheelGroup = new THREE.Group();
    frontWheelGroup.position.set(0, -0.58, 0.15);
    const frontWheelMesh = this.createWheelMesh(tireMat, rimMat, chromeMat);
    frontWheelGroup.add(frontWheelMesh);
    this.steerGroup.add(frontWheelGroup);
    this.wheelMeshes.push({ group: frontWheelGroup, spinner: frontWheelMesh });

    frameGroup.add(this.steerGroup);

    // Rear Stays (from seat & BB to rear wheel hub)
    const rearStayL = makeTube(0.022, 0.022, 0.72);
    rearStayL.position.set(-0.08, 0.45, -0.48);
    rearStayL.rotation.x = 0.62;
    frameGroup.add(rearStayL);

    const rearStayR = makeTube(0.022, 0.022, 0.72);
    rearStayR.position.set(0.08, 0.45, -0.48);
    rearStayR.rotation.x = 0.62;
    frameGroup.add(rearStayR);

    // Rear Wheel
    const rearWheelGroup = new THREE.Group();
    rearWheelGroup.position.set(0, 0.35, -0.78);
    const rearWheelMesh = this.createWheelMesh(tireMat, rimMat, chromeMat);
    rearWheelGroup.add(rearWheelMesh);
    frameGroup.add(rearWheelGroup);
    this.wheelMeshes.push({ group: rearWheelGroup, spinner: rearWheelMesh });

    // 2. Crankset & Pedals
    this.crankGroup = new THREE.Group();
    this.crankGroup.position.set(0, 0.35, 0);

    const chainRing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), chromeMat);
    chainRing.rotation.z = Math.PI / 2;
    this.crankGroup.add(chainRing);

    // Left Crank & Pedal
    this.leftCrankArm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.03), chromeMat);
    this.leftCrankArm.position.set(-0.1, 0.08, 0);
    this.leftPedal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.08), tireMat);
    this.leftPedal.position.set(-0.15, 0.18, 0);
    this.crankGroup.add(this.leftCrankArm);
    this.crankGroup.add(this.leftPedal);

    // Right Crank & Pedal (180 deg opposite)
    this.rightCrankArm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.03), chromeMat);
    this.rightCrankArm.position.set(0.1, -0.08, 0);
    this.rightPedal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.08), tireMat);
    this.rightPedal.position.set(0.15, -0.18, 0);
    this.crankGroup.add(this.rightCrankArm);
    this.crankGroup.add(this.rightPedal);

    frameGroup.add(this.crankGroup);

    this.group.add(frameGroup);
  }

  createWheelMesh(tireMat, rimMat, spokeMat) {
    const wheel = new THREE.Group();

    // Outer tire
    const tireGeo = new THREE.TorusGeometry(0.34, 0.04, 10, 24);
    tireGeo.rotateY(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheel.add(tire);

    // Rim
    const rimGeo = new THREE.TorusGeometry(0.3, 0.015, 8, 20);
    rimGeo.rotateY(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    wheel.add(rim);

    // Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 10), spokeMat);
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);

    // Spokes (4 crossed rods)
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.6, 6), spokeMat);
      spoke.rotation.x = (i * Math.PI) / 4;
      wheel.add(spoke);
    }

    return wheel;
  }

  buildRiderMesh() {
    // Stylized Low-Poly Cyclist Character
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd2a4, // Warm peach skin
      roughness: 0.6
    });

    const clothMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vibrant Red Jacket/Hoodie
      roughness: 0.7
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark denim jeans
      roughness: 0.8
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White sneakers
      roughness: 0.4
    });

    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Bright yellow cyclist helmet
      roughness: 0.3
    });

    this.riderGroup = new THREE.Group();

    // 1. Torso & Hips (Seated slightly leaning forward towards handlebars)
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.24), pantsMat);
    hips.position.set(0, 1.05, -0.2);
    this.riderGroup.add(hips);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.45, 0.28), clothMat);
    torso.position.set(0, 1.32, -0.08);
    torso.rotation.x = 0.32; // Leaning forward
    torso.castShadow = true;
    this.riderGroup.add(torso);

    // 2. Head & Helmet
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), skinMat);
    head.position.set(0, 1.66, 0.08);
    this.riderGroup.add(head);

    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.32), helmetMat);
    helmet.position.set(0, 1.76, 0.08);
    helmet.castShadow = true;
    this.riderGroup.add(helmet);

    // 3. Arms reaching to handlebars
    // Left Arm
    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.38, 8), clothMat);
    leftUpperArm.position.set(-0.24, 1.35, 0.12);
    leftUpperArm.rotation.set(-0.7, 0, -0.2);
    this.riderGroup.add(leftUpperArm);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.35, 8), skinMat);
    leftForearm.position.set(-0.3, 1.15, 0.42);
    leftForearm.rotation.set(-0.4, 0, 0.15);
    this.riderGroup.add(leftForearm);

    // Right Arm
    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.38, 8), clothMat);
    rightUpperArm.position.set(0.24, 1.35, 0.12);
    rightUpperArm.rotation.set(-0.7, 0, 0.2);
    this.riderGroup.add(rightUpperArm);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.35, 8), skinMat);
    rightForearm.position.set(0.3, 1.15, 0.42);
    rightForearm.rotation.set(-0.4, 0, -0.15);
    this.riderGroup.add(rightForearm);

    // 4. Articulated Legs (Leg Rig for dynamic pedaling inverse kinematics)
    this.legRig = {
      leftThigh: new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.42, 8), pantsMat),
      leftShin: new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.42, 8), pantsMat),
      leftFoot: new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.2), shoeMat),

      rightThigh: new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.42, 8), pantsMat),
      rightShin: new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.42, 8), pantsMat),
      rightFoot: new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.2), shoeMat),

      hipL: new THREE.Vector3(-0.16, 1.02, -0.18),
      hipR: new THREE.Vector3(0.16, 1.02, -0.18)
    };

    this.riderGroup.add(this.legRig.leftThigh);
    this.riderGroup.add(this.legRig.leftShin);
    this.riderGroup.add(this.legRig.leftFoot);

    this.riderGroup.add(this.legRig.rightThigh);
    this.riderGroup.add(this.legRig.rightShin);
    this.riderGroup.add(this.legRig.rightFoot);

    this.group.add(this.riderGroup);
  }

  buildHeadlight() {
    // Vintage round front lamp
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.12, 12), lampMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(0, 0.88, 0.95);
    this.group.add(lamp);

    // Spotlight for night riding
    this.headlightSpot = new THREE.SpotLight(0xfffbeb, 0, 35, Math.PI / 5, 0.5, 1.2);
    this.headlightSpot.position.set(0, 0.9, 0.95);
    this.headlightSpot.target.position.set(0, 0.1, 14);
    this.group.add(this.headlightSpot);
    this.group.add(this.headlightSpot.target);
  }

  setNightMode(isNight) {
    this.isNight = isNight;
    if (this.headlightSpot) {
      this.headlightSpot.intensity = isNight ? 4.5 : 0;
    }
  }

  updateLegIK(hipPos, pedalLocalPos, thighMesh, shinMesh, footMesh) {
    // 2-Bone IK Solver for smooth pedaling legs
    const hip = hipPos;
    const foot = pedalLocalPos;
    const l1 = 0.42; // Thigh length
    const l2 = 0.42; // Shin length

    // Vector from hip to pedal foot
    const dir = new THREE.Vector3().subVectors(foot, hip);
    const d = Math.min(l1 + l2 - 0.01, Math.max(0.1, dir.length()));

    // Knee height angle using law of cosines
    const cosAngle = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
    const clampCos = Math.max(-1, Math.min(1, cosAngle));
    const alpha = Math.acos(clampCos);

    // Base direction angle
    const basePitch = Math.atan2(-dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));
    const thighPitch = -(basePitch + alpha * 0.9);

    // Position & orient thigh
    thighMesh.position.set(
      (hip.x + (hip.x + dir.x * 0.4)) / 2,
      (hip.y + (hip.y - Math.sin(alpha) * l1 * 0.85)) / 2,
      (hip.z + (hip.z + dir.z * 0.4)) / 2
    );
    thighMesh.rotation.set(thighPitch, 0, (dir.x > 0 ? 0.1 : -0.1));

    // Position shin
    const kneePos = new THREE.Vector3(
      hip.x + dir.x * 0.35,
      hip.y - Math.sin(alpha) * l1 * 0.95,
      hip.z + dir.z * 0.35
    );
    shinMesh.position.set(
      (kneePos.x + foot.x) / 2,
      (kneePos.y + foot.y) / 2,
      (kneePos.z + foot.z) / 2
    );
    const shinPitch = Math.atan2(kneePos.z - foot.z, kneePos.y - foot.y);
    shinMesh.rotation.set(shinPitch, 0, 0);

    // Position foot flat on pedal
    footMesh.position.copy(foot);
    footMesh.rotation.set(0, 0, 0);
  }

  applyInput(delta, input) {
    // 1. Smooth Steering
    let targetSteer = 0;
    if (input.left) targetSteer += this.maxSteerAngle;
    if (input.right) targetSteer -= this.maxSteerAngle;
    this.steering = THREE.MathUtils.lerp(this.steering, targetSteer, delta * 8.0);

    // 2. Progressive Acceleration & Power Curve
    if (input.forward) {
      this.pedalPower = THREE.MathUtils.lerp(this.pedalPower, 1.0, delta * 3.5);
      this.brake = THREE.MathUtils.lerp(this.brake, 0.0, delta * 8.0);

      const speedRatio = Math.max(0, Math.min(1.0, this.speed / this.maxSpeed));
      const powerCurve = Math.max(0.3, 1.0 - Math.pow(speedRatio, 1.3));
      const accelStep = this.baseAccel * powerCurve * this.pedalPower * delta;

      this.speed = Math.min(this.maxSpeed, this.speed + accelStep);
    } else if (input.backward) {
      this.pedalPower = THREE.MathUtils.lerp(this.pedalPower, 0.0, delta * 8.0);

      if (this.speed > 0.4) {
        // Handbrake
        this.brake = THREE.MathUtils.lerp(this.brake, 1.0, delta * 8.0);
        this.speed = Math.max(0, this.speed - this.brakePower * this.brake * delta);
      } else {
        // Slow reverse pedaling
        this.speed = Math.max(this.maxReverse, this.speed - (this.baseAccel * 0.6) * delta);
      }
    } else {
      // Coasting Deceleration
      this.pedalPower = THREE.MathUtils.lerp(this.pedalPower, 0.0, delta * 5.0);
      this.brake = THREE.MathUtils.lerp(this.brake, 0.0, delta * 5.0);

      const coastDecel = this.naturalDecel * delta;
      if (this.speed > 0) this.speed = Math.max(0, this.speed - coastDecel);
      else if (this.speed < 0) this.speed = Math.min(0, this.speed + coastDecel);
    }

    // 3. Turning & Yaw Heading
    if (Math.abs(this.speed) > 0.01 || input.forward || input.backward) {
      const forwardDir = this.speed >= 0 ? 1 : -1;
      const speedFactor = Math.min(1.0, Math.max(0.5, Math.abs(this.speed) / 1.6));
      const turnAmount = this.steering * this.turnSpeed * delta * forwardDir * speedFactor;
      this.heading += turnAmount;
    }

    // 4. Direct Kinematic Translation with Continuous Obstacle Collision Resolution
    const forwardX = Math.sin(this.heading);
    const forwardZ = Math.cos(this.heading);

    const totalDist = this.speed * delta;
    const steps = Math.max(1, Math.ceil(Math.abs(totalDist) / 0.35));
    const stepDelta = delta / steps;
    let anyCollision = false;
    let lastCol = null;

    for (let s = 0; s < steps; s++) {
      const candidatePos = {
        x: this.position.x + forwardX * this.speed * stepDelta,
        z: this.position.z + forwardZ * this.speed * stepDelta
      };

      // Check collision against all static buildings, lamp posts, trees, and fences
      const col = this.physicsWorld ? this.physicsWorld.resolveCollision(candidatePos, 0.65) : { collided: false };
      
      this.position.x = Math.max(-235, Math.min(235, candidatePos.x));
      this.position.z = Math.max(-235, Math.min(235, candidatePos.z));

      if (col.collided) {
        anyCollision = true;
        lastCol = col;
      }
    }

    // Impact physics reaction
    if (anyCollision && lastCol) {
      const dot = forwardX * lastCol.normal.x + forwardZ * lastCol.normal.z;
      if (dot < -0.35 && Math.abs(this.speed) > 1.5) {
        // Direct head-on collision: rebound bounce
        this.speed = -this.speed * 0.2;
      } else {
        // Glancing slide: redirect velocity along obstacle wall
        this.speed *= Math.max(0.6, 1.0 + dot * 0.4);
      }
    }

    // Update Cannon Physics Body
    this.body.position.x = this.position.x;
    this.body.position.z = this.position.z;
    this.body.velocity.x = forwardX * this.speed;
    this.body.velocity.z = forwardZ * this.speed;
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.heading);
  }

  syncTransform(delta) {
    // 1. Read Physics Body Position & Sample Driving Surface Elevation
    const forwardX = Math.sin(this.heading);
    const forwardZ = Math.cos(this.heading);
    const halfWheelbase = 0.8;

    const frontX = this.position.x + forwardX * halfWheelbase;
    const frontZ = this.position.z + forwardZ * halfWheelbase;
    const rearX = this.position.x - forwardX * halfWheelbase;
    const rearZ = this.position.z - forwardZ * halfWheelbase;

    const frontY = getSurfaceHeight(frontX, frontZ);
    const rearY = getSurfaceHeight(rearX, rearZ);
    const groundCenterY = (frontY + rearY) / 2;

    // Wheel radius is 0.34m: targetY sits exactly at groundCenterY + 0.34m so tires touch ground flush
    const targetY = groundCenterY + 0.34;
    this.position.y = THREE.MathUtils.lerp(this.position.y, targetY, delta * 24.0);
    if (this.position.y < targetY) this.position.y = targetY;

    this.body.position.y = this.position.y;
    this.body.velocity.y = 0;

    // 2. Terrain Slope Pitch & Dynamic Banking Lean
    // In 'YXZ' rotation order, positive local X tilts nose DOWN.
    const targetPitch = Math.atan2(rearY - frontY, halfWheelbase * 2);
    this.pitch = THREE.MathUtils.lerp(this.pitch, targetPitch, delta * 14.0);

    const targetBank = -this.steering * Math.min(1.0, Math.abs(this.speed) / this.maxSpeed) * 0.22;
    this.bankAngle = THREE.MathUtils.lerp(this.bankAngle, targetBank, delta * 8.0);

    // Sync group transform
    this.group.position.copy(this.position);
    this.group.rotation.set(this.pitch, this.heading, this.bankAngle);

    // 3. Steer Handlebars & Front Wheel
    if (this.steerGroup) {
      this.steerGroup.rotation.y = this.steering * 0.9;
    }

    // 4. Wheel & Crankset Rotation
    const wheelRadius = 0.34;
    const wheelAngleDelta = (this.speed * delta) / wheelRadius;
    this.wheelRotation += wheelAngleDelta;

    this.wheelMeshes.forEach((w) => {
      w.spinner.rotation.x = this.wheelRotation;
    });

    // 5. Crankset & Pedaling Legs Animation
    const crankRadius = 0.18;
    this.pedalRotation += (this.speed * delta * 4.2);
    if (this.crankGroup) {
      this.crankGroup.rotation.x = this.pedalRotation;
    }

    // Local positions of left and right pedals
    const leftPedalLocal = new THREE.Vector3(
      -0.15,
      0.35 - Math.sin(this.pedalRotation) * crankRadius,
      Math.cos(this.pedalRotation) * crankRadius
    );

    const rightPedalLocal = new THREE.Vector3(
      0.15,
      0.35 + Math.sin(this.pedalRotation) * crankRadius,
      -Math.cos(this.pedalRotation) * crankRadius
    );

    // Update Rider Leg Inverse Kinematics
    if (this.legRig) {
      this.updateLegIK(this.legRig.hipL, leftPedalLocal, this.legRig.leftThigh, this.legRig.leftShin, this.legRig.leftFoot);
      this.updateLegIK(this.legRig.hipR, rightPedalLocal, this.legRig.rightThigh, this.legRig.rightShin, this.legRig.rightFoot);
    }
  }

  reset(x = -6.5, z = -20.0) {
    const groundY = getHeightAt(x, z) + 0.45;
    this.position.set(x, groundY, z);
    this.speed = 0;
    this.pedalPower = 0;
    this.brake = 0;
    this.steering = 0;
    this.heading = 0;
    this.bankAngle = 0;
    this.pitch = 0;

    this.body.position.set(x, groundY, z);
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 0);

    this.group.position.copy(this.position);
    this.group.rotation.set(0, 0, 0);
  }

  getSpeedKmH() {
    return Math.round(Math.abs(this.speed) * 3.6);
  }

  getNitroPercent() {
    return 100;
  }

  isBoosting() {
    return false;
  }

  destroy() {
    this.physicsWorld.world.removeBody(this.body);
    this.scene.remove(this.group);
  }
}
