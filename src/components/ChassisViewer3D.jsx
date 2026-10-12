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
      name: 'Toyota 2JZ-GE 3.0L Inline-6 Engine',
      color: '#ef4444',
      summary: 'Longitudinally mounted cast-iron block (FC250) with aluminum DOHC 24-valve crossflow head and VVT-i.',
      specs: 'Displacement: 2,997cc | Power: 215 hp @ 5,800 RPM | Torque: 218 lb-ft @ 3,800 RPM | Firing: 1-5-3-6-2-4'
    },
    transmission: {
      name: 'W55 5-Speed Manual / A650E 5-Speed Auto',
      color: '#f59e0b',
      summary: 'Smooth close-ratio gearbox with steering wheel E-Shift buttons on automatic models.',
      specs: 'Ratios: 1st 3.57, 2nd 1.90, 3rd 1.38, 4th 1.00, 5th 0.78 (Overdrive) | Final Drive: 3.73:1'
    },
    driveshaft: {
      name: 'Two-Piece Propeller Shaft & Center Bearing',
      color: '#3b82f6',
      summary: 'Transfers high rotational torque down the transmission tunnel to the rear drive axle.',
      specs: 'Two-piece steel tubular construction with rubber-isolated center hanger support bearing'
    },
    differential: {
      name: 'Torsen Type-2 (T-2) Limited-Slip Differential',
      color: '#8b5cf6',
      summary: 'M85 rear differential housing with torque-sensing helical gearing to prevent inside wheel spin.',
      specs: 'Helical worm gear torque bias ratio ~2.5:1 | Hypoid ring & pinion ratio: 3.73:1'
    },
    suspension: {
      name: 'Front & Rear Independent Double-Wishbone',
      color: '#06b6d4',
      summary: 'High-mount front upper control arm and rear multi-link wishbone geometry for sports saloon dynamics.',
      specs: 'Gas pressurized Tokico dampers, tuned coil springs, and front/rear anti-roll stabilizer bars'
    },
    brakes: {
      name: 'Ventilated Disc Brakes & ABS / EBD',
      color: '#ec4899',
      summary: 'Cast-iron floating rotors with 2-piston front calipers and electronic brakeforce distribution.',
      specs: 'Front: 296mm ventilated discs | Rear: 307mm solid discs | 4-channel ABS with Brake Assist'
    },
    exhaust: {
      name: 'Stainless Steel Exhaust & Dual Catalytic Converters',
      color: '#64748b',
      summary: 'Equal-length stainless headers with dual close-coupled pre-cats and polished chrome exhaust tip.',
      specs: 'OBD-II dual bank oxygen lambda sensors + low-restriction rear muffler'
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
      is300Body: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25, transparent: true, opacity: 0.28 }),
      engine: new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6, roughness: 0.3, emissive: 0x450a0a, emissiveIntensity: 0.3 }),
      engineHead: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 }),
      transmission: new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.35 }),
      driveshaft: new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.2 }),
      differential: new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.3 }),
      suspension: new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.25 }),
      wheels: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.2, roughness: 0.8 }),
      rims: new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 }),
      brakes: new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.85, roughness: 0.2 }),
      exhaust: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.3 })
    };

    const parts = {};

    // 1. LEXUS IS300 UNIBODY SILHOUETTE CHASSIS (JCE10)
    const bodyGroup = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 6.0), materials.chassisFrame);
    bodyGroup.add(floor);
    const roofTubes = [
      { pos: [-1.05, 1.25, -0.2], size: [0.08, 0.08, 3.2] },
      { pos: [1.05, 1.25, -0.2], size: [0.08, 0.08, 3.2] },
      { pos: [-1.05, 0.65, 1.5], size: [0.08, 1.4, 0.08], rot: [-0.45, 0, 0] },
      { pos: [1.05, 0.65, 1.5], size: [0.08, 1.4, 0.08], rot: [-0.45, 0, 0] },
      { pos: [-1.05, 0.65, -1.9], size: [0.08, 1.4, 0.08], rot: [0.45, 0, 0] },
      { pos: [1.05, 0.65, -1.9], size: [0.08, 1.4, 0.08], rot: [0.45, 0, 0] }
    ];
    roofTubes.forEach(t => {
      const g = new THREE.BoxGeometry(...t.size);
      const m = new THREE.Mesh(g, materials.chassisFrame);
      m.position.set(...t.pos);
      if (t.rot) m.rotation.set(...t.rot);
      bodyGroup.add(m);
    });

    // Altezza/IS300 Transparent Outer Glass / Body Skin Outline
    const bodySkin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.1, 4.8), materials.is300Body);
    bodySkin.position.set(0, 0.5, 0.1);
    bodyGroup.add(bodySkin);

    carRoot.add(bodyGroup);
    parts.frame = bodyGroup;

    // 2. THE LEGENDARY TOYOTA 2JZ-GE INLINE-6 ENGINE (Longitudinal Front Mount)
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 1.9);
    const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 1.6), materials.engine);
    engineGroup.add(blockMesh);
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.35, 1.55), materials.engineHead);
    headMesh.position.set(0, 0.52, 0);
    engineGroup.add(headMesh);
    const camCover = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 16), materials.driveshaft);
    camCover.rotation.x = Math.PI / 2;
    camCover.position.set(0, 0.45, 0.82);
    engineGroup.add(camCover);
    const intakePlenum = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), materials.engineHead);
    intakePlenum.rotation.x = Math.PI / 2;
    intakePlenum.position.set(-0.38, 0.55, -0.1);
    engineGroup.add(intakePlenum);
    carRoot.add(engineGroup);
    parts.engine = engineGroup;

    // 3. W55 / A650E 5-SPEED TRANSMISSION
    const transGroup = new THREE.Group();
    transGroup.position.set(0, 0.35, 0.6);
    const bellHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 0.55, 16), materials.transmission);
    bellHousing.rotation.x = Math.PI / 2;
    bellHousing.position.set(0, 0, 0.28);
    transGroup.add(bellHousing);
    const transBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 1.0), materials.transmission);
    transBody.position.set(0, 0, -0.38);
    transGroup.add(transBody);
    carRoot.add(transGroup);
    parts.transmission = transGroup;

    // 4. TWO-PIECE PROPELLER SHAFT WITH CENTER BEARING
    const shaftGroup = new THREE.Group();
    const shaftFront = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.1, 16), materials.driveshaft);
    shaftFront.rotation.x = Math.PI / 2;
    shaftFront.position.set(0, 0.15, -0.5);
    shaftGroup.add(shaftFront);
    const centerBearing = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), materials.chassisFrame);
    centerBearing.rotation.x = Math.PI / 2;
    centerBearing.position.set(0, 0.15, -1.05);
    shaftGroup.add(centerBearing);
    const shaftRear = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.1, 16), materials.driveshaft);
    shaftRear.rotation.x = Math.PI / 2;
    shaftRear.position.set(0, 0.15, -1.6);
    shaftGroup.add(shaftRear);
    carRoot.add(shaftGroup);
    parts.driveshaft = shaftGroup;

    // 5. TORSEN TYPE-2 LIMITED-SLIP DIFFERENTIAL (JCE10 M85)
    const diffGroup = new THREE.Group();
    diffGroup.position.set(0, 0.15, -2.2);
    const diffCase = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), materials.differential);
    diffGroup.add(diffCase);
    const leftAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.6, 12), materials.differential);
    leftAxle.rotation.z = Math.PI / 2;
    leftAxle.position.set(-0.8, 0, 0);
    diffGroup.add(leftAxle);
    const rightAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.6, 12), materials.differential);
    rightAxle.rotation.z = Math.PI / 2;
    rightAxle.position.set(0.8, 0, 0);
    diffGroup.add(rightAxle);
    carRoot.add(diffGroup);
    parts.differential = diffGroup;

    // 6. WHEELS, TIRES, AND DOUBLE-WISHBONE SUSPENSION KNUCKLES
    const wheelsGroup = new THREE.Group();
    const wheelPositions = [
      { x: -1.35, y: 0.1, z: 2.1, isFront: true },
      { x: 1.35, y: 0.1, z: 2.1, isFront: true },
      { x: -1.35, y: 0.1, z: -2.2, isFront: false },
      { x: 1.35, y: 0.1, z: -2.2, isFront: false }
    ];
    wheelPositions.forEach((pos) => {
      const swg = new THREE.Group();
      swg.position.set(pos.x, pos.y, pos.z);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.42, 24), materials.wheels);
      tire.rotation.z = Math.PI / 2;
      swg.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.43, 16), materials.rims);
      rim.rotation.z = Math.PI / 2;
      swg.add(rim);
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 16), materials.brakes);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = pos.x > 0 ? -0.15 : 0.15;
      swg.add(rotor);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.18), materials.brakes);
      cal.position.set(pos.x > 0 ? -0.15 : 0.15, 0.28, 0);
      swg.add(cal);
      const wishbone = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.2), materials.suspension);
      wishbone.position.set(pos.x > 0 ? -0.3 : 0.3, 0.35, 0);
      swg.add(wishbone);
      wheelsGroup.add(swg);
    });
    carRoot.add(wheelsGroup);
    parts.wheels = wheelsGroup;

    // 7. EXHAUST SYSTEM (2JZ Stainless Headers -> Dual Cats -> Tailpipe)
    const exhaustGroup = new THREE.Group();
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 4.0, 12), materials.exhaust);
    pipe1.rotation.x = Math.PI / 2;
    pipe1.position.set(0.4, -0.05, 0.1);
    exhaustGroup.add(pipe1);
    const muffler = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.28, 0.85), materials.exhaust);
    muffler.position.set(0.4, 0.0, -2.7);
    exhaustGroup.add(muffler);
    const tailpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), materials.exhaust);
    tailpipe.rotation.x = Math.PI / 2;
    tailpipe.position.set(0.4, -0.05, -3.2);
    exhaustGroup.add(tailpipe);
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
    parts.engine.position.set(0, 0.45 + (explodedView ? 0.8 : 0), 1.9 * mult);
    parts.transmission.position.set(0, 0.35 + (explodedView ? 0.4 : 0), 0.6 * mult);
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
              <CardTitle>Lexus IS300 (XE10) 3D Chassis & 2JZ Powertrain</CardTitle>
              <Badge variant="default" className="hidden sm:inline-flex">JCE10 FR Sports Platform</Badge>
            </div>
            <CardDescription>Front-Engine, Rear-Wheel Drive (FR) chassis with longitudinal 2JZ-GE Inline-6</CardDescription>
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
