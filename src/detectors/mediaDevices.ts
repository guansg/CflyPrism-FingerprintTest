import type { MediaDevicesFingerprint } from '@/types/fingerprint';

export async function detectMediaDevices(): Promise<MediaDevicesFingerprint> {
  try {
    // 检查 API 支持情况
    if (!navigator.mediaDevices) {
      return {
        devices: [],
        count: 0,
        permissionGranted: null,
        error: 'navigator.mediaDevices is not available',
      };
    }
    
    if (!navigator.mediaDevices.enumerateDevices) {
      return {
        devices: [],
        count: 0,
        permissionGranted: null,
        error: 'enumerateDevices is not supported',
      };
    }

    // 先尝试枚举设备（不需要权限，但 label 会为空）
    let devices = await navigator.mediaDevices.enumerateDevices();
    let permissionGranted: boolean | null = null;
    
    // 检查是否有设备 label（如果有 label，说明权限已授予）
    const hasLabels = devices.some(device => device.label && device.label.length > 0);
    
    if (hasLabels) {
      permissionGranted = true;
    } else {
      // 尝试请求权限（通过 getUserMedia）
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: false, 
          audio: true 
        });
        
        // 权限已授予，重新枚举设备以获取 label
        devices = await navigator.mediaDevices.enumerateDevices();
        permissionGranted = true;
        
        // 停止流
        stream.getTracks().forEach(track => track.stop());
      } catch (error: any) {
        // 权限被拒绝或其他错误
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          permissionGranted = false;
          // 如果权限被拒绝，重新枚举设备（label 仍会为空）
          devices = await navigator.mediaDevices.enumerateDevices();
        } else {
          permissionGranted = null;
        }
      }
    }
    
    return {
      devices: devices.map(device => ({
        deviceId: device.deviceId,
        kind: device.kind,
        label: device.label,
        groupId: device.groupId,
        toJSON: () => ({
          deviceId: device.deviceId,
          kind: device.kind,
          label: device.label,
          groupId: device.groupId,
        }),
      })) as MediaDeviceInfo[],
      count: devices.length,
      permissionGranted,
    };
  } catch (e: any) {
    console.warn('MediaDevices detection failed:', e);
    return {
      devices: [],
      count: 0,
      permissionGranted: null,
      error: e.message || 'Unknown error',
    };
  }
}
