import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { ScreenFingerprint } from '@/types/fingerprint';
import type { ConsistencyCheck } from '@/types/fingerprint';

interface ScreenCardProps {
  screen: ScreenFingerprint;
  checks?: ConsistencyCheck[];
}

export function ScreenCard({ screen, checks }: ScreenCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.screen')} checks={checks}>
      <div className="space-y-1">
        <InfoRow label={t('screen.width')} value={`${screen.width}px`} />
        <InfoRow label={t('screen.height')} value={`${screen.height}px`} />
        <InfoRow label={t('screen.availWidth')} value={`${screen.availWidth}px`} />
        <InfoRow label={t('screen.availHeight')} value={`${screen.availHeight}px`} />
        <InfoRow label={t('screen.colorDepth')} value={screen.colorDepth} />
        <InfoRow label={t('screen.pixelDepth')} value={screen.pixelDepth} />
        <InfoRow label={t('screen.devicePixelRatio')} value={screen.devicePixelRatio} />
      </div>
    </FingerprintCard>
  );
}
