/**
 * @fileoverview All Three.js materials and the procedural CM Punjab decal texture.
 */

import * as THREE from 'three';
import { COLORS } from './config.js';

/**
 * Generates the CM Punjab side-panel canvas decal texture.
 * @returns {THREE.CanvasTexture}
 */
function createSideDecalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141619';
  ctx.fillRect(0, 0, 512, 256);

  // Green stripe
  ctx.fillStyle = '#00e676';
  ctx.fillRect(20, 210, 472, 16);

  // Emblem Circle
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(390, 110, 55, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#00e676';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('GOVT OF', 342, 105);
  ctx.fillText('PUNJAB', 345, 132);

  // Transport Dept Badge
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(150, 75, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('CM GREEN INITIATIVE', 45, 135);
  ctx.fillStyle = '#9ba8b8';
  ctx.font = '18px sans-serif';
  ctx.fillText('1000W BLDC • 72V LiFePO4', 45, 168);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates all materials used by the scooty model.
 * @returns {{ bodyMat, accentMat, darkTrimMat, seatLeatherMat, chromeMat, tireMat, headlampGlowMat, tailLightMat, sideDecalMat }}
 */
export function createMaterials() {
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.bodyBlack,
    roughness: 0.28,
    metalness: 0.35,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: COLORS.accentGreen,
    emissive: COLORS.accentGreen,
    emissiveIntensity: 0.25,
    roughness: 0.3,
  });

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: COLORS.darkTrim,
    roughness: 0.7,
    metalness: 0.2,
  });

  const seatLeatherMat = new THREE.MeshStandardMaterial({
    color: COLORS.seatLeather,
    roughness: 0.65,
    metalness: 0.05,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: COLORS.chrome,
    roughness: 0.15,
    metalness: 0.92,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: COLORS.tire,
    roughness: 0.88,
    metalness: 0.05,
  });

  const headlampGlowMat = new THREE.MeshStandardMaterial({
    color: COLORS.headlampWhite,
    emissive: COLORS.headlampEmissive,
    emissiveIntensity: 2.5,
  });

  const tailLightMat = new THREE.MeshStandardMaterial({
    color: COLORS.tailRed,
    emissive: COLORS.tailRed,
    emissiveIntensity: 1.8,
  });

  const sideDecalMat = new THREE.MeshStandardMaterial({
    map: createSideDecalTexture(),
    roughness: 0.35,
    metalness: 0.2,
  });

  return {
    bodyMat,
    accentMat,
    darkTrimMat,
    seatLeatherMat,
    chromeMat,
    tireMat,
    headlampGlowMat,
    tailLightMat,
    sideDecalMat,
  };
}
