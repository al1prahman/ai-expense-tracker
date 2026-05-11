import type { Metadata } from "next";
import { Inter, Figtree } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SettingsProvider } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AetherFinance - AI Wealth Manager",
  description: "Enterprise-grade AI Expense Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SettingsProvider>
          {/* 2. BUNGKUS DENGAN FLEX AGAR SIDEBAR BERSAMPINGAN DENGAN KONTEN */}
          <div className="flex min-h-screen bg-slate-50 dark:bg-[#090E17] text-slate-900 dark:text-[#F8FAFC]">
            <Sidebar /> 
            <div className="flex-1 flex flex-col w-full ml-[220px]">
              {children}
            </div>
          </div>
        </SettingsProvider>
        
        {/* TOASTER SONNER TETAP DI SINI */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}