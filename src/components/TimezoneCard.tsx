import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { TimezoneFingerprint } from '@/types/fingerprint';

interface TimezoneCardProps {
  timezone: TimezoneFingerprint;
}

export function TimezoneCard({ timezone }: TimezoneCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.timezone')}>
      <div className="space-y-1">
        <InfoRow label={t('timezone.timezone')} value={timezone.timezone} highlight />
        <InfoRow label={t('timezone.offset')} value={`${timezone.offset >= 0 ? '+' : ''}${timezone.offset} hours`} />
      </div>
    </FingerprintCard>
  );
}
