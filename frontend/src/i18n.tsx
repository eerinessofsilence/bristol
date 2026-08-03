import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'uk' | 'en';

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (ukrainian: string, english: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const storageKey = 'cleargatecustoms-language';

function setMetaContent(selector: string, content: string) {
  const meta = document.querySelector<HTMLMetaElement>(selector);
  if (meta) meta.content = content;
}

function getInitialLanguage(): Language {
  const savedLanguage = window.localStorage.getItem(storageKey);
  if (savedLanguage === 'uk' || savedLanguage === 'en') return savedLanguage;
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'uk';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(storageKey, language);
    const isEnglish = language === 'en';
    const pageTitle = isEnglish
      ? 'ClearGateCustoms — customs clearance for cargo from China and Europe'
      : 'ClearGateCustoms — митне оформлення вантажів з Китаю та Європи';
    const socialTitle = 'ClearGateCustoms';
    const description = isEnglish
      ? 'Customs clearance for cargo from China and Europe, with delivery coordinated through Gdańsk and Constanța to warehouses in Ukraine.'
      : 'Митне оформлення вантажів з Китаю та Європи. Координуємо доставку через порти Гданська й Констанци до складу в Україні.';
    const imageAlt = isEnglish ? 'ClearGateCustoms logo' : 'Логотип ClearGateCustoms';

    document.title = pageTitle;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', socialTitle);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:locale"]', isEnglish ? 'en_US' : 'uk_UA');
    setMetaContent('meta[property="og:locale:alternate"]', isEnglish ? 'uk_UA' : 'en_US');
    setMetaContent('meta[property="og:image:alt"]', imageAlt);
    setMetaContent('meta[name="twitter:title"]', socialTitle);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[name="twitter:image:alt"]', imageAlt);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (ukrainian: string, english: string) => (language === 'en' ? english : ukrainian),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// This hook is intentionally colocated with its provider so the locale contract stays in one module.
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used inside I18nProvider');
  return context;
}
