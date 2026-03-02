import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow, SectionTitle } from './FingerprintCard';
import { AlertTriangle, Shield, Home, Globe } from 'lucide-react';
import type { WebRTCFingerprint } from '@/types/fingerprint';

interface WebRTCCardProps {
  webrtc: WebRTCFingerprint;
}

function getIPTypeIcon(type: 'public' | 'private' | 'link-local' | 'loopback') {
  switch (type) {
    case 'public':
      return <Globe className="w-4 h-4 text-red-500" />;
    case 'private':
      return <Home className="w-4 h-4 text-blue-500" />;
    case 'link-local':
      return <Shield className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
}

function getIPTypeLabel(type: 'public' | 'private' | 'link-local' | 'loopback', t: any) {
  switch (type) {
    case 'public':
      return t('webrtc.publicIP');
    case 'private':
      return t('webrtc.privateIP');
    case 'link-local':
      return t('webrtc.linkLocal');
    case 'loopback':
      return t('webrtc.loopback');
    default:
      return t('common.unknown');
  }
}

function getIPTypeColor(type: 'public' | 'private' | 'link-local' | 'loopback') {
  switch (type) {
    case 'public':
      return 'text-red-600 dark:text-red-400';
    case 'private':
      return 'text-blue-600 dark:text-blue-400';
    case 'link-local':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export function WebRTCCard({ webrtc }: WebRTCCardProps) {
  const { t } = useTranslation();
  const totalIPs = webrtc.localIPs.length;
  
  return (
    <FingerprintCard title={t('cards.webrtc')}>
      <div className="space-y-1">
        <InfoRow label={t('webrtc.totalIPs')} value={totalIPs} />
        <InfoRow label={t('webrtc.publicIPCount')} value={webrtc.publicIPs.length} />
        <InfoRow label={t('webrtc.privateIPCount')} value={webrtc.privateIPs.length} />
        <InfoRow label={t('webrtc.linkLocalIPCount')} value={webrtc.linkLocalIPs.length} />
        
        {webrtc.leakDetected && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">⚠️ {t('webrtc.publicIPLeak')}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {t('webrtc.publicIPLeakMessage', { count: webrtc.publicIPs.length })}
              </p>
              {webrtc.publicIP && (
                <p className="text-xs font-mono text-red-700 dark:text-red-300 mt-1">
                  {t('webrtc.leakedPublicIP')}: {webrtc.publicIP}
                </p>
              )}
            </div>
          </div>
        )}
        
        {totalIPs > 0 && (
          <>
            <SectionTitle level={2}>{t('webrtc.ipDetails')}</SectionTitle>
            <div className="space-y-2 py-2">
              {webrtc.localIPs.map((ip, index) => {
                const ipType = webrtc.ipTypes[ip] || 'private';
                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      {getIPTypeIcon(ipType)}
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{ip}</span>
                    </div>
                    <span className={`text-xs font-medium ${getIPTypeColor(ipType)}`}>
                      {getIPTypeLabel(ipType, t)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {totalIPs === 0 && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ {t('webrtc.noIPLeak')}
            </p>
          </div>
        )}
      </div>
    </FingerprintCard>
  );
}
