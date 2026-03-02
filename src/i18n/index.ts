import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE } from '../config/languages';

// 中文翻译文件
import zhCommon from './locales/zh/common.json';
import zhDetection from './locales/zh/detection.json';
import zhDetectors from './locales/zh/detectors.json';
import zhConsistency from './locales/zh/consistency.json';
import zhSeo from './locales/zh/seo.json';

// 英文翻译文件
import enCommon from './locales/en/common.json';
import enDetection from './locales/en/detection.json';
import enDetectors from './locales/en/detectors.json';
import enConsistency from './locales/en/consistency.json';
import enSeo from './locales/en/seo.json';

// 日文翻译文件
import jaCommon from './locales/ja/common.json';
import jaDetection from './locales/ja/detection.json';
import jaDetectors from './locales/ja/detectors.json';
import jaConsistency from './locales/ja/consistency.json';
import jaSeo from './locales/ja/seo.json';

// 西班牙语翻译文件
import esCommon from './locales/es/common.json';
import esDetection from './locales/es/detection.json';
import esDetectors from './locales/es/detectors.json';
import esConsistency from './locales/es/consistency.json';
import esSeo from './locales/es/seo.json';

// 合并翻译文件的辅助函数
const mergeTranslations = (...modules: object[]) => {
  return modules.reduce((acc, module) => ({ ...acc, ...module }), {});
};

i18n
  .use(LanguageDetector) // 检测浏览器语言
  .use(initReactI18next) // 初始化 react-i18next
  .init({
    resources: {
      zh: {
        translation: mergeTranslations(zhCommon, zhDetection, zhDetectors, zhConsistency, zhSeo),
      },
      en: {
        translation: mergeTranslations(enCommon, enDetection, enDetectors, enConsistency, enSeo),
      },
      ja: {
        translation: mergeTranslations(jaCommon, jaDetection, jaDetectors, jaConsistency, jaSeo),
      },
      es: {
        translation: mergeTranslations(esCommon, esDetection, esDetectors, esConsistency, esSeo),
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    lng: localStorage.getItem('i18nextLng') || DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // React 已经转义了
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
