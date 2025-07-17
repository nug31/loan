import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import id from './locales/id.json';
import en from './locales/en.json';

const resources = {
  id: {
    translation: id
  },
  en: {
    translation: en
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language: English
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

// Clear any existing language preference to use new default
if (typeof window !== 'undefined') {
  const storedLang = localStorage.getItem('i18nextLng');
  if (storedLang === 'id') {
    localStorage.removeItem('i18nextLng');
    i18n.changeLanguage('en');
  }
  });

export default i18n;
