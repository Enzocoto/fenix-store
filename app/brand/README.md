# Fenix — Brand kit

Pliego de marca que alimenta el rediseño de la tienda. Los tokens viven en
`src/styles/global.css` (`:root`) y este documento es la referencia de diseño.

## Objetivo de marca
Fenix se posiciona como una marca **DTC premium y honesta** de accesorios de
coche para perros. El foco del producto es la funda/cubre-asiento tipo hammock:
protege el asiento trasero y da un viaje estable y cómodo al perro.

## Paleta
| Rol | Token | Hex | Uso |
| --- | --- | --- | --- |
| Texto principal | `--ink` | `#0c1a19` | Titulares y cuerpo |
| Texto secundario | `--ink-soft` | `#3a4d4b` | Párrafos de apoyo |
| Texto apagado | `--muted` | `#6b7d7b` | Notas, pies |
| Líneas | `--line` | `#e2e2da` | Bordes y separadores |
| Superficie | `--surface` | `#ffffff` | Tarjetas y fondos claros |
| Fondo alterno | `--surface-alt` | `#f7f5ef` | Fondo crema cálido |
| Marca | `--brand` | `#0f3d3e` | Cabecera, hero, enlaces |
| Marca fuerte | `--brand-strong` | `#08292a` | Barra de anuncios, fondos |
| Marca suave | `--brand-soft` | `#e2eeee` | Chips y botones suaves |
| Acento | `--accent` | `#f2a541` | CTA principal, pasos |
| Acento fuerte | `--accent-strong` | `#c97f1f` | Focus, hovers |

La paleta es verde-petróleo profundo + crema cálido + ámbar de acento: transmite
cuidado y confianza sin parecer una plantilla genérica.

## Tipografía
- **Display (titulares):** Sora 600/700/800. Geométrica, moderna, con carácter.
- **Cuerpo:** Inter 400–700. Muy legible en móvil.
- Cargadas desde Google Fonts en `index.html` (`preconnect` + `display=swap`).
- Fallback del sistema si la fuente no carga.

## Logo
- `brand/logo.svg` es el archivo maestro de marca; el favicon
  (`public/favicon.svg`) reutiliza el mismo dibujo.
- La cabecera (`Header.tsx`) **no** carga este archivo: usa un SVG inline
  equivalente en el componente `LogoMark` para evitar una petición extra.
- Uso: sobre fondos claros u oscuros; mantener área de respeto = 25% del tamaño.

## Fotografía de producto
- Las fotos en `public/media/product/` son **fotos reales de proveedor** usadas
  para previsualizar el diseño. En la UI se marcan como `PROVISIONAL`.
- **Antes de lanzar:** sustituir por fotos propias o con licencia, y confirmar
  derechos de uso. Ver `docs/notion-import/03-product-supplier.md`.
- Formato: `.webp` (preferente) + `.jpg` (fallback), ancho 1600 px, servido por
  el componente `Photo.tsx` mediante `<picture>`.

## Voz y tono
- Claro, directo, sin exagerar. Español e inglés.
- Prohibido inventar reseñas, descuentos, urgencia, plazos o certificaciones.
- Diferencial honesto: "envío directo del proveedor, sin almacén intermedio"
  (marcado `PROVISIONAL`).
