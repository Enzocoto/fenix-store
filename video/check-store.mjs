import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5173';
const OUT = '/tmp/opencode/shots';
mkdirSync(OUT, { recursive: true });

const viewports = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
};
const routes = { home: '/#/', product: '/#/product', portal: '/#/portal' };

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
let problems = 0;

for (const [vname, vp] of Object.entries(viewports)) {
  for (const [rname, route] of Object.entries(routes)) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));

    const report = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')];
      const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const total = imgs.length;
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const scrollW = document.documentElement.scrollWidth;
      return { broken, total, overflow, scrollW, innerW: window.innerWidth };
    });

    const shot = `${OUT}/${rname}-${vname}.png`;
    await page.screenshot({ path: shot, fullPage: true });
    const bad = report.broken.length > 0 || report.overflow || errors.length > 0;
    if (bad) problems++;
    console.log(`[${vname}/${rname}] imgs=${report.total} broken=${report.broken.length} overflow=${report.overflow} (${report.scrollW}px vs ${report.innerW}px) errors=${errors.length} -> ${shot}`);
    for (const b of report.broken) console.log('   BROKEN:', b);
    for (const e of errors.slice(0, 5)) console.log('   ERR:', e.slice(0, 160));
    await page.close();
  }
}

await browser.close();
console.log(problems === 0 ? 'OK: no problems' : `PROBLEMS: ${problems}`);
process.exit(problems === 0 ? 0 : 1);
