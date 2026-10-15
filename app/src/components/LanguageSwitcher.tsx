import { useI18n } from '../hooks/useI18n';
import { LANGS, type Lang } from '../lib/lang';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label={t('lang.label')}>
      {LANGS.map((code: Lang) => (
        <button
          key={code}
          type="button"
          className="lang-switch__btn"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
