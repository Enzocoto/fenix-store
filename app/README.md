# Fenix — generic single-product storefront

A mobile-first, **generic** storefront for one product (by default a hammock-style
dog back-seat car cover, US market). Rebrand it for any niche by editing
`src/config/site.ts` (name, theme colours, `apiBaseUrl`), the product data and the
photos. Ships alongside a backend (`../server/`) for payments and analytics.

> Runs as a static showcase on its own. Set `VITE_API_URL` to connect the backend:
> then checkout goes through `/api/checkout` (Stripe when configured, demo
> otherwise) and pageviews are tracked. Commercial data not yet confirmed with a
> supplier is labelled **PROVISIONAL** in the UI.

## Configuration

- `src/config/site.ts` — name, domain, support email, currency, locale, `theme`
  (colours applied as CSS variables) and `apiBaseUrl` (from `VITE_API_URL`).
- `src/config/theme.ts` — applies the theme at startup.
- `src/lib/api.ts` — typed client for the backend.
- `src/lib/analytics.ts` — captures UTM/referrer (first-touch) and sends pageviews.
- `src/pages/OwnerPortalPage.tsx` — owner portal at `/#/portal` (alias `/#/admin`),
  separate from the sales storefront and ready for multiple stores/products.

## Stack

- Vite + React 19 + TypeScript
- Bilingual UI (English / Spanish) with a built-in i18n layer, no heavy dependencies
- Hash-based router and a small cart state layer
- Vitest + Testing Library (jsdom) for unit and integration tests
- ESLint (flat config)

## Languages

The store ships in **English (default)** and **Spanish**. A toggle in the header switches language; the choice is saved in `localStorage` and auto-detected from the browser (`es*` -> Spanish). Product copy, buttons, errors and meta titles are all localized from a single catalog in `src/i18n/translations.ts` and `src/data/product.ts`.

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest run
npm run build      # typecheck + production build
npm run check      # lint + typecheck + test + build
npm run preview    # serve the production build
```

## Structure

```
src/
  components/   shared UI (Header, Footer, gallery, price, stepper, FAQ, language switch)
  config/       site.ts (generic brand/theme/api) + theme.ts
  pages/        Home, Product, Cart, Checkout, OwnerPortalPage (owner portal)
  data/         brand.ts (re-exports config/site) and product.ts
  i18n/         translations + provider (en / es)
  hooks/        useCart, useI18n
  state/        CartProvider + context
  lib/          cart logic, money formatting, hash router, localStorage store, lang, api, analytics
  styles/       global.css design system
  test/         test setup
brand/          brand kit (logo, palette, typography, photo usage)
docs/           business plan + Notion-import pack + video script + payments PDF
public/media/   product photos (real supplier, PROVISIONAL) + promo videos
```

## Brand & assets

- See `brand/README.md` for the palette, typography (Sora + Inter) and photo rules.
- Logo: `brand/logo.svg` is the master brand asset; the favicon (`public/favicon.svg`)
  reuses the same drawing. `Header.tsx` renders an equivalent inline SVG (`LogoMark`)
  instead of loading the file.
- Product photos: real supplier images in `public/media/product/`, rendered via
  `Photo.tsx` (`<picture>` with webp + jpg). Marked `PROVISIONAL` in the UI.
- Promo videos: 6 variants in `public/media/` (vertical / square / wide + hooks).

## Conversion elements

- Announcement bar with the direct-ship message
- Hero with a benefit-first headline, real product photo and clear primary CTA
- Sticky add-to-cart bar on mobile product pages
- Trust row (demo checkout, direct ship, returns plan, email support)

## Verification

Run `npm run check`. Current status:

- lint: clean
- typecheck: clean
- tests: 17 passed (cart logic, money formatting, navigation, owner portal, add-to-cart, quantity/subtotal, checkout validation, English/Spanish switch)
- build: succeeds

Responsive layout is defined with mobile-first media queries (`src/styles/global.css`) at 620px, 749px and 960px breakpoints; navigation collapse and multi-column layouts are CSS-driven.

### Honesty guards

- No fabricated reviews, ratings, "best seller" or "verified buyer" claims.
- No fake discounts, countdown timers or stock urgency.
- Every unconfirmed fact carries the `PROVISIONAL` tag.

## PROVISIONAL checklist (replace before launch)

- [ ] Confirm supplier + evidence product exists (photos, specs, sample)
- [ ] Confirm price / cost of goods, target gross margin >= 50% and >= 3x markup
- [ ] Confirm exact dimensions per size
- [ ] Confirm material composition and wash instructions
- [ ] Confirm shipping cost, origin and delivery window
- [ ] Confirm returns window and process
- [ ] Replace all generated illustrations with real product photos
- [ ] Replace demo checkout with a real payment + order flow
- [ ] Real support email, business details, and legal pages (privacy, terms, shipping, returns)

## Business plan (measurable, low budget)

**Idea**: micro-brand dropshipping of a dog back-seat hammock cover for the US market; traffic from organic TikTok + Pinterest (AI-assisted content), no paid ads initially.

**Budget (< USD 100)**

- Shopify Basic promo (USD 1/mo x 3): ~3
- Domain: ~10-15
- Free supplier app (Zendrop Free / CJ): 0
- Product sample: 20-40
- Total: ~55-90

**Unit economics (target)**

- AOV >= USD 35
- COGS + shipping <= 35% of price
- Gross margin >= 50%
- Break-even CAC = gross margin per order

**KPIs (first 90 days)**

- Content output: >= 2 posts/day (TikTok + Pinterest)
- Traffic: sessions/week trending up; track top 3 hooks
- Conversion: add-to-cart rate >= 5%, checkout completion >= 40%
- Unit: return/refund rate < 8%, repeat order rate monitored

**Go / no-go gates**

1. Week 2: 1k+ views on any single video.
2. Week 4: >= 1% landing-page-to-add-to-cart.
3. Week 6: first paid order with margin >= 40%.
4. Week 8: >= 10 orders/week or pivot product.
5. Week 12: profitable with organic traffic, then consider paid retargeting.

## Media

Product promo videos are served from `public/media/` (generated motion graphics, see `../deliverables/video/`):

- `fenix-promo-wide.mp4` — 16:9, 25 s (embedded on the product page via `ProductVideo`)
- `fenix-promo-vertical.mp4` — 9:16, 25 s
- `fenix-promo-square.mp4` — 1:1, 25 s
- `fenix-promo-hook-vertical.mp4` — 9:16, 9 s (hook test)
- `fenix-promo-hook-square.mp4` — 1:1, 9 s (hook test)
- `fenix-promo-hook-wide.mp4` — 16:9, 9 s (hook test)
- `fenix-promo-wide-poster.jpg`, `fenix-promo-vertical-poster.jpg` — video posters

These are placeholders until real product footage is available.

## Known limitations

- Vite SPA: basic technical SEO (semantic HTML, meta tags, heading order) only. For content SEO, migrate to an SSG/SSR setup later.
- Payments and analytics are provided by the backend in `../server/`; they activate only when `VITE_API_URL` is set. Without it, checkout runs in demo mode.
- Fulfillment and taxes remain out of scope (they depend on the supplier and your jurisdiction).
