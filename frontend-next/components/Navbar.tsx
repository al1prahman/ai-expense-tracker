'use client';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  isDashboard?: boolean;
}

export default function Navbar({ title, showSearch = false, onSearch, isDashboard = false }: NavbarProps) {
  const [greeting, setGreeting] = useState("Hello");
  const [userName, setUserName] = useState("User"); 

  useEffect(() => {
    // 1. Atur sapaan berdasarkan waktu lokal user
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 15) setGreeting("Good afternoon");
    else if (hour >= 15 && hour < 18) setGreeting("Good evening");
    else setGreeting("Good night");

    // 2. Ambil data user yang sedang login dari Supabase
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        // Potong teks sebelum logo '@' pada email
        const nameFromEmail = user.email.split('@')[0];
        // Jadikan huruf pertamanya kapital
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        setUserName(formattedName);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <header className="h-20 px-8 flex items-center justify-between z-40 border-b border-white/5 bg-[#090E17]/80 backdrop-blur-md sticky top-0">
      <h2 className="text-[#F8FAFC] text-2xl font-bold">
        {isDashboard ? `${greeting}, ${userName}! ☀️` : title}
      </h2>
      
      <div className="flex items-center space-x-6">
        {showSearch && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input 
              type="text" 
              onChange={(e) => onSearch && onSearch(e.target.value)}
              placeholder="Search transactions..." 
              className="w-full bg-[#0F172A]/60 border border-white/10 text-white placeholder-[#94A3B8] rounded-[10px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-[#94A3B8]">
          <button className="hover:text-cyan-400 transition-colors"><Bell size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><HelpCircle size={20} /></button>
          
          {/* Avatar dinamis menggunakan inisial nama */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[#090E17] font-extrabold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}