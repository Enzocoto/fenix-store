import puppeteer from 'puppeteer';
const URL = 'https://enzocoto.github.io/fenix-store/';
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
const errors = [], bad = [];
p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
p.on('pageerror', e => errors.push('pageerror: ' + e.message));
p.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
await p.goto(URL, { waitUntil: 'networkidle0', timeout: 45000 });
await new Promise(r => setTimeout(r, 1200));
const rep = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')];
  return {
    title: document.title,
    h1: document.querySelector('h1')?.textContent.trim(),
    imgs: imgs.length,
    broken: imgs.filter(i => i.complete && i.naturalWidth === 0).length,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    chips: [...document.querySelectorAll('.hero__chips li')].length,
    cmpRows: document.querySelectorAll('.cmp tbody tr').length,
    useCards: document.querySelectorAll('.cards-4 .card').length,
    reviews: !!document.querySelector('.reviews'),
    cta: !!document.querySelector('.cta-band'),
  };
});
console.log('PUBLIC', JSON.stringify(rep, null, 2));
console.log('consoleErr', errors.length, 'http4xx5xx', bad.length);
errors.slice(0,5).forEach(e => console.log(' ERR', e.slice(0,140)));
bad.slice(0,5).forEach(e => console.log(' HTTP', e));
await p.screenshot({ path: '/tmp/opencode/shots/public-home.png', fullPage: true });
await b.close();
process.exit(rep.broken === 0 && !rep.overflow && errors.length === 0 && bad.length === 0 ? 0 : 1);
