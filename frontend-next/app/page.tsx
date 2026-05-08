"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // State untuk "Human-in-the-Loop" (Data yang sedang diedit)
  const [editData, setEditData] = useState<any>(null);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8001/api/expenses");
      setHistory(response.data);
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  // 1. Fungsi hanya untuk EKSTRAK (Belum simpan ke DB)
  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setEditData(null);
    setError(null);
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const response = await axios.post("http://127.0.0.1:8001/api/expenses/extract", formData);
      // Masukkan hasil AI ke state editData agar bisa diedit di form
      setEditData(response.data.data);
    } catch (err: any) {
      setError("Gagal membaca struk. Pastikan gambar jelas atau format file benar.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi untuk SIMPAN ke Database (Setelah divalidasi manusia)
  const handleSaveToDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://127.0.0.1:8001/api/expenses", editData);
      
      setIsSuccess(true);
      setEditData(null); // Tutup form setelah simpan
      fetchHistory(); // Update dashboard
      
      // Hilangkan pesan sukses setelah 3 detik
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(err.response.data.error);
      } else {
        setError("Gagal menyimpan ke database.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          💸 AI Expense Tracker
        </h1>

        {/* Area Upload */}
        <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-8 text-center transition-all hover:bg-blue-50">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="mb-6 w-full max-w-xs text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          <br />
          <button
            onClick={handleExtract} // PERUBAHAN: Sekarang memanggil handleExtract
            disabled={loading || !file}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {loading && !editData ? "AI Sedang Membaca Struk... ⏳" : "Upload & Ekstrak Data ✨"}
          </button>
        </div>

        {/* --- TAMPILAN ERROR (MERAH) --- */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-red-800">Gagal Memproses Struk</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* --- NOTIFIKASI SUKSES --- */}
        {isSuccess && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl text-center font-bold animate-bounce shadow-sm">
            🎉 Data tervalidasi berhasil disimpan ke Database!
          </div>
        )}

        {/* --- FORM VALIDASI (HUMAN-IN-THE-LOOP) --- */}
        {editData && (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
              🔍 Validasi Data AI
            </h2>
            <p className="text-xs text-amber-700 mb-6 bg-amber-100 p-2 rounded">
              AI telah membaca strukmu. Silakan periksa kembali dan edit jika ada kesalahan sebelum disimpan.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-900 uppercase mb-1">Kategori</label>
                <select 
                  value={editData.category}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                  className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-gray-800"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    value={editData.date}
                    onChange={(e) => setEditData({...editData, date: e.target.value})}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase mb-1">Total (Rp)</label>
                  <input 
                    type="number" 
                    value={editData.total}
                    onChange={(e) => setEditData({...editData, total: parseInt(e.target.value) || 0})}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg font-bold text-green-700"
                  />
                </div>
              </div>

              {/* Tampilkan daftar barang sebagai referensi (readonly) */}
              <div className="mt-4 pt-4 border-t border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2 text-xs uppercase tracking-wider">Daftar Barang Terdeteksi:</h3>
                <ul className="space-y-1 text-sm bg-white/50 p-3 rounded border border-amber-100">
                  {editData.items && editData.items.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between text-gray-700">
                      <span>{item.name}</span>
                      <span className="font-medium">Rp {item.price.toLocaleString("id-ID")}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleSaveToDatabase}
                disabled={loading}
                className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:bg-green-400 transition-all shadow-lg shadow-green-200 flex justify-center items-center gap-2"
              >
                {loading ? "Menyimpan... ⏳" : "Konfirmasi & Simpan ke Database ✅"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- AREA DASHBOARD & RIWAYAT --- */}
      <div className="mt-12 border-t border-gray-200 pt-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard Pengeluaran</h2>
        
        {/* Kartu Total Pengeluaran */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Total Keseluruhan</p>
          <h3 className="text-4xl font-extrabold">
            Rp {history.reduce((sum, item) => sum + item.total, 0).toLocaleString("id-ID")}
          </h3>
        </div>

        {/* Tabel Riwayat */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">Riwayat Struk Terakhir</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada data pengeluaran.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {history.map((item) => (
                <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{item.category}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Rp {item.total.toLocaleString("id-ID")}</p>
                    <p className="text-xs text-gray-400">{item.items?.length || 0} barang</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}