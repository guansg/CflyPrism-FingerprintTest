import i18n from '@/i18n';
import type { FingerprintData, ConsistencyCheck } from '@/types/fingerprint';

export function checkConsistency(fingerprint: FingerprintData): ConsistencyCheck[] {
  const checks: ConsistencyCheck[] = [];
  const t = (key: string, options?: any): string => String(i18n.t(key, options));

  // 1. User-Agent 与 User-Agent Data 版本一致性
  if (fingerprint.navigator.userAgent && fingerprint.navigator.userAgentData?.brands) {
    const uaVersion = extractChromeVersion(fingerprint.navigator.userAgent);
    // 查找真实的浏览器品牌（跳过 "Not(A:Brand" 占位符）
    const realBrand = fingerprint.navigator.userAgentData.brands.find(
      b => !b.brand.includes('Not') && (b.brand.includes('Chromium') || b.brand.includes('Chrome') || b.brand.includes('Edge'))
    );
    const uaDataVersion = realBrand?.version || null;
    
    // 提取主版本号进行比较（例如 "144.0.0.0" -> "144"）
    const uaMainVersion = uaVersion ? uaVersion.split('.')[0] : null;
    const uaDataMainVersion = uaDataVersion ? uaDataVersion.split('.')[0] : null;
    
    checks.push({
      name: t('consistency.userAgentVersion'),
      passed: uaMainVersion === uaDataMainVersion,
      message: t('consistency.messages.userAgentVersion', {
        uaVersion: uaVersion || 'N/A',
        uaDataVersion: uaDataVersion || 'N/A'
      }),
      severity: uaMainVersion === uaDataMainVersion ? 'info' : 'error',
    });
  }

  // 2. Screen 与 Viewport 一致性
  // 注意：Viewport 和 Screen 的关系受多种因素影响（缩放、DPI、浏览器UI等），这里只做信息性检查
  if (fingerprint.screen && fingerprint.viewport) {
    const devicePixelRatio = fingerprint.viewport.devicePixelRatio || fingerprint.screen.devicePixelRatio || 1;
    const zoomLevel = fingerprint.viewport.zoomLevel;
    
    // Screen 尺寸转换为 CSS 像素
    const screenWidthCSS = fingerprint.screen.width / devicePixelRatio;
    const screenHeightCSS = fingerprint.screen.height / devicePixelRatio;
    
    // 计算差异（允许较大的差异，因为浏览器UI、缩放等因素）
    const widthDiff = fingerprint.viewport.innerWidth - screenWidthCSS;
    const heightDiff = fingerprint.viewport.innerHeight - screenHeightCSS;
    
    // 宽松的检查：允许 Viewport 在 Screen CSS 尺寸的 50%-150% 范围内
    // 这样可以覆盖各种缩放和显示情况
    const minWidth = screenWidthCSS * 0.5;
    const maxWidth = screenWidthCSS * 1.5;
    const minHeight = screenHeightCSS * 0.5;
    const maxHeight = screenHeightCSS * 1.5;
    
    const screenWidthOk = fingerprint.viewport.innerWidth >= minWidth && fingerprint.viewport.innerWidth <= maxWidth;
    const screenHeightOk = fingerprint.viewport.innerHeight >= minHeight && fingerprint.viewport.innerHeight <= maxHeight;
    
    const zoomInfoText = zoomLevel !== undefined 
      ? ` (${t('consistency.labels.zoom')}: ${(zoomLevel * 100).toFixed(1)}%, ${t('consistency.labels.dpr')}: ${devicePixelRatio})`
      : ` (${t('consistency.labels.dpr')}: ${devicePixelRatio})`;
    
    checks.push({
      name: t('consistency.screenViewportWidth'),
      passed: screenWidthOk,
      message: t('consistency.messages.screenViewportWidth', {
        screenWidth: fingerprint.screen.width,
        screenWidthCSS: screenWidthCSS.toFixed(0),
        viewportWidth: fingerprint.viewport.innerWidth,
        diffLabel: t('consistency.labels.diff'),
        diff: `${widthDiff > 0 ? '+' : ''}${widthDiff.toFixed(0)}`,
        zoomInfo: zoomInfoText
      }),
      severity: screenWidthOk ? 'info' : 'warning',
    });
    
    checks.push({
      name: t('consistency.screenViewportHeight'),
      passed: screenHeightOk,
      message: t('consistency.messages.screenViewportHeight', {
        screenHeight: fingerprint.screen.height,
        screenHeightCSS: screenHeightCSS.toFixed(0),
        viewportHeight: fingerprint.viewport.innerHeight,
        diffLabel: t('consistency.labels.diff'),
        diff: `${heightDiff > 0 ? '+' : ''}${heightDiff.toFixed(0)}`,
        zoomInfo: zoomInfoText
      }),
      severity: screenHeightOk ? 'info' : 'warning',
    });
    
    // 添加缩放级别信息
    if (zoomLevel !== undefined) {
      checks.push({
        name: t('consistency.browserZoom'),
        passed: true,
        message: t('consistency.messages.browserZoom', {
          zoomLabel: t('consistency.labels.zoom'),
          zoom: (zoomLevel * 100).toFixed(1),
          dprLabel: t('consistency.labels.dpr'),
          dpr: devicePixelRatio.toFixed(2)
        }),
        severity: 'info',
      });
    }
  }

  // 3. Languages 与 Language 一致性
  if (fingerprint.navigator.languages.length > 0) {
    const firstLang = fingerprint.navigator.languages[0];
    const langMatch = fingerprint.navigator.language === firstLang;
    
    checks.push({
      name: t('consistency.languageConsistency'),
      passed: langMatch,
      message: t('consistency.messages.languageConsistency', {
        language: fingerprint.navigator.language,
        firstLang
      }),
      severity: langMatch ? 'info' : 'error',
    });
  }

  // 4. Screen 可用区域检查
  if (fingerprint.screen) {
    const availOk = fingerprint.screen.availWidth <= fingerprint.screen.width &&
                    fingerprint.screen.availHeight <= fingerprint.screen.height;
    
    checks.push({
      name: t('consistency.screenAvailArea'),
      passed: availOk,
      message: t('consistency.messages.screenAvailArea', {
        width: fingerprint.screen.width,
        availWidth: fingerprint.screen.availWidth,
        height: fingerprint.screen.height,
        availHeight: fingerprint.screen.availHeight
      }),
      severity: availOk ? 'info' : 'warning',
    });
  }

  // 5. Color Depth 与 Pixel Depth 一致性
  if (fingerprint.screen) {
    const depthMatch = fingerprint.screen.colorDepth === fingerprint.screen.pixelDepth;
    
    checks.push({
      name: t('consistency.colorPixelDepth'),
      passed: depthMatch,
      message: t('consistency.messages.colorPixelDepth', {
        colorDepth: fingerprint.screen.colorDepth,
        pixelDepth: fingerprint.screen.pixelDepth
      }),
      severity: depthMatch ? 'info' : 'warning',
    });
  }

  // 6. Automation Detection 检查
  if (fingerprint.automation) {
    const hasAutomation = fingerprint.automation.webdriver === true ||
                          fingerprint.automation.chromeRuntime === true ||
                          fingerprint.automation.automationFlags.hasAutomationFlag ||
                          fingerprint.automation.automationFlags.hasChromeAutomation ||
                          Object.keys(fingerprint.automation.otherFlags).length > 0;
    
    checks.push({
      name: t('consistency.automationDetection'),
      passed: !hasAutomation,
      message: hasAutomation 
        ? String(t('consistency.messages.automationDetected'))
        : String(t('consistency.messages.automationNotDetected')),
      severity: hasAutomation ? 'error' : 'info',
    });
  }

  // 7. Geolocation 与 Permissions 一致性
  if (fingerprint.geolocation && fingerprint.permissions) {
    const geolocPermissionMatch = fingerprint.geolocation.permissionStatus === fingerprint.permissions.geolocation;
    
    checks.push({
      name: t('consistency.geolocationPermission'),
      passed: geolocPermissionMatch,
      message: t('consistency.messages.geolocationPermission', {
        geolocStatus: fingerprint.geolocation.permissionStatus,
        permStatus: fingerprint.permissions.geolocation
      }),
      severity: geolocPermissionMatch ? 'info' : 'warning',
    });
  }

  return checks;
}

function extractChromeVersion(ua: string): string | null {
  const match = ua.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}
