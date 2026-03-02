// SEO 配置模块：只定义路径映射，SEO 内容存储在翻译文件中

// 页面路径到翻译键的映射（只需要定义一次，无需为每种语言重复）
// 注意：这里的路径是去除语言前缀后的路径
export const SEO_PAGE_MAP: Record<string, string> = {
  '/': 'seo.home',
  '/history': 'seo.history',
};

// 获取当前页面的翻译键（去除语言前缀）
export function getSEOPageKey(path: string): string {
  // 去除语言前缀，如 /en/ -> /, /zh/history -> /history
  const pathWithoutLang = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  const normalizedPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
  return SEO_PAGE_MAP[normalizedPath] || SEO_PAGE_MAP['/'];
}
