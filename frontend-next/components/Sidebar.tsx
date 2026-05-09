'use client';
import { LayoutDashboard, CloudUpload, CheckSquare, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Upload', icon: CloudUpload, path: '/upload' },
    { name: 'Validation', icon: CheckSquare, path: '/validation' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#0D1321] flex flex-col border-r border-white/5 z-50">
      {/* Logo Area */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
          <div className="w-4 h-4 bg-[#090E17] rounded-sm" />
        </div>
        <div>
          <h1 className="text-[#F8FAFC] font-bold text-lg leading-none">AetherFinance</h1>
          <p className="text-[#94A3B8] text-xs mt-1">AI Wealth Manager</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-500/10 text-cyan-400 border-l-2 border-cyan-400' 
                  : 'text-[#94A3B8] hover:bg-slate-800/40 hover:text-[#F8FAFC]'
              }`}>
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2 mb-4">
        <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] py-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity">
          <Plus size={18} />
          <span className="text-sm">New Expense</span>
        </button>
      </div>

      <div className="px-3 pb-6 space-y-1 border-t border-white/5 pt-4">
        <Link href="/settings">
          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-slate-800/40 hover:text-[#F8FAFC] transition-all">
            <Settings size={18} />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </Link>
        <Link href="/logout">
          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-slate-800/40 hover:text-[#F8FAFC] transition-all">
            <LogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}