import { useI18n } from '../hooks/useI18n';

const items = [
  { icon: '✓', key: 'trust.checkout' },
  { icon: '🚚', key: 'trust.directShip' },
  { icon: '⇄', key: 'trust.returns' },
  { icon: '✉', key: 'trust.support' },
] as const;

export function TrustRow() {
  const { t } = useI18n();
  return (
    <ul className="badges" style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <li className="badge" key={item.key}>
          <span aria-hidden="true">{item.icon}</span>
          {t(item.key)}
        </li>
      ))}
    </ul>
  );
}
