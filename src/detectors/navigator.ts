import type { NavigatorFingerprint } from '@/types/fingerprint';

export async function detectNavigator(): Promise<NavigatorFingerprint> {
  const nav = navigator;
  
  // 获取 User-Agent Data（如果支持）
  let userAgentData: NavigatorFingerprint['userAgentData'] | undefined;
  if ('userAgentData' in nav && nav.userAgentData) {
    const uaData = nav.userAgentData as any;
    
    // 先获取基础信息
    userAgentData = {
      brands: uaData.brands ? [...uaData.brands] : [],
      mobile: uaData.mobile || false,
      platform: uaData.platform || '',
    };

    // 获取高熵值（需要权限，但通常不需要用户授权）
    try {
      if (uaData.getHighEntropyValues && typeof uaData.getHighEntropyValues === 'function') {
        // 请求所有可用的高熵值
        const requestedValues = [
          'architecture',
          'bitness',
          'form-factors',
          'model',
          'platformVersion',
          'fullVersionList',
          'wow64',
          'uaFullVersion', // 某些浏览器支持
        ];
        
        const highEntropyValues = await uaData.getHighEntropyValues(requestedValues);
        
        if (highEntropyValues) {
          userAgentData.highEntropyValues = {
            architecture: highEntropyValues.architecture,
            bitness: highEntropyValues.bitness,
            formFactors: highEntropyValues['form-factors'] as string[],
            model: highEntropyValues.model,
            platformVersion: highEntropyValues.platformVersion,
            fullVersionList: highEntropyValues.fullVersionList,
            isWow64: highEntropyValues.wow64,
          };
        }
      } else {
        // 如果不支持 getHighEntropyValues，尝试直接访问属性（某些浏览器可能直接暴露）
        const uaDataAny = uaData as any;
        if (uaDataAny.architecture || uaDataAny.bitness || uaDataAny.platformVersion) {
          userAgentData.highEntropyValues = {
            architecture: uaDataAny.architecture,
            bitness: uaDataAny.bitness,
            formFactors: uaDataAny.formFactors || uaDataAny['form-factors'],
            model: uaDataAny.model,
            platformVersion: uaDataAny.platformVersion,
            fullVersionList: uaDataAny.fullVersionList,
            isWow64: uaDataAny.wow64,
          };
        }
      }
    } catch (e: any) {
      console.warn('Failed to get high entropy values:', e);
      // 即使失败，也保留基础信息
    }
  }

  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    language: nav.language,
    languages: [...nav.languages],
    vendor: nav.vendor,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: (nav as any).deviceMemory,
    maxTouchPoints: nav.maxTouchPoints,
    cookieEnabled: nav.cookieEnabled,
    doNotTrack: nav.doNotTrack,
    userAgentData,
  };
}
