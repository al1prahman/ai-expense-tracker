'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { PenTool, DollarSign, Check, Loader2, Utensils, Car, Shirt, HeartPulse, Leaf, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";

// IMPORT KOMPONEN SHADCN
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";

export default function ManualEntryPage() {
  const router = useRouter();
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  
  // STATE FORM
  const [name, setName] = useState('');
  const [total, setTotal] = useState<number | ''>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState('Lainnya');

  const categories = ["Makanan", "Transportasi", "Pakaian", "Kesehatan", "Lainnya"];

  // FUNGSI IKON DINAMIS
  const getCategoryIcon = (cat: string, className: string) => {
    switch (cat) {
      case "Makanan": return <Utensils className={className} size={16} />;
      case "Transportasi": return <Car className={className} size={16} />;
      case "Pakaian": return <Shirt className={className} size={16} />;
      case "Kesehatan": return <HeartPulse className={className} size={16} />;
      default: return <Leaf className={className} size={16} />;
    }
  };

  const handleSave = async () => {
    if (!name || !total || !date) return alert("Harap isi semua field utama.");
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const expenseData = {
        category,
        date: format(date, "yyyy-MM-dd"),
        total: Number(total),
        items: [{ name, price: Number(total) }] // Simpan nama sebagai item tunggal
      };

      await axios.post("http://127.0.0.1:8001/api/expenses", expenseData, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      router.push('/dashboard');
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const glassCardClass = "bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-2xl transition-all duration-300";
  const inputClass = "w-full bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors relative">
      <Navbar title="Manual Entry" />
      
      <main className="max-w-2xl mx-auto mt-12 px-6 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Record an Expense</h1>
          <p className="text-slate-500 dark:text-[#94A3B8]">Log a transaction manually without an AI receipt scan.</p>
        </div>

        <Card className={glassCardClass}>
          <CardContent className="p-8 space-y-6 pt-8">
            
            {/* NAMA / DESKRIPSI */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Nama / Deskripsi</label>
              <div className="relative">
                <PenTool className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={16} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Misal: Beli Kopi Starbucks"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TOTAL HARGA */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Total Harga (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={16} />
                  <input 
                    type="number" 
                    value={total} 
                    onChange={(e) => setTotal(e.target.value === '' ? '' : Number(e.target.value))} 
                    placeholder="0"
                    className={`${inputClass} font-bold text-blue-600 dark:text-cyan-400`}
                  />
                </div>
              </div>

              {/* TANGGAL (SHADCN DATE PICKER) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Tanggal</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal pl-4 h-[42px] rounded-lg border-slate-200 dark:border-white/10 dark:bg-[#0F172A]/60 hover:bg-slate-100 dark:hover:bg-white/5 ${!date && "text-slate-500"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-cyan-500" />
                      {date ? format(date, "PPP") : <span>Pilih Tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-slate-800 border-slate-200 dark:border-white/10 rounded-xl" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="dark:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* KATEGORI (SHADCN COMBOBOX DENGAN IKON DINAMIS) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Kategori</label>
              <Combobox 
                items={categories} 
                value={category} 
                onValueChange={(val) => setCategory(val || "Lainnya")}
              >
                <ComboboxTrigger 
                  render={
                    <Button 
                      variant="outline" 
                      className="w-full justify-between font-normal h-[42px] rounded-lg border-slate-200 dark:border-white/10 dark:bg-[#0F172A]/60 hover:bg-slate-100 dark:hover:bg-white/5 pl-10 relative"
                    >
                      {/* IKON DINAMIS DIPANGGIL DI SINI */}
                      {getCategoryIcon(category, "absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500")}
                      <ComboboxValue />
                    </Button>
                  } 
                />
                <ComboboxContent className="dark:bg-slate-800 border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50">
                  <ComboboxInput showTrigger={false} placeholder="Cari kategori..." className="border-b dark:border-white/10" />
                  <ComboboxEmpty className="py-6 text-center text-sm text-slate-500">Kategori tidak ditemukan.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-white/10 flex items-center gap-2">
                        {getCategoryIcon(item, "text-slate-500")}
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

          </CardContent>
          <CardFooter className="bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 py-6 rounded-b-xl">
            <Button 
              onClick={handleSave} 
              disabled={loading || !name || !total} 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all border-0 h-12 text-base rounded-xl"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Check size={18} className="mr-2" />}
              Save Manual Expense
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}