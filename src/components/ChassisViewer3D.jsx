import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildCar, EXPLODE_OFFSETS } from '../three/carModel.js';
import { Segmented } from './controls/Controls.jsx';
import { RotateCw, Layers, Eye } from 'lucide-react';

const view = (p, t) => ({ position: new THREE.Vector3(...p), target: new THREE.Vector3(...t) });
const CAMERA_VIEWS = {
  hero: view([5.6, 2.4, 5.0], [0, 0.42, 0]),
  quarter: view([4.5, 2.0, 4.3], [0, 0.45, 0]),
  top: view([0, 8.8, 0.01], [0, 0, 0]),
  side: view([7.2, 1.0, 0], [0, 0.55, 0]),
  engine: view([1.9, 1.7, 2.9], [0, 0.6, 1.1]),
};
// Each part gets a camera angle that frames it.
const PART_VIEWS = {
  engine: CAMERA_VIEWS.engine,
  transmission: view([1.8, 1.3, 1.9], [0, 0.45, 0.45]),
  driveshaft: view([2.4, 0.7, -0.2], [0, 0.35, -0.5]),
  differential: view([1.6, 1.3, -3.0], [0, 0.32, -1.2]),
  suspension: view([2.6, 1.1, 2.6], [0.6, 0.4, 1.4]),
  brakes: view([2.4, 1.0, 2.0], [0.7, 0.32, 1.4]),
  exhaust: view([2.0, 0.5, -3.6], [0.3, 0.25, -1.2]),
};

