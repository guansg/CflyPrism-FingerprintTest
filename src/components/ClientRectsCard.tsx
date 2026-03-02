import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { ClientRectsFingerprint } from '@/types/fingerprint';

interface ClientRectsCardProps {
  clientRects?: ClientRectsFingerprint;
}

export function ClientRectsCard({ clientRects }: ClientRectsCardProps) {
  const { t } = useTranslation();
  
  if (!clientRects) {
    return (
      <FingerprintCard title={t('cards.clientRects')}>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.notDetected')}</div>
      </FingerprintCard>
    );
  }

  return (
    <FingerprintCard title={t('cards.clientRects')}>
      <div className="space-y-1">
        <InfoRow label={t('clientRects.hash')} value={clientRects.hash} highlight />
        <InfoRow label={t('clientRects.rectsCount')} value={clientRects.rects.length} />
        {clientRects.rects.length > 0 && (
          <>
            <SectionTitle level={2}>{t('clientRects.rectsDetails')}</SectionTitle>
            <div className="space-y-2 max-h-48 overflow-y-auto py-2">
              {clientRects.rects.map((rect, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                  <div>{t('clientRects.rectLabel', { index: index + 1 })}: {rect.width}×{rect.height} @ ({rect.x}, {rect.y})</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
