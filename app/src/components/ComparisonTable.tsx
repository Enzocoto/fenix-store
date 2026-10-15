import { useI18n } from '../hooks/useI18n';
import type { TranslationKey } from '../i18n/translations';

type Cell = 'yes' | 'no' | 'partial';

const rows: { label: TranslationKey; fenix: Cell; towel: Cell; tray: Cell }[] = [
  { label: 'compare.r1', fenix: 'yes', towel: 'partial', tray: 'yes' },
  { label: 'compare.r2', fenix: 'yes', towel: 'no', tray: 'no' },
  { label: 'compare.r3', fenix: 'yes', towel: 'no', tray: 'partial' },
  { label: 'compare.r4', fenix: 'yes', towel: 'yes', tray: 'yes' },
  { label: 'compare.r5', fenix: 'yes', towel: 'no', tray: 'no' },
  { label: 'compare.r6', fenix: 'yes', towel: 'partial', tray: 'no' },
];

function Mark({ value }: { value: Cell }) {
  const { t } = useI18n();
  const label = t(value === 'yes' ? 'compare.yes' : value === 'no' ? 'compare.no' : 'compare.partial');
  return (
    <span className={`cmp__mark cmp__mark--${value}`}>
      <span aria-hidden="true">{value === 'yes' ? '✓' : value === 'no' ? '✕' : '~'}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ComparisonTable() {
  const { t } = useI18n();
  return (
    <div className="cmp-wrap">
      <table className="cmp">
        <thead>
          <tr>
            <th scope="col">{t('compare.feature')}</th>
            <th scope="col" className="cmp__fenix">
              {t('compare.fenix')}
            </th>
            <th scope="col">{t('compare.towel')}</th>
            <th scope="col">{t('compare.tray')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{t(row.label)}</th>
              <td className="cmp__fenix">
                <Mark value={row.fenix} />
              </td>
              <td>
                <Mark value={row.towel} />
              </td>
              <td>
                <Mark value={row.tray} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