export default function ChassisViewer3D({ variant = 'full' }) {
  const hero = variant === 'hero';
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const partsRef = useRef({});
  const animFrameRef = useRef(null);
  const carRootRef = useRef(null);
  const tweenRef = useRef(null);
  const explodedRef = useRef(false);
  const highlightRef = useRef(null);
  const focusRef = useRef(false);
  const wakeRef = useRef(() => {});

  const [activeHighlight, setActiveHighlight] = useState('engine');
  const [isRotating, setIsRotating] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rotationRef = useRef(isRotating);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => { rotationRef.current = isRotating; }, [isRotating]);
  const [explodedView, setExplodedView] = useState(false);
  const [bodyTranslucent, setBodyTranslucent] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('quarter');

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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    if (!hero) {
      scene.fog = new THREE.Fog(0x05080f, 9, 22);
    }

    const width = container.clientWidth;
    const height = container.clientHeight || (isMobile ? 320 : 460);
    const camera = new THREE.PerspectiveCamera(hero ? 28 : isMobile ? 40 : 32, width / height, 0.05, 80);
    const startView = hero ? CAMERA_VIEWS.hero : CAMERA_VIEWS.quarter;
    camera.position.copy(startView.position).multiplyScalar(isMobile && !hero ? 1.18 : 1);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglUnavailable(true);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio reflections give the metal parts shape; a blue key and rim light set the mood.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.55;
    scene.add(new THREE.HemisphereLight(0x9ec4ff, 0x05070c, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 7, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
    Object.assign(key.shadow.camera, { left: -3.2, right: 3.2, top: 3.2, bottom: -3.2, near: 1, far: 18 });
    key.shadow.bias = -0.0004;
    key.shadow.radius = 6;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4d94ff, 3.2);
    rim.position.set(-5, 2.5, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0x6aa8ff, 6, 6, 1.6);
    fill.position.set(0, 1.6, 2.6);
    scene.add(fill);

    const floor = new THREE.Mesh(new THREE.CircleGeometry(hero ? 3.6 : 6, 64), new THREE.ShadowMaterial({ opacity: hero ? 0.5 : 0.6 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    // Soft blue pool of light under the car.
    const glowTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, 'rgba(77,148,255,0.55)');
      grd.addColorStop(0.45, 'rgba(77,148,255,0.16)');
      grd.addColorStop(1, 'rgba(77,148,255,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    })();
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 6.4), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.002;
    scene.add(glow);
    if (!hero) {
      const grid = new THREE.PolarGridHelper(6, 16, 8, 64, 0x1d2a44, 0x111a2b);
      grid.position.y = 0.001;
      scene.add(grid);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 2.2;
    controls.maxDistance = 11;
    controls.enablePan = false;
    controls.target.copy(startView.target);
    if (hero) controls.enabled = false; // decorative: never capture scroll or touch
    controlsRef.current = controls;
    controls.addEventListener('start', () => { tweenRef.current = null; });

    const { root, parts, spinners } = buildCar();
    scene.add(root);
    partsRef.current = parts;
    carRootRef.current = root;

    const ro = new ResizeObserver(() => {
      wake(300);
      const nw = container.clientWidth;
      const nh = container.clientHeight || (window.innerWidth < 768 ? 320 : 460);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);

    const clock = new THREE.Clock();
    let running = true;
    const io = new IntersectionObserver(([entry]) => { running = entry.isIntersecting; });
    io.observe(container);

    // Render only while something is changing: rotation, a camera move, parts easing,
    // a highlight pulse, or the user orbiting. Otherwise the canvas stays idle.
    let dirtyUntil = performance.now() + 1500;
    const wake = (ms = 1200) => { dirtyUntil = Math.max(dirtyUntil, performance.now() + ms); };
    controls.addEventListener('change', () => wake(400));
    wakeRef.current = wake;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!running) return;
      const busy = (rotationRef.current && !reduceMotion) || tweenRef.current || performance.now() < dirtyUntil;
      if (!busy) return;
      if (rotationRef.current && !reduceMotion) root.rotation.y += dt * (hero ? 0.18 : 0.18);
      const roll = reduceMotion ? 0 : dt * 9;
      for (const s of spinners) s.object.rotation[s.axis] += roll * s.rate;

      // Ease each part toward its exploded or assembled position.
      const k = 1 - Math.exp(-dt * 7);
      for (const [name, part] of Object.entries(parts)) {
        const offset = explodedRef.current && EXPLODE_OFFSETS[name];
        const target = part.userData.home.clone();
        if (offset) target.add(offset);
        part.position.lerp(target, k);
      }

      // Give the selected part a steady blue glow so it stands out from the rest.
      const pulse = 0.6;
      for (const [name, part] of Object.entries(parts)) {
        if (!part.userData.materials) continue;
        const on = highlightRef.current === name;
        for (const m of part.userData.materials) {
          m.emissive.setHex(0x2f7bff);
          m.emissiveIntensity += ((on ? pulse : 0) - m.emissiveIntensity) * k;
        }
      }

      const body = parts.body;
      if (body.userData.shell) {
        const u = body.userData.shell.material.uniforms.uFade;
        u.value += ((focusRef.current ? 0.28 : 1) - u.value) * k;
        body.userData.lineMat.opacity = 0.55 * u.value;
      }

      const tween = tweenRef.current;
      if (tween) {
        tween.t = Math.min(1, tween.t + dt / 0.9);
        const e = 1 - Math.pow(1 - tween.t, 3);
        camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
        if (tween.t >= 1) { tweenRef.current = null; wake(); }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      const disposables = new Set();
      scene.traverse(object => {
        if (object.geometry) disposables.add(object.geometry);
        const mats = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
        mats.forEach(m => { disposables.add(m); if (m.map) disposables.add(m.map); });
      });
      disposables.forEach(item => item.dispose());
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => { explodedRef.current = explodedView; wakeRef.current(1500); }, [explodedView]);
  useEffect(() => { highlightRef.current = hero ? null : activeHighlight; wakeRef.current(); }, [activeHighlight, hero]);
  useEffect(() => {
    const body = partsRef.current.body;
    if (body) body.visible = bodyTranslucent;
    wakeRef.current();
  }, [bodyTranslucent]);

  const flyTo = (view) => {
    wakeRef.current(1500);
    const camera = cameraRef.current, controls = controlsRef.current;
    if (!camera || !controls) return;
    const scale = window.innerWidth < 768 ? 1.18 : 1;
    tweenRef.current = {
      t: 0, fromPos: camera.position.clone(), toPos: view.position.clone().multiplyScalar(scale),
      fromTarget: controls.target.clone(), toTarget: view.target.clone(),
    };
  };

  const setPresetAngle = (preset) => {
    setCameraPreset(preset);
    setIsRotating(false);
    focusRef.current = preset === 'engine';
    if (carRootRef.current) carRootRef.current.rotation.y = 0;
    flyTo(CAMERA_VIEWS[preset]);
  };

  const selectPart = (key) => {
    setActiveHighlight(key);
    const view = PART_VIEWS[key];
    if (view) {
      focusRef.current = true;
      setIsRotating(false);
      setCameraPreset(null);
      if (carRootRef.current) carRootRef.current.rotation.y = 0;
      flyTo(view);
    }
  };

  const currentDetail = COMPONENT_DETAILS[activeHighlight] || COMPONENT_DETAILS.engine;

  const partLabels = { engine: 'Engine', transmission: 'Transmission', driveshaft: 'Driveshaft', differential: 'Differential', suspension: 'Suspension', brakes: 'Brakes', exhaust: 'Exhaust' };

  if (hero) {
    return <div className="hero-canvas" aria-hidden="true">{!webglUnavailable && <div ref={mountRef} className="viewer-canvas" />}</div>;
  }

  return (
    <section className="chassis-viewer" aria-label="Interactive chassis explorer">
      <div className="chassis-stage">
        {webglUnavailable ? <div className="viewer-fallback" role="status"><h3>3D view unavailable</h3><p>Your browser could not start the 3D model. You can still read about every part below.</p></div> : <>
          <div ref={mountRef} className="viewer-canvas" role="img" aria-label="Rotatable model of the Lexus IS300 chassis. Use the camera buttons for preset views." />
          <span className="viewer-caption">Drag to orbit · Scroll or pinch to zoom</span>
        </>}
        <div className="viewer-dock viewer-dock-top">
          <div className="viewer-toggles" role="group" aria-label="Model controls">
            <button disabled={webglUnavailable} aria-pressed={isRotating} onClick={() => { focusRef.current = false; setIsRotating(!isRotating); }}><RotateCw size={15} aria-hidden="true" />Auto-rotate</button>
            <button disabled={webglUnavailable} aria-pressed={explodedView} onClick={() => setExplodedView(!explodedView)}><Layers size={15} aria-hidden="true" />Exploded view</button>
            <button disabled={webglUnavailable} aria-pressed={bodyTranslucent} onClick={() => setBodyTranslucent(!bodyTranslucent)}><Eye size={15} aria-hidden="true" />Body shell</button>
          </div>
        </div>
        <div className="viewer-dock viewer-dock-bottom">
          <Segmented size="sm" label="Camera angle" value={cameraPreset} onChange={setPresetAngle}
            options={[{ value: 'quarter', label: 'Perspective' }, { value: 'top', label: 'Top' }, { value: 'side', label: 'Side' }, { value: 'engine', label: 'Engine' }]} />
        </div>
      </div>
      <div className="part-picker" role="group" aria-label="Explore chassis parts">
        {Object.keys(COMPONENT_DETAILS).map(key => <button key={key} className="part-button" aria-pressed={activeHighlight === key} onClick={() => selectPart(key)}>{partLabels[key]}</button>)}
      </div>
      <div className="part-detail" aria-live="polite" aria-atomic="true">
        <div className="part-detail-heading"><h3>{currentDetail.name}</h3><span className="part-detail-tag">{currentDetail.tag}</span></div>
        <ul>{currentDetail.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
        <details className="part-spec-details" key={activeHighlight}><summary>Model details</summary><dl className="part-specs">{currentDetail.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.val}</dd></div>)}</dl></details>
      </div>
    </section>
  );
}
