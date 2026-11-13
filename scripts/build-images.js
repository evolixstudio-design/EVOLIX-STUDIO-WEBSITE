const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

// Keep the original src for full-size portfolio/lightbox images. Browsers use
// srcset to download only the resolution needed by each card and screen.
function createImageOptimizer(root) {
  const cache = new Map();
  const output = path.join(root, 'assets', 'responsive');
  fs.mkdirSync(output, { recursive: true });
  async function variants(src) {
    if (!cache.has(src)) cache.set(src, (async () => {
      const sourcePath = path.resolve(root, '.' + src);
      if (!sourcePath.startsWith(root + path.sep) || !fs.existsSync(sourcePath)) return null;
      const buffer = fs.readFileSync(sourcePath);
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || metadata.pages > 1) return null;
      const hash = crypto.createHash('sha256').update(buffer).update('responsive-v1-q76').digest('hex').slice(0, 12);
      const stem = path.basename(src, path.extname(src)).replace(/[^a-zA-Z0-9_-]/g, '-');
      const widths = [...new Set([160, 320, 640, 960, 1280, Math.min(metadata.width, 1600)].filter(w => w <= metadata.width))].sort((a, b) => a - b);
      const sources = [];
      for (const width of widths) {
        const filename = `${stem}-${hash}-${width}.webp`;
        const target = path.join(output, filename);
        if (!fs.existsSync(target)) await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 76, effort: 4 }).toFile(target);
        sources.push(`/assets/responsive/${filename} ${width}w`);
      }
      return { srcset: sources.join(', '), width: metadata.width, height: metadata.height };
    })());
    return cache.get(src);
  }
  return async function optimizeImages(html) {
    const matches = [...html.matchAll(/<img\b[^>]*>/gi)];
    for (const match of matches) {
      const tag = match[0];
      // This image is replaced by the interactive services controller.
      if (/\bid="posterImage"/.test(tag)) continue;
      const src = tag.match(/\bsrc=["'](\/assets\/[^"'?]+\.(?:png|jpe?g|webp))["']/i)?.[1];
      if (!src || /\bsrcset=/.test(tag)) continue;
      const image = await variants(src);
      if (!image) continue;
      const width = Number(tag.match(/\bwidth=["'](\d+)/)?.[1]);
      const sizes = /wheel-thumb/.test(tag) ? '64px' : width && width <= 64 ? `${width}px` : width === 280 ? '(max-width: 767px) 160px, 280px' : '(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 50vw, 800px';
      let extra = ` srcset="${image.srcset}" sizes="${sizes}" decoding="async"`;
      if (!/\bwidth=/.test(tag)) extra += ` width="${image.width}"`;
      if (!/\bheight=/.test(tag)) extra += ` height="${image.height}"`;
      html = html.replace(tag, tag.replace(/\s*\/?>$/, extra + ' />'));
    }
    return html;
  };
}

async function createIcons(root) {
  const source = path.join(root, 'assets', 'evolix-logo.webp');
  for (const [name, width] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
    await sharp(source).resize(width, width).png({ compressionLevel: 9 }).toFile(path.join(root, 'assets', name));
  }
  const png = await sharp(source).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); // ICO image type.
  header.writeUInt16LE(1, 4); // One embedded PNG image.
  header[6] = 32;
  header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(root, 'favicon.ico'), Buffer.concat([header, png]));
}

module.exports = { createImageOptimizer, createIcons };
