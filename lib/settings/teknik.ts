import type { L } from "@/lib/l10n";

// Teknik ayarlar: panelden düzenlenir, site_settings("teknik") altında saklanır.

export type TechnicalSettings = {
  // <head> içine eklenecek ham kod (Search Console doğrulaması, analytics vb.)
  headCode: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  // Formdan gelen e-postaların alıcıları (virgülle ayrılır)
  mailTo: string;
  // Yüklenen favicon yolu, null → varsayılan ikon
  favicon: string | null;
  seo: {
    title: L;
    description: L;
  };
  // true → arama motorlarına kapalı: noindex meta + robots.txt engeli (demo yayını için)
  noindex: boolean;
  // Sitemap'e eklenecek sabit yollar (ürün ve blog sayfaları otomatik eklenir)
  sitemap: string[];
};

export const defaultTechnicalSettings: TechnicalSettings = {
  headCode: "",
  smtp: { host: "", port: 587, user: "", pass: "", from: "" },
  mailTo: "",
  favicon: null,
  noindex: false,
  seo: {
    title: {
      tr: "Kraftora | Ambalajda Doğal Güç",
      en: "Kraftora | Natural Strength in Packaging",
    },
    description: {
      tr: "Kraftora: pizza kutusu, hamburger kutusu, kraft çanta ve e-ticaret kutusu gibi %100 geri dönüştürülebilir, markanıza özel baskılı kraft ambalaj çözümleri.",
      en: "Kraftora: custom-printed, 100% recyclable kraft packaging — pizza boxes, burger boxes, paper bags, e-commerce boxes and more, tailored to your brand.",
    },
  },
  sitemap: [
    "/",
    "/hakkimizda",
    "/urunler",
    "/galeri",
    "/blog",
    "/iletisim",
    "/en",
    "/en/about-us",
    "/en/products",
    "/en/gallery",
    "/en/blog",
    "/en/contact",
  ],
};
