import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import type { GeolocationFingerprint } from '@/types/fingerprint';
import { AlertCircle } from 'lucide-react';

interface GeolocationCardProps {
  geolocation?: GeolocationFingerprint;
}

export function GeolocationCard({ geolocation }: GeolocationCardProps) {
  const { t } = useTranslation();
  
  if (!geolocation) {
    return (
      <FingerprintCard title={t('cards.geolocation')}>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.notDetected')}</div>
      </FingerprintCard>
    );
  }

  const getPermissionBadge = (status: string) => {
    const colors = {
      granted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      denied: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      prompt: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status as keyof typeof colors] || colors.unknown}`}>
        {status}
      </span>
    );
  };

  return (
    <FingerprintCard title={t('cards.geolocation')}>
      <div className="space-y-1">
        {geolocation.error ? (
          <div className="py-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>{geolocation.error}</span>
          </div>
        ) : (
          <>
            <InfoRow label={t('geolocation.latitude')} value={geolocation.latitude?.toFixed(6) || 'N/A'} />
            <InfoRow label={t('geolocation.longitude')} value={geolocation.longitude?.toFixed(6) || 'N/A'} />
            <InfoRow label={t('geolocation.accuracy')} value={geolocation.accuracy ? `${geolocation.accuracy.toFixed(2)} m` : 'N/A'} />
          </>
        )}
        <SectionTitle level={2}>{t('geolocation.permissionStatus')}</SectionTitle>
        <div className="py-2 flex items-center justify-end">
          {getPermissionBadge(geolocation.permissionStatus)}
        </div>
      </div>
    </FingerprintCard>
  );
}
