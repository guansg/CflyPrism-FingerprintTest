import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Settings, ChevronLeft, ChevronRight, Scan, Loader2 } from 'lucide-react';
import type { DetectionOptions } from '@/types/detection';
import { 
  DEFAULT_DETECTION_OPTIONS, 
  ALL_DETECTION_OPTIONS, 
  NONE_DETECTION_OPTIONS,
  DETECTION_GROUPS 
} from '@/types/detection';

interface DetectionOptionsPanelProps {
  options: DetectionOptions;
  onChange: (options: DetectionOptions) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onDetect?: () => void;
  isDetecting?: boolean;
  onClear?: () => void;
  hasResults?: boolean;
  cooldownRemaining?: number;
}

export function DetectionOptionsPanel({ 
  options, 
  onChange, 
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  onDetect,
  isDetecting = false,
  onClear,
  hasResults = false,
  cooldownRemaining = 0
}: DetectionOptionsPanelProps) {
  const { t } = useTranslation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['基础指纹']));
  
  // 使用外部传入的折叠状态，如果没有则使用内部状态
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;
  const setIsCollapsed = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleOption = (key: keyof DetectionOptions) => {
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  const applyPreset = (preset: DetectionOptions) => {
    onChange(preset);
  };

  const selectedCount = Object.values(options).filter(v => v).length;
  const totalCount = Object.keys(options).length;

  if (isCollapsed) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm sticky top-4">
        <button
          onClick={() => setIsCollapsed()}
          className="w-full px-4 py-3 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          title={t('detectionOptions.expand')}
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm sticky top-4 max-h-[calc(100vh-2rem)] flex flex-col">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-100 dark:bg-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {t('detectionOptions.title')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({selectedCount}/{totalCount})
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed()}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('detectionOptions.collapse')}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* 操作按钮区域 */}
      {(onDetect || onClear) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
          {onDetect && (
            <button
              onClick={onDetect}
              disabled={isDetecting || cooldownRemaining > 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('common.detecting')}
                </>
              ) : cooldownRemaining > 0 ? (
                <>
                  <Scan className="w-4 h-4" />
                  {t('common.detect')} ({cooldownRemaining}s)
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  {t('common.detect')}
                </>
              )}
            </button>
          )}
          {onClear && hasResults && (
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {t('common.clear')}
            </button>
          )}
        </div>
      )}

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {/* 预设按钮 */}
          <div className="pb-3 flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset(DEFAULT_DETECTION_OPTIONS)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {t('detectionOptions.recommended')}
            </button>
            <button
              onClick={() => applyPreset(ALL_DETECTION_OPTIONS)}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              {t('detectionOptions.selectAll')}
            </button>
            <button
              onClick={() => applyPreset(NONE_DETECTION_OPTIONS)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {t('detectionOptions.selectNone')}
            </button>
          </div>

          {/* 检测项分组 */}
          <div className="space-y-2">
            {DETECTION_GROUPS.map((group) => {
              // 获取分组翻译名称
              const groupNameMap: Record<string, string> = {
                '基础指纹': t('detectionOptions.groups.basic'),
                '硬件信息': t('detectionOptions.groups.hardware'),
                'Canvas': t('detectionOptions.groups.canvas'),
                'WebGL': t('detectionOptions.groups.webgl'),
                'Audio': t('detectionOptions.groups.audio'),
                '网络层': t('detectionOptions.groups.networkLayer'),
                '反检测': t('detectionOptions.groups.antiDetection'),
              };
              const translatedGroupName = groupNameMap[group.name] || group.name;
              const isExpanded = expandedGroups.has(group.name);
              const groupSelectedCount = group.items.filter(
                item => options[item.key as keyof DetectionOptions]
              ).length;

              return (
                <div key={group.name} className="border border-gray-200 dark:border-gray-700 rounded">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {translatedGroupName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({groupSelectedCount}/{group.items.length})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
                      {group.items.map((item) => {
                        const isChecked = options[item.key as keyof DetectionOptions];
                        const translatedLabel = t(`detectionOptions.items.${item.key}`);
                        return (
                          <label
                            key={item.key}
                            className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleOption(item.key as keyof DetectionOptions)}
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 focus:ring-2 checked:bg-blue-600 checked:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-blue-600"
                            />
                            <span className="text-sm text-gray-900 dark:text-white flex-1">
                              {translatedLabel}
                            </span>
                            {item.requiresPermission && (
                              <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded">
                                {t('detectionOptions.requiresPermission')}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
