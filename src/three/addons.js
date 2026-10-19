import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Bolt-on parts for the white IS300 body (loadCar). Car space: x across, y up, nose toward +z,
// ground at y = 0. Positions come from measuring the body model (scripts/build-car-model.mjs source).
export const RIDE_DROP = 0.04; // lowering springs, metres

const v = (x, y, z) => new THREE.Vector3(x, y, z);

// Leading edge of the front bumper seen from above: (x, z), symmetric about x = 0.
const NOSE = [[0, 2.2], [0.45, 2.19], [0.62, 2.13], [0.75, 2.05], [0.85, 1.96], [0.9, 1.88]];
function noseZ(x) {
  const ax = Math.min(Math.abs(x), 0.9);
  for (let i = 1; i < NOSE.length; i++) {
    const [x0, z0] = NOSE[i - 1], [x1, z1] = NOSE[i];
    if (ax <= x1) return z0 + (z1 - z0) * ((ax - x0) / (x1 - x0));
  }
  return NOSE.at(-1)[1];
}

// Extrude a 2D outline. The outline is drawn in the plane named by `plane`, thickness along the third axis.
function extrude(points, depth, { plane = 'xy', bevel = 0.005 } = {}) {
  const shape = new THREE.Shape(points.map(([a, b]) => new THREE.Vector2(a, b)));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, depth - bevel * 2), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 12,
  });
  geo.translate(0, 0, bevel);
  if (plane === 'xz') geo.rotateX(Math.PI / 2);        // (x, z) outline; thickness downward from y = 0
  if (plane === 'zy') geo.rotateY(Math.PI / 2);        // (-z, y) outline; thickness along +x from x = 0
  return geo;
}

function materials() {
  const glow = { emissive: 0xffffff, emissiveIntensity: 0 };
  return {
    gloss: () => new THREE.MeshPhysicalMaterial({ color: 0x0f0f10, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06, ...glow }),
    satin: () => new THREE.MeshStandardMaterial({ color: 0x1b1b1c, roughness: 0.55, metalness: 0.5, ...glow }),
    steel: () => new THREE.MeshStandardMaterial({ color: 0x77797c, roughness: 0.35, metalness: 0.9, ...glow }),
    chrome: () => new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1, metalness: 1, ...glow }),
  };
}

function frontLip(m) {
  const outer = [], inner = [];
  for (let i = 0; i <= 36; i++) {
    const x = -0.9 + (1.8 * i) / 36, k = Math.abs(x) / 0.9;
    outer.push([x, noseZ(x) + 0.05 * (1 - 0.75 * k ** 4)]);
    inner.unshift([x, noseZ(x) - 0.13]);
  }
  const mesh = new THREE.Mesh(extrude([...outer, ...inner], 0.024, { plane: 'xz', bevel: 0.007 }), m.gloss());
  mesh.position.y = 0.19;
  return [{ object: mesh, from: v(0, -0.02, 0.8) }];
}

function sideSkirts(m) {
  const profile = [[0.8, 0.168], [0.918, 0.168], [0.942, 0.146], [0.94, 0.112], [0.916, 0.097], [0.8, 0.1]];
  const geo = extrude(profile, 2.02, { bevel: 0.012 });
  geo.translate(0, 0, -0.91);
  const mat = m.gloss();
  return [1, -1].map(side => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.x = side;
    return { object: mesh, from: v(side * 0.7, 0, 0) };
  });
}

function rearDiffuser(m) {
  const g = new THREE.Group();
  const mat = m.gloss();
  // A floor panel that rises toward the back, with five fins hanging under it.
  const floor = new THREE.Mesh(extrude([[-0.4, -1.86], [0.4, -1.86], [0.42, -2.22], [-0.42, -2.22]], 0.014, { plane: 'xz', bevel: 0.004 }), mat);
  floor.geometry.translate(0, 0, 1.86);
  floor.rotation.x = 0.13; // rises toward the back
  floor.position.set(0, 0.162, -1.86);
  g.add(floor);
  const fin = extrude([[1.88, 0.158], [2.235, 0.205], [2.235, 0.13], [1.98, 0.15]], 0.012, { plane: 'zy', bevel: 0.003 });
  for (const x of [-0.32, -0.16, 0, 0.16, 0.32]) {
    const mesh = new THREE.Mesh(fin, mat);
    mesh.position.x = x - 0.006;
    g.add(mesh);
  }
  return [{ object: g, from: v(0, -0.05, -0.8) }];
}

