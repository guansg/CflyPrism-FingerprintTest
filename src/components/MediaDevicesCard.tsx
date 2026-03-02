import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { MediaDevicesFingerprint } from '@/types/fingerprint';

interface MediaDevicesCardProps {
  mediaDevices: MediaDevicesFingerprint;
}

export function MediaDevicesCard({ mediaDevices }: MediaDevicesCardProps) {
  const { t } = useTranslation();
  
  const getPermissionIcon = () => {
    if (mediaDevices.permissionGranted === null) {
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
    if (mediaDevices.permissionGranted) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getPermissionText = () => {
    if (mediaDevices.permissionGranted === null) {
      return t('mediaDevices.permissionNotRequested');
    }
    if (mediaDevices.permissionGranted) {
      return t('mediaDevices.permissionGranted');
    }
    return t('mediaDevices.permissionDenied');
  };

  const getPermissionColor = () => {
    if (mediaDevices.permissionGranted === null) {
      return 'text-gray-600 dark:text-gray-400';
    }
    if (mediaDevices.permissionGranted) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <FingerprintCard title={t('cards.mediaDevices')}>
      <div className="space-y-1">
        <InfoRow label={t('mediaDevices.deviceCount')} value={mediaDevices.count} highlight />
        
        <SectionTitle level={2}>{t('mediaDevices.permissionStatus')}</SectionTitle>
        <div className="py-2">
          <div className="flex items-center gap-2">
            {getPermissionIcon()}
            <span className={`text-sm font-medium ${getPermissionColor()}`}>
              {getPermissionText()}
            </span>
          </div>
          
          {mediaDevices.error && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {t('common.error')}: {mediaDevices.error}
            </p>
          )}
          
          {mediaDevices.permissionGranted === false && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {t('mediaDevices.permissionDeniedTip')}
            </p>
          )}
        </div>

        {mediaDevices.devices.length > 0 && (
          <>
            <SectionTitle level={2}>{t('mediaDevices.deviceList')}</SectionTitle>
            <div className="space-y-2 py-2">
              {mediaDevices.devices.map((device, index) => (
                <div 
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.label || t('mediaDevices.deviceLabel', { index: index + 1 })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('mediaDevices.type')}: {device.kind} | {t('mediaDevices.id')}: {device.deviceId.substring(0, 20)}...
                      </p>
                    </div>
                    {!device.label && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">
                        {t('mediaDevices.noPermission')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </FingerprintCard>
  );
}
