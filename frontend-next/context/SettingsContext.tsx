'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';
type Theme = 'dark' | 'light';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const dictionary = {
  id: {
    // Menu & Umum
    dashboard: 'Dasbor',
    upload: 'Unggah',
    validation: 'Validasi',
    reports: 'Laporan',
    settings: 'Pengaturan',
    logout: 'Keluar',
    newExpense: 'Catat Baru',
    date: 'Tanggal',
    category: 'Kategori',
    total: 'Total',
    detail: 'Detail',
    
    // Dashboard
    totalExpense: 'Total Pengeluaran',
    receiptCount: 'Jumlah Struk',
    topCategory: 'Kategori Teratas',
    processedByAI: 'Diproses oleh AI',
    noData: 'Belum ada data',
    recentTransactions: 'Transaksi Terakhir',
    viewAll: 'Lihat Semua',
    itemsCount: 'Jml Barang',
    noTransactionHistory: 'Belum ada riwayat transaksi.',
    insightMsg: 'Data Anda kini sepenuhnya terisolasi dan aman di dalam sistem AetherFinance.',
    
    // Reports
    detailedReports: 'Laporan Rinci',
    filterReview: 'Saring dan tinjau riwayat transaksi lengkap Anda.',
    startDate: 'Tanggal Mulai',
    endDate: 'Tanggal Akhir',
    allCategories: 'Semua Kategori',
    reset: 'Atur Ulang',
    transactionHistory: 'Riwayat Transaksi',
    recordsFound: 'Data Ditemukan',
    noTransactionFilter: 'Tidak ada transaksi yang sesuai dengan filter ini.',
    loadingReports: 'Memuat data laporan...',
    itemDetails: 'Rincian Barang / Layanan:',
    
    // Halaman Pengaturan
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
    // Menu & Umum
    dashboard: 'Dashboard',
    upload: 'Upload',
    validation: 'Validation',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    newExpense: 'New Expense',
    date: 'Date',
    category: 'Category',
    total: 'Total',
    detail: 'Detail',
    
    // Dashboard
    totalExpense: 'Total Expense',
    receiptCount: 'Receipts Count',
    topCategory: 'Top Category',
    processedByAI: 'Processed by AI',
    noData: 'No data available',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    itemsCount: 'Items',
    noTransactionHistory: 'No transaction history yet.',
    insightMsg: 'Your data is now fully isolated and secured within the AetherFinance system.',
    
    // Reports
    detailedReports: 'Detailed Reports',
    filterReview: 'Filter and review your complete transaction history.',
    startDate: 'Start Date',
    endDate: 'End Date',
    allCategories: 'All Categories',
    reset: 'Reset',
    transactionHistory: 'Transaction History',
    recordsFound: 'Records Found',
    noTransactionFilter: 'No transactions match this filter.',
    loadingReports: 'Loading report data...',
    itemDetails: 'Item / Service Details:',
    
    // Halaman Pengaturan
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

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'light') document.documentElement.classList.remove('dark');
      else document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('dark');
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