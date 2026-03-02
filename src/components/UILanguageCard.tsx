import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { UILanguageFingerprint } from '@/types/fingerprint';

interface UILanguageCardProps {
  uiLanguage: UILanguageFingerprint;
}

export function UILanguageCard({ uiLanguage }: UILanguageCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.uiLanguage')}>
      <div className="space-y-1">
        <InfoRow label={t('uiLanguage.locale')} value={uiLanguage.locale} highlight />
        <InfoRow label={t('uiLanguage.dateTimeLocale')} value={uiLanguage.dateTimeLocale} />
        <InfoRow label={t('uiLanguage.numberLocale')} value={uiLanguage.numberLocale} />
        <InfoRow label={t('uiLanguage.collatorLocale')} value={uiLanguage.collatorLocale} />
        <InfoRow label={t('uiLanguage.relativeTimeLocale')} value={uiLanguage.relativeTimeLocale} />
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            {t('uiLanguage.tip')}
          </p>
        </div>
      </div>
    </FingerprintCard>
  );
}

