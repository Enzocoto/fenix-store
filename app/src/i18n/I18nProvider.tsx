import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isLang, type Lang } from '../lib/lang';
import { readStore, writeStore } from '../lib/store';
import { translations, type TranslationKey } from './translations';
import { I18nContext, type I18nApi, type TranslateParams } from './i18n-context';

export const LANG_STORAGE_KEY = 'lang';

function detectLang(): Lang {
  const stored = readStore<string | null>(LANG_STORAGE_KEY, null);
  if (stored && isLang(stored)) {
    return stored;
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('es')) {
    return 'es';
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    writeStore(LANG_STORAGE_KEY, lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => {
      const template = translations[lang][key] ?? translations.en[key];
      if (!params) {
        return template;
      }
      return template.replace(/\{(\w+)\}/g, (_, token: string) => String(params[token] ?? ''));
    },
    [lang],
  );

  const value = useMemo<I18nApi>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
