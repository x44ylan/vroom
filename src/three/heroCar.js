import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Toyota Altezza / Lexus IS300 (XE10) by Chai, CC BY 4.0 — see scripts/build-car-model.mjs.
export const MODEL_URL = `${import.meta.env.BASE_URL}models/is300/altezza.glb`;

// Source material name -> role. Determined by isolating each material in the model.
const ROLES = {
  material: 'paint', material_1: 'gap', material_2: 'moulding', material_3: 'underbody',
  material_4: 'glass', material_5: 'tyre', '.001': 'chrome', '.002': 'trimBlack', '.001_0': 'trimBlack',
  material_9: 'lamp', 'Material.001': 'tailLamp', material_11: 'rim', material_12: 'caliper',
  material_13: 'chassis', material_14: 'exhaust', material_15: 'chassis', '.004': 'wiper', '.003': 'wiper',
};

// Dark studio with soft-box strips. White paint needs dark surroundings to show its shape:
// the sides reflect the dark walls, the top and shoulders pick up the bright strips.
function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `varying vec3 vP;
      void main(){
        float h = normalize(vP).y;
        vec3 floorC = vec3(0.02, 0.025, 0.035), wall = vec3(0.05, 0.06, 0.08), ceil = vec3(0.12, 0.13, 0.16);
        vec3 c = h < 0.0 ? mix(wall, floorC, smoothstep(0.0, -0.4, h)) : mix(wall, ceil, smoothstep(0.0, 0.8, h));
        gl_FragColor = vec4(c, 1.0);
      }`,
  }));
  env.add(room);
  const panel = (w, h, intensity, color = 0xffffff) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
  // Overhead soft boxes (long strips along the car), one key panel to the front-right, a cool rim panel behind.
  for (const x of [-1.6, 0, 1.6]) { const m = panel(0.9, 9, 9); m.position.set(x, 7, 0); m.rotation.x = Math.PI / 2; env.add(m); }
  const key = panel(6, 3, 6); key.position.set(9, 3, 6); key.lookAt(0, 0.5, 0); env.add(key);
  const fill = panel(4, 2, 2.5); fill.position.set(-9, 2.5, 3); fill.lookAt(0, 0.5, 0); env.add(fill);
  const rim = panel(10, 1.2, 5, 0xd2d2d2); rim.position.set(0, 2.2, -10); rim.lookAt(0, 0.5, 0); env.add(rim);
  const floorBounce = panel(8, 8, 0.25); floorBounce.position.set(0, -0.2, 0); floorBounce.rotation.x = -Math.PI / 2; env.add(floorBounce);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.02).texture;
  pmrem.dispose();
  env.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
  return tex;
}

export function createMaterials() {
  // Lexus "Crystal White"-style solid white under a glossy clearcoat.
  const paint = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#e9e9e9'), metalness: 0.0, roughness: 0.42,
    clearcoat: 1, clearcoatRoughness: 0.025, envMapIntensity: 1.0,
  });
  return {
    paint,
    gap: new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#9c9c9c'), roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.05 }),
    trimBlack: new THREE.MeshPhysicalMaterial({ color: 0x212121, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
    // Side rubbing strips and hood shut lines: a mid grey reads as a seam on white paint, not a stripe.
    moulding: new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#757575'), roughness: 0.5, clearcoat: 0.8, clearcoatRoughness: 0.1 }),
    underbody: new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.95 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x191919, metalness: 0, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.82, envMapIntensity: 1.6 }),
    tyre: new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xf2f2f2, metalness: 1, roughness: 0.1 }),
    lamp: new THREE.MeshPhysicalMaterial({ color: 0xe7e7e7, metalness: 0.6, roughness: 0.12, clearcoat: 1, emissive: 0xeaeaea, emissiveIntensity: 0 }),
    tailLamp: new THREE.MeshPhysicalMaterial({ color: 0x777777, roughness: 0.18, clearcoat: 1, emissive: 0xc3c3c3, emissiveIntensity: 0 }),
    rim: new THREE.MeshStandardMaterial({ color: 0xcfcfcf, metalness: 1, roughness: 0.22 }),
    caliper: new THREE.MeshStandardMaterial({ color: 0xa1a1a1, metalness: 0.3, roughness: 0.4 }),
    chassis: new THREE.MeshStandardMaterial({ color: 0x474747, metalness: 0.7, roughness: 0.5 }),
    exhaust: new THREE.MeshStandardMaterial({ color: 0xbebebe, metalness: 1, roughness: 0.25 }),
    wiper: new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.6 }),
  };
}

