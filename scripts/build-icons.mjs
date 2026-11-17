import { readFile, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { chromium } from '@playwright/test';

// Encode RGBA bytes directly so canvas premultiplication cannot darken faint edges.
function pngChunk(type, data) {
  const name = Buffer.from(type);
  let crc = 0xffffffff;
  for (const byte of Buffer.concat([name, data])) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  const chunk = Buffer.alloc(data.length + 12);
  chunk.writeUInt32BE(data.length, 0);
  name.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, data.length + 8);
  return chunk;
}

// favicon.svg is the editable source. The app has a fixed dark theme, so its
// explicit dark variant stays white even when the browser uses a light OS theme.
const assets = new URL('../public/', import.meta.url);
const source = await readFile(new URL('favicon.svg', assets), 'utf8');
const variant = ink => source.replace(/\s*<style>[\s\S]*?<\/style>/, '').replace('stroke="currentColor"', `stroke="${ink}"`);
const white = variant('#f5f5f5');
await writeFile(new URL('favicon-dark.svg', assets), white);
await writeFile(new URL('favicon-light.svg', assets), variant('#1f1f1f'));

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const rgba = await page.evaluate(async svg => {
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await image.decode();
    // Render at 3x, then downsample with high-quality smoothing and preserve alpha.
    const large = document.createElement('canvas');
    large.width = large.height = 540;
    large.getContext('2d').drawImage(image, 0, 0, 540, 540);
    const small = document.createElement('canvas');
    small.width = small.height = 180;
    const ctx = small.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(large, 0, 0, 180, 180);
    const pixels = ctx.getImageData(0, 0, 180, 180);
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i + 3]) pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 245;
    }
    return Array.from(pixels.data);
  }, white.replace('viewBox="0 0 32 32"', 'viewBox="-4 -4 40 40"'));
  const header = Buffer.alloc(13);
  header.writeUInt32BE(180, 0);
  header.writeUInt32BE(180, 4);
  header[8] = 8;
  header[9] = 6; // 8-bit RGBA.
  const rows = Buffer.alloc(180 * (1 + 180 * 4));
  const pixels = Buffer.from(rgba);
  for (let row = 0; row < 180; row++) pixels.copy(rows, row * 721 + 1, row * 720, (row + 1) * 720);
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(rows)), pngChunk('IEND', Buffer.alloc(0))]);
  await writeFile(new URL('apple-touch-icon.png', assets), png);
} finally {
  await browser.close();
}
console.log('Generated light/dark SVGs and the transparent 180px touch icon.');
