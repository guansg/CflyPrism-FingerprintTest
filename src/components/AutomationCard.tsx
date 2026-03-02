import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { AutomationFingerprint } from '@/types/fingerprint';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AutomationCardProps {
  automation?: AutomationFingerprint;
}

export function AutomationCard({ automation }: AutomationCardProps) {
  const { t } = useTranslation();
  
  if (!automation) {
    return (
      <FingerprintCard title={t('cards.automation')}>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.notDetected')}</div>
      </FingerprintCard>
    );
  }

  const hasAutomationFlags = automation.webdriver === true || 
                            automation.chromeRuntime === true ||
                            automation.automationFlags.hasAutomationFlag ||
                            automation.automationFlags.hasChromeAutomation ||
                            Object.keys(automation.otherFlags).length > 0;

  return (
    <FingerprintCard title={t('cards.automation')}>
      <div className="space-y-1">
        <div className="py-2 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('automation.detectionStatus')}</span>
            {hasAutomationFlags ? (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{t('automation.detected')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{t('automation.clean')}</span>
              </div>
            )}
          </div>
        </div>
        <InfoRow label={t('automation.webdriver')} value={automation.webdriver === undefined ? 'undefined' : String(automation.webdriver)} />
        <InfoRow label={t('automation.chromeRuntime')} value={automation.chromeRuntime === undefined ? 'undefined' : String(automation.chromeRuntime)} />
        <InfoRow label={t('automation.hasAutomationFlag')} value={automation.automationFlags.hasAutomationFlag} />
        <InfoRow label={t('automation.hasChromeAutomation')} value={automation.automationFlags.hasChromeAutomation} />
        {Object.keys(automation.otherFlags).length > 0 && (
          <>
            <SectionTitle level={2}>{t('automation.otherFlags')}</SectionTitle>
            {Object.entries(automation.otherFlags).map(([key, value]) => (
              <InfoRow key={key} label={key} value={String(value)} />
            ))}
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
