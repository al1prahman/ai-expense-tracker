"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState<any>(null);

  // Menyimpan file yang dipilih user
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Mengirim file ke Laravel
  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file struk terlebih dahulu!");
      return;
    }

    setLoading(true);
    setExpenseData(null);

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      // Menembak ke API Laravel (Pastikan port Laravel-mu 8001)
      const response = await axios.post("http://127.0.0.1:8001/api/expenses/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      // Menyimpan hasil balasan ke dalam state
      setExpenseData(response.data.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Terjadi kesalahan saat memproses struk. Cek console log.");
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
            onChange={handleFileChange}
            className="mb-6 w-full max-w-xs text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          <br />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {loading ? "AI Sedang Membaca Struk... ⏳" : "Upload & Ekstrak Data ✨"}
          </button>
        </div>

        {/* Area Hasil */}
        {expenseData && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              ✅ Ekstrak Berhasil Disimpan!
            </h2>
            <div className="space-y-3 text-gray-700 text-lg">
              <p className="flex justify-between border-b border-green-200 pb-2">
                <span className="text-gray-500">Kategori</span>
                <span className="font-semibold">{expenseData.category}</span>
              </p>
              <p className="flex justify-between border-b border-green-200 pb-2">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-semibold">{expenseData.date}</span>
              </p>
              <p className="flex justify-between border-b border-green-200 pb-2">
                <span className="text-gray-500">Total Harga</span>
                <span className="font-bold text-green-700">Rp {expenseData.total.toLocaleString("id-ID")}</span>
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Daftar Barang:</h3>
                <ul className="space-y-2 bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                  {expenseData.items.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between text-base">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">Rp {item.price.toLocaleString("id-ID")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}