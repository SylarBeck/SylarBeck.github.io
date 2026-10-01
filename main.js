import * as THREE from './assets/vendor/three.module.js';
import { animate } from './assets/vendor/anime.esm.min.js';

const card = document.querySelector('.profile-card');
const banner = document.querySelector('.profile-banner');
const canvas = document.querySelector('#banner-scene');
const avatar = document.querySelector('.avatar');
const projectCard = document.querySelector('.project-card');
const projectLogo = document.querySelector('.project-art img');
const bannerGlyph = document.querySelector('.banner-glyph');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let motionEnabled = !reducedMotion.matches;

let renderer = null;
let scene = null;
let camera = null;
let stars = null;
let ringA = null;
let ringB = null;
let previousTime = 0;
let pointerX = 0;
let pointerY = 0;
let avatarAnimation = null;
let logoAnimation = null;
let glyphAnimation = null;
const introAnimations = [];

function setMotion(enabled) {
  motionEnabled = enabled;
  document.body.classList.toggle('motion-off', !enabled);

  if (!enabled) {
    introAnimations.forEach(animation => animation.cancel());
    avatarAnimation?.cancel();
    logoAnimation?.cancel();
    glyphAnimation?.cancel();
    card.style.opacity = '1';
    card.style.transform = '';
    projectCard.style.opacity = '1';
    projectCard.style.transform = '';
    avatar.style.transform = '';
    projectLogo.style.transform = '';
    bannerGlyph.style.transform = '';
  }

  updateRenderLoop();
}

reducedMotion.addEventListener('change', event => {
  setMotion(!event.matches);
});

function makeRing(radius, color, opacity, x, y, z) {
  const points = [];
  for (let index = 0; index <= 120; index += 1) {
    const angle = (index / 120) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const ring = new THREE.Line(geometry, material);
  ring.position.set(x, y, z);
  return ring;
}

function initializeScene() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(54, 1, 0.1, 100);
    camera.position.z = 13;

    let seed = 1789;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const positions = new Float32Array(160 * 3);
    for (let index = 0; index < 160; index += 1) {
      positions[index * 3] = (random() - 0.5) * 50;
      positions[index * 3 + 1] = (random() - 0.5) * 13;
      positions[index * 3 + 2] = (random() - 0.5) * 5;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    stars = new THREE.Points(geometry, new THREE.PointsMaterial({
      color: 0xe7e9ff,
      size: 0.07,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    }));
    scene.add(stars);

    ringA = makeRing(3.25, 0xd5d9ff, 0.32, 6.2, 1.2, -2);
    ringB = makeRing(4.1, 0xffffff, 0.16, 6.2, 1.2, -2.2);
    ringA.rotation.x = 0.8;
    ringB.rotation.x = 0.8;
    scene.add(ringA, ringB);

    const resize = () => {
      const width = Math.max(1, banner.clientWidth);
      const height = Math.max(1, banner.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };
    new ResizeObserver(resize).observe(banner);
    resize();
    updateRenderLoop();
  } catch {
    canvas.hidden = true;
    renderer = null;
  }
}

function renderFrame(time) {
  const delta = Math.min((time - previousTime) / 1000 || 0, 0.05);
  previousTime = time;
  stars.rotation.y += delta * 0.022;
  ringA.rotation.z += delta * 0.026;
  ringB.rotation.z -= delta * 0.018;
  stars.rotation.x += (pointerY * 0.065 - stars.rotation.x) * 0.035;
  stars.rotation.y += (pointerX * 0.12 - stars.rotation.y) * 0.025;
  renderer.render(scene, camera);
}

function updateRenderLoop() {
  if (!renderer) return;
  if (motionEnabled && !document.hidden) {
    previousTime = performance.now();
    renderer.setAnimationLoop(renderFrame);
  } else {
    renderer.setAnimationLoop(null);
    renderer.render(scene, camera);
  }
}

document.addEventListener('visibilitychange', updateRenderLoop);
card.addEventListener('pointermove', event => {
  if (!motionEnabled || event.pointerType === 'touch') return;
  const bounds = card.getBoundingClientRect();
  pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
});
card.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });

avatar.addEventListener('pointerenter', () => {
  if (!motionEnabled) return;
  avatarAnimation?.cancel();
  avatarAnimation = animate(avatar, { scale: 1.07, rotate: 2.5, duration: 380, ease: 'out(3)' });
});
avatar.addEventListener('pointerleave', () => {
  if (!motionEnabled) return;
  avatarAnimation?.cancel();
  avatarAnimation = animate(avatar, { scale: 1, rotate: 0, duration: 380, ease: 'out(3)' });
});

projectCard.addEventListener('pointerenter', () => {
  if (!motionEnabled) return;
  logoAnimation?.cancel();
  logoAnimation = animate(projectLogo, { scale: 1.035, x: 4, duration: 400, ease: 'out(3)' });
  glyphAnimation?.cancel();
  glyphAnimation = animate(bannerGlyph, { x: 10, duration: 600, ease: 'out(3)' });
});
projectCard.addEventListener('pointerleave', () => {
  if (!motionEnabled) return;
  logoAnimation?.cancel();
  logoAnimation = animate(projectLogo, { scale: 1, x: 0, duration: 400, ease: 'out(3)' });
  glyphAnimation?.cancel();
  glyphAnimation = animate(bannerGlyph, { x: 0, duration: 600, ease: 'out(3)' });
});

setMotion(motionEnabled);
initializeScene();

if (motionEnabled) {
  introAnimations.push(animate(card, { opacity: [0, 1], y: [18, 0], duration: 700, ease: 'out(3)' }));
  introAnimations.push(animate(avatar, { scale: [0.86, 1], duration: 620, delay: 130, ease: 'out(4)' }));
  introAnimations.push(animate(projectCard, { opacity: [0, 1], duration: 680, delay: 220, ease: 'out(3)' }));
}
