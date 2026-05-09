import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SettingsProvider } from "@/context/SettingsContext";

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
    <html lang="en" suppressHydrationWarning >
      <body className={inter.className}>
        {/* Bungkus seluruh aplikasi dengan SettingsProvider */}
        <SettingsProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}