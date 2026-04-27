/**
 * Generates simple PWA icons (192x192 and 512x512) as PNG files.
 * Uses only Node built-ins — no extra dependencies.
 *
 * Design: dark bg (#030712) with a red Poké Ball circle in the center.
 */

import { createWriteStream } from "fs";
import { deflateSync } from "zlib";


function crc32(buf) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function u32be(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.from(u32be(data.length));
  const crcInput = Buffer.concat([typeBytes, data]);
  const crc = Buffer.from(u32be(crc32(crcInput)));
  return Buffer.concat([len, typeBytes, data, crc]);
}

function generatePNG(size) {
  const BG = [3, 7, 18];           // #030712
  const RED = [220, 38, 38];       // #dc2626
  const WHITE = [255, 255, 255];
  const DARK = [10, 10, 20];

  const cx = size / 2, cy = size / 2;
  const radius = size * 0.38;
  const bandH = size * 0.04;

  // Build raw pixel data (RGBA)
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;

      let r = BG[0], g = BG[1], b = BG[2], a = 255;

      if (dist <= radius) {
        if (Math.abs(dy) <= bandH) {
          r = DARK[0]; g = DARK[1]; b = DARK[2];
        } else if (dy < 0) {
          r = RED[0]; g = RED[1]; b = RED[2];
        } else {
          r = WHITE[0]; g = WHITE[1]; b = WHITE[2];
        }
      }

      // Center button
      const btnR = size * 0.07;
      if (dist <= btnR) {
        r = WHITE[0]; g = WHITE[1]; b = WHITE[2];
      }
      if (dist <= btnR * 0.65) {
        r = DARK[0]; g = DARK[1]; b = DARK[2];
      }

      pixels[idx] = r; pixels[idx + 1] = g; pixels[idx + 2] = b; pixels[idx + 3] = a;
    }
  }

  // Build scanlines (filter byte 0 = None per row)
  const scanlines = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    scanlines[y * (1 + size * 4)] = 0; // filter type None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * (1 + size * 4) + 1 + x * 4;
      scanlines[dst] = pixels[src];
      scanlines[dst + 1] = pixels[src + 1];
      scanlines[dst + 2] = pixels[src + 2];
      scanlines[dst + 3] = pixels[src + 3];
    }
  }

  const compressed = deflateSync(scanlines, { level: 6 });

  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.from([
    ...u32be(size), ...u32be(size),
    8, 6, 0, 0, 0  // bit depth 8, RGBA, compression 0, filter 0, interlace 0
  ]);

  // IDAT
  const idat = compressed;

  const chunks = Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);

  return chunks;
}

const base = "/Users/jjmacagnan/Development/Jbit/poketrainer-sv/public/icons";

for (const size of [192, 512]) {
  const buf = generatePNG(size);
  const ws = createWriteStream(`${base}/icon-${size}.png`);
  ws.write(buf);
  ws.end();
  console.log(`Generated icon-${size}.png (${buf.length} bytes)`);
}
