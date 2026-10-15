# Despliegue de Fenix en Render

El proyecto incluye `render.yaml` para crear la web pública, la API y PostgreSQL.
La primera puesta en marcha requiere crear las cuentas y añadir secretos propios.

## 1. Subir el proyecto

1. Crea un repositorio privado en GitHub.
2. Sube el contenido de esta carpeta, excluyendo `node_modules/`, `dist/` y `.env`.
3. No publiques las claves de Stripe, proveedor, JWT ni la contraseña del admin.

## 2. Crear los servicios

1. En Render, elige **New > Blueprint**.
2. Conecta el repositorio y selecciona `render.yaml`.
3. Revisa los tres recursos que propone: `fenix-web`, `fenix-api` y `fenix-db`.
4. Elige el plan que corresponda. El plan gratuito puede cambiar o no estar
   disponible según la región y las condiciones actuales de Render.

## 3. Completar secretos

En el servicio `fenix-api`, completa:

- `ADMIN_EMAIL`: tu correo privado.
- `ADMIN_PASSWORD`: una contraseña larga y única.
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` y `STRIPE_WEBHOOK_SECRET` cuando
  quieras cobrar de verdad.
- `SUPPLIER_PROVIDER` y `SUPPLIER_API_KEY` solo después de elegir y verificar un
  proveedor.

Render genera `JWT_SECRET`, conecta `DATABASE_URL` y pasa la URL de la API al
frontend mediante `VITE_API_URL`.

## 4. Comprobar el acceso

- Web pública: `https://fenix-web.onrender.com/`
- Portal personal: `https://fenix-web.onrender.com/#/portal`
- Salud de API: `https://fenix-api.onrender.com/api/health`

Los nombres exactos pueden variar si Render añade un sufijo por disponibilidad.
Usa las URLs que Render muestre en cada servicio.

## 5. Activar Stripe

1. Crea una cuenta Stripe a tu nombre y completa la verificación requerida.
2. Copia las claves al servicio `fenix-api`.
3. Crea un webhook para:
   `https://TU-API.onrender.com/api/webhooks/stripe`
4. Suscribe el evento de pago que usa tu integración y copia el signing secret en
   `STRIPE_WEBHOOK_SECRET`.
5. Redeploya la API y prueba primero en modo test de Stripe.

Sin las claves de Stripe, el checkout sigue siendo demo y no cobra. Eso es
intencional.

## 6. Medir campañas

Usa enlaces con UTM, por ejemplo:

```text
https://TU-WEB.onrender.com/?utm_source=tiktok&utm_medium=organic&utm_campaign=lanzamiento
```

Después de conectar `VITE_API_URL`, las visitas aparecen en `/#/portal`, agrupadas
por fuente, medio y campaña. Los pedidos conservan esa atribución.

## Estado antes de lanzar

- Cambiar `fenix.example` por el dominio real.
- Confirmar proveedor, costo, stock, envío y política de devoluciones.
- Sustituir fotos provisionales por fotos propias o con licencia.
- Probar un pago real en modo test y el webhook antes de aceptar dinero.
- Añadir páginas legales y datos de soporte del negocio.
