'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Cloud, Camera, Image as ImageIcon, FileText, Sparkles, ArrowRight, Lock, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Referensi untuk input file tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Silakan pilih file terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const response = await axios.post("http://127.0.0.1:8001/api/expenses/extract", formData);
      
      // Simpan hasil AI ke penyimpanan lokal browser sementara
      localStorage.setItem('pendingExpense', JSON.stringify(response.data.data));
      
      // Pindah ke halaman validasi
      router.push('/validation');
    } catch (err: any) {
      setError("Gagal memproses struk. Pastikan gambar jelas.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F8FAFC] font-sans pb-12">
      <Navbar title="Upload Center" />
      
      <main className="max-w-3xl mx-auto mt-8 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Expense Intelligence</h1>
          <p className="text-[#94A3B8]">Upload your financial documents for instant AI verification<br/>and portfolio allocation.</p>
        </div>

        {/* Input File Tersembunyi */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />

        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          {/* Dropzone */}
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center bg-[#090E17]/30 mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <Cloud className="text-cyan-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop your files here</h3>
            <p className="text-[#94A3B8] text-sm mb-6">PDF, PNG, and JPEG supported (Max 25MB)</p>
            
            <div className="flex space-x-4">
              <button onClick={() => cameraInputRef.current?.click()} className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-[10px] hover:bg-white/10 transition-colors text-sm font-medium">
                <Camera size={16} />
                <span>Camera Capture</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-[10px] hover:bg-white/10 transition-colors text-sm font-medium">
                <ImageIcon size={16} />
                <span>Gallery Upload</span>
              </button>
            </div>
          </div>

          {/* Indikator File */}
          {file && (
            <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-white/10 rounded-xl mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#090E17] rounded-lg">
                  <FileText className="text-slate-300" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[#94A3B8] text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[11px] font-bold uppercase rounded-md border border-green-500/20">
                File Ready
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Tombol Ekstrak */}
          <button 
            onClick={handleExtract}
            disabled={loading || !file}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-semibold rounded-[10px] py-4 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 disabled:opacity-50 transition-opacity mb-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Scan Receipt</span>}
            {!loading && <ArrowRight size={18} />}
          </button>
          
          {loading && <p className="text-center text-[#94A3B8] text-xs animate-pulse">Analyzing Transaction Data...</p>}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-600">
          <Lock size={14} />
          <span className="text-xs">Enterprise-grade AES-256 Encryption active</span>
        </div>
      </main>
    </div>
  );
}