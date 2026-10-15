import { brand } from '../data/brand';
import { useI18n } from '../hooks/useI18n';
import { formatMoney } from '../lib/money';

interface PriceTagProps {
  cents: number;
  compareAtCents?: number;
  currency?: string;
}

export function PriceTag({ cents, compareAtCents, currency = brand.currency }: PriceTagProps) {
  const { lang } = useI18n();
  const locale = brand.locale[lang];
  return (
    <span>
      <span className="price">{formatMoney(cents, currency, locale)}</span>
      {compareAtCents && compareAtCents > cents ? (
        <span className="price--muted" style={{ marginLeft: 10 }}>
          {formatMoney(compareAtCents, currency, locale)}
        </span>
      ) : null}
    </span>
  );
}
