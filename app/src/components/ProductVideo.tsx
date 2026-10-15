import { useI18n } from '../hooks/useI18n';

const videoSrc = '/media/fenix-promo-wide.mp4';
const posterSrc = '/media/fenix-promo-wide-poster.jpg';

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