function rearWing(m) {
  const g = new THREE.Group();
  const gloss = m.gloss(), satin = m.satin();
  // Symmetric aerofoil section, pitched trailing edge up so the air pushes it down.
  const chord = 0.28, t = 0.13, upper = [], lower = [];
  for (let i = 0; i <= 24; i++) {
    const s = (1 - Math.cos((Math.PI * i) / 24)) / 2;
    const yt = 5 * t * chord * (0.2969 * Math.sqrt(s) - 0.126 * s - 0.3516 * s * s + 0.2843 * s ** 3 - 0.1036 * s ** 4);
    const u = -chord / 2 + s * chord; // u = -z: leading edge at the front (u negative = z positive)
    upper.push([u, yt]);
    lower.unshift([u, -yt]);
  }
  const blade = extrude([...upper, ...lower.slice(1, -1)], 1.56, { plane: 'zy', bevel: 0.006 });
  blade.translate(-0.78, 0, 0);
  blade.rotateX(0.16);
  const wing = new THREE.Mesh(blade, gloss);
  wing.position.set(0, 1.255, -1.98);
  g.add(wing);
  for (const side of [-1, 1]) {
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.012, 0.14, 0.34, 2, 0.005), gloss);
    plate.position.set(side * 0.786, 1.245, -1.99);
    const post = new THREE.Mesh(new RoundedBoxGeometry(0.02, 0.25, 0.085, 2, 0.008), satin);
    post.position.set(side * 0.44, 1.14, -1.95);
    post.rotation.x = 0.12;
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.018, 0.13, 2, 0.006), satin);
    foot.position.set(side * 0.44, 1.027, -1.94);
    g.add(plate, post, foot);
  }
  return [{ object: g, from: v(0, 0.8, -0.15) }];
}

function roofBox(m) {
  const bars = new THREE.Group();
  const satin = m.satin();
  for (const z of [-0.55, 0.2]) {
    const bar = new THREE.Mesh(new RoundedBoxGeometry(1.26, 0.026, 0.07, 3, 0.012), satin);
    bar.position.set(0, 1.445, z);
    bars.add(bar);
    for (const side of [-1, 1]) {
      const foot = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.12, 0.09, 2, 0.012), satin);
      foot.position.set(side * 0.56, 1.39, z);
      bars.add(foot);
    }
  }
  // A long pod: a stretched capsule with a flat floor and a lower, tapered nose.
  const geo = new THREE.CapsuleGeometry(0.5, 1, 10, 32);
  geo.rotateX(Math.PI / 2);
  geo.scale(0.78, 0.36, 0.875);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), z = pos.getZ(i);
    pos.setY(i, Math.max(y, -0.11) - 0.035 * Math.max(0, z / 0.875));
  }
  geo.computeVertexNormals();
  const box = new THREE.Mesh(geo, m.gloss());
  box.position.set(0, 1.57, -0.18);
  return [{ object: bars, from: v(0, 0.5, 0) }, { object: box, from: v(0, 1.0, 0), delay: 0.2 }];
}

function towHitch(m) {
  const g = new THREE.Group();
  const steel = m.steel(), chrome = m.chrome();
  const receiver = new THREE.Mesh(new RoundedBoxGeometry(0.065, 0.065, 0.4, 2, 0.008), steel);
  receiver.position.set(0, 0.13, -2.06);
  const bar = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.05, 0.14, 2, 0.006), steel);
  bar.position.set(0, 0.13, -2.3);
  const riser = new THREE.Mesh(new RoundedBoxGeometry(0.055, 0.09, 0.06, 2, 0.008), steel);
  riser.position.set(0, 0.165, -2.36);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.035, 16), chrome);
  neck.position.set(0, 0.226, -2.36);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.027, 24, 16), chrome);
  ball.position.set(0, 0.258, -2.36);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.1, 10), chrome);
  pin.rotation.z = Math.PI / 2;
  pin.position.set(0, 0.13, -2.21);
  g.add(receiver, bar, riser, neck, ball, pin);
  return [{ object: g, from: v(0, 0, -0.7) }];
}

const BUILDERS = { lip: frontLip, skirts: sideSkirts, diffuser: rearDiffuser, wing: rearWing, roofbox: roofBox, hitch: towHitch };

// Returns a root group plus, for each add-on, the pieces that fly in and the materials that flash on landing.
export function buildAddons() {
  const m = materials();
  const root = new THREE.Group();
  const items = {};
  for (const [id, build] of Object.entries(BUILDERS)) {
    const group = new THREE.Group();
    group.visible = false;
    const pieces = build(m).map(p => ({ delay: 0, ...p, home: p.object.position.clone() }));
    const mats = new Set();
    for (const p of pieces) {
      group.add(p.object);
      p.object.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        o.userData.addon = id;
        mats.add(o.material);
      });
    }
    root.add(group);
    const delay = Math.max(...pieces.map(p => p.delay));
    items[id] = { group, pieces, materials: [...mats], duration: 0.55 + delay };
  }
  return { root, items };
}
