'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { AlertTriangle, Calendar, DollarSign, Leaf, Check, Sparkles } from 'lucide-react';

export default function ValidationPage() {
  const router = useRouter();
  const { t } = useSettings();
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  useEffect(() => {
    const pendingData = localStorage.getItem('pendingExpense');
    if (pendingData) setEditData(JSON.parse(pendingData));
    else router.push('/upload');
  }, [router]);

  const handleSaveToDatabase = async () => {
    try {
      setLoading(true); setDuplicateError(null);
      const { data: { session } } = await supabase.auth.getSession();
      await axios.post("http://127.0.0.1:8001/api/expenses", editData, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      localStorage.removeItem('pendingExpense');
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) setDuplicateError(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  if (!editData) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors">
      <Navbar title={t('reviewResults')} />
      <main className="px-8 mt-2 max-w-7xl mx-auto">
        <p className="text-slate-500 dark:text-[#94A3B8] mb-8">{t('verifyExtracted')}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start space-x-4 p-5 bg-yellow-50 dark:bg-[#FBBF24]/10 border border-yellow-200 dark:border-[#FBBF24]/20 border-l-4 border-l-yellow-500 dark:border-l-[#FBBF24] rounded-xl">
              <AlertTriangle className="text-yellow-600 dark:text-[#FBBF24] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-[#FBBF24] text-sm mb-1">{t('reviewRequired')}</h4>
                <p className="text-yellow-700/80 dark:text-[#94A3B8] text-sm leading-relaxed">{t('aiIdentified')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md dark:shadow-2xl transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm text-slate-500 dark:text-[#94A3B8]">{t('category')}</label>
                  <div className="relative flex items-center">
                    <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400" size={16} />
                    <select value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-cyan-500 transition-colors">
                      <option value="Makanan">Makanan</option><option value="Transportasi">Transportasi</option><option value="Pakaian">Pakaian</option><option value="Kesehatan">Kesehatan</option><option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500 dark:text-[#94A3B8]">{t('date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={16} />
                    <input type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-500 dark:text-[#94A3B8]">{t('total')} (Rp)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={16} />
                    <input type="number" value={editData.total} onChange={(e) => setEditData({...editData, total: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-blue-600 dark:text-cyan-400 font-bold rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                </div>
              </div>

              <h4 className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase font-bold tracking-wider mb-4">{t('extractedItems')}</h4>
              <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#090E17]/40 mb-8 transition-colors">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#0F172A]/40">
                    <tr><th className="px-4 py-3 font-medium">{t('itemDesc')}</th><th className="px-4 py-3 font-medium w-32 text-right">{t('price')}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {editData.items && editData.items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 text-right text-blue-600 dark:text-cyan-400">Rp {item.price.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end space-x-4 border-t border-slate-200 dark:border-white/10 pt-6">
                <button onClick={() => {localStorage.removeItem('pendingExpense'); router.push('/upload');}} className="px-6 py-2.5 bg-transparent border border-slate-300 dark:border-white/15 text-slate-600 dark:text-slate-300 rounded-[10px] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">
                  {t('discard')}
                </button>
                <button onClick={handleSaveToDatabase} disabled={loading} className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-[10px] shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm">
                  <Check size={16} /><span>{loading ? t('saving') : t('confirmSave')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {duplicateError && (
              <div className="bg-red-50 dark:bg-[#EF4444]/10 border border-red-200 dark:border-[#EF4444]/30 border-l-4 border-l-red-500 dark:border-l-[#EF4444] rounded-2xl p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-4"><AlertTriangle className="text-red-500" size={20} /><h3 className="font-bold text-red-700 dark:text-[#EF4444]">{t('duplicateDetected')}</h3></div>
                <p className="text-sm text-red-600/80 dark:text-slate-300 leading-relaxed">{duplicateError}</p>
              </div>
            )}
            <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md transition-colors">
              <div className="flex items-center space-x-2 mb-6"><Sparkles className="text-cyan-500 dark:text-cyan-400" size={16} /><h4 className="text-sm font-semibold text-slate-800 dark:text-cyan-50">{t('aiConfidence')}</h4></div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-500 dark:text-[#94A3B8]">{t('dataAccuracy')}</span><span className="text-cyan-600 dark:text-cyan-400 font-bold">98%</span></div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[98%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}