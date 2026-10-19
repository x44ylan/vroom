import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildCar, EXPLODE_OFFSETS } from '../three/carModel.js';
import { loadCar, createStage, MAX_ZONES } from '../three/heroCar.js';
import { Segmented } from './controls/Controls.jsx';
import { RotateCw, Layers, Eye } from 'lucide-react';

const view = (p, t) => ({ position: new THREE.Vector3(...p), target: new THREE.Vector3(...t) });
const CAMERA_VIEWS = {
  quarter: view([4.8, 2.1, 4.6], [0, 0.5, 0]),
  top: view([0, 9.2, 0.01], [0, 0, 0]),
  side: view([7.6, 1.0, 0], [0, 0.55, 0]),
  engine: view([2.2, 2.1, 3.4], [0, 0.6, 1.2]),
};
// Each part gets a camera angle that frames it.
const PART_VIEWS = {
  engine: view([3.0, 2.6, 4.2], [0, 0.55, 1.1]),
  transmission: view([3.6, 3.4, 2.2], [0, 0.45, 0.4]),
  driveshaft: view([4.6, 1.5, -0.6], [0, 0.4, -0.5]),
  differential: view([2.8, 1.9, -4.8], [0, 0.4, -1.2]),
  suspension: view([4.4, 1.6, 4.0], [0.3, 0.45, 0.6]),
  brakes: view([4.0, 1.1, 3.4], [0.5, 0.35, 1.0]),
  exhaust: view([3.8, 0.9, -4.8], [0.2, 0.3, -0.9]),
};

// The mechanical parts are drawn to IS300 dimensions; this lines them up with the wheels of the white body model.
const MECH_SCALE = new THREE.Vector3(1.09, 1, 1.025);
const MECH_OFFSET = new THREE.Vector3(0, 0, 0.045);
const toCar = (x, y, z) => new THREE.Vector3(x, y, z).multiply(MECH_SCALE).add(MECH_OFFSET);
const seg = (a, b, r) => ({ a: toCar(...a), b: toCar(...b), r });
const corners = fn => [1.40, -1.27].flatMap(z => [-1, 1].map(side => fn(side, z)));

// Where each part sits, as capsules in car space. The body opens an x-ray window over them.
const PART_ZONES = {
  engine: [seg([0, 0.6, 0.86], [0, 0.6, 1.44], 0.42)],
  transmission: [seg([0, 0.5, 0.7], [0, 0.45, 0.1], 0.27)],
  driveshaft: [seg([0, 0.45, 0], [0, 0.34, -1.13], 0.16)],
  differential: [seg([-0.6, 0.31, -1.27], [0.6, 0.31, -1.27], 0.2)],
  suspension: corners((s, z) => seg([s * 0.62, 0.2, z], [s * 0.5, 0.72, z], 0.24)),
  brakes: corners((s, z) => seg([s * 0.68, 0.32, z], [s * 0.76, 0.32, z], 0.22)),
  exhaust: [seg([0.25, 0.66, 1.36], [0.24, 0.22, 0.6], 0.18), seg([0.22, 0.2, 0.6], [0.38, 0.24, -2.2], 0.2)],
};
// Which zone the callout points at (the near side when a part repeats at every wheel) and how far along it.
const CALLOUT_AT = { suspension: [3, 0.5], brakes: [1, 0.5], exhaust: [1, 0.85] };

const PART_WHERE = {
  engine: 'Under the bonnet, between the front wheels',
  transmission: 'Right behind the engine, under the gear lever',
  driveshaft: 'Under the floor, down the middle of the car',
  differential: 'Between the rear wheels',
  suspension: 'At each of the four wheels',
  brakes: 'Inside each wheel',
  exhaust: 'From the engine, under the floor, out the back',
};

const clamp01 = t => Math.min(1, Math.max(0, t));
const easeOut = t => 1 - Math.pow(1 - t, 3);

