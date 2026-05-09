'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';
type Theme = 'dark' | 'light';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  saveSettings: (lang: Language, theme: Theme) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const dictionary = {
  id: {
    dashboard: 'Dasbor', upload: 'Unggah', validation: 'Validasi', reports: 'Laporan', settings: 'Pengaturan', logout: 'Keluar', newExpense: 'Catat Baru',
    date: 'Tanggal', category: 'Kategori', total: 'Total', detail: 'Detail', totalExpense: 'Total Pengeluaran', receiptCount: 'Jumlah Struk', topCategory: 'Kategori Teratas',
    processedByAI: 'Diproses oleh AI', noData: 'Belum ada data', recentTransactions: 'Transaksi Terakhir', viewAll: 'Lihat Semua', itemsCount: 'Jml Barang',
    noTransactionHistory: 'Belum ada riwayat transaksi.', insightMsg: 'Data Anda kini sepenuhnya terisolasi dan aman di dalam sistem AetherFinance.',
    detailedReports: 'Laporan Rinci', filterReview: 'Saring dan tinjau riwayat transaksi lengkap Anda.', startDate: 'Tanggal Mulai', endDate: 'Tanggal Akhir',
    allCategories: 'Semua Kategori', reset: 'Atur Ulang', transactionHistory: 'Riwayat Transaksi', recordsFound: 'Data Ditemukan',
    noTransactionFilter: 'Tidak ada transaksi yang sesuai dengan filter ini.', loadingReports: 'Memuat data laporan...', itemDetails: 'Rincian Barang / Layanan:',
    theme: 'Tema Aplikasi', dark: 'Gelap', light: 'Terang', language: 'Bahasa', indonesian: 'Indonesia', english: 'Inggris', save: 'Simpan Perubahan',
    appearance: 'Penampilan & Bahasa', desc: 'Sesuaikan pengalaman AetherFinance Anda.', saveSuccess: 'Pengaturan berhasil disimpan!',
    
    // Kata-kata Baru untuk Konsistensi
    goodMorning: 'Selamat Pagi', goodAfternoon: 'Selamat Siang', goodEvening: 'Selamat Sore', goodNight: 'Selamat Malam',
    wealthInsights: 'Wawasan Keuangan', liveAnalysis: 'ANALISIS LANGSUNG', spendingMix: 'Distribusi Pengeluaran', searchTransactions: 'Cari transaksi...',
    
    // Halaman Upload
    uploadCenter: 'Pusat Unggah', expenseIntelligence: 'Kecerdasan Pengeluaran', uploadDesc: 'Unggah dokumen keuangan Anda untuk verifikasi AI instan dan alokasi portofolio.',
    dropFilesHere: 'Letakkan file Anda di sini', supportedFiles: 'Mendukung PDF, PNG, dan JPEG (Maks 25MB)', cameraCapture: 'Kamera', galleryUpload: 'Unggah Galeri',
    fileReady: 'File Siap', scanReceipt: 'Pindai Struk', analyzing: 'Menganalisis Data Transaksi...', enterpriseSecurity: 'Enkripsi AES-256 kelas Enterprise aktif',
    
    // Halaman Validasi
    reviewResults: 'Tinjau Hasil AI', verifyExtracted: 'Verifikasi data yang diekstrak dari unggahan dokumen terbaru Anda.', reviewRequired: 'Perlu Ditinjau',
    aiIdentified: 'AI mengidentifikasi data dengan keyakinan tinggi, namun verifikasi manual disarankan sebelum menyimpan.', extractedItems: 'Barang yang Diekstrak',
    itemDesc: 'Deskripsi Barang', price: 'Harga', discard: 'Buang', confirmSave: 'Konfirmasi & Simpan', duplicateDetected: 'Duplikat Terdeteksi',
    aiConfidence: 'Tingkat Keyakinan AI', dataAccuracy: 'Akurasi Data', saving: 'Menyimpan...'
  },
  en: {
    dashboard: 'Dashboard', upload: 'Upload', validation: 'Validation', reports: 'Reports', settings: 'Settings', logout: 'Logout', newExpense: 'New Expense',
    date: 'Date', category: 'Category', total: 'Total', detail: 'Detail', totalExpense: 'Total Expense', receiptCount: 'Receipts Count', topCategory: 'Top Category',
    processedByAI: 'Processed by AI', noData: 'No data available', recentTransactions: 'Recent Transactions', viewAll: 'View All', itemsCount: 'Items',
    noTransactionHistory: 'No transaction history yet.', insightMsg: 'Your data is now fully isolated and secured within the AetherFinance system.',
    detailedReports: 'Detailed Reports', filterReview: 'Filter and review your complete transaction history.', startDate: 'Start Date', endDate: 'End Date',
    allCategories: 'All Categories', reset: 'Reset', transactionHistory: 'Transaction History', recordsFound: 'Records Found',
    noTransactionFilter: 'No transactions match this filter.', loadingReports: 'Loading report data...', itemDetails: 'Item / Service Details:',
    theme: 'Application Theme', dark: 'Dark', light: 'Light', language: 'Language', indonesian: 'Indonesian', english: 'English', save: 'Save Changes',
    appearance: 'Appearance & Language', desc: 'Customize your AetherFinance experience.', saveSuccess: 'Settings saved successfully!',
    
    // New words
    goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening', goodNight: 'Good night',
    wealthInsights: 'Wealth Insights', liveAnalysis: 'LIVE ANALYSIS', spendingMix: 'Spending Mix', searchTransactions: 'Search transactions...',
    
    // Upload Page
    uploadCenter: 'Upload Center', expenseIntelligence: 'Expense Intelligence', uploadDesc: 'Upload your financial documents for instant AI verification and portfolio allocation.',
    dropFilesHere: 'Drop your files here', supportedFiles: 'PDF, PNG, and JPEG supported (Max 25MB)', cameraCapture: 'Camera Capture', galleryUpload: 'Gallery Upload',
    fileReady: 'File Ready', scanReceipt: 'Scan Receipt', analyzing: 'Analyzing Transaction Data...', enterpriseSecurity: 'Enterprise-grade AES-256 Encryption active',
    
    // Validation Page
    reviewResults: 'Review AI Results', verifyExtracted: 'Verify extracted data from your recent document upload.', reviewRequired: 'Review Required',
    aiIdentified: 'The AI identified high-confidence data, but manual verification is recommended before saving.', extractedItems: 'Extracted Line Items',
    itemDesc: 'Item Description', price: 'Price', discard: 'Discard', confirmSave: 'Confirm and Save', duplicateDetected: 'Duplicate Detected',
    aiConfidence: 'AI Extraction Confidence', dataAccuracy: 'Data Accuracy', saving: 'Saving...'
  }
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) applyTheme(savedTheme);
    else document.documentElement.classList.add('dark');
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  };

  const saveSettings = (lang: Language, newTheme: Theme) => {
    setLanguageState(lang);
    applyTheme(newTheme);
    localStorage.setItem('app_lang', lang);
    localStorage.setItem('app_theme', newTheme);
  };

  const t = (key: string) => dictionary[language][key as keyof typeof dictionary['id']] || key;

  return (
    <SettingsContext.Provider value={{ language, theme, setLanguage: setLanguageState, setTheme: applyTheme, saveSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}