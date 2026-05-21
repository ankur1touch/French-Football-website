import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/home/BreakingTicker";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LocaleProvider>
      <TopBar />
      <Header />
      <BreakingTicker />
      <main className="flex-1">{children}</main>
      <Footer />
    </LocaleProvider>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (locale === "en") {
    return {
      title: "LeFootFR — French Football Portal",
      description: "News, live scores, World Cup standings, and transfers.",
    };
  }
  return {
    title: "LeFootFR — Portail Football Français",
    description:
      "Actualités, résultats en direct, classements et transferts du football français et africain.",
  };
}
