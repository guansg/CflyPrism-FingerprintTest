import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { FontsFingerprint } from '@/types/fingerprint';

interface FontsCardProps {
  fonts: FontsFingerprint;
}

export function FontsCard({ fonts }: FontsCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.fonts')}>
      <div className="space-y-1">
        <InfoRow label={t('fonts.fontCount')} value={fonts.count} highlight />
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">{t('fonts.libraryOnly')}</p>
        <div className="pt-2 mt-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('fonts.fontList')}</p>
          <div className="flex flex-wrap gap-2">
            {fonts.fonts.map((font, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
              >
                {font}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FingerprintCard>
  );
}