// Body shader. Two effects share it:
// - Paint reveal (landing intro): a scan line travels nose -> tail; ahead of it the car is a blueprint.
// - Part locator (car overview): an x-ray lens opens over up to four zones (capsules in car space), seen
//   from the camera, and a ripple runs across the body from the part so you can see where it sits.
export const MAX_ZONES = 4;

function addReveal(material, uniforms) {
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCarPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvCarPos = (uCarInverse * modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.vertexShader = 'uniform mat4 uCarInverse;\n' + shader.vertexShader;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vCarPos;
        uniform float uReveal; uniform vec3 uScanColor; uniform float uLength;
        uniform vec4 uZoneA[${MAX_ZONES}]; uniform vec4 uZoneB[${MAX_ZONES}];
        uniform float uLens; uniform float uWave; uniform float uWaveAmp; uniform vec3 uCamLocal;
        float segDist(vec3 p, vec3 a, vec3 b) {
          vec3 pa = p - a, ba = b - a;
          return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0));
        }
        // Distance between the camera ray through this pixel and a segment: an x-ray lens that
        // keeps the same size at the part's depth however the camera looks at it.
        float raySegDist(vec3 ro, vec3 rd, vec3 a, vec3 b) {
          vec3 ba = b - a, oa = ro - a;
          float baba = dot(ba, ba), bard = dot(ba, rd), denom = baba - bard * bard;
          float s = denom > 1e-6 ? clamp((dot(ba, oa) - bard * dot(rd, oa)) / denom, 0.0, 1.0) : 0.0;
          vec3 q = a + ba * s;
          return length(ro + rd * max(dot(q - ro, rd), 0.0) - q);
        }`)
      .replace('#include <opaque_fragment>', `
        float zn = clamp(0.5 - vCarPos.z / uLength, 0.0, 1.0);   // 0 at the nose, 1 at the tail
        float front = uReveal * 1.1 - 0.05;
        float painted = smoothstep(front + 0.01, front - 0.01, zn);
        float line = exp(-pow((zn - front) / 0.008, 2.0)) * step(0.001, uReveal) * step(uReveal, 0.999);
        float lens = 0.0, edge = 0.0, wave = 0.0;
        if (uLens > 0.001 || uWaveAmp > 0.001) {
          vec3 rd = normalize(vCarPos - uCamLocal);
          for (int i = 0; i < ${MAX_ZONES}; i++) {
            if (uZoneB[i].w > 0.5) {
              float r = uZoneA[i].w * uLens;
              float dr = raySegDist(uCamLocal, rd, uZoneA[i].xyz, uZoneB[i].xyz);
              lens = max(lens, smoothstep(r + 0.025, r - 0.025, dr));
              edge = max(edge, exp(-pow((dr - r) / 0.01, 2.0)) * step(0.02, r));
              wave = max(wave, exp(-pow((segDist(vCarPos, uZoneA[i].xyz, uZoneB[i].xyz) - uWave) / 0.05, 2.0)));
            }
          }
        }
        painted *= 1.0 - lens;
        float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.5);
        vec3 ghost = uScanColor * (0.04 + fres * 0.7);
        float glow = line * 3.0 + edge * 1.4 + wave * uWaveAmp * 1.6;
        vec3 rgb = mix(ghost, outgoingLight, painted) + uScanColor * glow;
        float alpha = mix(0.08 + fres * 0.6, diffuseColor.a, painted);
        gl_FragColor = vec4(rgb, max(alpha, min(glow, 1.0)));`);
  };
  material.customProgramCacheKey = () => `reveal-${material.type}-${material.transparent}`;
  material.transparent = true;
}

export async function loadCar(renderer, { ghost = [] } = {}) {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(MODEL_URL);
  const car = gltf.scene;

  // Normalise: ground at y = 0, centred, nose toward +z, real length ~4.4 m.
  // Measure the actual vertices: the compressed wheels are rotated, so their rough boxes reach below the tyres.
  const box = new THREE.Box3().setFromObject(car, true);
  const centre = box.getCenter(new THREE.Vector3());
  car.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z));
  const turn = new THREE.Group();
  turn.rotation.y = Math.PI;      // source faces -z; our scenes use nose toward +z
  turn.add(car);
  const wrapper = new THREE.Group();
  wrapper.add(turn);
  const size = box.getSize(new THREE.Vector3());

  const mats = createMaterials();
  const uniforms = {
    uReveal: { value: 1 }, uScanColor: { value: new THREE.Color('#cdcdcd') },
    uLength: { value: size.z }, uCarInverse: { value: new THREE.Matrix4() },
    uZoneA: { value: Array.from({ length: MAX_ZONES }, () => new THREE.Vector4()) },
    uZoneB: { value: Array.from({ length: MAX_ZONES }, () => new THREE.Vector4()) },
    uLens: { value: 0 }, uWave: { value: 0 }, uWaveAmp: { value: 0 }, uCamLocal: { value: new THREE.Vector3() },
  };
  for (const key of ['paint', 'trimBlack', 'moulding', 'glass', 'chrome', 'lamp', 'tailLamp', 'gap', 'wiper', ...ghost]) addReveal(mats[key], uniforms);

  const wheels = [];
  car.traverse(o => {
    if (!o.isMesh) return;
    const role = ROLES[o.material.name] || 'chassis';
    o.material = mats[role];
    o.castShadow = role !== 'glass';
    o.receiveShadow = role === 'paint';
    if (role === 'glass') o.renderOrder = 2;
    if (role === 'rim' && o.parent && !wheels.includes(o.parent)) wheels.push(o.parent);
  });

  return { car: wrapper, mats, uniforms, wheels, size };
}

export function createStage(renderer, { transparent = true } = {}) {
  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 1.0;
  if (!transparent) scene.background = new THREE.Color(0x101010);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3.5, 8, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
  key.shadow.bias = -0.0003;
  key.shadow.radius = 8;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcecece, 1.6);
  rim.position.set(-5, 3, -5);
  scene.add(rim);

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.55 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.receiveShadow = true;
  scene.add(shadow);

  // Soft contact shadow under the car (painted gradient, always present).
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(0.6, 'rgba(0,0,0,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 5.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.002;
  scene.add(contact);

  // Floor grid that draws outward during the intro.
  const gridUniforms = { uGrow: { value: 1 }, uColor: { value: new THREE.Color('#c4c4c4') } };
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShaderMaterial({
    uniforms: gridUniforms, transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform float uGrow; uniform vec3 uColor; varying vec2 vP;
      void main(){
        vec2 g = abs(fract(vP / 0.5 - 0.5) - 0.5) / fwidth(vP / 0.5);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        float r = length(vP);
        float reach = uGrow * 12.0;
        float fade = smoothstep(reach, reach - 3.0, r) * smoothstep(12.0, 2.0, r);
        float ring = exp(-pow((r - reach) / 0.12, 2.0)) * step(uGrow, 0.99);
        gl_FragColor = vec4(uColor, line * fade * 0.22 + ring * 0.6);
      }`,
  }));
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = 0.001;
  scene.add(grid);

  return { scene, key, rim, grid, gridUniforms, contact };
}
