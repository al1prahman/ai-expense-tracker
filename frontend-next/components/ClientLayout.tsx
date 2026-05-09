'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    // Tambahkan bg-slate-50 dark:bg-[#090E17] di sini
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-white transition-colors duration-300">
      {!isLoginPage && <Sidebar />}
      
      <div className={`flex-1 ${!isLoginPage ? 'ml-[220px]' : ''} min-h-screen relative`}>
        {children}
      </div>
    </div>
  );
}