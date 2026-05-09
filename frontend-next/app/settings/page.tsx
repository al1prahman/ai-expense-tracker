'use client';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/context/SettingsContext';
import { Monitor, Globe, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme, language, setLanguage, t } = useSettings();
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hilang setelah 3 detik
  };

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title={t('settings')} />
      
      <main className="px-8 mt-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('appearance')}</h1>
          <p className="text-[#94A3B8]">{t('desc')}</p>
        </div>

        {/* Notifikasi Simpan */}
        {showToast && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start space-x-3 transition-all">
            <CheckCircle2 className="text-green-400 mt-0.5 shrink-0" size={18} />
            <p className="text-green-400 text-sm font-medium">Pengaturan berhasil disimpan!</p>
          </div>
        )}

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8">
          
          {/* Pilihan Tema */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
              <Monitor size={16} />
              <span>{t('theme')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
              >
                <div className="w-16 h-10 bg-[#090E17] rounded border border-white/20 mb-3 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-[#090E17]"></div>
                </div>
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-300'}`}>{t('dark')}</span>
              </button>

              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
              >
                <div className="w-16 h-10 bg-white rounded border border-slate-300 mb-3 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-white"></div>
                </div>
                <span className={`text-sm font-semibold ${theme === 'light' ? 'text-cyan-400' : 'text-slate-300'}`}>{t('light')}</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Pilihan Bahasa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
              <Globe size={16} />
              <span>{t('language')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setLanguage('id')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${language === 'id' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
              >
                <span className="text-sm font-semibold">🇮🇩 {t('indonesian')}</span>
              </button>

              <button 
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${language === 'en' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
              >
                <span className="text-sm font-semibold">🇬🇧 {t('english')}</span>
              </button>
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity"
          >
            {t('save')}
          </button>
        </div>

      </main>
    </div>
  );
}