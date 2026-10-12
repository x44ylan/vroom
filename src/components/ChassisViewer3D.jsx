import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
      name: '2JZ-GE 3.0L INLINE-6',
      tag: 'POWERTRAIN',
      bullets: [
        'Naturally aspirated DOHC 24-valve crossflow head with VVT-i',
        'Cast-iron deep-skirt block with 7 main crankshaft bearings',
        'Shares legendary Mk4 Supra architecture; handles 500+ HP boost'
      ],
      specs: [
        { label: 'DISPLACEMENT', val: '2,997 CC' },
        { label: 'OUTPUT', val: '215 HP @ 5.8K' },
        { label: 'TORQUE', val: '218 LB-FT' },
        { label: 'FIRING', val: '1-5-3-6-2-4' }
      ]
    },
    transmission: {
      name: 'W55 5-SPEED MANUAL',
      tag: 'DRIVETRAIN',
      bullets: [
        'Close-ratio 5-speed manual with direct floor shift linkage',
        '0.78:1 overdrive 5th gear drops cruising RPM on highways',
        'Dampened dual-mass flywheel smooths out torque pulses'
      ],
      specs: [
        { label: '1ST GEAR', val: '3.57:1' },
        { label: '4TH DIRECT', val: '1.00:1' },
        { label: '5TH OVERDRIVE', val: '0.78:1' },
        { label: 'FINAL DRIVE', val: '3.73:1' }
      ]
    },
    driveshaft: {
      name: 'TWO-PIECE PROPELLER SHAFT',
      tag: 'CHASSIS',
      bullets: [
        'Balanced high-tensile tubular steel two-piece shaft',
        'Rubber-isolated center hanger bearing eliminates cabin harmonics',
        'Delivers 2JZ torque directly down the tunnel to the rear axle'
      ],
      specs: [
        { label: 'MATERIAL', val: 'HIGH-TENSILE STEEL' },
        { label: 'SEGMENTS', val: '2-PIECE BALANCED' },
        { label: 'JOINTS', val: 'UNIVERSAL U-JOINTS' },
        { label: 'ISOLATION', val: 'RUBBER BUSHING' }
      ]
    },
    differential: {
      name: 'TORSEN TYPE-2 (T-2) LSD',
      tag: 'TRACTION',
      bullets: [
        'Crossed helical worm gears dynamically bias torque in turns',
        'Sends up to 2.5× more power to the gripping outer tire',
        'Zero clutch friction discs to wear out or replace'
      ],
      specs: [
        { label: 'RATIO', val: '3.73:1' },
        { label: 'TORQUE BIAS', val: '2.5:1 TBR' },
        { label: 'GEARS', val: 'HELICAL PLANET' },
        { label: 'CASING', val: 'TOYOTA M85' }
      ]
    },
    suspension: {
      name: '4-WHEEL DOUBLE-WISHBONE',
      tag: 'KINEMATICS',
      bullets: [
        'High-mount front upper A-arms and rear multi-link wishbones',
        'Negative camber gain keeps tire contact patch flat in high-G turns',
        'Sports saloon dynamics with Tokico monotube gas dampers'
      ],
      specs: [
        { label: 'FRONT', val: 'DOUBLE WISHBONE' },
        { label: 'REAR', val: 'MULTI-LINK' },
        { label: 'DAMPERS', val: 'TOKICO MONOTUBE' },
        { label: 'BARS', val: 'SOLID ANTI-ROLL' }
      ]
    },
    brakes: {
      name: 'VENTILATED DISC BRAKES',
      tag: 'SAFETY',
      bullets: [
        '296mm front ventilated cast-iron rotors with 2-piston calipers',
        '4-channel ABS pulses up to 20× per second to stop lockups',
        'Electronic Brakeforce Distribution (EBD) balances front/rear pressure'
      ],
      specs: [
        { label: 'FRONT', val: '296 MM VENTED' },
        { label: 'REAR', val: '307 MM SOLID' },
        { label: 'ABS', val: '4-CHANNEL 20HZ' },
        { label: 'FLUID', val: 'DOT 4 GLYCOL' }
      ]
    },
    exhaust: {
      name: 'STAINLESS STEEL EXHAUST',
      tag: 'EMISSIONS',
      bullets: [
        'Equal-length stainless headers with dual close-coupled pre-cats',
        'Dual bank heated oxygen sensors maintain closed-loop lambda',
        'Free-flowing rear acoustic resonator with polished chrome tip'
      ],
      specs: [
        { label: 'HEADERS', val: 'TUBULAR STAINLESS' },
        { label: 'SENSORS', val: 'DUAL O2 LAMBDA' },
        { label: 'STANDARD', val: 'LEVII CERTIFIED' },
        { label: 'TIP', val: 'CHROME BEZEL' }
      ]
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // Pure black zPod canvas
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.04);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight || (isMobile ? 360 : 540);
    const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 34, width / height, 0.1, 100);
    if (isMobile) {
      camera.position.set(5.5, 3.2, 5.2);
    } else {
      camera.position.set(7.2, 3.5, 6.5);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
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

    // Dramatic studio high-contrast lighting (zPod style)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const topKey = new THREE.DirectionalLight(0xffffff, 2.2);
    topKey.position.set(6, 14, 6);
    topKey.castShadow = true;
    scene.add(topKey);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    // Dark sleek reflective ground
    const grid = new THREE.GridHelper(16, 24, 0x1f1f1f, 0x0a0a0a);
    grid.position.y = -0.95;
    scene.add(grid);

    const carRoot = new THREE.Group();
    scene.add(carRoot);

    // Monochromatic, precision high-gloss materials
    const materials = {
      is300Body: new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      }),
      is300Roof: new THREE.MeshStandardMaterial({
        color: 0x181818,
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: 0.55
      }),
      is300Glass: new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.98,
        roughness: 0.02,
        transparent: true,
        opacity: 0.65
      }),
      headlights: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      taillights: new THREE.MeshBasicMaterial({ color: 0xe11d48 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.98, roughness: 0.05 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.3 }),
      engineBlock: new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8, roughness: 0.2 }),
      engineHead: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 }),
      transmission: new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.75, roughness: 0.3 }),
      driveshaft: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 }),
      differential: new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.8, roughness: 0.25 }),
      suspension: new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.85, roughness: 0.2 }),
      tires: new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.95, metalness: 0.05 }),
      rims: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.98, roughness: 0.08 }),
      brakes: new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.15 }),
      exhaust: new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.9, roughness: 0.2 })
    };

    const parts = {};

    // 1. IS300 SCULPTED BODY
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

    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.04), materials.chrome);
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
      const nh = container.clientHeight || (window.innerWidth < 768 ? 360 : 540);
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

    const isMobile = window.innerWidth < 768;

    if (preset === 'quarter') {
      cameraRef.current.position.set(isMobile ? 5.5 : 7.2, isMobile ? 3.2 : 3.5, isMobile ? 5.2 : 6.5);
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
    <div className="w-full bg-[#050505] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      {/* zPod Top Control Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <h3 className="font-heading font-medium text-xs sm:text-sm tracking-wider uppercase text-white">
            Lexus IS300 (XE10) 3D Chassis & 2JZ Powertrain
          </h3>
          <span className="text-[10px] tracking-widest text-zinc-500 font-mono hidden md:inline">
            [JCE10 · FR]
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition ${
              isRotating
                ? 'bg-white text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            {isRotating ? 'Orbit ON' : 'Paused'}
          </button>

          <button
            onClick={() => setExplodedView(!explodedView)}
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition ${
              explodedView
                ? 'bg-white text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            {explodedView ? 'Collapse' : 'Explode'}
          </button>

          <button
            onClick={() => setBodyTranslucent(!bodyTranslucent)}
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition ${
              bodyTranslucent
                ? 'bg-white text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            {bodyTranslucent ? 'Shell ON' : 'Shell OFF'}
          </button>

          <div className="flex rounded-full bg-zinc-900 p-0.5 border border-white/10">
            {[
              { id: 'quarter', label: '3/4' },
              { id: 'top', label: 'Top' },
              { id: 'side', label: 'Side' },
              { id: 'engine', label: '2JZ' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPresetAngle(p.id)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition uppercase tracking-wider ${
                  cameraPreset === p.id
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Stage */}
      <div className="relative w-full h-[360px] sm:h-[540px] cursor-grab active:cursor-grabbing select-none bg-black">
        <div ref={mountRef} className="w-full h-full" />

        {/* Desktop floating spec card (hidden on mobile) */}
        <div className="hidden md:block absolute bottom-4 left-4 max-w-sm p-4 rounded-xl bg-black/85 border border-white/15 text-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-heading font-semibold text-white tracking-wider text-sm">
              {currentDetail.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-zinc-300 font-mono tracking-wider">
              {currentDetail.tag}
            </span>
          </div>

          <ul className="text-[11px] text-zinc-400 mb-3 space-y-1">
            {currentDetail.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-zinc-900/80 p-2 rounded-lg border border-white/10">
            {currentDetail.specs.map((s, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-zinc-500">{s.label}:</span>
                <span className="text-white font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Navigation Chips */}
      <div className="px-4 py-2.5 bg-[#080808] border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1 shrink-0">
          PARTS:
        </span>
        {Object.entries(COMPONENT_DETAILS).map(([key, info]) => {
          const isSelected = activeHighlight === key;
          return (
            <button
              key={key}
              onClick={() => setActiveHighlight(key)}
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {info.name.split(' 3.0L')[0].split(' MANUAL')[0]}
            </button>
          );
        })}
      </div>

      {/* Mobile Spec Details Card (Below 3D Canvas) */}
      <div className="md:hidden p-4 bg-[#080808] border-t border-white/10 text-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading font-semibold text-white tracking-wider text-sm">
            {currentDetail.name}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-zinc-300 font-mono tracking-wider">
            {currentDetail.tag}
          </span>
        </div>

        <ul className="text-[11px] text-zinc-400 space-y-1">
          {currentDetail.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-1.5 leading-snug">
              <span className="text-zinc-600 mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-zinc-900/80 p-2.5 rounded-lg border border-white/10">
          {currentDetail.specs.map((s, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-zinc-500">{s.label}:</span>
              <span className="text-white font-medium">{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
