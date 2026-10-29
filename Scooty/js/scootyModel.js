/**
 * @fileoverview Builds the complete 3D scooty model with all subassemblies.
 * Geometries are shared across symmetric pairs for lower memory usage.
 */

import * as THREE from 'three';
import { COLORS } from './config.js';

/**
 * Enables shadow casting and receiving on a mesh.
 * @param {THREE.Mesh} mesh
 * @returns {THREE.Mesh} The same mesh (for chaining)
 */
function enableShadow(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates a wheel assembly (front or rear).
 * @param {Object} materials — material references
 * @param {boolean} isRear — true for rear hub motor, false for front disc brake
 * @returns {THREE.Group}
 */
function createWheelAssembly(materials, isRear) {
  const { tireMat, darkTrimMat, chromeMat } = materials;
  const wheelGroup = new THREE.Group();

  // Fat Tubeless Tire
  const tireGeo = new THREE.TorusGeometry(0.34, 0.13, 28, 56);
  wheelGroup.add(enableShadow(new THREE.Mesh(tireGeo, tireMat)));

  // Alloy Rim
  const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32);
  rimGeo.rotateX(Math.PI / 2);
  wheelGroup.add(enableShadow(new THREE.Mesh(rimGeo, darkTrimMat)));

  // Machined Rim Lip (shared geometry, two positions)
  const lipGeo = new THREE.TorusGeometry(0.24, 0.015, 16, 48);
  const lipLeft = new THREE.Mesh(lipGeo, chromeMat);
  lipLeft.position.z = 0.07;
  const lipRight = lipLeft.clone();
  lipRight.position.z = -0.07;
  wheelGroup.add(lipLeft, lipRight);

  if (isRear) {
    // 1000W BLDC Sealed Hub Motor Core
    const motorGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.18, 32);
    motorGeo.rotateX(Math.PI / 2);
    wheelGroup.add(enableShadow(new THREE.Mesh(motorGeo, chromeMat)));
  } else {
    // 5-Spoke Front Alloy (shared spoke geometry)
    const spokeGeo = new THREE.BoxGeometry(0.04, 0.22, 0.04);
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(spokeGeo, chromeMat);
      const angle = (i * Math.PI * 2) / 5;
      spoke.position.set(Math.cos(angle) * 0.11, Math.sin(angle) * 0.11, 0);
      spoke.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(spoke);
    }

    // Front Disc Brake Rotor
    const discGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.012, 32);
    discGeo.rotateX(Math.PI / 2);
    const disc = new THREE.Mesh(discGeo, chromeMat);
    disc.position.z = 0.09;
    wheelGroup.add(disc);
  }

  return wheelGroup;
}

/**
 * Builds the front hydraulic fork and steering assembly.
 * @param {THREE.Group} parent — scooty group
 * @param {Object} materials
 */
function buildForkAssembly(parent, materials) {
  const { darkTrimMat, chromeMat, bodyMat } = materials;
  const forkAngle = -0.34; // ~19.5° rake

  // Shared fork tube geometries
  const lowerForkGeo = new THREE.CylinderGeometry(0.036, 0.032, 0.52, 20);
  const upperStanchionGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.45, 20);

  [-0.14, 0.14].forEach((zOffset) => {
    const lowerFork = enableShadow(new THREE.Mesh(lowerForkGeo, darkTrimMat));
    lowerFork.position.set(-0.90, 0.68, zOffset);
    lowerFork.rotation.z = forkAngle;
    parent.add(lowerFork);

    const upperStanchion = enableShadow(new THREE.Mesh(upperStanchionGeo, chromeMat));
    upperStanchion.position.set(-0.77, 1.02, zOffset);
    upperStanchion.rotation.z = forkAngle;
    parent.add(upperStanchion);
  });

  // Front Mudguard / Fender
  const fenderGeo = new THREE.CylinderGeometry(0.49, 0.49, 0.28, 32, 1, true, -Math.PI * 0.35, Math.PI * 0.65);
  fenderGeo.rotateX(Math.PI / 2);
  const frontFender = enableShadow(new THREE.Mesh(fenderGeo, bodyMat));
  frontFender.position.set(-0.98, 0.47, 0);
  parent.add(frontFender);
}

