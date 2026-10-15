import type { Localized } from '../lib/lang';

export const product = {
  slug: 'backseat-hammock-cover',
  name: {
    en: 'Backseat Hammock Cover',
    es: 'Funda Hamaca para el Asiento Trasero',
  } satisfies Localized,
  shortName: {
    en: 'Backseat Hammock Cover',
    es: 'Funda hamaca trasera',
  } satisfies Localized,
  subtitle: {
    en: 'Waterproof dog hammock that protects your back seat and gives your dog a steady, comfortable ride.',
    es: 'Hamaca impermeable que protege tu asiento trasero y le da a tu perro un viaje firme y cómodo.',
  } satisfies Localized,
  summary: {
    en: 'A hammock-style seat cover that hangs between the front and rear headrests, covering the seat, the seat backs and the door panels. Designed for muddy paws, shedding coats and the occasional spilled water bowl.',
    es: 'Una funda tipo hamaca que cuelga entre los reposacabezas delanteros y traseros, cubriendo el asiento, los respaldos y los paneles de las puertas. Pensada para patas con barro, pelo que se suelta y algún bebedero volcado.',
  } satisfies Localized,
  priceCents: 3999,
  compareAtCents: undefined,
  currency: 'USD',
  variants: [
    {
      id: 'std',
      priceCents: 3999,
      label: {
        en: 'Standard (fits most sedans and SUVs)',
        es: 'Estándar (coches y SUV medianos)',
      },
    },
    {
      id: 'xl',
      priceCents: 4499,
      label: {
        en: 'XL (fits full-size SUVs and trucks)',
        es: 'XL (SUV grandes y pickups)',
      },
    },
    {
      id: 'std-mesh',
      priceCents: 4799,
      label: {
        en: 'Standard + door protectors',
        es: 'Estándar + protectores de puertas',
      },
    },
  ],
  highlights: [
    {
      en: 'Hammock design keeps your dog off the floor and away from the front seats',
      es: 'El diseño hamaca mantiene a tu perro alejado del suelo y de los asientos delanteros',
    },
    {
      en: 'Waterproof top layer for muddy paws, drool and spilled water',
      es: 'Capa superior impermeable para patas con barro, baba y agua derramada',
    },
    {
      en: 'Anti-slip backing helps the cover stay put on leather and cloth seats',
      es: 'Base antideslizante para que la funda no se mueva en asientos de piel o tela',
    },
    {
      en: 'Quick to clip on and remove using the headrest straps',
      es: 'Se engancha y se quita en segundos con las correas de los reposacabezas',
    },
    {
      en: 'Machine washable [PROVISIONAL]',
      es: 'Se puede lavar a máquina [PROVISIONAL]',
    },
  ],
  specs: [
    { label: { en: 'Style', es: 'Estilo' }, value: { en: 'Hammock with headrest anchors', es: 'Hamaca con anclajes a reposacabezas' } },
    {
      label: { en: 'Material (top)', es: 'Material (superior)' },
      value: { en: 'Waterproof polyester / Oxford weave [PROVISIONAL]', es: 'Poliéster impermeable / tejido Oxford [PROVISIONAL]' },
    },
    {
      label: { en: 'Backing', es: 'Base' },
      value: { en: 'Anti-slip textured base [PROVISIONAL]', es: 'Base texturizada antideslizante [PROVISIONAL]' },
    },
    {
      label: { en: 'Standard size', es: 'Talla estándar' },
      value: { en: 'Approx. 54 in wide x 58 in long [PROVISIONAL]', es: 'Aprox. 137 cm de ancho x 147 cm de largo [PROVISIONAL]' },
    },
    {
      label: { en: 'XL size', es: 'Talla XL' },
      value: { en: 'Approx. 63 in wide x 62 in long [PROVISIONAL]', es: 'Aprox. 160 cm de ancho x 157 cm de largo [PROVISIONAL]' },
    },
    {
      label: { en: 'Cleaning', es: 'Limpieza' },
      value: { en: 'Machine wash cold, air dry [PROVISIONAL]', es: 'Lavado a máquina en frío, secado al aire [PROVISIONAL]' },
    },
    {
      label: { en: 'Includes', es: 'Incluye' },
      value: { en: 'Cover, headrest straps, seat anchors, door slits', es: 'Funda, correas para reposacabezas, anclajes y aberturas para puertas' },
    },
  ],
  includes: [
    { en: '1 x hammock seat cover', es: '1 funda hamaca para asiento' },
    { en: '2 x adjustable headrest straps', es: '2 correas ajustables para reposacabezas' },
    { en: 'Seat-anchor loops', es: 'Anclajes para el asiento' },
    { en: 'Optional door-panel protectors (bundle)', es: 'Protectores de puerta opcionales (pack)' },
  ],
  faq: [
    {
      question: { en: 'Will it fit my car?', es: '¿Servirá para mi coche?' },
      answer: {
        en: 'The standard size is designed for most sedans and mid-size SUVs, and the XL fits full-size SUVs and trucks. Final measured dimensions are PROVISIONAL and will be confirmed against the supplier before launch.',
        es: 'La talla estándar está pensada para la mayoría de coches y SUV medianos, y la XL para SUV grandes y pickups. Las medidas finales son PROVISIONAL y se confirmarán con el proveedor antes del lanzamiento.',
      },
    },
    {
      question: { en: 'Is it really waterproof?', es: '¿Es de verdad impermeable?' },
      answer: {
        en: 'The top layer is designed to be waterproof and the seams reinforced, but water-resistance testing is PROVISIONAL until we verify a production sample.',
        es: 'La capa superior está diseñada para ser impermeable y las costuras reforzadas, pero la prueba de resistencia al agua es PROVISIONAL hasta que verifiquemos una muestra de producción.',
      },
    },
    {
      question: { en: 'How do I clean it?', es: '¿Cómo la limpio?' },
      answer: {
        en: 'Machine washable on a cold cycle and air dry. This is PROVISIONAL until confirmed with the supplier.',
        es: 'Lavado a máquina en frío y secado al aire. Es PROVISIONAL hasta confirmarlo con el proveedor.',
      },
    },
    {
      question: { en: 'Will it work if my dog chews?', es: '¿Aguanta si mi perro muerde?' },
      answer: {
        en: 'No fabric cover is chew-proof. This product protects against dirt, fur and moisture, not against a determined chewer. We would rather say that up front.',
        es: 'Ninguna funda de tela es indestructible ante mordiscos. Este producto protege de la suciedad, el pelo y la humedad, no de un perro decidido a morderla. Preferimos decirlo claro.',
      },
    },
    {
      question: { en: 'When will it ship?', es: '¿Cuándo se envía?' },
      answer: {
        en: 'Shipping windows are PROVISIONAL and will be confirmed once a fulfilment partner is chosen.',
        es: 'Los plazos de envío son PROVISIONAL y se confirmarán al elegir el socio de logística.',
      },
    },
  ],
  shippingNote: {
    en: 'PROVISIONAL: shipping cost and delivery window to be confirmed with the fulfilment partner. Orders ship direct from our partner, so there is no warehouse in the middle.',
    es: 'PROVISIONAL: el coste y el plazo de envío se confirmarán con el socio de logística. Los pedidos salen directos de nuestro proveedor, sin almacén de por medio.',
  },
  returnNote: {
    en: 'PROVISIONAL: return window and conditions to be defined before launch.',
    es: 'PROVISIONAL: el plazo y las condiciones de devolución se definirán antes del lanzamiento.',
  },
};

export type Product = typeof product;
export type ProductVariant = (typeof product)['variants'][number];
