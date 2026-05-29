/**
 * THREE-SETUP.JS — Three.js scene initialisation
 *
 * Provides a shared, reusable Three.js environment (renderer,
 * scene, camera) that individual effect modules can build on.
 * Handles resize events and proper disposal.
 */

import { THREE_CONFIG } from './config.js';
import { isMobile, supportsWebGL } from './utils.js';

// ============================================================
// MODULE STATE
// ============================================================

let renderer = null;
let scene    = null;
let camera   = null;
let animationFrameId = null;

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Initialises a Three.js scene inside the given canvas container.
 * Returns null if WebGL is unsupported or the container is missing.
 *
 * @param {string} containerId - ID of the DOM element to render into
 * @returns {{ renderer, scene, camera } | null}
 */
export function initThreeScene(containerId) {
  if (!supportsWebGL()) {
    console.info('[three-setup] WebGL not supported; skipping 3D effects.');
    return null;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`[three-setup] Container #${containerId} not found.`);
    return null;
  }

  // Dynamically import Three.js from CDN
  // (loaded as a global via <script> tag in index.html)
  if (typeof THREE === 'undefined') {
    console.warn('[three-setup] THREE global not available yet.');
    return null;
  }

  const width  = container.clientWidth;
  const height = container.clientHeight || 320;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    THREE_CONFIG.cameraFov,
    width / height,
    0.1,
    100
  );
  camera.position.z = THREE_CONFIG.cameraDistance;

  // Renderer — transparent background to blend with page
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  container.appendChild(renderer.domElement);

  // Resize observer
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight || 320;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  return { renderer, scene, camera };
}

/**
 * Starts the render loop. Calls the provided update function each frame.
 * @param {Function} updateFn - Called with (timestamp) each animation frame
 */
export function startRenderLoop(updateFn) {
  function tick(timestamp) {
    animationFrameId = requestAnimationFrame(tick);
    updateFn(timestamp);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  animationFrameId = requestAnimationFrame(tick);
}

/**
 * Stops the render loop and disposes of all Three.js resources.
 * Should be called when navigating away or unmounting the component.
 */
export function disposeThreeScene() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }

  if (renderer) {
    renderer.dispose();
    renderer.domElement?.parentNode?.removeChild(renderer.domElement);
  }

  scene    = null;
  camera   = null;
  renderer = null;
}
