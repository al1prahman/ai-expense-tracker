import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
      <body className={inter.className}>
        {/* Kita bungkus seluruh aplikasi dengan ClientLayout yang baru kita buat */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}