export default function ChassisViewer3D() {
  const mountRef = useRef(null);
  const calloutRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const carRootRef = useRef(null);
  const bodyRef = useRef(null);
  const partsRef = useRef({});
  const tweenRef = useRef(null);
  const explodedRef = useRef(false);
  const bodyVisibleRef = useRef(true);
  const fallbackRef = useRef(false);
  const highlightRef = useRef('engine');
  const locateRef = useRef(() => {});
  const selectRef = useRef(() => {});
  const wakeRef = useRef(() => {});
  const reduceMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;

  const [activeHighlight, setActiveHighlight] = useState('engine');
  const [isRotating, setIsRotating] = useState(() => !reduceMotion);
  const rotationRef = useRef(isRotating);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('quarter');

  useEffect(() => { rotationRef.current = isRotating; }, [isRotating]);

  const COMPONENT_DETAILS = {
  "engine": {
    "name": "Engine",
    "tag": "2JZ-GE",
    "bullets": [
      "Burns fuel and air to turn the crankshaft. Its six cylinders take turns supplying that push.",
      "The gearbox connects to the back of the engine and carries the rotation toward the wheels."
    ],
    "specs": [
      {
        "label": "Cylinder layout",
        "val": "Six in a row"
      },
      {
        "label": "Engine size",
        "val": "3.0 liters"
      }
    ]
  },
  "transmission": {
    "name": "Five-speed gearbox",
    "tag": "W55 transmission",
    "bullets": [
      "Changes the balance between wheel speed and turning force. A low gear helps the car start moving.",
      "Sits behind the engine and passes rotation to the driveshaft."
    ],
    "specs": [
      {
        "label": "Forward gears",
        "val": "5"
      },
      {
        "label": "First gear ratio",
        "val": "3.57:1"
      }
    ]
  },
  "driveshaft": {
    "name": "Driveshaft",
    "tag": "Connection to the rear axle",
    "bullets": [
      "A rotating shaft carries power from the gearbox to the rear differential.",
      "It runs along the center of the car, underneath the passenger compartment."
    ],
    "specs": [
      {
        "label": "Construction",
        "val": "Two sections"
      },
      {
        "label": "Material",
        "val": "Steel"
      }
    ]
  },
  "differential": {
    "name": "Rear differential",
    "tag": "Between the rear wheels",
    "bullets": [
      "Passes power to both rear wheels while allowing them to turn at different speeds on a bend.",
      "The Torsen version can also send more turning force to the wheel with better grip."
    ],
    "specs": [
      {
        "label": "Type shown",
        "val": "Torsen limited-slip"
      },
      {
        "label": "Final drive ratio",
        "val": "3.73:1"
      }
    ]
  },
  "suspension": {
    "name": "Suspension",
    "tag": "Springs, dampers, and arms",
    "bullets": [
      "Lets the wheels move over bumps while supporting the body of the car.",
      "Springs allow movement, dampers reduce bouncing, and suspension arms guide the wheels."
    ],
    "specs": [
      {
        "label": "Arm arrangement",
        "val": "Double wishbone"
      },
      {
        "label": "Springs",
        "val": "Coil springs"
      }
    ]
  },
  "brakes": {
    "name": "Disc brakes",
    "tag": "At the wheels",
    "bullets": [
      "Calipers squeeze brake pads against the rotating discs to slow the wheels.",
      "Friction turns movement into heat. The discs release that heat into the air."
    ],
    "specs": [
      {
        "label": "Front disc diameter",
        "val": "296 mm"
      },
      {
        "label": "Rear disc diameter",
        "val": "307 mm"
      }
    ]
  },
  "exhaust": {
    "name": "Exhaust",
    "tag": "Used gases leave the engine",
    "bullets": [
      "Carries gases away from the engine after combustion.",
      "The catalytic converter reduces harmful emissions, and the muffler reduces noise."
    ],
    "specs": [
      {
        "label": "Starts at",
        "val": "Engine exhaust ports"
      },
      {
        "label": "Ends at",
        "val": "Tailpipe"
      }
    ]
  }
};

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglUnavailable(true);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const { scene } = createStage(renderer);
    scene.fog = new THREE.Fog(0x101010, 11, 26);
    // The mechanical parts are darker than the paint; a soft fill keeps them readable inside the x-ray window.
    const fill = new THREE.PointLight(0xd2d2d2, 4, 7, 1.6);
    fill.position.set(0, 2.2, 1.6);
    scene.add(fill);

    const camera = new THREE.PerspectiveCamera(isMobile ? 40 : 32, 1, 0.05, 80);
    const mobileScale = () => (window.innerWidth < 768 ? 1.18 : 1);
    camera.position.copy(CAMERA_VIEWS.quarter.position).multiplyScalar(mobileScale());
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 2.4;
    controls.maxDistance = 12;
    controls.enablePan = false;
    controls.target.copy(CAMERA_VIEWS.quarter.target);
    controlsRef.current = controls;
    controls.addEventListener('start', () => { tweenRef.current = null; });

    const carRoot = new THREE.Group();
    scene.add(carRoot);
    carRootRef.current = carRoot;
    const mech = new THREE.Group();
    mech.scale.copy(MECH_SCALE);
    mech.position.copy(MECH_OFFSET);
    carRoot.add(mech);
    const { root, parts } = buildCar();
    mech.add(root);
    partsRef.current = parts;
    // The white body model brings its own wheels and shell.
    parts.wheels.visible = false;
    parts.structure.visible = false;
    parts.body.visible = false;
    // Parts sit inside the body, so they would always be in its shadow; light them directly instead.
    root.traverse(o => { if (o.isMesh) o.receiveShadow = false; });

    let disposed = false;
    let uniforms = null;
    let revealStart = 0;
    loadCar(renderer, { ghost: ['tyre', 'rim', 'underbody', 'chassis'] }).then(res => {
      if (disposed) return;
      const { car, mats } = res;
      // Hide the body model's own brake and suspension pieces so the labelled parts are the ones you see.
      car.traverse(o => { if (o.isMesh && [mats.caliper, mats.chassis, mats.exhaust].includes(o.material)) o.visible = false; });
      car.visible = bodyVisibleRef.current;
      carRoot.add(car);
      bodyRef.current = car;
      uniforms = res.uniforms;
      uniforms.uReveal.value = reduceMotion ? 1 : 0;
      revealStart = performance.now();
      locateRef.current(highlightRef.current, { delay: reduceMotion ? 0 : 1.5 });
      wake(3500);
    }).catch(() => {
      // Without the body model, fall back to the simple glass shell so every part is still visible.
      if (disposed) return;
      fallbackRef.current = true;
      parts.body.visible = bodyVisibleRef.current;
      wake();
    });

    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight || (window.innerWidth < 768 ? 320 : 460);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      wake(300);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(container);

    // Render only while something is changing: rotation, a camera move, parts easing,
    // the locate animation, or the user orbiting. Otherwise the canvas stays idle.
    let dirtyUntil = performance.now() + 1500;
    const wake = (ms = 1200) => { dirtyUntil = Math.max(dirtyUntil, performance.now() + ms); };
    wakeRef.current = wake;
    controls.addEventListener('change', () => wake(400));
    resize();

    // Locate animation: the window over the old part closes, the camera moves, a new window opens
    // over the selected part and a ripple runs out across the paint from it.
    const fx = { key: null, shown: null, t0: 0, openAt: 0, closeFrom: 0, lens: 0 };
    const setZones = key => {
      const zones = PART_ZONES[key] || [];
      for (let i = 0; i < MAX_ZONES; i++) {
        const z = zones[i];
        if (z) { uniforms.uZoneA.value[i].set(z.a.x, z.a.y, z.a.z, z.r); uniforms.uZoneB.value[i].set(z.b.x, z.b.y, z.b.z, 1); }
        else uniforms.uZoneB.value[i].w = 0;
      }
    };
    locateRef.current = (key, { delay = 0.3 } = {}) => {
      fx.key = key;
      fx.t0 = performance.now();
      fx.closeFrom = fx.lens;
      fx.delay = reduceMotion ? 0 : delay;
      calloutRef.current?.classList.remove('is-visible');
      wake(3000);
    };

    const callout = { at: new THREE.Vector3(), shown: false };
    const updateCallout = () => {
      const el = calloutRef.current;
      if (!el) return;
      const key = fx.shown;
      const zones = key && PART_ZONES[key];
      const ready = zones && fx.lens > 0.6;
      if (ready) {
        const [zi, along] = CALLOUT_AT[key] || [0, 0.5];
        const z = zones[zi];
        callout.at.copy(z.a).lerp(z.b, along).applyMatrix4(carRoot.matrixWorld).project(camera);
        const inView = callout.at.z < 1 && Math.abs(callout.at.x) < 1.05 && Math.abs(callout.at.y) < 1.05;
        const x = (callout.at.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-callout.at.y * 0.5 + 0.5) * container.clientHeight;
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        // Put the label on whichever side has room for it.
        const labelWidth = el.lastElementChild?.offsetWidth || 200;
        el.dataset.side = x + 24 + labelWidth > container.clientWidth && x > container.clientWidth / 2 ? 'left' : 'right';
        if (inView !== callout.shown) { callout.shown = inView; el.classList.toggle('is-visible', inView); }
      } else if (callout.shown) {
        callout.shown = false;
        el.classList.remove('is-visible');
      }
    };

    // Tap the car to find out what is there.
    const raycaster = new THREE.Raycaster();
    const pointer = { x: 0, y: 0, down: false };
    const onDown = e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.down = true; };
    const onUp = e => {
      if (!pointer.down) return;
      pointer.down = false;
      if (Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({ x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: -((e.clientY - rect.top) / rect.height) * 2 + 1 }, camera);
      const inv = new THREE.Matrix4().copy(carRoot.matrixWorld).invert();
      const ray = raycaster.ray.clone().applyMatrix4(inv);
      let best = null, bestScore = 1.15;
      for (const [key, zones] of Object.entries(PART_ZONES)) {
        for (const z of zones) {
          const score = ray.distanceSqToSegment(z.a, z.b) ** 0.5 / z.r;
          if (score < bestScore) { bestScore = score; best = key; }
        }
      }
      if (best) selectRef.current(best);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    const clock = new THREE.Clock();
    const camLocal = new THREE.Vector3();
    const inverse = new THREE.Matrix4();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      const now = performance.now();
      const busy = rotationRef.current || tweenRef.current || now < dirtyUntil;
      if (!busy) return;
      if (rotationRef.current) carRoot.rotation.y += dt * 0.18;

      // Ease each part toward its exploded or assembled position; the body lifts away when exploded.
      const k = 1 - Math.exp(-dt * 7);
      for (const [name, part] of Object.entries(parts)) {
        const offset = explodedRef.current && EXPLODE_OFFSETS[name];
        const target = part.userData.home.clone();
        if (offset) target.add(offset);
        part.position.lerp(target, k);
      }
      if (bodyRef.current) bodyRef.current.position.y += ((explodedRef.current ? 0.55 : 0) - bodyRef.current.position.y) * k;

      if (uniforms) {
        uniforms.uReveal.value = reduceMotion ? 1 : easeOut(clamp01((now - revealStart) / 1600));
        const t = (now - fx.t0) / 1000;
        if (fx.key && fx.shown !== fx.key) {
          // Close the current window quickly, then switch to the new part.
          const close = fx.closeFrom > 0.01 && !reduceMotion ? 0.16 : 0;
          fx.lens = close ? fx.closeFrom * (1 - clamp01(t / close)) : 0;
          if (t >= close) { setZones(fx.key); fx.shown = fx.key; fx.openAt = now + Math.max(0, fx.delay - close) * 1000; }
        }
        if (fx.shown) {
          const o = (now - fx.openAt) / 1000;
          fx.lens = reduceMotion ? 1 : o < 0 ? 0 : easeOut(clamp01(o / 0.55));
          uniforms.uWave.value = Math.max(0, o) * 1.9;
          uniforms.uWaveAmp.value = reduceMotion || o < 0 ? 0 : Math.pow(1 - clamp01(o / 1.3), 2);
        }
        uniforms.uLens.value = fx.lens;
        inverse.copy(carRoot.matrixWorld).invert();
        uniforms.uCarInverse.value.copy(inverse);
        uniforms.uCamLocal.value.copy(camLocal.copy(camera.position).applyMatrix4(inverse));
      }

      // With the body on, only the selected part is drawn, so its window shows that part alone.
      const isolate = bodyVisibleRef.current && bodyRef.current && !explodedRef.current;
      for (const name of Object.keys(PART_ZONES)) parts[name].visible = !isolate || name === (fx.shown || highlightRef.current);

      // The selected part glows: a brief flash as the window opens, then a steady blue.
      const flash = fx.shown && !reduceMotion ? Math.max(0, 1 - Math.abs((now - fx.openAt) / 1000 - 0.35) / 0.45) : 0;
      for (const [name, part] of Object.entries(parts)) {
        if (!part.userData.materials) continue;
        const on = highlightRef.current === name;
        const target = on ? 0.8 + flash * 0.9 : 0;
        for (const m of part.userData.materials) {
          m.emissive.setHex(0xc9c9c9);
          m.emissiveIntensity += (target - m.emissiveIntensity) * (on ? 1 - Math.exp(-dt * 14) : k);
        }
      }

      const tween = tweenRef.current;
      if (tween) {
        tween.t = reduceMotion ? 1 : Math.min(1, tween.t + dt / 0.9);
        const e = easeOut(tween.t);
        camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
        if (tween.t >= 1) { tweenRef.current = null; wake(); }
      }
      controls.update();
      renderer.render(scene, camera);
      updateCallout();
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      const disposables = new Set();
      scene.traverse(object => {
        if (object.geometry) disposables.add(object.geometry);
        [object.material].flat().forEach(m => { if (!m) return; disposables.add(m); if (m.map) disposables.add(m.map); });
      });
      disposables.forEach(item => item.dispose());
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => { explodedRef.current = explodedView; wakeRef.current(1500); }, [explodedView]);
  useEffect(() => {
    bodyVisibleRef.current = bodyVisible;
    if (bodyRef.current) bodyRef.current.visible = bodyVisible;
    else if (fallbackRef.current) partsRef.current.body.visible = bodyVisible;
    wakeRef.current();
  }, [bodyVisible]);

  const flyTo = (target) => {
    wakeRef.current(1500);
    const camera = cameraRef.current, controls = controlsRef.current;
    if (!camera || !controls) return;
    const scale = window.innerWidth < 768 ? 1.18 : 1;
    tweenRef.current = {
      t: 0, fromPos: camera.position.clone(), toPos: target.position.clone().multiplyScalar(scale),
      fromTarget: controls.target.clone(), toTarget: target.target.clone(),
    };
  };

  const setPresetAngle = (preset) => {
    setCameraPreset(preset);
    setIsRotating(false);
    if (carRootRef.current) carRootRef.current.rotation.y = 0;
    flyTo(CAMERA_VIEWS[preset]);
  };

  const selectPart = (key) => {
    setActiveHighlight(key);
    highlightRef.current = key;
    setIsRotating(false);
    setCameraPreset(null);
    if (carRootRef.current) carRootRef.current.rotation.y = 0;
    if (PART_VIEWS[key]) flyTo(PART_VIEWS[key]);
    locateRef.current(key);
  };
  selectRef.current = selectPart;

  const currentDetail = COMPONENT_DETAILS[activeHighlight] || COMPONENT_DETAILS.engine;
  const partLabels = { engine: 'Engine', transmission: 'Transmission', driveshaft: 'Driveshaft', differential: 'Differential', suspension: 'Suspension', brakes: 'Brakes', exhaust: 'Exhaust' };

  return (
    <section className="chassis-viewer" aria-label="Interactive chassis explorer">
      <div className="chassis-stage">
        {webglUnavailable ? <div className="viewer-fallback" role="status"><h3>3D view unavailable</h3><p>Your browser could not start the 3D model. You can still read about every part below.</p></div> : <>
          <div ref={mountRef} className="viewer-canvas" role="img" aria-label="Rotatable model of the Lexus IS300. The selected part is shown through the body." />
          <div ref={calloutRef} className="part-callout" aria-hidden="true">
            <span className="part-callout-dot" />
            <span className="part-callout-label" key={activeHighlight}><strong>{partLabels[activeHighlight]}</strong>{PART_WHERE[activeHighlight]}</span>
          </div>
          <span className="viewer-caption">Tap the car to find a part</span>
        </>}
        <div className="viewer-dock viewer-dock-top">
          <div className="viewer-toggles" role="group" aria-label="Model controls">
            <button disabled={webglUnavailable} aria-pressed={isRotating} onClick={() => setIsRotating(!isRotating)}><RotateCw size={15} aria-hidden="true" />Auto-rotate</button>
            <button disabled={webglUnavailable} aria-pressed={explodedView} onClick={() => setExplodedView(!explodedView)}><Layers size={15} aria-hidden="true" />Exploded view</button>
            <button disabled={webglUnavailable} aria-pressed={bodyVisible} onClick={() => setBodyVisible(!bodyVisible)}><Eye size={15} aria-hidden="true" />Body</button>
          </div>
        </div>
        <div className="viewer-dock viewer-dock-bottom">
          <Segmented size="sm" label="Camera angle" value={cameraPreset} onChange={setPresetAngle}
            options={[{ value: 'quarter', label: 'Perspective' }, { value: 'top', label: 'Top' }, { value: 'side', label: 'Side' }, { value: 'engine', label: 'Engine' }]} />
        </div>
      </div>
      <div className="part-picker" role="group" aria-label="Explore chassis parts">
        {Object.keys(COMPONENT_DETAILS).map(key => <button key={key} className="part-button" aria-pressed={activeHighlight === key} onClick={event => { selectPart(key); event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); }}>{partLabels[key]}</button>)}
      </div>
      <div className="part-detail" aria-live="polite" aria-atomic="true">
        <div className="part-detail-heading"><h3>{currentDetail.name}</h3><span className="part-detail-tag">{currentDetail.tag}</span></div>
        <ul>{currentDetail.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
        <details className="part-spec-details" key={activeHighlight}><summary>Model details</summary><dl className="part-specs">{currentDetail.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.val}</dd></div>)}</dl></details>
      </div>
    </section>
  );
}