/**
 * Builds the front apron/fairing with headlamp.
 * @param {THREE.Group} parent — scooty group
 * @param {Object} materials
 * @returns {THREE.SpotLight} headlight spotlight reference
 */
function buildApronAssembly(parent, materials) {
  const { bodyMat, darkTrimMat, chromeMat, headlampGlowMat, accentMat } = materials;
  const forkAngle = -0.34;

  const apronGroup = new THREE.Group();
  apronGroup.position.set(-0.74, 1.08, 0);
  apronGroup.rotation.z = forkAngle;

  // Main Apron Body
  const mainApronGeo = new THREE.BoxGeometry(0.32, 0.86, 0.52);
  apronGroup.add(enableShadow(new THREE.Mesh(mainApronGeo, bodyMat)));

  // Inner Leg Shield
  const innerShieldGeo = new THREE.BoxGeometry(0.08, 0.82, 0.48);
  const innerShield = enableShadow(new THREE.Mesh(innerShieldGeo, darkTrimMat));
  innerShield.position.set(0.16, -0.02, 0);
  apronGroup.add(innerShield);

  // Storage Hook & Keyhole
  const hookGeo = new THREE.BoxGeometry(0.06, 0.06, 0.04);
  const hook = new THREE.Mesh(hookGeo, chromeMat);
  hook.position.set(0.20, 0.18, 0);
  apronGroup.add(hook);

  // Rectangular LED Headlamp Bezel
  const bezelGeo = new THREE.BoxGeometry(0.06, 0.17, 0.38);
  const bezel = new THREE.Mesh(bezelGeo, chromeMat);
  bezel.position.set(-0.15, -0.06, 0);
  apronGroup.add(bezel);

  // Headlamp Glow Surface
  const lampGeo = new THREE.BoxGeometry(0.07, 0.12, 0.32);
  const headlampMesh = new THREE.Mesh(lampGeo, headlampGlowMat);
  headlampMesh.position.set(-0.155, -0.06, 0);
  apronGroup.add(headlampMesh);

  // Green Accent Graphics on Front Nose
  const noseDecalGeo = new THREE.BoxGeometry(0.01, 0.22, 0.16);
  const noseDecal = new THREE.Mesh(noseDecalGeo, accentMat);
  noseDecal.position.set(-0.165, 0.18, 0);
  apronGroup.add(noseDecal);

  parent.add(apronGroup);

  // Real 3D Spotlight from Headlamp
  const headlightSpot = new THREE.SpotLight(COLORS.spotLight, 5, 14, Math.PI / 5, 0.45, 1.5);
  headlightSpot.position.set(-0.92, 1.02, 0);
  headlightSpot.target.position.set(-5.5, 0.1, 0);
  headlightSpot.castShadow = true;
  parent.add(headlightSpot);
  parent.add(headlightSpot.target);

  return headlightSpot;
}

/**
 * Builds the floorboard, battery compartment, and side strips.
 * @param {THREE.Group} parent — scooty group
 * @param {Object} materials
 */
function buildFloorboard(parent, materials) {
  const { bodyMat, darkTrimMat, accentMat } = materials;

  // Flat Floorboard / Battery Compartment (72V 30Ah LiFePO4)
  const deckGeo = new THREE.BoxGeometry(0.95, 0.18, 0.52);
  const deck = enableShadow(new THREE.Mesh(deckGeo, bodyMat));
  deck.position.set(-0.12, 0.52, 0);
  parent.add(deck);

  // Anti-slip rubber foot mat
  const matGeo = new THREE.BoxGeometry(0.84, 0.02, 0.46);
  const footMat = enableShadow(new THREE.Mesh(matGeo, darkTrimMat));
  footMat.position.set(-0.12, 0.62, 0);
  parent.add(footMat);

  // Neon Green Side Strips (shared geometry)
  const stripGeo = new THREE.BoxGeometry(0.75, 0.055, 0.015);
  [-0.265, 0.265].forEach((zPos) => {
    const strip = new THREE.Mesh(stripGeo, accentMat);
    strip.position.set(-0.08, 0.52, zPos);
    parent.add(strip);
  });

  // Kickstand / Side Stand
  const standGeo = new THREE.CylinderGeometry(0.016, 0.012, 0.42, 12);
  const kickstand = enableShadow(new THREE.Mesh(standGeo, darkTrimMat));
  kickstand.position.set(-0.05, 0.24, 0.28);
  kickstand.rotation.x = 0.42;
  kickstand.rotation.z = -0.15;
  parent.add(kickstand);
}

