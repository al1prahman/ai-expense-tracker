'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { Lightbulb, ShoppingBag, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// 1. IMPORT KOMPONEN CARD SHADCN
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, userName } = useSettings();

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

  // Utility untuk class Liquid Glass Card agar tidak menulis ulang
  const glassClass = "bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl transition-all duration-300";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 relative transition-colors duration-300">
      <Navbar isDashboard={true} showSearch={true} onSearch={setSearchQuery} />
      
      <main className="px-8 mt-4 max-w-[1400px] mx-auto space-y-6">
        
        {/* 2. TIGA KARTU STATISTIK UTAMA (MENGGUNAKAN SHADCN CARD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={glassClass}>
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500 dark:text-[#94A3B8] font-medium">{t('totalExpense')}</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-600 dark:text-cyan-400">
                Rp {totalExpense.toLocaleString("id-ID")}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className={glassClass}>
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500 dark:text-[#94A3B8] font-medium">{t('receiptCount')}</CardDescription>
              <div className="flex items-baseline space-x-2">
                <CardTitle className="text-4xl font-bold text-slate-800 dark:text-white">{filteredHistory.length}</CardTitle>
                <span className="text-slate-500 dark:text-[#94A3B8] text-xs font-medium">{t('processedByAI')}</span>
              </div>
            </CardHeader>
          </Card>

          <Card className={glassClass}>
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500 dark:text-[#94A3B8] font-medium">{t('topCategory')}</CardDescription>
              <CardTitle className="text-3xl font-bold truncate text-slate-800 dark:text-white">
                {chartData.length > 0 ? chartData.sort((a,b) => b.value - a.value)[0].name : "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 3. INSIGHTS DAN CHART (MENGGUNAKAN SHADCN CARD) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className={`${glassClass} lg:col-span-3 flex flex-col`}>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">{t('wealthInsights')}</CardTitle>
                <CardDescription>AI Personal Assistant</CardDescription>
              </div>
              <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase rounded-md border border-cyan-200 dark:border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" /> {t('liveAnalysis')}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4 p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg shrink-0">
                  <Lightbulb className="text-blue-600 dark:text-cyan-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{t('insightMsg')}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${glassClass} lg:col-span-2 flex flex-col`}>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-wider">
                {t('spendingMix')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 relative min-h-[200px] mt-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#F8FAFC', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic">{t('noData')}</div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pb-2">
                {chartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[10px] font-medium text-slate-500 dark:text-[#94A3B8]">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. TABEL TRANSAKSI TERAKHIR (MENGGUNAKAN SHADCN CARD) */}
        <Card className={glassClass}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">{t('recentTransactions')}</CardTitle>
              <CardDescription>Review your latest financial activity</CardDescription>
            </div>
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 hover:bg-blue-50 dark:hover:bg-cyan-500/10 font-bold transition-all">
                {t('viewAll')} <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase bg-slate-50/50 dark:bg-[#0F172A]/40 border-b border-slate-200 dark:border-white/5">
                  <tr>
                    <th className="py-4 px-4 font-bold tracking-wider">{t('date')}</th>
                    <th className="py-4 px-4 font-bold tracking-wider">{t('category')}</th>
                    <th className="py-4 px-4 font-bold tracking-wider text-center">{t('itemsCount')}</th>
                    <th className="py-4 px-4 font-bold tracking-wider text-right">{t('total')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-slate-500 italic">{t('noTransactionHistory')}</td>
                    </tr>
                  ) : (
                    filteredHistory.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4 text-slate-600 dark:text-[#94A3B8] font-medium">{item.date}</td>
                        <td className="py-4 px-4 flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg shadow-sm">
                            <ShoppingBag size={16} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-white px-3 py-1 bg-slate-100 dark:bg-white/5 text-[10px] uppercase rounded-md border border-slate-200 dark:border-white/5 transition-colors">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 dark:text-[#94A3B8] font-medium">{item.items?.length || 0}</td>
                        <td className="py-4 px-4 text-right text-blue-600 dark:text-cyan-400 font-black tracking-wide text-base">
                          Rp {item.total.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}