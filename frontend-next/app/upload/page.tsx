import Navbar from '@/components/Navbar';
import { Cloud, Camera, Image as ImageIcon, FileText, Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title="" />
      
      <main className="max-w-3xl mx-auto mt-8 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Expense Intelligence</h1>
          <p className="text-[#94A3B8]">Upload your financial documents for instant AI verification<br/>and portfolio allocation.</p>
        </div>

        {/* Main Glass Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          {/* Dropzone */}
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center bg-[#090E17]/30 mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <Cloud className="text-cyan-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop your files here</h3>
            <p className="text-[#94A3B8] text-sm mb-6">PDF, PNG, and JPEG supported (Max 25MB)</p>
            
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-[10px] hover:bg-white/10 transition-colors text-sm font-medium">
                <Camera size={16} />
                <span>Camera Capture</span>
              </button>
              <button className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-[10px] hover:bg-white/10 transition-colors text-sm font-medium">
                <ImageIcon size={16} />
                <span>Gallery Upload</span>
              </button>
            </div>
          </div>

          {/* Uploaded File Row */}
          <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-white/10 rounded-xl mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#090E17] rounded-lg">
                <FileText className="text-slate-300" size={24} />
              </div>
              <div>
                <p className="font-semibold text-sm">Receipt_Q4_2024.pdf</p>
                <p className="text-[#94A3B8] text-xs">1.2 MB</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[11px] font-bold uppercase rounded-md border border-green-500/20">
              File Ready
            </span>
          </div>

          {/* AI Insight */}
          <div className="flex items-start space-x-4 p-5 bg-blue-500/10 border border-cyan-500/20 rounded-xl mb-6">
            <Sparkles className="text-cyan-400 mt-0.5 shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-cyan-50 text-sm mb-1">AI Insight Detected</h4>
              <p className="text-[#94A3B8] text-sm">This document matches your "Corporate Travel" category with 88% confidence.</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] py-4 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 transition-opacity mb-4">
            <span>Scan Receipt</span>
            <ArrowRight size={18} />
          </button>
          
          <p className="text-center text-[#94A3B8] text-xs animate-pulse">Analyzing Market Trends...</p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-600">
          <Lock size={14} />
          <span className="text-xs">Enterprise-grade AES-256 Encryption active</span>
        </div>
      </main>
    </div>
  );
}