import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import Script from "next/script";
import StoreProvider from "@/store/StoreProvider";
import LocaleHtmlLang from "@/components/layout/LocaleHtmlLang";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
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
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-surface font-sans">
        <StoreProvider>
          <LocaleHtmlLang />
          {children}
        </StoreProvider>
        {/* Google Translate init — hidden widget, controlled via googtrans cookie */}
        <Script id="gt-init" strategy="afterInteractive">{`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement(
              { pageLanguage: 'fr', autoDisplay: false },
              'google_translate_element'
            );
          }
        `}</Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
