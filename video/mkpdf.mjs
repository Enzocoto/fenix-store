import puppeteer from 'puppeteer';

const src = 'file:///home/cotoenzo7899/proyectos/fenix/app/docs/plan-pagos-y-fondos.html';
const out = '/home/cotoenzo7899/proyectos/fenix/app/docs/plan-pagos-y-fondos.pdf';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(src, { waitUntil: 'networkidle0', timeout: 60000 });
await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
await browser.close();
console.log('PDF:', out);
