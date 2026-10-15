import { useContext } from 'react';
import { I18nContext, type I18nApi } from '../i18n/i18n-context';

export function useI18n(): I18nApi {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}
