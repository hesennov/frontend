import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Persistent language setup
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to our Restaurant',
          order_now: 'Order Now',
        },
      },
      ru: {
        translation: {
          welcome: 'Добро пожаловать в наш ресторан',
          order_now: 'Заказать сейчас',
        },
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Listen to language changes to persist
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
