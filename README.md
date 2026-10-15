# Fenix — proyecto completo (frontal + backend)

Marca **genérica y reutilizable**: cambiando nombre, colores y fotos sirve para
cualquier nicho. Aquí está **todo**: la tienda pública, el backend con pagos y el
  portal personal multi-tienda con finanzas y analítica. No depende de nada fuera de esta carpeta.

> Honestidad primero: el proyecto **está construido y listo para conectar**, pero
> **no hay ninguna cuenta creada** (dominio, hosting, Stripe, proveedor), así que
> **todavía no cobra ni envía datos**. Los pasos para conectarlo están en
> `plan-pagos-y-fondos.pdf`.

## Estructura

```
fenix/
  app/                       Tienda pública (Vite + React + TypeScript).
    src/config/site.ts       Configuración GENÉRICA: nombre, colores, apiBaseUrl.
    src/lib/api.ts           Cliente de la API (productos, track, checkout, admin).
    src/lib/analytics.ts     Captura de UTM/referrer y envío de visitas.
    src/pages/OwnerPortalPage.tsx  Portal personal (/#/portal): portfolio y métricas.
    brand/                   Kit de marca (logo.svg, palette.json, README).
    docs/                    Plan de negocio, pack Notion, guion de video y el PDF.
    public/media/            Fotos del producto y los videos promo.
  server/                    Backend multi-tienda (Node + Express + PostgreSQL). Ver server/README.md.
    src/routes/              products, analytics, checkout, webhooks, admin.
    src/services/            finance (márgenes), stripe, supplier (adaptadores).
    src/db/                  pool (pg o pg-mem), schema.sql, init.
  video/                     Pipeline de video y utilidades (puppeteer + ffmpeg-static).
  docs/deploy-render.md      Guía paso a paso para desplegar web, API y PostgreSQL.
  render.yaml                Blueprint de Render para los tres servicios.
  deliverables/              Paquete exportable (listo para importar a Notion).
  archives/                  Paquetes .tar.gz generados.
  plan-pagos-y-fondos.pdf    Qué falta, fondos y cómo conectar todo.
```

## La tienda (app/)

```
npm install
npm run dev      # http://localhost:5173
    npm run check    # lint + typecheck + 17 tests + build
```

Sin `VITE_API_URL`, la tienda es un **escaparate estático** (sin analítica ni cobro).
Al construirla con esa variable apuntando al backend, envía las visitas y cobra.

## El backend (server/)

```
npm install
npm run dev      # http://localhost:3000  (GET /api/health)
  npm run check    # typecheck + 10 tests
```

Sin `DATABASE_URL` usa Postgres en memoria (pg-mem) para probar. Detalles y
despliegue en Render en `server/README.md`.

## Portal personal

Ruta independiente `/#/portal`: es tu centro de control, no la página de venta.
Tiene pestañas de **Vista general, Tiendas, Productos, Finanzas y Tráfico y
campañas**. Antes de conectar el backend puedes pulsar **Explorar portal demo**
para revisar la estructura con varias tiendas y productos de ejemplo claramente
marcados. Con el servidor conectado, el login usa `ADMIN_EMAIL`/`ADMIN_PASSWORD`
y agrega los datos de todas tus tiendas, con filtro por tienda y desglose por
producto.

## Despliegue

La guía está en `docs/deploy-render.md`. El archivo `render.yaml` prepara:

- `fenix-web`: web pública estática.
- `fenix-api`: backend privado.
- `fenix-db`: PostgreSQL.

Para acceder ahora en local: ejecuta `npm run dev` dentro de `app/` y abre
`http://localhost:5173/` para la tienda o `http://localhost:5173/#/portal` para
tu portal personal.

## Reciclarlo para otro nicho

Cambia en `app/src/config/site.ts` el nombre, tagline, color de `theme` y
`apiBaseUrl`; sustituye fotos en `app/public/media/` y ajusta `app/src/data/product.ts`.
El backend y el panel no se tocan.

## Video (video/)

```
npm install            # instala puppeteer y ffmpeg-static (aprobar scripts en este entorno)
node render.mjs        # renderiza los videos promo en out/
node check-store.mjs   # verifica la tienda (requiere app/ en dev)
node qa-portal.mjs     # verifica el portal: pestañas, filtro, carrito y checkout (requiere app/ en dev)
node mkpdf.mjs         # regenera app/docs/plan-pagos-y-fondos.pdf
```

## Antes de lanzar

- Crear cuentas: dominio, hosting (Render) y Stripe; pegar claves en `.env`.
- Elegir proveedor y confirmar stock, costo y plazos; sustituir fotos por propias.
- Quitar la etiqueta `PROVISIONAL` cuando los datos estén confirmados.
