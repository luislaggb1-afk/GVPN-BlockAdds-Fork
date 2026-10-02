const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPng(width, height, drawFn) {
  // Raw RGBA buffer
  const rawData = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // Bit depth
  ihdr.writeUInt8(6, 9); // Color type RGBA
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

// Draw GVPN Icon
function gvpnIconPainter(isMaskable) {
  return function(x, y, w, h) {
    const nx = x / w; // 0..1
    const ny = y / h; // 0..1

    // Background
    let bgR = 11, bgG = 17, bgB = 32, bgA = 255; // #0B1120

    // Center coordinates
    const cx = 0.5;
    const cy = 0.5;
    const dx = nx - cx;
    const dy = ny - cy;

    // Scale for safe zone if maskable
    const scale = isMaskable ? 0.75 : 0.88;
    const sx = dx / scale + 0.5;
    const sy = dy / scale + 0.5;

    // Shield geometry test
    // Top center: (0.5, 0.12), top-left (0.16, 0.22), top-right (0.84, 0.22)
    // bottom point: (0.5, 0.88)
    if (sx >= 0.12 && sx <= 0.88 && sy >= 0.10 && sy <= 0.90) {
      // Check if inside shield outer border
      const topSlopeLeft = 0.10 + (0.5 - sx) * 0.32;
      const topSlopeRight = 0.10 + (sx - 0.5) * 0.32;
      const bottomCurve = 0.90 - Math.pow(Math.abs(sx - 0.5) * 2, 1.8) * 0.45;

      const isInsideOuter = (sx <= 0.5 ? sy >= topSlopeLeft : sy >= topSlopeRight) && sy <= bottomCurve;

      if (isInsideOuter) {
        // Inner core
        const innerScale = 0.78;
        const isx = (sx - 0.5) / innerScale + 0.5;
        const isy = (sy - 0.52) / innerScale + 0.52;

        const inTopLeft = 0.18 + (0.5 - isx) * 0.30;
        const inTopRight = 0.18 + (isx - 0.5) * 0.30;
        const inBottom = 0.84 - Math.pow(Math.abs(isx - 0.5) * 2, 1.8) * 0.40;

        const isInsideInner = isx >= 0.18 && isx <= 0.82 && (isx <= 0.5 ? isy >= inTopLeft : isy >= inTopRight) && isy <= inBottom;

        if (isInsideInner) {
          // Check cross
          const isVertLine = Math.abs(isx - 0.5) < 0.018;
          const isHorizLine = Math.abs(isy - 0.50) < 0.018;

          if (isVertLine || isHorizLine) {
            return [168, 191, 248, 255]; // #a8bff8
          }
          return [13, 24, 68, 255]; // #0d1844
        }

        // Shield border: #000e1f
        return [0, 14, 31, 255];
      }
    }

    if (!isMaskable) {
      // Soft rounded icon background
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > 0.48) return [0, 0, 0, 0]; // Transparent outside circle/squircle
    }

    return [bgR, bgG, bgB, bgA];
  };
}

const pubDir = path.join(__dirname, 'public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), createPng(192, 192, gvpnIconPainter(false)));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), createPng(512, 512, gvpnIconPainter(false)));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), createPng(512, 512, gvpnIconPainter(true)));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPng(180, 180, gvpnIconPainter(false)));

console.log('PWA PNG Icons generated successfully.');
