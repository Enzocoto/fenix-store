import { useI18n } from '../hooks/useI18n';

export function ProvisionalTag() {
  const { t } = useI18n();
  return (
    <span className="tag tag--provisional" title={t('tag.provisionalTitle')}>
      {t('tag.provisional')}
    </span>
  );
}
