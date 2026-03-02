import type { TimezoneFingerprint } from '@/types/fingerprint';

export function detectTimezone(): TimezoneFingerprint {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = -now.getTimezoneOffset() / 60; // 转换为小时

  return {
    timezone,
    offset,
  };
}
