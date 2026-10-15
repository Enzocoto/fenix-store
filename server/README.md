# Fenix server (backend)

API en **Node + Express + PostgreSQL** para la tienda. Incluye checkout (Stripe o
demo), analítica de visitas con origen/UTM, webhook de Stripe y endpoints privados
de administración (finanzas, pedidos y tráfico). Incluye un endpoint de **portfolio
multi-tienda** para el portal personal: agrega todas las tiendas y desglosa cada
producto. Es **genérico**: los datos vienen de la base de datos, no del nombre de
un producto.

> Nada está conectado todavía: sin claves de Stripe cobra en modo **demo** y sin
> `DATABASE_URL` usa Postgres **en memoria** (pg-mem) para poder probar en local.

## Arranque local

```
cp .env.example .env     # rellena tus valores (NUNCA subas .env a Git)
npm install
npm run dev              # http://localhost:3000  (GET /api/health)
npm run check            # typecheck + tests (10)
```

Con `DATABASE_URL` vacío arranca con pg-mem y siembra el producto de ejemplo y el
usuario admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Con `DATABASE_URL` apunta a tu
Postgres real.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio. |
| GET | `/api/config` | Configuración pública (moneda, si el pago está activo). |
| GET | `/api/products` | Catálogo. |
| POST | `/api/track` | Registra una visita (path, referrer, UTM, sesión). |
| POST | `/api/checkout` | Crea el pedido. Stripe si hay clave; si no, modo `demo`. |
| POST | `/api/webhooks/stripe` | Confirma el pago del pedido. |
| POST | `/api/admin/login` | Devuelve un token JWT (solo el creador). |
| GET | `/api/admin/summary` | Resumen: finanzas, visitas, pedidos. |
| GET | `/api/admin/orders` | Pedidos con su origen. |
| GET | `/api/admin/analytics` | Visitas y ventas por fuente/campaña/medio. |
| GET | `/api/admin/finance` | Ingresos, COGS, comisiones, beneficio neto, margen. |
| GET | `/api/admin/portfolio` | Portfolio agregado por tienda y producto. |

Los endpoints `/api/admin/*` requieren cabecera `Authorization: Bearer <token>`.

## Desplegar en Render (recomendado)

1. Crea una base **PostgreSQL** en Render y copia su **Internal Database URL**.
2. Crea un **Web Service** apuntando a este repositorio.
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. En **Environment**, añade las variables de `.env.example`: `DATABASE_URL`,
   `PUBLIC_BASE_URL`, `JWT_SECRET` (largo y aleatorio), `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, y las de Stripe cuando quieras cobrar.
4. En Stripe, crea el webhook hacia `https://TU-API.onrender.com/api/webhooks/stripe`
   y pega el valor en `STRIPE_WEBHOOK_SECRET`.

Después, al construir el frontend, define `VITE_API_URL` con la URL del backend
para que la web envíe analítica y cobre de verdad.

## Seguridad

- Nunca subas `.env` ni claves al repositorio.
- Cambia `JWT_SECRET` y `ADMIN_PASSWORD` antes de desplegar.
- El portal `/#/portal` no está enlazado al público, pero se protege en el servidor
  con el token: sin él, la API no devuelve datos.
