# Fenix — Guion del video

## Qué es

Motion graphics generados desde una sola fuente (`promo.html`). Todas las variantes son **30 fps, h264**. Son animaciones (no hay footage real del producto todavía) pensadas para sustituirse cuando llegue la muestra.

| Archivo | Formato | Duración | Uso |
| --- | --- | --- | --- |
| `fenix-promo-vertical.mp4` | 1080x1920 (9:16) | 25 s | TikTok / Reels / Shorts |
| `fenix-promo-square.mp4` | 1080x1080 (1:1) | 25 s | Feed (Instagram/Facebook) |
| `fenix-promo-hook-vertical.mp4` | 1080x1920 (9:16) | 9 s | Test de hook (Hook → Revelación → CTA) |
| `fenix-promo-hook-square.mp4` | 1080x1080 (1:1) | 9 s | Test de hook en feed |
| `fenix-promo-wide.mp4` | 1920x1080 (16:9) | 25 s | Product page / YouTube / web |
| `fenix-promo-hook-wide.mp4` | 1920x1080 (16:9) | 9 s | Test de hook en web |

- Fuente editable: `promo.html` (modo por hash: `#short` y `#square`).
- Render: `render.mjs` (puppeteer + ffmpeg).
- Los `.mp4` también están en `app/public/media/`.

## Guion escena por escena (corte de 25 s)

| Tiempo | Escena | En pantalla | Qué comunica |
| --- | --- | --- | --- |
| 0–3 s | Hook | "MUD. HAIR. DROOL." + huellas que cruzan | El problema, en el primer segundo |
| 3–8 s | Revelación | Coche + funda hamaca + perro; "The dog hammock cover" | Qué es el producto |
| 8–13 s | Beneficio | Gotas que caen y resbalan; "Repels mud, water and drool" | Impermeable |
| 13–17 s | Beneficio | Base antideslizante; "Stays put on leather and cloth" | No se mueve |
| 17–21 s | Confianza | 3 tarjetas: envío directo, devoluciones, soporte email | Reduce el riesgo de compra |
| 21–25 s | CTA | Logo + "Fenix" + "Shop now" + dominio | A dónde ir |

El corte de 9 s (`#short`) usa: Hook (0–2.9 s) → Revelación (2.9–5.7 s) → CTA (5.7–9 s).

## Voz en off (opcional, inglés)

- (0 s) "Your dog had a great time. Your back seat didn't."
- (4 s) "Meet the Fenix hammock cover."
- (9 s) "Waterproof. Wipe it clean in seconds."
- (14 s) "Anti-slip, so it stays exactly where you put it."
- (18 s) "Ships direct, easy returns, real support."
- (22 s) "A cleaner back seat. A calmer dog. Shop at Fenix."

## Versión en español (opcional)

- "Tu perro se lo pasó genial. Tu asiento, no."
- "Esta es la funda hamaca Fenix."
- "Impermeable. Se limpia en segundos."
- "Antideslizante: se queda donde la dejas."
- "Envío directo, devoluciones fáciles, soporte real."
- "Un asiento más limpio. Un perro más tranquilo."

## Formato horizontal 16:9

Disponible con el modo `#wide` de `promo.html` (render a `1920x1080`). La versión 16:9 de 25 s está embebida en la página de producto mediante `app/src/components/ProductVideo.tsx`.

## Notas de producción

- Sustituir el motion graphic por video real del producto cuando llegue la muestra.
- Añadir música en tendencia (TikTok/Pinterest) y subtítulos siempre.
- Mostrar la marca y el dominio en el CTA.
- Un solo mensaje por video.

## Banco de hooks (probar y medir cuál gana)

- "POV: tu perro volvió del parque."
- "Tu perro no es el problema. Tu asiento sí."
- "Esto es lo que pasa cuando no usas funda."
- "El truco que usan los dueños de perros que viajan."
- "Deja de limpiar el pelo del asiento, para siempre."
- "¿De verdad es impermeable? Míralo."
