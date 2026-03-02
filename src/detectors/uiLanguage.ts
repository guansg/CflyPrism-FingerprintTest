import type { UILanguageFingerprint } from '@/types/fingerprint';

export function detectUILanguage(): UILanguageFingerprint {
  // 检测 Intl API 的 locale（这些通常反映浏览器 UI 语言）
  const dateTimeLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const numberLocale = Intl.NumberFormat().resolvedOptions().locale;
  const collatorLocale = Intl.Collator().resolvedOptions().locale;
  
  // 尝试检测相对时间格式的 locale
  let relativeTimeLocale = dateTimeLocale;
  try {
    // Intl.RelativeTimeFormat 可能不被所有浏览器支持
    if ('RelativeTimeFormat' in Intl && typeof (Intl as any).RelativeTimeFormat === 'function') {
      const rtf = new (Intl as any).RelativeTimeFormat();
      relativeTimeLocale = rtf.resolvedOptions().locale;
    }
  } catch (e) {
    // 如果不支持，使用 dateTimeLocale 作为后备
    relativeTimeLocale = dateTimeLocale;
  }
  
  // 主 locale（通常与 UI 语言一致）
  const locale = dateTimeLocale;

  return {
    locale,
    dateTimeLocale,
    numberLocale,
    collatorLocale,
    relativeTimeLocale,
  };
}

