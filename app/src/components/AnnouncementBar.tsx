import { useI18n } from '../hooks/useI18n';
import { ProvisionalTag } from './ProvisionalTag';

export function AnnouncementBar() {
  const { t } = useI18n();
  return (
    <div className="announce">
      <div className="container announce__inner">
        <span className="announce__icon" aria-hidden="true">
          🚚
        </span>
        <span>{t('announce.text')}</span>
        <ProvisionalTag />
      </div>
    </div>
  );
}
