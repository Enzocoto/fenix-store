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
  return (
    <picture className={className}>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={`${base}.jpg`}
        alt={alt[lang]}
        loading={loading}
        decoding="async"
        sizes={sizes}
      />
    </picture>
  );
}
