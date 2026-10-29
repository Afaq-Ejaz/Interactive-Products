/**
 * @fileoverview Scene infrastructure — renderer, camera, controls,
 * studio lighting, and showroom floor.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, CAMERA_CONFIG, RENDERER_CONFIG } from './config.js';

/**
 * Creates the complete scene infrastructure.
 * @param {HTMLElement} container — DOM element to mount the renderer canvas
 * @returns {{ scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls, turntableRing: THREE.Mesh }}
 */
export function createScene(container) {
  // ── Scene ────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.fog, 0.035);

  // ── Camera ───────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  camera.position.copy(CAMERA_CONFIG.position);

  // ── Renderer ─────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    antialias: RENDERER_CONFIG.antialias,
    powerPreference: RENDERER_CONFIG.powerPreference,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDERER_CONFIG.maxPixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = RENDERER_CONFIG.toneMapping;
  renderer.toneMappingExposure = RENDERER_CONFIG.toneMappingExposure;
  container.appendChild(renderer.domElement);

  // ── OrbitControls ────────────────────────────────────────────
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = CAMERA_CONFIG.dampingFactor;
  controls.target.copy(CAMERA_CONFIG.controlsTarget);
  controls.maxPolarAngle = CAMERA_CONFIG.maxPolarAngle;
  controls.minDistance = CAMERA_CONFIG.minDistance;
  controls.maxDistance = CAMERA_CONFIG.maxDistance;
  controls.autoRotate = true;
  controls.autoRotateSpeed = CAMERA_CONFIG.autoRotateSpeed;

  // ── Studio Lighting ──────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(COLORS.ambient, 0.65);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(COLORS.keyLight, 2.2);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(RENDERER_CONFIG.shadowMapSize, RENDERER_CONFIG.shadowMapSize);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  const d = 4;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimLight1 = new THREE.DirectionalLight(COLORS.rimGreen, 1.4);
  rimLight1.position.set(-6, 4, -5);
  scene.add(rimLight1);

  const rimLight2 = new THREE.DirectionalLight(COLORS.rimBlue, 1.0);
  rimLight2.position.set(0, 5, -6);
  scene.add(rimLight2);

  // ── Showroom Floor ───────────────────────────────────────────
  const floorGeo = new THREE.CircleGeometry(18, 64);
  const floorMat = new THREE.MeshStandardMaterial({
    color: COLORS.floor,
    roughness: 0.35,
    metalness: 0.4,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Glowing Turntable Ring
  const ringGeo = new THREE.RingGeometry(2.15, 2.22, 96);
  const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.accentGreen, side: THREE.DoubleSide });
  const turntableRing = new THREE.Mesh(ringGeo, ringMat);
  turntableRing.rotation.x = -Math.PI / 2;
  turntableRing.position.y = 0.005;
  scene.add(turntableRing);

  const grid = new THREE.GridHelper(24, 48, COLORS.gridMain, COLORS.gridSub);
  grid.position.y = 0.002;
  scene.add(grid);

  return { scene, camera, renderer, controls, turntableRing };
}
