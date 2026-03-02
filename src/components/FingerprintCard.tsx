import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ConsistencyCheck } from '@/types/fingerprint';

interface FingerprintCardProps {
  title: string;
  children: React.ReactNode;
  checks?: ConsistencyCheck[];
}

export function FingerprintCard({ title, children, checks }: FingerprintCardProps) {
  const { t } = useTranslation();
  const getStatusIcon = (check: ConsistencyCheck) => {
    if (check.passed) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (check.severity === 'error') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-100 dark:bg-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
      {checks && checks.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('fingerprint.consistencyCheck')}</h4>
          <div className="space-y-2">
            {checks.map((check, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {getStatusIcon(check)}
                <div className="flex-1">
                  <span className={`font-medium ${
                    check.passed 
                      ? 'text-green-700 dark:text-green-400' 
                      : check.severity === 'error'
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {check.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{check.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number | boolean | null | undefined;
  highlight?: boolean;
}

export function InfoRow({ label, value, highlight }: InfoRowProps) {
  const displayValue = value === null || value === undefined ? 'N/A' : String(value);
  
  return (
    <div className={`py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 ${highlight ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className={`text-sm text-gray-900 dark:text-white text-right break-all ${highlight ? 'font-semibold' : ''}`}>
          {displayValue}
        </span>
      </div>
    </div>
  );
}

// 二级标题组件
interface SectionTitleProps {
  children: React.ReactNode;
  level?: 2 | 3; // 2 = 二级标题, 3 = 三级标题
}

export function SectionTitle({ children, level = 2 }: SectionTitleProps) {
  if (level === 2) {
    return (
      <div data-section-title className="first:-mt-6 mt-4 mb-2 -mx-6 px-6 py-2 bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-800/50">
        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">{children}</h4>
      </div>
    );
  }
  
  // level === 3
  return (
    <div data-section-title className="first:-mt-6 mt-3 mb-2 -mx-6 px-6 py-1.5 bg-gray-100 dark:bg-gray-700/50 border-y border-gray-200 dark:border-gray-600">
      <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400">{children}</h5>
    </div>
  );
}
