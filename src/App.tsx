import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import SEOHead from './components/SEOHead';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageFromPathPrefix, getLanguagePathPrefix } from './config/languages';

// 语言路由包装组件：处理语言检测和重定向
function LanguageRoute({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // 如果 URL 中有语言前缀，使用它
    if (lang) {
      const langCode = getLanguageFromPathPrefix(lang);
      if (langCode && langCode !== i18n.language) {
        i18n.changeLanguage(langCode);
      }
    } else {
      // 如果没有语言前缀，检测用户语言并重定向
      const browserLang = navigator.language;
      const supportedLang = SUPPORTED_LANGUAGES.find(
        l => browserLang.startsWith(l.code.split('-')[0]) || browserLang.startsWith(l.locale.split('-')[0])
      );
      const targetLang = supportedLang?.code || DEFAULT_LANGUAGE;
      const langPrefix = getLanguagePathPrefix(targetLang);
      const pathWithoutLang = location.pathname === '/' ? '' : location.pathname;
      navigate(`/${langPrefix}${pathWithoutLang}${location.search}`, { replace: true });
    }
  }, [lang, navigate, location, i18n]);

  return <>{children}</>;
}

// 根路径重定向组件：检测用户语言并重定向
function RootRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检测用户浏览器语言并重定向
    const browserLang = navigator.language;
    const supportedLang = SUPPORTED_LANGUAGES.find(
      l => browserLang.startsWith(l.code.split('-')[0]) || browserLang.startsWith(l.locale.split('-')[0])
    );
    const targetLang = supportedLang?.code || DEFAULT_LANGUAGE;
    const langPrefix = getLanguagePathPrefix(targetLang);
    navigate(`/${langPrefix}${location.search}`, { replace: true });
  }, [navigate, location]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <SEOHead />
      <Routes>
        {/* 根路径重定向到默认语言 */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* 带语言前缀的路由 */}
        <Route path="/:lang" element={<LanguageRoute><Home /></LanguageRoute>} />
        <Route path="/:lang/history" element={<LanguageRoute><History /></LanguageRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
