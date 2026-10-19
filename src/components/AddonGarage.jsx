import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadCar, createStage } from '../three/heroCar.js';
import { buildAddons, RIDE_DROP } from '../three/addons.js';
import { ADDONS, ADDON_GROUPS, ADDON_BY_ID, BASE_CD, BASE_CLEARANCE } from '../data/addons.js';
import { Check, RotateCcw } from 'lucide-react';

const view = (p, t) => ({ position: new THREE.Vector3(...p), target: new THREE.Vector3(...t) });
// A camera angle that shows where each add-on goes.
const VIEWS = {
  overview: view([4.6, 1.9, -4.8], [0, 0.6, -0.2]),
  lip: view([2.4, 0.75, 4.6], [0, 0.3, 1.9]),
  skirts: view([4.9, 0.9, 0.9], [0, 0.35, 0.1]),
  diffuser: view([2.2, 0.55, -4.6], [0, 0.3, -1.9]),
  wing: view([3.2, 2.4, -4.4], [0, 1.0, -1.6]),
  lowering: view([5.4, 0.8, 1.4], [0, 0.45, 0]),
  tint: view([3.8, 1.5, 3.4], [0, 0.9, 0]),
  roofbox: view([4.4, 3.2, 2.6], [0, 1.25, -0.2]),
  hitch: view([1.9, 0.75, -4.3], [0, 0.25, -2.1]),
};

const clamp01 = t => Math.min(1, Math.max(0, t));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
// Overshoots slightly and settles, so a part looks like it snaps into place.
const easeBack = t => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

