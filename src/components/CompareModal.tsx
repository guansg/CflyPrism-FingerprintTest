import { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronRight, Filter, FilterX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FingerprintData } from '@/types/fingerprint';
import { compareFingerprints, type ComparisonResult, type DiffGroup, type DiffStatus } from '@/utils/compare';

interface CompareModalProps {
  previous: FingerprintData;
  current: FingerprintData;
  onClose: () => void;
}

const STATUS_STYLES: Record<DiffStatus, { bg: string; text: string; label: string }> = {
  same:    { bg: '', text: 'text-gray-600 dark:text-gray-400', label: '' },
  changed: { bg: 'bg-amber-50 dark:bg-amber-900/15', text: 'text-amber-700 dark:text-amber-300', label: 'Changed' },
  added:   { bg: 'bg-green-50 dark:bg-green-900/15', text: 'text-green-700 dark:text-green-300', label: 'Added' },
  removed: { bg: 'bg-red-50 dark:bg-red-900/15', text: 'text-red-700 dark:text-red-300', label: 'Removed' },
};

function StatusBadge({ status }: { status: DiffStatus }) {
  if (status === 'same') return null;
  const s = STATUS_STYLES[status];
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${s.bg} ${s.text} border border-current/20`}>
      {s.label}
    </span>
  );
}

function GroupSection({ group, onlyChanges }: { group: DiffGroup; onlyChanges: boolean }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(group.hasChanges);

  const items = onlyChanges ? group.items.filter(i => i.status !== 'same') : group.items;
  if (items.length === 0) return null;

  const cardName = t(`cards.${group.name}`, group.name);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          <span className="font-medium text-gray-900 dark:text-white text-sm">{cardName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {group.stats.changed > 0 && (
            <span className="text-amber-600 dark:text-amber-400">{group.stats.changed} changed</span>
          )}
          {group.stats.added > 0 && (
            <span className="text-green-600 dark:text-green-400">{group.stats.added} added</span>
          )}
          {group.stats.removed > 0 && (
            <span className="text-red-600 dark:text-red-400">{group.stats.removed} removed</span>
          )}
          {!group.hasChanges && (
            <span className="text-gray-400 dark:text-gray-500">{group.stats.same} identical</span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((item) => {
            const style = STATUS_STYLES[item.status];
            return (
              <div key={item.key} className={`grid grid-cols-[minmax(160px,1fr)_2fr_2fr_80px] items-start gap-2 px-4 py-2 text-xs ${style.bg}`}>
                <span className="font-mono text-gray-700 dark:text-gray-300 break-all">{item.key}</span>
                <span className="font-mono text-gray-500 dark:text-gray-400 break-all whitespace-pre-wrap max-h-24 overflow-y-auto">
                  {item.previous}
                </span>
                <span className={`font-mono break-all whitespace-pre-wrap max-h-24 overflow-y-auto ${item.status === 'changed' ? 'text-amber-800 dark:text-amber-200 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.current}
                </span>
                <span className="flex justify-end">
                  <StatusBadge status={item.status} />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CompareModal({ previous, current, onClose }: CompareModalProps) {
  const { t } = useTranslation();
  const [onlyChanges, setOnlyChanges] = useState(true);

  const result: ComparisonResult = useMemo(
    () => compareFingerprints(previous, current),
    [previous, current]
  );

  const { summary, groups } = result;
  const changeCount = summary.changed + summary.added + summary.removed;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('compare.title', '指纹对比')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t('compare.subtitle', '上次检测 vs 本次检测')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOnlyChanges(!onlyChanges)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                onlyChanges
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {onlyChanges ? <Filter className="w-3.5 h-3.5" /> : <FilterX className="w-3.5 h-3.5" />}
              {onlyChanges ? t('compare.onlyChanges', '仅差异') : t('compare.showAll', '全部')}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs flex-shrink-0">
          <span className="text-gray-600 dark:text-gray-400">
            {t('compare.total', '总计')} <strong>{summary.total}</strong> {t('compare.items', '项')}
          </span>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          {changeCount === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              {t('compare.noChanges', '完全一致，无变化')}
            </span>
          ) : (
            <>
              {summary.changed > 0 && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {summary.changed} {t('compare.changed', '已变更')}
                </span>
              )}
              {summary.added > 0 && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {summary.added} {t('compare.added', '新增')}
                </span>
              )}
              {summary.removed > 0 && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {summary.removed} {t('compare.removed', '移除')}
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-400">
                {summary.same} {t('compare.same', '未变')}
              </span>
            </>
          )}
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[minmax(160px,1fr)_2fr_2fr_80px] gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 mx-6">
          <span>{t('compare.colKey', '属性')}</span>
          <span>{t('compare.colPrevious', '上次')}</span>
          <span>{t('compare.colCurrent', '本次')}</span>
          <span className="text-right">{t('compare.colStatus', '状态')}</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {groups.map(g => (
            <GroupSection key={g.name} group={g} onlyChanges={onlyChanges} />
          ))}
        </div>
      </div>
    </div>
  );
}
