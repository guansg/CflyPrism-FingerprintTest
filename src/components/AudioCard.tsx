import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { AudioFingerprint } from '@/types/fingerprint';

interface AudioCardProps {
  audio: AudioFingerprint;
}

export function AudioCard({ audio }: AudioCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.audio')}>
      <div className="space-y-1">
        <InfoRow label={t('audio.hash')} value={audio.hash || 'N/A'} highlight />
        <InfoRow label={t('audio.contextId')} value={audio.contextId} />
      </div>
    </FingerprintCard>
  );
}
