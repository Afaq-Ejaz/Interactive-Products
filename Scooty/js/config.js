/**
 * @fileoverview Central configuration for the Scooty 3D Showcase.
 * All shared constants, color palettes, camera presets, and tuning values.
 */

import * as THREE from 'three';

/* ── Color Palette ─────────────────────────────────────────────── */

export const COLORS = {
  // Body color variants
  bodyBlack: 0x141619,
  bodyPink: 0xf48fb1,

  // Accent color variants
  accentGreen: 0x00e676,
  accentPinkBody: 0xffffff,
  accentPinkEmissive: 0xf8bbd0,
  turntablePink: 0xf48fb1,

  // Environment
  fog: 0x090d12,
  floor: 0x0b0f15,
  gridMain: 0x1e293b,
  gridSub: 0x111827,

  // Lighting
  ambient: 0xdbeafe,
  keyLight: 0xffffff,
  rimGreen: 0x00e676,
  rimBlue: 0x38bdf8,

  // Materials
  darkTrim: 0x1c1f24,
  seatLeather: 0x18191c,
  chrome: 0xd4d8dd,
  tire: 0x121316,
  headlampWhite: 0xffffff,
  headlampEmissive: 0xe0f2fe,
  tailRed: 0xff1744,
  screenGreen: 0x00e676,
  spotLight: 0xe0f2fe,
};

/* ── Camera Configuration ──────────────────────────────────────── */

export const CAMERA_CONFIG = {
  fov: 42,
  near: 0.1,
  far: 100,
  position: new THREE.Vector3(4.2, 2.3, 4.6),
  controlsTarget: new THREE.Vector3(0, 0.85, 0),
  dampingFactor: 0.05,
  maxPolarAngle: Math.PI / 2 - 0.02,
  minDistance: 2.0,
  maxDistance: 11.0,
  autoRotateSpeed: 1.0,
};

/** Camera presets for spec-card inspection views */
export const CAMERA_PRESETS = {
  battery: { pos: new THREE.Vector3(-0.2, 1.25, 2.3), target: new THREE.Vector3(-0.1, 0.55, 0) },
  motor:   { pos: new THREE.Vector3(1.5, 0.95, 2.1),  target: new THREE.Vector3(0.95, 0.47, 0) },
  front:   { pos: new THREE.Vector3(-2.1, 1.0, 1.9),  target: new THREE.Vector3(-0.95, 0.65, 0) },
  cockpit: { pos: new THREE.Vector3(0.4, 2.05, 1.4),  target: new THREE.Vector3(-0.56, 1.52, 0) },
  reset:   { pos: new THREE.Vector3(4.2, 2.3, 4.6),   target: new THREE.Vector3(0, 0.85, 0) },
};

/* ── Renderer Settings ─────────────────────────────────────────── */

export const RENDERER_CONFIG = {
  antialias: true,
  powerPreference: 'high-performance',
  maxPixelRatio: 2,
  shadowMapSize: 2048,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.15,
};

/* ── Animation Tuning ──────────────────────────────────────────── */

export const ANIMATION = {
  maxSpeed: 55,
  speedRampFactor: 3.5,
  wheelSpeedFactor: 16,
  cameraTweenSpeed: 5,
  cameraTweenThreshold: 0.03,
};

/* ── Headlight Intensity States ────────────────────────────────── */

export const HEADLIGHT = {
  onHeadlamp: 2.5,
  offHeadlamp: 0.05,
  onTaillight: 1.8,
  offTaillight: 0.1,
};
