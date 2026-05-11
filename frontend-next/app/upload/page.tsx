'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/context/SettingsContext';
import { Cloud, Camera, Image as ImageIcon, ArrowRight, Lock, Loader2, X } from 'lucide-react';

// IMPORT KOMPONEN SHADCN
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const router = useRouter();
  const { t } = useSettings();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
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
      setError("Gagal memproses struk. Pastikan koneksi ke AI Service aktif.");
      setLoading(false);
    }
  };

  const glassCardClass = "bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-2xl transition-all duration-300";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors relative">
      <Navbar title={t('uploadCenter')} />

      <main className="max-w-2xl mx-auto mt-12 px-6 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 text-slate-800 dark:text-white">{t('expenseIntelligence')}</h1>
          <p className="text-slate-500 dark:text-[#94A3B8]">{t('uploadDesc')}</p>
        </div>

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />

        <Card className={glassCardClass}>
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-xl">{file ? t('fileReady') : "Upload Dokumen"}</CardTitle>
            <CardDescription>
              {file ? file.name : "Pilih sumber gambar untuk dipindai oleh AI"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-4">
            {!preview ? (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#090E17]/30 mb-2 transition-colors group hover:border-cyan-500/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5">
                <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cloud className="text-cyan-600 dark:text-cyan-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">{t('dropFilesHere')}</h3>
                <p className="text-slate-500 dark:text-[#94A3B8] text-xs mb-8">{t('supportedFiles')}</p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  {/* SHADCN BUTTON OUTLINE */}
                  <Button
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-11 border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Camera size={16} className="mr-2 text-blue-600 dark:text-cyan-400" />
                    {t('cameraCapture')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11 border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <ImageIcon size={16} className="mr-2 text-blue-600 dark:text-cyan-400" />
                    {t('galleryUpload')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] sm:aspect-video mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/40 shadow-inner group">
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 right-4 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 shadow-lg backdrop-blur-md opacity-80 hover:opacity-100 transition-all scale-95 hover:scale-100"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-center">
                <p className="text-red-600 dark:text-red-400 text-xs font-semibold">{error}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 py-6 rounded-b-xl flex-col gap-3">
            {/* SHADCN PRIMARY BUTTON DENGAN GRADASI */}
            <Button
              onClick={handleExtract}
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold h-14 text-lg rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {t('analyzing')}
                </>
              ) : (
                <>
                  {t('scanReceipt')} <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center space-x-2 text-slate-400 dark:text-slate-500 mt-2">
              <Lock size={12} /><span className="text-[10px] uppercase font-bold tracking-wider">{t('enterpriseSecurity')}</span>
            </div>
          </CardFooter>
        </Card>

      </main>
    </div>
  );
}