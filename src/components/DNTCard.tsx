import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { NavigatorFingerprint } from '@/types/fingerprint';

interface DNTCardProps {
  navigator: NavigatorFingerprint;
}

export function DNTCard({ navigator }: DNTCardProps) {
  const { t } = useTranslation();

  return (
    <FingerprintCard title={t('cards.dnt', 'Do Not Track')}>
      <div className="space-y-1">
        <InfoRow
          label={t('navigator.doNotTrack', 'Do Not Track')}
          value={navigator.doNotTrack || 'null'}
        />
      </div>
    </FingerprintCard>
  );
}
