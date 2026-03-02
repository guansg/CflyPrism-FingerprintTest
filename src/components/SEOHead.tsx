import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguagePathPrefix } from '../config/languages';
import { getSEOPageKey } from '../config/seo';

export default function SEOHead() {
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const pageKey = getSEOPageKey(location.pathname);
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  // 从翻译文件读取 SEO 配置
  const seoConfig = {
    title: t(`${pageKey}.title`),
    description: t(`${pageKey}.description`),
    keywords: t(`${pageKey}.keywords`),
    ogTitle: t(`${pageKey}.ogTitle`, { defaultValue: t(`${pageKey}.title`) }),
    ogDescription: t(`${pageKey}.ogDescription`, { defaultValue: t(`${pageKey}.description`) }),
    ogImage: `${baseUrl}/og-image.png`,
  };

  // 生成当前页面的完整 URL（包含语言前缀）
  const currentUrl = useMemo(() => {
    const langPrefix = getLanguagePathPrefix(currentLang);
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const fullPath = pathWithoutLang === '/' ? `/${langPrefix}` : `/${langPrefix}${pathWithoutLang}`;
    return `${baseUrl}${fullPath}${location.search}`;
  }, [baseUrl, currentLang, location.pathname, location.search]);

  // 生成所有语言版本的 URL（用于 hreflang）
  const languageUrls = useMemo(() => {
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    return SUPPORTED_LANGUAGES.map(lang => {
      const langPrefix = lang.pathPrefix;
      const fullPath = pathWithoutLang === '/' ? `/${langPrefix}` : `/${langPrefix}${pathWithoutLang}`;
      return {
        lang: lang.locale,
        url: `${baseUrl}${fullPath}${location.search}`,
      };
    });
  }, [baseUrl, location.pathname, location.search]);

  // 动态更新 HTML lang 属性
  useEffect(() => {
    const langMap: Record<string, string> = {
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'en': 'en-US',
    };
    const langAttr = langMap[currentLang] || 'en-US';
    document.documentElement.lang = langAttr;
  }, [currentLang]);

  return (
    <Helmet>
      {/* 基础 SEO */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      <meta name="keywords" content={seoConfig.keywords} />

      {/* Canonical 标签 - 避免重复内容 */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={seoConfig.ogTitle || seoConfig.title} />
      <meta property="og:description" content={seoConfig.ogDescription || seoConfig.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={seoConfig.ogImage} />
      <meta property="og:locale" content={
        currentLang === 'zh' ? 'zh_CN' : 
        currentLang === 'ja' ? 'ja_JP' : 
        'en_US'
      } />

      {/* 多语言 hreflang 标签 - 使用路径前缀 URL */}
      {languageUrls.map(({ lang, url }) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={url}
        />
      ))}
      {/* x-default 指向默认语言 */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={languageUrls.find(({ lang }) => {
          const defaultLang = SUPPORTED_LANGUAGES.find(l => l.code === DEFAULT_LANGUAGE);
          return lang === defaultLang?.locale;
        })?.url || currentUrl}
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoConfig.ogTitle || seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.ogDescription || seoConfig.description} />
    </Helmet>
  );
}
