import { createContext } from 'react';
import type { Lang } from '../lib/lang';
import type { TranslationKey } from './translations';

export type TranslateParams = Record<string, string | number>;

export type Translate = (key: TranslationKey, params?: TranslateParams) => string;

export interface I18nApi {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translate;
}

export const I18nContext = createContext<I18nApi | null>(null);
