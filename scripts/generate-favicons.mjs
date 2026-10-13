import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.join(__dirname, '../src/logo.webp');
const publicDir = path.join(__dirname, '../public');

async function run() {
  const size = 512;
  const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white" /></svg>`;
  const roundedCorners = Buffer.from(circleSvg);
  
  // Create a base circular image buffer
  const baseBuffer = await sharp(input)
    .resize(size, size)
    .composite([{
      input: roundedCorners,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // generate favicons
  await sharp(baseBuffer).resize(32, 32).toFile(path.join(publicDir, 'favicon.png'));
  await sharp(baseBuffer).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(baseBuffer).resize(192, 192).toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(baseBuffer).resize(512, 512).toFile(path.join(publicDir, 'icon-512.png'));
  
  console.log('Favicons generated successfully.');
}

run().catch(console.error);
