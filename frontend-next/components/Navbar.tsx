'use client';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  isDashboard?: boolean;
}

export default function Navbar({ title, showSearch = false, onSearch, isDashboard = false }: NavbarProps) {
  const [greeting, setGreeting] = useState("Hello");
  // Karena belum ada sistem Login, kita pakai nama aslimu dulu sebagai contoh
  const userName = "Alif"; 

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 15) setGreeting("Good afternoon");
    else if (hour >= 15 && hour < 18) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  return (
    <header className="h-20 px-8 flex items-center justify-between z-40">
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
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 overflow-hidden flex items-center justify-center text-white font-bold">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}