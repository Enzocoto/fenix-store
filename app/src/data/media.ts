import type { Localized } from '../lib/lang';

export interface ProductPhoto {
  base: string;
  alt: Localized;
}

const note = {
  en: 'Demo photo for layout preview. Replace with a photo you own or have licensed before launch.',
  es: 'Foto de demostración para previsualizar el diseño. Reemplázala por una foto propia o con licencia antes de lanzar.',
};

export const heroPhoto: ProductPhoto = {
  base: '/media/product/rr-hero',
  alt: {
    en: 'back-seat hammock cover installed on a car rear seat',
    es: 'Cubre-asiento hammock instalado en el asiento trasero de un coche',
  },
};

export const productPhotos: ProductPhoto[] = [
  {
    base: '/media/product/rr-photo-1',
    alt: {
      en: 'hammock cover shown on the rear bench seat',
      es: 'Cubre-asiento hammock sobre el asiento trasero',
    },
  },
  {
    base: '/media/product/rr-hero',
    alt: {
      en: 'Hammock cover protecting the back seat on a ride',
      es: 'El cubre-asiento protege el asiento trasero durante el viaje',
    },
  },
  {
    base: '/media/product/rr-photo-2',
    alt: {
      en: 'Dog resting on the hammock cover',
      es: 'Perro descansando sobre el cubre-asiento',
    },
  },
  {
    base: '/media/product/rr-photo-3',
    alt: {
      en: 'Waterproof top layer of the cover',
      es: 'Capa superior impermeable del cubre-asiento',
    },
  },
  {
    base: '/media/product/rr-photo-4',
    alt: {
      en: 'Anti-slip backing and side flaps detail',
      es: 'Detalle de la base antideslizante y las solapas laterales',
    },
  },
  {
    base: '/media/product/rr-photo-5',
    alt: {
      en: 'Headrest straps holding the hammock in place',
      es: 'Correas a los reposacabezas que sujetan la hamaca',
    },
  },
  {
    base: '/media/product/rr-photo-6',
    alt: {
      en: 'cover in a car interior',
      es: 'Cubre-asiento en el interior de un coche',
    },
  },
  {
    base: '/media/product/rr-photo-7',
    alt: {
      en: 'Close view of the hammock cover',
      es: 'Vista cercana del cubre-asiento hammock',
    },
  },
  {
    base: '/media/product/rr-photo-8',
    alt: {
      en: 'cover keeping the back seat clean',
      es: 'El cubre-asiento mantiene limpio el asiento trasero',
    },
  },
];

export const photoNotice = note;