const signed = (n, digits = 0) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(digits)}`;

export default function AddonGarage() {
  const mountRef = useRef(null);
  const sceneApi = useRef(null);
  const reduceMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;
  const [fitted, setFitted] = useState(() => new Set());
  const [focus, setFocus] = useState(null);
  const [note, setNote] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | failed

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isMobile = window.innerWidth < 768;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setStatus('failed');
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const { scene } = createStage(renderer);
    scene.fog = new THREE.Fog(0x101010, 11, 26);
    const camera = new THREE.PerspectiveCamera(isMobile ? 40 : 32, 1, 0.05, 80);
    const scale = () => (window.innerWidth < 768 ? 1.18 : 1);
    camera.position.copy(VIEWS.overview.position).multiplyScalar(scale());
    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, { enableDamping: true, dampingFactor: 0.07, maxPolarAngle: Math.PI / 2 - 0.04, minDistance: 2.4, maxDistance: 12, enablePan: false });
    controls.target.copy(VIEWS.overview.target);

    let tween = null;
    controls.addEventListener('start', () => { tween = null; });
    const flyTo = v => {
      tween = { t: 0, fromPos: camera.position.clone(), toPos: v.position.clone().multiplyScalar(scale()), fromTarget: controls.target.clone(), toTarget: v.target.clone() };
      wake(1500);
    };

    // Scene state for each add-on: whether it is on, and when it last changed.
    const addons = buildAddons();
    const anim = Object.fromEntries(ADDONS.map(a => [a.id, { on: false, t0: -1e9 }]));
    let car = null, sprung = null, glass = null;
    let drop = 0, tint = 0;
    const glassClear = new THREE.Color(0x191919), glassDark = new THREE.Color(0x020202);

    let dirtyUntil = performance.now() + 1500;
    const wake = (ms = 1200) => { dirtyUntil = Math.max(dirtyUntil, performance.now() + ms); };
    controls.addEventListener('change', () => wake(400));

    const apply = (id, on, animate = true) => {
      const a = anim[id];
      if (a.on === on) return;
      a.on = on;
      a.t0 = animate && !reduceMotion ? performance.now() : -1e9;
      const item = addons.items[id];
      if (item && on) item.group.visible = true;
      wake(1800);
    };
    let pending = new Set();
    sceneApi.current = {
      sync(next, animate) {
        pending = next;
        if (!car) return;
        for (const a of ADDONS) apply(a.id, next.has(a.id), animate);
      },
      look(id) { flyTo(VIEWS[id] || VIEWS.overview); },
    };

    let disposed = false;
    loadCar(renderer).then(res => {
      if (disposed) return;
      car = res.car;
      glass = res.mats.glass;
      // Split the body from the wheels so lowering springs can drop the body while the tyres stay on the floor.
      car.updateMatrixWorld(true);
      sprung = new THREE.Group();
      car.add(sprung);
      const sceneRoot = res.wheels[0]?.parent;
      if (sceneRoot) for (const child of [...sceneRoot.children]) if (!res.wheels.includes(child)) sprung.attach(child);
      sprung.add(addons.root);
      scene.add(car);
      for (const a of ADDONS) apply(a.id, pending.has(a.id), false);
      setStatus('ready');
      wake(2000);
    }).catch(() => !disposed && setStatus('failed'));

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      wake(300);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(mount);

    // Tap a fitted part to read about it.
    const raycaster = new THREE.Raycaster();
    const down = { x: 0, y: 0 };
    const onDown = e => { down.x = e.clientX; down.y = e.clientY; };
    const onUp = e => {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({ x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: -((e.clientY - rect.top) / rect.height) * 2 + 1 }, camera);
      const hit = raycaster.intersectObject(addons.root, true).find(h => h.object.visible && h.object.parent.visible);
      if (hit) setFocus(hit.object.userData.addon);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      const now = performance.now();
      if (!visible || document.hidden || (!tween && now > dirtyUntil)) return;

      for (const [id, item] of Object.entries(addons.items)) {
        const a = anim[id], t = (now - a.t0) / 1000;
        for (const p of item.pieces) {
          // Fitting: the part flies in from outside the car and snaps on. Removing: it lifts away.
          const k = a.on ? 1 - easeBack(clamp01((t - p.delay) / 0.55)) : easeIn(clamp01((t - p.delay * 0.5) / 0.35));
          p.object.position.copy(p.home).addScaledVector(p.from, k);
        }
        if (!a.on && t > item.duration) item.group.visible = false;
        // A white flash the moment the part lands.
        const land = 0.5 + Math.max(...item.pieces.map(p => p.delay));
        const flash = a.on ? Math.exp(-(((t - land) / 0.16) ** 2)) * 0.9 : 0;
        for (const m of item.materials) m.emissiveIntensity = flash;
      }
      const k = 1 - Math.exp(-dt * 6);
      drop += ((anim.lowering.on ? RIDE_DROP : 0) - drop) * (reduceMotion ? 1 : k);
      tint += ((anim.tint.on ? 1 : 0) - tint) * (reduceMotion ? 1 : k);
      if (sprung) sprung.position.y = -drop;
      if (glass) {
        glass.opacity = 0.82 + 0.16 * tint;
        glass.color.copy(glassClear).lerp(glassDark, tint);
      }

      if (tween) {
        tween.t = reduceMotion ? 1 : Math.min(1, tween.t + dt / 0.9);
        const e = easeOut(tween.t);
        camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
        if (tween.t >= 1) { tween = null; wake(); }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      scene.traverse(o => { o.geometry?.dispose(); [o.material].flat().forEach(m => { if (!m) return; m.map?.dispose(); m.dispose(); }); });
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => { sceneApi.current?.sync(fitted, true); }, [fitted]);

  const toggle = id => {
    const next = new Set(fitted);
    let message = null;
    if (next.has(id)) next.delete(id);
    else {
      next.add(id);
      // Two parts that need the same space: fitting one takes the other off, and we say why.
      for (const [other, why] of Object.entries(ADDON_BY_ID[id].conflicts || {})) {
        if (next.delete(other)) message = `${ADDON_BY_ID[other].name} removed. ${why}`;
      }
    }
    setFitted(next);
    setNote(message);
    setFocus(id);
    sceneApi.current?.look(next.has(id) ? id : 'overview');
  };
  const reset = () => { setFitted(new Set()); setNote(null); setFocus(null); sceneApi.current?.look('overview'); };

  const list = [...fitted].map(id => ADDON_BY_ID[id]);
  const weight = list.reduce((n, a) => n + a.weight, 0);
  const cd = BASE_CD + list.reduce((n, a) => n + a.cd, 0);
  const drag = Math.round((cd / BASE_CD - 1) * 100);
  const clearance = Math.min(BASE_CLEARANCE, ...list.map(a => a.lowest ?? BASE_CLEARANCE)) + list.reduce((n, a) => n + (a.ride || 0), 0);
  const shown = focus && ADDON_BY_ID[focus];

  return (
    <section className="garage" aria-label="Add-on garage">
      <div className="chassis-stage garage-stage">
        {status === 'failed'
          ? <div className="viewer-fallback" role="status"><h3>3D view unavailable</h3><p>Your browser could not start the 3D model. You can still read about every add-on below.</p></div>
          : <div ref={mountRef} className="viewer-canvas" role="img" aria-label={`Lexus IS300 with ${list.length ? list.map(a => a.name.toLowerCase()).join(', ') : 'no add-ons'} fitted`} />}
        <dl className="garage-stats" aria-live="polite">
          <div><dt>Added weight</dt><dd>{weight ? `+${weight} kg` : '0 kg'}</dd></div>
          <div><dt>Air resistance</dt><dd>{drag ? `${signed(drag)}%` : 'Stock'}</dd></div>
          <div><dt>Ground clearance</dt><dd>{clearance} mm</dd></div>
        </dl>
        {status !== 'failed' && <span className="viewer-caption">Tap a fitted part to read about it</span>}
      </div>

      <div className="garage-picker">
        {ADDON_GROUPS.map(group => <div className="garage-group" key={group} role="group" aria-label={group}>
          <h3>{group}</h3>
          <div className="garage-options">
            {ADDONS.filter(a => a.group === group).map(a => (
              <button key={a.id} type="button" className="addon-toggle" aria-pressed={fitted.has(a.id)} onClick={() => toggle(a.id)}>
                <span className="addon-check" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                <span className="addon-name">{a.name}</span>
              </button>
            ))}
          </div>
        </div>)}
      </div>

      <div className="part-detail garage-detail" aria-live="polite" aria-atomic="true">
        {note && <p className="garage-note" role="status">{note}</p>}
        {shown ? <>
          <div className="part-detail-heading">
            <h3>{shown.name}</h3>
            <span className="part-detail-tag">{fitted.has(shown.id) ? 'Fitted' : 'Not fitted'}{shown.weight ? ` · ${shown.weight} kg` : ''}{shown.cd ? ` · drag ${signed(shown.cd, 3)}` : ''}</span>
          </div>
          <p>{shown.what}</p>
          <p className="garage-catch"><strong>The catch</strong>{shown.catch}</p>
        </> : <>
          <div className="part-detail-heading"><h3>Stock car</h3></div>
          <p>Choose an add-on to fit it. Each one helps with something and costs something else, and the numbers on the car show the trade.</p>
        </>}
        {fitted.size > 0 && <button type="button" className="garage-reset" onClick={reset}><RotateCcw size={14} aria-hidden="true" />Back to stock</button>}
      </div>
    </section>
  );
}
