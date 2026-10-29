/**
 * @fileoverview UI event handlers — color swapper, headlight toggle,
 * motor throttle, auto-rotate, spec card camera presets.
 * All handlers are named functions for debuggability and removability.
 */

import { COLORS, CAMERA_PRESETS, HEADLIGHT } from './config.js';

/**
 * Initializes all interactive UI controls.
 * @param {Object} params
 * @param {Object} params.materials — material references
 * @param {THREE.Mesh} params.turntableRing — turntable ring mesh
 * @param {THREE.SpotLight} params.headlightSpot — headlamp spotlight
 * @param {import('three/addons/controls/OrbitControls.js').OrbitControls} params.controls
 * @param {Object} params.state — shared mutable application state
 * @param {HTMLElement} params.rendererDom — renderer's canvas DOM element
 */
export function initUI({ materials, turntableRing, headlightSpot, controls, state, rendererDom }) {
  const { bodyMat, accentMat, headlampGlowMat, tailLightMat } = materials;

  // ── DOM References ───────────────────────────────────────────
  const btnThrottle = document.getElementById('btnThrottle');
  const btnHeadlight = document.getElementById('btnHeadlight');
  const btnRotate = document.getElementById('btnRotate');
  const btnResetCam = document.getElementById('btnResetCam');
  const colorBlack = document.getElementById('colorBlack');
  const colorPink = document.getElementById('colorPink');

  // ── Color Swapper (Midnight Black vs Pastel Pink) ────────────
  function handleColorBlack() {
    bodyMat.color.setHex(COLORS.bodyBlack);
    accentMat.color.setHex(COLORS.accentGreen);
    accentMat.emissive.setHex(COLORS.accentGreen);
    turntableRing.material.color.setHex(COLORS.accentGreen);
    colorBlack.classList.add('active');
    colorPink.classList.remove('active');
  }

  function handleColorPink() {
    bodyMat.color.setHex(COLORS.bodyPink);
    accentMat.color.setHex(COLORS.accentPinkBody);
    accentMat.emissive.setHex(COLORS.accentPinkEmissive);
    turntableRing.material.color.setHex(COLORS.turntablePink);
    colorPink.classList.add('active');
    colorBlack.classList.remove('active');
  }

  colorBlack.addEventListener('click', handleColorBlack);
  colorPink.addEventListener('click', handleColorPink);

  // ── Headlight Toggle ─────────────────────────────────────────
  function handleHeadlightToggle() {
    state.headlightOn = !state.headlightOn;
    headlightSpot.visible = state.headlightOn;
    headlampGlowMat.emissiveIntensity = state.headlightOn ? HEADLIGHT.onHeadlamp : HEADLIGHT.offHeadlamp;
    tailLightMat.emissiveIntensity = state.headlightOn ? HEADLIGHT.onTaillight : HEADLIGHT.offTaillight;
    btnHeadlight.classList.toggle('active', state.headlightOn);
    btnHeadlight.textContent = state.headlightOn ? 'LED Headlamp: ON' : 'LED Headlamp: OFF';
  }

  btnHeadlight.addEventListener('click', handleHeadlightToggle);

  // ── 1000W BLDC Motor Throttle ────────────────────────────────
  function handleThrottleToggle() {
    state.motorRunning = !state.motorRunning;
    btnThrottle.classList.toggle('active', state.motorRunning);
    btnThrottle.textContent = state.motorRunning ? '1000W Motor: RUNNING' : 'Run 1000W Motor';
  }

  btnThrottle.addEventListener('click', handleThrottleToggle);

  // ── Auto-Turntable Toggle ────────────────────────────────────
  function handleAutoRotate() {
    controls.autoRotate = !controls.autoRotate;
    btnRotate.classList.toggle('active', controls.autoRotate);
  }

  btnRotate.addEventListener('click', handleAutoRotate);

  // ── Spec Card Camera Presets ─────────────────────────────────
  function handleSpecCardClick(event) {
    const key = event.currentTarget.getAttribute('data-cam');
    const preset = CAMERA_PRESETS[key];
    if (preset) {
      controls.autoRotate = false;
      btnRotate.classList.remove('active');
      state.targetCamPos = preset.pos;
      state.targetControlsTarget = preset.target;
    }
  }

  document.querySelectorAll('.spec-card').forEach((card) => {
    card.addEventListener('click', handleSpecCardClick);
  });

  // ── Reset Camera ─────────────────────────────────────────────
  function handleResetCamera() {
    state.targetCamPos = CAMERA_PRESETS.reset.pos;
    state.targetControlsTarget = CAMERA_PRESETS.reset.target;
  }

  btnResetCam.addEventListener('click', handleResetCamera);

  // ── Cancel camera tween on manual interaction ────────────────
  function handlePointerDown() {
    state.targetCamPos = null;
    state.targetControlsTarget = null;
  }

  rendererDom.addEventListener('pointerdown', handlePointerDown);
}
