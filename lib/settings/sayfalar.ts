import type { L } from "@/lib/l10n";

// Ürünler, Galeri ve Blog sayfalarının başlık/alt başlık metinleri: site_settings("sayfalar")

export type PagesSettings = {
  products: { title: L; subtitle: L };
  gallery: { title: L; subtitle: L; ctaTitle: L; ctaText: L };
  blog: { title: L; subtitle: L };
};

export const defaultPagesSettings: PagesSettings = {
  products: {
    title: { tr: "Ürünlerimiz", en: "Our Products" },
    subtitle: {
      tr: "Ürününüzü korumak için tasarlanan kraft ambalaj çözümlerimizin tamamını keşfedin",
      en: "Explore our full range of kraft packaging solutions, designed to protect your product",
    },
  },
  gallery: {
    title: { tr: "Kraftora'nın İçinden", en: "Inside Kraftora" },
    subtitle: {
      tr: "Hassasiyetin sürdürülebilirlikle buluştuğu üretim tesisimizin perde arkasına bir bakış.",
      en: "A look behind the scenes at our production facility, where precision meets sustainability.",
    },
    ctaTitle: { tr: "Daha Fazlasını Görmek İster misiniz?", en: "Want to See More?" },
    ctaText: {
      tr: "Tesisimizde sanal bir tur planlamak ya da ambalaj projenizi görüşmek için bize ulaşın.",
      en: "Get in touch to schedule a virtual tour of our facility or discuss your packaging project.",
    },
  },
  blog: {
    title: { tr: "Blog", en: "Blog" },
    subtitle: {
      tr: "Sürdürülebilir ambalaj, malzeme seçimi, baskı teknikleri ve sektör trendleri hakkında içgörüler ve ipuçları; markanız ve gezegen için daha akıllı kararlar vermenize yardımcı oluyoruz.",
      en: "Insights and tips on sustainable packaging, material selection, printing techniques, and industry trends — helping you make smarter decisions for your brand and the planet.",
    },
  },
};
