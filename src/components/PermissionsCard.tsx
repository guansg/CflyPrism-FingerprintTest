import { useTranslation } from 'react-i18next';
import { FingerprintCard } from './FingerprintCard';
import type { PermissionsFingerprint } from '@/types/fingerprint';

interface PermissionsCardProps {
  permissions?: PermissionsFingerprint;
}

export function PermissionsCard({ permissions }: PermissionsCardProps) {
  const { t } = useTranslation();
  
  if (!permissions) {
    return (
      <FingerprintCard title={t('cards.permissions')}>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.notDetected')}</div>
      </FingerprintCard>
    );
  }

  const getStatusBadge = (status: string) => {
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
    <FingerprintCard title={t('cards.permissions')}>
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('permissions.geolocation')}</span>
            {getStatusBadge(permissions.geolocation)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('permissions.notifications')}</span>
            {getStatusBadge(permissions.notifications)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('permissions.camera')}</span>
            {getStatusBadge(permissions.camera)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('permissions.microphone')}</span>
            {getStatusBadge(permissions.microphone)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('permissions.clipboardRead')}</span>
            {getStatusBadge(permissions.clipboardRead)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('permissions.clipboardWrite')}</span>
            {getStatusBadge(permissions.clipboardWrite)}
          </div>
        </div>
      </div>
    </FingerprintCard>
  );
}
