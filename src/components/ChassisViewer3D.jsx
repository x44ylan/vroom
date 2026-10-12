import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Zap, Compass, Info, Layers, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function ChassisViewer3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const partsRef = useRef({});
  const animFrameRef = useRef(null);
  
  const [activeHighlight, setActiveHighlight] = useState('engine');
  const [isRotating, setIsRotating] = useState(true);
  const [explodedView, setExplodedView] = useState(false);
  const [cameraView, setCameraView] = useState('perspective');

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

    const width = container.clientWidth;
    const height = container.clientHeight || 360;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 6, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x60a5fa, 1.8);
    dirLight1.position.set(10, 15, 10);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf97316, 0.8);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    const grid = new THREE.GridHelper(24, 24, 0x334155, 0x1e293b);
    grid.position.y = -1.5;
    scene.add(grid);

    const carRoot = new THREE.Group();
    scene.add(carRoot);

    const materials = {
      chassisFrame: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 }),
      engine: new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6, roughness: 0.3, emissive: 0x450a0a, emissiveIntensity: 0.3 }),
      transmission: new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.35 }),
      driveshaft: new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.2 }),
      differential: new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.3 }),
      wheels: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.2, roughness: 0.8 }),
      rims: new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9, roughness: 0.2 }),
      brakes: new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.85, roughness: 0.2 }),
      exhaust: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.3 })
    };

    const parts = {};

    // 1. FRAME
    const frameGroup = new THREE.Group();
    const ladderGeo = new THREE.BoxGeometry(2.4, 0.15, 6.2);
    frameGroup.add(new THREE.Mesh(ladderGeo, materials.chassisFrame));
    const roofTubes = [
      { pos: [-1.1, 1.2, 0], size: [0.1, 0.1, 4.0] },
      { pos: [1.1, 1.2, 0], size: [0.1, 0.1, 4.0] },
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

    // 2. ENGINE
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 2.0);
    engineGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), materials.engine));
    const headLeft = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 1.1), materials.engine);
    headLeft.position.set(-0.35, 0.55, 0); headLeft.rotation.z = -0.3;
    engineGroup.add(headLeft);
    const headRight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 1.1), materials.engine);
    headRight.position.set(0.35, 0.55, 0); headRight.rotation.z = 0.3;
    engineGroup.add(headRight);
    const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16), materials.driveshaft);
    pulley.rotation.x = Math.PI / 2; pulley.position.set(0, 0, 0.65);
    engineGroup.add(pulley);
    carRoot.add(engineGroup);
    parts.engine = engineGroup;

    // 3. TRANSMISSION
    const transGroup = new THREE.Group();
    transGroup.position.set(0, 0.35, 0.8);
    const bellHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 0.6, 16), materials.transmission);
    bellHousing.rotation.x = Math.PI / 2; bellHousing.position.set(0, 0, 0.3);
    transGroup.add(bellHousing);
    const transBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 1.1), materials.transmission);
    transBody.position.set(0, 0, -0.4);
    transGroup.add(transBody);
    carRoot.add(transGroup);
    parts.transmission = transGroup;

    // 4. DRIVESHAFT
    const shaftGroup = new THREE.Group();
    const shaftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.1, 16), materials.driveshaft);
    shaftMesh.rotation.x = Math.PI / 2; shaftMesh.position.set(0, 0.15, -1.1);
    shaftGroup.add(shaftMesh);
    carRoot.add(shaftGroup);
    parts.driveshaft = shaftGroup;

    // 5. DIFFERENTIAL
    const diffGroup = new THREE.Group();
    diffGroup.position.set(0, 0.15, -2.2);
    diffGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), materials.differential));
    const leftAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12), materials.differential);
    leftAxle.rotation.z = Math.PI / 2; leftAxle.position.set(-0.8, 0, 0);
    diffGroup.add(leftAxle);
    const rightAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12), materials.differential);
    rightAxle.rotation.z = Math.PI / 2; rightAxle.position.set(0.8, 0, 0);
    diffGroup.add(rightAxle);
    carRoot.add(diffGroup);
    parts.differential = diffGroup;

    // 6. WHEELS & BRAKES
    const wheelsGroup = new THREE.Group();
    const wheelPositions = [
      { x: -1.45, y: 0.1, z: 2.1 },
      { x: 1.45, y: 0.1, z: 2.1 },
      { x: -1.45, y: 0.1, z: -2.2 },
      { x: 1.45, y: 0.1, z: -2.2 }
    ];
    wheelPositions.forEach((pos) => {
      const swg = new THREE.Group();
      swg.position.set(pos.x, pos.y, pos.z);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.45, 24), materials.wheels);
      tire.rotation.z = Math.PI / 2; swg.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.46, 16), materials.rims);
      rim.rotation.z = Math.PI / 2; swg.add(rim);
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16), materials.brakes);
      rotor.rotation.z = Math.PI / 2; rotor.position.x = pos.x > 0 ? -0.15 : 0.15; swg.add(rotor);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.18), materials.brakes);
      cal.position.set(pos.x > 0 ? -0.15 : 0.15, 0.28, 0); swg.add(cal);
      wheelsGroup.add(swg);
    });
    carRoot.add(wheelsGroup);
    parts.wheels = wheelsGroup;

    // 7. EXHAUST
    const exhaustGroup = new THREE.Group();
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.8, 12), materials.exhaust);
    pipe1.rotation.x = Math.PI / 2; pipe1.position.set(0.45, -0.05, 0.1);
    exhaustGroup.add(pipe1);
    const muffler = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.9), materials.exhaust);
    muffler.position.set(0.45, 0.0, -2.8); exhaustGroup.add(muffler);
    const tailpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 12), materials.exhaust);
    tailpipe.rotation.x = Math.PI / 2; tailpipe.position.set(0.45, 0.0, -3.3); exhaustGroup.add(tailpipe);
    carRoot.add(exhaustGroup);
    parts.exhaust = exhaustGroup;

    partsRef.current = parts;

    // MOUSE & TOUCH DRAGGING
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    const onStart = (clientX, clientY) => {
      isDragging = true;
      prevPos = { x: clientX, y: clientY };
    };
    const onMove = (clientX, clientY) => {
      if (!isDragging) return;
      const dx = clientX - prevPos.x;
      const dy = clientY - prevPos.y;
      carRoot.rotation.y += dx * 0.008;
      carRoot.rotation.x = Math.max(-0.6, Math.min(0.6, carRoot.rotation.x + dy * 0.008));
      prevPos = { x: clientX, y: clientY };
    };
    const onEnd = () => { isDragging = false; };

    const domEl = renderer.domElement;
    const mDown = (e) => onStart(e.clientX, e.clientY);
    const mMove = (e) => onMove(e.clientX, e.clientY);
    const tStart = (e) => { if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY); };
    const tMove = (e) => { if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY); };

    domEl.addEventListener('mousedown', mDown);
    window.addEventListener('mousemove', mMove);
    window.addEventListener('mouseup', onEnd);
    domEl.addEventListener('touchstart', tStart, { passive: true });
    window.addEventListener('touchmove', tMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // RESIZE OBSERVER
    const ro = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight || 360;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    });
    ro.observe(container);

    // ANIMATION
    let angle = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (isRotating && !isDragging) carRoot.rotation.y += 0.004;
      angle += 0.05;
      if (parts.driveshaft) parts.driveshaft.children[0].rotation.z = angle * 2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      domEl.removeEventListener('mousedown', mDown);
      window.removeEventListener('mousemove', mMove);
      window.removeEventListener('mouseup', onEnd);
      domEl.removeEventListener('touchstart', tStart);
      window.removeEventListener('touchmove', tMove);
      window.removeEventListener('touchend', onEnd);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const parts = partsRef.current;
    if (!parts.engine) return;
    const mult = explodedView ? 1.8 : 1.0;
    parts.engine.position.set(0, 0.45 + (explodedView ? 0.8 : 0), 2.0 * mult);
    parts.transmission.position.set(0, 0.35 + (explodedView ? 0.4 : 0), 0.8 * mult);
    parts.differential.position.set(0, 0.15 + (explodedView ? 0.3 : 0), -2.2 * mult);
    parts.exhaust.position.set(explodedView ? 0.8 : 0, explodedView ? -0.5 : 0, 0);
  }, [explodedView]);

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
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Interactive 3D Powertrain & Chassis</CardTitle>
              <Badge variant="success" className="hidden sm:inline-flex">WebGL 3D</Badge>
            </div>
            <CardDescription>Drag to inspect angles or explode parts in real-time</CardDescription>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant={isRotating ? "primary" : "secondary"}
            onClick={() => setIsRotating(!isRotating)}
            className="flex-1 sm:flex-none text-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            {isRotating ? 'Orbit ON' : 'Paused'}
          </Button>

          <Button
            size="sm"
            variant={explodedView ? "default" : "secondary"}
            onClick={() => setExplodedView(!explodedView)}
            className="flex-1 sm:flex-none text-xs"
          >
            {explodedView ? 'Collapse' : 'Explode'}
          </Button>

          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            {['perspective', 'top', 'side'].map((p) => (
              <button
                key={p}
                onClick={() => setPresetView(p)}
                className={`px-2 py-1 text-[11px] rounded font-medium capitalize transition ${
                  cameraView === p ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <div className="relative w-full h-[320px] sm:h-[460px] cursor-grab active:cursor-grabbing select-none bg-slate-950/40">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating component specs card */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentDetail.color }} />
            <h4 className="text-xs sm:text-sm font-bold text-white">{currentDetail.name}</h4>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mb-2 leading-relaxed">{currentDetail.summary}</p>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            {currentDetail.specs}
          </div>
        </div>
      </div>

      {/* Touch-scrollable part chips */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 shrink-0">
          Parts:
        </span>
        {Object.entries(COMPONENT_DETAILS).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setActiveHighlight(key)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition ${
              activeHighlight === key
                ? 'bg-slate-800 text-white border border-slate-600 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
            {info.name.split(' (')[0]}
          </button>
        ))}
      </div>
    </Card>
  );
}
