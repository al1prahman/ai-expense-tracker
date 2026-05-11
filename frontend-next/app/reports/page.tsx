'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import { Tag, ChevronDown, Receipt, ShoppingBag, Filter, CalendarIcon, Utensils, Car, Shirt, HeartPulse, Leaf } from 'lucide-react';
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

// IMPORT KOMPONEN SHADCN
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ReportsPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { t } = useSettings();

  // FUNGSI IKON DINAMIS
  const getCategoryIcon = (cat: string, className: string, iconSize: number = 16) => {
    switch (cat) {
      case "Makanan": return <Utensils className={className} size={iconSize} />;
      case "Transportasi": return <Car className={className} size={iconSize} />;
      case "Pakaian": return <Shirt className={className} size={iconSize} />;
      case "Kesehatan": return <HeartPulse className={className} size={iconSize} />;
      default: return <Leaf className={className} size={iconSize} />;
    }
  };

  // STATE FILTER
  const [date, setDate] = useState<DateRange | undefined>();
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // STATE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await axios.get("http://127.0.0.1:8001/api/expenses", {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        setExpenses(response.data);
        setFilteredExpenses(response.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // LOGIKA FILTER
  useEffect(() => {
    let result = expenses;
    if (categoryFilter !== 'Semua') result = result.filter(item => item.category === categoryFilter);
    
    if (date?.from) {
      result = result.filter(item => new Date(item.date) >= date.from!);
    }
    if (date?.to) {
      result = result.filter(item => new Date(item.date) <= date.to!);
    }
    
    setFilteredExpenses(result);
    setCurrentPage(1); // Reset ke halaman 1 setiap kali filter berubah
  }, [date, categoryFilter, expenses]);

  // LOGIKA PAGINATION (Menghitung Total Halaman & Memotong Array Data)
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // LOGIKA NOMOR HALAMAN DINAMIS (Munculkan ... jika halaman lebih dari 5)
  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 'ellipsis', totalPages];
    if (currentPage >= totalPages - 2) return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const glassCardClass = "bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-2xl transition-all duration-300 overflow-hidden";
  const reportCategories = ["Semua", "Makanan", "Transportasi", "Pakaian", "Kesehatan", "Lainnya"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC] font-sans pb-12 transition-colors duration-300 relative">
      <Navbar title={t('reports')} />
      
      <main className="px-8 mt-10 max-w-6xl mx-auto space-y-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white transition-colors">{t('detailedReports')}</h1>
          <p className="text-slate-500 dark:text-[#94A3B8]">{t('filterReview')}</p>
        </div>

        {/* FILTER BOX */}
        <Card className={glassCardClass}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              
              <div className="flex-1 w-full flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase flex items-center gap-2">
                  <CalendarIcon size={14} /> Rentang Waktu
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal h-[42px] rounded-lg border-slate-200 dark:border-white/10 dark:bg-[#0F172A]/60 hover:bg-slate-100 dark:hover:bg-white/5 ${!date && "text-slate-500"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-cyan-500" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pilih rentang tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 dark:border-white/10 dark:bg-slate-800 shadow-2xl rounded-xl" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className="dark:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 w-full flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase flex items-center gap-2">
                  <Tag size={14} /> {t('category')}
                </label>
                <Combobox 
                  items={reportCategories} 
                  value={categoryFilter} 
                  onValueChange={(val) => setCategoryFilter(val || "Semua")}
                >
                  <ComboboxTrigger 
                    render={
                      <Button 
                        variant="outline" 
                        className="w-full justify-between font-normal h-[42px] rounded-lg border-slate-200 dark:border-white/10 dark:bg-[#0F172A]/60 hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        <ComboboxValue />
                      </Button>
                    } 
                  />
                  <ComboboxContent className="dark:bg-slate-800 border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50">
                    <ComboboxInput showTrigger={false} placeholder="Cari..." className="border-b dark:border-white/10" />
                    <ComboboxEmpty className="py-6 text-center text-sm text-slate-500">Tidak ada kategori.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-white/10">
                          {item === "Semua" ? "Semua Kategori" : item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => {setDate(undefined); setCategoryFilter('Semua');}}
                className="h-[42px] px-6 rounded-lg border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                <Filter size={16} className="mr-2" />
                {t('reset')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABLE BOX */}
        <Card className={glassCardClass}>
          <CardHeader className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Receipt size={20} className="text-cyan-600 dark:text-cyan-400" />
              {t('transactionHistory')}
            </CardTitle>
            <span className="text-sm font-medium text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-500/10 px-4 py-1.5 rounded-full border border-blue-100 dark:border-cyan-500/20">
              {filteredExpenses.length} Total Data
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-slate-400 animate-pulse">{t('loadingReports')}</div>
              ) : filteredExpenses.length === 0 ? (
                <div className="p-12 text-center text-slate-500">{t('noTransactionFilter')}</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 dark:text-[#94A3B8] text-xs uppercase bg-slate-50/50 dark:bg-[#0F172A]/40 border-b border-slate-200 dark:border-white/5">
                    <tr>
                      <th className="py-4 px-6 font-bold">{t('date')}</th>
                      <th className="py-4 px-6 font-bold">{t('category')}</th>
                      <th className="py-4 px-6 font-bold text-center">{t('itemsCount')}</th>
                      <th className="py-4 px-6 font-bold text-right">{t('total')} (Rp)</th>
                      <th className="py-4 px-6 font-bold text-center">{t('detail')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {/* LOOPING MENGGUNAKAN paginatedExpenses BUKAN LAGI filteredExpenses */}
                    {paginatedExpenses.map((expense) => (
                      <React.Fragment key={expense.id}>
                        <tr 
                          onClick={() => toggleExpand(expense.id)}
                          className={`hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${expandedId === expense.id ? 'bg-slate-50 dark:bg-white/5' : ''}`}
                        >
                          <td className="py-4 px-6 font-medium">{expense.date}</td>
                          <td className="py-4 px-6 flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg shadow-sm">
                              {getCategoryIcon(expense.category, "text-blue-600 dark:text-blue-400")}
                            </div>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase rounded-md border border-blue-200 dark:border-blue-500/10">
                              {expense.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">{expense.items?.length || 0}</td>
                          <td className="py-4 px-6 text-right font-black text-blue-600 dark:text-cyan-400">Rp {expense.total.toLocaleString("id-ID")}</td>
                          <td className="py-4 px-6 text-center">
                            {/* ANIMASI ROTASI CHEVRON YANG SANGAT MULUS */}
                            <ChevronDown 
                              size={20} 
                              className={`mx-auto text-slate-400 transition-transform duration-300 ease-in-out ${expandedId === expense.id ? '-rotate-180 text-cyan-500' : ''}`} 
                            />
                          </td>
                        </tr>
                        {expandedId === expense.id && (
                          <tr className="bg-slate-50/50 dark:bg-[#050A10]/50 shadow-inner">
                            <td colSpan={5} className="p-0 border-t-0">
                              {/* ANIMASI DROPDOWN MENGGUNAKAN TAILWIND ANIMATE */}
                              <div className="py-6 px-8 animate-in slide-in-from-top-4 fade-in duration-300 ease-out">
                                <div className="flex items-start gap-4">
                                  <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0 shadow-sm">
                                    {getCategoryIcon(expense.category, "text-slate-500", 20)}
                                  </div>
                                  <div className="w-full">
                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-500">{t('itemDetails')}</h4>
                                    <ul className="space-y-3">
                                      {expense.items && expense.items.map((item: any, idx: number) => (
                                        <li key={idx} className="flex justify-between items-center text-sm border-b border-slate-200/50 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                                          <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                                          <span className="font-bold text-slate-900 dark:text-white">Rp {item.price.toLocaleString("id-ID")}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* PAGINATION COMPONENT SHADCN */}
            {totalPages > 1 && (
              <div className="py-4 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0F172A]/20">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {getVisiblePages().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink 
                            href="#" 
                            isActive={currentPage === page}
                            onClick={(e) => { e.preventDefault(); setCurrentPage(page as number); }}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}