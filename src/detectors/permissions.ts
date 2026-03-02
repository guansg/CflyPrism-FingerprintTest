import type { PermissionsFingerprint } from '@/types/fingerprint';

export async function detectPermissions(): Promise<PermissionsFingerprint> {
  const permissions: PermissionsFingerprint = {
    geolocation: 'unknown',
    notifications: 'unknown',
    camera: 'unknown',
    microphone: 'unknown',
    clipboardRead: 'unknown',
    clipboardWrite: 'unknown',
  };

  if (!('permissions' in navigator) || !navigator.permissions) {
    return permissions;
  }

  // 检测各个权限状态
  const permissionNames: Array<keyof PermissionsFingerprint> = [
    'geolocation',
    'notifications',
    'camera',
    'microphone',
    'clipboardRead',
    'clipboardWrite',
  ];

  const queries = permissionNames.map(async (name) => {
    try {
      // 注意：某些权限名称在不同浏览器中可能不同
      let permissionName: PermissionName | string = name;
      
      // 浏览器兼容性处理
      if (name === 'clipboardRead') {
        permissionName = 'clipboard-read' as PermissionName;
      } else if (name === 'clipboardWrite') {
        permissionName = 'clipboard-write' as PermissionName;
      }

      const result = await navigator.permissions.query({ 
        name: permissionName as PermissionName 
      });
      permissions[name] = result.state as 'granted' | 'denied' | 'prompt';
    } catch (e: any) {
      // 某些权限可能不支持或需要用户交互
      console.warn(`Permission ${name} query failed:`, e.message);
      permissions[name] = 'unknown';
    }
  });

  await Promise.allSettled(queries);

  return permissions;
}
