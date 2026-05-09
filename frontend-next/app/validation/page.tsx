import Navbar from '@/components/Navbar';
import { AlertTriangle, Store, Calendar, DollarSign, Leaf, Search, MoreHorizontal, Check, Sparkles } from 'lucide-react';

export default function ValidationPage() {
  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title="Review AI Results" />
      
      <main className="px-8 mt-2 max-w-7xl mx-auto">
        <p className="text-[#94A3B8] mb-8">Verify extracted data from your recent document upload.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Table */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Warning Box */}
            <div className="flex items-start space-x-4 p-5 bg-[#FBBF24]/10 border border-[#FBBF24]/20 border-l-4 border-l-[#FBBF24] rounded-xl">
              <AlertTriangle className="text-[#FBBF24] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[#FBBF24] text-sm mb-1">Review Required</h4>
                <p className="text-[#94A3B8] text-sm leading-relaxed">The AI identified high-confidence data, but manual verification is recommended for merchant categorization and tax alignment.</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Merchant Name</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                    <input type="text" defaultValue="Stellar Coffee Roasters" className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Transaction Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                    <input type="text" defaultValue="11/24/2023" className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Total Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                    <input type="text" defaultValue="$1,240.50" className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Category</label>
                  <div className="relative flex items-center">
                    <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                    <select className="w-full bg-[#0F172A]/60 border border-white/10 text-white rounded-[10px] pl-10 pr-10 py-2.5 text-sm appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400">
                      <option>Health & Wellness</option>
                    </select>
                    <MoreHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                  </div>
                </div>
              </div>

              <h4 className="text-[#94A3B8] text-xs uppercase font-bold tracking-wider mb-4">Extracted Line Items</h4>
              <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#090E17]/40 mb-8">
                <table className="w-full text-left text-sm">
                  <thead className="text-[#94A3B8] text-xs uppercase border-b border-white/5 bg-[#0F172A]/40">
                    <tr>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium w-16">Qty</th>
                      <th className="px-4 py-3 font-medium w-24">Price</th>
                      <th className="px-4 py-3 font-medium w-24 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">Organic Arabica Beans (5kg)</td>
                      <td className="px-4 py-3 text-[#94A3B8]">2</td>
                      <td className="px-4 py-3 text-[#94A3B8]">$450.00</td>
                      <td className="px-4 py-3 text-right text-cyan-400">$900.00</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">Premium Delivery Service</td>
                      <td className="px-4 py-3 text-[#94A3B8]">1</td>
                      <td className="px-4 py-3 text-[#94A3B8]">$240.50</td>
                      <td className="px-4 py-3 text-right text-cyan-400">$240.50</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">Sustainability Tax</td>
                      <td className="px-4 py-3 text-[#94A3B8]">1</td>
                      <td className="px-4 py-3 text-[#94A3B8]">$100.00</td>
                      <td className="px-4 py-3 text-right text-cyan-400">$100.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end space-x-4 border-t border-white/10 pt-6">
                <button className="px-6 py-2.5 bg-transparent border border-white/15 text-slate-300 rounded-[10px] hover:bg-white/5 transition-colors text-sm font-medium">
                  Discard
                </button>
                <button className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity text-sm">
                  <Check size={16} />
                  <span>Confirm and Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Alerts & Preview */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Duplicate Detected Card */}
            <div className="bg-[#EF4444]/10 backdrop-blur-xl border border-[#EF4444]/30 border-l-4 border-l-[#EF4444] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="text-[#EF4444]" size={20} />
                <h3 className="font-bold text-[#EF4444]">Duplicate Detected</h3>
              </div>
              <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                A transaction with the same amount and date from <strong className="text-white">Stellar Coffee</strong> already exists in your November report.
              </p>
              <button className="w-full px-4 py-2 border border-[#EF4444]/50 text-[#EF4444] rounded-[10px] hover:bg-[#EF4444]/10 transition-colors text-sm font-medium">
                View Potential Duplicate
              </button>
            </div>

            {/* Source Document */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold">Source Document</h4>
                <button className="text-cyan-400 hover:text-cyan-300"><Search size={16} /></button>
              </div>
              <div className="w-full h-64 bg-[#050A10] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative group">
                <img src="/api/placeholder/300/400" alt="Receipt Preview" className="opacity-50 object-cover w-full h-full group-hover:opacity-70 transition-opacity" />
              </div>
            </div>

            {/* Confidence Metrics */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="text-cyan-400" size={16} />
                <h4 className="text-sm font-semibold text-cyan-50">AI Extraction Confidence</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#94A3B8]">Merchant Accuracy</span>
                    <span className="text-cyan-400 font-bold">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[88%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#94A3B8]">Tax Calculation</span>
                    <span className="text-cyan-400 font-bold">82%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[82%] rounded-full"></div>
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