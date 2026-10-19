import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// A stylised Lexus IS300 (XE10) built at real scale: 1 unit = 1 metre.
// Car faces +z; x is across the car; y is up; the ground is y = 0.
export const DIMENSIONS = {
  frontAxleZ: 1.40, rearAxleZ: -1.27, track: 0.75, wheelRadius: 0.312, wheelY: 0.312,
};
const { frontAxleZ, rearAxleZ, track, wheelY } = DIMENSIONS;
const UP = new THREE.Vector3(0, 1, 0);
const v = (x, y, z) => new THREE.Vector3(x, y, z);

function metal(color, roughness = 0.35, metalness = 0.85, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
}

// Cylinder spanning two points (used for arms, rails, shafts).
function rod(a, b, radius, material, segments = 14) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dir.length(), segments), material);
  mesh.position.copy(a).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
  return mesh;
}

// A shaft that can spin about its own axis: returns { group, spinner }.
function spinningShaft(a, b, radius, material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const group = new THREE.Group();
  group.position.copy(a).addScaledVector(dir, 0.5);
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
  const spinner = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dir.length(), 16), material);
  tube.rotation.x = Math.PI / 2;
  spinner.add(tube);
  group.add(spinner);
  return { group, spinner, length: dir.length() };
}

function tubeAlong(points, radius, material, segments = 64) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.3);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 12, false), material);
}

function coilSpring(bottom, top, radius, turns, wire, material) {
  const height = bottom.distanceTo(top);
  const pts = [];
  const steps = turns * 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, t * height, Math.sin(a) * radius));
  }
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps, wire, 8, false), material);
  mesh.position.copy(bottom);
  mesh.quaternion.setFromUnitVectors(UP, new THREE.Vector3().subVectors(top, bottom).normalize());
  return mesh;
}

// ---------- Body shell ----------
// Side profile in (z, y), extruded across the car, then pinched in plan view
// and at the greenhouse so it reads as a sedan instead of a slab.
function bodyProfile() {
  const s = new THREE.Shape();
  const archR = 0.38, archY = wheelY, sill = 0.2;
  const dz = Math.sqrt(archR ** 2 - (archY - sill) ** 2);
  const a0 = Math.PI + Math.atan2(archY - sill, dz), a1 = -Math.atan2(archY - sill, dz);
  s.moveTo(2.12, sill);
  s.quadraticCurveTo(2.25, 0.22, 2.25, 0.4);
  s.quadraticCurveTo(2.26, 0.58, 2.16, 0.64);
  s.quadraticCurveTo(1.6, 0.76, 0.86, 0.86);
  s.quadraticCurveTo(0.55, 1.08, 0.2, 1.34);
  s.quadraticCurveTo(-0.25, 1.43, -0.72, 1.36);
  s.quadraticCurveTo(-1.15, 1.1, -1.52, 0.99);
  s.quadraticCurveTo(-1.95, 0.98, -2.17, 0.96);
  s.quadraticCurveTo(-2.25, 0.92, -2.24, 0.7);
  s.quadraticCurveTo(-2.25, 0.3, -2.12, sill);
  s.lineTo(rearAxleZ - dz, sill);
  s.absarc(rearAxleZ, archY, archR, a0, a1, true);
  s.lineTo(frontAxleZ - dz, sill);
  s.absarc(frontAxleZ, archY, archR, a0, a1, true);
  s.lineTo(2.12, sill);
  return s;
}
const smooth = t => t * t * (3 - 2 * t);
const clamp01 = t => Math.min(1, Math.max(0, t));
export function bodyHalfWidthScale(y, z) {
  let s = 1;
  s *= 1 - 0.25 * smooth(clamp01((y - 0.86) / 0.54)); // tumblehome
  const e = clamp01((Math.abs(z) - 1.5) / 0.76);
  s *= 1 - 0.14 * e * e; // rounded nose and tail in plan view
  s *= 1 - 0.05 * clamp01((0.36 - y) / 0.16); // tuck under the sills
  return s;
}

