'use client';
import { Bell, HelpCircle, Search, User, LogOut, Settings, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import Link from 'next/link';

export default function Navbar({ title, showSearch = false, onSearch, isDashboard = false }: any) {
  const { t } = useSettings();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [greetingKey, setGreetingKey] = useState("goodMorning");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Menggunakan userName dari Context agar sinkron dengan sapaan
  const { userName, setUserName }: any = useSettings(); 
  const [tempName, setTempName] = useState(userName);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreetingKey("goodMorning");
    else if (hour >= 12 && hour < 15) setGreetingKey("goodAfternoon");
    else if (hour >= 15 && hour < 18) setGreetingKey("goodEvening");
    else setGreetingKey("goodNight");

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        if (!localStorage.getItem('user_profile_name')) {
           const initialName = user.email?.split('@')[0] || "User";
           setUserName(initialName.charAt(0).toUpperCase() + initialName.slice(1));
        }
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
              className="w-full bg-white dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-[10px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4 relative">
          <button className="text-slate-500 dark:text-[#94A3B8] hover:text-cyan-600 transition-colors"><Bell size={20} /></button>
          
          {/* AVATAR BUTTON */}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 flex items-center justify-center text-white dark:text-[#090E17] font-extrabold shadow-lg hover:scale-105 transition-transform"
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {/* PROFILE DROPDOWN */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="flex flex-col items-center pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3 text-2xl font-black text-cyan-500">
                  {userName.charAt(0).toUpperCase()}
                </div>
                
                {isEditing ? (
                  <div className="flex items-center space-x-2 w-full px-2">
                    <input 
                      type="text" 
                      value={tempName} 
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-slate-50 dark:bg-black/20 border border-cyan-500 rounded-lg px-3 py-1 text-sm w-full outline-none"
                      autoFocus
                    />
                    <button 
                      onClick={() => {setUserName(tempName); setIsEditing(false);}}
                      className="p-1.5 bg-green-500 text-white rounded-lg"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 cursor-pointer group" onClick={() => {setTempName(userName); setIsEditing(true);}}>
                    {userName} <User size={12} className="text-slate-400 group-hover:text-cyan-500" />
                  </h3>
                )}
                <p className="text-xs text-slate-400 mt-1">{email}</p>
              </div>

              <div className="py-2 space-y-1">
                <Link href="/settings" onClick={() => setIsProfileOpen(false)}>
                  <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-sm text-slate-600 dark:text-slate-300 transition-colors">
                    <Settings size={16} /> <span>{t('settings')}</span>
                  </div>
                </Link>
                <Link href="/logout">
                  <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-sm text-red-500 transition-colors">
                    <LogOut size={16} /> <span>{t('logout')}</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}