# Fenix — Entregables

Paquete completo de la tienda Fenix: datos para Notion, plan de venta, productos adicionales y video de producto.

## Contenido

```
deliverables/
  README.md                     este índice
  notion-import/                pack importable a Notion (Markdown + CSV)
    01-overview.md
    02-business-plan.md
    03-product-supplier.md
    04-unit-economics.md
    05-marketing-plan.md
    06-content-calendar.md
    07-launch-checklist.md
    08-other-products.md
    tables/
      product-database.csv
      unit-economics.csv
      content-calendar.csv
      kpi-tracker.csv
      supplier-comparison.csv
  video/
    fenix-promo-vertical.mp4           principal 9:16, 25 s
    fenix-promo-square.mp4             1:1, 25 s (feed)
    fenix-promo-hook-vertical.mp4      corte corto 9:16, 9 s (test de hook)
    fenix-promo-hook-square.mp4        corte corto 1:1, 9 s
    fenix-promo-wide.mp4               16:9, 25 s (web / PDP / YouTube)
    fenix-promo-hook-wide.mp4          16:9, 9 s
    fenix-promo-*-poster.jpg           pósteres de video
    promo.html                         animación fuente (editable; #short, #square, #wide)
    render.mjs                         script de render (puppeteer + ffmpeg)
    video-script.md                    guion, voz en off y hooks
```

Los mismos `.mp4` están copiados en `app/public/media/` para servirlos desde la tienda. La versión 16:9 de 25 s está **embebida en la página de producto** (`ProductVideo`).

La tienda vive en `app/` (Vite + React + TS, bilingüe EN/ES). El portal personal vive en `app/src/pages/OwnerPortalPage.tsx`.

## Cómo importar a Notion

1. Notion → **Settings → Import → Markdown & CSV**.
2. Selecciona el contenido de `notion-import/` (los `.md` se convierten en páginas).
3. Importa los `.csv` por separado; cada uno crea una base de datos:
   - `product-database.csv` → catálogo de productos.
   - `unit-economics.csv` → escenarios de margen.
   - `content-calendar.csv` → calendario con métricas.
   - `kpi-tracker.csv` → seguimiento semanal de 12 semanas.
   - `supplier-comparison.csv` → comparación de proveedores.

> No se pudo escribir directamente en Notion (no hay acceso ni token configurado). Este pack está pensado para importarse en minutos.

## Regenerar el video

```bash
cd /home/cotoenzo7899/proyectos/fenix/video
node render.mjs promo.html out/fenix-promo-vertical.mp4              # 9:16, 25 s
W=1080 H=1080 node render.mjs promo.html#square out/fenix-promo-square.mp4   # 1:1, 25 s
node render.mjs promo.html#short out/fenix-promo-hook-vertical.mp4  # 9:16, 9 s
W=1080 H=1080 node render.mjs promo.html#short#square out/fenix-promo-hook-square.mp4  # 1:1, 9 s
W=1920 H=1080 node render.mjs promo.html#wide out/fenix-promo-wide.mp4   # 16:9, 25 s
```

Requiere `puppeteer` y `ffmpeg-static` (ya instalados en ese proyecto).

## Aviso

Todos los datos comerciales (precio, materiales, medidas, envíos, devoluciones) siguen marcados como **PROVISIONAL** hasta confirmarlos con un proveedor.
