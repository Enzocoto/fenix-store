import { useState } from 'react';
import { Photo } from './Photo';
import { productPhotos } from '../data/media';
import { useI18n } from '../hooks/useI18n';

export function ProductGallery() {
  const { lang } = useI18n();
  const [active, setActive] = useState(0);
  const current = productPhotos[active];

  return (
    <div>
      <div className="gallery__main">
        <Photo base={current.base} alt={current.alt} className="gallery__photo" loading="eager" sizes="(min-width: 900px) 520px, 100vw" />
      </div>
      <div className="gallery__thumbs" role="list">
        {productPhotos.map((photo, index) => (
          <button
            key={photo.base}
            type="button"
            className="gallery__thumb"
            aria-current={active === index}
            aria-label={photo.alt[lang]}
            onClick={() => setActive(index)}
          >
            <Photo base={photo.base} alt={photo.alt} className="gallery__thumbimg" />
          </button>
        ))}
      </div>
      <p className="gallery__caption">{current.alt[lang]}</p>
    </div>
  );
}
