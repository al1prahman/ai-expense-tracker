'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { AlertTriangle, Calendar, DollarSign, Leaf, Check, Sparkles } from 'lucide-react';

export default function ValidationPage() {
  const router = useRouter();
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data yang dilempar dari halaman Upload
    const pendingData = localStorage.getItem('pendingExpense');
    if (pendingData) {
      setEditData(JSON.parse(pendingData));
    } else {
      // Jika tidak ada data, kembalikan ke halaman upload
      router.push('/upload');
    }
  }, [router]);

  const handleSaveToDatabase = async () => {
    try {
      setLoading(true);
      setDuplicateError(null);
      
      await axios.post("http://127.0.0.1:8001/api/expenses", editData);
      
      // Bersihkan data dan ke dashboard
      localStorage.removeItem('pendingExpense');
      router.push('/dashboard');
      
    } catch (err: any) {
      if (err.response?.status === 409) {
        setDuplicateError(err.response.data.error);
      } else {
        alert("Gagal menyimpan ke database.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    localStorage.removeItem('pendingExpense');
    router.push('/upload');
  };

  if (!editData) return null; // Mencegah kedip sebelum redirect

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title="Review AI Results" />
      
      <main className="px-8 mt-2 max-w-7xl mx-auto">
        <p className="text-[#94A3B8] mb-8">Verify extracted data from your recent document upload.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Table */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="flex items-start space-x-4 p-5 bg-[#FBBF24]/10 border border-[#FBBF24]/20 border-l-4 border-l-[#FBBF24] rounded-xl">
              <AlertTriangle className="text-[#FBBF24] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[#FBBF24] text-sm mb-1">Review Required</h4>
                <p className="text-[#94A3B8] text-sm leading-relaxed">The AI identified high-confidence data, but manual verification is recommended before saving.</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Kategori</label>
                  <div className="relative flex items-center">
                    <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                    <select 
                      value={editData.category}
                      onChange={(e) => setEditData({...editData, category: e.target.value})}
                      className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
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
                  <label className="text-sm text-[#94A3B8]">Tanggal</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                    <input 
                      type="date" 
                      value={editData.date}
                      onChange={(e) => setEditData({...editData, date: e.target.value})}
                      className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Total (Rp)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                    <input 
                      type="number" 
                      value={editData.total}
                      onChange={(e) => setEditData({...editData, total: parseInt(e.target.value) || 0})}
                      className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm font-bold text-cyan-400 focus:outline-none focus:border-cyan-400" 
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-[#94A3B8] text-xs uppercase font-bold tracking-wider mb-4">Extracted Line Items</h4>
              <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#090E17]/40 mb-8">
                <table className="w-full text-left text-sm">
                  <thead className="text-[#94A3B8] text-xs uppercase border-b border-white/5 bg-[#0F172A]/40">
                    <tr>
                      <th className="px-4 py-3 font-medium">Deskripsi Barang</th>
                      <th className="px-4 py-3 font-medium w-32 text-right">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {editData.items && editData.items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 text-right text-cyan-400">Rp {item.price.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end space-x-4 border-t border-white/10 pt-6">
                <button onClick={handleDiscard} className="px-6 py-2.5 bg-transparent border border-white/15 text-slate-300 rounded-[10px] hover:bg-white/5 transition-colors text-sm font-medium">
                  Discard
                </button>
                <button 
                  onClick={handleSaveToDatabase}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
                >
                  <Check size={16} />
                  <span>{loading ? "Menyimpan..." : "Confirm and Save"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Error Alerts */}
          <div className="lg:col-span-1 space-y-6">
            
            {duplicateError && (
              <div className="bg-[#EF4444]/10 backdrop-blur-xl border border-[#EF4444]/30 border-l-4 border-l-[#EF4444] rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right-4">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="text-[#EF4444]" size={20} />
                  <h3 className="font-bold text-[#EF4444]">Duplicate Detected</h3>
                </div>
                <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                  {duplicateError}
                </p>
              </div>
            )}

            <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="text-cyan-400" size={16} />
                <h4 className="text-sm font-semibold text-cyan-50">AI Extraction Confidence</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#94A3B8]">Data Accuracy</span>
                    <span className="text-cyan-400 font-bold">98%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
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