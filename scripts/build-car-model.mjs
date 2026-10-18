// Rebuilds public/models/is300/altezza.glb from the source model.
//
// Source: "Draft request: Toyota Altezza 2001" by Chai (BaizilikoVIIChai), Sketchfab,
// CC BY 4.0 — https://sketchfab.com/3d-models/0396aafda6294dc4843250d979783656
// Fetched from the Objaverse mirror (no Sketchfab login needed).
// Changes: geometry welded and compressed; materials are replaced at runtime.
//
// Usage: node scripts/build-car-model.mjs
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, meshopt, quantize } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';

const SOURCE_URL = 'https://huggingface.co/datasets/allenai/objaverse/resolve/main/glbs/000-153/0396aafda6294dc4843250d979783656.glb';
const cacheDir = new URL('../.cache/models/', import.meta.url);
const sourcePath = new URL('altezza-source.glb', cacheDir);
const outPath = new URL('../public/models/is300/altezza.glb', import.meta.url);

if (!existsSync(sourcePath)) {
  mkdirSync(cacheDir, { recursive: true });
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  writeFileSync(sourcePath, Buffer.from(await res.arrayBuffer()));
}

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(sourcePath.pathname);
await doc.transform(
  dedup(),
  weld(),
  prune(),
  quantize({ quantizePosition: 14, quantizeNormal: 10 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
mkdirSync(new URL('.', outPath), { recursive: true });
await io.write(outPath.pathname, doc);
console.log(`Wrote ${outPath.pathname} (${(statSync(outPath).size / 1024).toFixed(0)} KB)`);
