import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { SpeechVoicesFingerprint } from '@/types/fingerprint';

interface SpeechVoicesCardProps {
  speechVoices?: SpeechVoicesFingerprint;
}

export function SpeechVoicesCard({ speechVoices }: SpeechVoicesCardProps) {
  const { t } = useTranslation();
  
  if (!speechVoices) {
    return (
      <FingerprintCard title={t('cards.speechVoices')}>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.notDetected')}</div>
      </FingerprintCard>
    );
  }

  return (
    <FingerprintCard title={t('cards.speechVoices')}>
      <div className="space-y-1">
        <InfoRow label={t('speechVoices.count')} value={speechVoices.count} />
        {speechVoices.voices.length > 0 && (
          <>
            <SectionTitle level={2}>{t('speechVoices.voicesList')}</SectionTitle>
            <div className="space-y-2 max-h-64 overflow-y-auto py-2">
              {speechVoices.voices.map((voice, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {voice.name} {voice.default && <span className="text-blue-600 dark:text-blue-400">{t('speechVoices.default')}</span>}
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-500 dark:text-gray-500">{voice.lang}</span>
                    {voice.localService && <span className="ml-2 text-green-600 dark:text-green-400">{t('speechVoices.local')}</span>}
                  </div>
                  <div className="mt-1 text-gray-400 dark:text-gray-600">{voice.voiceURI}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
