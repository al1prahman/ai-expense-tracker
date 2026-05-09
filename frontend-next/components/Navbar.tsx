import { Bell, HelpCircle, Search } from 'lucide-react';

export default function Navbar({ title, showSearch = false }: { title: string, showSearch?: boolean }) {
  return (
    <header className="h-20 px-8 flex items-center justify-between z-40">
      <h2 className="text-[#F8FAFC] text-2xl font-bold">{title}</h2>
      
      <div className="flex items-center space-x-6">
        {showSearch && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-[#0F172A]/60 border border-white/10 text-white placeholder-[#94A3B8] rounded-[10px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-[#94A3B8]">
          <button className="hover:text-cyan-400 transition-colors"><Bell size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><HelpCircle size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 overflow-hidden">
            {/* Avatar placeholder */}
            <img src="/api/placeholder/32/32" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}