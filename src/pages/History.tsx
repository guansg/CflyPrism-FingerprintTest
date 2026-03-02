import { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Download, Code, Copy, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFingerprintStore } from '@/stores/fingerprintStore';
import { exportToJSON } from '@/utils/export';
import { getLanguagePathPrefix } from '../config/languages';
import type { HistoryItem } from '@/utils/storage';

export function History() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { history, loadHistory, clearHistory, removeFromHistory } = useFingerprintStore();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCopy = async () => {
    if (!selectedItem) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedItem, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const langPrefix = getLanguagePathPrefix(i18n.language);
                  navigate(`/${langPrefix}`);
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('history.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('history.subtitle')}
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t('common.clearHistory')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('common.noHistory')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(item.timestamp).toLocaleString(
                          i18n.language === 'zh' ? 'zh-CN' : 
                          i18n.language === 'ja' ? 'ja-JP' : 
                          'en-US'
                        )}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                        {item.navigator?.userAgent?.split(' ')[0] ?? 'N/A'} {item.navigator?.userAgent?.match(/Chrome\/(\d+)/)?.[1] || 'N/A'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">{t('history.platform')}</p>
                        <p className="text-gray-900 dark:text-white font-medium">{item.navigator?.platform ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">{t('history.screen')}</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {item.screen?.width ?? '?'} × {item.screen?.height ?? '?'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">{t('history.canvasHash')}</p>
                        <p className="text-gray-900 dark:text-white font-medium font-mono text-xs">
                          {item.canvas?.hash?.substring(0, 16) ?? 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">{t('history.webglHash')}</p>
                        <p className="text-gray-900 dark:text-white font-medium font-mono text-xs">
                          {item.webgl?.hash?.substring(0, 16) ?? 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => { setCopied(false); setSelectedItem(item); }}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="JSON"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => exportToJSON(item)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title={t('common.export')}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* JSON 源码弹窗 */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                JSON — {new Date(selectedItem.timestamp).toLocaleString(
                  i18n.language === 'zh' ? 'zh-CN' : 'en-US'
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t('common.success') : t('common.export')}
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-auto p-6 text-xs font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-b-lg select-all">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
