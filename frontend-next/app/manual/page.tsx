'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Calendar, DollarSign, Leaf, Edit3, Check, Loader2 } from 'lucide-react';

export default function ManualExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    category: 'Makanan',
    date: new Date().toISOString().split('T')[0],
    total: 0,
    items: [{ name: 'Pengeluaran Manual', price: 0 }] // Default 1 item
  });

  const handleSaveToDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Update price item default agar sesuai dengan total
      const dataToSubmit = {
        ...formData,
        items: [{ name: formData.items[0].name, price: formData.total }]
      };

      await axios.post("http://127.0.0.1:8001/api/expenses", dataToSubmit);
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan ke database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title="Manual Entry" />
      
      <main className="px-8 mt-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Record an Expense</h1>
          <p className="text-[#94A3B8]">Log a transaction manually without an AI receipt scan.</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#94A3B8] uppercase">Nama / Deskripsi</label>
              <div className="relative">
                <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                <input 
                  type="text" 
                  value={formData.items[0].name}
                  onChange={(e) => setFormData({...formData, items: [{name: e.target.value, price: formData.total}]})}
                  placeholder="Misal: Beli Kopi Starbucks"
                  className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#94A3B8] uppercase">Total Harga (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={16} />
                  <input 
                    type="number" 
                    value={formData.total || ''}
                    onChange={(e) => setFormData({...formData, total: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0F172A]/60 border border-white/10 text-cyan-400 font-bold rounded-[10px] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#94A3B8] uppercase">Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#94A3B8] uppercase">Kategori</label>
              <div className="relative flex items-center">
                <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-3 text-sm appearance-none focus:outline-none focus:border-cyan-400"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={handleSaveToDatabase}
                disabled={loading || formData.total <= 0 || !formData.items[0].name}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] py-4 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                <span>{loading ? "Menyimpan..." : "Save Manual Expense"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}