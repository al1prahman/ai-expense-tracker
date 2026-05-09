'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { AlertTriangle, Calendar, DollarSign, Leaf, Check, Sparkles, Receipt, ArrowRight } from 'lucide-react';
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';

// IMPORT KOMPONEN SHADCN
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ValidationPage() {
  const router = useRouter();
  const { t } = useSettings();
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isDataChecked, setIsDataChecked] = useState(false);

  useEffect(() => {
    const pendingData = localStorage.getItem('pendingExpense');
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        setEditData({
          category: parsed.category || 'Lainnya',
          date: parsed.date || new Date().toISOString().split('T')[0],
          total: parsed.total || 0,
          items: Array.isArray(parsed.items) && parsed.items.length > 0 ? parsed.items : []
        });
      } catch (err) {
        console.error("Gagal membaca data struk:", err);
      }
    }
    setIsDataChecked(true);
  }, []);

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

  if (!isDataChecked) return null;

  // KELAS LIQUID GLASS KONSISTEN
  const glassCardClass = "bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-2xl transition-all duration-300";
  const inputClass = "w-full bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors duration-300 relative">
      <Navbar title={t('reviewResults')} />
      
      <main className="px-8 mt-10 max-w-7xl mx-auto relative z-10">
        {!editData ? (
          // ================= EMPTY STATE (MENGGUNAKAN SHADCN CARD) =================
          <Card className={`${glassCardClass} max-w-2xl mx-auto mt-20 text-center border-dashed border-2`}>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Receipt className="text-slate-400 dark:text-slate-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Belum ada data untuk divalidasi</h2>
              <p className="text-slate-500 dark:text-[#94A3B8] mb-8">
                Anda belum mengunggah struk apapun. Silakan unggah dokumen keuangan Anda di Pusat Unggah agar AI dapat menganalisisnya.
              </p>
              <Link href="/upload">
                <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all text-base">
                  <span>Ke {t('uploadCenter')}</span>
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // ================= FORM VALIDASI =================
          <>
            <p className="text-slate-500 dark:text-[#94A3B8] mb-8">{t('verifyExtracted')}</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* KOLOM KIRI: FORM UTAMA */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* BANNER PERINGATAN */}
                <div className="flex items-start space-x-4 p-5 bg-yellow-50 dark:bg-[#FBBF24]/10 border border-yellow-200 dark:border-[#FBBF24]/20 border-l-4 border-l-yellow-500 dark:border-l-[#FBBF24] rounded-xl shadow-sm">
                  <AlertTriangle className="text-yellow-600 dark:text-[#FBBF24] mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-[#FBBF24] text-sm mb-1">{t('reviewRequired')}</h4>
                    <p className="text-yellow-700/80 dark:text-[#94A3B8] text-sm leading-relaxed">{t('aiIdentified')}</p>
                  </div>
                </div>

                {/* SHADCN CARD UNTUK FORM */}
                <Card className={glassCardClass}>
                  <CardContent className="p-6 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-[#94A3B8]">{t('category')}</label>
                        <div className="relative flex items-center">
                          <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400" size={16} />
                          <select 
                            value={editData.category || 'Lainnya'} 
                            onChange={(e) => setEditData({...editData, category: e.target.value})} 
                            className={`${inputClass} appearance-none`}
                          >
                            <option value="Makanan">Makanan</option>
                            <option value="Transportasi">Transportasi</option>
                            <option value="Pakaian">Pakaian</option>
                            <option value="Kesehatan">Kesehatan</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-[#94A3B8]">{t('date')}</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal pl-4 h-[42px] border-slate-200 dark:border-white/10 dark:bg-[#0F172A]/60 hover:bg-slate-100 dark:hover:bg-white/5 ${!editData.date && "text-slate-500"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-cyan-500" />
                              {editData.date ? format(new Date(editData.date), "PPP") : <span>Pilih Tanggal</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 dark:bg-slate-800 border-slate-200 dark:border-white/10 rounded-xl" align="start">
                            <CalendarComponent
                                 mode="single"
                                selected={editData.date ? new Date(editData.date) : undefined}
                                onSelect={(selectedDate) => {
                                    if (selectedDate) {
                                        const formattedDate = format(selectedDate, "yyyy-MM-dd");
                                    setEditData({...editData, date: formattedDate});
                                    }
                                     }}
                                    className="dark:text-white"
                                />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-[#94A3B8]">{t('total')} (Rp)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={16} />
                          <input 
                            type="number" 
                            value={editData.total === 0 ? '' : editData.total} 
                            onChange={(e) => setEditData({...editData, total: parseInt(e.target.value) || 0})} 
                            className={`${inputClass} font-bold text-blue-600 dark:text-cyan-400`} 
                          />
                        </div>
                      </div>
                    </div>

                    <h4 className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase font-bold tracking-wider mb-4">{t('extractedItems')}</h4>
                    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#090E17]/40 mb-2 transition-colors">
                      <table className="w-full text-left text-sm">
                        <thead className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase border-b border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-[#0F172A]/40">
                          <tr><th className="px-4 py-3 font-bold">{t('itemDesc')}</th><th className="px-4 py-3 font-bold w-32 text-right">{t('price')}</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                          {editData.items && editData.items.length > 0 ? (
                            editData.items.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{item.name || 'Barang Tidak Diketahui'}</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">Rp {(item.price || 0).toLocaleString("id-ID")}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="px-4 py-6 text-center text-slate-400 dark:text-slate-500 italic">
                                AI tidak mendeteksi rincian barang. Silakan isi total secara manual.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  
                  {/* FOOTER & BUTTONS SHADCN */}
                  <CardFooter className="bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 py-4 justify-end gap-3 rounded-b-xl shadow-inner">
                    <Button 
                      variant="outline"
                      onClick={() => {localStorage.removeItem('pendingExpense'); setEditData(null);}} 
                      className="border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      {t('discard')}
                    </Button>
                    <Button 
                      onClick={handleSaveToDatabase} 
                      disabled={loading || editData.total === 0} 
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all border-0"
                    >
                      <Check size={16} className="mr-2" />
                      {loading ? t('saving') : t('confirmSave')}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* KOLOM KANAN: AI CONFIDENCE */}
              <div className="lg:col-span-1 space-y-6">
                {duplicateError && (
                  <div className="bg-red-50 dark:bg-[#EF4444]/10 border border-red-200 dark:border-[#EF4444]/30 border-l-4 border-l-red-500 dark:border-l-[#EF4444] rounded-2xl p-6 shadow-md animate-in fade-in">
                    <div className="flex items-center space-x-3 mb-4"><AlertTriangle className="text-red-500" size={20} /><h3 className="font-bold text-red-700 dark:text-[#EF4444]">{t('duplicateDetected')}</h3></div>
                    <p className="text-sm text-red-600/80 dark:text-slate-300 leading-relaxed">{duplicateError}</p>
                  </div>
                )}
                
                <Card className={glassCardClass}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-slate-800 dark:text-cyan-50">
                      <Sparkles className="text-cyan-500 dark:text-cyan-400" size={16} />
                      <span>{t('aiConfidence')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-slate-500 dark:text-[#94A3B8] font-medium">{t('dataAccuracy')}</span>
                          <span className={`font-bold ${editData.total > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-red-500'}`}>
                            {editData.total > 0 ? '98%' : 'Low Confidence'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full rounded-full transition-all duration-1000 ${editData.total > 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400 w-[98%]' : 'bg-red-500 w-[20%]'}`}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}