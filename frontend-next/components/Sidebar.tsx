'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext'; // Import hook settings
import { 
  LayoutDashboard, 
  UploadCloud, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useSettings(); // Ambil fungsi penerjemah

  // Data menu sekarang menggunakan t('...') agar bahasanya dinamis
  const menuItems = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { name: t('upload'), icon: UploadCloud, path: '/upload' },
    { name: t('validation'), icon: CheckSquare, path: '/validation' },
    { name: t('reports'), icon: BarChart3, path: '/reports' },
  ];

  return (
    <aside className="w-[220px] h-screen fixed left-0 top-0 border-r border-white/5 bg-[#090E17]/95 backdrop-blur-xl flex flex-col z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <div className="w-4 h-4 bg-[#090E17] rounded-sm" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">AetherFinance</h1>
            <p className="text-cyan-400 text-[10px] font-semibold tracking-widest uppercase">AI Wealth Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500/10 to-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]' 
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}>
                <Icon size={18} className={`${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2 mb-4">
        <Link href="/manual">
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] py-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity">
            <Plus size={18} />
            <span className="text-sm">{t('newExpense')}</span>
          </button>
        </Link>
      </div>

      {/* System Menu */}
      <div className="px-4 pb-6 space-y-1">
        <Link href="/settings">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group cursor-pointer ${
            pathname === '/settings' ? 'text-cyan-400 bg-white/5' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}>
            <Settings size={18} className={pathname === '/settings' ? 'text-cyan-400' : 'text-slate-500'} />
            <span className="text-sm font-medium">{t('settings')}</span>
          </div>
        </Link>
        <Link href="/logout">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 transition-all group cursor-pointer">
            <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium">{t('logout')}</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}