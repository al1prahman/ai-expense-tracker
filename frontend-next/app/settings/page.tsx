'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/context/SettingsContext';
import { Monitor, Globe, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { theme, language, saveSettings, t } = useSettings();
  
  // State lokal: menampung pilihan sementara sebelum klik Save
  const [tempTheme, setTempTheme] = useState(theme);
  const [tempLang, setTempLang] = useState(language);
  const [showToast, setShowToast] = useState(false);

  const handleFinalSave = () => {
    saveSettings(tempLang, tempTheme);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors duration-300">
      <Navbar title={t('settings')} />
      
      <main className="px-8 mt-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('appearance')}</h1>
          <p className="text-slate-500 dark:text-[#94A3B8]">{t('desc')}</p>
        </div>

        {showToast && (
          <div className="p-4 bg-green-100 dark:bg-green-500/10 border border-green-300 dark:border-green-500/30 rounded-xl flex items-center space-x-3 transition-all animate-in fade-in zoom-in">
            <CheckCircle2 className="text-green-600 dark:text-green-400 shrink-0" size={18} />
            <p className="text-green-700 dark:text-green-400 text-sm font-medium">{t('saveSuccess')}</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-md dark:shadow-2xl space-y-8 transition-colors">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
              <Monitor size={16} />
              <span>{t('theme')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTempTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${tempTheme === 'dark' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-400/10' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300'}`}
              >
                <div className="w-16 h-10 bg-[#090E17] rounded border border-slate-300 dark:border-white/20 mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-[#090E17]"></div>
                </div>
                <span className={`text-sm font-semibold ${tempTheme === 'dark' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300'}`}>{t('dark')}</span>
              </button>

              <button 
                onClick={() => setTempTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${tempTheme === 'light' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-400/10' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300'}`}
              >
                <div className="w-16 h-10 bg-white rounded border border-slate-300 mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-white"></div>
                </div>
                <span className={`text-sm font-semibold ${tempTheme === 'light' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300'}`}>{t('light')}</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
              <Globe size={16} />
              <span>{t('language')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTempLang('id')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${tempLang === 'id' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}
              >
                <span className="text-sm font-semibold">🇮🇩 {t('indonesian')}</span>
              </button>

              <button 
                onClick={() => setTempLang('en')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${tempLang === 'en' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}
              >
                <span className="text-sm font-semibold">🇬🇧 {t('english')}</span>
              </button>
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleFinalSave}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity"
          >
            {t('save')}
          </button>
        </div>

      </main>
    </div>
  );
}