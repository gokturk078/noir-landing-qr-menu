import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { applySeo } from '@/lib/seo';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const MenuPage = lazy(() => import('@/pages/MenuPage'));

function SeoSync() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const route = location.pathname === '/menu' ? '/menu' : '/';
    applySeo({ i18nInstance: i18n, route, t });
  }, [i18n, location.pathname, t]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SeoSync />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}
