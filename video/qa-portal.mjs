import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const BASE = 'http://127.0.0.1:5173';
const OUT = '/tmp/opencode/shots';
mkdirSync(OUT, { recursive: true });

const viewports = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
};
const routes = {
  home: '/#/',
  product: '/#/product',
  cart: '/#/cart',
  checkout: '/#/checkout',
  portal: '/#/portal',
};

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
let problems = 0;
const log = (...a) => console.log(...a);

async function inspect(page) {
  return page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    return { total: imgs.length, broken, overflow, scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth };
  });
}

// ---------- 1. Rutas base en móvil y escritorio ----------
for (const [vname, vp] of Object.entries(viewports)) {
  for (const [rname, route] of Object.entries(routes)) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    const errors = [];
    const bad = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 700));
    const rep = await inspect(page);
    await page.screenshot({ path: `${OUT}/${rname}-${vname}.png`, fullPage: true });
    const isBad = rep.broken.length > 0 || rep.overflow || errors.length > 0 || bad.length > 0;
    if (isBad) problems++;
    log(`[${vname}/${rname}] imgs=${rep.total} broken=${rep.broken.length} overflow=${rep.overflow} (${rep.scrollW}/${rep.innerW}) consoleErr=${errors.length} http4xx5xx=${bad.length}`);
    rep.broken.forEach((b) => log('   BROKEN:', b));
    errors.slice(0, 5).forEach((e) => log('   ERR:', e.slice(0, 160)));
    bad.slice(0, 5).forEach((b) => log('   HTTP:', b));
    await page.close();
  }
}

// ---------- 2. Portal demo: recorrer todas las pestañas ----------
{
  const page = await browser.newPage();
  await page.setViewport(viewports.desktop);
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(BASE + '/#/portal', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  const demoBtn = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find((b) => /explorar portal demo/i.test(b.textContent || '')),
  );
  const hasDemo = await demoBtn.evaluate((el) => Boolean(el));
  log(`\n[portal] botón "Explorar portal demo" presente: ${hasDemo}`);
  if (!hasDemo) problems++;
  else {
    await demoBtn.asElement().click();
    await new Promise((r) => setTimeout(r, 500));
  }

  const tabs = ['Vista general', 'Tiendas', 'Productos', 'Finanzas', 'Tráfico y campañas'];
  for (const label of tabs) {
    const clicked = await page.evaluate((lbl) => {
      const btn = [...document.querySelectorAll('.portal-nav__item')].find((b) => (b.textContent || '').trim() === lbl);
      if (btn) { btn.click(); return true; }
      return false;
    }, label);
    await new Promise((r) => setTimeout(r, 350));
    const rep = await inspect(page);
    const content = await page.evaluate(() => {
      const main = document.querySelector('.portal-main');
      return main ? main.innerText.replace(/\s+/g, ' ').trim().slice(0, 90) : '';
    });
    const ok = clicked && content.length > 0 && !rep.overflow;
    if (!ok) problems++;
    log(`[portal/${label}] clicked=${clicked} overflow=${rep.overflow} contenido="${content}"`);
    await page.screenshot({ path: `${OUT}/portal-tab-${label.replace(/[^a-z]/gi, '')}.png`, fullPage: true });
  }

  // Filtro por tienda
  const filterOk = await page.evaluate(() => {
    const sel = document.querySelector('#store-filter');
    if (!sel) return false;
    sel.value = 'fenix-home';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  await new Promise((r) => setTimeout(r, 350));
  const filtered = await page.evaluate(() => document.querySelector('.portal-main')?.innerText.includes('Fenix Home'));
  log(`[portal/filtro] aplicado=${filterOk} muestra Fenix Home=${filtered}`);
  if (!filterOk || !filtered) problems++;
  await page.screenshot({ path: `${OUT}/portal-filtro-home.png`, fullPage: true });

  log(`[portal] consoleErr=${errors.length}`);
  errors.slice(0, 5).forEach((e) => log('   ERR:', e.slice(0, 160)));
  await page.close();
}

// ---------- 3. Carrito: añadir y persistir tras recarga ----------
{
  const page = await browser.newPage();
  await page.setViewport(viewports.desktop);
  await page.goto(BASE + '/#/product', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));
  const added = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /carrito|cart/i.test(b.textContent || ''));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.goto(BASE + '/#/cart', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const before = await page.evaluate(() => document.body.innerText);
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate(() => document.body.innerText);
  const persisted = /backseat|hamaca|hammock/i.test(after) && !/carrito está vacío|cart is empty/i.test(after);
  log(`\n[carrito] añadido=${added} persiste tras recarga=${persisted}`);
  if (!added || !persisted) problems++;
  await page.screenshot({ path: `${OUT}/cart-persist.png`, fullPage: true });
  await page.close();
}

// ---------- 4. Checkout demo: rellenar y confirmar ----------
{
  const page = await browser.newPage();
  await page.setViewport(viewports.desktop);
  await page.goto(BASE + '/#/product', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /carrito|cart/i.test(b.textContent || ''));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.goto(BASE + '/#/checkout', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const filled = await page.evaluate(() => {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    };
    return ['name', 'email', 'address', 'city', 'state', 'zip'].every((id) => set(id, id === 'email' ? 'qa@test.com' : id === 'zip' ? '78701' : 'QA'));
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) form.requestSubmit();
  });
  await new Promise((r) => setTimeout(r, 800));
  const text = await page.evaluate(() => document.body.innerText);
  const confirmed = /pedido|order/i.test(text) && /demo/i.test(text);
  log(`[checkout] rellenado=${filled} confirmación demo=${confirmed}`);
  if (!filled || !confirmed) problems++;
  await page.screenshot({ path: `${OUT}/checkout-confirm.png`, fullPage: true });
  await page.close();
}

await browser.close();
log(problems === 0 ? '\nOK: sin problemas' : `\nPROBLEMS: ${problems}`);
process.exit(problems === 0 ? 0 : 1);
