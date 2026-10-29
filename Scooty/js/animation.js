/**
 * @fileoverview Animation loop — speed simulation, wheel rotation,
 * camera tweening. DOM writes are throttled to value-change-only.
 */

import * as THREE from 'three';
import { ANIMATION } from './config.js';

/**
 * Starts the main render/animation loop.
 * @param {Object} params
 * @param {THREE.WebGLRenderer} params.renderer
 * @param {THREE.Scene} params.scene
 * @param {THREE.PerspectiveCamera} params.camera
 * @param {import('three/addons/controls/OrbitControls.js').OrbitControls} params.controls
 * @param {THREE.Group} params.frontWheel
 * @param {THREE.Group} params.rearWheel
 * @param {Object} params.state — shared mutable application state
 */
export function startAnimationLoop({ renderer, scene, camera, controls, frontWheel, rearWheel, state }) {
  const clock = new THREE.Clock();
  const speedReadout = document.getElementById('speedValue');

  /** Cache last displayed value to avoid redundant DOM writes */
  let lastDisplayedSpeed = -1;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // ── Speed Simulation ───────────────────────────────────────
    const targetSpeed = state.motorRunning ? ANIMATION.maxSpeed : 0;
    state.currentSpeed += (targetSpeed - state.currentSpeed) * delta * ANIMATION.speedRampFactor;

    // Only touch DOM when the rounded value actually changes
    const displaySpeed = Math.round(state.currentSpeed);
    if (displaySpeed !== lastDisplayedSpeed) {
      speedReadout.textContent = displaySpeed < 10 ? `0${displaySpeed}` : `${displaySpeed}`;
      lastDisplayedSpeed = displaySpeed;
    }

    // ── Wheel Rotation ─────────────────────────────────────────
    if (state.currentSpeed > 0.1) {
      const angularVelocity = (state.currentSpeed / ANIMATION.maxSpeed) * ANIMATION.wheelSpeedFactor * delta;
      frontWheel.rotation.z += angularVelocity;
      rearWheel.rotation.z += angularVelocity;
    }

    // ── Camera Tweening ────────────────────────────────────────
    if (state.targetCamPos && state.targetControlsTarget) {
      camera.position.lerp(state.targetCamPos, delta * ANIMATION.cameraTweenSpeed);
      controls.target.lerp(state.targetControlsTarget, delta * ANIMATION.cameraTweenSpeed);
      if (camera.position.distanceTo(state.targetCamPos) < ANIMATION.cameraTweenThreshold) {
        state.targetCamPos = null;
        state.targetControlsTarget = null;
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
