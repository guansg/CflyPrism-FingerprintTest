import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { CanvasFingerprint } from '@/types/fingerprint';

interface CanvasCardProps {
  canvas: CanvasFingerprint;
}

export function CanvasCard({ canvas }: CanvasCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.canvas')}>
      <div className="space-y-4">
        <InfoRow label={t('canvas.hash')} value={canvas.hash || 'N/A'} highlight />
        {canvas.dataURL && (
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('canvas.imagePreview')}</p>
            <img 
              src={canvas.dataURL} 
              alt="Canvas fingerprint" 
              className="border border-gray-200 dark:border-gray-700 rounded"
            />
          </div>
        )}
      </div>
    </FingerprintCard>
  );
}
