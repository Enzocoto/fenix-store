import puppeteer from 'puppeteer';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const input = process.argv[2] || 'promo.html';
const parts = input.split('#');
const htmlFile = parts[0];
const hashUrl = parts.length > 1 ? '#' + parts.slice(1).join('#') : '';
const outFile = process.argv[3] || 'out/fenix-promo-vertical.mp4';
const FPS = Number(process.env.FPS || 30);
const W = Number(process.env.W || 1080);
const H = Number(process.env.H || 1920);
const WANT_WEBM = process.env.WEBM === '1';

const framesDir = path.join(__dirname, '.frames');
if (existsSync(framesDir)) rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });
mkdirSync(path.dirname(path.join(__dirname, outFile)), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(__dirname, htmlFile)).href + hashUrl, { waitUntil: 'load' });
await page.evaluate(() => document.fonts && document.fonts.ready);

const duration = await page.evaluate(() => window.DURATION || 25000);
const total = Math.round((duration / 1000) * FPS);
console.log(`Rendering ${total} frames @ ${FPS}fps (${W}x${H}) ...`);

const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const t = (i / FPS) * 1000;
  await page.evaluate((tt) => window.renderAt(tt), t);
  const buf = await page.screenshot({ type: 'jpeg', quality: 86 });
  const name = String(i).padStart(5, '0') + '.jpg';
  await (await import('node:fs/promises')).writeFile(path.join(framesDir, name), buf);
  if (i % 60 === 0 || i === total - 1) {
    const pct = (((i + 1) / total) * 100).toFixed(0);
    console.log(`  frame ${i + 1}/${total} (${pct}%)`);
  }
}
await browser.close();
const capSec = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`Captured in ${capSec}s. Encoding with ffmpeg ...`);

function ffmpeg(args, out) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args);
    p.stderr.on('data', (d) => process.stderr.write(d));
    p.on('close', (code) => (code === 0 ? resolve(out) : reject(new Error('ffmpeg exit ' + code))));
  });
}

const outAbs = path.join(__dirname, outFile);
await ffmpeg([
  '-y', '-framerate', String(FPS), '-i', path.join(framesDir, '%05d.jpg'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium',
  '-movflags', '+faststart', outAbs,
], outAbs);
console.log('Wrote', outAbs);

if (WANT_WEBM) {
  const webm = outAbs.replace(/\.mp4$/, '.webm');
  await ffmpeg([
    '-y', '-framerate', String(FPS), '-i', path.join(framesDir, '%05d.jpg'),
    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-pix_fmt', 'yuv420p', webm,
  ], webm).catch((e) => console.warn('webm skipped:', e.message));
  console.log('Wrote', webm);
}

rmSync(framesDir, { recursive: true, force: true });
console.log('Done.');
