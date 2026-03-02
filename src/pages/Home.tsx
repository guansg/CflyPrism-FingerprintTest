import { useEffect, useState } from 'react';
import { Scan, Download, History, Loader2, GitCompareArrows } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFingerprintStore } from '@/stores/fingerprintStore';
import { exportToJSON } from '@/utils/export';
import { NavigatorCard } from '@/components/NavigatorCard';
import { UILanguageCard } from '@/components/UILanguageCard';
import { TimezoneCard } from '@/components/TimezoneCard';
import { GeolocationCard } from '@/components/GeolocationCard';
import { PermissionsCard } from '@/components/PermissionsCard';
import { ScreenCard } from '@/components/ScreenCard';
import { FontsCard } from '@/components/FontsCard';
import { CPUCard } from '@/components/CPUCard';
import { MemoryCard } from '@/components/MemoryCard';
import { ClientRectsCard } from '@/components/ClientRectsCard';
import { MediaDevicesCard } from '@/components/MediaDevicesCard';
import { CanvasCard } from '@/components/CanvasCard';
import { WebGLCard } from '@/components/WebGLCard';
import { WebGPUCard } from '@/components/WebGPUCard';
import { AudioCard } from '@/components/AudioCard';
import { SpeechVoicesCard } from '@/components/SpeechVoicesCard';
import { WebRTCCard } from '@/components/WebRTCCard';
import { DNTCard } from '@/components/DNTCard';
import { AutomationCard } from '@/components/AutomationCard';
import { FingerprintCard } from '@/components/FingerprintCard';
import { DetectionOptionsPanel } from '@/components/DetectionOptionsPanel';
import { CompareModal } from '@/components/CompareModal';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { getLanguagePathPrefix } from '../config/languages';

