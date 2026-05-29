/**
 * THREE-EFFECTS.JS — Individual Three.js visual effects
 *
 * Each export is a self-contained effect that accepts a Three.js
 * context ({ scene, camera }) and returns a cleanup function.
 *
 * Effects:
 *  - createParticleField  — floating particle constellation (hero bg)
 *  - createSkillSphere    — interactive rotating skill sphere
 */

import { THREE_CONFIG } from './config.js';
import { isMobile, prefersReducedMotion } from './utils.js';
import { initThreeScene, startRenderLoop, disposeThreeScene } from './three-setup.js';

// ============================================================
// PARTICLE FIELD (Hero background)
// ============================================================

/**
 * Creates a field of softly floating particles that react to
 * mouse movement. Renders into the given container element.
 *
 * @param {string} containerId - ID of the container element
 * @returns {Function} cleanup - Call to dispose all resources
 */
export function createParticleField(containerId) {
  if (prefersReducedMotion()) return () => {};

  const context = initThreeScene(containerId);
  if (!context) return () => {};

  const { scene, camera } = context;

  const count = isMobile()
    ? THREE_CONFIG.particleCount.mobile
    : THREE_CONFIG.particleCount.desktop;

  // Geometry — spread particles across a sphere volume
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds    = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 2.5 + Math.random() * 2;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    speeds[i]             = 0.0003 + Math.random() * 0.0006;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Material — glowing gold dots
  const material = new THREE.PointsMaterial({
    size: THREE_CONFIG.particleSize,
    color: 0xC9A84C,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.6;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Render loop update function
  let elapsed = 0;
  function update(timestamp) {
    elapsed += 0.008;

    // Gentle rotation + mouse tracking
    particles.rotation.y = elapsed * THREE_CONFIG.rotationSpeed * 20 + mouseX * 0.3;
    particles.rotation.x = mouseY * 0.2;

    // Individual particle drift via position manipulation
    const pos = geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(elapsed + i) * speeds[i];
    }
    pos.needsUpdate = true;
  }

  startRenderLoop(update);

  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    geometry.dispose();
    material.dispose();
    disposeThreeScene();
  };
}

// ============================================================
// SKILL SPHERE
// ============================================================

/**
 * Creates a 3D sphere of skill labels that rotates on mouse hover.
 * Falls back gracefully when WebGL is unavailable.
 *
 * @param {string} containerId - ID of the container element
 * @param {string[]} skillLabels - Array of skill text strings
 * @returns {Function} cleanup
 */
export function createSkillSphere(containerId, skillLabels) {
  if (prefersReducedMotion()) return () => {};

  const context = initThreeScene(containerId);
  if (!context) return () => {};

  const { scene, camera } = context;

  const group = new THREE.Group();
  scene.add(group);

  camera.position.z = 4;

  // Place skill nodes on a sphere using Fibonacci sphere algorithm
  const total = skillLabels.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  skillLabels.forEach((label, i) => {
    const y     = 1 - (i / (total - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta  = goldenAngle * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    const sphereGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: i % 3 === 0 ? 0xC9A84C : i % 3 === 1 ? 0x2D6A9F : 0x2D8C5A,
      transparent: true,
      opacity: 0.7,
    });

    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(x * 1.8, y * 1.8, z * 1.8);
    group.add(mesh);

    // Connecting line from centre
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x * 1.8, y * 1.8, z * 1.8),
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xC9A84C,
      transparent: true,
      opacity: 0.12,
    });
    group.add(new THREE.Line(lineGeo, lineMat));
  });

  let targetRotX = 0;
  let targetRotY = 0;

  function onMouseMove(event) {
    targetRotY = (event.clientX / window.innerWidth  - 0.5) * Math.PI * 0.4;
    targetRotX = (event.clientY / window.innerHeight - 0.5) * Math.PI * 0.2;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function update() {
    // Lerp towards target rotation for smooth tracking
    group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
    group.rotation.z += 0.002; // constant slow spin
  }

  startRenderLoop(update);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    disposeThreeScene();
  };
}
