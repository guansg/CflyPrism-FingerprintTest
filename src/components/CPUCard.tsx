import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { NavigatorFingerprint } from '@/types/fingerprint';

interface CPUCardProps {
  navigator: NavigatorFingerprint;
}

export function CPUCard({ navigator }: CPUCardProps) {
  const { t } = useTranslation();

  return (
    <FingerprintCard title={t('cards.cpu', 'CPU')}>
      <div className="space-y-1">
        <InfoRow
          label={t('navigator.hardwareConcurrency', 'Hardware Concurrency')}
          value={navigator.hardwareConcurrency}
        />
      </div>
    </FingerprintCard>
  );
}
