'use client';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';

interface NavbarProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  isDashboard?: boolean;
}

export default function Navbar({ title, showSearch = false, onSearch, isDashboard = false }: NavbarProps) {
  const { t } = useSettings();
  const [greetingKey, setGreetingKey] = useState("goodMorning");
  const [userName, setUserName] = useState("User"); 

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreetingKey("goodMorning");
    else if (hour >= 12 && hour < 15) setGreetingKey("goodAfternoon");
    else if (hour >= 15 && hour < 18) setGreetingKey("goodEvening");
    else setGreetingKey("goodNight");

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const nameFromEmail = user.email.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        setUserName(formattedName);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="h-20 px-8 flex items-center justify-between z-40 border-b border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-[#090E17]/80 backdrop-blur-md sticky top-0 transition-colors">
      <h2 className="text-slate-800 dark:text-[#F8FAFC] text-2xl font-bold">
        {isDashboard ? `${t(greetingKey)}, ${userName}! ☀️` : title}
      </h2>
      
      <div className="flex items-center space-x-6">
        {showSearch && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={16} />
            <input 
              type="text" 
              onChange={(e) => onSearch && onSearch(e.target.value)}
              placeholder={t('searchTransactions')} 
              className="w-full bg-white dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#94A3B8] rounded-[10px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-slate-500 dark:text-[#94A3B8]">
          <button className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"><Bell size={20} /></button>
          <button className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"><HelpCircle size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 flex items-center justify-center text-white dark:text-[#090E17] font-extrabold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}