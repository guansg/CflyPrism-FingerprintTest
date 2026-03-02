import type { WebGPUFingerprint } from '@/types/fingerprint';

export async function detectWebGPU(): Promise<WebGPUFingerprint> {
  if (!('gpu' in navigator) || !(navigator as any).gpu) {
    return {
      available: false,
      error: 'WebGPU API not available',
    };
  }

  try {
    const gpu = (navigator as any).gpu;
    const adapter = await gpu.requestAdapter();

    if (!adapter) {
      return {
        available: false,
        error: 'No WebGPU adapter available',
      };
    }

    const features = Array.from(adapter.features) as string[];
    const limits: Record<string, number> = {};
    
    // 获取所有 limits
    for (const key in adapter.limits) {
      limits[key] = adapter.limits[key as keyof typeof adapter.limits] as number;
    }

    // 尝试获取 adapter info（某些浏览器可能不支持）
    let info: { vendor?: string; architecture?: string; device?: string; description?: string } | undefined;
    try {
      if ('requestAdapterInfo' in adapter && typeof adapter.requestAdapterInfo === 'function') {
        const adapterInfo = await adapter.requestAdapterInfo();
        info = {
          vendor: adapterInfo.vendor,
          architecture: adapterInfo.architecture,
          device: adapterInfo.device,
          description: adapterInfo.description,
        };
      }
    } catch (e) {
      // requestAdapterInfo 可能不被支持或需要权限
      console.warn('Failed to get adapter info:', e);
    }

    return {
      available: true,
      adapter: {
        features,
        limits,
        info,
      },
    };
  } catch (e: any) {
    return {
      available: false,
      error: e.message || 'WebGPU detection failed',
    };
  }
}
