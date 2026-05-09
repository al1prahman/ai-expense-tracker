'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { Calendar, Tag, ChevronDown, ChevronUp, Receipt, ShoppingBag } from 'lucide-react';

export default function ReportsPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { t } = useSettings(); // Panggil fungsi penerjemah

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'Semua'
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await axios.get("http://127.0.0.1:8001/api/expenses", {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        setExpenses(response.data);
        setFilteredExpenses(response.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    let result = expenses;
    if (filters.category !== 'Semua') result = result.filter(item => item.category === filters.category);
    if (filters.startDate) result = result.filter(item => new Date(item.date) >= new Date(filters.startDate));
    if (filters.endDate) result = result.filter(item => new Date(item.date) <= new Date(filters.endDate));
    setFilteredExpenses(result);
  }, [filters, expenses]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title={t('reports')} />
      <main className="px-8 mt-8 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('detailedReports')}</h1>
          <p className="text-[#94A3B8]">{t('filterReview')}</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase flex items-center gap-2">
              <Calendar size={14} /> {t('startDate')}
            </label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400" 
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase flex items-center gap-2">
              <Calendar size={14} /> {t('endDate')}
            </label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400" 
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase flex items-center gap-2">
              <Tag size={14} /> {t('category')}
            </label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-cyan-400"
            >
              <option value="Semua">{t('allCategories')}</option>
              <option value="Makanan">Makanan</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Pakaian">Pakaian</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <button 
            onClick={() => setFilters({startDate: '', endDate: '', category: 'Semua'})}
            className="px-6 py-2.5 bg-transparent border border-white/15 text-slate-300 rounded-[10px] hover:bg-white/5 transition-colors text-sm font-medium h-[42px]"
          >
            {t('reset')}
          </button>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Receipt size={20} className="text-cyan-400" />
              {t('transactionHistory')}
            </h3>
            <span className="text-sm text-[#94A3B8] bg-white/5 px-3 py-1 rounded-full">
              {filteredExpenses.length} {t('recordsFound')}
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-[#94A3B8] animate-pulse">{t('loadingReports')}</div>
            ) : filteredExpenses.length === 0 ? (
              <div className="p-12 text-center text-[#94A3B8]">{t('noTransactionFilter')}</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-[#94A3B8] text-xs uppercase bg-[#0F172A]/40 border-b border-white/5">
                  <tr>
                    <th className="py-4 px-6 font-medium">{t('date')}</th>
                    <th className="py-4 px-6 font-medium">{t('category')}</th>
                    <th className="py-4 px-6 font-medium text-center">{t('itemsCount')}</th>
                    <th className="py-4 px-6 font-medium text-right">{t('total')} (Rp)</th>
                    <th className="py-4 px-6 font-medium text-center">{t('detail')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredExpenses.map((expense) => (
                    <React.Fragment key={expense.id}>
                      <tr 
                        onClick={() => toggleExpand(expense.id)}
                        className={`hover:bg-white/5 transition-colors cursor-pointer group ${expandedId === expense.id ? 'bg-white/5' : ''}`}
                      >
                        <td className="py-4 px-6 text-[#94A3B8]">{expense.date}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase rounded-md border border-blue-500/10">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-[#94A3B8]">{expense.items?.length || 0}</td>
                        <td className="py-4 px-6 text-right font-bold text-cyan-400">Rp {expense.total.toLocaleString("id-ID")}</td>
                        <td className="py-4 px-6 text-center text-[#94A3B8]">
                          {expandedId === expense.id ? <ChevronUp size={20} className="mx-auto" /> : <ChevronDown size={20} className="mx-auto" />}
                        </td>
                      </tr>
                      {expandedId === expense.id && (
                        <tr className="bg-[#050A10]/50 shadow-inner">
                          <td colSpan={5} className="py-4 px-8">
                            <div className="flex items-start gap-4">
                              <ShoppingBag className="text-slate-500 mt-1" size={20} />
                              <div className="w-full">
                                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">{t('itemDetails')}</h4>
                                <ul className="space-y-2">
                                  {expense.items && expense.items.map((item: any, idx: number) => (
                                    <li key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                                      <span className="text-slate-200">{item.name}</span>
                                      <span className="font-medium text-cyan-300">Rp {item.price.toLocaleString("id-ID")}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}