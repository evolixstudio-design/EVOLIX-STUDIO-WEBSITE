import * as THREE from 'three';
import { NOTE_ARTWORK } from './config';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = t => { t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

function setup(host) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  camera.position.z = 9;
  scene.add(new THREE.AmbientLight(0xffffff, 2.4));
  const light = new THREE.DirectionalLight(0xffffff, 3.6); light.position.set(-3, 5, 5); scene.add(light);
  const rim = new THREE.DirectionalLight(0xc4b0ff, 2); rim.position.set(3, -2, 3); scene.add(rim);
  const resize = () => { const { width, height } = host.getBoundingClientRect(); renderer.setSize(Math.max(1, width), Math.max(1, height)); camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix(); };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  return { renderer, scene, camera, dispose: () => { observer.disconnect(); scene.traverse(o => { o.geometry?.dispose(); const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; mats.forEach(m => { m.map?.dispose(); m.dispose(); }); }); renderer.dispose(); renderer.domElement.remove(); } };
}

export function mountNote(host, { intro = false, onDone = () => {} } = {}) {
  const { renderer, scene, camera, dispose } = setup(host);
  const w = 4.9, h = w / NOTE_ARTWORK.aspect;
  const front = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const back = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const edge = new THREE.MeshStandardMaterial({ color: 0xe2d7bd, roughness: .7 });
  const geometry = new THREE.BoxGeometry(w, h, .014, 40, 16, 1);
  // Flat artwork stays level; the only rotation is the requested vertical-axis flip.
  const note = new THREE.Mesh(geometry, [edge, edge, edge, edge, front, back]); scene.add(note);
  let disposed = false, raf, start = null, finished = false, loaded = 0;
  host.style.opacity = '0';
  const loader = new THREE.TextureLoader();
  for (const [url, material] of [[NOTE_ARTWORK.front, front], [NOTE_ARTWORK.back, back]]) if (url) loader.load(url, texture => { if (disposed) return texture.dispose(); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(8,renderer.capabilities.getMaxAnisotropy()); material.map?.dispose(); material.map = texture; material.needsUpdate = true; loaded++; }, undefined, () => { if (!disposed) onDone(); });
  function frame(now) {
    if (disposed) return;
    if (loaded < 2) { raf = requestAnimationFrame(frame); return; }
    if (start === null) start = now;
    const t = (now - start) / 1000;
    if (intro && !reduced()) {
      const flip = ease((t - 1.0) / 1.55), zoom = ease((t - 3.8) / 1.4);
      note.rotation.set(0, Math.PI * (1 - flip), 0);
      const appear = .9 + .1 * ease(t / .55); note.scale.setScalar(appear);
      const distance = Math.max(h / (.32 * 2 * Math.tan(Math.PI / 10)), w / (.88 * camera.aspect * 2 * Math.tan(Math.PI / 10)));
      // Artwork landmark: centre of the main EVOLIX emblem at 33%, 25%.
      camera.position.set((.33-.5)*w*zoom, (.5-.25)*h*zoom, distance/(1+zoom*11));
      host.dataset.zooming = zoom > .05 ? 'true' : 'false';
      host.style.opacity = String(1 - ease((t - 5.0) / .45));
      if (t > 5.5 && !finished) { finished = true; onDone(); return; }
    } else {
      camera.position.z = camera.aspect < 1 ? 10 : 7.9;
      host.style.opacity = '1';
      note.rotation.set(0, 0, 0);
      note.position.y = 0;
      if (intro && !finished) { finished = true; onDone(); return; }
    }
    renderer.render(scene, camera);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  }
  const visibility = () => { if (!document.hidden && !disposed) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } };
  document.addEventListener('visibilitychange', visibility); raf = requestAnimationFrame(frame);
  return () => { disposed = true; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', visibility); dispose(); };
}
