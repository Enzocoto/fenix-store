import puppeteer from 'puppeteer';
const BASE = 'https://enzocoto.github.io/fenix-store/';
const vps = { mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, desktop: { width: 1440, height: 900 } };
const routes = { home: '#/', product: '#/product', cart: '#/cart', checkout: '#/checkout', portal: '#/portal' };
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
let problems = 0;
for (const [vn, vp] of Object.entries(vps)) {
  for (const [rn, r] of Object.entries(routes)) {
    const p = await b.newPage();
    await p.setViewport(vp);
    const errs = [], bad = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    p.on('response', x => { if (x.status() >= 400) bad.push(`${x.status()} ${x.url()}`); });
    await p.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise(x => setTimeout(x, 800));
    const rep = await p.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')];
      return { imgs: imgs.length, broken: imgs.filter(i => i.complete && i.naturalWidth === 0).length, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    const isBad = rep.broken || rep.overflow || errs.length || bad.length;
    if (isBad) problems++;
    console.log(`[${vn}/${rn}] imgs=${rep.imgs} broken=${rep.broken} overflow=${rep.overflow} err=${errs.length} http=${bad.length}`);
    errs.slice(0,3).forEach(e => console.log('  ERR', e.slice(0,140)));
    bad.slice(0,3).forEach(x => console.log('  HTTP', x));
    await p.close();
  }
}
await b.close();
console.log(problems === 0 ? '\nOK: sin problemas' : `\nPROBLEMS: ${problems}`);
process.exit(problems ? 1 : 0);