export function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const { 
    fingerprint,
    history,
    consistencyChecks, 
    isDetecting, 
    error, 
    detect, 
    clear,
    detectionOptions,
    setDetectionOptions,
    cooldownRemaining,
  } = useFingerprintStore();

  // history[0] 是刚检测的当前结果，history[1] 是上一次（持久化在 localStorage）
  const previousFingerprint = history.length >= 2 ? history[1] : null;

  useEffect(() => {
    useFingerprintStore.getState().loadHistory();
    
    const store = useFingerprintStore.getState();
    if (!store.canDetect()) {
      const remaining = store.getCooldownRemaining();
      if (remaining > 0) {
        store.startCooldownTimer();
      }
    }
  }, []);

  const handleDetect = async () => {
    await detect();
  };

  const handleExportJSON = () => {
    if (fingerprint) {
      exportToJSON(fingerprint);
    }
  };

  const totalChecks = consistencyChecks.length;
  const passedChecks = consistencyChecks.filter(c => c.passed).length;
  const failedChecks = consistencyChecks.filter(c => !c.passed && c.severity === 'error').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('home.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('home.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => {
                  const langPrefix = getLanguagePathPrefix(i18n.language);
                  navigate(`/${langPrefix}/history`);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                <span>{t('common.history')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto flex gap-6 px-4 sm:px-6 lg:px-8 py-8">
        {/* 侧边栏 - 检测选项 */}
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 transition-all duration-300`}>
          <DetectionOptionsPanel 
            options={detectionOptions}
            onChange={setDetectionOptions}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onDetect={handleDetect}
            isDetecting={isDetecting}
            onClear={clear}
            hasResults={!!fingerprint}
            cooldownRemaining={cooldownRemaining}
          />
        </aside>

        {/* 主内容区域 */}
        <div className="flex-1 min-w-0">

         {error && !error.includes('请等待') && (
           <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
             <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
           </div>
         )}

         {/* 权限检测提示 */}
         {(detectionOptions.geolocation || detectionOptions.mediaDevices || detectionOptions.permissions) && (
           <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
             <div className="flex items-start gap-3">
               <div className="flex-shrink-0">
                 <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div className="flex-1">
                 <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                   {t('home.permissionNotice')}
                 </h3>
                 <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
                   {t('home.permissionEnabled')}
                   {detectionOptions.geolocation && (
                     <span className="inline-block mx-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">
                       {t('home.geolocation')}
                     </span>
                   )}
                   {detectionOptions.mediaDevices && (
                     <span className="inline-block mx-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">
                       {t('home.mediaDevices')}
                     </span>
                   )}
                   {detectionOptions.permissions && (
                     <span className="inline-block mx-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">
                       {t('home.permissions')}
                     </span>
                   )}
                 </p>
                 <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                   <p>• <strong>{t('home.permissionTip1')}</strong></p>
                   <p>• <strong>{t('home.permissionTip2')}</strong></p>
                   <p>• <strong>{t('home.permissionTip3')}</strong></p>
                 </div>
               </div>
             </div>
           </div>
         )}

         {fingerprint ? (
          <>
            {/* Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('home.detectionTime')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {new Date(fingerprint.timestamp).toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('home.consistencyCheck')}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {passedChecks} / {totalChecks}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('home.errorCount')}</p>
                <p className={`text-lg font-semibold mt-1 ${failedChecks > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {failedChecks}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('home.actions', '操作')}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => previousFingerprint && setShowCompare(true)}
                    disabled={!previousFingerprint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-700"
                    title={!previousFingerprint ? t('compare.needHistory', '需要至少两次检测') : t('compare.title', '指纹对比')}
                  >
                    <GitCompareArrows className="w-4 h-4" />
                    <span>{t('compare.button', '对比')}</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    title={t('common.exportJSON')}
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('common.export')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Fingerprint Cards — 按客户端 7 Tab 排列 */}
            <div className="space-y-8">

              {/* ══════ 第 1 组：基础指纹（对应客户端 Tab: basic）══════ */}
              {(fingerprint.navigator || fingerprint.uiLanguage || fingerprint.timezone || fingerprint.geolocation || fingerprint.permissions || fingerprint.screen || fingerprint.viewport || fingerprint.fonts) && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">{t('home.group.basic', '基础指纹')}</h2>
                  <div className="space-y-6">
                    {fingerprint.navigator && (
                      <NavigatorCard 
                        navigator={fingerprint.navigator} 
                        checks={consistencyChecks.filter(c => c.name.includes('Navigator') || c.name.includes('Language') || c.name.includes('User-Agent'))}
                      />
                    )}
                    {fingerprint.uiLanguage && <UILanguageCard uiLanguage={fingerprint.uiLanguage} />}
                    {fingerprint.timezone && <TimezoneCard timezone={fingerprint.timezone} />}
                    {fingerprint.geolocation && <GeolocationCard geolocation={fingerprint.geolocation} />}
                    {fingerprint.permissions && <PermissionsCard permissions={fingerprint.permissions} />}
                    {fingerprint.screen && (
                      <ScreenCard 
                        screen={fingerprint.screen}
                        checks={consistencyChecks.filter(c => c.name.includes('Screen'))}
                      />
                    )}
                    {fingerprint.viewport && (
                      <FingerprintCard title={t('fingerprint.viewport')}>
                        <div className="space-y-1">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('fingerprint.innerSize')}</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {fingerprint.viewport.innerWidth} × {fingerprint.viewport.innerHeight}px
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('fingerprint.outerSize')}</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {fingerprint.viewport.outerWidth} × {fingerprint.viewport.outerHeight}px
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('fingerprint.clientSize')}</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {fingerprint.viewport.clientWidth} × {fingerprint.viewport.clientHeight}px
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('fingerprint.zoomInfo')}</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {fingerprint.viewport.zoomLevel !== undefined 
                                  ? `${t('fingerprint.zoom')}: ${(fingerprint.viewport.zoomLevel * 100).toFixed(1)}%`
                                  : `${t('fingerprint.zoom')}: ${t('fingerprint.zoomDetectFailed')}`
                                }
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {t('fingerprint.dpr')}: {fingerprint.viewport.devicePixelRatio || fingerprint.screen?.devicePixelRatio || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </FingerprintCard>
                    )}
                    {fingerprint.fonts && <FontsCard fonts={fingerprint.fonts} />}
                  </div>
                </section>
              )}

              {/* ══════ 第 2 组：硬件信息（对应客户端 Tab: hardware）══════ */}
              {(fingerprint.navigator || fingerprint.clientRects || fingerprint.mediaDevices) && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">{t('home.group.hardware', '硬件信息')}</h2>
                  <div className="space-y-6">
                    {fingerprint.navigator && <CPUCard navigator={fingerprint.navigator} />}
                    {fingerprint.navigator && <MemoryCard navigator={fingerprint.navigator} />}
                    {fingerprint.clientRects && <ClientRectsCard clientRects={fingerprint.clientRects} />}
                    {fingerprint.mediaDevices && <MediaDevicesCard mediaDevices={fingerprint.mediaDevices} />}
                  </div>
                </section>
              )}

              {/* ══════ 第 3 组：Canvas（对应客户端 Tab: canvas）══════ */}
              {fingerprint.canvas && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">Canvas</h2>
                  <div className="space-y-6">
                    <CanvasCard canvas={fingerprint.canvas} />
                  </div>
                </section>
              )}

              {/* ══════ 第 4 组：WebGL（对应客户端 Tab: webgl）══════ */}
              {(fingerprint.webgl || fingerprint.webgpu) && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">WebGL</h2>
                  <div className="space-y-6">
                    {fingerprint.webgl && <WebGLCard webgl={fingerprint.webgl} />}
                    {fingerprint.webgpu && <WebGPUCard webgpu={fingerprint.webgpu} />}
                  </div>
                </section>
              )}

              {/* ══════ 第 5 组：Audio（对应客户端 Tab: audio）══════ */}
              {(fingerprint.audio || fingerprint.speechVoices) && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">Audio</h2>
                  <div className="space-y-6">
                    {fingerprint.audio && <AudioCard audio={fingerprint.audio} />}
                    {fingerprint.speechVoices && <SpeechVoicesCard speechVoices={fingerprint.speechVoices} />}
                  </div>
                </section>
              )}

              {/* ══════ 第 6 组：网络层（对应客户端 Tab: network）══════ */}
              {(fingerprint.webrtc || fingerprint.navigator) && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">{t('home.group.network', '网络层')}</h2>
                  <div className="space-y-6">
                    {fingerprint.webrtc && <WebRTCCard webrtc={fingerprint.webrtc} />}
                    {fingerprint.navigator && <DNTCard navigator={fingerprint.navigator} />}
                  </div>
                </section>
              )}

              {/* ══════ 第 7 组：反检测（对应客户端 Tab: antiDetection）══════ */}
              {fingerprint.automation && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-sky-500">{t('home.group.antiDetection', '反检测')}</h2>
                  <div className="space-y-6">
                    <AutomationCard automation={fingerprint.automation} />
                  </div>
                </section>
              )}

            </div>

          </>
        ) : (
          <div className="text-center py-12">
            <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.startDetect')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('home.startDetectDesc')}
            </p>
            <button
              onClick={handleDetect}
              disabled={isDetecting || cooldownRemaining > 0}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.detecting')}
                </>
              ) : cooldownRemaining > 0 ? (
                <>
                  <Scan className="w-5 h-5" />
                  {t('common.detect')} ({cooldownRemaining}s)
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  {t('common.detect')}
                </>
              )}
            </button>
          </div>
        )}
        </div>
      </main>

      {showCompare && previousFingerprint && fingerprint && (
        <CompareModal
          previous={previousFingerprint}
          current={fingerprint}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
