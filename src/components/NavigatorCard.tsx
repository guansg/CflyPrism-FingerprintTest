import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { NavigatorFingerprint } from '@/types/fingerprint';
import type { ConsistencyCheck } from '@/types/fingerprint';

interface NavigatorCardProps {
  navigator: NavigatorFingerprint;
  checks?: ConsistencyCheck[];
}

export function NavigatorCard({ navigator, checks }: NavigatorCardProps) {
  const { t } = useTranslation();
  
  return (
    <FingerprintCard title={t('cards.navigator')} checks={checks}>
      <div className="space-y-1">
        <InfoRow label={t('navigator.userAgent')} value={navigator.userAgent} highlight />
        <InfoRow label={t('navigator.platform')} value={navigator.platform} />
        <InfoRow label={t('navigator.language')} value={navigator.language} />
        <InfoRow label={t('navigator.languages')} value={navigator.languages.join(', ')} />
        <InfoRow label={t('navigator.vendor')} value={navigator.vendor} />
        <InfoRow label={t('navigator.maxTouchPoints')} value={navigator.maxTouchPoints} />
        <InfoRow label={t('navigator.cookieEnabled')} value={navigator.cookieEnabled} />
        
        {navigator.userAgentData && (
          <>
            <SectionTitle level={2}>{t('navigator.userAgentData')}</SectionTitle>
            <InfoRow label={t('navigator.mobile')} value={navigator.userAgentData.mobile} />
            <InfoRow label={t('navigator.platform')} value={navigator.userAgentData.platform} />
            {navigator.userAgentData.brands && (
              <InfoRow 
                label={t('navigator.brands')} 
                value={navigator.userAgentData.brands.map(b => `${b.brand}/${b.version}`).join(', ')} 
              />
            )}
            {navigator.userAgentData.highEntropyValues && (
              <>
                <SectionTitle level={3}>{t('navigator.highEntropyValues')}</SectionTitle>
                <InfoRow label={t('navigator.architecture')} value={navigator.userAgentData.highEntropyValues.architecture} />
                <InfoRow label={t('navigator.bitness')} value={navigator.userAgentData.highEntropyValues.bitness} />
                <InfoRow label={t('navigator.platformVersion')} value={navigator.userAgentData.highEntropyValues.platformVersion} />
                <InfoRow label={t('navigator.isWow64')} value={navigator.userAgentData.highEntropyValues.isWow64} />
                {navigator.userAgentData.highEntropyValues.formFactors && navigator.userAgentData.highEntropyValues.formFactors.length > 0 && (
                  <InfoRow 
                    label={t('navigator.formFactors')} 
                    value={navigator.userAgentData.highEntropyValues.formFactors.join(', ')} 
                  />
                )}
                {navigator.userAgentData.highEntropyValues.model && (
                  <InfoRow label={t('navigator.model')} value={navigator.userAgentData.highEntropyValues.model} />
                )}
                {navigator.userAgentData.highEntropyValues.fullVersionList && navigator.userAgentData.highEntropyValues.fullVersionList.length > 0 && (
                  <InfoRow 
                    label={t('navigator.fullVersionList')} 
                    value={navigator.userAgentData.highEntropyValues.fullVersionList.map(b => `${b.brand}/${b.version}`).join(', ')} 
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
