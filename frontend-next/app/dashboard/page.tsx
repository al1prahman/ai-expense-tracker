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
  const { t } = useSettings();

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 relative transition-colors duration-300">
      <Navbar isDashboard={true} showSearch={true} onSearch={setSearchQuery} />
      
      <main className="px-8 mt-4 max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl transition-colors">
            <p className="text-slate-500 dark:text-[#94A3B8] text-sm mb-2">{t('totalExpense')}</p>
            <h2 className="text-4xl font-bold text-blue-600 dark:text-cyan-400">Rp {totalExpense.toLocaleString("id-ID")}</h2>
          </div>
          <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl transition-colors">
            <p className="text-slate-500 dark:text-[#94A3B8] text-sm mb-2">{t('receiptCount')}</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-4xl font-bold text-slate-800 dark:text-white">{filteredHistory.length}</h2>
              <span className="text-slate-500 dark:text-[#94A3B8] text-xs font-medium">{t('processedByAI')}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl transition-colors">
            <p className="text-slate-500 dark:text-[#94A3B8] text-sm mb-2">{t('topCategory')}</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold truncate text-slate-800 dark:text-white">
                {chartData.length > 0 ? chartData.sort((a,b) => b.value - a.value)[0].name : "-"}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t('wealthInsights')}</h3>
                <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold uppercase rounded-md border border-cyan-200 dark:border-cyan-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" /> {t('liveAnalysis')}
            </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg shrink-0">
                  <Lightbulb className="text-blue-600 dark:text-cyan-400" size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{t('insightMsg')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl flex flex-col transition-colors">
            <h3 className="text-sm text-slate-500 dark:text-[#94A3B8] font-semibold mb-4">{t('spendingMix')}</h3>
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
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">{t('noData')}</div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {chartData.map((item, idx) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-slate-500 dark:text-[#94A3B8]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-2xl transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t('recentTransactions')}</h3>
            <Link href="/reports" className="flex items-center text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-500 dark:hover:text-cyan-300 transition-colors">
              {t('viewAll')} <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase bg-slate-50 dark:bg-[#0F172A]/40 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="py-4 px-4 font-medium">{t('date')}</th>
                  <th className="py-4 px-4 font-medium">{t('category')}</th>
                  <th className="py-4 px-4 font-medium text-center">{t('itemsCount')}</th>
                  <th className="py-4 px-4 font-medium text-right">{t('total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 dark:text-slate-500">{t('noTransactionHistory')}</td>
                  </tr>
                ) : (
                  filteredHistory.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4 text-slate-600 dark:text-[#94A3B8]">{item.date}</td>
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg"><ShoppingBag size={16} className="text-blue-600 dark:text-blue-400" /></div>
                        <span className="font-medium text-slate-700 dark:text-white px-3 py-1 bg-slate-100 dark:bg-white/5 text-[11px] uppercase rounded-md">{item.category}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600 dark:text-[#94A3B8]">{item.items?.length || 0}</td>
                      <td className="py-4 px-4 text-right text-blue-600 dark:text-cyan-400 font-bold">Rp {item.total.toLocaleString("id-ID")}</td>
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