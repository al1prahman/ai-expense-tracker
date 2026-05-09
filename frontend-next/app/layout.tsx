import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
    <html lang="en">
      <body className={`${inter.className} bg-[#090E17] text-white flex`}>
        {/* Sidebar akan selalu diam di kiri */}
        <Sidebar />
        
        {/* Area konten utama akan mengisi sisa layar di sebelah kanan Sidebar */}
        <div className="flex-1 ml-[220px] min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}