function buildBody() {
  const group = new THREE.Group();
  const bevel = 0.035, halfW = 0.86;
  let geo = new THREE.ExtrudeGeometry(bodyProfile(), {
    depth: halfW * 2 - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, curveSegments: 28,
  });
  geo.translate(0, 0, -(halfW - bevel));
  geo.rotateY(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setX(i, pos.getX(i) * bodyHalfWidthScale(pos.getY(i), pos.getZ(i)));
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo, 1e-4);
  geo.computeVertexNormals();

  // X-ray shell: a fresnel glow that is bright at grazing angles and nearly clear face-on.
  const shell = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0x5b9dff) }, uBase: { value: 0.035 }, uFade: { value: 1 } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uBase; uniform float uFade; varying vec3 vN; varying vec3 vV;
      void main() { float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
        gl_FragColor = vec4(uColor * (f * 1.15 + uBase) * uFade, (f * 0.85 + uBase) * uFade); }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  }));
  shell.renderOrder = 10;
  group.add(shell);
  group.userData.shell = shell;

  // Character lines: window frames, B-pillar, door shuts, beltline.
  const lineMat = new THREE.LineBasicMaterial({
    userData: { baseOpacity: 0.55 }, color: 0x8fbaff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
  const onSide = (side, pts) => pts.map(([z, y]) => new THREE.Vector3(side * (halfW * bodyHalfWidthScale(y, z) + 0.004), y, z));
  const sideLines = [
    [[0.8, 0.9], [0.5, 1.1], [0.18, 1.31], [-0.25, 1.38], [-0.68, 1.32], [-1.05, 1.1], [-1.36, 0.97], [-0.3, 0.93], [0.8, 0.9]],
    [[-0.2, 0.92], [-0.24, 1.37]],
    [[0.84, 0.88], [0.86, 0.5], [0.82, 0.24]],
    [[-0.23, 0.92], [-0.23, 0.24]],
    [[-1.3, 0.97], [-1.2, 0.6], [-1.08, 0.24]],
    [[2.1, 0.62], [0.86, 0.8], [-1.52, 0.9], [-2.2, 0.88]],
  ];
  for (const side of [-1, 1]) for (const pts of sideLines) {
    const curve = new THREE.CatmullRomCurve3(onSide(side, pts), false, 'catmullrom', 0.2);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), lineMat));
  }
  group.userData.lineMat = lineMat;

  const headMat = new THREE.MeshStandardMaterial({ color: 0xe6f0ff, emissive: 0xcfe2ff, emissiveIntensity: 2.2, roughness: 0.2 });
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xff3347, emissive: 0xff2236, emissiveIntensity: 2.4, roughness: 0.3 });
  for (const side of [-1, 1]) {
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.08, 0.05, 2, 0.02), headMat);
    head.position.set(side * 0.56, 0.6, 2.17);
    head.rotation.set(-0.35, side * -0.22, side * 0.08);
    group.add(head);
    for (const x of [0.5, 0.68]) {
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 24), tailMat);
      tail.rotation.x = Math.PI / 2;
      tail.position.set(side * x, 0.8, -2.215);
      group.add(tail);
    }
  }
  return group;
}

