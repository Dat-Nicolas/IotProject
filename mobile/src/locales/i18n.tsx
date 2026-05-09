/**
 * i18n Configuration and Context
 * Language management for the app
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { vi } from './vi';

export type Language = 'vi' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const translations: Record<Language, typeof vi> = {
  vi,
  en: vi,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  const t = useCallback(
    (key: string, defaultValue: string = key): string => {
      const keys = key.split('.');
      let value: any = translations[language] || translations.vi;

      for (const k of keys) {
        value = value?.[k];
        if (!value) {
          return defaultValue;
        }
      }

      return typeof value === 'string' ? value : defaultValue;
    },
    [language],
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

/**
 * Simple translation hook
 * Usage: const t = useTranslate(); then t('auth.signIn')
 */
export const useTranslate = () => {
  return useI18n().t;
};
