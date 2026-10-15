import { site } from './site';

/** Aplica la paleta de la marca como variables CSS (permite recolorear sin tocar CSS). */
export function applyTheme(root: HTMLElement = document.documentElement): void {
  const vars: Record<string, string> = {
    '--brand': site.theme.brand,
    '--brand-strong': site.theme.brandStrong,
    '--brand-soft': site.theme.brandSoft,
    '--accent': site.theme.accent,
    '--accent-strong': site.theme.accentStrong,
    '--surface-alt': site.theme.surfaceAlt,
  };
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}