// ---------- Mechanicals ----------
function buildEngine(mats) {
  const g = new THREE.Group();
  const iron = mats.iron, alloy = mats.alloy, black = mats.black;
  const block = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.4, 0.66, 3, 0.03), iron);
  block.position.set(0, 0.5, 0);
  const sump = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.12, 0.56, 3, 0.03), alloy);
  sump.position.set(0, 0.25, -0.03);
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.15, 0.68, 3, 0.03), alloy);
  head.position.set(0, 0.77, 0);
  const cover = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.09, 0.64, 4, 0.035), black);
  cover.position.set(0, 0.88, 0);
  g.add(block, sump, head, cover);
  for (let i = 0; i < 6; i++) {
    const z = 0.27 - i * 0.108;
    const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 12), alloy);
    coil.position.set(0, 0.94, z);
    g.add(coil);
    // Intake runners sweep from the head up to the plenum on the left.
    g.add(tubeAlong([v(-0.19, 0.76, z), v(-0.29, 0.8, z), v(-0.33, 0.9, z * 0.85)], 0.026, alloy, 12));
  }
  const plenum = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.48, 6, 16), alloy);
  plenum.rotation.x = Math.PI / 2;
  plenum.position.set(-0.34, 0.92, 0);
  const throttle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 18), black);
  throttle.rotation.x = Math.PI / 2;
  throttle.position.set(-0.34, 0.92, 0.36);
  const beltCover = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.46, 0.05, 3, 0.02), black);
  beltCover.position.set(0, 0.62, 0.35);
  const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.04, 28), alloy);
  pulley.rotation.x = Math.PI / 2;
  pulley.position.set(0, 0.42, 0.39);
  const alternator = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.13, 20), alloy);
  alternator.rotation.x = Math.PI / 2;
  alternator.position.set(0.2, 0.62, 0.3);
  g.add(plenum, throttle, beltCover, pulley, alternator);
  g.position.set(0, 0, 1.12);
  return g;
}

function buildTransmission(mats) {
  const g = new THREE.Group();
  const profile = [[0.21, 0], [0.21, -0.04], [0.19, -0.16], [0.14, -0.28], [0.12, -0.33], [0.115, -0.62], [0.09, -0.74], [0.05, -0.78]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const housing = new THREE.Mesh(new THREE.LatheGeometry(profile, 36), mats.alloy);
  housing.rotateX(Math.PI / 2);
  housing.position.set(0, 0.45, 0);
  const shifter = rod(v(0, 0.56, -0.38), v(0, 0.86, -0.42), 0.012, mats.black);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), mats.black);
  knob.position.set(0, 0.87, -0.42);
  g.add(housing, shifter, knob);
  g.position.set(0, 0, 0.78);
  return g;
}

function buildDriveshaft(mats, spinners) {
  const g = new THREE.Group();
  const a = v(0, 0.45, 0), mid = v(0, 0.4, -0.58), b = v(0, 0.34, -1.13);
  for (const [p, q] of [[a, mid], [mid, b]]) {
    const shaft = spinningShaft(p, q, 0.034, mats.shaft);
    spinners.push({ object: shaft.spinner, axis: 'z', rate: 1 });
    g.add(shaft.group);
  }
  const bearing = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.07, 0.06, 2, 0.015), mats.black);
  bearing.position.copy(mid);
  g.add(bearing);
  g.position.set(0, 0, 0);
  return g;
}

function buildDifferential(mats, spinners) {
  const g = new THREE.Group();
  const housing = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 20), mats.iron);
  housing.scale.set(1.05, 0.95, 0.85);
  const cover = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 32), mats.alloy);
  cover.rotation.x = Math.PI / 2;
  cover.position.z = -0.12;
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.16, 20), mats.iron);
  snout.rotation.x = Math.PI / 2;
  snout.position.z = 0.17;
  g.add(housing, cover, snout);
  for (const side of [-1, 1]) {
    const shaft = spinningShaft(v(side * 0.13, 0, 0), v(side * (track - 0.12), 0, 0), 0.022, mats.shaft);
    spinners.push({ object: shaft.spinner, axis: 'z', rate: 0.27 });
    g.add(shaft.group);
  }
  g.position.set(0, wheelY, rearAxleZ);
  return g;
}

