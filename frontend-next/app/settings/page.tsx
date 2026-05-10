'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/context/SettingsContext';
import { Save, Palette, Globe, Moon, Sun, Flag } from 'lucide-react';

// IMPORT SONNER
import { toast } from "sonner";

// IMPORT KOMPONEN SHADCN
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { language, theme, saveSettings, t } = useSettings();
  const [tempLang, setTempLang] = useState<'id' | 'en'>(language);
  const [tempTheme, setTempTheme] = useState<'dark' | 'light'>(theme);

  // Reset state jika context berubah dari luar
  useEffect(() => {
    setTempLang(language);
    setTempTheme(theme);
  }, [language, theme]);

  const handleSave = () => {
    saveSettings(tempLang, tempTheme);
    
    // PEMANGGILAN SONNER TOAST
    toast.success(t('saveSuccess') || "Pengaturan berhasil disimpan!", {
      description: `Tema: ${tempTheme === 'dark' ? 'Gelap' : 'Terang'} | Bahasa: ${tempLang === 'id' ? 'Indonesia' : 'English'}`,
    });
  };

  const glassCardClass = "bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-2xl transition-all duration-300";
  const controlBoxClass = "grid grid-cols-2 h-14 bg-slate-100 dark:bg-[#0F172A] rounded-xl p-1 border border-slate-300/60 dark:border-white/5";
  const tabTriggerClass = "rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold transition-all flex gap-2 h-full border border-transparent data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:border-slate-100 data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-cyan-400 dark:data-[state=active]:border-white/5";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors duration-300 relative">
      <Navbar title={t('settings')} />
      
      <main className="px-8 mt-10 max-w-3xl mx-auto space-y-8 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{t('appearance')}</h1>
          <p className="text-slate-500 dark:text-[#94A3B8]">{t('desc')}</p>
        </div>

        {/* KARTU TEMA */}
        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Palette className="text-cyan-500" size={20} />
              {t('theme')}
            </CardTitle>
            <CardDescription>Pilih nuansa antarmuka AetherFinance yang paling nyaman untuk mata Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tempTheme} onValueChange={(val) => setTempTheme(val as 'light' | 'dark')} className="w-full">
              <TabsList className={controlBoxClass}>
                <TabsTrigger value="light" className={tabTriggerClass}>
                  <Sun size={18} /> {t('light')}
                </TabsTrigger>
                <TabsTrigger value="dark" className={tabTriggerClass}>
                  <Moon size={18} /> {t('dark')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* KARTU BAHASA */}
        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="text-blue-500" size={20} />
              {t('language')}
            </CardTitle>
            <CardDescription>Sesuaikan bahasa sistem untuk analisis dan laporan AI.</CardDescription>
          </CardHeader>
          <CardContent>
             <Tabs value={tempLang} onValueChange={(val) => setTempLang(val as 'id' | 'en')} className="w-full">
              <TabsList className={controlBoxClass}>
                <TabsTrigger value="id" className={tabTriggerClass}>
                  <Flag size={18} /> {t('indonesian')}
                </TabsTrigger>
                <TabsTrigger value="en" className={tabTriggerClass}>
                  <Flag size={18} /> {t('english')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
          
          <CardFooter className="bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 py-5 mt-6 justify-end rounded-b-xl shadow-inner transition-colors">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold px-8 shadow-lg dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all h-11"
            >
              <Save size={18} className="mr-2" />
              {t('save')}
            </Button>
          </CardFooter>
        </Card>

      </main>
    </div>
  );
}