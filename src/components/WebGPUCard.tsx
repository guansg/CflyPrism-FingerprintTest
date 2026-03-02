import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { WebGPUFingerprint } from '@/types/fingerprint';
import { CheckCircle2, XCircle } from 'lucide-react';

interface WebGPUCardProps {
  webgpu?: WebGPUFingerprint;
}

export function WebGPUCard({ webgpu }: WebGPUCardProps) {
  const { t } = useTranslation();
  
  if (!webgpu) {
    return (
      <FingerprintCard title={t('cards.webgpu')}>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.notDetected')}</div>
      </FingerprintCard>
    );
  }

  return (
    <FingerprintCard title={t('cards.webgpu')}>
      <div className="space-y-1">
        <div className="py-2 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('webgpu.available')}</span>
            {webgpu.available ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{t('common.yes')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{t('common.no')}</span>
              </div>
            )}
          </div>
        </div>
        {webgpu.error && (
          <InfoRow label={t('common.error')} value={webgpu.error} />
        )}
        {webgpu.adapter && (
          <>
            <SectionTitle level={2}>{t('webgpu.adapterInfo')}</SectionTitle>
            {webgpu.adapter.info && (
              <>
                <InfoRow label={t('webgpu.vendor')} value={webgpu.adapter.info.vendor || 'N/A'} />
                <InfoRow label={t('webgpu.architecture')} value={webgpu.adapter.info.architecture || 'N/A'} />
                <InfoRow label={t('webgpu.device')} value={webgpu.adapter.info.device || 'N/A'} />
                <InfoRow label={t('webgpu.description')} value={webgpu.adapter.info.description || 'N/A'} />
              </>
            )}
            <SectionTitle level={3}>{t('webgpu.features')} ({webgpu.adapter.features.length})</SectionTitle>
            <div className="py-2 text-xs text-gray-600 dark:text-gray-400">
              {webgpu.adapter.features.slice(0, 10).join(', ')}
              {webgpu.adapter.features.length > 10 && ` ... (+${webgpu.adapter.features.length - 10} more)`}
            </div>
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
