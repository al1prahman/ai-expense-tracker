'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Cek apakah ini halaman login
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex min-h-screen bg-[#090E17] text-white">
      {/* Sidebar HANYA muncul jika BUKAN di halaman login */}
      {!isLoginPage && <Sidebar />}
      
      {/* Area konten: margin kiri hilang jika di halaman login */}
      <div className={`flex-1 ${!isLoginPage ? 'ml-[220px]' : ''} min-h-screen relative`}>
        {children}
      </div>
    </div>
  );
}