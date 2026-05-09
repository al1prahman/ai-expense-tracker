'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';
type Theme = 'dark' | 'light';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string; // Fungsi untuk menerjemahkan teks
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Kamus Bahasa Sederhana
const dictionary = {
  id: {
    settings: 'Pengaturan',
    theme: 'Tema Aplikasi',
    dark: 'Gelap',
    light: 'Terang',
    language: 'Bahasa',
    indonesian: 'Indonesia',
    english: 'Inggris',
    save: 'Simpan Perubahan',
    appearance: 'Penampilan & Bahasa',
    desc: 'Sesuaikan pengalaman AetherFinance Anda.'
  },
  en: {
    settings: 'Settings',
    theme: 'Application Theme',
    dark: 'Dark',
    light: 'Light',
    language: 'Language',
    indonesian: 'Indonesian',
    english: 'English',
    save: 'Save Changes',
    appearance: 'Appearance & Language',
    desc: 'Customize your AetherFinance experience.'
  }
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');

  // Ambil pengaturan dari memori browser saat pertama kali dimuat
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'light') document.documentElement.classList.remove('dark');
      else document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('dark'); // Default Dark
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
    if (newTheme === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  };

  // Fungsi penerjemah (Translator)
  const t = (key: string) => {
    return dictionary[language][key as keyof typeof dictionary['id']] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}