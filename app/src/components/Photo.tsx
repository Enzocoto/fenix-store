import { useI18n } from '../hooks/useI18n';
import type { Localized } from '../lib/lang';

interface PhotoProps {
  base: string;
  alt: Localized;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

export function Photo({ base, alt, className, loading = 'lazy', sizes }: PhotoProps) {
  const { lang } = useI18n();
  // Respeta el base de Vite (p. ej. /fenix-store/ en GitHub Pages).
  const src = `${import.meta.env.BASE_URL}${base.replace(/^\//, '')}`;
  return (
    <picture className={className}>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        alt={alt[lang]}
        loading={loading}
        decoding="async"
        sizes={sizes}
      />
    </picture>
  );
}
