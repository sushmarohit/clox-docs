import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PACK = path.join(root, 'public', 'all_clox_logos');
const BRAND = path.join(root, 'public', 'brand');

const NAVY = { r: 10, g: 31, b: 60 }; // #0A1F3C

function isNearBlack(r, g, b, a) {
  return a > 0 && r < 40 && g < 40 && b < 40;
}

function isNearWhite(r, g, b, a) {
  return a > 20 && r > 200 && g > 200 && b > 200;
}

function isOrangeish(r, g, b, a) {
  return a > 20 && r > 180 && g > 40 && g < 160 && b < 100 && r > g + 40;
}

async function toTransparentRgba(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isNearBlack(r, g, b, a)) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();
}

async function recolorWhiteToNavy(pngBuffer) {
  const { data, info } = await sharp(pngBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 10) continue;
    if (isOrangeish(r, g, b, a)) continue;
    if (isNearWhite(r, g, b, a)) {
      data[i] = NAVY.r;
      data[i + 1] = NAVY.g;
      data[i + 2] = NAVY.b;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function writeWebp(buf, outPath, width) {
  let pipeline = sharp(buf);
  if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
  const info = await pipeline.webp({ quality: 90, alphaQuality: 100 }).toFile(outPath);
  console.log('wrote', path.relative(root, outPath), info.width, info.height, info.size);
}

const fullLightPng = await toTransparentRgba(path.join(PACK, 'PNG-01.png'));
const fullDarkPng = await recolorWhiteToNavy(fullLightPng);

await writeWebp(fullLightPng, path.join(BRAND, 'logo-clox-light.webp'), 1400);
await writeWebp(fullDarkPng, path.join(BRAND, 'logo-clox.webp'), 1400);
await writeWebp(fullDarkPng, path.join(BRAND, 'logo-legacy.webp'), 1400);

const markLightPng = await toTransparentRgba(path.join(PACK, '2 PNG-01.png'));
const markDarkPng = await recolorWhiteToNavy(markLightPng);

await writeWebp(markLightPng, path.join(BRAND, 'logo-mark-light.webp'), 512);
await writeWebp(markDarkPng, path.join(BRAND, 'logo-mark.webp'), 512);

await sharp(fullDarkPng).resize({ width: 800 }).png().toFile(path.join(PACK, '_preview-full-dark.png'));
await sharp(fullLightPng).resize({ width: 800 }).png().toFile(path.join(PACK, '_preview-full-light.png'));
await sharp(markDarkPng).resize({ width: 400 }).png().toFile(path.join(PACK, '_preview-mark-dark.png'));
await sharp(markLightPng).resize({ width: 400 }).png().toFile(path.join(PACK, '_preview-mark-light.png'));

console.log('done');
