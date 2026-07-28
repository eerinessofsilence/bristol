import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'uk' | 'en';

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (ukrainian: string, english: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const storageKey = 'cleargatecustoms-language';

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
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content =
        language === 'en'
          ? 'ClearGateCustoms specialists handle customs clearance and coordinate logistics through Gdańsk and Constanța ports to the client’s warehouse in Ukraine.'
          : 'Митне оформлення вантажів виконують власні фахівці ClearGateCustoms. Організовуємо супутню логістику — доставку через порти Гданська й Констанци до складу клієнта в Україні.';
    }
    document.title =
      language === 'en'
        ? 'ClearGateCustoms — customs clearance for cargo from China and Europe'
        : 'ClearGateCustoms — митне оформлення вантажів з Китаю та Європи';
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
