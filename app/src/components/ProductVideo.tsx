import { useI18n } from '../hooks/useI18n';

// Respeta el base de Vite (p. ej. /fenix-store/ en GitHub Pages).
const mediaBase = import.meta.env.BASE_URL;
const videoSrc = `${mediaBase}media/fenix-promo-wide.mp4`;
const posterSrc = `${mediaBase}media/fenix-promo-wide-poster.jpg`;

export function ProductVideo() {
  const { t } = useI18n();

  return (
    <div className="video-frame">
      <video
        className="video-frame__player"
        poster={posterSrc}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={t('product.videoLabel')}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
