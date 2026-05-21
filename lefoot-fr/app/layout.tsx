import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/store/StoreProvider";
import LocaleHtmlLang from "@/components/layout/LocaleHtmlLang";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeFootFR — Portail Football Français",
  description:
    "Actualités, résultats en direct, classements et transferts du football français et africain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface">
        <StoreProvider>
          <LocaleHtmlLang />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
