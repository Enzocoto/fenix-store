import { useI18n } from '../hooks/useI18n';

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4V5Z" strokeLinejoin="round" />
      <path d="M8 9h8M8 12h5" strokeLinecap="round" />
    </svg>
  );
}

export function ReviewsSection() {
  const { t } = useI18n();
  return (
    <div className="reviews">
      <div className="reviews__icon" aria-hidden="true">
        <ChatIcon />
      </div>
      <div>
        <h2>{t('home.reviewsTitle')}</h2>
        <p className="lede">{t('home.reviewsBody')}</p>
        <a className="button button--ghost" href="#faq">
          {t('home.reviewsCta')}
        </a>
      </div>
    </div>
  );
}