/**
 * Builds the underseat body, side panels, rear swingarm, and taillight.
 * @param {THREE.Group} parent — scooty group
 * @param {Object} materials
 */
function buildRearBody(parent, materials) {
  const { bodyMat, chromeMat, tailLightMat, sideDecalMat } = materials;

  // Lower pedestal rising from deck
  const riserGeo = new THREE.BoxGeometry(0.85, 0.46, 0.52);
  const riser = enableShadow(new THREE.Mesh(riserGeo, bodyMat));
  riser.position.set(0.55, 0.80, 0);
  parent.add(riser);

  // Side Logo Panels — CM Punjab Graphics (shared geometry)
  const panelGeo = new THREE.PlaneGeometry(0.68, 0.34);
  [-0.266, 0.266].forEach((zPos) => {
    const panel = new THREE.Mesh(panelGeo, sideDecalMat);
    panel.position.set(0.60, 0.84, zPos);
    if (zPos < 0) panel.rotation.y = Math.PI;
    parent.add(panel);
  });

  // Rear Swingarm & Shock Absorbers (shared geometries)
  const armGeo = new THREE.BoxGeometry(0.52, 0.11, 0.05);
  const shockGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.36, 16);

  [-0.22, 0.22].forEach((zPos) => {
    const swingarm = enableShadow(new THREE.Mesh(armGeo, chromeMat));
    swingarm.position.set(0.72, 0.48, zPos);
    parent.add(swingarm);

    const shock = enableShadow(new THREE.Mesh(shockGeo, chromeMat));
    shock.position.set(0.88, 0.66, zPos);
    shock.rotation.z = 0.22;
    parent.add(shock);
  });

  // Rear Taillight & Amber Reflector
  const tailGeo = new THREE.BoxGeometry(0.06, 0.12, 0.36);
  const tailLight = new THREE.Mesh(tailGeo, tailLightMat);
  tailLight.position.set(0.99, 0.92, 0);
  parent.add(tailLight);
}

/**
 * Builds the seat, grab rail, and pillion backrest.
 * @param {THREE.Group} parent — scooty group
 * @param {Object} materials
 */
function buildSeatAssembly(parent, materials) {
  const { seatLeatherMat, chromeMat } = materials;

  // Ergonomic Dual Seat
  const mainSeatGeo = new THREE.BoxGeometry(0.82, 0.16, 0.48);
  const mainSeat = enableShadow(new THREE.Mesh(mainSeatGeo, seatLeatherMat));
  mainSeat.position.set(0.52, 1.10, 0);
  parent.add(mainSeat);

  // Rounded front nose of seat
  const seatNoseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.48, 24);
  seatNoseGeo.rotateX(Math.PI / 2);
  const seatNose = enableShadow(new THREE.Mesh(seatNoseGeo, seatLeatherMat));
  seatNose.position.set(0.11, 1.10, 0);
  parent.add(seatNose);

  // Silver Rear Grab Rail
  const grabRailGeo = new THREE.BoxGeometry(0.28, 0.04, 0.52);
  const grabRail = enableShadow(new THREE.Mesh(grabRailGeo, chromeMat));
  grabRail.position.set(0.96, 1.10, 0);
  parent.add(grabRail);

  // Pillion Backrest Bracket & Cushion
  const bracketGeo = new THREE.BoxGeometry(0.05, 0.26, 0.14);
  const backrestBracket = enableShadow(new THREE.Mesh(bracketGeo, chromeMat));
  backrestBracket.position.set(1.06, 1.22, 0);
  backrestBracket.rotation.z = -0.18;
  parent.add(backrestBracket);

  const padGeo = new THREE.BoxGeometry(0.10, 0.20, 0.34);
  const backrestPad = enableShadow(new THREE.Mesh(padGeo, seatLeatherMat));
  backrestPad.position.set(1.02, 1.36, 0);
  backrestPad.rotation.z = -0.1;
  parent.add(backrestPad);
}

/**
 * Builds the handlebars, digital display, and rear-view mirrors.
 * @param {THREE.Group} parent — scooty group
 * @param {Object} materials
 */
