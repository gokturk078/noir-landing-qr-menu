import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const isDev = import.meta.env.DEV;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'de', 'ru'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true
    },
    saveMissing: isDev,
    missingKeyHandler: isDev
      ? (_lngs, _ns, key) => {
          console.warn(`[i18n] Missing key: ${key}`);
        }
      : undefined,
  });

export default i18n;