function buildWheel(mats) {
  const g = new THREE.Group();
  const tireProfile = [[0.218, -0.1], [0.262, -0.108], [0.296, -0.1], [0.31, -0.072], [0.313, 0], [0.31, 0.072], [0.296, 0.1], [0.262, 0.108], [0.218, 0.1]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const tire = new THREE.Mesh(new THREE.LatheGeometry(tireProfile, 56), mats.rubber);
  tire.rotation.z = Math.PI / 2;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.212, 0.212, 0.19, 48, 1, true), mats.rim);
  barrel.rotation.z = Math.PI / 2;
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.214, 0.008, 8, 48), mats.rim);
  lip.rotation.y = Math.PI / 2;
  lip.position.x = 0.095;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.04, 24), mats.rim);
  hub.rotation.z = Math.PI / 2;
  hub.position.x = 0.07;
  g.add(tire, barrel, lip, hub);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const spoke = new THREE.Mesh(new RoundedBoxGeometry(0.02, 0.17, 0.04, 2, 0.008), mats.rim);
    spoke.position.set(0.075, Math.cos(a) * 0.13, Math.sin(a) * 0.13);
    spoke.rotation.x = -a;
    g.add(spoke);
  }
  return g;
}

function buildCorners(mats, spinners) {
  const wheels = new THREE.Group(), suspension = new THREE.Group(), brakes = new THREE.Group();
  for (const z of [frontAxleZ, rearAxleZ]) for (const side of [-1, 1]) {
    const center = v(side * track, wheelY, z);

    const wheelSpin = buildWheel(mats);
    const wheelHolder = new THREE.Group();
    wheelHolder.position.copy(center);
    if (side < 0) wheelHolder.rotation.y = Math.PI;
    wheelHolder.add(wheelSpin);
    wheels.add(wheelHolder);
    spinners.push({ object: wheelSpin, axis: 'x', rate: 0.27 * side });

    const discHolder = new THREE.Group();
    discHolder.position.copy(center);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.026, 40), mats.disc);
    disc.rotation.z = Math.PI / 2;
    disc.position.x = -side * 0.02;
    discHolder.add(disc);
    brakes.add(discHolder);
    spinners.push({ object: discHolder, axis: 'x', rate: 0.27 });
    const caliper = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.12, 0.17, 3, 0.022), mats.caliper);
    caliper.position.set(center.x - side * 0.02, center.y + 0.1, center.z - 0.08);
    caliper.rotation.x = 0.5;
    brakes.add(caliper);

    // Double wishbone: upper and lower A-arms, an upright, and a coilover.
    const inner = side * 0.34, outer = side * (track - 0.13);
    const upperBall = v(outer, wheelY + 0.19, z), lowerBall = v(side * (track - 0.11), wheelY - 0.15, z);
    for (const dz of [-0.16, 0.14]) {
      suspension.add(rod(v(inner, wheelY + 0.21, z + dz), upperBall, 0.014, mats.arm));
      suspension.add(rod(v(side * 0.28, wheelY - 0.13, z + dz * 1.2), lowerBall, 0.016, mats.arm));
    }
    suspension.add(rod(lowerBall, upperBall, 0.022, mats.arm));
    const springBottom = v(side * (track - 0.24), wheelY - 0.12, z);
    const springTop = v(side * (track - 0.3), wheelY + 0.4, z);
    suspension.add(coilSpring(springBottom, springTop, 0.045, 6, 0.008, mats.spring));
    suspension.add(rod(springBottom, springTop, 0.018, mats.black));
  }
  return { wheels, suspension, brakes };
}

