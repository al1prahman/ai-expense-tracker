'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Proses Sign In
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        // Proses Sign Up
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registrasi berhasil! Silakan cek email Anda untuk verifikasi (jika diwajibkan), atau langsung Login.');
        setIsLogin(true); // Kembali ke tab login
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Masukkan email Anda terlebih dahulu untuk mereset password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard`,
      });
      if (error) throw error;
      setMessage('Tautan reset password telah dikirim ke email Anda.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Efek Latar Belakang */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div className="w-6 h-6 bg-[#090E17] rounded-sm" />
          </div>
          <h1 className="text-2xl font-bold mb-2">AetherFinance</h1>
          <p className="text-[#94A3B8] text-sm">
            {isLogin ? 'Sign in to your wealth manager' : 'Create your secure account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3">
            <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={18} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start space-x-3">
            <CheckCircle2 className="text-green-400 mt-0.5 shrink-0" size={18} />
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" 
                placeholder="alif@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Password</label>
              {isLogin && (
                <button type="button" onClick={handleResetPassword} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl py-3.5 mt-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all"
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-white/10 w-full" />
          <span className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider">OR</span>
          <div className="h-px bg-white/10 w-full" />
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="w-full mt-6 flex items-center justify-center space-x-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl py-3 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-[#94A3B8]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 font-semibold hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}