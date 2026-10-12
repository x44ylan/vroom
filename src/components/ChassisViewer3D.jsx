import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Zap, Compass, Info } from 'lucide-react';

export default function ChassisViewer3D({ onSelectComponent, selectedComponentId }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const partsRef = useRef({});
  const animFrameRef = useRef(null);
  
  const [activeHighlight, setActiveHighlight] = useState('engine');
  const [isRotating, setIsRotating] = useState(true);
  const [explodedView, setExplodedView] = useState(false);
  const [cameraView, setCameraView] = useState('perspective'); // 'perspective', 'top', 'side'

  // Component metadata for click/hover
  const COMPONENT_DETAILS = {
    engine: {
      name: 'Engine Block (V6 / Inline)',
      color: '#ef4444',
      summary: 'Chemical combustion core generating raw torque at the front axle.',
      specs: 'Displacement: 2.5L | Compression: 10.5:1 | Max RPM: 6,800'
    },
    transmission: {
      name: 'Transmission / Gearbox',
      color: '#f59e0b',
      summary: 'Multiplies engine torque and changes rotational gear ratios.',
      specs: '6-Speed Dual Clutch / Manual | Overdrive 0.75:1'
    },
    driveshaft: {
      name: 'Driveshaft / Propeller Shaft',
      color: '#3b82f6',
      summary: 'Transfers high-speed rotational energy down the chassis spine.',
      specs: 'Balanced high-tensile carbon fiber / steel tubular shaft'
    },
    differential: {
      name: 'Rear Differential & Axles',
      color: '#8b5cf6',
      summary: 'Splits torque between left and right wheels while allowing differential rotational speeds.',
      specs: 'Hypoid Ring & Pinion Final Drive: 3.73:1'
    },
    wheels: {
      name: 'Wheels & Tire Contact Patches',
      color: '#10b981',
      summary: 'Where mechanical torque meets asphalt friction to propel the car.',
      specs: 'Tire compound: 225/45 R18 | Rolling resistance Coeff: ~0.01'
    },
    brakes: {
      name: 'Disc Brakes & Calipers',
      color: '#ec4899',
      summary: 'Hydraulic friction clamps converting kinetic energy into heat.',
      specs: '320mm Ventilated steel rotors + 4-piston calipers'
    },
    exhaust: {
      name: 'Exhaust & Catalytic Converter',
      color: '#64748b',
      summary: 'Routes spent gases through emissions filters and acoustic mufflers.',
      specs: 'Three-way catalytic converter (Pt/Rh catalyst)'
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);
    sceneRef.current = scene;

    // CAMERA
    const width = container.clientWidth;
    const height = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 6, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x60a5fa, 1.8);
    dirLight1.position.set(10, 15, 10);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf97316, 0.8);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // GRID FLOOR
    const grid = new THREE.GridHelper(24, 24, 0x334155, 0x1e293b);
    grid.position.y = -1.5;
    scene.add(grid);

    // CAR CHASSIS ROOT GROUP
    const carRoot = new THREE.Group();
    scene.add(carRoot);

    // MATERIALS
    const materials = {
      chassisFrame: new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.8,
        roughness: 0.3,
        wireframe: false
      }),
      engine: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0x450a0a,
        emissiveIntensity: 0.3
      }),
      transmission: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.7,
        roughness: 0.35
      }),
      driveshaft: new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.9,
        roughness: 0.2
      }),
      differential: new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.7,
        roughness: 0.3
      }),
      wheels: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.2,
        roughness: 0.8
      }),
      rims: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.9,
        roughness: 0.2
      }),
      brakes: new THREE.MeshStandardMaterial({
        color: 0xec4899,
        metalness: 0.85,
        roughness: 0.2
      }),
      exhaust: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.3
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.1
      })
    };

    const parts = {};

    // 1. CHASSIS FRAME TUBES & FLOOR (unibody ladder)
    const frameGroup = new THREE.Group();
    const ladderGeo = new THREE.BoxGeometry(2.4, 0.15, 6.2);
    const ladderMesh = new THREE.Mesh(ladderGeo, materials.chassisFrame);
    frameGroup.add(ladderMesh);

    // Upper roll cage / roof outline
    const roofTubes = [
      // Left rail
      { pos: [-1.1, 1.2, 0], size: [0.1, 0.1, 4.0] },
      { pos: [1.1, 1.2, 0], size: [0.1, 0.1, 4.0] },
      // Pillars
      { pos: [-1.1, 0.6, -1.8], size: [0.1, 1.3, 0.1], rot: [0.3, 0, 0] },
      { pos: [1.1, 0.6, -1.8], size: [0.1, 1.3, 0.1], rot: [0.3, 0, 0] },
      { pos: [-1.1, 0.6, 1.8], size: [0.1, 1.3, 0.1], rot: [-0.3, 0, 0] },
      { pos: [1.1, 0.6, 1.8], size: [0.1, 1.3, 0.1], rot: [-0.3, 0, 0] }
    ];
    roofTubes.forEach(t => {
      const g = new THREE.BoxGeometry(...t.size);
      const m = new THREE.Mesh(g, materials.chassisFrame);
      m.position.set(...t.pos);
      if (t.rot) m.rotation.set(...t.rot);
      frameGroup.add(m);
    });
    carRoot.add(frameGroup);
    parts.frame = frameGroup;

    // 2. ENGINE (Front mounted)
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 2.0);
    // Cylinder block
    const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), materials.engine);
    engineGroup.add(blockMesh);
    // Valve covers / V-heads
    const headLeft = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 1.1), materials.engine);
    headLeft.position.set(-0.35, 0.55, 0);
    headLeft.rotation.z = -0.3;
    engineGroup.add(headLeft);
    const headRight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 1.1), materials.engine);
    headRight.position.set(0.35, 0.55, 0);
    headRight.rotation.z = 0.3;
    engineGroup.add(headRight);
    // Pulley wheel at front
    const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16), materials.driveshaft);
    pulley.rotation.x = Math.PI / 2;
    pulley.position.set(0, 0, 0.65);
    engineGroup.add(pulley);
    carRoot.add(engineGroup);
    parts.engine = engineGroup;

    // 3. TRANSMISSION (Bolted behind engine)
    const transGroup = new THREE.Group();
    transGroup.position.set(0, 0.35, 0.8);
    const bellHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 0.6, 16), materials.transmission);
    bellHousing.rotation.x = Math.PI / 2;
    bellHousing.position.set(0, 0, 0.3);
    transGroup.add(bellHousing);
    const transBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 1.1), materials.transmission);
    transBody.position.set(0, 0, -0.4);
    transGroup.add(transBody);
    carRoot.add(transGroup);
    parts.transmission = transGroup;

    // 4. DRIVESHAFT
    const shaftGroup = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.1, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, materials.driveshaft);
    shaftMesh.rotation.x = Math.PI / 2;
    shaftMesh.position.set(0, 0.15, -1.1);
    shaftGroup.add(shaftMesh);
    carRoot.add(shaftGroup);
    parts.driveshaft = shaftGroup;

    // 5. REAR DIFFERENTIAL
    const diffGroup = new THREE.Group();
    diffGroup.position.set(0, 0.15, -2.2);
    // Pumpkin differential pumpkin
    const pumpkin = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), materials.differential);
    diffGroup.add(pumpkin);
    // Rear half-shaft axles
    const leftAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12), materials.differential);
    leftAxle.rotation.z = Math.PI / 2;
    leftAxle.position.set(-0.8, 0, 0);
    diffGroup.add(leftAxle);
    const rightAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12), materials.differential);
    rightAxle.rotation.z = Math.PI / 2;
    rightAxle.position.set(0.8, 0, 0);
    diffGroup.add(rightAxle);
    carRoot.add(diffGroup);
    parts.differential = diffGroup;

    // 6. WHEELS & TIRES & BRAKES (4 wheels)
    const wheelsGroup = new THREE.Group();
    const wheelPositions = [
      { x: -1.45, y: 0.1, z: 2.1, isFront: true },  // Front Left
      { x: 1.45, y: 0.1, z: 2.1, isFront: true },   // Front Right
      { x: -1.45, y: 0.1, z: -2.2, isFront: false }, // Rear Left
      { x: 1.45, y: 0.1, z: -2.2, isFront: false }  // Rear Right
    ];

    wheelPositions.forEach((pos, idx) => {
      const singleWheelGroup = new THREE.Group();
      singleWheelGroup.position.set(pos.x, pos.y, pos.z);

      // Tire rubber
      const tireGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.45, 24);
      const tireMesh = new THREE.Mesh(tireGeo, materials.wheels);
      tireMesh.rotation.z = Math.PI / 2;
      singleWheelGroup.add(tireMesh);

      // Alloy Rim
      const rimGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.46, 16);
      const rimMesh = new THREE.Mesh(rimGeo, materials.rims);
      rimMesh.rotation.z = Math.PI / 2;
      singleWheelGroup.add(rimMesh);

      // Brake Rotor
      const rotorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
      const rotorMesh = new THREE.Mesh(rotorGeo, materials.brakes);
      rotorMesh.rotation.z = Math.PI / 2;
      rotorMesh.position.x = pos.x > 0 ? -0.15 : 0.15;
      singleWheelGroup.add(rotorMesh);

      // Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.12, 0.22, 0.18);
      const caliperMesh = new THREE.Mesh(caliperGeo, materials.brakes);
      caliperMesh.position.set(pos.x > 0 ? -0.15 : 0.15, 0.28, 0);
      singleWheelGroup.add(caliperMesh);

      wheelsGroup.add(singleWheelGroup);
    });
    carRoot.add(wheelsGroup);
    parts.wheels = wheelsGroup;

    // 7. EXHAUST SYSTEM
    const exhaustGroup = new THREE.Group();
    // Catalytic converter & pipes running back
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.8, 12), materials.exhaust);
    pipe1.rotation.x = Math.PI / 2;
    pipe1.position.set(0.45, -0.05, 0.1);
    exhaustGroup.add(pipe1);

    const muffler = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.9), materials.exhaust);
    muffler.position.set(0.45, 0.0, -2.8);
    exhaustGroup.add(muffler);

    const tailpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 12), materials.exhaust);
    tailpipe.rotation.x = Math.PI / 2;
    tailpipe.position.set(0.45, 0.0, -3.3);
    exhaustGroup.add(tailpipe);

    carRoot.add(exhaustGroup);
    parts.exhaust = exhaustGroup;

    partsRef.current = parts;

    // INTERACTION - MOUSE DRAG ROTATION
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      carRoot.rotation.y += deltaX * 0.008;
      carRoot.rotation.x = Math.max(-0.6, Math.min(0.6, carRoot.rotation.x + deltaY * 0.008));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      carRoot.rotation.y += deltaX * 0.008;
      carRoot.rotation.x = Math.max(-0.6, Math.min(0.6, carRoot.rotation.x + deltaY * 0.008));
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 480;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let angle = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        carRoot.rotation.y += 0.004;
      }

      // Rotate driveshaft and wheels to simulate running powertrain
      angle += 0.05;
      if (parts.driveshaft) {
        parts.driveshaft.children[0].rotation.z = angle * 2;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update exploded view offsets
  useEffect(() => {
    const parts = partsRef.current;
    if (!parts.engine) return;

    const mult = explodedView ? 1.8 : 1.0;
    const yMult = explodedView ? 1.0 : 0.0;

    parts.engine.position.set(0, 0.45 + (explodedView ? 0.8 : 0), 2.0 * mult);
    parts.transmission.position.set(0, 0.35 + (explodedView ? 0.4 : 0), 0.8 * mult);
    parts.differential.position.set(0, 0.15 + (explodedView ? 0.3 : 0), -2.2 * mult);
    parts.exhaust.position.set(explodedView ? 0.8 : 0, explodedView ? -0.5 : 0, 0);
  }, [explodedView]);

  // Set camera view angles
  const setPresetView = (type) => {
    setCameraView(type);
    if (!cameraRef.current) return;
    setIsRotating(false);
    if (type === 'top') {
      cameraRef.current.position.set(0, 14, 0.1);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'side') {
      cameraRef.current.position.set(13, 1, 0);
      cameraRef.current.lookAt(0, 0, 0);
    } else {
      cameraRef.current.position.set(8, 6, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const currentDetail = COMPONENT_DETAILS[activeHighlight] || COMPONENT_DETAILS.engine;

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Header Controls */}
      <div className="p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Interactive 3D Powertrain & Chassis
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WebGL Real-Time
              </span>
            </h3>
            <p className="text-xs text-slate-400">Click components below or drag in 3D space to rotate</p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isRotating
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            {isRotating ? 'Auto Orbit ON' : 'Orbit Paused'}
          </button>

          <button
            onClick={() => setExplodedView(!explodedView)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              explodedView
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {explodedView ? 'Collapse Assembly' : 'Explode View'}
          </button>

          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setPresetView('perspective')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                cameraView === 'perspective' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Perspective
            </button>
            <button
              onClick={() => setPresetView('top')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                cameraView === 'top' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top
            </button>
            <button
              onClick={() => setPresetView('side')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                cameraView === 'side' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div className="relative w-full h-[460px] cursor-grab active:cursor-grabbing select-none">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Component Info Badge */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: currentDetail.color }}
            />
            <h4 className="text-sm font-bold text-white">{currentDetail.name}</h4>
          </div>
          <p className="text-xs text-slate-300 mb-2 leading-relaxed">{currentDetail.summary}</p>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            {currentDetail.specs}
          </div>
        </div>

        {/* Drag Helper Notice */}
        <div className="absolute top-4 right-4 pointer-events-none px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400">
          Left Click + Drag to Inspect Angles
        </div>
      </div>

      {/* Component Selector Tabs */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
          Inspect Parts:
        </span>
        {Object.entries(COMPONENT_DETAILS).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setActiveHighlight(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition ${
              activeHighlight === key
                ? 'bg-slate-800 text-white border border-slate-600 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: info.color }}
            />
            {info.name.split(' (')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
