'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // Mengecek apakah ada sesi login aktif di browser
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Jika sudah login, langsung ke Dashboard
        router.push('/dashboard');
      } else {
        // Jika belum login, tendang ke halaman Login
        router.push('/login');
      }
    };
    
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090E17] flex items-center justify-center text-[#94A3B8] font-sans">
      {/* Tampilan layar memuat sementara (loading screen) yang elegan */}
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div className="w-6 h-6 bg-[#090E17] rounded-sm" />
        </div>
        <p className="text-sm font-semibold tracking-widest uppercase">Memuat AetherFinance...</p>
      </div>
    </div>
  );
}