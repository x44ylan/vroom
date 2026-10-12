import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Layers, Eye } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function ChassisViewer3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const partsRef = useRef({});
  const animFrameRef = useRef(null);

  const [activeHighlight, setActiveHighlight] = useState('engine');
  const [isRotating, setIsRotating] = useState(true);
  const [explodedView, setExplodedView] = useState(false);
  const [bodyTranslucent, setBodyTranslucent] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('quarter');

  const COMPONENT_DETAILS = {
    engine: {
      name: '2JZ-GE 3.0L Inline-6 Engine',
      badge: 'Cast-Iron Block',
      bullets: [
        'Same bulletproof iron block as Mk4 Supra (2JZ)',
        '7 main bearings = zero vibration, silky smooth',
        'Handles 500+ HP turbo boost on stock internals'
      ],
      specs: [
        { label: 'Power', val: '215 HP' },
        { label: 'Torque', val: '218 lb-ft' },
        { label: 'Displacement', val: '3.0L I6' },
        { label: 'Firing', val: '1-5-3-6-2-4' }
      ]
    },
    transmission: {
      name: 'Toyota W55 5-Speed Manual',
      badge: 'Close-Ratio',
      bullets: [
        'Direct mechanical 5-speed shift linkage',
        '0.78:1 overdrive 5th gear for highway cruising',
        'Dampened dual-mass flywheel absorbs pulses'
      ],
      specs: [
        { label: '1st Gear', val: '3.57:1 Launch' },
        { label: '4th Gear', val: '1.00:1 Direct' },
        { label: '5th Gear', val: '0.78:1 Cruise' },
        { label: 'Final Drive', val: '3.73:1' }
      ]
    },
    driveshaft: {
      name: 'Two-Piece Propeller Driveshaft',
      badge: 'Center Bearing',
      bullets: [
        '2-piece steel shaft down center tunnel',
        'Rubber center hanger kills driveline vibrations',
        'Direct torque transfer from 2JZ to rear differential'
      ],
      specs: [
        { label: 'Type', val: '2-Piece Steel' },
        { label: 'Joints', val: 'Universal U-Joints' },
        { label: 'Hanger', val: 'Rubber Isolated' },
        { label: 'Balance', val: 'Dynamic' }
      ]
    },
    differential: {
      name: 'Torsen Type-2 (T-2) Helical LSD',
      badge: 'Torque-Sensing',
      bullets: [
        'Helical worm gears bias torque in corners',
        'Sends 2.5× more power to gripping outer tire',
        'Zero clutch friction plates to ever wear out'
      ],
      specs: [
        { label: 'Final Drive', val: '3.73:1' },
        { label: 'Torque Bias', val: '2.5:1 TBR' },
        { label: 'Gears', val: 'Crossed Helical' },
        { label: 'Clutch Wear', val: 'Zero' }
      ]
    },
    suspension: {
      name: '4-Wheel Independent Double-Wishbone',
      badge: 'High-Mount Arms',
      bullets: [
        'High-mount front A-arms & rear multi-link',
        'Negative camber gain keeps tire flat in corners',
        'Sports saloon handling with Tokico monotube gas shocks'
      ],
      specs: [
        { label: 'Front', val: 'Double Wishbone' },
        { label: 'Rear', val: 'Multi-Link' },
        { label: 'Shocks', val: 'Tokico Monotube' },
        { label: 'Bars', val: 'Solid Anti-Roll' }
      ]
    },
    brakes: {
      name: 'Ventilated Disc Brakes & ABS / EBD',
      badge: '2-Piston Floating',
      bullets: [
        '296mm front ventilated cast-iron rotors',
        '4-channel ABS pulses 20×/sec to prevent skids',
        'Electronic Brakeforce Distribution (EBD)'
      ],
      specs: [
        { label: 'Front', val: '296 mm Vented' },
        { label: 'Rear', val: '307 mm Solid' },
        { label: 'ABS', val: '4-Channel 20Hz' },
        { label: 'Fluid', val: 'DOT 4 Glycol' }
      ]
    },
    exhaust: {
      name: 'Stainless Exhaust & Dual Catalytic Converters',
      badge: 'Dual Pre-Cats',
      bullets: [
        'Equal-length stainless steel header collector',
        'Dual close-coupled cats for low emissions',
        'Free-flowing rear acoustic muffler with chrome tip'
      ],
      specs: [
        { label: 'Headers', val: 'Stainless' },
        { label: 'Sensors', val: 'Dual O2 Lambda' },
        { label: 'Emission', val: 'LEVII Tier' },
        { label: 'Tip', val: 'Chrome Bezel' }
      ]
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 640;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0f12);
    scene.fog = new THREE.FogExp2(0x0e0f12, 0.035);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight || (isMobile ? 320 : 480);
    const camera = new THREE.PerspectiveCamera(isMobile ? 44 : 36, width / height, 0.1, 100);
    if (isMobile) {
      camera.position.set(5.8, 3.2, 5.4);
    } else {
      camera.position.set(7.6, 3.6, 6.8);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;
    controls.minDistance = 2.8;
    controls.maxDistance = 16;
    controls.target.set(0, 0.4, 0);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(8, 14, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa1a1aa, 0.7);
    fillLight.position.set(-8, 6, -8);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(16, 24, 0x222428, 0x16171a);
    grid.position.y = -0.95;
    scene.add(grid);

    const carRoot = new THREE.Group();
    scene.add(carRoot);

    const materials = {
      is300Body: new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.5,
        roughness: 0.25,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide
      }),
      is300Roof: new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.45
      }),
      is300Glass: new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.95,
        roughness: 0.05,
        transparent: true,
        opacity: 0.55
      }),
      headlights: new THREE.MeshBasicMaterial({ color: 0xe2e8f0 }),
      taillights: new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
      chromeGrille: new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.1 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.8, roughness: 0.3 }),
      engineBlock: new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.7, roughness: 0.3 }),
      engineHead: new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 }),
      transmission: new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.75, roughness: 0.3 }),
      driveshaft: new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.15 }),
      differential: new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.75, roughness: 0.3 }),
      suspension: new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.8, roughness: 0.2 }),
      tires: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.9, metalness: 0.1 }),
      rims: new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.1 }),
      brakes: new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.2 }),
      exhaust: new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.85, roughness: 0.25 })
    };

    const parts = {};

    // 1. IS300 BODY
    const is300Group = new THREE.Group();

    const floorPan = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.08, 4.4), materials.steel);
    floorPan.position.set(0, 0.15, 0);
    is300Group.add(floorPan);

    const sillL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 2.6), materials.is300Body);
    sillL.position.set(-0.86, 0.22, 0);
    is300Group.add(sillL);
    const sillR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 2.6), materials.is300Body);
    sillR.position.set(0.86, 0.22, 0);
    is300Group.add(sillR);

    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.34, 0.42), materials.is300Body);
    frontBumper.position.set(0, 0.28, 2.15);
    is300Group.add(frontBumper);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.04), materials.chromeGrille);
    grille.position.set(0, 0.46, 2.37);
    is300Group.add(grille);

    const fenderL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 1.25), materials.is300Body);
    fenderL.position.set(-0.85, 0.52, 1.45);
    is300Group.add(fenderL);
    const fenderR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 1.25), materials.is300Body);
    fenderR.position.set(0.85, 0.52, 1.45);
    is300Group.add(fenderR);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.06, 1.3), materials.is300Body);
    hood.position.set(0, 0.62, 1.45);
    hood.rotation.x = -0.06;
    is300Group.add(hood);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.68, 0.04), materials.is300Glass);
    windshield.position.set(0, 0.88, 0.55);
    windshield.rotation.x = -0.66;
    is300Group.add(windshield);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 1.28), materials.is300Roof);
    roof.position.set(0, 1.16, -0.15);
    is300Group.add(roof);

    const glassSideL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 1.3), materials.is300Glass);
    glassSideL.position.set(-0.72, 0.92, -0.15);
    is300Group.add(glassSideL);
    const glassSideR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 1.3), materials.is300Glass);
    glassSideR.position.set(0.72, 0.92, -0.15);
    is300Group.add(glassSideR);

    const doorsL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 1.35), materials.is300Body);
    doorsL.position.set(-0.84, 0.5, -0.15);
    is300Group.add(doorsL);
    const doorsR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 1.35), materials.is300Body);
    doorsR.position.set(0.84, 0.5, -0.15);
    is300Group.add(doorsR);

    const backGlass = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.68, 0.04), materials.is300Glass);
    backGlass.position.set(0, 0.94, -0.92);
    backGlass.rotation.x = 0.64;
    is300Group.add(backGlass);

    const trunkLid = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.06, 0.82), materials.is300Body);
    trunkLid.position.set(0, 0.72, -1.55);
    is300Group.add(trunkLid);

    const qtrL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 1.25), materials.is300Body);
    qtrL.position.set(-0.85, 0.54, -1.45);
    is300Group.add(qtrL);
    const qtrR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 1.25), materials.is300Body);
    qtrR.position.set(0.85, 0.54, -1.45);
    is300Group.add(qtrR);

    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.42, 0.38), materials.is300Body);
    rearBumper.position.set(0, 0.36, -2.12);
    is300Group.add(rearBumper);

    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.08), materials.headlights);
    headL.position.set(-0.62, 0.54, 2.32);
    is300Group.add(headL);
    const headR = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.08), materials.headlights);
    headR.position.set(0.62, 0.54, 2.32);
    is300Group.add(headR);

    const tailL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), materials.taillights);
    tailL.rotation.x = Math.PI / 2;
    tailL.position.set(-0.62, 0.64, -2.31);
    is300Group.add(tailL);
    const tailR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), materials.taillights);
    tailR.rotation.x = Math.PI / 2;
    tailR.position.set(0.62, 0.64, -2.31);
    is300Group.add(tailR);

    carRoot.add(is300Group);
    parts.frame = is300Group;

    // 2. 2JZ ENGINE
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.4, 1.35);

    const block = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.62, 1.38), materials.engineBlock);
    engineGroup.add(block);

    const headHead = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.26, 1.34), materials.engineHead);
    headHead.position.set(0, 0.42, 0);
    engineGroup.add(headHead);

    const camGear = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 20), materials.driveshaft);
    camGear.rotation.x = Math.PI / 2;
    camGear.position.set(0, 0.38, 0.72);
    engineGroup.add(camGear);

    const intakePlen = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.15, 16), materials.engineHead);
    intakePlen.rotation.x = Math.PI / 2;
    intakePlen.position.set(-0.32, 0.42, -0.05);
    engineGroup.add(intakePlen);

    carRoot.add(engineGroup);
    parts.engine = engineGroup;

    // 3. W55 TRANSMISSION
    const transGroup = new THREE.Group();
    transGroup.position.set(0, 0.28, 0.35);
    const bellHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.45, 18), materials.transmission);
    bellHousing.rotation.x = Math.PI / 2;
    bellHousing.position.set(0, 0, 0.22);
    transGroup.add(bellHousing);
    const gearboxCase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.38, 0.8), materials.transmission);
    gearboxCase.position.set(0, 0, -0.3);
    transGroup.add(gearboxCase);
    carRoot.add(transGroup);
    parts.transmission = transGroup;

    // 4. DRIVESHAFT
    const shaftGroup = new THREE.Group();
    const shaftFront = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.82, 16), materials.driveshaft);
    shaftFront.rotation.x = Math.PI / 2;
    shaftFront.position.set(0, 0.14, -0.45);
    shaftGroup.add(shaftFront);
    const centerBearing = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 16), materials.steel);
    centerBearing.rotation.x = Math.PI / 2;
    centerBearing.position.set(0, 0.14, -0.88);
    shaftGroup.add(centerBearing);
    const shaftRear = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.82, 16), materials.driveshaft);
    shaftRear.rotation.x = Math.PI / 2;
    shaftRear.position.set(0, 0.14, -1.32);
    shaftGroup.add(shaftRear);
    carRoot.add(shaftGroup);
    parts.driveshaft = shaftGroup;

    // 5. TORSEN LSD
    const diffGroup = new THREE.Group();
    diffGroup.position.set(0, 0.14, -1.75);
    const diffCase = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 18), materials.differential);
    diffGroup.add(diffCase);
    const axleL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.35, 16), materials.differential);
    axleL.rotation.z = Math.PI / 2;
    axleL.position.set(-0.68, 0, 0);
    diffGroup.add(axleL);
    const axleR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.35, 16), materials.differential);
    axleR.rotation.z = Math.PI / 2;
    axleR.position.set(0.68, 0, 0);
    diffGroup.add(axleR);
    carRoot.add(diffGroup);
    parts.differential = diffGroup;

    // 6. WHEELS & SUSPENSION
    const wheelsGroup = new THREE.Group();
    const wheelPositions = [
      { x: -0.92, y: 0.18, z: 1.4 },
      { x: 0.92, y: 0.18, z: 1.4 },
      { x: -0.92, y: 0.18, z: -1.4 },
      { x: 0.92, y: 0.18, z: -1.4 }
    ];
    wheelPositions.forEach((pos) => {
      const swg = new THREE.Group();
      swg.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 24), materials.tires);
      tire.rotation.z = Math.PI / 2;
      swg.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.26, 18), materials.rims);
      rim.rotation.z = Math.PI / 2;
      swg.add(rim);

      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), materials.brakes);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = pos.x > 0 ? -0.1 : 0.1;
      swg.add(rotor);

      const wishbone = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.14), materials.suspension);
      wishbone.position.set(pos.x > 0 ? -0.2 : 0.2, 0.18, 0);
      swg.add(wishbone);

      wheelsGroup.add(swg);
    });
    carRoot.add(wheelsGroup);
    parts.wheels = wheelsGroup;

    // 7. EXHAUST
    const exhaustGroup = new THREE.Group();
    const headers = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4, 16), materials.exhaust);
    headers.rotation.x = Math.PI / 2;
    headers.position.set(0.3, -0.02, 0.1);
    exhaustGroup.add(headers);

    const muffler = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.65), materials.exhaust);
    muffler.position.set(0.3, 0.02, -1.95);
    exhaustGroup.add(muffler);

    carRoot.add(exhaustGroup);
    parts.exhaust = exhaustGroup;

    partsRef.current = parts;

    const ro = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight || (window.innerWidth < 640 ? 320 : 480);
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    });
    ro.observe(container);

    let shaftRot = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
        if (isRotating) {
          carRoot.rotation.y += 0.003;
        }
      }

      shaftRot += 0.06;
      if (parts.driveshaft && parts.driveshaft.children[0]) {
        parts.driveshaft.children[0].rotation.z = shaftRot;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const parts = partsRef.current;
    if (!parts.engine) return;
    const mult = explodedView ? 1.6 : 1.0;
    parts.engine.position.set(0, 0.4 + (explodedView ? 0.7 : 0), 1.35 * mult);
    parts.transmission.position.set(0, 0.28 + (explodedView ? 0.35 : 0), 0.35 * mult);
    parts.differential.position.set(0, 0.14 + (explodedView ? 0.25 : 0), -1.75 * mult);
    parts.exhaust.position.set(explodedView ? 0.75 : 0, explodedView ? -0.35 : 0, 0);
  }, [explodedView]);

  useEffect(() => {
    const parts = partsRef.current;
    if (!parts.frame) return;
    parts.frame.children.forEach(child => {
      if (child.material && child.material.transparent) {
        child.visible = bodyTranslucent;
      }
    });
  }, [bodyTranslucent]);

  const setPresetAngle = (preset) => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    setIsRotating(false);

    const isMobile = window.innerWidth < 640;

    if (preset === 'quarter') {
      cameraRef.current.position.set(isMobile ? 5.8 : 7.6, isMobile ? 3.2 : 3.6, isMobile ? 5.4 : 6.8);
      controlsRef.current.target.set(0, 0.4, 0);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, isMobile ? 9.5 : 10.5, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    } else if (preset === 'side') {
      cameraRef.current.position.set(8.5, 1.0, 0);
      controlsRef.current.target.set(0, 0.2, 0);
    } else if (preset === 'engine') {
      cameraRef.current.position.set(2.4, 1.8, 3.2);
      controlsRef.current.target.set(0, 0.45, 1.35);
    }
  };

  const currentDetail = COMPONENT_DETAILS[activeHighlight] || COMPONENT_DETAILS.engine;

  return (
    <div className="w-full panel-minimal rounded-lg overflow-hidden flex flex-col">
      {/* Precision Control Bar */}
      <div className="px-3.5 py-2 border-b border-[#222428] bg-[#121316] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
          <h3 className="font-medium text-zinc-200 truncate">
            Lexus IS300 (XE10) 3D Chassis & 2JZ Powertrain
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono hidden md:inline shrink-0">
            JCE10 FR Platform
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={isRotating ? "default" : "secondary"}
            onClick={() => setIsRotating(!isRotating)}
          >
            <RotateCcw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Orbit' : 'Paused'}</span>
          </Button>

          <Button
            size="sm"
            variant={explodedView ? "default" : "secondary"}
            onClick={() => setExplodedView(!explodedView)}
          >
            <Layers className="w-3 h-3" />
            <span>{explodedView ? 'Collapse' : 'Explode'}</span>
          </Button>

          <Button
            size="sm"
            variant={bodyTranslucent ? "default" : "secondary"}
            onClick={() => setBodyTranslucent(!bodyTranslucent)}
          >
            <Eye className="w-3 h-3" />
            <span>Shell</span>
          </Button>

          <div className="flex rounded bg-[#1c1d21] p-0.5 border border-[#2a2c32]">
            {[
              { id: 'quarter', label: '3/4' },
              { id: 'top', label: 'Top' },
              { id: 'side', label: 'Side' },
              { id: 'engine', label: '2JZ' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPresetAngle(p.id)}
                className={`px-2 py-0.5 text-[11px] rounded transition ${
                  cameraPreset === p.id
                    ? 'bg-[#2e3037] text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Stage */}
      <div className="relative w-full h-[320px] sm:h-[480px] cursor-grab active:cursor-grabbing select-none bg-[#0e0f11]">
        <div ref={mountRef} className="w-full h-full" />

        {/* Desktop floating spec card */}
        <div className="hidden sm:block absolute bottom-3 left-3 max-w-sm p-3 rounded bg-[#121316]/95 border border-[#26282e] text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-zinc-100 text-sm">
              {currentDetail.name}
            </span>
            <Badge variant="outline">{currentDetail.badge}</Badge>
          </div>

          <ul className="text-[11px] text-zinc-400 mb-2 space-y-0.5">
            {currentDetail.bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono bg-[#0c0d0e] p-1.5 rounded border border-[#1f2025]">
            {currentDetail.specs.map((s, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-zinc-500">{s.label}:</span>
                <span className="text-zinc-300 font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Nav Chips */}
      <div className="px-3 py-2 bg-[#0c0d0e] border-t border-[#1e2024] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pl-1 shrink-0">
          Parts:
        </span>
        {Object.entries(COMPONENT_DETAILS).map(([key, info]) => {
          const isSelected = activeHighlight === key;
          return (
            <button
              key={key}
              onClick={() => setActiveHighlight(key)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap shrink-0 transition ${
                isSelected
                  ? 'bg-[#222428] text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#16171a]'
              }`}
            >
              {info.name.split(' (')[0].split(' Engine')[0]}
            </button>
          );
        })}
      </div>

      {/* Mobile Spec Details Card (Below canvas, crisp and ADHD-friendly) */}
      <div className="sm:hidden p-3 bg-[#121316] border-t border-[#1e2024] text-xs space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-zinc-100 text-xs">
            {currentDetail.name}
          </span>
          <Badge variant="outline">{currentDetail.badge}</Badge>
        </div>

        <ul className="text-[11px] text-zinc-400 space-y-0.5">
          {currentDetail.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono bg-[#0c0d0e] p-1.5 rounded border border-[#1f2025]">
          {currentDetail.specs.map((s, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-zinc-500">{s.label}:</span>
              <span className="text-zinc-300 font-medium">{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
