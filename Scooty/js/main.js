/**
 * @fileoverview Entry point — bootstraps the entire 3D showcase.
 * Wires together scene, materials, model, UI, and animation modules.
 */

import { createScene } from './scene.js';
import { createMaterials } from './materials.js';
import { buildScootyModel } from './scootyModel.js';
import { initUI } from './ui.js';
import { startAnimationLoop } from './animation.js';

/* ── Shared Application State ──────────────────────────────────
 * Single mutable object passed by reference to UI and animation.
 * Centralizes all runtime state for clarity and traceability.
 */
const state = {
  motorRunning: false,
  currentSpeed: 0,
  headlightOn: true,
  targetCamPos: null,
  targetControlsTarget: null,
};

/* ── Bootstrap ─────────────────────────────────────────────────── */

const container = document.getElementById('canvas-container');

// 1. Scene infrastructure (renderer, camera, controls, lighting, floor)
const { scene, camera, renderer, controls, turntableRing } = createScene(container);

// 2. Materials
const materials = createMaterials();

// 3. Build the 3D scooty model
const { frontWheel, rearWheel, headlightSpot } = buildScootyModel(scene, materials);

// 4. Wire up UI event handlers
initUI({
  materials,
  turntableRing,
  headlightSpot,
  controls,
  state,
  rendererDom: renderer.domElement,
});

// 5. Start the animation loop
startAnimationLoop({
  renderer,
  scene,
  camera,
  controls,
  frontWheel,
  rearWheel,
  state,
});

/* ── Responsive Resize (debounced) ─────────────────────────────── */

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 100);
});
