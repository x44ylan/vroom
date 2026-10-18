import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCar, createStage } from '../three/heroCar.js';

const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = t => Math.min(1, Math.max(0, t));
const span = (t, a, b) => clamp01((t - a) / (b - a));

// Intro timeline (seconds). Plays once per session; reduced motion jumps to the end.
const INTRO = { grid: [0, 1.0], reveal: [0.6, 2.6], lamps: [2.5, 3.1], camera: [0, 3.6], end: 3.6 };
const CAM_FROM = { pos: new THREE.Vector3(3.4, 0.7, 6.0), target: new THREE.Vector3(0, 0.5, 0.9) };
const CAM_TO = { pos: new THREE.Vector3(7.0, 2.3, 6.6), target: new THREE.Vector3(0, 0.55, 0) };

export default function HeroCar() {
  const mountRef = useRef(null);
  const [state, setState] = useState('loading'); // loading | ready | failed

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setState('failed');
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const { scene, gridUniforms, contact } = createStage(renderer);
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Narrow frames need a wider lens to keep the whole car in view.
      camera.fov = w / h < 1.1 ? 34 : 26;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    let disposed = false, raf = 0, car, mats, uniforms, wheels = [];
    const playIntro = !reduceMotion && !sessionStorage.getItem('heroIntroPlayed');
    let t0 = 0;
    const spin = { angle: 0, velocity: 0, dragging: false, lastX: 0, lastT: 0 };
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(mount);

    // Drag to spin, with momentum. Vertical scrolling stays with the page.
    const el = renderer.domElement;
    el.style.touchAction = 'pan-y';
    const down = e => { spin.dragging = true; spin.lastX = e.clientX; spin.lastT = performance.now(); spin.velocity = 0; el.setPointerCapture(e.pointerId); };
    const move = e => {
      if (!spin.dragging) return;
      const now = performance.now(), dx = e.clientX - spin.lastX, dt = Math.max(1, now - spin.lastT);
      spin.angle += dx * 0.008;
      spin.velocity = (dx * 0.008) / (dt / 1000);
      spin.lastX = e.clientX; spin.lastT = now;
    };
    const up = () => { spin.dragging = false; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    loadCar(renderer).then(res => {
      if (disposed) return;
      ({ car, mats, uniforms, wheels } = res);
      scene.add(car);
      car.rotation.y = spin.angle;
      setState('ready');
      t0 = performance.now();
      window.__heroT0 = t0;
      if (playIntro) sessionStorage.setItem('heroIntroPlayed', '1');
      loop();
    }).catch(() => !disposed && setState('failed'));

    const clock = new THREE.Clock();
    const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();

    function loop() {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      const t = playIntro ? (now - t0) / 1000 : INTRO.end + 1;

      // Floor grid ring, paint scan, lamps.
      gridUniforms.uGrow.value = easeOut(span(t, ...INTRO.grid));
      contact.material.opacity = span(t, ...INTRO.reveal);
      uniforms.uReveal.value = easeInOut(span(t, ...INTRO.reveal));
      const lampT = span(t, ...INTRO.lamps);
      const flicker = lampT > 0 && lampT < 1 ? (Math.sin(lampT * 40) > -0.2 ? 1 : 0.15) : lampT;
      mats.lamp.emissiveIntensity = 1.4 * flicker;
      mats.tailLamp.emissiveIntensity = 2.2 * flicker;

      // Camera: a low, close sweep from the front corner out to the hero three-quarter view.
      const c = easeInOut(span(t, ...INTRO.camera));
      camPos.lerpVectors(CAM_FROM.pos, CAM_TO.pos, c);
      camTarget.lerpVectors(CAM_FROM.target, CAM_TO.target, c);
      const narrow = camera.aspect < 1.1 ? 1.25 : 1;
      camera.position.copy(camPos).multiplyScalar(narrow);
      camera.lookAt(camTarget);

      // Turntable: slow idle rotation after the intro; drag overrides with momentum.
      if (!spin.dragging) {
        spin.velocity *= Math.pow(0.04, dt);
        const idle = t > INTRO.end && !reduceMotion ? 0.12 : 0;
        spin.angle += (spin.velocity + idle) * dt;
      }
      car.rotation.y = spin.angle;
      uniforms.uCarInverse.value.copy(car.matrixWorld).invert();
      for (const w of wheels) w.rotation.x += (spin.velocity * 0.4) * dt;

      renderer.render(scene, camera);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      scene.traverse(o => { o.geometry?.dispose(); [o.material].flat().forEach(m => { if (!m) return; m.map?.dispose(); m.dispose(); }); });
      scene.environment?.dispose();
      renderer.dispose();
      el.remove();
    };
  }, []);

  return (
    <div className={`hero-car hero-car-${state}`} aria-hidden="true">
      <div ref={mountRef} className="hero-car-canvas" />
    </div>
  );
}
