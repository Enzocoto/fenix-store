import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(__dirname, 'promo.html')).href;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

const cases = [
  ['full', '', 1080, 1920, [1000, 5000, 10000, 14000, 18500, 23000]],
  ['full-square', '#square', 1080, 1080, [1000, 5000, 10000, 14000, 18500, 23000]],
  ['full-wide', '#wide', 1920, 1080, [1000, 5000, 10000, 14000, 18500, 23000]],
  ['short', '#short', 1080, 1920, [1000, 4000, 7000]],
  ['short-square', '#short#square', 1080, 1080, [1000, 4000, 7000]],
  ['short-wide', '#short#wide', 1920, 1080, [1000, 4000, 7000]],
];

for (const [name, hash, w, h, times] of cases) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewport({ width: w, height: h });
  await page.goto(url + hash, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const dur = await page.evaluate(() => window.DURATION);
  let overflow = 0;
  const offenders = new Set();
  for (const t of times) {
    await page.evaluate((tt) => window.renderAt(tt), t);
    const found = await page.evaluate(() => {
      const res = [];
      document.querySelectorAll('#stage .scene').forEach((s) => {
        if (+getComputedStyle(s).opacity < 0.5) return;
        s.querySelectorAll('*').forEach((e) => {
          const r = e.getBoundingClientRect();
          if (r.top < -1 || r.bottom > innerHeight + 1 || r.left < -1 || r.right > innerWidth + 1) {
            res.push(`${s.id}:${e.tagName}.${typeof e.className === 'string' ? e.className : ''}`);
          }
        });
      });
      return res;
    });
    overflow += found.length;
    found.forEach((f) => offenders.add(f));
  }
  console.log(`${name}: dur=${dur}ms errors=${errors.length ? errors.join('|') : 0} overflow=${overflow}`);
  if (offenders.size) console.log('   offenders: ' + [...offenders].slice(0, 8).join(', '));
  await page.close();
}
await browser.close();
