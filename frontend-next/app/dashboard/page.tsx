'use client';
import Navbar from '@/components/Navbar';
import { Lightbulb, AlertCircle, Plane, Utensils, Cloud, Apple, ChevronRight, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


const donutData = [
  { name: 'Lifestyle', value: 45, color: '#06B6D4' }, // Cyan
  { name: 'Operations', value: 30, color: '#3B82F6' }, // Blue
  { name: 'Travel', value: 25, color: '#1E3A5F' },     // Dark Blue
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12 relative">
      <Navbar title="Overview" showSearch={true} />
      
      <main className="px-8 mt-4 max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-[#94A3B8] text-sm mb-2">Total This Month</p>
            <h2 className="text-4xl font-bold text-cyan-400">$12,845.00</h2>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-[#94A3B8] text-sm mb-2">Receipts Count</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-4xl font-bold">142</h2>
              <span className="text-[#94A3B8] text-xs font-medium">Processed by AI</span>
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <p className="text-[#94A3B8] text-sm mb-2">Top Category</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-4xl font-bold">Lifestyle</h2>
              <span className="text-[#94A3B8] text-xs font-medium">Luxury</span>
            </div>
          </div>
        </div>

        {/* Second Row: Insights & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Wealth Insights (60%) */}
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
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">You could save <span className="text-cyan-400 font-bold">$420</span> by consolidating recurring subscriptions.</p>
                  <a href="#" className="text-cyan-400 text-xs font-semibold hover:underline">Review Subscriptions</a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
                  <AlertCircle className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">Detected unusual activity in <strong className="text-white">Business Travel</strong> category. Verify receipts.</p>
                  <a href="#" className="text-cyan-400 text-xs font-semibold hover:underline">Verify Now</a>
                </div>
              </div>
            </div>
          </div>

          {/* Spending Mix (40%) */}
          <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col">
            <h3 className="text-sm text-[#94A3B8] font-semibold mb-4">Spending Mix</h3>
            <div className="flex-1 relative min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">$12.8k</span>
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">TOTAL</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              {donutData.map(item => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#94A3B8]">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <a href="#" className="flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              View All <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#94A3B8] text-xs uppercase border-b border-white/5">
                <tr>
                  <th className="pb-4 font-medium px-4">Date</th>
                  <th className="pb-4 font-medium px-4">Merchant</th>
                  <th className="pb-4 font-medium px-4">Category</th>
                  <th className="pb-4 font-medium px-4 text-center">Items</th>
                  <th className="pb-4 font-medium px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-[#94A3B8]">Oct 24, 2023</td>
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Plane size={16} className="text-blue-400" /></div>
                    <span className="font-medium text-white">Lufthansa Global</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase rounded-md">Travel</span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#94A3B8]">03</td>
                  <td className="py-4 px-4 text-right text-cyan-400 font-medium">$2,450.00</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-[#94A3B8]">Oct 23, 2023</td>
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><Utensils size={16} className="text-purple-400" /></div>
                    <span className="font-medium text-white">Le Bernardin</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase rounded-md">Lifestyle</span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#94A3B8]">12</td>
                  <td className="py-4 px-4 text-right text-cyan-400 font-medium">$1,520.50</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-[#94A3B8]">Oct 21, 2023</td>
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg"><Cloud size={16} className="text-orange-400" /></div>
                    <span className="font-medium text-white">AWS Infrastructure</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-[11px] font-bold uppercase rounded-md">Operations</span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#94A3B8]">01</td>
                  <td className="py-4 px-4 text-right text-cyan-400 font-medium">$5,820.00</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-[#94A3B8]">Oct 18, 2023</td>
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><Apple size={16} className="text-purple-400" /></div>
                    <span className="font-medium text-white">Apple Store</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase rounded-md">Lifestyle</span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#94A3B8]">—</td>
                  <td className="py-4 px-4 text-right text-cyan-400 font-medium">$3,454.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Floating Budget Alert */}
      <div className="fixed bottom-8 right-8 max-w-sm bg-slate-800/80 backdrop-blur-2xl border border-white/10 border-l-4 border-l-orange-500 rounded-xl p-5 shadow-2xl z-50">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-orange-500/20 rounded-full shrink-0">
            <Sparkles className="text-orange-400" size={16} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Budget Alert</h4>
            <p className="text-[#94A3B8] text-xs leading-relaxed mb-3">You've reached 85% of your entertainment budget for October. Consider pausing luxury spends.</p>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <button className="text-cyan-400 hover:text-cyan-300">Adjust Limit</button>
              <button className="text-[#94A3B8] hover:text-white">Dismiss</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}