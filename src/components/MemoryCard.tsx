import { useTranslation } from 'react-i18next';
import { FingerprintCard, InfoRow } from './FingerprintCard';
import type { NavigatorFingerprint } from '@/types/fingerprint';

interface MemoryCardProps {
  navigator: NavigatorFingerprint;
}

export function MemoryCard({ navigator }: MemoryCardProps) {
  const { t } = useTranslation();

  return (
    <FingerprintCard title={t('cards.memory', 'Memory')}>
      <div className="space-y-1">
        <InfoRow
          label={t('navigator.deviceMemory', 'Device Memory')}
          value={
            navigator.deviceMemory !== undefined
              ? `${navigator.deviceMemory} GB`
              : 'N/A'
          }
        />
        {navigator.deviceMemory !== undefined && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 ml-4 mt-1 mb-2">
            ⚠️ {t('cards.memoryNote', '浏览器为隐私保护会返回不精确的值（向下舍入到最近的2的幂次方，通常限制在2-32GB范围内）')}
          </p>
        )}
      </div>
    </FingerprintCard>
  );
}
