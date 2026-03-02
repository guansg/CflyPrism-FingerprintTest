import type { GeolocationFingerprint } from '@/types/fingerprint';

export async function detectGeolocation(): Promise<GeolocationFingerprint> {
  // 检查权限状态
  let permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown' = 'unknown';
  
  try {
    if ('permissions' in navigator && navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      permissionStatus = result.state as 'granted' | 'denied' | 'prompt';
    }
  } catch (e) {
    // 某些浏览器可能不支持 permissions API
    console.warn('Permissions API not available:', e);
  }

  // 尝试获取地理位置
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: 'Geolocation API not available',
        permissionStatus,
      });
      return;
    }

    const timeout = setTimeout(() => {
      resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: 'Geolocation request timeout',
        permissionStatus,
      });
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          permissionStatus,
        });
      },
      (error) => {
        clearTimeout(timeout);
        // 错误代码：1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        let finalPermissionStatus = permissionStatus;
        if (error.code === 1) {
          finalPermissionStatus = 'denied';
        } else if (error.code === 2) {
          finalPermissionStatus = 'denied';
        }
        
        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          error: error.code === 1 
            ? '用户拒绝了地理位置权限请求' 
            : error.code === 2
            ? '无法获取位置信息'
            : error.code === 3
            ? '获取位置信息超时'
            : error.message || 'Geolocation error',
          permissionStatus: finalPermissionStatus,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}