function buildCockpit(parent, materials) {
  const { darkTrimMat, seatLeatherMat, chromeMat } = materials;

  const cockpitGroup = new THREE.Group();
  cockpitGroup.position.set(-0.56, 1.56, 0);

  // Handlebar Cross Tube
  const barGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.78, 20);
  barGeo.rotateX(Math.PI / 2);
  cockpitGroup.add(enableShadow(new THREE.Mesh(barGeo, darkTrimMat)));

  // Grips, Levers & Mirrors (shared geometries across both sides)
  const gripGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.16, 20);
  gripGeo.rotateX(Math.PI / 2);
  const leverGeo = new THREE.BoxGeometry(0.02, 0.015, 0.13);
  const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.24, 12);
  const mirrorHousingGeo = new THREE.BoxGeometry(0.04, 0.09, 0.14);

  [-0.36, 0.36].forEach((zPos) => {
    const grip = new THREE.Mesh(gripGeo, seatLeatherMat);
    grip.position.set(0, 0, zPos);
    cockpitGroup.add(grip);

    const lever = new THREE.Mesh(leverGeo, chromeMat);
    lever.position.set(-0.05, -0.01, zPos * 0.92);
    cockpitGroup.add(lever);

    const stem = new THREE.Mesh(stemGeo, darkTrimMat);
    stem.position.set(0, 0.12, zPos * 0.78);
    stem.rotation.x = zPos > 0 ? 0.35 : -0.35;
    cockpitGroup.add(stem);

    const mirrorHousing = enableShadow(new THREE.Mesh(mirrorHousingGeo, darkTrimMat));
    mirrorHousing.position.set(0.02, 0.24, zPos * 0.95);
    cockpitGroup.add(mirrorHousing);
  });

  // Center Digital Display Tablet
  const dashHousingGeo = new THREE.BoxGeometry(0.18, 0.12, 0.26);
  const dashHousing = enableShadow(new THREE.Mesh(dashHousingGeo, darkTrimMat));
  dashHousing.position.set(-0.02, 0.05, 0);
  dashHousing.rotation.z = -0.45;
  cockpitGroup.add(dashHousing);

  const screenGeo = new THREE.PlaneGeometry(0.14, 0.22);
  const screenMat = new THREE.MeshBasicMaterial({ color: COLORS.screenGreen });
  const dashScreen = new THREE.Mesh(screenGeo, screenMat);
  dashScreen.position.set(0.04, 0.09, 0);
  dashScreen.rotation.y = Math.PI / 2;
  dashScreen.rotation.x = -0.45;
  cockpitGroup.add(dashScreen);

  parent.add(cockpitGroup);
}

/* ══════════════════════════════════════════════════════════════════
 *  PUBLIC API
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Builds the complete scooty 3D model and adds it to the scene.
 * @param {THREE.Scene} scene
 * @param {Object} materials — all material references from createMaterials()
 * @returns {{ scooty: THREE.Group, frontWheel: THREE.Group, rearWheel: THREE.Group, headlightSpot: THREE.SpotLight }}
 */
export function buildScootyModel(scene, materials) {
  const { accentMat } = materials;

  const scooty = new THREE.Group();
  scene.add(scooty);

  // --- Wheels ---
  const frontWheel = createWheelAssembly(materials, false);
  frontWheel.position.set(-0.98, 0.47, 0);
  scooty.add(frontWheel);

  const rearWheel = createWheelAssembly(materials, true);
  rearWheel.position.set(0.95, 0.47, 0);
  scooty.add(rearWheel);

  // Front Brake Caliper
  const caliperGeo = new THREE.BoxGeometry(0.09, 0.12, 0.06);
  const caliper = new THREE.Mesh(caliperGeo, accentMat);
  caliper.position.set(-0.85, 0.55, 0.11);
  scooty.add(caliper);

  // --- Subassemblies ---
  buildForkAssembly(scooty, materials);
  const headlightSpot = buildApronAssembly(scooty, materials);
  buildFloorboard(scooty, materials);
  buildRearBody(scooty, materials);
  buildSeatAssembly(scooty, materials);
  buildCockpit(scooty, materials);

  return { scooty, frontWheel, rearWheel, headlightSpot };
}
