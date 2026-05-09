'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/context/SettingsContext';
import { Cloud, Camera, Image as ImageIcon, FileText, ArrowRight, Lock, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { t } = useSettings();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return setError("Silakan pilih file terlebih dahulu.");
    setLoading(true); setError(null);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const response = await axios.post("http://127.0.0.1:8001/api/expenses/extract", formData);
      localStorage.setItem('pendingExpense', JSON.stringify(response.data.data));
      router.push('/validation');
    } catch (err: any) {
      setError("Gagal memproses struk. Pastikan gambar jelas.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors">
      <Navbar title={t('uploadCenter')} />
      <main className="max-w-3xl mx-auto mt-8 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">{t('expenseIntelligence')}</h1>
          <p className="text-slate-500 dark:text-[#94A3B8]">{t('uploadDesc')}</p>
        </div>

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />

        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-md dark:shadow-2xl transition-colors">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#090E17]/30 mb-6 transition-colors">
            <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center mb-4">
              <Cloud className="text-cyan-600 dark:text-cyan-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('dropFilesHere')}</h3>
            <p className="text-slate-500 dark:text-[#94A3B8] text-sm mb-6">{t('supportedFiles')}</p>
            
            <div className="flex space-x-4">
              <button onClick={() => cameraInputRef.current?.click()} className="flex items-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[10px] hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                <Camera size={16} /><span>{t('cameraCapture')}</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[10px] hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                <ImageIcon size={16} /><span>{t('galleryUpload')}</span>
              </button>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white dark:bg-[#090E17] rounded-lg border border-slate-200 dark:border-transparent">
                  <FileText className="text-slate-400 dark:text-slate-300" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-slate-500 dark:text-[#94A3B8] text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[11px] font-bold uppercase rounded-md border border-green-200 dark:border-green-500/20">
                {t('fileReady')}
              </span>
            </div>
          )}

          <button onClick={handleExtract} disabled={loading || !file} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-[10px] py-4 shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity mb-4">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>{t('scanReceipt')}</span>}
            {!loading && <ArrowRight size={18} />}
          </button>
          
          {loading && <p className="text-center text-slate-500 dark:text-[#94A3B8] text-xs animate-pulse">{t('analyzing')}</p>}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400 dark:text-slate-600">
          <Lock size={14} /><span className="text-xs">{t('enterpriseSecurity')}</span>
        </div>
      </main>
    </div>
  );
}