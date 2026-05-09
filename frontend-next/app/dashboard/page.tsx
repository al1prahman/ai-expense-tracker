'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { Lightbulb, ShoppingBag, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useSettings(); // Panggil fungsi penerjemah

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await axios.get("http://127.0.0.1:8001/api/expenses", {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        setHistory(response.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchCategory = item.category.toLowerCase().includes(query);
    const matchDate = item.date.includes(query);
    const matchItems = item.items?.some((i: any) => i.name.toLowerCase().includes(query));
    return matchCategory || matchDate || matchItems;
  });

  const totalExpense = filteredHistory.reduce((sum, item) => sum + item.total, 0);

  const getChartData = () => {
    const aggregated: Record<string, number> = {};
    filteredHistory.forEach((item) => {
      aggregated[item.category] = (aggregated[item.category] || 0) + item.total;
    });
    return Object.keys(aggregated).map((key) => ({
      name: key,
      value: aggregated[key],
    }));
  };

  const chartData = getChartData();
  const COLORS = ['#06B6D4', '#3B82F6', '#1E3A5F', '#8B5CF6', '#F59E0B'];

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12 relative">
      <Navbar isDashboard={true} showSearch={true} onSearch={setSearchQuery} />
      
      <main className="px-8 mt-4 max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-[#94A3B8] text-sm mb-2">{t('totalExpense')}</p>
            <h2 className="text-4xl font-bold text-cyan-400">Rp {totalExpense.toLocaleString("id-ID")}</h2>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-[#94A3B8] text-sm mb-2">{t('receiptCount')}</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-4xl font-bold">{filteredHistory.length}</h2>
              <span className="text-[#94A3B8] text-xs font-medium">{t('processedByAI')}</span>
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-[#94A3B8] text-sm mb-2">{t('topCategory')}</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold truncate">
                {chartData.length > 0 ? chartData.sort((a,b) => b.value - a.value)[0].name : "-"}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Wealth Insights</h3>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[11px] font-bold uppercase rounded-md border border-cyan-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> LIVE ANALYSIS
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                  <Lightbulb className="text-cyan-400" size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">{t('insightMsg')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col">
            <h3 className="text-sm text-[#94A3B8] font-semibold mb-4">Spending Mix</h3>
            <div className="flex-1 relative min-h-[220px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">{t('noData')}</div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {chartData.map((item, idx) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-[#94A3B8]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">{t('recentTransactions')}</h3>
            <Link href="/reports" className="flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              {t('viewAll')} <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#94A3B8] text-xs uppercase border-b border-white/5">
                <tr>
                  <th className="pb-4 font-medium px-4">{t('date')}</th>
                  <th className="pb-4 font-medium px-4">{t('category')}</th>
                  <th className="pb-4 font-medium px-4 text-center">{t('itemsCount')}</th>
                  <th className="pb-4 font-medium px-4 text-right">{t('total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">{t('noTransactionHistory')}</td>
                  </tr>
                ) : (
                  filteredHistory.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4 text-[#94A3B8]">{item.date}</td>
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><ShoppingBag size={16} className="text-blue-400" /></div>
                        <span className="font-medium text-white px-3 py-1 bg-white/5 text-[11px] uppercase rounded-md">{item.category}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-[#94A3B8]">{item.items?.length || 0}</td>
                      <td className="py-4 px-4 text-right text-cyan-400 font-medium">Rp {item.total.toLocaleString("id-ID")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}