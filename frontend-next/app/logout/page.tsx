'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      // Perintah ke Supabase untuk menghapus sesi login
      await supabase.auth.signOut();
      
      // Bersihkan juga cache data AI jika ada
      localStorage.removeItem('pendingExpense');
      
      // Arahkan kembali ke halaman Login
      router.push('/login');
    };
    
    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090E17] flex flex-col items-center justify-center text-[#94A3B8]">
      <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
      <p className="text-sm font-semibold tracking-widest uppercase">Signing out securely...</p>
    </div>
  );
}