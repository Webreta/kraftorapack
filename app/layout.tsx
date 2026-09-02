import type { Metadata } from "next";
import { headers } from "next/headers";
import { Nunito_Sans } from "next/font/google";
import { getTechnicalSettings } from "@/lib/data/settings";
import { isLang, t, type Lang } from "@/lib/l10n";
import { HeadCode } from "@/components/site/HeadCode";
import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-sans",
});

async function currentLang(): Promise<Lang> {
  const h = await headers();
  const lang = h.get("x-lang");
  return isLang(lang) ? lang : "tr";
}

// Site başlığı, açıklaması ve favicon panelden (Teknik) yönetilir
export async function generateMetadata(): Promise<Metadata> {
  const [technical, lang] = await Promise.all([getTechnicalSettings(), currentLang()]);
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    metadataBase: new URL(base),
    title: {
      default: t(technical.seo.title, lang),
      template: "%s | Kraftora",
    },
    description: t(technical.seo.description, lang),
    ...(technical.favicon ? { icons: { icon: technical.favicon } } : {}),
    // Panelden "indekslemeye kapat" işaretliyse tüm sayfalara noindex eklenir
    ...(technical.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [technical, lang] = await Promise.all([getTechnicalSettings(), currentLang()]);

  return (
    <html lang={lang} className={nunito.variable}>
      <body>
        <HeadCode code={technical.headCode} />
        {children}
      </body>
    </html>
  );
}