function buildExhaust(mats) {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const z = 1.39 - i * 0.108;
    g.add(tubeAlong([v(0.19, 0.74, z), v(0.27, 0.68, z), v(0.3, 0.5, 1.12 + (z - 1.12) * 0.35)], 0.019, mats.exhaust, 16));
  }
  const route = [v(0.3, 0.5, 1.1), v(0.26, 0.24, 0.85), v(0.22, 0.2, 0.4), v(0.22, 0.2, -0.6), v(0.26, 0.21, -1.05), v(0.4, 0.24, -1.5), v(0.35, 0.24, -1.8), v(0.44, 0.26, -2.24)];
  g.add(tubeAlong(route, 0.03, mats.exhaust, 120));
  const cat = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.24, 6, 18), mats.exhaust);
  cat.rotation.x = Math.PI / 2;
  cat.position.set(0.22, 0.2, 0.42);
  const resonator = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.3, 6, 18), mats.exhaust);
  resonator.rotation.x = Math.PI / 2;
  resonator.position.set(0.22, 0.2, -0.45);
  const muffler = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.17, 0.42, 4, 0.06), mats.exhaust);
  muffler.position.set(0.34, 0.24, -1.72);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.07, 24, 1, true), mats.chrome);
  tip.rotation.x = Math.PI / 2;
  tip.position.set(0.44, 0.26, -2.24);
  g.add(cat, resonator, muffler, tip);
  return g;
}

function buildStructure(mats) {
  const g = new THREE.Group();
  for (const side of [-1, 1]) g.add(tubeAlong([v(side * 0.58, 0.26, 2.0), v(side * 0.6, 0.22, 1.0), v(side * 0.62, 0.2, -0.2), v(side * 0.6, 0.22, -1.4), v(side * 0.56, 0.3, -2.05)], 0.028, mats.frame, 48));
  for (const z of [frontAxleZ + 0.02, rearAxleZ + 0.05]) g.add(rod(v(-0.6, 0.24, z), v(0.6, 0.24, z), 0.028, mats.frame));
  g.add(rod(v(-0.6, 0.24, 0.6), v(0.6, 0.24, 0.6), 0.02, mats.frame));
  return g;
}

export function buildCar() {
  const mats = {
    iron: metal(0x5d6676, 0.55, 0.75),
    alloy: metal(0xb9c3d3, 0.28, 0.9),
    black: metal(0x1a1f2a, 0.45, 0.5),
    shaft: metal(0xc8d0dc, 0.2, 0.95),
    rubber: new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.92, metalness: 0 }),
    rim: metal(0xd7dee9, 0.18, 0.95),
    disc: metal(0x8d96a5, 0.35, 0.9),
    caliper: metal(0x5b616c, 0.35, 0.6),
    arm: metal(0x47505f, 0.45, 0.8),
    spring: metal(0x9aa3b1, 0.3, 0.8),
    exhaust: metal(0x8a8f98, 0.4, 0.85),
    chrome: metal(0xf2f5fa, 0.08, 1),
    frame: metal(0x2a3240, 0.6, 0.6),
  };
  const spinners = [];
  const root = new THREE.Group();
  const corners = buildCorners(mats, spinners);
  const parts = {
    body: buildBody(),
    structure: buildStructure(mats),
    engine: buildEngine(mats),
    transmission: buildTransmission(mats),
    driveshaft: buildDriveshaft(mats, spinners),
    differential: buildDifferential(mats, spinners),
    exhaust: buildExhaust(mats),
    ...corners,
  };
  for (const [name, part] of Object.entries(parts)) {
    part.name = name;
    part.userData.home = part.position.clone();
    part.traverse(o => { if (o.isMesh && name !== 'body') { o.castShadow = true; o.receiveShadow = true; } });
    root.add(part);
  }
  // Highlighting needs per-part materials so lighting one part leaves the others alone.
  for (const name of ['engine', 'transmission', 'driveshaft', 'differential', 'suspension', 'brakes', 'exhaust']) {
    const cache = new Map();
    parts[name].traverse(o => {
      if (!o.isMesh) return;
      if (!cache.has(o.material)) cache.set(o.material, o.material.clone());
      o.material = cache.get(o.material);
    });
    parts[name].userData.materials = [...cache.values()];
  }
  return { root, parts, spinners };
}

export const EXPLODE_OFFSETS = {
  engine: v(0, 0.62, 0.45), transmission: v(0, 0.36, 0.05), driveshaft: v(0, -0.2, 0),
  differential: v(0, 0.42, -0.3), exhaust: v(0.42, -0.28, 0), body: v(0, 0.55, 0),
};
