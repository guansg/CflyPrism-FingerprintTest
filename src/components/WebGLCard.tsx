import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { WebGLFingerprint } from '@/types/fingerprint';

interface WebGLCardProps {
  webgl: WebGLFingerprint;
}

export function WebGLCard({ webgl }: WebGLCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.webgl')}>
      <div className="space-y-1">
        <InfoRow label={t('webgl.vendor')} value={webgl.vendor} />
        <InfoRow label={t('webgl.renderer')} value={webgl.renderer} />
        <InfoRow label={t('webgl.version')} value={webgl.version} />
        <InfoRow label={t('webgl.shadingLanguageVersion')} value={webgl.shadingLanguageVersion} />
        <InfoRow label={t('webgl.hash')} value={webgl.hash || 'N/A'} highlight />
        <InfoRow label={t('webgl.extensionsCount')} value={webgl.extensions.length} />
        
        {Object.keys(webgl.parameters).length > 0 && (
          <>
            <SectionTitle level={2}>{t('webgl.parameters')} ({Object.keys(webgl.parameters).length})</SectionTitle>
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(webgl.parameters).map(([key, value]) => (
                <InfoRow key={key} label={key} value={String(value)} />
              ))}
            </div>
          </>
        )}
        
        {webgl.dataURL && (
          <>
            <SectionTitle level={2}>{t('webgl.imagePreview')}</SectionTitle>
            <div className="py-2">
              <img 
                src={webgl.dataURL} 
                alt="WebGL fingerprint" 
                className="border border-gray-200 dark:border-gray-700 rounded"
              />
            </div>
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
