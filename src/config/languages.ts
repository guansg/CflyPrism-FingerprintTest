// 支持的语言配置
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US', pathPrefix: 'en' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳', locale: 'zh-CN', pathPrefix: 'zh' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja-JP', pathPrefix: 'ja' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES', pathPrefix: 'es' },
];

export const DEFAULT_LANGUAGE = 'en';

// 获取语言代码的路径前缀（用于 URL）
export function getLanguagePathPrefix(langCode: string): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
  return lang?.pathPrefix || 'en';
}

// 从路径前缀获取语言代码
export function getLanguageFromPathPrefix(prefix: string): string | null {
  const lang = SUPPORTED_LANGUAGES.find(l => l.pathPrefix === prefix);
  return lang?.code || null;
}
