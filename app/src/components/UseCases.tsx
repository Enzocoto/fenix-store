import type { ReactNode } from 'react';
import { useI18n } from '../hooks/useI18n';
import type { TranslationKey } from '../i18n/translations';

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="7" cy="9" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <circle cx="17" cy="9" r="1.6" />
      <path d="M12 12c-2.6 0-4.5 1.9-4.5 4.2 0 1.6 1.3 2.6 3 2.6h3c1.7 0 3-1 3-2.6C16.5 13.9 14.6 12 12 12Z" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" strokeLinecap="round" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 9c2 0 2 1.6 4 1.6S9 9 11 9s2 1.6 4 1.6S17 9 19 9" strokeLinecap="round" />
      <path d="M3 14c2 0 2 1.6 4 1.6S9 14 11 14s2 1.6 4 1.6S17 14 19 14" strokeLinecap="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 4v16M4 12h16" strokeLinecap="round" />
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  );
}

const cases: { icon: ReactNode; title: TranslationKey; body: TranslationKey }[] = [
  { icon: <PawIcon />, title: 'home.use1Title', body: 'home.use1Body' },
  { icon: <SunIcon />, title: 'home.use2Title', body: 'home.use2Body' },
  { icon: <WaveIcon />, title: 'home.use3Title', body: 'home.use3Body' },
  { icon: <CrossIcon />, title: 'home.use4Title', body: 'home.use4Body' },
];

export function UseCases() {
  const { t } = useI18n();
  return (
    <div className="grid cards-4">
      {cases.map((item) => (
        <article className="card" key={item.title}>
          <div className="card__icon" aria-hidden="true">
            {item.icon}
          </div>
          <h3>{t(item.title)}</h3>
          <p>{t(item.body)}</p>
        </article>
      ))}
    </div>
  );
}
