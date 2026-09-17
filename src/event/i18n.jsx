import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Globe } from '@phosphor-icons/react';
import { LANGUAGES, translate, validLanguage } from './translations.mjs';

const LanguageContext = createContext(null);
const STORAGE = 'evolix-language-v1';
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { const saved = localStorage.getItem(STORAGE); return validLanguage(saved) ? saved : 'en'; }
    catch { return 'en'; }
  });
  const changeLanguage = useCallback(code => { if (validLanguage(code)) setLanguage(code); }, []);
  const t = useCallback(value => translate(value, language), [language]);
  useEffect(() => {
    document.documentElement.lang = LANGUAGES.find(item => item.code === language).htmlLang;
    document.documentElement.dataset.language = language;
    document.title = `${t('BUSINESS EVOLUTION AUDIT')} | EVOLIX Studio`;
    try { localStorage.setItem(STORAGE, language); } catch {}
  }, [language, t]);
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return <label className="language-selector"><Globe size={17} aria-hidden="true"/><span className="sr-only">Language / भाषा / ભાષા</span><select value={language} onChange={event => setLanguage(event.target.value)}>{LANGUAGES.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label>;
}
